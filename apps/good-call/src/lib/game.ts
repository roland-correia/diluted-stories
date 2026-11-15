// The rules of the game layer: character options, points, streaks and achievements.
// Shared by the pages (to list things) and by the browser scripts (to work out
// what each visitor has earned). Everything is worked out from what is saved in
// the visitor's own browser; nothing is sent anywhere.
import type { AccessoryId } from './courses';

// ---------------------------------------------------------------- character

export const skins = ['#f6d3b3', '#e8b48a', '#c98e5f', '#a26a42', '#7a4b2a', '#4e2f1a'] as const;
export const hairColours = ['#1f1611', '#4a2c17', '#8a5a2b', '#c9a15b', '#b5452b', '#9aa1a8'] as const;
export const hairStyles = ['short', 'long', 'curly', 'buzz', 'bun', 'waves'] as const;
export const tops = ['#005c4c', '#2f6690', '#9b2f52', '#b07a1f', '#5a3d8c', '#3d4a44'] as const;
export const backgrounds = ['#cfe8df', '#cddcf0', '#f3d9c6', '#e5d8f2', '#f0e6c4', '#d7dcd9'] as const;

// Clothes and features. None of these is tied to a gender: any character can wear
// anything, so everyone can make a character that looks like them.
export const outfits = ['tee', 'hoodie', 'shirt', 'dress'] as const;
export const bottoms = ['trousers', 'shorts', 'skirt'] as const;
export const bottomColours = ['#2b3a55', '#3d4a44', '#6b4a2b', '#1f1f24', '#8a8f98', '#9b2f52'] as const;
export const facialHair = ['none', 'stubble', 'moustache', 'beard'] as const;

// Extra backgrounds earned through achievements, not courses.
export const bonusBackgrounds = {
  gold: { colour: '#d9b44a', achievement: 'deep-learner' },
  racing: { colour: '#004225', achievement: 'week-strong' },
} as const;

export type HairStyle = (typeof hairStyles)[number];
export type Outfit = (typeof outfits)[number];
export type Bottom = (typeof bottoms)[number];
export type FacialHair = (typeof facialHair)[number];

export interface Character {
  name: string;
  skin: number;
  hair: HairStyle;
  hairColour: number;
  top: number;
  /** An index into `backgrounds`, or a key of `bonusBackgrounds`. */
  background: number | keyof typeof bonusBackgrounds;
  /** The items being worn, at most one per slot. */
  wearing: AccessoryId[];
  /** The top half: a T-shirt, hoodie, shirt or dress. A dress covers `bottom`. */
  outfit: Outfit;
  bottom: Bottom;
  bottomColour: number;
  facial: FacialHair;
  lashes: boolean;
}

export const defaultCharacter: Character = {
  name: '',
  skin: 2,
  hair: 'short',
  hairColour: 0,
  top: 0,
  background: 0,
  wearing: [],
  outfit: 'tee',
  bottom: 'trousers',
  bottomColour: 0,
  facial: 'none',
  lashes: false,
};

/** The name to show for a character that has not been named yet. */
export const FALLBACK_NAME = 'You';

// ---------------------------------------------------------------- points

// Points are earned by answering and by finishing courses, and for now they are
// simply collected. Turning them into real donations to charities is planned but
// not released: until it is, nothing on the site may suggest that points are donated.
export const POINTS = { best: 10, okay: 5, risky: 2, courseComplete: 50 } as const;

// ---------------------------------------------------------------- achievements

export interface Facts {
  answered: number;
  goodCalls: number;
  coursesStarted: number;
  coursesCompleted: number;
  seconds: number;
  streak: number;
  /** The longest streak there has ever been, so a broken streak keeps its achievement. */
  bestStreak: number;
  /** Every point earned so far. */
  points: number;
  customised: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  /** What it takes, shown while it is still locked. */
  goal: string;
  /** Shown once it is unlocked. */
  praise: string;
  /** A small picture, drawn in the badge. */
  icon: 'spark' | 'target' | 'eye' | 'book' | 'books' | 'clock' | 'hourglass' | 'flame' | 'fire' | 'heart' | 'person' | 'compass';
  test: (facts: Facts) => boolean;
}

export const achievements: Achievement[] = [
  {
    id: 'first-call',
    name: 'First call',
    goal: 'Answer your first question.',
    praise: 'Every course starts with one.',
    icon: 'spark',
    test: (f) => f.answered >= 1,
  },
  {
    id: 'good-instincts',
    name: 'Good instincts',
    goal: 'Make 10 good calls.',
    praise: 'Your judgement is getting sharper.',
    icon: 'target',
    test: (f) => f.goodCalls >= 10,
  },
  {
    id: 'sound-judgement',
    name: 'Sound judgement',
    goal: 'Make 50 good calls.',
    praise: 'Fifty times you made the call that respects everyone.',
    icon: 'eye',
    test: (f) => f.goodCalls >= 50,
  },
  {
    id: 'explorer',
    name: 'Explorer',
    goal: 'Start 3 different courses.',
    praise: 'Curious about more than one corner of life.',
    icon: 'compass',
    test: (f) => f.coursesStarted >= 3,
  },
  {
    id: 'first-book',
    name: 'First book finished',
    goal: 'Finish every question in a course.',
    praise: 'A whole course, start to finish.',
    icon: 'book',
    test: (f) => f.coursesCompleted >= 1,
  },
  {
    id: 'bookworm',
    name: 'Bookworm',
    goal: 'Finish 3 courses.',
    praise: 'Three books on your shelf.',
    icon: 'books',
    test: (f) => f.coursesCompleted >= 3,
  },
  {
    id: 'time-well-spent',
    name: 'Time well spent',
    goal: 'Spend 1 hour learning on Good Call.',
    praise: 'An hour of practice for the moments that count.',
    icon: 'clock',
    test: (f) => f.seconds >= 3600,
  },
  {
    id: 'deep-learner',
    name: 'Deep learner',
    goal: 'Spend 5 hours learning on Good Call.',
    praise: 'Five hours in. Unlocks a gold background for your character.',
    icon: 'hourglass',
    test: (f) => f.seconds >= 5 * 3600,
  },
  {
    id: 'on-a-roll',
    name: 'On a roll',
    goal: 'Learn on 3 days in a row.',
    praise: 'Three days running.',
    icon: 'flame',
    test: (f) => f.bestStreak >= 3,
  },
  {
    id: 'week-strong',
    name: 'Week strong',
    goal: 'Learn on 7 days in a row.',
    praise: 'A full week. Unlocks a racing green background for your character.',
    icon: 'fire',
    test: (f) => f.bestStreak >= 7,
  },
  {
    id: 'point-collector',
    name: 'Point collector',
    goal: 'Collect 500 points.',
    praise: 'Five hundred points, and counting.',
    icon: 'heart',
    test: (f) => f.points >= 500,
  },
  {
    id: 'make-it-yours',
    name: 'Make it yours',
    goal: 'Name and style your character.',
    praise: 'Your character is ready for the scenarios.',
    icon: 'person',
    test: (f) => f.customised,
  },
];

// ---------------------------------------------------------------- dates and streaks

/** Today's date in the visitor's own time zone, as YYYY-MM-DD. */
export function dayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function previousDay(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d - 1));
}

/**
 * The current streak: consecutive learning days ending today, or ending yesterday
 * if today has not been counted yet (so the streak survives until the day is over).
 */
export function currentStreak(days: Set<string>, today = dayKey()): number {
  let day = days.has(today) ? today : previousDay(today);
  let streak = 0;
  while (days.has(day)) {
    streak += 1;
    day = previousDay(day);
  }
  return streak;
}

/** The longest run of consecutive learning days ever. */
export function longestStreak(days: Set<string>): number {
  let best = 0;
  for (const day of days) {
    // Only count from the first day of each run.
    if (days.has(previousDay(day))) continue;
    let length = 0;
    const [y, m] = day.split('-').map(Number);
    let d = Number(day.split('-')[2]);
    let key = day;
    while (days.has(key)) {
      length += 1;
      d += 1;
      key = dayKey(new Date(y, m - 1, d));
    }
    best = Math.max(best, length);
  }
  return best;
}

/** "2 hr 5 min", "12 min", or "Under a minute". */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 1) return 'Under a minute';
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${minutes} min`;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}
