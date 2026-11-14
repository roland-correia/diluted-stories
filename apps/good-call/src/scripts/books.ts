// Fills in everything on a page that depends on what this visitor has done:
// - each book's progress, read out to screen readers ([data-book-status] inside [data-book]),
// - the visitor's character wherever there is a [data-avatar] slot, and their name in [data-hello],
// - the "Continue learning" card on the home page.
// Used on Home, Explore and Profile. Redraws when an answer or the profile changes.

import { PROGRESS_EVENT } from './progress';
import { courseStates, PROFILE_EVENT, readProfile, type CourseState } from './store';
import { avatarSvg } from './avatar';

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

export function describe(state: CourseState): string {
  if (state.complete) return 'Finished';
  if (state.answered === 0) return `${plural(state.total, 'question')}, not started`;
  return `${state.answered} of ${state.total} answered`;
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
    hello.textContent = name ? `Hi, ${name}` : 'Welcome to Good Call';
  });

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
      card.querySelector<HTMLElement>('[data-continue-detail]')!.textContent = describe(pick);
      card.querySelector<HTMLElement>('[data-continue-fill]')!.style.width = `${percentOf(pick)}%`;
      card.querySelector<HTMLElement>('[data-continue-percent]')!.textContent = `${percentOf(pick)}%`;
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
