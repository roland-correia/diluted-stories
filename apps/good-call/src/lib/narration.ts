// What the Listen button says, written to be heard, not read: a friendly sidekick
// talking you through each step. Upbeat, never flippant: the courses cover hard
// things, so verdicts on a poor call stay kind, and nothing is ever mocking.
//
// Built from the course data at build time, so the clips made in advance
// (src/lib/voice-clips.ts, tools/voice/) always match what is on the page. Every
// line here is fixed for a given step: no names, scores or anything the visitor
// typed, because those cannot be recorded in advance.
//
// Each function returns "pieces": a piece is a short paragraph, and is split into
// sentences, one clip each. There is a short pause between sentences and a longer
// one between pieces.

import type { Scenario } from './scenarios';
import type { LessonSection } from './lessons';
import type { Habit } from './modules';
import { POINTS } from './game';
import { sentence } from './speech';

export const ordinals = ['one', 'two', 'three', 'four', 'five', 'six'];

// The same step always gets the same line, and different steps get different ones,
// so it never sounds like a loop.
export function pick<T>(lines: readonly T[], seed: string): T {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return lines[h % lines.length];
}

export const lines = {
  intro: ['New module!', 'Right then, new module.', 'Next up, a new module.'],
  ready: ["Tap Let's go when you're ready.", "When you're ready, tap Let's go."],
  nudge: ['Have a think, then make the call.', "Which one's closest to what you'd really do?", 'Take your time. Pick one, then make the call.'],
  best: ['Nice one, good call!', 'Yes! Good call.', 'Spot on. Good call.'],
  okay: ['Not bad, but it could be better.', 'Close. It could be better.'],
  risky: ['Not the best call this time. Here is why.', "That one's not the best call. Here is why."],
  done: ['Module done. Nice work!', "That's the module done!"],
} as const;

export const callNames = { best: 'Good call.', okay: 'Could be better.', risky: 'Not the best call.' } as const;

export const pointsLine = (call: 'best' | 'okay' | 'risky') =>
  call === 'risky' ? `${POINTS.risky} points, just for trying.` : `That's ${POINTS[call]} points.`;

/** A short line to try the voice with, in the reading settings. */
export const SAMPLE =
  "Hiya! I'm your reading buddy. I'll read every step out loud, so you can listen while you learn. Ready to make some good calls?";

// ---------------------------------------------------------------- a module's intro

export function introPieces(o: { key: string; name: string; lead: string[]; questions: number; minutes: number; first: boolean }): string[] {
  return [
    `${pick(lines.intro, o.key)} ${sentence(o.name)}`,
    ...o.lead,
    `${o.questions} ${o.questions === 1 ? 'question' : 'questions'}, about ${o.minutes} minutes.`,
    ...(o.first ? ["There's no timer, your first answer is the one that counts, and every answer is explained."] : []),
    pick(lines.ready, o.key),
  ];
}

// ---------------------------------------------------------------- a lesson card

export function learnPieces(section: LessonSection): string[] {
  const out = [sentence(section.heading)];
  if (section.text) out.push(section.text);
  const table = section.table;
  if (table && table.head.length === 2) {
    // Flip cards: the front, then what is on the back.
    for (const [front, back] of table.rows) out.push(`${sentence(front)} ${table.head[1]}: ${back}`);
  } else if (table) {
    for (const [first, ...rest] of table.rows) out.push([sentence(first), ...rest.map((cell, i) => `${table.head[i + 1]}: ${cell}`)].join(' '));
  }
  for (const point of section.points ?? []) out.push(`${point.term} ${point.text}`);
  const items = section.items ?? [];
  const quotes = items.length > 0 && !section.ordered && items.every((item) => /^["“]/.test(item));
  if (quotes) out.push(`Try saying: ${items.map((item) => item.replace(/^["“]|["”]$/g, '')).map((q) => `"${q}"`).join(' Or: ')}`);
  else if (section.ordered && items.length) out.push('Ask yourself.', ...items);
  else out.push(...items);
  if (section.after) out.push(section.after);
  return out;
}

// ---------------------------------------------------------------- a question

export interface QuestionNarration {
  /** The title, any messages, the situation and the question. */
  base: string[];
  /** Before the call: each option, then a nudge. */
  options: string[];
  /** After the call, for each option: "You chose...", the verdict, its reason. */
  chosen: string[][];
  /** For the good call, when another option was chosen. */
  good: string[];
  /** For an option whose reason has been opened with "Compare the other answers". */
  other: string[][];
  takeaway: string[];
}

export function questionNarration(entry: Scenario): QuestionNarration {
  const data = entry.data;
  const id = entry.id;
  const base = [sentence(data.title)];

  if (data.chat) {
    let last = '';
    for (const message of data.chat.messages) {
      if (message.from === 'system') {
        base.push(message.text);
        last = '';
        continue;
      }
      const who = message.from === 'me' ? 'You' : message.from === 'them' ? data.chat.with : message.from;
      base.push(who === last ? message.text : who === 'You' ? `You reply: ${message.text}` : `${who} says: ${message.text}`);
      last = who;
    }
  }
  base.push(...data.situation.trim().split(/\n\s*\n/));
  base.push(data.question);

  const options = data.options.map((option, i) => `Option ${ordinals[i]}: ${option.text}`);
  options.push(pick(lines.nudge, id));

  const best = data.options.find((option) => option.call === 'best')!;
  return {
    base,
    options,
    chosen: data.options.map((option) => [`You chose: ${option.text}`, `${pick(lines[option.call], id)} ${pointsLine(option.call)}`, option.why]),
    good: [`The good call: ${best.text}`, best.why],
    other: data.options.map((option, i) => [`Option ${ordinals[i]}: ${option.text}`, callNames[option.call], option.why]),
    takeaway: [`Key takeaway: ${data.principle}`],
  };
}

// ---------------------------------------------------------------- a module's wrap-up

export function wrapPieces(o: { key: string; habit: Habit }) {
  const habit = [`Here's one to try: ${sentence(o.habit.name)}`, o.habit.text];
  return {
    complete: [pick(lines.done, o.key), ...habit],
    partial: ['Module wrap-up. A few questions are still waiting for you.', ...habit],
    planned: ["You've made your plan. Nice!"],
    plan: ["When will you try it? Pick a moment, then tap: I'll try it."],
  };
}

// ---------------------------------------------------------------- the end of a course

export function donePieces(o: { course: string; unlock?: string }) {
  return {
    complete: [`Course complete! ${sentence(o.course)}`, "Here's how you did.", ...(o.unlock ? [`You've unlocked: ${sentence(o.unlock)}`] : [])],
    progress: [`Your progress: ${sentence(o.course)}`, 'Some questions are still waiting for you. Pick up where you left off whenever you like.'],
  };
}
