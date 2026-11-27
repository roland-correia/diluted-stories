// Puts the visitor's name into every question on the page: "What is the best
// call, Sam?". Their character is put into the scenes by src/scripts/scene.ts.
// Nothing changes until they have named a character.

import { PROFILE_EVENT, readProfile } from './store';

function render() {
  const name = readProfile().character.name.trim();
  document.querySelectorAll<HTMLElement>('legend[data-question]').forEach((legend) => {
    const question = legend.dataset.question!;
    // Only questions that end in a question mark can take a name: "What is the best call, Sam?"
    legend.textContent = name && question.endsWith('?') ? `${question.slice(0, -1)}, ${name}?` : question;
  });
}

render();
document.addEventListener(PROFILE_EVENT, render);
