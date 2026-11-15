// Our own products, shown on the home page under "Under development".
// Each one is its own Astro project in apps/, built into /projects/<id>/ on this
// site (see .github/workflows/deploy.yml).
//
// While a product is in development its card is just text: it is NOT a link, but its
// address (/projects/<id>/) still works for anyone who has it. When it is ready for
// visitors, add `live: true` to its entry and the card becomes a link to `path`.
// When a product launches properly, move it out of this list (or delete its entry).
export type Product = { id: string; name: string; blurb: string; path: string; live?: true };

export const products: Product[] = [
  {
    id: 'good-call',
    name: 'Good Call',
    blurb:
      'Short scenarios about everyday life, parenting and work. Choose what you would do, then see why.',
    path: '/projects/good-call/',
  },
  {
    id: '5-minute-mandarin',
    name: '5 Minute Mandarin',
    blurb:
      'A platform for Mandarin tutors and students, plus free five-minute lessons for beginners.',
    path: '/projects/5-minute-mandarin/',
  },
];
