// The Profile tab: the character on its stage, the stats, unfinished courses, the
// habits planned at the end of modules, and achievements, all from this browser's storage (see src/scripts/store.ts), and
// the "Delete all my Good Call data" confirmation.

import { PROGRESS_EVENT } from './progress';
import { pointsEarned, courseStates, facts, PROFILE_EVENT, readProfile, unlockedAchievements } from './store';
import { backgroundColour } from './avatar';
import { mountStage, type Stage } from './stage';
import { formatDuration, POINTS } from '../lib/game';

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

function set(name: string, text: string) {
  const el = document.querySelector<HTMLElement>(`[data-stat="${name}"]`);
  if (el) el.textContent = text;
}

const stageEl = document.querySelector<HTMLElement>('[data-stage]');
let stage: Stage | undefined;
let drawnLook = '';

function render() {
  const f = facts();
  const profile = readProfile();
  const name = profile.character.name.trim();

  document.querySelector<HTMLElement>('[data-profile-name]')!.textContent = name || 'Your profile';
  document.querySelector<HTMLElement>('[data-character-link]')!.textContent = profile.customised
    ? 'Edit your character'
    : 'Create your character';

  // The character: drawn once, and again only if its look has changed.
  if (stageEl) {
    const look = JSON.stringify(profile.character);
    stageEl.style.setProperty('--char-bg', backgroundColour(profile.character));
    stageEl.setAttribute('aria-label', `${name || 'Your character'}. Tap for a move.`);
    if (!stage) stage = mountStage(stageEl, profile.character);
    else if (look !== drawnLook) stage.draw(profile.character);
    drawnLook = look;
  }

  set('time', formatDuration(f.seconds));
  set('streak', plural(f.streak, 'day'));
  set('best', f.bestStreak > f.streak ? `Day streak. Best: ${plural(f.bestStreak, 'day')}` : 'Day streak');
  set('points', String(pointsEarned()));
  set('good', String(f.goodCalls));
  set('finished', String(f.coursesCompleted));

  // Started but unfinished.
  const reading = new Set(courseStates().filter((s) => s.answered > 0 && !s.complete).map((s) => s.course.id));
  document.querySelectorAll<HTMLElement>('[data-reading]').forEach((item) => (item.hidden = !reading.has(item.dataset.reading!)));
  document.querySelector<HTMLElement>('[data-reading-section]')!.hidden = reading.size === 0;

  // Habits planned at the end of modules, newest first, and how each went.
  const habitList = document.querySelector<HTMLElement>('[data-habit-list]');
  if (habitList) {
    const plans = [...profile.plans].reverse();
    document.querySelector<HTMLElement>('[data-habits-section]')!.hidden = plans.length === 0;
    habitList.replaceChildren(
      ...plans.map((plan) => {
        const item = document.createElement('li');
        item.className = `habit-item ${plan.status ?? 'open'}`;
        const mark = document.createElement('span');
        mark.className = 'habit-mark';
        mark.setAttribute('aria-hidden', 'true');
        mark.textContent = plan.status === 'done' ? '✓' : plan.status === 'skipped' ? '–' : '…';
        const text = document.createElement('span');
        const name = document.createElement('b');
        name.textContent = plan.name;
        const detail = document.createElement('small');
        const cue = plan.cue.charAt(0).toUpperCase() + plan.cue.slice(1);
        detail.textContent =
          plan.status === 'done' ? `Tried it. +${POINTS.followThrough} points` : plan.status === 'skipped' ? 'Not for you' : `Planned: ${cue}`;
        text.append(name, detail);
        item.append(mark, text);
        return item;
      }),
    );
  }

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

// Deleting everything asks first, in a dialog that explains what is kept and where.
const wipe = document.getElementById('wipe-dialog') as HTMLDialogElement | null;
document.querySelector('[data-wipe]')?.addEventListener('click', () => {
  if (!wipe) return;
  wipe.returnValue = '';
  wipe.showModal();
});
wipe?.addEventListener('click', (event) => {
  // A tap on the dimmed backdrop lands on the dialog itself: treat it as "keep".
  if (event.target === wipe) wipe.close('keep');
});
wipe?.addEventListener('close', () => {
  if (wipe.returnValue !== 'delete') return;
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
