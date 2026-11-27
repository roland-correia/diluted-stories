// Lessons: short teaching at the start of a module in the reader, after its intro
// and before its questions, shown as cards to tap through (src/components/StepLearn.astro).
// Each section becomes one card, so keep sections short: a table of two columns
// becomes flip cards, points become cards that open, quoted phrases become speech
// bubbles, and numbered items become a self-check with boxes to tick.
// A module without a lesson has a brief instead (src/lib/modules.ts).
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
  /** A self-check: the items get boxes to tick, kept on screen only. (With `points`, it changes nothing.) */
  ordered?: boolean;
  /** A line after the list. */
  after?: string;
}

export interface Lesson {
  /** The opener: one fact or idea to carry through the module. */
  opener: string[];
  sections: LessonSection[];
  /** One habit to try, planned at the end of the module. */
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

  // ---------------------------------------------------------------- dating, apps and online life
  'online/apps': {
    opener: [
      'Dating apps are a normal way to meet people. A few habits keep them fun: take your time, check people are real, and keep your own way home.',
    ],
    sections: [
      {
        heading: 'Spotting a fake profile',
        table: {
          head: ['What you notice', 'What it might mean'],
          rows: [
            ['A few photos, all very polished', 'They may be someone else\'s. A reverse image search can show where they came from.'],
            ['Never able to video call', 'The most common sign of a catfish. A real person can manage a two-minute call.'],
            ['"I love you" within days', 'Love-bombing. Real feelings take time to grow.'],
            ['Asks for money, gift cards or crypto', 'A romance scam, every time. Stop, and report the profile.'],
            ['Wants to leave the app straight away', 'Apps can ban scammers; private chats cannot. Stay on the app until you have met.'],
          ],
        },
      },
      {
        heading: 'Before a first date',
        items: [
          'Video call first, so you know they are who they say they are.',
          'Meet somewhere public and busy, in the daytime if you can.',
          'Tell a friend who you are meeting, where, and when to expect a message.',
          'Get there and home under your own steam.',
          'Keep your drink with you, and leave whenever you want. You owe nobody the rest of the evening.',
        ],
      },
    ],
    habit: {
      name: 'The friend text',
      text: 'Before any first meet-up, text a friend who, where and when, and agree a time to check in.',
    },
  },

  'online/snap': {
    opener: [
      'Snapchat feels private because messages disappear. But screenshots, screen recordings and location sharing mean that what you send, and where you are, can last.',
    ],
    sections: [
      {
        heading: 'Myths and facts',
        table: {
          head: ['Myth', 'Fact'],
          rows: [
            ['Snaps disappear, so they are safe', 'Anyone can screenshot, save it in chat, or film it with another phone. Assume it can last.'],
            ['Only my friends can see me on the map', 'Check who your "friends" are. People you have never met could see where you live, study and sleep.'],
            ['Breaking a streak means I don\'t care', 'Streaks are designed to bring you back every day. A friendship is not a number.'],
            ['Quick Add only suggests people I know', 'It suggests people with friends in common, including strangers who have added lots of people your age.'],
          ],
        },
      },
      {
        heading: 'Your two-minute settings check',
        ordered: true,
        items: [
          'Map: who can see my location? Ghost Mode, or a few close friends only.',
          'Contact: only friends can message or call me.',
          'Friends: I have removed anyone I have never met in real life.',
          'Quick Add: I am not suggested to strangers.',
        ],
        after: 'Settings move around after updates, so look again every few months.',
      },
    ],
    habit: {
      name: 'Map check',
      text: 'Open your map settings and check exactly who can see where you are. Ghost Mode, or close friends only.',
    },
  },

  'online/nudes': {
    opener: [
      'Sending nudes is common, and so is being pressured to. You never owe anyone a picture. If one is shared or used against you, it is not your fault, and help works.',
    ],
    sections: [
      {
        heading: 'What the law says',
        text: 'In England and Wales:',
        points: [
          {
            term: 'Under 18.',
            text: 'Making, sending, asking for or keeping a sexual image of anyone under 18 is illegal, even of yourself, and even if everyone agreed. Between young people, the police usually focus on keeping everyone safe.',
          },
          {
            term: 'Sharing without consent.',
            text: 'Sharing, or threatening to share, an intimate image of anyone without their consent is a crime, at any age. That includes fake images made to look real.',
          },
          {
            term: 'Pictures nobody asked for.',
            text: 'Sending a picture of genitals to someone who did not ask for it can be cyberflashing, a crime since 2024.',
          },
        ],
      },
      {
        heading: 'If someone threatens to share your images',
        points: [
          { term: "Don't pay.", text: 'Paying rarely ends it. Blackmailers usually come back for more.' },
          { term: 'Stop replying.', text: "Block them, but don't delete the chat yet." },
          { term: 'Keep the evidence.', text: 'Screenshot the messages, their profile and any payment details they gave.' },
          {
            term: 'Get it taken down.',
            text: 'Under 18: Report Remove, from Childline and the Internet Watch Foundation. 18 or over: StopNCII.org and the Revenge Porn Helpline.',
          },
          { term: 'Tell someone.', text: 'A trusted adult, the police, or CEOP if you are under 18. You will not be in trouble.' },
        ],
      },
    ],
    habit: {
      name: 'Your no, ready',
      text: 'Choose a line for when someone asks for a nude, such as "Not my thing, but I\'m enjoying chatting", so you never have to find one under pressure.',
    },
  },

  'online/adult-sites': {
    opener: [
      'Since July 2025, UK sites and apps that allow porn must check that users are 18 or over. The checks exist because porn is not made for under-18s, and they have changed what is safe to click.',
    ],
    sections: [
      {
        heading: 'Real checks and fake ones',
        table: {
          head: ['What you see', 'What to know'],
          rows: [
            ['A face scan or ID check on a big, well-known site', 'This is how the law is meant to work. Read what the checking company keeps before you agree.'],
            ['A pop-up asking for card details to "prove your age"', 'Often a scam. A card number typed into an unknown site can be used to take money.'],
            ['A link promising "no checks"', 'Sites that skip the checks skip other rules too, on content, scams and malware.'],
            ['A warning that your device is infected, with a number to call', 'A scam. Close the tab. Never call the number or pay.'],
          ],
        },
      },
      {
        heading: 'Content that should never exist',
        points: [
          {
            term: 'Anyone who looks under 18.',
            text: "Close it, and report the link to the Internet Watch Foundation. You can do it anonymously. Don't download or share it, even to report it.",
          },
          {
            term: 'Anyone who did not agree.',
            text: 'Hidden cameras, leaked videos and revenge porn. Watching and sharing them adds to real harm. Report them to the site.',
          },
          {
            term: 'Fake nudes of real people.',
            text: 'Deepfakes made without consent hurt real people, and sharing them is a crime.',
          },
        ],
      },
    ],
    habit: {
      name: 'Close the tab',
      text: 'If a site asks for card details, says your device is infected, or shows anything that looks non-consensual or underage: close it, and report what should never exist.',
    },
  },

  'online/hooking-up': {
    opener: [
      'Good sex starts with a clear yes and ends with everyone feeling OK. Protection, testing and the morning after are part of looking after each other, and in England they are free.',
    ],
    sections: [
      {
        heading: 'Free on the NHS in England',
        points: [
          { term: 'Condoms.', text: 'Free from sexual health clinics, and from C-Card schemes for young people in many areas.' },
          { term: 'STI tests.', text: 'Free and confidential at sexual health clinics. Many areas post free test kits to your home.' },
          {
            term: 'The morning-after pill.',
            text: 'Free at most pharmacies since October 2025, with no GP appointment. The sooner it is taken, the better it works.',
          },
          {
            term: 'Advice.',
            text: 'From your GP, a sexual health clinic or Brook. It is confidential for under-16s too, unless someone is at risk of serious harm.',
          },
        ],
      },
      {
        heading: 'Checking in, naturally',
        items: ['"Do you want to?"', '"Have you got a condom, or shall I grab one?"', '"Still good?"'],
        after: 'Then listen to the answer. A clear, happy yes is the only green light.',
      },
    ],
    habit: {
      name: 'Test as routine',
      text: 'Book a sexual health check with each new partner, or every few months if you are having sex. Treat it like the dentist.',
    },
  },

  'online/feeds': {
    opener: [
      'Feeds are built to keep you scrolling, and anger and envy keep people scrolling longest. You can choose what you feed yourself.',
    ],
    sections: [
      {
        heading: 'What the feed shows you, and what you can do',
        table: {
          head: ['It shows you', 'Try this'],
          rows: [
            ['Bodies, money and lives that look effortless', 'It is edited and chosen. Unfollow accounts that leave you feeling worse.'],
            ['Influencers saying women are worth less, or men must dominate', 'Outrage is how they earn. Ask who profits, then mute or scroll past.'],
            ['A pile-on, everyone attacking one person', "Don't add to it. A report, or a private message of support, does more."],
            ['More of whatever you lingered on', 'Tap "Not interested", and reset your feed when it turns dark.'],
          ],
        },
      },
      {
        heading: 'Time for a break? A quick check',
        ordered: true,
        items: [
          'I reach for my phone without deciding to.',
          'I feel worse about my body, money or life after scrolling.',
          'I lose sleep to it.',
          'I feel angry or anxious most times I open the app.',
        ],
        after: 'If two or more are true, try one change this week, such as the phone out of the bedroom, or a time limit on one app.',
      },
    ],
    habit: {
      name: 'One unfollow a day',
      text: 'Each day, unfollow or mute one account that leaves you feeling worse, and notice how your feed changes.',
    },
  },
};

export const lessonOf = (set: string, topic: string): Lesson | undefined => lessons[`${set}/${topic}`];
