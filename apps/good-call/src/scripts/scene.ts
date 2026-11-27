// Draws the illustrated scenes (src/lib/scenes.ts) into every [data-scene] box,
// and puts the visitor's own character in them.
//
// In the reader, a scene is drawn when its step is about to be shown (the one on
// screen and the next), so a long course does not draw dozens at once. Elsewhere,
// every scene on the page is drawn straight away.
//
// When a call is made, the visitor's character reacts: a cheer for a good call,
// a small nod for the others.

import { sceneSvg, isCast, isSetting } from '../lib/scenes';
import { characterSvg } from './avatar';
import { PROFILE_EVENT, readProfile } from './store';
import { CALL_EVENT } from './progress';

const inner = (svg: string) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

function personalise(box: HTMLElement) {
  const me = box.querySelector<SVGGElement>('[data-scene-me] svg');
  if (!me) return;
  const { character } = readProfile();
  me.innerHTML = inner(characterSvg(character));
}

/** Draws one scene box, once. */
export function drawScene(box: HTMLElement) {
  if (box.dataset.drawn) return;
  const [setting, cast = '0'] = (box.dataset.scene ?? '').split(':');
  if (!isSetting(setting) || !isCast(cast)) return;
  box.innerHTML = sceneSvg({ setting, cast }, box.dataset.seed ?? setting);
  box.dataset.drawn = 'true';
  personalise(box);
}

/** Draws every scene inside `root` that has not been drawn yet. */
export function drawScenes(root: ParentNode) {
  root.querySelectorAll<HTMLElement>('[data-scene]').forEach(drawScene);
}

// The reader draws its own, step by step (src/scripts/deck.ts).
if (!document.querySelector('[data-deck]')) drawScenes(document);

// A new look for the character shows in every scene already drawn.
document.addEventListener(PROFILE_EVENT, () => {
  document.querySelectorAll<HTMLElement>('[data-scene][data-drawn]').forEach(personalise);
});

// The character reacts to the call.
document.addEventListener(CALL_EVENT, (event) => {
  const scenario = event.target as HTMLElement;
  const me = scenario.querySelector<SVGElement>('[data-scene-me] .char');
  if (!me || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const call = (event as CustomEvent<{ call: string }>).detail.call;
  const emote = call === 'best' ? 'emote-cheer' : 'emote-nod';
  me.classList.remove('emote-cheer', 'emote-nod');
  // Restart the animation even if the same one ran before.
  void me.getBoundingClientRect();
  me.classList.add(emote);
  setTimeout(() => me.classList.remove(emote), 1600);
});
