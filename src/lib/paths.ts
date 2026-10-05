// Builds a URL under the site's base path. The site is served from the root of
// its domain, so the base is empty, but links still go through href() so a
// change to `base` in astro.config.mjs needs no edits elsewhere.
// Pass paths that end in a slash for pages, e.g. href('/topics/tech/').
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function href(path = '/'): string {
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

// Absolute URL, for share tags (Open Graph) that need the full address.
export function absolute(path = '/'): string {
  return new URL(href(path), 'https://dilutedstories.com').toString();
}
