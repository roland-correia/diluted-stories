// Read aloud, in one of two voices (a reading setting, "voice" in gc-settings):
//
// - Natural (the default): clips recorded in advance with Kokoro, an open neural
//   voice, and served from this site (src/lib/voice-clips.ts). Each step lists its
//   clips in the page; they are fetched, decoded and played back to back through
//   Web Audio, with a short pause between sentences and a longer one between pieces.
//   Nothing is made on the device and nothing is sent anywhere.
// - Device: the browser's own speechSynthesis, with the most natural English voice
//   on the device. Also used for any step whose clips are not recorded yet, so a
//   step is never read half in one voice and half in another.

import { href } from '../lib/paths';
import { sentences, speakable } from '../lib/speech';

export type VoiceChoice = 'natural' | 'device';

const SETTINGS_KEY = 'gc-settings';

/** The chosen voice: natural unless the visitor picked their device's. */
export function currentVoice(): VoiceChoice {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}').voice === 'device' ? 'device' : 'natural';
  } catch {
    return 'natural';
  }
}

// ---------------------------------------------------------------- what the listener sees

export type VoiceState = { status: 'idle' } | { status: 'preparing' } | { status: 'speaking' };

type Listener = (state: VoiceState) => void;
const listeners = new Set<Listener>();
let state: VoiceState = { status: 'idle' };

function setState(next: VoiceState) {
  state = next;
  listeners.forEach((listener) => listener(state));
}

export function onVoiceState(listener: Listener): () => void {
  listeners.add(listener);
  listener(state);
  return () => listeners.delete(listener);
}

export const voiceState = () => state;

// ---------------------------------------------------------------- clips

/** "id id|id" (from the page) into pieces of clip ids. */
export const parseSay = (value: string | undefined): string[][] =>
  value ? value.split('|').map((piece) => piece.split(' ').filter(Boolean)) : [];

const PAUSE_SENTENCE = 0.16;
const PAUSE_PIECE = 0.45;

let audio: AudioContext | undefined;
let run = 0;
let playing: AudioBufferSourceNode[] = [];
// Decoded clips, so a step heard twice starts at once.
const decoded = new Map<string, Promise<AudioBuffer>>();

/**
 * Must be called straight from a tap (not after waiting for anything): phones only
 * let a page make sound when the sound system is started by the visitor's own action.
 */
export function unlockAudio() {
  // On iPhone, Web Audio is muted by the silent switch unless it is marked as media
  // playback, like a video (Safari 16.4+). The device's voice is never muted, so
  // without this the natural voice could go silent where the old one did not.
  const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
  if (session && session.type !== 'playback') {
    try {
      session.type = 'playback';
    } catch {
      // Not allowed here: carry on with the default.
    }
  }
  const Context = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Context) return;
  audio ??= new Context();
  if (audio.state === 'suspended') void audio.resume();
}

function clip(id: string): Promise<AudioBuffer> {
  let buffer = decoded.get(id);
  if (!buffer) {
    buffer = fetch(href(`/voice/clips/${id}.mp3`))
      .then((response) => {
        if (!response.ok) throw new Error(`Clip ${id}: ${response.status}`);
        return response.arrayBuffer();
      })
      .then((data) => audio!.decodeAudioData(data));
    // A clip that failed (offline) can be fetched again next time.
    buffer.catch(() => decoded.delete(id));
    decoded.set(id, buffer);
    // Keep memory in check: forget the oldest clips first.
    if (decoded.size > 400) decoded.delete(decoded.keys().next().value!);
  }
  return buffer;
}

async function speakClips(pieces: string[][], mine: number) {
  unlockAudio();
  if (!audio) throw new Error('This browser cannot play audio.');
  const queue = pieces.flatMap((piece, p) =>
    piece.map((id, i) => ({ id, gap: i === piece.length - 1 && p < pieces.length - 1 ? PAUSE_PIECE : PAUSE_SENTENCE })),
  );
  if (queue.length === 0) return;
  setState({ status: 'preparing' });
  // Ask for every clip of the step at once; the browser fetches them side by side.
  const buffers = queue.map((item) => clip(item.id));

  let at = 0;
  let last: AudioBufferSourceNode | undefined;
  for (const [i, item] of queue.entries()) {
    const buffer = await buffers[i];
    if (mine !== run) return;
    const source = audio.createBufferSource();
    source.buffer = buffer;
    source.connect(audio.destination);
    at = Math.max(at, audio.currentTime + 0.04);
    source.start(at);
    playing.push(source);
    if (i === 0) setState({ status: 'speaking' });
    at += buffer.duration + item.gap;
    last = source;
  }
  await new Promise<void>((resolve) => {
    if (!last) return resolve();
    last.addEventListener('ended', () => resolve(), { once: true });
  });
}

// ---------------------------------------------------------------- the device's own voice

/** The most natural-sounding English voice on this device, British first. */
export function bestDeviceVoice(): SpeechSynthesisVoice | undefined {
  if (typeof window.speechSynthesis === 'undefined') return undefined;
  const voices = speechSynthesis.getVoices().filter((v) => /^en[-_]/i.test(v.lang));
  const score = (v: SpeechSynthesisVoice) =>
    (/en[-_]GB/i.test(v.lang) ? 4 : 0) +
    (/natural|neural|enhanced|premium|online/i.test(v.name) ? 5 : 0) +
    (/google uk english female|sonia|libby|serena|kate|martha|stephanie|siri/i.test(v.name) ? 3 : 0) -
    // macOS novelty voices.
    (/whisper|bad news|bells|boing|bubbles|cellos|deranged|hysterical|jester|organ|superstar|trinoids|zarvox|albert|fred|junior|ralph|grandma|grandpa|eddy|flo|reed|rocko|sandy|shelley/i.test(v.name) ? 20 : 0);
  return voices.sort((a, b) => score(b) - score(a))[0];
}

function speakDevice(pieces: string[], mine: number): Promise<void> {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const voice = bestDeviceVoice();
    // Some browsers cut long speech short, so each sentence is spoken on its own.
    const queue = pieces.flatMap((piece) => sentences(speakable(piece)));
    if (queue.length === 0) return resolve();
    setState({ status: 'speaking' });
    queue.forEach((text, i) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voice?.lang ?? 'en-GB';
      if (voice) utterance.voice = voice;
      // A touch brighter and quicker than the default, which can sound flat.
      utterance.pitch = 1.08;
      utterance.rate = 1.02;
      if (i === queue.length - 1) utterance.addEventListener('end', () => resolve());
      utterance.addEventListener('error', () => mine === run && resolve());
      synth.speak(utterance);
    });
  });
}

// ---------------------------------------------------------------- speaking

/** Stops anything being read, at once. */
export function stopSpeaking() {
  run += 1;
  for (const source of playing) {
    try {
      source.stop();
    } catch {
      // Already finished.
    }
  }
  playing = [];
  if (typeof window.speechSynthesis !== 'undefined') speechSynthesis.cancel();
  setState({ status: 'idle' });
}

/**
 * Reads a step aloud, stopping anything already playing. `clips` are its recorded
 * clips, used in the natural voice; `text` gives the same script as words, for the
 * device's voice, and for when the clips cannot be played (offline, not recorded).
 */
export async function speak(o: { clips: string[][] | undefined; text: () => string[] }): Promise<void> {
  stopSpeaking();
  const mine = run;
  try {
    if (currentVoice() === 'natural' && o.clips?.length) await speakClips(o.clips, mine);
    else await speakDevice(o.text(), mine);
  } catch {
    // The clips could not be played: read it with the device's voice instead.
    if (mine === run && typeof window.speechSynthesis !== 'undefined') await speakDevice(o.text(), mine);
  }
  if (mine === run) setState({ status: 'idle' });
}

const hasAudioContext = () =>
  typeof window.AudioContext === 'function' || typeof (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext === 'function';

/** Whether this browser can read aloud at all, in either voice. */
export const canSpeak = () => typeof window.speechSynthesis !== 'undefined' || hasAudioContext();
