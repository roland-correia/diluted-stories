// The opening screen (src/components/Splash.astro). The inline script in
// Base.astro has already decided, before the page painted, whether to show it:
// html.splash-on shows the animated mark, and html.splash-ask also asks for a name.
//
// While it is open, everything behind it is made inert, so keyboard and screen
// reader users stay on the screen in front of them. Once it closes, it sends
// SPLASH_DONE, so achievements earned earlier are announced only when visible.

import { updateProfile } from './store';

export const SPLASH_DONE = 'gc:splash-done';

const root = document.documentElement;
const splash = document.querySelector<HTMLElement>('[data-splash]');

let finished = false;

function finish() {
  if (finished) return;
  finished = true;
  root.classList.remove('splash-on', 'splash-ask');
  document.querySelectorAll<HTMLElement>('[data-splash-inert]').forEach((el) => {
    el.inert = false;
    el.removeAttribute('data-splash-inert');
  });
  document.dispatchEvent(new CustomEvent(SPLASH_DONE));
}

if (splash && root.classList.contains('splash-on')) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const form = splash.querySelector<HTMLFormElement>('[data-splash-form]')!;
  const input = form.querySelector<HTMLInputElement>('input[name="name"]')!;

  // Everything else on the page waits behind the opening screen.
  for (const el of Array.from(document.body.children) as HTMLElement[]) {
    if (el === splash || el.tagName === 'SCRIPT' || el.inert) continue;
    el.inert = true;
    el.setAttribute('data-splash-inert', '');
  }

  const close = () => {
    if (reducedMotion) return finish();
    splash.classList.add('leaving');
    splash.addEventListener('animationend', finish, { once: true });
    // In case the animation never runs (a hidden tab, for example).
    setTimeout(finish, 700);
  };

  // Let the mark finish drawing itself first.
  const drawn = reducedMotion ? 250 : 1700;

  setTimeout(() => {
    if (!root.classList.contains('splash-ask')) return close();
    splash.classList.add('asking');
    splash.setAttribute('aria-labelledby', 'splash-question');
    form.hidden = false;
    input.focus();
  }, drawn);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = input.value.replace(/\s+/g, ' ').trim().slice(0, 20);
    if (!name) {
      input.value = '';
      input.focus();
      return;
    }
    updateProfile((profile) => {
      profile.character.name = name;
    });
    close();
  });
}
