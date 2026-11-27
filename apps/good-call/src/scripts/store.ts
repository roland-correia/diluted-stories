// The visitor's own record: their character, saved courses, habit plans, time
// spent, learning days and questions answered each day. Kept in this browser's localStorage only, under two
// keys, and listed on the Diluted Stories cookies page (src/data/storage.ts in the
// root of this repository). Nothing is sent anywhere.
//
// Points, streaks and achievements are not stored. They are worked out each time
// from the saved answers (progress.ts), the time spent and the learning days.

import { readProgress } from './progress';
import {
  achievements,
  POINTS,
  currentStreak,
  dayKey,
  defaultCharacter,
  longestStreak,
  type Character,
  type Facts,
} from '../lib/game';
import type { AccessoryId } from '../lib/courses';

const PROFILE_KEY = 'gc-profile';
const STATS_KEY = 'gc-stats';

/** Sent on `document` whenever the profile or the stats change, so headers and badges can redraw. */
export const PROFILE_EVENT = 'gc:profile';

export interface Profile {
  character: Character;
  /** True once the visitor has saved their character at least once. */
  customised: boolean;
  /** Course ids, most recently saved first. */
  saved: string[];
  /** Achievements already announced, so each is only celebrated once. */
  seen: string[];
  /** The course opened most recently, for "Continue learning". */
  lastCourse?: string;
  /** Habits planned at the end of modules (src/scripts/habits.ts), newest last. */
  plans: Plan[];
}

/** A habit the visitor planned to try: "When [cue], I'll try [name]." */
export interface Plan {
  /** The module it came from: `${set}/${topic}`. */
  key: string;
  name: string;
  cue: string;
  /** The day it was planned, YYYY-MM-DD. */
  made: string;
  /** How it went, once they have said: tried it, or not for them. */
  status?: 'done' | 'skipped';
  /** "Not yet": ask again after this day. */
  snoozed?: string;
}

export interface Stats {
  /** Total seconds spent actively on Good Call. */
  seconds: number;
  /** Seconds spent on each day, keyed YYYY-MM-DD. */
  days: Record<string, number>;
  /** Days on which at least one question was answered. */
  answeredDays: string[];
  /** How many questions were answered each day, keyed YYYY-MM-DD, for the daily goal. */
  counts: Record<string, number>;
}

const emptyProfile = (): Profile => ({
  character: { ...defaultCharacter, wearing: [] },
  customised: false,
  saved: [],
  seen: [],
  plans: [],
});

const emptyStats = (): Stats => ({ seconds: 0, days: {}, answeredDays: [], counts: {} });

function read<T extends object>(key: string, empty: () => T): T {
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? 'null');
    // Fill in anything added since this browser last saved, so older records keep working.
    return saved && typeof saved === 'object' ? { ...empty(), ...saved } : empty();
  } catch {
    return empty();
  }
}

function write(key: string, value: object) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private browsing can block storage. Everything still works for this visit.
  }
  document.dispatchEvent(new CustomEvent(PROFILE_EVENT));
}

export const readProfile = (): Profile => {
  const profile = read(PROFILE_KEY, emptyProfile);
  profile.character = { ...defaultCharacter, ...profile.character };
  return profile;
};
export const writeProfile = (profile: Profile) => write(PROFILE_KEY, profile);
export const readStats = (): Stats => read(STATS_KEY, emptyStats);
export const writeStats = (stats: Stats) => write(STATS_KEY, stats);

export function updateProfile(change: (profile: Profile) => void) {
  const profile = readProfile();
  change(profile);
  writeProfile(profile);
}

// ---------------------------------------------------------------- the catalogue

// Every course and its question ids, written into each page by
// src/components/Catalogue.astro so the scripts can work out completion and points.
export interface CatalogueCourse {
  id: string;
  name: string;
  path: string;
  ids: string[];
  unlock?: AccessoryId;
  charities: string[];
}

let catalogueCache: CatalogueCourse[] | undefined;

export function catalogue(): CatalogueCourse[] {
  if (catalogueCache) return catalogueCache;
  try {
    catalogueCache = JSON.parse(document.getElementById('gc-catalogue')?.textContent ?? '[]');
  } catch {
    catalogueCache = [];
  }
  return catalogueCache!;
}

// ---------------------------------------------------------------- what has been earned

export interface CourseState {
  course: CatalogueCourse;
  answered: number;
  total: number;
  good: number;
  complete: boolean;
}

export function courseStates(progress = readProgress()): CourseState[] {
  return catalogue().map((course) => {
    const answers = course.ids.map((id) => progress[id]).filter(Boolean);
    return {
      course,
      answered: answers.length,
      total: course.ids.length,
      good: answers.filter((answer) => answer.call === 'best').length,
      complete: answers.length === course.ids.length && course.ids.length > 0,
    };
  });
}

/** Days that count towards a streak: at least a minute spent, or a question answered. */
export function learningDays(stats = readStats()): Set<string> {
  const days = new Set(stats.answeredDays);
  for (const [day, seconds] of Object.entries(stats.days)) if (seconds >= 60) days.add(day);
  return days;
}

/** Every point earned: one amount per answer, a bonus for each finished course, and one for each habit tried. */
export function pointsEarned(progress = readProgress(), profile = readProfile()): number {
  let points = 0;
  for (const answer of Object.values(progress)) points += POINTS[answer.call];
  for (const state of courseStates(progress)) if (state.complete) points += POINTS.courseComplete;
  points += habitsDone(profile) * POINTS.followThrough;
  return points;
}

export const habitsDone = (profile = readProfile()) => profile.plans.filter((plan) => plan.status === 'done').length;

export function facts(): Facts {
  const progress = readProgress();
  const stats = readStats();
  const profile = readProfile();
  const states = courseStates(progress);
  const days = learningDays(stats);
  const answers = Object.values(progress);
  return {
    answered: answers.length,
    goodCalls: answers.filter((answer) => answer.call === 'best').length,
    coursesStarted: states.filter((state) => state.answered > 0).length,
    coursesCompleted: states.filter((state) => state.complete).length,
    seconds: stats.seconds,
    streak: currentStreak(days),
    bestStreak: longestStreak(days),
    points: pointsEarned(progress, profile),
    customised: profile.customised,
    habitsDone: habitsDone(profile),
  };
}

export function unlockedAchievements(f = facts()): Set<string> {
  return new Set(achievements.filter((a) => a.test(f)).map((a) => a.id));
}

/** Character items unlocked by finished courses. */
export function unlockedItems(states = courseStates()): Set<AccessoryId> {
  const items = new Set<AccessoryId>();
  for (const state of states) if (state.complete && state.course.unlock) items.add(state.course.unlock);
  return items;
}

/** Counts `count` new answers towards today: a learning day, and the daily goal. */
export function markAnsweredToday(count = 1) {
  const stats = readStats();
  const today = dayKey();
  if (!stats.answeredDays.includes(today)) stats.answeredDays.push(today);
  stats.counts[today] = (stats.counts[today] ?? 0) + count;
  writeStats(stats);
}
