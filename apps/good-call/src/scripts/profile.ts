// The Profile tab: fills in the stats, saved and unfinished courses and
// achievements from this browser's storage. See src/scripts/store.ts.

import { PROGRESS_EVENT } from './progress';
import {
  pointsEarned,
  courseStates,
  facts,
  PROFILE_EVENT,
  readProfile,
  unlockedAchievements,
} from './store';
import { formatDuration } from '../lib/game';

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

function set(name: string, text: string) {
  const el = document.querySelector<HTMLElement>(`[data-stat="${name}"]`);
  if (el) el.textContent = text;
}

function render() {
  const f = facts();
  const profile = readProfile();
  const name = profile.character.name.trim();

  document.querySelector<HTMLElement>('[data-profile-name]')!.textContent = name || 'Your profile';
  document.querySelector<HTMLElement>('[data-character-link]')!.textContent = profile.customised
    ? 'Edit your character'
    : 'Create your character';

  set('time', formatDuration(f.seconds));
  set('streak', plural(f.streak, 'day'));
  set('best', f.bestStreak > f.streak ? `Day streak. Best: ${plural(f.bestStreak, 'day')}` : 'Day streak');
  set('points', String(pointsEarned()));
  set('good', String(f.goodCalls));
  set('finished', String(f.coursesCompleted));

  // Saved courses, in the order they were saved, newest first.
  const list = document.querySelector<HTMLElement>('[data-saved-list]')!;
  const saved = profile.saved.filter((id) => list.querySelector(`[data-saved="${id}"]`));
  list.querySelectorAll<HTMLElement>('[data-saved]').forEach((item) => (item.hidden = !saved.includes(item.dataset.saved!)));
  saved.forEach((id) => list.append(list.querySelector(`[data-saved="${id}"]`)!));
  document.querySelector<HTMLElement>('[data-saved-empty]')!.hidden = saved.length > 0;

  // Started but unfinished.
  const reading = new Set(courseStates().filter((s) => s.answered > 0 && !s.complete).map((s) => s.course.id));
  document.querySelectorAll<HTMLElement>('[data-reading]').forEach((item) => (item.hidden = !reading.has(item.dataset.reading!)));
  document.querySelector<HTMLElement>('[data-reading-section]')!.hidden = reading.size === 0;

  // Achievements.
  const unlocked = unlockedAchievements(f);
  document.querySelectorAll<HTMLElement>('[data-achievement]').forEach((card) => {
    const done = unlocked.has(card.dataset.achievement!);
    card.classList.toggle('locked', !done);
    card.classList.toggle('unlocked', done);
    const line = card.querySelector<HTMLElement>('small')!;
    line.textContent = done ? line.dataset.praise! : line.dataset.goal!;
    card.querySelector<HTMLElement>('[data-achievement-state]')!.textContent = done ? 'Unlocked.' : 'Locked.';
  });
  const total = document.querySelectorAll('[data-achievement]').length;
  document.querySelector<HTMLElement>('[data-achievement-count]')!.textContent = `${unlocked.size} of ${total} unlocked`;

}

document.querySelector('[data-wipe]')?.addEventListener('click', () => {
  const sure = confirm(
    'Delete your character, answers, time, streak, points and saved courses from this browser? This cannot be undone. Your reading settings stay.',
  );
  if (!sure) return;
  try {
    for (const key of ['gc-progress', 'gc-profile', 'gc-stats']) localStorage.removeItem(key);
  } catch {
    // Storage blocked: there was nothing saved to delete.
  }
  location.reload();
});

render();
document.addEventListener(PROGRESS_EVENT, render);
document.addEventListener(PROFILE_EVENT, render);
addEventListener('pageshow', (event) => {
  if (event.persisted) render();
});
