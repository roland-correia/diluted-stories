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
    name: 'Team member name',
    role: 'Role',
    bio: 'A short line about this person: their background and what they do at Diluted Stories.',
    placeholder: true,
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
    name: 'Team member name',
    role: 'Role',
    bio: 'A short line about this person: their background and what they do at Diluted Stories.',
    placeholder: true,
  },
];
