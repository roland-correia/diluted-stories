// The Listen button: reads the step on screen aloud, like a friendly sidekick
// talking you through it, in the natural recorded voice (or the device's own,
// under Aa). Used in the reader and on a scenario's own page.
//
// - One tap starts, another stops. While the first clips load, the button pulses.
// - It stops when the step changes, when a call is made (tap again to hear the
//   verdict), and when the page is left.
// The script is in src/scripts/narrate.ts, the voices in src/scripts/voice.ts.

import { SLIDE_EVENT } from './deck';
import { CALL_EVENT } from './progress';
import { clipsFor, textFor } from './narrate';
import { canSpeak, onVoiceState, speak, stopSpeaking, unlockAudio, voiceState } from './voice';

const button = document.querySelector<HTMLButtonElement>('[data-listen]');

if (button && canSpeak()) {
  // "Listen to this step" in the reader, "Listen to this scenario" on its own page.
  const idleLabel = button.getAttribute('aria-label') ?? 'Listen';
  button.hidden = false;

  /** What to read: the step on screen in the reader, or the scenario on its own page. */
  const target = () =>
    document.querySelector<HTMLElement>('[data-slide]:not([hidden])') ?? document.querySelector<HTMLElement>('[data-listen-root]');

  button.addEventListener('click', () => {
    if (voiceState().status !== 'idle') {
      stopSpeaking();
      return;
    }
    // Straight from the tap, so phones allow the sound.
    unlockAudio();
    const root = target();
    if (!root) return;
    void speak({ clips: clipsFor(root), text: () => textFor(root) });
  });

  // The button shows what is happening: ready, getting the voice ready (a pulse), or reading (stop).
  onVoiceState((state) => {
    button.classList.toggle('preparing', state.status === 'preparing');
    button.setAttribute('aria-pressed', String(state.status !== 'idle'));
    button.setAttribute(
      'aria-label',
      state.status === 'preparing' ? 'Getting ready to read. Tap to stop.' : state.status === 'speaking' ? 'Stop listening' : idleLabel,
    );
  });

  document.addEventListener(SLIDE_EVENT, stopSpeaking);
  // Once a call is made, the options being read are out of date; tap again to hear the verdict.
  document.addEventListener(CALL_EVENT, stopSpeaking);
  addEventListener('pagehide', stopSpeaking);
}
