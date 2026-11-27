// Habits: planned at the end of each module, checked on the next visit.
//
// 1. A module's wrap-up (src/components/StepWrap.astro) shows how the module went
//    and offers one habit. The visitor picks when they will try it ("Next time I'm
//    out", or their own words) and taps "I'll try it". A reminder can go in their
//    calendar. Planning the moment, not just the intention, is what makes people
//    follow through (Gollwitzer and Sheeran, 2006).
// 2. From the next day on, Home asks: "Did you try it?" with three answers:
//    "I did it" (+15 points, and the Follow-through achievement the first time),
//    "Not yet" (asks again tomorrow), and "Not for me" (stops asking).
//
// Plans are kept in this browser only, with the rest of the profile (store.ts).

import { PROGRESS_EVENT, readProgress, type Call } from './progress';
import { PROFILE_EVENT, readProfile, updateProfile, type Plan } from './store';
import { addToCalendar, tomorrowEvening } from './ics';
import { CELEBRATE_EVENT } from './activity';
import { dayKey, POINTS } from '../lib/game';
import { href } from '../lib/paths';

const marks: Record<Call, string> = { best: '✓', okay: '~', risky: '!' };
const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** The visitor's plan for a module, if they have made one. */
const planFor = (key: string, plans = readProfile().plans) => [...plans].reverse().find((plan) => plan.key === key);

// ---------------------------------------------------------------- the wrap-up step

function setUpWrap(wrap: HTMLElement) {
  const key = wrap.dataset.wrap!;
  const ids = wrap.dataset.ids!.split(',');
  const form = wrap.querySelector<HTMLFormElement>('[data-plan]')!;
  const planned = wrap.querySelector<HTMLElement>('[data-planned]')!;
  const ownField = wrap.querySelector<HTMLElement>('[data-own-cue-field]')!;
  const ownText = wrap.querySelector<HTMLInputElement>('[data-own-cue-text]')!;
  const habitName = wrap.querySelector('.habit-card h3')!.textContent!.trim();
  const habitText = wrap.querySelector('.habit-card h3 + p')!.textContent!.trim();
  let replanning = false;

  function render() {
    // How the module went.
    const progress = readProgress();
    const answers = ids.map((id) => progress[id]);
    const answered = answers.filter(Boolean).length;
    const good = answers.filter((answer) => answer?.call === 'best').length;
    wrap.querySelectorAll<HTMLElement>('[data-wrap-marks] li').forEach((mark, i) => {
      const answer = answers[i];
      mark.dataset.call = answer?.call ?? '';
      mark.textContent = answer ? marks[answer.call] : '';
    });
    wrap.querySelector<HTMLElement>('[data-wrap-kicker]')!.textContent = answered === ids.length ? 'Module complete' : 'Module wrap-up';
    wrap.querySelector<HTMLElement>('[data-wrap-score]')!.textContent =
      answered === 0
        ? 'No calls made in this module yet.'
        : `${good} good ${good === 1 ? 'call' : 'calls'} out of ${ids.length}${answered < ids.length ? `, with ${ids.length - answered} still to answer` : ''}.`;

    // The plan, or the form to make one.
    const plan = planFor(key);
    const showPlan = Boolean(plan) && !replanning;
    form.hidden = showPlan;
    planned.hidden = !showPlan;
    if (plan && showPlan) planned.querySelector<HTMLElement>('[data-planned-cue]')!.textContent = capital(plan.cue);
  }

  form.addEventListener('change', () => {
    const own = form.querySelector<HTMLInputElement>('[data-own-cue]')!.checked;
    ownField.hidden = !own;
    if (own) ownText.focus();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const picked = form.querySelector<HTMLInputElement>('input[type="radio"]:checked');
    const own = picked?.hasAttribute('data-own-cue');
    const cue = (own ? ownText.value : picked?.value ?? '').trim();
    if (!cue) {
      ownField.hidden = false;
      ownText.focus();
      return;
    }
    updateProfile((profile) => {
      // A new plan for the same module replaces an open one.
      profile.plans = profile.plans.filter((plan) => !(plan.key === key && !plan.status));
      profile.plans.push({ key, name: habitName, cue, made: dayKey() });
      // Keep the list short: the 30 most recent.
      profile.plans = profile.plans.slice(-30);
    });
    replanning = false;
    render();
    planned.querySelector<HTMLElement>('[data-remind]')?.focus();
  });

  planned.querySelector('[data-remind]')?.addEventListener('click', () => {
    const plan = planFor(key);
    if (!plan) return;
    addToCalendar({
      title: `Try: ${plan.name}`,
      start: tomorrowEvening(),
      minutes: 10,
      description: `${capital(plan.cue)}, I'll try this: ${habitText}`,
      url: new URL(href('/'), location.origin).href,
    });
  });

  planned.querySelector('[data-replan]')?.addEventListener('click', () => {
    replanning = true;
    render();
    form.querySelector<HTMLInputElement>('input[type="radio"]')?.focus();
  });

  render();
  document.addEventListener(PROGRESS_EVENT, render);
  document.addEventListener(PROFILE_EVENT, () => !replanning && render());
}

document.querySelectorAll<HTMLElement>('[data-wrap]').forEach(setUpWrap);

// ---------------------------------------------------------------- the check-in on Home

/** The plan to ask about now: made before today, not answered, and not put off until later. */
export function dueCheckIn(plans: Plan[] = readProfile().plans, today = dayKey()): Plan | undefined {
  return [...plans].reverse().find((plan) => !plan.status && plan.made < today && (!plan.snoozed || plan.snoozed < today));
}

const checkIn = document.querySelector<HTMLElement>('[data-checkin]');

if (checkIn) {
  const name = checkIn.querySelector<HTMLElement>('[data-checkin-name]')!;
  const cue = checkIn.querySelector<HTMLElement>('[data-checkin-cue]')!;
  const ask = checkIn.querySelector<HTMLElement>('[data-checkin-ask]')!;
  const thanks = checkIn.querySelector<HTMLElement>('[data-checkin-thanks]')!;
  let current: Plan | undefined;
  // Once answered, the card stays to say thanks, even though the plan is no longer due.
  let answered = false;

  function render() {
    if (answered) return;
    current = dueCheckIn();
    checkIn!.hidden = !current;
    if (!current) return;
    name.textContent = current.name;
    cue.textContent = capital(current.cue);
  }

  function answer(status: 'done' | 'skipped' | 'later') {
    const plan = current;
    if (!plan) return;
    answered = true;
    updateProfile((profile) => {
      const saved = profile.plans.find((p) => p.key === plan.key && p.made === plan.made && !p.status);
      if (!saved) return;
      if (status === 'later') saved.snoozed = dayKey();
      else saved.status = status;
    });
    ask.hidden = true;
    thanks.hidden = false;
    thanks.textContent =
      status === 'done'
        ? `Brilliant. That's how a good call becomes a habit. +${POINTS.followThrough} points.`
        : status === 'later'
          ? "No problem. We'll ask again tomorrow. Missing a day doesn't undo a habit."
          : "Fair enough. Not every habit fits everyone. There's another at the end of every module.";
    thanks.focus();
    if (status === 'done') document.dispatchEvent(new CustomEvent(CELEBRATE_EVENT));
  }

  checkIn.querySelector('[data-checkin-done]')!.addEventListener('click', () => answer('done'));
  checkIn.querySelector('[data-checkin-later]')!.addEventListener('click', () => answer('later'));
  checkIn.querySelector('[data-checkin-skip]')!.addEventListener('click', () => answer('skipped'));

  render();
  document.addEventListener(PROFILE_EVENT, render);
  addEventListener('pageshow', (event) => {
    if (event.persisted) render();
  });
}
