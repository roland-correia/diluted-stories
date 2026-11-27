// Which scenarios this visitor has answered, and what they chose.
// Saved in this browser's localStorage only. Nothing is sent anywhere.

const KEY = 'gc-progress';

// Sent on `document` whenever an answer is saved or cleared, so progress bars can redraw.
export const PROGRESS_EVENT = 'gc:progress';

/** Sent on a scenario's element when a call is made there, with { call } as its detail. */
export const CALL_EVENT = 'gc:call';

export type Call = 'best' | 'okay' | 'risky';

export interface Answer {
  call: Call;
  // Which option was chosen, counting from 0. -1 means it is not known: the answer
  // was saved by an earlier version of the site, which kept only the verdict.
  choice: number;
}

// Keyed by scenario id, e.g. 'consent/hug-hello'.
export type Progress = Record<string, Answer>;

export const callLabels: Record<Call, string> = {
  best: 'Good call',
  okay: 'Could be better',
  risky: 'Not the best call',
};

// Scenarios that moved from the consent course to the parenting course for the
// child's age (see astro.config.mjs). Saved answers move with them.
const movedFromConsent: Record<string, string> = {
  'consent/first-phone': 'parent-school/first-phone',
  'consent/shown-at-school': 'parent-school/shown-at-school',
  'consent/goodbye-hug': 'parent-school/goodbye-hug',
  'consent/search-history': 'parent-teen/search-history',
  'consent/nude-going-round': 'parent-teen/nude-going-round',
  'consent/is-that-what-its-like': 'parent-teen/is-that-what-its-like',
};

export function readProgress(): Progress {
  let saved: Record<string, Answer | Call>;
  try {
    saved = JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {
    return {};
  }

  const progress: Progress = {};
  for (const [savedId, value] of Object.entries(saved)) {
    // The pornography module was merged into the consent module, so its answers move with it.
    const merged = savedId.replace(/^adult-content\//, 'consent/');
    const id = movedFromConsent[merged] ?? merged;
    progress[id] = typeof value === 'string' ? { call: value, choice: -1 } : value;
  }
  return progress;
}

function write(progress: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // Private browsing can block storage. The scenario still works; it just is not remembered.
  }
  document.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
}

// An answer is final. Once one is saved for a scenario it is never replaced.
export function recordAnswer(id: string, answer: Answer) {
  const progress = readProgress();
  if (id in progress) return;
  write({ ...progress, [id]: answer });
}

export function clearSet(set: string) {
  const progress = readProgress();
  for (const id of Object.keys(progress)) {
    if (id.startsWith(`${set}/`)) delete progress[id];
  }
  write(progress);
}
