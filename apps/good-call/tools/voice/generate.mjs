// Records Good Call's read-aloud clips with the Kokoro voice, on this computer.
//
// 1. Build the site first (npm run build in apps/good-call): it writes
//    dist/voice/corpus.json, every sentence Listen can say, with its clip id.
// 2. npm install, then npm run generate, here in tools/voice/.
//    (npm run generate -- --limit=40 records just 40, to try it out.
//     npm run generate -- --prune also deletes clips no sentence uses any more,
//     after text has been changed or removed.
//     npm run generate -- --reverse works from the other end, so two runs can
//     share the work on a computer with cores to spare.)
// 3. Build again: steps whose clips are all recorded now use them.
//
// Only missing clips are made, so it is safe to stop and run again. Clips go to
// public/voice/clips/<id>.mp3 (mono, 24 kHz, 40 kbps). Each clip's own silence at
// either end is trimmed, so the pauses between sentences are set in one place
// (src/scripts/voice.ts) and always the same.

import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KokoroTTS } from 'kokoro-js';
import { Mp3Encoder } from '@breezystack/lamejs';

const app = fileURLToPath(new URL('../../', import.meta.url));
const corpusPath = join(app, 'dist', 'voice', 'corpus.json');
const out = join(app, 'public', 'voice', 'clips');

if (!existsSync(corpusPath)) {
  console.error('No dist/voice/corpus.json yet. Run npm run build in apps/good-call first.');
  process.exit(1);
}
const { voice, clips } = JSON.parse(readFileSync(corpusPath, 'utf8'));
mkdirSync(out, { recursive: true });
// --limit=N records only the first N missing clips: for a quick try.
const limit = Number(process.argv.find((arg) => arg.startsWith('--limit='))?.split('=')[1] ?? Infinity);
if (process.argv.includes('--prune')) {
  const used = new Set(clips.map((clip) => `${clip.id}.mp3`));
  const unused = readdirSync(out).filter((file) => file.endsWith('.mp3') && !used.has(file));
  for (const file of unused) unlinkSync(join(out, file));
  console.log(`Pruned ${unused.length} clips no sentence uses any more.`);
}
const missing = clips.filter((clip) => !existsSync(join(out, `${clip.id}.mp3`)));
// --reverse works from the end of the list, so a second run can share the work.
if (process.argv.includes('--reverse')) missing.reverse();
const todo = missing.slice(0, limit);
console.log(`${clips.length} sentences, ${clips.length - missing.length} already recorded, ${todo.length} to record now.`);
if (todo.length === 0) process.exit(0);

const tts = await KokoroTTS.from_pretrained(voice.model, { dtype: voice.dtype, device: 'cpu' });

/** Cuts the silence at each end, leaving a breath of it, with a short fade so nothing clicks. */
function trim(samples, rate) {
  const threshold = 0.006;
  const keep = Math.round(rate * 0.04);
  let start = 0;
  let end = samples.length - 1;
  while (start < samples.length && Math.abs(samples[start]) < threshold) start++;
  while (end > start && Math.abs(samples[end]) < threshold) end--;
  const cut = samples.slice(Math.max(0, start - keep), Math.min(samples.length, end + 1 + keep));
  const fade = Math.min(Math.round(rate * 0.006), Math.floor(cut.length / 2));
  for (let i = 0; i < fade; i++) {
    cut[i] *= i / fade;
    cut[cut.length - 1 - i] *= i / fade;
  }
  return cut;
}

function mp3(samples, rate) {
  const pcm = Int16Array.from(samples, (v) => Math.max(-32768, Math.min(32767, Math.round(v * 32767))));
  const encoder = new Mp3Encoder(1, rate, 40);
  const parts = [];
  for (let i = 0; i < pcm.length; i += 1152) {
    const part = encoder.encodeBuffer(pcm.subarray(i, i + 1152));
    if (part.length) parts.push(Buffer.from(part));
  }
  parts.push(Buffer.from(encoder.flush()));
  return Buffer.concat(parts);
}

const started = Date.now();
let seconds = 0;
for (const [i, clip] of todo.entries()) {
  const file = join(out, `${clip.id}.mp3`);
  // Another run may have recorded it meanwhile.
  if (existsSync(file)) continue;
  const audio = await tts.generate(clip.text, { voice: voice.voice, speed: voice.speed });
  const samples = trim(audio.audio, audio.sampling_rate);
  if (samples.length < audio.sampling_rate * 0.2) {
    console.warn(`\nVery short clip (${(samples.length / audio.sampling_rate).toFixed(2)} s) for: ${clip.text}`);
  }
  seconds += samples.length / audio.sampling_rate;
  // Written to a temporary name of this run's own first, so a stopped run never
  // leaves half a clip, and two runs never write the same file at once.
  const part = `${file}.${process.pid}.part`;
  writeFileSync(part, mp3(samples, audio.sampling_rate));
  renameSync(part, file);
  if ((i + 1) % 25 === 0 || i + 1 === todo.length) {
    const elapsed = (Date.now() - started) / 1000;
    const left = (elapsed / (i + 1)) * (todo.length - i - 1);
    process.stdout.write(
      `\r${i + 1}/${todo.length} recorded, ${(seconds / 60).toFixed(1)} min of speech, about ${Math.ceil(left / 60)} min to go   `,
    );
  }
}
console.log('\nDone.');
