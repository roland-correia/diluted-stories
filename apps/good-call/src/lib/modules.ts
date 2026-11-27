// What each module (a topic of a course) teaches around its questions, in the
// reader's order:
// - its intro: one idea to carry through it (the lesson's opener, or the brief's idea),
// - its lesson, if it has one (src/lib/lessons.ts): short cards to tap through,
// - then its questions,
// - then its wrap-up: one habit to try, planned as "When ..., I will ...".
//
// The habit is the point. Planning when and where to act on an intention
// ("implementation intentions") makes people much more likely to follow through
// (Gollwitzer and Sheeran, 2006). See docs/learning-science.md.
//
// Keyed by `${set}/${topic}`, as the topics are named in src/lib/site.ts.

import { lessonOf, type LessonSection } from './lessons';
import { sets, type SetId, type GroupId } from './site';

export interface Habit {
  /** A short name: "Ask before you post". */
  name: string;
  /** What to do, in a sentence or two. */
  text: string;
}

export interface Brief {
  /** The one idea to carry through the module. */
  idea: string;
  habit: Habit;
}

export const briefs: Record<string, Brief> = {
  // ---------------------------------------------------------------- consent
  'consent/touch': {
    idea: 'Everyone decides who touches them and how, even for a hug.',
    habit: { name: "Offer, don't assume", text: 'Before a hug or a friendly touch, offer it and let them choose. A wave or a high five is just as warm.' },
  },
  'consent/privacy': {
    idea: 'A photo, a message or a secret belongs to the person it is about. Sharing it is their call.',
    habit: { name: 'Ask before you share', text: "Before you post, forward or screenshot anything about someone else, ask them. If you can't ask, don't share." },
  },
  'consent/texting': {
    idea: 'Interest shows up as effort. Short replies, long gaps and "maybe" are answers too.',
    habit: { name: 'Once, then leave it', text: 'Ask once. If the answer is no, vague or silence, send one friendly line and stop. No double texts.' },
  },
  'consent/pressure': {
    idea: "When saying no costs something, a yes isn't free. Pressure, guilt and power gaps cancel consent.",
    habit: { name: 'Make no easy', text: 'When you ask anyone for anything, add an easy way out, such as "No worries if not", and mean it.' },
  },
  'consent/nights': {
    idea: 'Drink changes what people can agree to, and looking out for each other is part of a good night.',
    habit: { name: 'The buddy check', text: 'On a night out, agree with a mate to check in with each other, and to step in if someone looks too drunk or uneasy.' },
  },
  'consent/intimacy': {
    idea: 'Consent is a clear, free yes to this, now, with you. It can change at any point.',
    habit: { name: 'Check in, out loud', text: 'Make one simple question part of every intimate moment: "Is this OK?" Then listen to the answer.' },
  },
  'consent/yourself': {
    idea: 'Porn is a performance made to be watched. Noticing how it shapes you is the first step to choosing.',
    habit: { name: 'Notice the after-feeling', text: 'After watching anything sexual, take ten seconds to notice how you feel. If it is often worse, that is worth knowing.' },
  },
  'consent/relationships': {
    idea: 'Couples do best when porn is something they can talk about calmly, without shame or secrets.',
    habit: { name: "Talk, don't test", text: 'If porn is affecting your relationship, raise it at a calm moment. Say how you feel, then ask how they feel.' },
  },

  // ---------------------------------------------------------------- race and equality
  'racism/online': {
    idea: 'Online, silence lets hate spread. A report, a reply or a kind message to the person targeted all count.',
    habit: { name: 'Report, then reach out', text: 'When you see racist content, report it. If you know the person targeted, send them a short message of support.' },
  },
  'racism/everyday': {
    idea: 'Everyday racism often arrives as a question or a joke. Impact matters more than intent.',
    habit: { name: "That's not OK", text: 'Have one short line ready, such as "That\'s not OK", and use it the next time you hear a racist remark.' },
  },
  'racism/family': {
    idea: 'Children learn what is normal from the adults they love, including what is said about skin colour.',
    habit: { name: 'Notice the message', text: 'Notice one comment at home about skin colour or race, and question it gently, most of all when children can hear.' },
  },
  'racism/work': {
    idea: 'At work, racism often hides in small decisions: who is trusted, named, hired or watched.',
    habit: { name: 'Check the reason', text: 'Before a decision about someone at work, ask: would I decide the same if their name or skin colour were different?' },
  },

  // ---------------------------------------------------------------- parenting
  'parent-newborn/safety': {
    idea: 'A few habits prevent most serious harm in the first weeks: safer sleep, never shaking, and asking for help early.',
    habit: { name: 'Back to sleep, every sleep', text: "On their back, in their own clear cot, day and night. Feeling sleepy while feeding on the sofa? Put the baby down first." },
  },
  'parent-newborn/bonding': {
    idea: 'Bonding grows over weeks, not in one moment. How the parents are coping matters too.',
    habit: { name: 'How are you, really?', text: 'Once a day, ask your partner or a friend how they really are, and answer the same question honestly yourself.' },
  },
  'parent-newborn/care': {
    idea: 'Feeding choices are yours. Routine checks and vaccinations protect your baby when they are most vulnerable.',
    habit: { name: 'Write it down', text: 'Keep a note on your phone of dates for jabs and reviews, and questions to ask, so nothing depends on memory at 3am.' },
  },
  'parent-baby/safety': {
    idea: 'Babies move before you expect them to, and most accidents at this age happen at home, in seconds.',
    habit: { name: 'The floor-level scan', text: "Get down to your baby's height and look for anything they could grab, swallow or pull over." },
  },
  'parent-baby/connection': {
    idea: 'Babies build trust through countless small moments of attention and return.',
    habit: { name: 'Phone down, eyes up', text: 'Choose one routine, such as a feed or bath time, to be phone-free every day.' },
  },
  'parent-baby/growing': {
    idea: "Development has a wide range of normal. Comparing babies tells you less than watching your own.",
    habit: { name: "Watch, don't compare", text: 'Note one new thing your baby does, without checking what other babies are doing.' },
  },
  'parent-toddler/safety': {
    idea: "Toddlers are fast and curious, and can't judge danger yet. A few habits remove most of the risk.",
    habit: { name: 'Up and out of reach', text: 'Do a five-minute sweep: medicines, button batteries, hot drinks and cleaning products, up high or locked away.' },
  },
  'parent-toddler/feelings': {
    idea: 'A tantrum is a feeling too big to handle, not a plan to wind you up.',
    habit: { name: 'Name it, hold it', text: 'When feelings boil over, name the feeling and hold the limit: "You\'re cross. We\'re still leaving."' },
  },
  'parent-toddler/growing': {
    idea: 'Talking, potty training and independence arrive at different ages, and pressure slows them down.',
    habit: { name: 'Narrate the day', text: 'Talk through what you are doing together, like "Socks on, now shoes", to build words without testing.' },
  },
  'parent-toddler/values': {
    idea: "Biting, grabbing and \"Mine!\" are normal stages. Calm, consistent responses teach kindness best.",
    habit: { name: 'Show the kind way', text: 'When they snatch or hit, calmly show what to do instead: "Gentle hands" or "Ask for a turn."' },
  },
  'parent-preschool/safety': {
    idea: 'Clear words and simple rules keep pre-schoolers safe: on roads, in crowds and with their bodies.',
    habit: { name: 'Practise the plan', text: 'Rehearse one safety rule as a game, such as what to do if they get lost.' },
  },
  'parent-preschool/feelings': {
    idea: 'Big changes, like starting school or losing someone, need honest words and lots of reassurance.',
    habit: { name: 'Best bit, hard bit', text: 'At bedtime, ask "What was the best bit and the hardest bit of today?" and just listen.' },
  },
  'parent-preschool/growing': {
    idea: 'Bedwetting and screen meltdowns are normal at this age, and calm routines help more than pressure.',
    habit: { name: 'Warn before it ends', text: 'Give a two-minute warning before screens or play end, every time.' },
  },
  'parent-preschool/values': {
    idea: 'A fib or a loud question is a sign of a growing mind. Calm honesty teaches more than shame.',
    habit: { name: 'Thank the truth', text: 'When they own up, thank them for telling you before you deal with what happened.' },
  },
  'parent-school/safety': {
    idea: 'In the primary years, more happens out of your sight. Children stay safer when they know they can tell you anything.',
    habit: { name: 'Tell me, no trouble', text: 'Say it out loud: "If anything online or anywhere worries you, tell me. You won\'t be in trouble."' },
  },
  'parent-school/feelings': {
    idea: 'Children share worries when they feel heard, not fixed. A calm reaction is what makes them tell you next time.',
    habit: { name: 'Listen to the end', text: 'Next time they bring you a worry, hear the whole story before you say anything.' },
  },
  'parent-school/growing': {
    idea: 'Puberty, sleepovers and learning differences arrive at different times. Talk early, and ask the school when unsure.',
    habit: { name: 'Talk before it starts', text: 'Find one natural moment to start a conversation about growing up, before it becomes urgent.' },
  },
  'parent-school/values': {
    idea: 'Character grows from responsibility, and from praise for effort rather than for being clever.',
    habit: { name: 'Praise the effort', text: 'Swap "You\'re so clever" for what they did: "You kept going when it was hard."' },
  },
  'parent-teen/safety': {
    idea: 'Teenagers stay safer when they know they can always call you, without a lecture.',
    habit: { name: 'The no-lecture lift', text: 'Tell them: "Ring me any time, from anywhere, and I\'ll come. No lecture tonight."' },
  },
  'parent-teen/feelings': {
    idea: 'Teenagers open up to adults who stay calm and listen. Panic and punishment shut the door.',
    habit: { name: 'Side by side', text: 'Have one chat while doing something together, like driving or cooking. It is easier than face to face.' },
  },
  'parent-teen/growing': {
    idea: 'Exams, setbacks and different paths are part of growing up. Your support matters more than the plan.',
    habit: { name: 'Ask more than you tell', text: 'Ask one curious question about their plans or worries, then just listen.' },
  },
  'parent-teen/values': {
    idea: 'Respecting their privacy and owning your mistakes builds trust, unless their safety is truly at risk.',
    habit: { name: 'Say what and why', text: "If you need to step in, tell them what you are doing and why, rather than checking in secret." },
  },
  'parent-adoption/identity': {
    idea: "A child's story belongs to them. Telling it early, truthfully and often protects their sense of self.",
    habit: { name: 'Story time', text: 'Find one natural moment to talk about their story, at their level, without pressure.' },
  },
  'parent-adoption/belonging': {
    idea: 'Behaviour that comes from early trauma needs understanding and safety, not only consequences.',
    habit: { name: 'Connect, then correct', text: 'When behaviour is hard, get down to their level and say what you see before you set a limit.' },
  },
  'parent-you/support': {
    idea: 'Children do best when the adults caring for them are supported too. Asking for help is part of parenting well.',
    habit: { name: 'Name one ask', text: 'Next time someone says "Let me know if you need anything", name one specific thing.' },
  },
  'parent-you/repair': {
    idea: 'Every parent loses their temper sometimes. The repair is what children remember.',
    habit: { name: 'Repair out loud', text: "After a hard moment, go back and say sorry, what happened, and what you'll try next time." },
  },

  // ---------------------------------------------------------------- work
  'interview/opening': {
    idea: 'Opening questions are really asking one thing: why you, for this job, with these people.',
    habit: { name: 'Your three sentences', text: "Write what you do now, what you're good at, and why this job. Say it out loud twice." },
  },
  'interview/examples': {
    idea: '"Tell me about a time" wants one real example: the situation, what you did, and how it turned out.',
    habit: { name: 'Bank three stories', text: 'Write down three real examples from work, study or life, each with what you did and how it turned out.' },
  },
  'interview/tricky': {
    idea: 'Pausing, asking for the question again and asking for adjustments all show good judgement.',
    habit: { name: 'Practise the pause', text: 'Answer one hard question out loud, starting with a breath: "Let me think about that for a second."' },
  },
  'administrator/trust': {
    idea: 'Confidentiality and honesty are the heart of office work. When in doubt, check before you share.',
    habit: { name: 'Verify first', text: 'Before you share personal information, check who is asking and whether they are allowed to know.' },
  },
  'administrator/priorities': {
    idea: 'When everything is urgent: ask, plan, and tell people early.',
    habit: { name: 'Flag it early', text: 'If something will be late, tell the person as soon as you know, not at the deadline.' },
  },
  'administrator/people': {
    idea: 'Professional relationships rest on discretion, calm and taking feedback well.',
    habit: { name: 'Listen, sum up, reply', text: 'When someone is upset or critical, let them finish, sum up what you heard, then reply.' },
  },
  'administrator/asking': {
    idea: 'Asking for training, time or adjustments is part of doing a job well.',
    habit: { name: 'One clear ask', text: 'Write down one thing that would help you work better, and ask for it.' },
  },
  'customer-service/complaints': {
    idea: 'Listen first, never guess, and say what you can do.',
    habit: { name: 'Heard, then helped', text: "With your next complaint, repeat back what the customer needs before you offer a fix." },
  },
  'customer-service/pressure': {
    idea: 'Staying calm under pressure is a skill, and so is knowing when to hand over or end a conversation.',
    habit: { name: 'Your exit line', text: 'Prepare one calm line for abuse: "I want to help, but I can\'t carry on if you speak to me like that."' },
  },
};

/** Moments to tie a habit to, by shelf. The visitor can also write their own. */
export const cues: Record<GroupId, string[]> = {
  everyday: ["Next time I'm out", "Next time I'm on my phone", 'Next time it comes up with friends'],
  parenting: ['At bedtime tonight', 'At our next meal together', 'Next time it comes up'],
  work: ['At work tomorrow', 'Before my next interview', 'Next time it comes up'],
};

export interface Module {
  /** The intro's lines: the first is the big one. */
  lead: string[];
  /** Cards to tap through before the questions. Empty when there is no lesson. */
  sections: LessonSection[];
  habit: Habit;
}

export function moduleOf(set: SetId, topic: string): Module | undefined {
  const lesson = lessonOf(set, topic);
  if (lesson) return { lead: lesson.opener, sections: lesson.sections, habit: lesson.habit };
  const brief = briefs[`${set}/${topic}`];
  if (brief) return { lead: [brief.idea], sections: [], habit: brief.habit };
  return undefined;
}

export const cuesFor = (set: SetId) => cues[sets[set].group as GroupId];
