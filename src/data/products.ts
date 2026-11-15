// Our own products, shown on the home page under "Under development".
// Each one is its own Astro project in apps/, built into /projects/<id>/ on this
// site (see .github/workflows/deploy.yml). When a product launches properly,
// move it out of this list (or delete its entry).
//
// `hidden: true` takes a product's card off the home page but leaves the product
// itself deployed, so its address (/projects/<id>/) still works for anyone who has
// the link. Delete that one line to show the card again.
type Product = { id: string; name: string; blurb: string; path: string; hidden?: true };

const all: Product[] = [
  {
    id: 'good-call',
    name: 'Good Call',
    blurb:
      'Short scenarios about everyday life, parenting and work. Choose what you would do, then see why.',
    path: '/projects/good-call/',
    hidden: true,
  },
  {
    id: '5-minute-mandarin',
    name: '5 Minute Mandarin',
    blurb:
      'A platform for Mandarin tutors and students, plus free five-minute lessons for beginners.',
    path: '/projects/5-minute-mandarin/',
  },
];

export const products = all.filter((product) => !product.hidden);
