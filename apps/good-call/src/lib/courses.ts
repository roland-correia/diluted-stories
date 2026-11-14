// Everything that makes each set look and feel like a book: its cover, the line on
// its book page, its Explore category, the charities it links to, and the
// character item it unlocks when finished. Sets themselves are in src/lib/site.ts.
import type { SetId } from './site';

// Explore groups courses into categories, shown as tiles at the top of the Explore tab.
export const categories = {
  sex: { name: 'Sex & relationships', blurb: 'Consent, boundaries and healthy relationships', colour: '#9b2f52' },
  equality: { name: 'Equality & respect', blurb: 'Racism, prejudice and speaking up', colour: '#b07a1f' },
  early: { name: 'Early years', blurb: 'From the first weeks to starting school', colour: '#2f6690' },
  growing: { name: 'School & teen years', blurb: 'Friendships, independence and growing up', colour: '#5a3d8c' },
  family: { name: 'Family life', blurb: 'Adoption, kinship and looking after yourself', colour: '#8c3b4a' },
  careers: { name: 'Careers & work', blurb: 'Interviews and judgement at work', colour: '#005c4c' },
} as const;

export type CategoryId = keyof typeof categories;

// The picture on a cover. Each is drawn in src/components/BookCover.astro.
export type Motif =
  | 'hearts'
  | 'circles'
  | 'moon'
  | 'rattle'
  | 'blocks'
  | 'kite'
  | 'pencil'
  | 'headphones'
  | 'house'
  | 'teacup'
  | 'bubbles'
  | 'calendar'
  | 'headset'
  | 'care'
  | 'flag';

export interface Cover {
  /** The title as it is set on the cover, one entry per line. */
  lines: string[];
  /** A small line under the title, such as an age range. */
  sub?: string;
  /** The background runs from `from` (top) to `to` (bottom). */
  from: string;
  to: string;
  /** The colour of the picture and the small print. */
  accent: string;
  motif: Motif;
}

export interface Charity {
  name: string;
  url: string;
  /** One line on what the charity does. */
  why: string;
}

export interface Course {
  cover: Cover;
  /** The promise on the book page, above the course's name. */
  tagline: string;
  category: CategoryId;
  /** Charities connected to the course, shown on its book page. */
  charities: Charity[];
  /** The character item unlocked by finishing every question in the course. */
  unlock?: AccessoryId;
}

// Charities, each checked to load on its own site (November 2026).
const charity = {
  survivorsTrust: {
    name: 'The Survivors Trust',
    url: 'https://thesurvivorstrust.org/',
    why: 'A UK network of specialist services supporting survivors of rape and sexual abuse.',
  },
  brook: {
    name: 'Brook',
    url: 'https://www.brook.org.uk/',
    why: 'Sexual health and wellbeing services and education for young people.',
  },
  rapeCrisis: {
    name: 'Rape Crisis England & Wales',
    url: 'https://rapecrisis.org.uk/',
    why: 'Specialist support for anyone affected by rape or sexual violence.',
  },
  redCard: {
    name: 'Show Racism the Red Card',
    url: 'https://www.theredcard.org/',
    why: 'Anti-racism education in schools, workplaces and football.',
  },
  stopHate: {
    name: 'Stop Hate UK',
    url: 'https://www.stophateuk.org/',
    why: 'Support and reporting for anyone affected by hate crime.',
  },
  runnymede: {
    name: 'The Runnymede Trust',
    url: 'https://www.runnymedetrust.org/',
    why: 'Research and campaigning for race equality in Britain.',
  },
  lullaby: {
    name: 'The Lullaby Trust',
    url: 'https://www.lullabytrust.org.uk/',
    why: 'Safer sleep advice for babies, and support for bereaved families.',
  },
  pandas: {
    name: 'PANDAS Foundation',
    url: 'https://pandasfoundation.org.uk/',
    why: "Support for parents' mental health during and after pregnancy.",
  },
  homeStart: {
    name: 'Home-Start UK',
    url: 'https://www.home-start.org.uk/',
    why: 'Volunteers supporting families with young children through tough times.',
  },
  capt: {
    name: 'Child Accident Prevention Trust',
    url: 'https://capt.org.uk/',
    why: 'Works to prevent serious accidents to children at home and on the road.',
  },
  familyLives: {
    name: 'Coram Family Lives',
    url: 'https://www.coramfamilylives.org.uk/',
    why: 'Free, confidential support for parents and families.',
  },
  nspcc: {
    name: 'NSPCC',
    url: 'https://www.nspcc.org.uk/',
    why: 'Works to protect children and prevent abuse.',
  },
  kidscape: {
    name: 'Coram Kidscape',
    url: 'https://coramkidscape.org.uk/',
    why: 'Anti-bullying advice for children, parents and schools.',
  },
  youngMinds: {
    name: 'YoungMinds',
    url: 'https://www.youngminds.org.uk/',
    why: "Fighting for young people's mental health.",
  },
  theMix: {
    name: 'The Mix',
    url: 'https://www.themix.org.uk/',
    why: 'Free, confidential support for young people under 25.',
  },
  adoptionUk: {
    name: 'Adoption UK',
    url: 'https://www.adoptionuk.org/',
    why: 'Support and community for adoptive families.',
  },
  kinship: {
    name: 'Kinship',
    url: 'https://kinship.org.uk/',
    why: 'Support for grandparents, relatives and friends raising a child.',
  },
  fostering: {
    name: 'The Fostering Network',
    url: 'https://www.thefosteringnetwork.org.uk/',
    why: 'Support and advice for foster carers and fostering services.',
  },
  gingerbread: {
    name: 'Gingerbread',
    url: 'https://www.gingerbread.org.uk/',
    why: 'Advice and support for single-parent families.',
  },
  mind: {
    name: 'Mind',
    url: 'https://www.mind.org.uk/',
    why: 'Mental health information and support.',
  },
  kingsTrust: {
    name: "The King's Trust",
    url: 'https://www.kingstrust.org.uk/',
    why: 'Helps young people into work, education and training.',
  },
  autism: {
    name: 'National Autistic Society',
    url: 'https://www.autism.org.uk/',
    why: 'Support and information for autistic people and their families.',
  },
  adhd: {
    name: 'ADHD UK',
    url: 'https://adhduk.co.uk/',
    why: 'Information and support for people with ADHD.',
  },
  shaw: {
    name: 'Shaw Trust',
    url: 'https://shawtrust.org.uk/',
    why: 'Helps people, including disabled people, into work.',
  },
} satisfies Record<string, Charity>;

export const courses: Record<SetId, Course> = {
  consent: {
    cover: { lines: ['Sex,', 'consent', '& respect'], from: '#7a1f3d', to: '#1f0a14', accent: '#f6b3c6', motif: 'hearts' },
    tagline: 'Know where the line is, and hold your own',
    category: 'sex',
    charities: [charity.survivorsTrust, charity.brook, charity.rapeCrisis],
    unlock: 'heart',
  },
  racism: {
    cover: { lines: ['Race', '& respect'], from: '#8a5a19', to: '#241606', accent: '#f6cf7c', motif: 'circles' },
    tagline: 'See it, name it, and stand with people',
    category: 'equality',
    charities: [charity.redCard, charity.stopHate, charity.runnymede],
    unlock: 'scarf',
  },
  'parent-newborn': {
    cover: { lines: ['The early', 'weeks'], sub: '0 to 3 months', from: '#2f4f7a', to: '#0d1626', accent: '#c4dbf7', motif: 'moon' },
    tagline: 'Keep them safe through the steepest weeks',
    category: 'early',
    charities: [charity.lullaby, charity.pandas, charity.homeStart],
    unlock: 'stars',
  },
  'parent-baby': {
    cover: { lines: ['Infancy'], sub: '3 to 12 months', from: '#2c6e73', to: '#0b2426', accent: '#aee9e2', motif: 'rattle' },
    tagline: 'Small habits that prevent big accidents',
    category: 'early',
    charities: [charity.lullaby, charity.capt, charity.homeStart],
    unlock: 'earrings',
  },
  'parent-toddler': {
    cover: { lines: ['The toddler', 'years'], sub: '1 to 3 years', from: '#b5542a', to: '#341508', accent: '#ffd0b0', motif: 'blocks' },
    tagline: "Stay calm when they can't",
    category: 'early',
    charities: [charity.capt, charity.homeStart, charity.familyLives],
    unlock: 'beanie',
  },
  'parent-preschool': {
    cover: { lines: ['Pre-school', 'years'], sub: '3 to 5 years', from: '#5b7f2a', to: '#18240a', accent: '#dcf0ad', motif: 'kite' },
    tagline: 'Answer the questions they ask out loud',
    category: 'early',
    charities: [charity.nspcc, charity.familyLives, charity.homeStart],
    unlock: 'headband',
  },
  'parent-school': {
    cover: { lines: ['The primary', 'years'], sub: '5 to 11 years', from: '#2e5e8c', to: '#0b1b2c', accent: '#b3d3f2', motif: 'pencil' },
    tagline: 'Be the person they tell',
    category: 'growing',
    charities: [charity.nspcc, charity.kidscape, charity.youngMinds],
    unlock: 'cap',
  },
  'parent-teen': {
    cover: { lines: ['Adoles-', 'cence'], sub: '11 to 18 years', from: '#4b2c7a', to: '#150b26', accent: '#d6c2f6', motif: 'headphones' },
    tagline: 'Stay close while they grow up',
    category: 'growing',
    charities: [charity.youngMinds, charity.theMix, charity.brook],
    unlock: 'headphones',
  },
  'parent-adoption': {
    cover: { lines: ['Adoption', '& kinship'], sub: 'Any age', from: '#8c3b4a', to: '#260e13', accent: '#f8c0ca', motif: 'house' },
    tagline: 'Honesty, patience and belonging',
    category: 'family',
    charities: [charity.adoptionUk, charity.kinship, charity.fostering],
    unlock: 'flower',
  },
  'parent-you': {
    cover: { lines: ['Parental', 'wellbeing'], sub: 'Any age', from: '#3d6b55', to: '#0f1f17', accent: '#c6e8d4', motif: 'teacup' },
    tagline: 'Look after the person looking after them',
    category: 'family',
    charities: [charity.familyLives, charity.gingerbread, charity.mind],
    unlock: 'freckles',
  },
  interview: {
    cover: { lines: ['Interview', 'skills'], from: '#004225', to: '#050602', accent: '#e2c068', motif: 'bubbles' },
    tagline: "Know what they're really asking",
    category: 'careers',
    charities: [charity.kingsTrust, charity.autism, charity.adhd],
    unlock: 'glasses',
  },
  administrator: {
    cover: { lines: ['Office', '& admin'], from: '#005c4c', to: '#021b17', accent: '#a7e6d7', motif: 'calendar' },
    tagline: 'The unwritten rules of office life',
    category: 'careers',
    charities: [charity.kingsTrust, charity.shaw, charity.mind],
    unlock: 'bowtie',
  },
  'customer-service': {
    cover: { lines: ['Customer', 'service'], from: '#2f6690', to: '#0b1e2e', accent: '#a9d0ee', motif: 'headset' },
    tagline: 'Stay calm, stay honest, solve it',
    category: 'careers',
    charities: [charity.kingsTrust, charity.shaw, charity.mind],
    unlock: 'headset',
  },
  'care-support': {
    cover: { lines: ['Health &', 'social care'], from: '#6b4a8c', to: '#1d1228', accent: '#e0cdf3', motif: 'care' },
    tagline: 'Coming soon',
    category: 'careers',
    charities: [],
  },
  'team-leader': {
    cover: { lines: ['Leading', 'teams'], from: '#7a6a1f', to: '#211c06', accent: '#f1e2a0', motif: 'flag' },
    tagline: 'Coming soon',
    category: 'careers',
    charities: [],
  },
};

// Character items. Each is unlocked by finishing a course (see `unlock` above).
// One item can be worn in each slot. They are drawn in src/scripts/avatar.ts.
export const accessories = {
  heart: { name: 'Heart pin', slot: 'detail' },
  scarf: { name: 'Scarf', slot: 'neck' },
  stars: { name: 'Star clips', slot: 'detail' },
  earrings: { name: 'Hoop earrings', slot: 'detail' },
  beanie: { name: 'Beanie', slot: 'head' },
  headband: { name: 'Headband', slot: 'head' },
  cap: { name: 'Cap', slot: 'head' },
  headphones: { name: 'Headphones', slot: 'head' },
  flower: { name: 'Flower', slot: 'detail' },
  freckles: { name: 'Freckles', slot: 'face' },
  glasses: { name: 'Glasses', slot: 'face' },
  bowtie: { name: 'Bow tie', slot: 'neck' },
  headset: { name: 'Headset', slot: 'head' },
} as const;

export type AccessoryId = keyof typeof accessories;
export type Slot = (typeof accessories)[AccessoryId]['slot'];
