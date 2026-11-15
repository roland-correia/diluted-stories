// Brings the full-length character to life on a "stage" ([data-stage]): it
// breathes and blinks, wanders a few steps left and right, and now and then
// waves, jumps, dances, cheers or shows a heart. Hovering over it makes it livelier,
// and a tap or click (or Enter, as the stage is a button) makes it do a move.
//
// People who ask their device for reduced motion get a still character: no
// walking and no moves, and the breathing and blinking are switched off in the CSS.

import { characterSvg } from './avatar';
import type { Character } from '../lib/game';

const EMOTES = ['wave', 'jump', 'dance', 'cheer', 'heart', 'wave', 'jump'] as const;
type Emote = (typeof EMOTES)[number];
const EMOTE_TIME: Record<Emote, number> = { wave: 1600, jump: 900, dance: 2000, cheer: 1300, heart: 1500 };

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export interface Stage {
  /** Redraw the character after its look changes, keeping where it stands. */
  draw: (character: Character) => void;
  /** Make the character do a move straight away. */
  emote: (name?: Emote) => void;
}

export function mountStage(stage: HTMLElement, character: Character): Stage {
  const walker = document.createElement('div');
  walker.className = 'walker';
  stage.replaceChildren(walker);

  let x = 0;
  let busy = false;
  let timer = 0;

  const svg = () => walker.querySelector<SVGSVGElement>('svg.char');

  function draw(next: Character) {
    walker.innerHTML = characterSvg(next);
  }

  function emote(name: Emote = EMOTES[Math.floor(Math.random() * EMOTES.length)]) {
    const figure = svg();
    if (!figure || reducedMotion.matches) return;
    // Stop walking where it is, then do the move.
    figure.classList.remove('is-walking', ...EMOTES.map((e) => `emote-${e}`));
    void figure.getBoundingClientRect(); // restart the animation if the same move repeats
    figure.classList.add(`emote-${name}`);
    busy = true;
    window.setTimeout(() => {
      svg()?.classList.remove(`emote-${name}`);
      busy = false;
    }, EMOTE_TIME[name]);
  }

  function walk() {
    const figure = svg();
    if (!figure) return;
    // Room to roam: the stage's width, less the character's own width and a margin.
    const room = Math.max(0, (stage.clientWidth - walker.clientWidth) / 2 - 12);
    if (room < 20) return emote();
    const target = Math.round((Math.random() * 2 - 1) * room);
    const distance = Math.abs(target - x);
    if (distance < 24) return emote();
    const seconds = distance / 55;
    walker.style.setProperty('--dir', target < x ? '-1' : '1');
    walker.style.transitionDuration = `${seconds}s`;
    walker.style.setProperty('--x', `${target}px`);
    figure.classList.add('is-walking');
    busy = true;
    x = target;
    window.setTimeout(() => {
      svg()?.classList.remove('is-walking');
      busy = false;
    }, seconds * 1000);
  }

  function next() {
    window.clearTimeout(timer);
    const lively = stage.classList.contains('excited');
    timer = window.setTimeout(next, lively ? 1600 + Math.random() * 1200 : 3200 + Math.random() * 2800);
    if (busy || reducedMotion.matches || document.hidden) return;
    if (Math.random() < 0.45) walk();
    else emote();
  }

  stage.addEventListener('pointerenter', () => {
    stage.classList.add('excited');
    if (!busy) emote();
  });
  stage.addEventListener('pointerleave', () => stage.classList.remove('excited'));
  stage.addEventListener('click', () => emote());

  draw(character);
  timer = window.setTimeout(next, 1400);

  return { draw, emote };
}
