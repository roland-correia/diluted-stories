// @ts-check
import { defineConfig } from 'astro/config';

// The site is served from dilutedstories.com/projects/good-call/, so every URL
// has to sit under that base path. Internal links go through href() in
// src/lib/paths.ts so they never hard-code it.
// The "Pornography and healthy sexuality" module was merged into the consent module.
// Its old addresses send people to the same questions in their new place.
const movedFromAdultContent = [
  'choosing-what-you-watch', 'every-night', 'first-phone', 'is-that-what-its-like', 'not-like-the-videos',
  'nude-going-round', 'search-history', 'second-best', 'shown-at-school', 'something-you-saw',
  'stronger-stuff', 'the-fake', 'their-viewing', 'watching-together', 'who-made-this',
];

// Scenarios about parents and their own children moved from the consent course to
// the parenting course for the child's age (November 2026). Their old addresses
// send people to the same question in its new place. src/scripts/progress.ts moves
// saved answers the same way.
/** @type {Record<string, string>} */
const movedFromConsent = {
  'first-phone': 'parent-school',
  'shown-at-school': 'parent-school',
  'goodbye-hug': 'parent-school',
  'search-history': 'parent-teen',
  'nude-going-round': 'parent-teen',
  'is-that-what-its-like': 'parent-teen',
};
/** @param {string} slug */
const courseOf = (slug) => movedFromConsent[slug] ?? 'consent';

// Scenarios replaced by a different one in the same place, so two courses no longer
// teach the same moment twice. Their old addresses open the question that took their place.
const replaced = {
  '/practice/consent/gone-quiet/': 'consent/a-reluctant-yes',
  '/practice/consent/too-drunk/': 'consent/both-had-a-few',
  '/practice/respect-first/asking-again/': 'respect-first/what-your-mates-say',
  '/practice/respect-first/the-new-starter/': 'respect-first/shes-fifteen',
  '/practice/respect-first/the-photo/': 'respect-first/at-the-bus-stop',
  '/practice/respect-first/is-that-what-she-wants/': 'respect-first/measuring-up',
  '/practice/respect-first/more-extreme/': 'respect-first/nobody-asks-in-porn',
};

export default defineConfig({
  site: 'https://dilutedstories.com',
  redirects: {
    '/practice/adult-content/': '/projects/good-call/practice/consent/',
    ...Object.fromEntries(
      movedFromAdultContent.map((slug) => [
        `/practice/adult-content/${slug}/`,
        `/projects/good-call/practice/${courseOf(slug)}/${slug}/`,
      ]),
    ),
    ...Object.fromEntries(
      Object.entries(movedFromConsent).map(([slug, course]) => [
        `/practice/consent/${slug}/`,
        `/projects/good-call/practice/${course}/${slug}/`,
      ]),
    ),
    ...Object.fromEntries(Object.entries(replaced).map(([from, to]) => [from, `/projects/good-call/practice/${to}/`])),
    // The consent course's "Pornography and young people" module moved to the parenting courses.
    '/practice/consent/topics/children/': '/projects/good-call/courses/consent/',
  },
  base: '/projects/good-call',
  trailingSlash: 'always',
  // The development toolbar sits over the bottom of the screen, where the flashcard
  // buttons are. It only ever appears in `npm run dev`, never on the live site.
  devToolbar: { enabled: false },
  build: {
    // One small stylesheet per page: inline it so there is no render-blocking request.
    inlineStylesheets: 'always',
  },
});
