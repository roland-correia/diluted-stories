// The read-aloud clips, made in advance with the Kokoro voice (tools/voice/) and
// served from this site: public/voice/clips/<id>.mp3, one per sentence.
//
// Build time only (it reads the file system). Each sentence's id is a hash of the
// voice settings and its exact spoken text, so changing a sentence, or the voice,
// asks for a new clip, and an unchanged sentence is never made twice.
//
// Pages carry the ids, not the text: "id id|id" is two pieces, the first of two
// sentences (src/scripts/voice.ts plays them). A step with any clip still missing
// carries none, and is read by the device's voice instead, so nothing ever plays
// half in one voice and half in another. `npm run build` says how many are missing,
// and tools/voice/ makes them (npm run generate).

import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { sentences, speakable } from './speech';

/** Change any of these and every clip is made again. */
export const VOICE = {
  model: 'onnx-community/Kokoro-82M-v1.0-ONNX',
  dtype: 'fp32',
  voice: 'af_heart',
  speed: 1,
} as const;

const dir = join(process.cwd(), 'public', 'voice', 'clips');

export const clipId = (sentence: string) =>
  createHash('sha256').update(`${VOICE.model}|${VOICE.dtype}|${VOICE.voice}|${VOICE.speed}|${sentence}`).digest('hex').slice(0, 16);

/** The sentences of some pieces, as they will be spoken, with their clip ids. */
export function clipsOf(pieces: string[]): { id: string; text: string }[][] {
  return pieces.map((piece) => sentences(speakable(piece)).map((text) => ({ id: clipId(text), text })));
}

const exists = new Map<string, boolean>();
const have = (id: string) => {
  if (!exists.has(id)) exists.set(id, existsSync(join(dir, `${id}.mp3`)));
  return exists.get(id)!;
};

/** The ids to write into the page, or '' if any clip is still missing. */
export function say(pieces: string[]): string {
  const clips = clipsOf(pieces).filter((piece) => piece.length > 0);
  if (clips.some((piece) => piece.some((clip) => !have(clip.id)))) return '';
  return clips.map((piece) => piece.map((clip) => clip.id).join(' ')).join('|');
}
