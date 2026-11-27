// A course's narration, step by step, as the reader shows it. Used by the reader
// (src/pages/practice/[set]/index.astro) to write each step's clips into the page,
// and by the list of every sentence to record (src/pages/voice/corpus.json.ts), so
// the two can never disagree. Questions have their own (questionNarration, used by
// src/components/QuizCard.astro).

import { sectionsOf, type Scenario, type Section } from './scenarios';
import { sets, type SetId } from './site';
import { moduleOf } from './modules';
import { courses, accessories } from './courses';
import { donePieces, introPieces, learnPieces, wrapPieces } from './narration';

/** How long a module takes, in minutes, as its intro says. */
export const minutesFor = (questions: number) => Math.max(2, Math.round(questions * 0.75));

/** A course's modules. A course without any is treated as one module named after the course. */
export function topicsOf(id: SetId, scenarios: Scenario[]): Section[] {
  const sectioned = sectionsOf(id, scenarios);
  return sectioned.length > 0 ? sectioned : [{ id, name: sets[id].name, blurb: sets[id].blurb, scenarios }];
}

export interface StepNarration {
  /** An intro or a lesson card. */
  say?: string[];
  /** A wrap-up. */
  wrap?: ReturnType<typeof wrapPieces>;
}

/** Every intro, lesson card and wrap-up in a course, by step key, and its summary. */
export function courseNarration(id: SetId, scenarios: Scenario[]) {
  const steps = new Map<string, StepNarration>();
  topicsOf(id, scenarios).forEach((topic, t) => {
    const module = moduleOf(id, topic.id);
    steps.set(`intro-${topic.id}`, {
      say: introPieces({
        key: `intro-${topic.id}`,
        name: topic.name,
        lead: module?.lead ?? [topic.blurb],
        questions: topic.scenarios.length,
        minutes: minutesFor(topic.scenarios.length),
        first: t === 0,
      }),
    });
    module?.sections.forEach((section, i) => steps.set(`learn-${topic.id}-${i + 1}`, { say: learnPieces(section) }));
    if (module) steps.set(`wrap-${topic.id}`, { wrap: wrapPieces({ key: `wrap-${topic.id}`, habit: module.habit }) });
  });
  const unlock = courses[id].unlock;
  return { steps, done: donePieces({ course: sets[id].name, unlock: unlock ? accessories[unlock].name : undefined }) };
}
