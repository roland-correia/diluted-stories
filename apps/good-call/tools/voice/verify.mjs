// Checks the built site (apps/good-call/dist) uses the recorded voice everywhere:
// - every step of every reader, and every scenario page, carries the ids of its clips
//   (a step without them would be read by the device's voice instead),
// - every id points to a clip that exists, and every clip is a real MP3 frame stream,
// - no clip is left over that nothing uses.
// Run after npm run build: npm run verify, here in tools/voice/.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = fileURLToPath(new URL('../../', import.meta.url));
const dist = join(app, 'dist');
const clipsDir = join(dist, 'voice', 'clips');
const problems = [];
const used = new Set();

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const tags = (html, pattern) => html.match(pattern) ?? [];

function useIds(value, where) {
  if (!value) return problems.push(`no clips: ${where}`);
  for (const id of value.split(/[| ]/).filter(Boolean)) {
    used.add(id);
    if (!existsSync(join(clipsDir, `${id}.mp3`))) problems.push(`missing clip ${id}: ${where}`);
  }
}

function checkScenarios(html, page) {
  for (const article of tags(html, /<article[^>]*data-scenario[^>]*>/g)) {
    const id = attr(article, 'data-id');
    for (const name of ['data-say-base', 'data-say-options', 'data-say-good', 'data-say-takeaway']) useIds(attr(article, name), `${page} ${id} ${name}`);
  }
  for (const option of tags(html, /<div[^>]*data-option[^>]*>/g)) {
    for (const name of ['data-say-chosen', 'data-say-other']) useIds(attr(option, name), `${page} option ${name}`);
  }
}

let readers = 0;
let steps = 0;
let scenarioPages = 0;
let questions = 0;
const practice = join(dist, 'practice');
for (const set of readdirSync(practice)) {
  const index = join(practice, set, 'index.html');
  if (!existsSync(index)) continue;
  const html = readFileSync(index, 'utf8');
  if (!html.includes('data-deck')) continue; // a redirect page
  readers++;
  for (const slide of tags(html, /<section[^>]*data-slide[^>]*>/g)) {
    steps++;
    const kind = attr(slide, 'data-kind');
    const key = `${set} ${attr(slide, 'data-key')}`;
    if (kind === 'intro' || kind === 'learn') useIds(attr(slide, 'data-say'), key);
    if (kind === 'wrap') for (const name of ['data-say-done', 'data-say-wrap', 'data-say-planned', 'data-say-plan']) useIds(attr(slide, name), `${key} ${name}`);
    if (kind === 'done') for (const name of ['data-say-complete', 'data-say-progress']) useIds(attr(slide, name), `${key} ${name}`);
  }
  questions += tags(html, /<article[^>]*data-scenario[^>]*>/g).length;
  checkScenarios(html, `/practice/${set}/`);
  // Each scenario's own page.
  for (const slug of readdirSync(join(practice, set))) {
    const page = join(practice, set, slug, 'index.html');
    if (slug === 'topics' || !existsSync(page)) continue;
    const own = readFileSync(page, 'utf8');
    if (!own.includes('data-scenario')) continue;
    scenarioPages++;
    checkScenarios(own, `/practice/${set}/${slug}/`);
  }
}

// The sample line under Aa, on every page.
const home = readFileSync(join(dist, 'index.html'), 'utf8');
useIds(attr(tags(home, /<button[^>]*data-voice-preview[^>]*>/g)[0] ?? '', 'data-say'), 'settings sample');

// Every clip: a real MP3 (frame sync at the start, after any ID3 tag), and not empty.
let clips = 0;
let bytes = 0;
const unused = [];
for (const file of readdirSync(clipsDir)) {
  if (!file.endsWith('.mp3')) {
    problems.push(`not a clip: ${file}`);
    continue;
  }
  clips++;
  const data = readFileSync(join(clipsDir, file));
  bytes += statSync(join(clipsDir, file)).size;
  const start = data[0] === 0x49 && data[1] === 0x44 && data[2] === 0x33 ? 10 + ((data[6] << 21) | (data[7] << 14) | (data[8] << 7) | data[9]) : 0;
  if (!(data[start] === 0xff && (data[start + 1] & 0xe0) === 0xe0)) problems.push(`not an MP3: ${file}`);
  if (data.length < 1500) problems.push(`suspiciously small (${data.length} bytes): ${file}`);
  if (!used.has(file.slice(0, -4))) unused.push(file);
}

console.log(`${readers} readers, ${steps} steps, ${questions} questions, ${scenarioPages} scenario pages`);
console.log(`${clips} clips (${(bytes / 1e6).toFixed(1)} MB), ${used.size} used, ${unused.length} unused`);
if (unused.length) console.log(`Unused (run npm run generate -- --prune): ${unused.slice(0, 5).join(', ')}${unused.length > 5 ? '…' : ''}`);
if (problems.length) {
  console.log(`\n${problems.length} problems:`);
  for (const problem of problems.slice(0, 30)) console.log(`- ${problem}`);
  process.exit(1);
}
console.log('Every step uses the recorded voice.');
