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
    role: 'Technology Consultant',
    bio: 'Roland advises on the technology behind your business and builds it. He has more than five years of front-end development experience and a background in Computer Science, and began freelancing at 17. He now builds websites and runs social media and ads for Diluted Stories, helping local small businesses grow their digital presence.',
    photo: {
      src: '/images/team/roland.jpg',
      alt: 'Roland in a white linen shirt, standing in front of a red wall',
    },
  },
  {
    name: 'David',
    role: 'Communications Officer',
    bio: "David is the first point of contact for potential clients and connects them with the services we offer. He also writes our blog, covering AI, practical ways businesses can improve how they work, and how we use new technology to improve our own services. He holds a bachelor's and a master's degree in English Literature.",
    photo: {
      src: '/images/team/david.jpg',
      alt: 'David smiling, in a white polo shirt, standing in front of a red wall',
    },
  },
  {
    name: 'William',
    role: 'Finance Officer',
    bio: "William looks after finance at Diluted Stories. An independent business strategist, he has been involved since the company's earliest days, flagging structural issues and helping guide its direction in line with the values it operates by. He also runs his own language coaching business.",
    photo: {
      src: '/images/team/william.jpg',
      alt: 'William smiling and looking to one side, in a white shirt, standing in front of a red wall',
    },
  },
];
