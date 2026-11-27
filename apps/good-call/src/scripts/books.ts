// Fills in everything on a page that depends on what this visitor has done:
// - each book's progress, read out to screen readers ([data-book-status] inside [data-book]),
// - the visitor's character wherever there is a [data-avatar] slot, and a greeting
//   by the time of day with their name in [data-hello] ("Good morning, Sam"),
// - the "Continue learning" card on the home page,
// - today's goal on the home page: a ring that fills as questions are answered.
// Used on Home, Explore and Profile. Redraws when an answer or the profile changes.

import { PROGRESS_EVENT, readProgress } from './progress';
import { courseStates, PROFILE_EVENT, readProfile, readStats, type CourseState } from './store';
import { DAILY_GOAL, dayKey } from '../lib/game';
import { avatarSvg } from './avatar';

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

export function describe(state: CourseState): string {
  if (state.complete) return 'Finished';
  if (state.answered === 0) return `${plural(state.total, 'question')}, not started`;
  return `${state.answered} of ${state.total} answered`;
}

/** "Good morning" before noon, "Good afternoon" until 5pm, then "Good evening", by the device's own clock. */
export function greeting(now = new Date()): string {
  const hour = now.getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export const percentOf = (state: CourseState) => (state.total ? Math.round((state.answered / state.total) * 100) : 0);

function render() {
  const states = courseStates();
  const byId = new Map(states.map((state) => [state.course.id, state]));
  const profile = readProfile();

  document.querySelectorAll<HTMLElement>('a[data-book]').forEach((book) => {
    const state = byId.get(book.dataset.book!);
    if (!state) return;
    const status = book.querySelector<HTMLElement>('[data-book-status]');
    if (status) status.textContent = describe(state);
  });

  document.querySelectorAll<HTMLElement>('[data-avatar]').forEach((slot) => {
    slot.innerHTML = avatarSvg(profile.character);
  });

  const name = profile.character.name.trim();
  document.querySelectorAll<HTMLElement>('[data-hello]').forEach((hello) => {
    hello.textContent = name ? `${greeting()}, ${name}` : greeting();
  });

  // Today's goal. Shown from the first visit, so there is something to aim for.
  const today = document.querySelector<HTMLElement>('[data-today]');
  if (today) {
    const count = readStats().counts?.[dayKey()] ?? 0;
    today.hidden = false;
    today.classList.toggle('met', count >= DAILY_GOAL);
    today.querySelector<HTMLElement>('[data-today-ring]')!.style.setProperty('--p', String(Math.min(100, (count / DAILY_GOAL) * 100)));
    today.querySelector<HTMLElement>('[data-today-count]')!.textContent = count >= DAILY_GOAL ? `${count} done` : `${count} of ${DAILY_GOAL}`;
    today.setAttribute('aria-label', count >= DAILY_GOAL ? `Daily goal met: ${count} questions today` : `Today: ${count} of ${DAILY_GOAL} questions`);
  }

  // Continue learning: the course read most recently, if it is unfinished;
  // otherwise any course that is started and unfinished.
  const section = document.querySelector<HTMLElement>('[data-continue-section]');
  if (section) {
    const unfinished = (state?: CourseState) => state && state.answered > 0 && !state.complete;
    const last = profile.lastCourse ? byId.get(profile.lastCourse) : undefined;
    const pick = unfinished(last) ? last : states.find((state) => unfinished(state));
    section.hidden = !pick;
    section.querySelectorAll<HTMLElement>('[data-continue]').forEach((card) => {
      const show = card.dataset.continue === pick?.course.id;
      card.hidden = !show;
      if (!show || !pick) return;
      // One segment per module, and the first module not yet finished named as next.
      const progress = readProgress();
      let nextName = '';
      card.querySelectorAll<HTMLElement>('[data-mod-ids]').forEach((mod) => {
        const ids = mod.dataset.modIds!.split(',');
        const done = ids.filter((qid) => progress[qid]).length;
        mod.querySelector('i')!.style.width = `${(done / ids.length) * 100}%`;
        const complete = done === ids.length;
        mod.classList.toggle('complete', complete);
        const isNext = !complete && !nextName;
        mod.classList.toggle('next', isNext);
        if (isNext) nextName = mod.dataset.modName!;
      });
      card.querySelector<HTMLElement>('[data-continue-detail]')!.textContent = nextName ? `Next: ${nextName}` : describe(pick);
      card.querySelector<HTMLElement>('[data-continue-percent]')!.textContent = `${percentOf(pick)}%`;
      card.setAttribute('aria-label', `Continue ${pick.course.name}. ${describe(pick)}.${nextName ? ` Next: ${nextName}.` : ''}`);
    });
  }
}

render();
document.addEventListener(PROGRESS_EVENT, render);
document.addEventListener(PROFILE_EVENT, render);
// Coming back with the browser's Back button can show the page as it was, so redraw.
addEventListener('pageshow', (event) => {
  if (event.persisted) render();
});
