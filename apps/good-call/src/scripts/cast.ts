// Puts the visitor's character into every scenario on the page: their drawing and
// name above the situation ("Playing as Sam"), and their name in the question
// ("What is the best call, Sam?"). Nothing shows until they have named a character.

import { PROFILE_EVENT, readProfile } from './store';
import { avatarSvg } from './avatar';

function render() {
  const { character } = readProfile();
  const name = character.name.trim();

  document.querySelectorAll<HTMLElement>('[data-cast]').forEach((cast) => {
    cast.hidden = !name;
    if (!name) return;
    cast.querySelector<HTMLElement>('[data-cast-avatar]')!.innerHTML = avatarSvg(character, 30);
    cast.querySelector<HTMLElement>('[data-cast-name]')!.textContent = name;
  });

  document.querySelectorAll<HTMLElement>('legend[data-question]').forEach((legend) => {
    const question = legend.dataset.question!;
    // Only questions that end in a question mark can take a name: "What is the best call, Sam?"
    legend.textContent = name && question.endsWith('?') ? `${question.slice(0, -1)}, ${name}?` : question;
  });
}

render();
document.addEventListener(PROFILE_EVENT, render);
