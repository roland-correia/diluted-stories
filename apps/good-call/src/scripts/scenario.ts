// Each scenario: pick an answer, make the call, see why.
//
// The first answer is the one that counts, so the result is the visitor's real
// judgement: once made, a call cannot be changed, on this visit or a later one.
// There is no timer.
//
// After the call:
// - the reason for their answer opens, headed by the verdict (Good call, Could be
//   better, Not the best call) and the points it earned, and the visitor's
//   character reacts in the scene,
// - the good call's reason opens too, if it was another answer,
// - the other reasons are one tap away ("Compare the other answers"),
// - the key takeaway appears underneath.
//
// Progressive enhancement: without JavaScript every reason is on the page, so the
// scenario still reads as a worked example.

import { readProgress, recordAnswer, CALL_EVENT, type Call } from './progress';
import { POINTS } from '../lib/game';

const labels: Record<Call, string> = { best: 'Good call', okay: 'Could be better', risky: 'Not the best call' };

// A course's reader holds every scenario in it, so each one is set up on its own.
document.querySelectorAll<HTMLElement>('[data-scenario]').forEach(setUp);

function setUp(root: HTMLElement) {
  const id = root.dataset.id!;
  const form = root.querySelector<HTMLFormElement>('[data-quiz]')!;
  const options = Array.from(root.querySelectorAll<HTMLElement>('[data-option]'));
  const check = root.querySelector<HTMLButtonElement>('[data-check]')!;
  const showAll = root.querySelector<HTMLButtonElement>('[data-show-all]')!;
  const hint = root.querySelector<HTMLElement>('[data-hint]')!;
  const after = root.querySelector<HTMLElement>('[data-after]')!;
  const verdict = root.querySelector<HTMLElement>('[data-verdict]')!;

  const whyOf = (option: HTMLElement) => option.querySelector<HTMLElement>('[data-why]')!;
  const inputOf = (option: HTMLElement) => option.querySelector<HTMLInputElement>('input')!;

  options.forEach((option) => (whyOf(option).hidden = true));
  after.hidden = true;
  check.hidden = false;
  root.classList.add('js-quiz');

  const reveal = (option: HTMLElement) => (whyOf(option).hidden = false);

  // The verdict is the chosen answer's own heading: it pops in with the points it
  // earned, and is announced to screen readers.
  function showVerdict(chosen: HTMLElement | undefined, call: Call | undefined, fresh: boolean) {
    if (!chosen || !call) return;
    const points = chosen.querySelector<HTMLElement>('[data-why-points]')!;
    points.hidden = false;
    points.textContent = `+${POINTS[call]} points`;
    whyOf(chosen).classList.toggle('fresh', fresh);
    if (fresh) verdict.textContent = `${labels[call]}. ${POINTS[call]} points.`;
  }

  // Shows a call that has been made: the choice is marked and can no longer be changed,
  // its reason and the good call's reason are shown, and the rest are one tap away.
  // `choice` is -1 when an older saved answer did not record which option it was.
  function lock(choice: number, call: Call | undefined, fresh: boolean) {
    const chosen = options[choice];

    for (const option of options) {
      const input = inputOf(option);
      input.checked = option === chosen;
      input.disabled = true;
    }
    root.classList.add('locked');

    if (chosen) {
      chosen.classList.add('chosen');
      chosen.querySelector<HTMLElement>('[data-yours]')!.hidden = false;
      reveal(chosen);
      options.filter((option) => option.dataset.call === 'best').forEach(reveal);
    } else {
      options.forEach(reveal);
    }

    check.hidden = hint.hidden = true;
    after.hidden = false;
    showAll.hidden = options.every((option) => !whyOf(option).hidden);
    showVerdict(chosen, call ?? (chosen?.dataset.call as Call | undefined), fresh);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    // A locked form has no button to submit it, but Enter in a field still could.
    if (root.classList.contains('locked')) return;

    const choice = options.findIndex((option) => inputOf(option).checked);
    hint.hidden = choice > -1;
    if (choice === -1) {
      if (!hint.hidden) hint.animate?.([{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'none' }], 240);
      return;
    }

    const call = options[choice].dataset.call as Call;
    recordAnswer(id, { call, choice });
    lock(choice, call, true);
    root.dispatchEvent(new CustomEvent(CALL_EVENT, { bubbles: true, detail: { call } }));

    // Move to the reason so it is read next, by eye or by screen reader.
    const why = whyOf(options[choice]);
    why.focus({ preventScroll: true });
    why.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });

  form.addEventListener('change', () => (hint.hidden = true));

  showAll.addEventListener('click', () => {
    const firstNew = options.find((option) => whyOf(option).hidden);
    options.forEach(reveal);
    showAll.hidden = true;
    if (firstNew) whyOf(firstNew).focus();
  });

  // Coming back to a scenario that was already answered shows it as it was left.
  const saved = readProgress()[id];
  if (saved) lock(saved.choice, saved.call, false);
}
