// What the Listen button says for the step on screen, in both forms:
// - clipsFor: the recorded clips for the step as it is now (before or after the
//   call, which reasons are open, whether a plan is made), from the ids the build
//   wrote into the page (src/lib/voice-clips.ts). Undefined if any are missing.
// - textFor: the same script as words, for the device's own voice. It uses the
//   same lines (src/lib/narration.ts), and can also say the visitor's name.

import { callNames, lines, ordinals, pick, pointsLine } from '../lib/narration';
import { parseSay } from './voice';
import { sentence } from '../lib/speech';

const text = (el: Element | null | undefined) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
const all = (root: ParentNode, selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector));
type Call = 'best' | 'okay' | 'risky';

/** The scenario in a step, or the step itself if it is one. */
const scenarioIn = (root: HTMLElement) => (root.matches('[data-scenario]') ? root : root.querySelector<HTMLElement>('[data-scenario]'));

// ---------------------------------------------------------------- the recorded clips

/** Joins lists of pieces; undefined if any part has no clips (not recorded yet). */
function join(...parts: (string | undefined)[]): string[][] | undefined {
  if (parts.some((part) => !part)) return undefined;
  return parts.flatMap((part) => parseSay(part));
}

export function clipsFor(root: HTMLElement): string[][] | undefined {
  const kind = root.dataset.kind;
  if (kind === 'intro' || kind === 'learn') return join(root.dataset.say);
  if (kind === 'wrap') {
    const complete = text(root.querySelector('[data-wrap-kicker]')) === 'Module complete';
    const planned = !root.querySelector<HTMLElement>('[data-planned]')?.hidden;
    return join(complete ? root.dataset.sayDone : root.dataset.sayWrap, planned ? root.dataset.sayPlanned : root.dataset.sayPlan);
  }
  if (kind === 'done') return join(root.querySelector('[data-done-badge]:not([hidden])') ? root.dataset.sayComplete : root.dataset.sayProgress);

  const scenario = scenarioIn(root);
  if (!scenario) return undefined;
  if (!scenario.classList.contains('locked')) return join(scenario.dataset.sayBase, scenario.dataset.sayOptions);
  const options = all(scenario, '[data-option]');
  const chosen = options.find((option) => option.classList.contains('chosen'));
  const best = options.find((option) => option.dataset.call === 'best');
  // An older saved answer may not know which option was chosen: read the good call.
  const parts = [scenario.dataset.sayBase, chosen ? chosen.dataset.sayChosen : undefined];
  if (!chosen) parts.pop();
  if (best !== chosen) parts.push(scenario.dataset.sayGood);
  for (const option of options) {
    if (option === chosen || option === best || option.querySelector<HTMLElement>('.why')?.hidden) continue;
    parts.push(option.dataset.sayOther);
  }
  parts.push(scenario.dataset.sayTakeaway);
  return join(...parts);
}

// ---------------------------------------------------------------- the same, as words

function intro(slide: HTMLElement): string[] {
  const key = slide.dataset.key ?? '';
  const out = [`${pick(lines.intro, key)} ${sentence(text(slide.querySelector('.display')))}`];
  out.push(...all(slide, '.lead-big, .lead-more').map(text));
  const facts = all(slide, '.facts li').map(text);
  if (facts.length === 2) out.push(`${facts[0]}, about ${facts[1].replace(/min$/, 'minutes')}.`);
  if (slide.querySelector('.how')) out.push("There's no timer, your first answer is the one that counts, and every answer is explained.");
  out.push(pick(lines.ready, key));
  return out;
}

function learn(slide: HTMLElement): string[] {
  const out = [sentence(text(slide.querySelector('h2')))];
  const lead = text(slide.querySelector('.learn-text'));
  if (lead) out.push(lead);
  for (const flip of all(slide, '.flip')) {
    const backLabel = text(flip.querySelector('p small'));
    const back = text(flip.querySelector('p')).replace(backLabel, '').trim();
    out.push(`${sentence(text(flip.querySelector('summary span')))} ${backLabel}: ${back}`);
  }
  for (const card of all(slide, '.open-card')) {
    const title = text(card.querySelector('summary'));
    const terms = all(card, 'dt').map(text);
    const values = all(card, 'dd').map(text);
    const inside = terms.length ? terms.map((term, i) => `${term}: ${values[i]}`) : all(card, ':scope > p').map(text);
    out.push([terms.length ? sentence(title) : title, ...inside].join(' '));
  }
  const bubbles = all(slide, '.bubbles li').map(text);
  if (bubbles.length) out.push(`Try saying: ${bubbles.map((b) => `"${b}"`).join(' Or: ')}`);
  const checks = all(slide, '.checks span').map(text);
  if (checks.length) out.push('Ask yourself.', ...checks);
  out.push(...all(slide, '.ticks li').map(text));
  const after = text(slide.querySelector('.learn-after'));
  if (after) out.push(after);
  return out;
}

function chat(root: HTMLElement): string[] {
  const out: string[] = [];
  const other = text(root.querySelector('.chat-head b'));
  let last = '';
  for (const msg of all(root, '.chat-msg')) {
    const clone = msg.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.visually-hidden, .chat-name, .chat-time').forEach((el) => el.remove());
    const body = text(clone);
    if (msg.classList.contains('system')) {
      out.push(body);
      last = '';
      continue;
    }
    const who = msg.classList.contains('mine') ? 'You' : text(msg.querySelector('.chat-name')) || other;
    out.push(who === last ? body : who === 'You' ? `You reply: ${body}` : `${who} says: ${body}`);
    last = who;
  }
  return out;
}

function question(root: HTMLElement): string[] {
  const id = root.dataset.id ?? '';
  const out = [sentence(text(root.querySelector('.quiz-title')))];
  out.push(...chat(root));
  out.push(...all(root, '.situation p').map(text));
  // The question with the visitor's name in it, as on screen.
  out.push(text(root.querySelector('legend')));

  const options = all(root, '[data-option]');
  const optionText = (option: HTMLElement) => {
    const clone = option.querySelector('label > span')!.cloneNode(true) as HTMLElement;
    clone.querySelector('[data-yours]')?.remove();
    return text(clone);
  };

  if (!root.classList.contains('locked')) {
    options.forEach((option, i) => out.push(`Option ${ordinals[i]}: ${optionText(option)}`));
    out.push(pick(lines.nudge, id));
    return out;
  }

  const chosen = options.find((option) => option.classList.contains('chosen'));
  const best = options.find((option) => option.dataset.call === 'best');
  if (chosen) {
    const call = chosen.dataset.call as Call;
    out.push(`You chose: ${optionText(chosen)}`, `${pick(lines[call], id)} ${pointsLine(call)}`, text(chosen.querySelector('.why p')));
  }
  if (best && best !== chosen) out.push(`The good call: ${optionText(best)}`, text(best.querySelector('.why p')));
  options.forEach((option, i) => {
    if (option === chosen || option === best || option.querySelector<HTMLElement>('.why')?.hidden) return;
    out.push(`Option ${ordinals[i]}: ${optionText(option)}`, callNames[option.dataset.call as Call], text(option.querySelector('.why p')));
  });
  const takeaway = text(root.querySelector('.principle p'));
  if (takeaway) out.push(`Key takeaway: ${takeaway}`);
  return out;
}

function wrap(slide: HTMLElement): string[] {
  const key = slide.dataset.key ?? '';
  const complete = text(slide.querySelector('[data-wrap-kicker]')) === 'Module complete';
  const out = [complete ? pick(lines.done, key) : 'Module wrap-up. A few questions are still waiting for you.'];
  out.push(`Here's one to try: ${sentence(text(slide.querySelector('.habit-card h3')))}`, text(slide.querySelector('.habit-card h3 + p')));
  const planned = slide.querySelector<HTMLElement>('[data-planned]');
  out.push(planned && !planned.hidden ? "You've made your plan. Nice!" : "When will you try it? Pick a moment, then tap: I'll try it.");
  return out;
}

function summary(slide: HTMLElement): string[] {
  const complete = Boolean(slide.querySelector('[data-done-badge]:not([hidden])'));
  const course = text(slide.querySelector('h2'));
  return complete
    ? [`Course complete! ${sentence(course)}`, text(slide.querySelector('[data-done-score]')), ...all(slide, '[data-done-reward] span:not([hidden])').map(text)]
    : [`Your progress: ${sentence(course)}`, text(slide.querySelector('[data-done-score]'))];
}

export function textFor(root: HTMLElement): string[] {
  const kind = root.dataset.kind;
  let out: string[];
  if (kind === 'intro') out = intro(root);
  else if (kind === 'learn') out = learn(root);
  else if (kind === 'wrap') out = wrap(root);
  else if (kind === 'done') out = summary(root);
  else {
    const scenario = scenarioIn(root);
    out = scenario ? question(scenario) : [text(root)];
  }
  return out.map((line) => line.trim()).filter((line) => line && line !== '.');
}
