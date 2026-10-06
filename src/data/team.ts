// The people shown on /team/. While `placeholder` is true the card is marked as
// a placeholder on the page. Replace each placeholder with a real person (and
// delete `placeholder`) before the page goes live. `photo.src` is a path under
// public/; pre-size and compress the image yourself before adding it.
type Person = {
  name: string;
  role: string;
  bio: string;
  photo?: { src: string; alt: string };
  placeholder?: true;
};

export const team: Person[] = [
  {
    name: 'Roland',
    role: 'Front-End Developer',
    bio: 'Roland has over five years of front-end software development experience. He started his freelance career at 17 with the same passion he has today: helping local small businesses grow their digital presence.',
    photo: {
      src: '/images/team/roland.jpg',
      alt: 'Roland in a beige quarter-zip jumper, standing in front of a brick wall and dark green railings',
    },
  },
  {
    name: 'David',
    role: 'Digital and Communications Officer',
    bio: "David holds a bachelor's and a master's degree in English Literature. He is the bridge between potential clients and the services we offer. He also writes our blog posts on AI, on how businesses can optimise what they do today, and on how we adapt current market technology to improve our services.",
    photo: {
      src: '/images/team/david.jpg',
      alt: 'David smiling, in a white polo shirt, standing in front of a red wall',
    },
  },
  {
    name: 'William',
    role: 'Independent Business Strategist',
    bio: 'William is an independent business strategist who has been part of the company since its founding days. He raises key structural issues and helps set the direction of the company, based on its key operating values.',
    photo: {
      src: '/images/team/william.jpg',
      alt: 'William smiling and looking to one side, in a white shirt, standing in front of a red wall',
    },
  },
];
