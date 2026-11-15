// Info pop-ups (src/components/InfoTip.astro) use the browser's popover attribute.
// Browsers from before 2024 do not have it, so there the buttons open and close
// the pop-up with the `open` class instead, and Escape closes it.

const supported = typeof HTMLElement !== 'undefined' && 'popover' in HTMLElement.prototype;

if (!supported) {
  const close = (pop: HTMLElement) => pop.classList.remove('open');
  document.querySelectorAll<HTMLButtonElement>('[data-info-btn]').forEach((button) => {
    const pop = document.getElementById(button.dataset.infoBtn!);
    if (!pop) return;
    button.addEventListener('click', () => {
      pop.classList.toggle('open');
      button.setAttribute('aria-expanded', String(pop.classList.contains('open')));
    });
  });
  document.querySelectorAll<HTMLButtonElement>('[data-info-close]').forEach((button) => {
    const pop = document.getElementById(button.dataset.infoClose!);
    button.addEventListener('click', () => pop && close(pop));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') document.querySelectorAll<HTMLElement>('.info-pop.open').forEach(close);
  });
}
