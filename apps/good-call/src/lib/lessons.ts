// Module notes: short teaching shown at the start of a topic in the reader,
// before its first question (src/components/Lesson.astro). A topic without an
// entry here goes straight to its questions.
//
// Keyed by `${set}/${topic}`, as the topics are named in src/lib/site.ts.
// Keep every claim to what the evidence or the law supports, and describe nothing
// in detail: these are read by people aged 13 and over.

export interface LessonSection {
  heading: string;
  text?: string;
  /** A small table: column headings, then rows of cells. */
  table?: { head: string[]; rows: string[][] };
  /** Points with a bold lead-in: "Your brain is biased." then the rest. */
  points?: { term: string; text: string }[];
  items?: string[];
  /** Number the items (a self-check or a sequence of steps) rather than ticking them. */
  ordered?: boolean;
  /** A line after the list. */
  after?: string;
}

export interface Lesson {
  /** The opener: one fact or idea to carry through the module. */
  opener: string[];
  sections: LessonSection[];
  /** One habit to practise this week. */
  habit: { name: string; text: string };
}

export const lessons: Record<string, Lesson> = {
  'respect-first/signals': {
    opener: [
      'The only reliable sign of what someone wants is what they tell you, clearly and freely.',
      'Research keeps finding the same thing: men often read sexual interest into friendliness, looks and clothing that were never meant that way, and most of all when they find the woman attractive.',
    ],
    sections: [
      {
        heading: 'What looks like a signal, and what it usually means',
        table: {
          head: ['What you notice', 'What it usually means'],
          rows: [
            ['Eye contact', "She's listening, being polite, or noticed you. That's all."],
            ['Smiling or laughing at your jokes', "She's friendly, being kind, or it's part of her job."],
            ['Being chatty at work, a shop or a bar', 'Customer service, good manners or a friendly personality.'],
            ['A short dress, tight top or make-up', 'Her style, the weather, the occasion, or how she likes to feel.'],
            ['Dancing near you or touching your arm', 'Enjoying the music or a friendly habit. Still not an invitation.'],
            ['Saying yes to a drink or a chat', 'Yes to a drink or a chat. Nothing more.'],
          ],
        },
      },
      {
        heading: 'Three things to know',
        points: [
          {
            term: 'Your brain is biased.',
            text: 'Men overestimate women\'s interest, and most of all when they find the woman attractive. Feeling sure is not the same as being right.',
          },
          {
            term: 'Clothes are about her, not you.',
            text: 'People dress for comfort, style, confidence, culture, friends or the weather. What someone wears never makes them available.',
          },
          {
            term: 'Notice the "no" signals.',
            text: 'Short answers, looking at their phone, turning away, a friend stepping in, or leaving. Silence, hesitation and "maybe" all mean no for now.',
          },
        ],
      },
      {
        heading: 'How to check, simply',
        items: [
          '"I\'ve enjoyed chatting. Would you like to swap numbers?"',
          '"Would you like to get a drink some time, or are you happy just chatting?"',
        ],
        after: 'Then accept any answer, including no answer, warmly and without pushing.',
      },
    ],
    habit: {
      name: 'Name it, check it',
      text: 'When you catch yourself thinking "she\'s into me", name your evidence. If it\'s a look, a smile or her clothes, it isn\'t evidence. If you want to know, ask once, kindly, and respect the answer.',
    },
  },

  'respect-first/consent': {
    opener: [
      'In England and Wales, a person consents only if they agree by choice and have the freedom and capacity to make that choice (Sexual Offences Act 2003, section 74).',
      'Scotland and Northern Ireland have their own laws, which work in a similar way.',
    ],
    sections: [
      {
        heading: 'The three parts of consent',
        table: {
          head: ['Part', 'What it means', "When it's missing"],
          rows: [
            ['Choice', 'They actively want to, not just go along with it.', "They're silent, frozen, or saying yes to make it stop."],
            ['Freedom', 'Nothing is pushing them into it.', 'Pressure, threats, guilt, or a power gap such as a boss, someone much older, or money.'],
            ['Capacity', "They're able to decide.", 'Asleep, unconscious, very drunk or high, or under 16, the age of consent.'],
          ],
        },
      },
      {
        heading: 'Key points',
        points: [
          { term: 'Consent can stop at any moment.', text: 'If someone wants to stop, you stop.' },
          { term: "Yes to one thing isn't yes to everything.", text: "Kissing isn't agreement to more. Yes last week isn't yes tonight." },
          {
            term: 'Pressure cancels consent.',
            text: 'Asking again and again, sulking, guilt-tripping or "you owe me" are pressure, not persuasion.',
          },
          {
            term: '"She didn\'t say no" is not enough.',
            text: 'The law asks whether a belief in consent was reasonable, looking at the steps taken to check. Asking protects everyone.',
          },
          { term: "If you're unsure, stop and ask.", text: 'Uncertainty is your answer until they tell you otherwise.' },
        ],
      },
      {
        heading: 'Phrases that make checking normal',
        items: ['"Is this OK?"', '"Do you want to keep going?"', '"We can stop whenever. No problem."'],
      },
    ],
    habit: {
      name: 'The pause',
      text: 'Before any physical step, pause and check. Asking feels awkward only at first, and a confident, caring question is attractive, not a mood-killer.',
    },
  },

  'respect-first/people': {
    opener: [
      'Noticing that someone is attractive is normal. What you do next is a choice, and that choice is what this module trains.',
      'In a UK survey, over 70% of women said they had been sexually harassed in public. So a stare or comment that feels harmless to you can feel like a threat to her, because she can\'t know what you\'ll do next.',
    ],
    sections: [
      {
        heading: 'Behaviours that cross the line',
        items: [
          'Staring, or looking her up and down.',
          'Comments about her body, even "compliments" from a stranger.',
          'Whistling, beeping or calling out.',
          'Following, or not taking the hint when she moves away.',
          "Sending sexual images she didn't ask for, which is a criminal offence in England and Wales.",
          'Sexual jokes or comments at work, which can be unlawful harassment under the Equality Act 2010.',
        ],
      },
      {
        heading: 'What to do instead',
        points: [
          { term: 'The second-look rule.', text: "Notice, then look away. Don't keep looking, comment or follow." },
          {
            term: 'Talk to the person, not the body.',
            text: "If you're in a natural conversation, ask about her interests, work or opinions, and listen.",
          },
          { term: 'Give space.', text: 'On a quiet street at night, cross over or let her walk ahead.' },
          {
            term: 'Check your group.',
            text: 'When friends rate women, share photos or make comments, change the subject, refuse to join in, or say "not cool". Most men privately disapprove too, so you\'re rarely alone.',
          },
        ],
      },
    ],
    habit: {
      name: 'The people check',
      text: "Each time you notice someone's body, deliberately notice one thing about them as a person instead, such as what they're doing, saying or carrying.",
    },
  },

  'respect-first/porn': {
    opener: [
      'For many people, porn was their first picture of sex, often from around age 13. This module separates what porn shows from how real sex and real consent work, without shaming anyone for having watched it.',
    ],
    sections: [
      {
        heading: 'Porn and real life',
        table: {
          head: ['In porn', 'In real life'],
          rows: [
            ['Scripted, edited and performed for a camera.', 'Unscripted, between two people who both matter.'],
            ['Consent is agreed off camera, so you never see anyone asking.', 'Asking and checking in are part of it, all the way through.'],
            ['Everyone always wants everything, instantly.', 'People have moods, limits and the right to stop.'],
            [
              'Rough or degrading acts are shown as normal and welcome.',
              "Many people don't want them. Non-fatal strangulation, often called choking, is a specific crime in England and Wales, and it can kill.",
            ],
            ['Bodies, stamina and reactions are selected and exaggerated.', 'Real bodies vary, and real reactions are quieter and mixed.'],
          ],
        },
      },
      {
        heading: 'Points to remember',
        points: [
          { term: 'Porn is a performance, not a guide.', text: 'Like an action film: entertaining to some, but not how things work.' },
          {
            term: 'Watch for its scripts in your head.',
            text: "If you expect women to want what porn shows, the first module's habit applies. Ask, don't assume.",
          },
          {
            term: 'Content involving anyone under 18, or anyone not consenting, is illegal and harmful.',
            text: "If you've seen or sought it out, stop, and contact Stop It Now (in the help list below). They're confidential and there to help you stop.",
          },
        ],
      },
      {
        heading: 'When it becomes a problem',
        text: 'The World Health Organization describes compulsive sexual behaviour disorder as a persistent failure to control intense, repetitive sexual urges over a long period, usually six months or more, causing marked distress or harm to daily life. Feeling guilty about porn is not, on its own, a sign of addiction.',
      },
      {
        heading: 'A self-check, not a diagnosis',
        ordered: true,
        items: [
          "Have I tried to cut down and found I couldn't?",
          'Am I spending more time on it than I mean to?',
          'Do I need more extreme content to feel the same?',
          'Do I use it mainly to cope with stress, boredom or loneliness?',
          'Is it hurting my sleep, work, money or relationships?',
          'Am I hiding it, or lying about it?',
        ],
        after: 'If several of these are true, or one is causing real harm, the next module and the help list are your next steps.',
      },
    ],
    habit: {
      name: 'Notice the script',
      text: 'When a thought about sex comes from porn, label it "porn script" and ask what the real person in front of you might actually want.',
    },
  },

  'respect-first/habit': {
    opener: [
      'Habits change through small, repeated actions, not willpower or guilt. These steps draw on acceptance and commitment therapy (ACT), which showed promising results in a small trial, and on standard habit-change practice.',
    ],
    sections: [
      {
        heading: 'Eight steps',
        ordered: true,
        points: [
          {
            term: 'Write your reason.',
            text: 'In your own words, write why you want to change, such as the partner you want to be or how you want to feel. Read it when urges hit.',
          },
          {
            term: 'Know your triggers.',
            text: 'Track when urges come for a week. Common ones are being bored, stressed, lonely, tired, alone with your phone late at night, or after a bad day.',
          },
          {
            term: 'Make it harder.',
            text: 'Use content blockers, keep your phone out of the bedroom, and delete apps and accounts that lead you there.',
          },
          {
            term: 'Ride the urge.',
            text: 'Notice it, name it ("this is an urge"), and let it rise and fall without acting on it. Urges peak and pass, and each one you ride makes the next easier.',
          },
          {
            term: 'Have a swap ready.',
            text: 'Pick something you can do straight away: a walk, push-ups, a shower, calling a friend, or leaving the room.',
          },
          {
            term: 'Treat slips as information.',
            text: "A slip doesn't wipe out your progress. Ask what triggered it and adjust your plan, without beating yourself up.",
          },
          { term: 'Tell someone you trust.', text: 'A friend, partner, mentor or counsellor makes it easier to keep going.' },
          {
            term: 'Get professional help if you need it.',
            text: "If you've tried and can't cut down, if it's harming your life, or if it's tied to low mood, anxiety or loneliness. The help list below says where to start.",
          },
        ],
      },
      {
        heading: 'Be part of a better norm',
        text: "Men tend to overestimate how sexist other men are. When you challenge a disrespectful comment, you're usually saying what others already think. Four ways to step in safely:",
        points: [
          { term: 'Direct:', text: '"Not cool, mate."' },
          { term: 'Distract:', text: 'change the subject or interrupt the moment.' },
          { term: 'Delegate:', text: 'get help from staff, security or a friend.' },
          { term: 'Delay:', text: 'check in with the person affected afterwards.' },
        ],
      },
    ],
    habit: {
      name: 'Your plan',
      text: 'Write down one trigger, one barrier, one swap and one person you will tell. Keep it somewhere private, such as a note on your phone.',
    },
  },
};

export const lessonOf = (set: string, topic: string): Lesson | undefined => lessons[`${set}/${topic}`];
