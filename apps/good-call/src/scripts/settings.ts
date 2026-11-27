// Reading settings: text size, spacing, text alignment, background and the
// read-aloud voice.
// Saved in this browser's localStorage. The tiny inline script in Base.astro
// applies them before first paint; this file wires up the dialog and saves changes.

import { onVoiceState, parseSay, speak, stopSpeaking, unlockAudio } from './voice';
import { SAMPLE } from '../lib/narration';

const KEY = 'gc-settings';

const allowed = {
  size: ['sm', 'md', 'lg'],
  space: ['normal', 'roomy'],
  align: ['left', 'justify'],
  bg: ['auto', 'soft', 'cream', 'dark'],
  voice: ['natural', 'device'],
} as const;

type SettingName = keyof typeof allowed;

function isSetting(name: string): name is SettingName {
  return name in allowed;
}

function readSaved(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {
    return {};
  }
}

function save(name: SettingName, value: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...readSaved(), [name]: value }));
  } catch {
    // Private browsing can block storage. The choice still applies for this visit.
  }
}

const dialog = document.getElementById('settings') as HTMLDialogElement | null;

if (dialog) {
  // Tick the option that is currently active.
  for (const name of Object.keys(allowed) as SettingName[]) {
    const value = document.documentElement.dataset[name];
    const input = dialog.querySelector<HTMLInputElement>(`input[name="${name}"][value="${value}"]`);
    if (input) input.checked = true;
  }

  document.querySelectorAll('[data-open-settings]').forEach((button) => {
    button.addEventListener('click', () => dialog.showModal());
  });

  dialog.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    if (input.type !== 'radio' || !isSetting(input.name)) return;
    if (!(allowed[input.name] as readonly string[]).includes(input.value)) return;

    document.documentElement.dataset[input.name] = input.value;
    save(input.name, input.value);
  });

  // "Hear it": a short line in the chosen voice. Choosing the voice saves it at
  // once (the change handler above), so the preview always uses the one ticked.
  const preview = dialog.querySelector<HTMLButtonElement>('[data-voice-preview]');
  if (preview) {
    const label = preview.querySelector<HTMLElement>('[data-voice-preview-label]')!;
    let previewing = false;
    preview.addEventListener('click', async () => {
      if (previewing) {
        stopSpeaking();
        return;
      }
      // Straight from the tap, so phones allow the sound.
      unlockAudio();
      previewing = true;
      const off = onVoiceState((state) => {
        label.textContent = state.status === 'preparing' ? 'Getting ready…' : state.status === 'speaking' ? 'Stop' : 'Hear it';
      });
      await speak({ clips: preview.dataset.say ? parseSay(preview.dataset.say) : undefined, text: () => [SAMPLE] });
      previewing = false;
      off();
      label.textContent = 'Hear it';
    });
    // Choosing another voice, or closing, stops a preview.
    dialog.addEventListener('change', (event) => {
      if ((event.target as HTMLInputElement).name === 'voice' && previewing) stopSpeaking();
    });
    dialog.addEventListener('close', () => previewing && stopSpeaking());
  }

  // A click on the dimmed backdrop lands on the <dialog> element itself.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}
