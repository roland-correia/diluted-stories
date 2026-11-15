// Saved courses, on the Explore tab: the bookmark button beside the title opens a
// half-screen sheet with every saved course on one shelf, newest first, which
// scrolls sideways. It closes with its X, the Escape key, or a tap above it.

import { PROFILE_EVENT, readProfile } from './store';

const sheet = document.getElementById('saved-sheet') as HTMLDialogElement | null;
const opener = document.querySelector<HTMLButtonElement>('[data-open-saved]');

if (sheet && opener) {
  const button = opener;
  const list = sheet.querySelector<HTMLElement>('[data-saved-list]')!;
  const empty = sheet.querySelector<HTMLElement>('[data-saved-empty]')!;
  const count = opener.querySelector<HTMLElement>('[data-saved-count]')!;

  function render() {
    const saved = readProfile().saved.filter((id) => list.querySelector(`[data-saved="${CSS.escape(id)}"]`));
    list.querySelectorAll<HTMLElement>('[data-saved]').forEach((item) => (item.hidden = !saved.includes(item.dataset.saved!)));
    saved.forEach((id) => list.append(list.querySelector(`[data-saved="${CSS.escape(id)}"]`)!));
    list.hidden = saved.length === 0;
    empty.hidden = saved.length > 0;
    count.hidden = saved.length === 0;
    count.textContent = String(saved.length);
    button.setAttribute('aria-label', saved.length ? `Saved courses: ${saved.length}` : 'Saved courses');
  }

  opener.addEventListener('click', () => {
    render();
    sheet.showModal();
    list.scrollLeft = 0;
  });
  sheet.querySelector('[data-close-saved]')!.addEventListener('click', () => sheet.close());
  // A tap on the dimmed area above the sheet closes it. Checked by position, so a
  // tap on the sheet's own edges or gaps does not.
  sheet.addEventListener('click', (event) => {
    if (event.target !== sheet) return;
    const box = sheet.getBoundingClientRect();
    const inside = event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
    if (!inside) sheet.close();
  });

  render();
  document.addEventListener(PROFILE_EVENT, render);
  addEventListener('pageshow', (event) => {
    if (event.persisted) render();
  });
}
