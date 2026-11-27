// The Listen button in the reader: reads the current step aloud with the
// browser's own speech (the Web Speech API), so nothing is sent anywhere by Good
// Call. It reads what is on screen: a module's intro, a lesson card (what is open
// on it), or a question with its messages and choices, then, once the call is
// made, the verdict, the reasons and the key takeaway. It stops when the step changes.
// Browsers without speech do not show the button.

import { SLIDE_EVENT } from './deck';

const button = document.querySelector<HTMLButtonElement>('[data-listen]');

if (button && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') {
  const synth = window.speechSynthesis;
  // Bumped on every start and stop, so the end of an old reading cannot reset a new one.
  let run = 0;

  button.hidden = false;

  // The CSS swaps the play triangle for a pause sign while aria-pressed is true.
  function setPlaying(playing: boolean) {
    button!.setAttribute('aria-pressed', String(playing));
    button!.setAttribute('aria-label', playing ? 'Stop listening' : 'Listen to this step');
  }

  const visible = (el: Element) => (el as HTMLElement).checkVisibility?.() ?? true;

  // The text of the step on screen, in reading order, as separate short pieces.
  // Some browsers cut off long utterances, so each paragraph is spoken on its own.
  function pieces(): string[] {
    const slide = document.querySelector<HTMLElement>('[data-slide]:not([hidden])');
    if (!slide) return [];
    const parts = slide.querySelectorAll<HTMLElement>(
      [
        '.kicker', '.quiz-title', 'h2', '.facts li', '.lead-big', '.lead-more', '.how li', '.learn-text',
        '.flip summary span', '.flip p', '.open-card summary', '.open-card > p', '.open-card dd', '.bubbles li', '.checks span',
        '.ticks li', '.learn-after', '.chat-head b', '.chat-msg', '.situation p', 'legend', '.opt label > span',
        '.why', '.principle p', '.wrap-score', '.habit-card h3', '.habit-card h3 + p', '.done-score', '.done-reward',
      ].join(', '),
    );
    const seen = new Set<string>();
    const out: string[] = [];
    parts.forEach((part) => {
      if (!visible(part)) return;
      // Leave out the small "Your answer" note inside an option; it is read with the reason.
      const clone = part.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('[hidden], [aria-hidden="true"]').forEach((el) => el.remove());
      const text = clone.textContent?.replace(/\s+/g, ' ').trim();
      if (text && !seen.has(text)) {
        seen.add(text);
        out.push(part.matches('.opt label > span') ? `Choice: ${text}` : text);
      }
    });
    return out;
  }

  function stopReading() {
    run += 1;
    synth.cancel();
    setPlaying(false);
  }

  function startReading() {
    synth.cancel();
    const mine = (run += 1);
    const texts = pieces();
    if (texts.length === 0) return;
    setPlaying(true);
    texts.forEach((text, i) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      if (i === texts.length - 1) {
        utterance.addEventListener('end', () => mine === run && setPlaying(false));
      }
      utterance.addEventListener('error', () => mine === run && setPlaying(false));
      synth.speak(utterance);
    });
  }

  button.addEventListener('click', () => {
    if (button.getAttribute('aria-pressed') === 'true') stopReading();
    else startReading();
  });

  document.addEventListener(SLIDE_EVENT, stopReading);
  addEventListener('pagehide', () => synth.cancel());
}
