// One photograph for each topic in each course, shown on the course's book page and
// on every card in that topic. All are from Unsplash, under the Unsplash Licence
// (free to use, no permission needed; https://unsplash.com/license). Unsplash+ photos,
// which need a paid licence, are never used. Each is credited on the card and on the
// About page anyway, because photographers deserve it.
//
// The files are in src/assets/photos/, so Astro resizes them and serves modern
// formats at the right size for each screen.
import type { ImageMetadata } from 'astro';

export interface Photo {
  /** The file in src/assets/photos/. */
  file: string;
  /** What the picture shows, for people who cannot see it. */
  alt: string;
  /** The photographer, as named on Unsplash. */
  by: string;
  /** The photo's own page on Unsplash. */
  page: string;
}

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.jpg', { eager: true });

export function imageOf(photo: Photo): ImageMetadata {
  const found = files[`../assets/photos/${photo.file}`];
  if (!found) throw new Error(`Missing photo src/assets/photos/${photo.file}`);
  return found.default;
}

// Keyed by `${set}/${topic}`, as the topics are named in src/lib/site.ts.
export const photos: Record<string, Photo> = {
  'respect-first/signals': {
    file: 'respect-first-signals.jpg',
    alt: 'Coffee being poured into a white cup',
    by: 'Aidan Todd',
    page: 'https://unsplash.com/photos/white-ceramic-mug-with-stainless-steel-spoon-B6yhymJxpWY',
  },
  'respect-first/consent': {
    file: 'respect-first-consent.jpg',
    alt: 'Two people sitting on a bench by a lake',
    by: 'Ilia Bronskiy',
    page: 'https://unsplash.com/photos/two-people-sit-on-a-bench-by-the-water-BR06m_0krhQ',
  },
  'respect-first/people': {
    file: 'respect-first-people.jpg',
    alt: 'A quiet street at night, lit by street lamps',
    by: 'Zoltan Tasi',
    page: 'https://unsplash.com/photos/turned-on-street-lamps-MzVIlXk0AJg',
  },
  'respect-first/porn': {
    file: 'respect-first-porn.jpg',
    alt: 'A phone lying switched off on a wooden table',
    by: 'Olga Nayda',
    page: 'https://unsplash.com/photos/turned-off-black-and-silver-smartphone-on-brown-wooden-board-cSskyN592g8',
  },
  'respect-first/habit': {
    file: 'respect-first-habit.jpg',
    alt: 'A path through a field at sunrise',
    by: 'Jan Huber',
    page: 'https://unsplash.com/photos/green-grass-field-during-sunset-bY8MY2lIrFg',
  },
  'consent/touch': {
    file: 'consent-touch.jpg',
    alt: 'Two people shaking hands',
    by: 'Cytonn Photography',
    page: 'https://unsplash.com/photos/two-people-shaking-hands-n95VMLxqM2I',
  },
  'consent/privacy': {
    file: 'consent-privacy.jpg',
    alt: 'A phone showing a padlock icon, on a wooden desk',
    by: 'Dan Nelson',
    page: 'https://unsplash.com/photos/smartphone-with-security-lock-icon-ah-HeguOe9k',
  },
  'consent/texting': {
    file: 'consent-texting.jpg',
    alt: 'Someone typing a message on their phone',
    by: 'Priscilla Du Preez',
    page: 'https://unsplash.com/photos/person-using-smartphone-BjhUu6BpUZA',
  },
  'consent/pressure': {
    file: 'consent-pressure.jpg',
    alt: 'A raised hand',
    by: 'Nadine E',
    page: 'https://unsplash.com/photos/close-up-photography-of-person-lifting-hands-DRzYMtae-vA',
  },
  'consent/nights': {
    file: 'consent-nights.jpg',
    alt: 'Three friends raising glasses on a night out',
    by: 'Drew Beamer',
    page: 'https://unsplash.com/photos/three-person-holding-clear-drinking-glasses-bTN-zKFy9uA',
  },
  'consent/intimacy': {
    file: 'consent-intimacy.jpg',
    alt: 'Two people holding hands',
    by: 'Joe Yates',
    page: 'https://unsplash.com/photos/two-person-holding-each-others-hands-wNOymf_yTUA',
  },
  'consent/yourself': {
    file: 'consent-yourself.jpg',
    alt: 'An open laptop glowing in a dark room',
    by: 'Gery Wibowo',
    page: 'https://unsplash.com/photos/laptop-turned-on-Eti6ph51H4A',
  },
  'consent/children': {
    file: 'consent-children.jpg',
    alt: 'A tablet and stylus left on a sofa',
    by: 'Kelly Sikkema',
    page: 'https://unsplash.com/photos/white-tablet-computer-on-gray-textile-ipgtlzD86O4',
  },
  'consent/relationships': {
    file: 'consent-relationships.jpg',
    alt: 'Two cups of coffee on a wooden table',
    by: 'Lala Azizli',
    page: 'https://unsplash.com/photos/two-cups-of-cappuccino-on-a-wooden-table-oRakpNC53cs',
  },
  'racism/online': {
    file: 'racism-online.jpg',
    alt: 'A phone showing social media apps, beside a coffee',
    by: 'Nathan Dumlao',
    page: 'https://unsplash.com/photos/smartphone-with-social-media-apps-kLmt1mpGJVg',
  },
  'racism/everyday': {
    file: 'racism-everyday.jpg',
    alt: 'People passing on a busy street, blurred by movement',
    by: 'mauro mora',
    page: 'https://unsplash.com/photos/timelapse-photo-of-people-passing-the-street-31-pOduwZGE',
  },
  'racism/family': {
    file: 'racism-family.jpg',
    alt: 'Five hands of different skin tones resting together',
    by: 'Clay Banks',
    page: 'https://unsplash.com/photos/five-human-hands-on-brown-surface-LjqARJaJotc',
  },
  'racism/work': {
    file: 'racism-work.jpg',
    alt: 'Colleagues talking around a table at work',
    by: 'Redd Francisco',
    page: 'https://unsplash.com/photos/talking-people-sitting-beside-table-PTRzqc_h1r4',
  },
  'parent-newborn/safety': {
    file: 'parent-newborn-safety.jpg',
    alt: 'A soft sheep mobile hanging above a cot',
    by: 'charlesdeluvio',
    page: 'https://unsplash.com/photos/white-sheep-baby-mobile-2vfwTakDTIo',
  },
  'parent-newborn/bonding': {
    file: 'parent-newborn-bonding.jpg',
    alt: 'An adult\'s hand holding a newborn\'s tiny hand',
    by: 'Nathan Dumlao',
    page: 'https://unsplash.com/photos/adult-hand-holding-tiny-baby-hand-EytWx3BOrwI',
  },
  'parent-newborn/care': {
    file: 'parent-newborn-care.jpg',
    alt: 'Two baby feeding bottles on a kitchen counter',
    by: 'Jaye Haych',
    page: 'https://unsplash.com/photos/clear-plastic-feeding-bottle-on-red-table-vaozLvtSHok',
  },
  'parent-baby/safety': {
    file: 'parent-baby-safety.jpg',
    alt: 'A baby looking up, curious about everything',
    by: 'Kevin Gent',
    page: 'https://unsplash.com/photos/crawling-baby-on-floor-mVk7pnnlULc',
  },
  'parent-baby/connection': {
    file: 'parent-baby-connection.jpg',
    alt: 'A parent holding a laughing baby close',
    by: 'Raul Angel',
    page: 'https://unsplash.com/photos/woman-carrying-smiling-baby-mcKqoZh0DkI',
  },
  'parent-baby/growing': {
    file: 'parent-baby-growing.jpg',
    alt: 'A baby sitting up on a rug',
    by: 'Picsea',
    page: 'https://unsplash.com/photos/baby-sitting-on-beige-rug-LfNmCLx9r0s',
  },
  'parent-toddler/feelings': {
    file: 'parent-toddler-feelings.jpg',
    alt: 'A parent holding a small child close',
    by: 'Jordan Whitt',
    page: 'https://unsplash.com/photos/woman-hugging-boy-on-her-lap-KQCXf_zvdaU',
  },
  'parent-toddler/growing': {
    file: 'parent-toddler-growing.jpg',
    alt: 'A small child stacking colourful blocks',
    by: 'Markus Spiske',
    page: 'https://unsplash.com/photos/child-stacking-colorful-animal-blocks-OO89_95aUC0',
  },
  'parent-toddler/values': {
    file: 'parent-toddler-values.jpg',
    alt: 'Two toddlers playing with letter blocks together',
    by: 'Marisa Howenstine',
    page: 'https://unsplash.com/photos/two-toddler-playing-letter-cubes-Cq9slNxV8YU',
  },
  'parent-preschool/safety': {
    file: 'parent-preschool-safety.jpg',
    alt: 'An adult and a child walking hand in hand',
    by: 'Trương Tuyết Ly',
    page: 'https://unsplash.com/photos/adult-and-child-walking-outdoors-iytoWc5Qk1I',
  },
  'parent-preschool/feelings': {
    file: 'parent-preschool-feelings.jpg',
    alt: 'A child giving a parent a big hug',
    by: 'Xavier Mouton Photographie',
    page: 'https://unsplash.com/photos/boy-hugging-woman-during-daytime-MRWHSKimBJk',
  },
  'parent-preschool/growing': {
    file: 'parent-preschool-growing.jpg',
    alt: 'Colourful children\'s drawings pinned to a wall',
    by: 'Julia Taubitz',
    page: 'https://unsplash.com/photos/collection-of-colorful-childrens-drawings-on-a-wall-PIUwrlkMLls',
  },
  'parent-preschool/values': {
    file: 'parent-preschool-values.jpg',
    alt: 'Two young children sharing a ride-on toy car',
    by: 'Alexandr Podvalny',
    page: 'https://unsplash.com/photos/2-boys-sitting-on-red-and-black-ride-on-toy-car-TciuHvwoK0k',
  },
  'parent-toddler/safety': {
    file: 'parent-toddler-safety.jpg',
    alt: 'A small child peeking through the banisters at the top of the stairs',
    by: 'Amanda Costelloe',
    page: 'https://unsplash.com/photos/child-peeking-through-wooden-stair-railings-Oo-JYtlKnEo',
  },
  'parent-school/safety': {
    file: 'parent-school-safety.jpg',
    alt: 'A child walking down the street with a school backpack',
    by: 'Gilberto Peralta Bocio',
    page: 'https://unsplash.com/photos/a-young-boy-walking-down-a-street-with-a-backpack-on-7lvMDj7BuWs',
  },
  'parent-school/feelings': {
    file: 'parent-school-feelings.jpg',
    alt: 'A parent and child talking on a walk in the woods',
    by: 'Vitaly Gariev',
    page: 'https://unsplash.com/photos/father-and-son-hike-together-in-the-woods-Lj5IVNEnmVI',
  },
  'parent-school/growing': {
    file: 'parent-school-growing.jpg',
    alt: 'A child concentrating on schoolwork at a desk',
    by: 'Jessica Lewis',
    page: 'https://unsplash.com/photos/person-writing-on-white-paper-zNFT3o8HWks',
  },
  'parent-school/values': {
    file: 'parent-school-values.jpg',
    alt: 'Two friends side by side on the swings',
    by: 'Vitolda Klein',
    page: 'https://unsplash.com/photos/2-boys-sitting-on-swing-during-daytime-yIJIO2dhWWY',
  },
  'parent-teen/safety': {
    file: 'parent-teen-safety.jpg',
    alt: 'Hands holding a phone',
    by: 'Darya Ezerskaya',
    page: 'https://unsplash.com/photos/a-close-up-of-a-person-holding-a-cell-phone-hgz7pZkQoQc',
  },
  'parent-teen/feelings': {
    file: 'parent-teen-feelings.jpg',
    alt: 'A young person looking down, lost in thought',
    by: 'Matt Antonioli',
    page: 'https://unsplash.com/photos/woman-resting-her-head-on-her-right-hand-beside-table-with-opened-book-duitQgK0SxA',
  },
  'parent-teen/growing': {
    file: 'parent-teen-growing.jpg',
    alt: 'A student writing in a notebook',
    by: 'Kyle Gregory Devaras',
    page: 'https://unsplash.com/photos/woman-writing-on-book-6RTM8EsD1T8',
  },
  'parent-teen/values': {
    file: 'parent-teen-values.jpg',
    alt: 'Two young volunteers holding spades',
    by: 'victoria gonzales',
    page: 'https://unsplash.com/photos/two-women-holding-shovels-2obBFGDL9xM',
  },
  'parent-adoption/identity': {
    file: 'parent-adoption-identity.jpg',
    alt: 'Hands opening a family photo album',
    by: 'Laura Fuhrman',
    page: 'https://unsplash.com/photos/person-opening-photo-album-displaying-grayscale-photos-73OJLcahQHg',
  },
  'parent-adoption/belonging': {
    file: 'parent-adoption-belonging.jpg',
    alt: 'A family walking across a field, hand in hand',
    by: 'Jessica Rockowitz',
    page: 'https://unsplash.com/photos/woman-holding-man-and-toddler-hands-during-daytime-5NLCaz2wJXE',
  },
  'parent-you/support': {
    file: 'parent-you-support.jpg',
    alt: 'Friends talking over coffee at a wooden table',
    by: 'Vitaly Gariev',
    page: 'https://unsplash.com/photos/people-talking-at-cafe-wooden-table-_9rMpg5aI8k',
  },
  'parent-you/repair': {
    file: 'parent-you-repair.jpg',
    alt: 'Two parents sharing a quiet moment in the kitchen',
    by: 'Vitaly Gariev',
    page: 'https://unsplash.com/photos/couple-sharing-a-morning-moment-in-the-kitchen-n0iJ3TaQjXU',
  },
  'customer-service/complaints': {
    file: 'customer-service-complaints.jpg',
    alt: 'A customer being served at a service counter',
    by: 'blue sky',
    page: 'https://unsplash.com/photos/man-signs-document-at-a-service-counter-eLnrrITCy6Q',
  },
  'customer-service/pressure': {
    file: 'customer-service-pressure.jpg',
    alt: 'A headset resting beside a laptop',
    by: 'Petr Macháček',
    page: 'https://unsplash.com/photos/black-and-brown-headset-near-laptop-computer-BeVGrXEktIk',
  },
  'interview/opening': {
    file: 'interview-opening.jpg',
    alt: 'An interviewer and a candidate shaking hands across a table',
    by: 'Resume Genius',
    page: 'https://unsplash.com/photos/a-woman-shaking-hands-with-another-woman-sitting-at-a-table-IESB4iFVuzA',
  },
  'interview/examples': {
    file: 'interview-examples.jpg',
    alt: 'A notebook and pen beside a laptop and a tablet',
    by: 'Justin Morgan',
    page: 'https://unsplash.com/photos/black-pen-on-white-notebook-Hx-4TbpsoIw',
  },
  'interview/tricky': {
    file: 'interview-tricky.jpg',
    alt: 'Two empty chairs in a quiet waiting room',
    by: 'Craig Lovelidge',
    page: 'https://unsplash.com/photos/a-room-with-two-chairs-and-a-potted-plant-SqgSOjRyjzU',
  },
  'administrator/trust': {
    file: 'administrator-trust.jpg',
    alt: 'Rows of ring binders on office shelves',
    by: 'Viktor Talashuk',
    page: 'https://unsplash.com/photos/colorful-ring-binders-on-office-shelves-05HLFQu8bFw',
  },
  'administrator/priorities': {
    file: 'administrator-priorities.jpg',
    alt: 'A notebook, pen, glasses and coffee laid out on a desk',
    by: 'Andrijana Bozic',
    page: 'https://unsplash.com/photos/pen-notebook-scissors-cup-of-coffee-and-eyeglasses-GTxtQLnZ8oM',
  },
  'administrator/people': {
    file: 'administrator-people.jpg',
    alt: 'Two colleagues talking at a table',
    by: 'Christina @ wocintechchat.com',
    page: 'https://unsplash.com/photos/two-women-sitting-beside-table-and-talking-LQ1t-8Ms5PY',
  },
  'administrator/asking': {
    file: 'administrator-asking.jpg',
    alt: 'Two colleagues in a one-to-one conversation at a laptop',
    by: 'Amy Hirschi',
    page: 'https://unsplash.com/photos/woman-in-teal-t-shirt-sitting-beside-woman-in-suit-jacket-JaoVGh5aJ3E',
  },
};

export const photoOf = (set: string, topic: string): Photo | undefined => photos[`${set}/${topic}`];
