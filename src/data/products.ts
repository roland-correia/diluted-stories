// Our own products, shown on the home page under "Under development".
// Each one is its own Astro project in apps/, built into /projects/<id>/ on this
// site (see .github/workflows/deploy.yml). When a product launches properly,
// move it out of this list (or delete its entry).
export const products = [
  {
    id: 'good-call',
    name: 'Good Call',
    blurb:
      'Short, realistic scenarios about everyday life, parenting and work. Choose what you would do, then see why each choice helps or harms.',
    path: '/projects/good-call/',
  },
  {
    id: '5-minute-mandarin',
    name: '5 Minute Mandarin',
    blurb:
      'A platform for Mandarin tutors and students, with a lesson calendar, class group chats and booking credits, plus free five-minute lessons for beginners.',
    path: '/projects/5-minute-mandarin/',
  },
] as const;
