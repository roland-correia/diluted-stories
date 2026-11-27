export const SITE_NAME = 'Good Call';
export const TAGLINE = 'Practise the call before it counts.';
export const DESCRIPTION =
  'Short, realistic scenarios on consent, online life, racism, parenting and judgement at work. Choose what you would do, then see why each choice helps or harms. No timer and no account.';

// Where sets are listed. 'everyday' sets sit on the home page itself; the others
// each have their own page, reached from a tile on the home page.
export const groups = {
  everyday: { name: 'Relationships and society', path: '/' },
  parenting: { name: 'Parenting', path: '/parenting/' },
  work: { name: 'Work and careers', path: '/work/' },
} as const;

export type GroupId = keyof typeof groups;

// A "set" is a group of scenarios. `group` decides where it is listed (see `groups`).
// `live: false` shows as "coming later" and has no page yet.
export const sets = {
  consent: {
    name: 'Sex, consent and healthy relationships',
    group: 'everyday',
    blurb: 'Consent, sexuality and healthy relationships, in person, online and on screen',
    intro:
      'Consent is the foundation of every healthy relationship, from a hug to sex. This course covers bodily autonomy, sexual consent, digital boundaries, alcohol and power, and takes a frank, non-judgemental look at pornography: how it shapes expectations, relationships and wellbeing. Throughout, it looks from both sides: respecting other people\'s boundaries, and holding your own.',
    note: 'Covers dating, sex, alcohol and pornography. Nothing is described in detail. Written for adults. For talking to children about porn, see the parenting courses.',
    rules: [
      'Consent is a free choice. A yes given under pressure, fear or obligation is not one.',
      'It is specific. Yes to one thing, one time, with one person is not yes to anything else.',
      'It can be taken back at any point, with or without words.',
      'The person has to be able to choose. Very drunk, asleep or afraid is not able.',
      'If you are not sure, ask. Asking is not awkward. Guessing wrong is.',
      'Porn is a performance made to be watched. It is not a guide to sex, bodies or what people enjoy.',
      'The people on screen have to have agreed too. If it looks secret, leaked or underage, do not watch it or share it. Report it.',
    ],
    live: true,
  },
  'respect-first': {
    name: 'Respect First',
    group: 'everyday',
    blurb: 'For men and boys: swap guessing for asking, and impulse for choice',
    intro:
      'Respect First helps men and older boys swap guessing for asking, and impulse for choice. Its five short modules cover reading signals honestly, consent as the law defines it, seeing people rather than bodies, how porn differs from real life, and how to change a habit that is not working for you. Every answer comes with its reasoning, and nothing here is meant to shame anyone.',
    note: 'For men and boys aged 13 and over. The last two modules talk about porn directly and are for ages 16 and over. Nothing is described in detail. Where the law is mentioned, it is the law in England and Wales.',
    rules: [
      'The only reliable sign of what someone wants is what they tell you, clearly and freely.',
      'Friendly is not the same as interested. Eye contact, smiles and clothes are not signals.',
      'The more attracted you are, the more likely you are to misread someone. Feeling sure is not the same as being right.',
      'Consent means agreeing by choice, with the freedom and capacity to choose. It can stop at any moment.',
      'If you are unsure, stop and ask. Silence, freezing and "maybe" are not yes.',
      'Noticing someone is normal. Staring, commenting and following are choices, and they can feel like a threat.',
      'Porn is a performance, not a guide. Ask the real person what they want.',
      'Habits change through small, repeated steps, not shame. A slip is information, not failure.',
    ],
    live: true,
  },
  online: {
    name: 'Dating, apps and online life',
    group: 'everyday',
    blurb: 'Dating apps, Snapchat, nudes, adult sites and the pressure of the feed',
    intro:
      'Most relationships now start, grow and sometimes go wrong on a phone. This course covers dating apps and meeting up safely, Snapchat and sharing your location, nudes, sexting and sextortion, adult sites and the new age checks, hooking up and sexual health, and the pressure of feeds and influencers. It is frank, practical and written for life in the UK.',
    note: 'For ages 16 and over. Covers sex, nude images, porn sites and online blackmail. Nothing is described in detail. Where the law is mentioned, it is the law in England and Wales unless it says otherwise.',
    rules: [
      'You never owe anyone a photo, a reply, a meeting or anything else.',
      'Meet new people somewhere public, tell a friend where you will be, and keep your own way home.',
      'Share your location only with people you know and trust in real life.',
      'A sexual image of anyone under 18 is illegal to make, share or keep, even of yourself, and even if everyone agreed.',
      'If someone threatens to share your images, do not pay. Stop replying, keep the evidence and get help. It is not your fault.',
      'Sharing, or threatening to share, someone\'s intimate image without their consent is a crime.',
      'Condoms, STI tests and the morning-after pill are free from NHS services in England.',
      'Feeds are built to keep you scrolling. You choose who you follow and when you stop.',
    ],
    live: true,
  },
  racism: {
    name: 'Race and equality',
    group: 'everyday',
    blurb: 'Recognising racism and colourism, and responding with confidence',
    intro:
      'Racism ranges from open abuse to the quiet assumptions that shape who is trusted, hired and believed. This course builds the confidence to recognise it, respond to it and take responsibility when you get it wrong, as a bystander, as the person who caused harm, and as the person it happens to.',
    note: 'Describes racist remarks and behaviour, online and in person. No slurs are repeated. Written for adults.',
    rules: [
      'Impact matters more than intent. "I didn\'t mean it" does not undo how it landed.',
      'Silence looks like agreement. You do not need a speech. "That\'s not OK" is enough.',
      'Look after the person targeted first. Standing with them matters more than winning an argument.',
      'No skin tone is better than another. Praise for being lighter is the same prejudice as an insult for being darker.',
      'If you get it wrong, listen, apologise without excuses and change it. Being corrected is not an attack.',
      'Racist abuse and threats can be crimes, online as well as in person, and can be reported.',
    ],
    live: true,
  },
  'parent-newborn': {
    name: 'The early weeks: 0 to 3 months',
    group: 'parenting',
    blurb: 'Safety, bonding and recovery in the first months',
    intro:
      'The first weeks are the steepest learning curve most parents ever face, on the least sleep. This course covers what keeps a newborn safe, how bonding really happens, and why a parent\'s own wellbeing matters from day one.',
    note: "General guidance, not medical advice. If you are worried about your child's health, call NHS 111. In an emergency, call 999.",
    rules: [
      'Crying is normal, and it can be overwhelming. It is always OK to put your baby down safely and step away for a few minutes.',
      'Never shake a baby, however frustrated you feel.',
      'Every sleep, day and night: on their back, in their own clear cot. Never fall asleep with them on a sofa or armchair.',
      'Under 3 months, a temperature of 38C or higher needs advice the same day. Call NHS 111.',
      'A fed baby is the goal. How you feed is your decision.',
      'Feeling low for more than two weeks is a reason to talk to your GP or health visitor, for either parent.',
    ],
    live: true,
  },
  'parent-baby': {
    name: 'Infancy: 3 to 12 months',
    group: 'parenting',
    blurb: 'Safety, connection and development as your baby grows',
    intro:
      'In the first year babies begin to move, eat and explore. This course covers preventing the accidents that are most common at this age, building a secure attachment, and supporting development without comparing your baby to others.',
    note: "General guidance, not medical advice. If you are worried about your child's health, call NHS 111. In an emergency, call 999.",
    rules: [
      'Cut small round foods, such as grapes and cherry tomatoes, into quarters. Never leave a baby alone while eating.',
      'Babies roll and fall sooner than you expect. Change them on the floor, or keep a hand on them.',
      'Every journey, however short, in a properly fitted car seat.',
      'Talking, singing and back-and-forth babble build their brain more than any toy or app.',
      'Short, warm goodbyes at childcare. Sneaking out makes the next drop-off harder.',
    ],
    live: true,
  },
  'parent-toddler': {
    name: 'The toddler years: 1 to 3',
    group: 'parenting',
    blurb: 'Big emotions, boundaries and early independence',
    intro:
      'Toddlers feel everything intensely, with very little ability to manage it yet. This course is about staying calm, setting boundaries with warmth, keeping a newly mobile child safe, and supporting the first steps towards independence.',
    note: "General guidance, not medical advice. If you are worried about your child's health, call NHS 111. In an emergency, call 999.",
    rules: [
      'A tantrum is a feeling too big to handle, not a plan. Stay calm, keep them safe, and wait it out.',
      'Name the feeling, hold the limit. "You are cross that we are leaving. We are still leaving."',
      'Physical punishment is illegal in Scotland and Wales, and it does not teach what you want it to.',
      'Children are ready for the potty when they are ready, not by a date.',
      'Button batteries, medicines and hot drinks: up high and out of reach. A swallowed button battery means A&E straight away.',
    ],
    live: true,
  },
  'parent-preschool': {
    name: 'The pre-school years: 3 to 5',
    group: 'parenting',
    blurb: 'Curiosity, honesty, body safety and the first big changes',
    intro:
      'Pre-school children are curious about everything, and they ask out loud. This course covers answering honestly, teaching body safety and road sense, guiding behaviour, and helping children through change and loss.',
    note: 'General guidance, not professional advice. If you are worried about your child, talk to your GP or health visitor.',
    rules: [
      'Answer questions simply and truthfully, at their level. "I don\'t know, let\'s find out" is a good answer.',
      'Teach the correct names for private parts, and that their body belongs to them.',
      'Warn before screen time ends, and keep screens out of the hour before bed.',
      'Use clear words about death. "Died", not "gone to sleep" or "lost".',
      'A fib at four is a sign of a growing imagination, not a moral failing.',
    ],
    live: true,
  },
  'parent-school': {
    name: 'The primary years: 5 to 11',
    group: 'parenting',
    blurb: 'Friendships, learning, independence and character',
    intro:
      'In the primary years, more of a child\'s life happens out of your sight. This course covers friendships and bullying, learning differences, online safety and first phones, body safety, growing independence, and building character through responsibility and the right kind of praise.',
    note: 'General guidance, not professional advice. Some scenarios cover children seeing porn online or being shown it; nothing is described in detail. If you are worried about your child\'s safety or development, talk to their school or your GP.',
    rules: [
      'Listen to the whole story before you react. A calm reaction is what makes them tell you next time.',
      'Work with the school, in writing if needed. Most problems are solved faster together.',
      'If your child may be struggling to learn, ask for a meeting with the school\'s SENCo.',
      'Online, the rule is "tell me, and you will not be in trouble". Report adults who ask for photos or secrets to CEOP.',
      'Talk about puberty before it starts. For some children that is eight or nine.',
      'Children often see porn by accident or are shown it. A calm conversation protects them more than a punishment does.',
      'Their body is theirs, even with family. Offer a wave or a high five instead of a hug they do not want.',
    ],
    live: true,
  },
  'parent-teen': {
    name: 'Adolescence: 11 to 18',
    group: 'parenting',
    blurb: 'Independence, identity, wellbeing and the road to adulthood',
    intro:
      'Adolescents need more independence and more support at the same time. This course covers risk and safety, including porn and nude images, mental health and identity, setbacks and choices about the future, and keeping a relationship strong enough to carry the hard conversations.',
    note: 'General guidance, not professional advice. Some scenarios cover porn and nude images being shared; nothing is described in detail. If your teenager is at risk of harm, call 999. For worries about their mental health, talk to your GP.',
    rules: [
      'Stay the person they can call. "Ring me, any time, and I will come. No lecture tonight."',
      'Ask more than you tell. Curious questions get honest answers. Interrogations do not.',
      'Respect their privacy, unless their safety is at real risk. Then tell them what you are doing and why.',
      'Self-harm needs a calm response, not panic or punishment. Talk to your GP.',
      'Who they are is not a phase to be argued out of. Listen first.',
      'If they ask about porn or sex, answer honestly and calmly. Porn is a performance, not a guide, and partners are asked, not assumed.',
      'A nude image of anyone under 18 is illegal to share. Never forward it, even as evidence. Tell the school, and the young person in it can use Report Remove to get it taken down.',
    ],
    live: true,
  },
  'parent-adoption': {
    name: 'Adoption, fostering and kinship care',
    group: 'parenting',
    blurb: 'Identity, belonging and healing, at any age',
    intro:
      'Children who join a family through adoption, fostering or kinship care have the same needs as any child, and some extra ones. Many have lived through loss or trauma before they reached you. These scenarios are about honesty, patience and belonging.',
    note: 'General guidance, not professional advice. Your adoption agency, fostering service or local authority can offer support, and many families are entitled to it.',
    rules: [
      'Tell children their story early, truthfully and often. It should never be a secret they discover.',
      'Behaviour that comes from early trauma needs understanding and support, not only consequences.',
      'You are their real parent or carer, and their birth family is real too. They do not have to choose.',
      'Never speak badly of their birth parents in front of them.',
      'Ask for support early. Post-adoption and kinship support exists for exactly this.',
    ],
    live: true,
  },
  'parent-you': {
    name: 'Parental wellbeing',
    group: 'parenting',
    blurb: 'Support, repair and co-parenting, at any age',
    intro:
      'Children do best when the adults caring for them are coping. This course is about the parent: accepting support, repairing after difficult moments, managing conflict and co-parenting, and letting go of comparison.',
    note: 'General guidance, not professional advice. If you are struggling to cope, talk to your GP, or call Samaritans on 116 123 at any time.',
    rules: [
      'Accepting help is part of parenting well, not a sign that you are failing.',
      'Every parent loses their temper sometimes. What matters is the repair: say sorry, and explain.',
      'Keep adult arguments away from children, and never make them choose between parents.',
      'Other parents\' photos are their best moments, not their whole day.',
      'Share the thinking as well as the doing: the appointments, the forms and the planning are work too.',
    ],
    live: true,
  },
  interview: {
    name: 'Interview skills',
    group: 'work',
    blurb: 'What common questions are really asking, and how to answer well',
    intro:
      'Interview questions often mean more than they say. This course takes the questions asked in almost every interview, compares ways of answering them, and explains what the interviewer is listening for, for any role.',
    note: 'Practice only. Interviewers differ, so use the reasons as a guide and put the answers in your own words, with your own examples.',
    rules: [
      'Most questions are asking one thing: can we rely on you to do this job alongside other people?',
      'For "tell me about a time" questions, give one real example: what the situation was, what you did, and how it turned out.',
      'Say "I", not "we". They are hiring you, not your old team.',
      'It is fine to pause, to ask for the question again, or to look at your notes. Taking a moment looks thoughtful.',
      'Be honest. A small true example beats a grand vague one, and a real weakness you are working on beats a fake one.',
      'You can ask for adjustments before the day, such as the questions in writing or extra time.',
    ],
    live: true,
  },
  administrator: {
    name: 'Office and administration',
    group: 'work',
    blurb: 'Confidentiality, prioritising, professionalism and self-advocacy',
    intro:
      'Preparation for the situational judgement tests used in office and administrative recruitment. This course covers confidentiality, prioritising, professional relationships and asking for support, and explains what employers are looking for, which real tests rarely do.',
    note: 'Practice only. Every employer scores these tests in its own way, so use the reasons here as a guide, not a mark scheme.',
    rules: [
      'Tell people early. A problem shared at 10am is easier to fix than one found at 5pm.',
      "Keep private information private, even when the person asking sounds genuine or senior.",
      'Own a mistake quickly and say what you have done about it.',
      'When an instruction is unclear, ask a specific question before you start.',
      'Stay calm with upset people. Listen first, then say what you can do.',
      'Ask for help, training or adjustments when you need them. Struggling in silence helps nobody.',
    ],
    live: true,
  },
  'customer-service': {
    name: 'Customer service',
    group: 'work',
    blurb: 'Handling complaints, policies and pressure professionally',
    intro:
      'Preparation for the situational judgement tests used in retail, call centre and front-of-house recruitment. This course covers complaints, policies, pressure and honesty with customers, with the reasoning an employer would give.',
    note: 'Practice only. Every employer has its own policies, so use the reasons here as a guide, not a mark scheme.',
    rules: [
      'Listen before you fix. An upset customer who feels heard is halfway to calm.',
      'Say what you can do, not only what you cannot.',
      'Never guess. "I will find out" is a better answer than a wrong one.',
      'Policies exist for fairness. If an exception is needed, ask someone who is allowed to make it.',
      'You do not have to accept abuse. Know when, and how, to hand over or end the conversation.',
    ],
    live: true,
  },
  'care-support': { name: 'Health and social care', group: 'work', blurb: 'Coming later', live: false },
  'team-leader': { name: 'Leadership and management', group: 'work', blurb: 'Coming later', live: false },
} as const;

export type SetId = keyof typeof sets;

// Categories split a long set into sections on its page, in the order written here.
// A set with no entry is shown as one list. Every scenario in a set that has
// categories must name one of them (checked in src/content.config.ts).
export const categories: Partial<Record<SetId, Record<string, { name: string; blurb: string }>>> = {
  consent: {
    touch: { name: 'Bodily autonomy', blurb: 'Everyone decides who touches them, and how' },
    privacy: { name: 'Privacy and digital consent', blurb: 'Images, messages and information belong to the person they are about' },
    texting: { name: 'Dating and digital communication', blurb: 'Interest, rejection and boundaries in modern dating' },
    pressure: { name: 'Coercion and power', blurb: 'When saying no is made difficult' },
    nights: { name: 'Alcohol, nightlife and bystander action', blurb: 'Capacity, intoxication and looking out for others' },
    intimacy: { name: 'Sexual consent', blurb: 'Agreement that is freely given, specific and ongoing' },
    yourself: { name: 'Pornography and personal wellbeing', blurb: 'Habits, expectations, ethics and consent on screen' },
    relationships: { name: 'Pornography in relationships', blurb: 'Communication, trust and shared decisions' },
  },
  'respect-first': {
    signals: { name: "Ask, don't assume", blurb: 'Reading signals honestly, and checking with a simple question' },
    consent: { name: 'Consent in practice', blurb: 'Choice, freedom and capacity, as the law defines them' },
    people: { name: 'Seeing people, not bodies', blurb: 'Staring, comments and harassment, and what to do instead' },
    porn: { name: 'Porn and real life (16+)', blurb: 'What porn shows, and how real sex and consent work' },
    habit: { name: 'Changing the habit (16+)', blurb: 'Practical steps to cut back, and when to get help' },
  },
  online: {
    apps: { name: 'Dating apps and meeting up', blurb: 'Profiles, catfishing, first dates and getting home safely' },
    snap: { name: 'Snapchat, streaks and location', blurb: 'Snap Map, streak pressure, strangers and screenshots' },
    nudes: { name: 'Nudes, sexting and sextortion', blurb: 'Pressure, the law under 18, threats and getting images removed' },
    'adult-sites': { name: 'Adult sites and age checks', blurb: 'Age checks, scams, and content that should never exist' },
    'hooking-up': { name: 'Hooking up and sexual health', blurb: 'Consent, condoms, STI tests and the morning after' },
    feeds: { name: 'Feeds, influencers and pressure', blurb: 'Comparison, misogyny for clicks, pile-ons and switching off' },
  },
  'parent-newborn': {
    safety: { name: 'Health and safety', blurb: 'Safer sleep, illness and everyday risks in the first weeks' },
    bonding: { name: 'Bonding and parental wellbeing', blurb: 'How attachment grows, and how both parents are coping' },
    care: { name: 'Feeding and health checks', blurb: 'Feeding choices, vaccinations and reviews' },
  },
  'parent-baby': {
    safety: { name: 'Safety and safeguarding', blurb: 'Preventing the accidents most common in the first year' },
    connection: { name: 'Attachment and connection', blurb: 'Attention, separation and trust' },
    growing: { name: 'Development and milestones', blurb: 'Movement, feeding and the wide range of normal' },
  },
  'parent-toddler': {
    safety: { name: 'Safety and safeguarding', blurb: 'Protecting them, and recognising risk early' },
    feelings: { name: 'Emotional wellbeing', blurb: 'Understanding feelings, and support through hard moments' },
    growing: { name: 'Development and milestones', blurb: 'Growth, firsts and the gradual steps to independence' },
    values: { name: 'Behaviour, values and character', blurb: 'Kindness, honesty and responsibility' },
  },
  'parent-preschool': {
    safety: { name: 'Safety and safeguarding', blurb: 'Protecting them, and recognising risk early' },
    feelings: { name: 'Emotional wellbeing', blurb: 'Understanding feelings, and support through hard moments' },
    growing: { name: 'Development and milestones', blurb: 'Growth, firsts and the gradual steps to independence' },
    values: { name: 'Behaviour, values and character', blurb: 'Kindness, honesty and responsibility' },
  },
  'parent-school': {
    safety: { name: 'Safety and safeguarding', blurb: 'Protecting them, and recognising risk early' },
    feelings: { name: 'Emotional wellbeing', blurb: 'Understanding feelings, and support through hard moments' },
    growing: { name: 'Development and milestones', blurb: 'Growth, firsts and the gradual steps to independence' },
    values: { name: 'Behaviour, values and character', blurb: 'Kindness, honesty and responsibility' },
  },
  'parent-teen': {
    safety: { name: 'Safety and safeguarding', blurb: 'Protecting them, and recognising risk early' },
    feelings: { name: 'Emotional wellbeing', blurb: 'Understanding feelings, and support through hard moments' },
    growing: { name: 'Development and milestones', blurb: 'Growth, firsts and the gradual steps to independence' },
    values: { name: 'Behaviour, values and character', blurb: 'Kindness, honesty and responsibility' },
  },
  'parent-adoption': {
    identity: { name: 'Identity and their story', blurb: 'Telling the truth about where they came from, at every age' },
    belonging: { name: 'Trauma and belonging', blurb: 'Healing from early harm, and feeling fully part of the family' },
  },
  'parent-you': {
    support: { name: 'Support and self-care', blurb: 'Accepting help, sharing the load and letting go of comparison' },
    repair: { name: 'Conflict and repair', blurb: 'Losing your temper, arguing and co-parenting well' },
  },
  'customer-service': {
    complaints: { name: 'Complaints and honesty', blurb: 'Policies, exceptions and putting mistakes right' },
    pressure: { name: 'Pressure and professionalism', blurb: 'Abuse, queues and correcting a colleague' },
  },
  interview: {
    opening: { name: 'Opening questions', blurb: 'Motivation, self-awareness and first impressions' },
    examples: { name: 'Competency questions', blurb: 'Evidence from real experience' },
    tricky: { name: 'Challenging moments', blurb: 'Pressure, gaps and adjustments' },
  },
  administrator: {
    trust: { name: 'Confidentiality and integrity', blurb: 'Information, security and honesty' },
    priorities: { name: 'Prioritising and planning', blurb: 'Competing demands and unclear instructions' },
    people: { name: 'Professional relationships', blurb: 'Difficult conversations, discretion and feedback' },
    asking: { name: 'Self-advocacy and support', blurb: 'Asking for training, capacity and adjustments' },
  },
  racism: {
    online: { name: 'Online abuse and digital spaces', blurb: 'Social media, group chats and what you share' },
    everyday: { name: 'Everyday racism', blurb: 'Public spaces, assumptions and casual remarks' },
    family: { name: 'Family, children and colourism', blurb: 'Prejudice close to home, and what children learn from it' },
    work: { name: 'Discrimination at work', blurb: 'Fair treatment of colleagues, customers and candidates' },
  },
};

// How an answer is judged. Real situations are rarely just right or wrong,
// so there is a middle step, and every answer comes with its reason.
// The mark is shown next to the label so the verdict never depends on colour alone.
export const calls = {
  best: { label: 'Good call', mark: '✓' },
  okay: { label: 'Could be better', mark: '~' },
  risky: { label: 'Not the best call', mark: '!' },
} as const;

export type Call = keyof typeof calls;
