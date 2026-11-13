// Everything this domain saves in a visitor's browser (localStorage), shown on the
// Cookies policy page and removed by its "Clear what this site has saved" button.
//
// KEEP THIS IN STEP WITH THE CODE. If a site or app starts saving something new
// (a new localStorage key, a cookie, analytics), add it here and update the date
// below. Setting a cookie or adding analytics also means asking for permission
// first, so it needs a consent banner as well as a line here.
//
// Keys come from: src/scripts/settings.ts, apps/good-call/src/scripts/{settings,progress}.ts,
// apps/5-minute-mandarin/src/scripts/{settings,progress}.ts and apps/5-minute-mandarin/src/app/store.ts.
export const STORAGE_UPDATED = '13 November 2026';

export const storage = [
  {
    key: 'ds-settings',
    what: 'Your reading settings: text size, spacing and background, from the Aa button.',
    where: 'Diluted Stories pages',
  },
  {
    key: 'gc-settings',
    what: 'The same reading settings, for Good Call.',
    where: 'Good Call',
  },
  {
    key: 'gc-progress',
    what: 'Which scenarios you have answered and the option you chose. Saved each time you answer.',
    where: 'Good Call',
  },
  {
    key: 'fmm-settings',
    what: 'The same reading settings, for 5 Minute Mandarin.',
    where: '5 Minute Mandarin',
  },
  {
    key: 'fmm-progress',
    what: 'Which lessons you have finished and your best score in each check.',
    where: '5 Minute Mandarin',
  },
  {
    key: 'fmm-app',
    what: 'The early version of the app keeps its sample lessons, messages and bookings here, along with anything you add. It does not leave your browser.',
    where: '5 Minute Mandarin',
  },
] as const;
