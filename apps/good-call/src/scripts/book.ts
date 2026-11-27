// A course's book page (src/pages/courses/[set]/index.astro): progress, the
// Start/Continue button, the save bookmark and the unlockable item.

import { PROGRESS_EVENT, readProgress } from './progress';
import { courseStates, PROFILE_EVENT, readProfile, updateProfile } from './store';
import { avatarSvg } from './avatar';
import { accessories, type AccessoryId } from '../lib/courses';

const page = document.querySelector<HTMLElement>('[data-book-page]');

if (page) {
  const id = page.dataset.bookPage!;
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
  const start = document.querySelector<HTMLAnchorElement>('[data-start]')!;
  const readerPath = start.getAttribute('href')!;
  const save = page.querySelector<HTMLButtonElement>('[data-save]')!;

  save.hidden = false;

  function render() {
    const state = courseStates().find((s) => s.course.id === id);
    if (!state) return;
    const progress = readProgress();
    const profile = readProfile();
    const percent = state.total ? Math.round((state.answered / state.total) * 100) : 0;

    // Progress and the main button.
    const pill = page!.querySelector<HTMLElement>('[data-book-progress]')!;
    pill.style.setProperty('--p', String(percent));
    pill.querySelector<HTMLElement>('[data-book-percent]')!.textContent =
      state.answered === 0 ? plural(state.total, 'question') : state.complete ? 'Finished' : `${percent}% done`;

    // The reader itself opens where the visitor left off, so Start and Continue
    // both go to it without naming a step.
    if (state.answered === 0) {
      start.textContent = 'Start the course';
      start.href = readerPath;
    } else if (!state.complete) {
      start.textContent = 'Continue';
      start.href = readerPath;
    } else {
      start.textContent = 'See your results';
      start.href = `${readerPath}#step=done`;
    }

    // Each topic: how much of it is answered.
    page!.querySelectorAll<HTMLElement>('[data-topic-card]').forEach((card) => {
      const ids = card.dataset.ids!.split(',');
      const done = ids.filter((qid) => progress[qid]).length;
      card.classList.toggle('done', done === ids.length);
      card.querySelector<HTMLElement>('[data-topic-status]')!.textContent =
        done === 0 ? plural(ids.length, 'question') : done === ids.length ? 'Finished' : `${done} of ${ids.length} done`;
    });

    // The bookmark.
    const saved = profile.saved.includes(id);
    save.setAttribute('aria-pressed', String(saved));
    save.setAttribute('aria-label', saved ? 'Saved to your profile. Remove it' : 'Save this course to your profile');

    // The item this course unlocks, shown on the visitor's own character.
    const unlock = page!.querySelector<HTMLElement>('[data-unlock-preview]');
    if (unlock) {
      const item = unlock.dataset.unlockPreview as AccessoryId;
      const character = { ...profile.character };
      // Wear it in the preview, in place of anything else in the same place.
      const slot = accessories[item].slot;
      character.wearing = [...character.wearing.filter((worn) => worn in accessories && accessories[worn].slot !== slot), item];
      unlock.innerHTML = avatarSvg(character, 72);
      page!.querySelector<HTMLElement>('[data-unlock-state]')!.textContent = state.complete
        ? 'Unlocked. Wear it from your profile.'
        : `${plural(state.total - state.answered, 'question')} to go.`;
    }

  }

  save.addEventListener('click', () => {
    updateProfile((profile) => {
      profile.saved = profile.saved.includes(id) ? profile.saved.filter((s) => s !== id) : [id, ...profile.saved];
    });
  });


  render();
  document.addEventListener(PROGRESS_EVENT, render);
  document.addEventListener(PROFILE_EVENT, render);
  addEventListener('pageshow', (event) => {
    if (event.persisted) render();
  });
}
