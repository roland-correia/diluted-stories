// Every sentence Listen can say, with its clip id: the list tools/voice/ records from.
// Built with the site (dist/voice/corpus.json), from the same narration the pages use,
// so it is always complete. The build also says how many clips are still missing.

import type { APIRoute } from 'astro';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getLiveSets } from '../../lib/scenarios';
import { courseNarration } from '../../lib/course-narration';
import { questionNarration, SAMPLE } from '../../lib/narration';
import { clipsOf, VOICE } from '../../lib/voice-clips';

export const GET: APIRoute = async () => {
  const pieces: string[] = [SAMPLE];
  for (const { id, scenarios } of await getLiveSets()) {
    const course = courseNarration(id, scenarios);
    for (const step of course.steps.values()) {
      if (step.say) pieces.push(...step.say);
      if (step.wrap) pieces.push(...step.wrap.complete, ...step.wrap.partial, ...step.wrap.planned, ...step.wrap.plan);
    }
    pieces.push(...course.done.complete, ...course.done.progress);
    for (const entry of scenarios) {
      const q = questionNarration(entry);
      pieces.push(...q.base, ...q.options, ...q.chosen.flat(), ...q.good, ...q.other.flat(), ...q.takeaway);
    }
  }

  // One entry per distinct sentence.
  const clips = new Map<string, string>();
  for (const piece of clipsOf(pieces)) for (const clip of piece) clips.set(clip.id, clip.text);
  const dir = join(process.cwd(), 'public', 'voice', 'clips');
  const missing = [...clips.keys()].filter((id) => !existsSync(join(dir, `${id}.mp3`))).length;
  const characters = [...clips.values()].reduce((sum, text) => sum + text.length, 0);
  console.log(
    `[voice] ${clips.size} sentences (${characters} characters); ${missing === 0 ? 'every clip is recorded' : `${missing} clips still to record: run npm run generate in tools/voice/`}`,
  );

  return new Response(JSON.stringify({ voice: VOICE, clips: [...clips].map(([id, text]) => ({ id, text })) }, null, 1), {
    headers: { 'Content-Type': 'application/json' },
  });
};
