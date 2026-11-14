// Runs on every page.
// - Counts the time spent learning: only while the page is on screen and the
//   visitor has done something (scrolled, tapped, typed) in the last three minutes,
//   so a tab left open overnight does not count.
// - Marks today as a learning day when a question is answered.
// - Keeps the streak and points counters in the header up to date.
// - Announces each newly earned achievement and character item, once.

import { PROGRESS_EVENT } from './progress';
import {
  pointsEarned,
  courseStates,
  facts,
  markAnsweredToday,
  PROFILE_EVENT,
  readProfile,
  readStats,
  unlockedAchievements,
  unlockedItems,
  writeProfile,
  writeStats,
} from './store';
import { SPLASH_DONE } from './splash';
import { achievements, dayKey } from '../lib/game';

/** Send this on `document` to announce anything newly earned straight away. */
export const CELEBRATE_EVENT = 'gc:celebrate';
import { accessories } from '../lib/courses';

// ---------------------------------------------------------------- time spent

const IDLE_AFTER = 3 * 60 * 1000;
const TICK = 5000;
let lastActivity = Date.now();
let lastTick = Date.now();
let pending = 0;

for (const type of ['pointerdown', 'keydown', 'scroll', 'touchstart', 'wheel']) {
  addEventListener(type, () => (lastActivity = Date.now()), { passive: true, capture: true });
}

function tick() {
  const now = Date.now();
  const elapsed = Math.min(now - lastTick, TICK * 2);
  lastTick = now;
  if (document.visibilityState === 'visible' && now - lastActivity < IDLE_AFTER) pending += elapsed;
}

// `announce` is false while the page is being hidden or closed: anything earned
// then is celebrated on the next page instead, where it can actually be seen.
function flush(announce = true) {
  tick();
  const seconds = Math.floor(pending / 1000);
  if (seconds < 1) return;
  pending -= seconds * 1000;
  const stats = readStats();
  const today = dayKey();
  stats.seconds += seconds;
  stats.days[today] = (stats.days[today] ?? 0) + seconds;
  writeStats(stats);
  // Time-based achievements can be reached while simply reading.
  if (announce) celebrate();
}

setInterval(tick, TICK);
setInterval(flush, 15000);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') flush(false);
  else lastTick = Date.now();
});
addEventListener('pagehide', () => flush(false));

// ---------------------------------------------------------------- header counters

function renderCounters() {
  const f = facts();
  document.querySelectorAll<HTMLElement>('[data-streak]').forEach((el) => (el.textContent = String(f.streak)));
  document.querySelectorAll<HTMLElement>('[data-streak-chip]').forEach((el) => el.classList.toggle('lit', f.streak > 0));
  const points = pointsEarned();
  document.querySelectorAll<HTMLElement>('[data-points]').forEach((el) => (el.textContent = String(points)));
}

// ---------------------------------------------------------------- celebrations

const toasts = document.querySelector<HTMLElement>('[data-toasts]');

function toast(title: string, detail: string) {
  if (!toasts) return;
  const item = document.createElement('div');
  item.className = 'toast';
  item.innerHTML = `<span class="toast-icon" aria-hidden="true">★</span><span><b></b><small></small></span>`;
  item.querySelector('b')!.textContent = title;
  item.querySelector('small')!.textContent = detail;
  toasts.append(item);
  setTimeout(() => item.classList.add('leaving'), 4200);
  setTimeout(() => item.remove(), 4800);
}

function celebrate() {
  const profile = readProfile();
  const seen = new Set(profile.seen);
  const fresh: string[] = [];

  for (const id of unlockedAchievements()) {
    if (seen.has(id)) continue;
    const a = achievements.find((x) => x.id === id);
    if (a) toast(`Achievement unlocked: ${a.name}`, a.praise);
    fresh.push(id);
  }
  for (const item of unlockedItems(courseStates())) {
    const key = `item:${item}`;
    if (seen.has(key)) continue;
    toast(`New for your character: ${accessories[item].name}`, 'Try it on in your profile.');
    fresh.push(key);
  }

  if (fresh.length > 0) {
    profile.seen = [...profile.seen, ...fresh];
    writeProfile(profile);
  }
}

// Only a new answer marks today as a learning day; clearing answers does not.
let answeredSoFar = facts().answered;
document.addEventListener(PROGRESS_EVENT, () => {
  const answered = facts().answered;
  if (answered > answeredSoFar) markAnsweredToday();
  answeredSoFar = answered;
  renderCounters();
  celebrate();
});
document.addEventListener(PROFILE_EVENT, renderCounters);
// Sent by pages that award something on the spot.
document.addEventListener(CELEBRATE_EVENT, celebrate);
// Coming back with the browser's Back button can show the page as it was, so redraw.
addEventListener('pageshow', (event) => {
  if (event.persisted) {
    renderCounters();
    celebrate();
  }
});

renderCounters();
// Give the page a moment to settle before celebrating anything earned on an earlier
// visit, and wait for the opening screen to close first, so nothing is hidden behind it.
if (document.documentElement.classList.contains('splash-on')) {
  document.addEventListener(SPLASH_DONE, () => setTimeout(celebrate, 400), { once: true });
} else {
  setTimeout(celebrate, 600);
}
