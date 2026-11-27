// Small line icons for achievement badges, drawn on a 24 x 24 grid.
// Each is the inside of an <svg viewBox="0 0 24 24">, stroked in currentColor.
import type { Achievement } from './game';

export const badgeIcons: Record<Achievement['icon'], string> = {
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.8"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  book: '<path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5C4.7 20 4 19.3 4 18.5zM20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5c.8 0 1.5-.7 1.5-1.5z"/>',
  books: '<path d="M4 4h4v16H4zM9.5 4h4v16h-4zM15 5l3.8-1 3 15.2-3.8 1z"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  hourglass: '<path d="M6.5 3.5h11M6.5 20.5h11M8 3.5c0 5 8 5 8 8.5s-8 3.5-8 8.5M16 3.5c0 5-8 5-8 8.5s8 3.5 8 8.5"/>',
  flame: '<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5.3 1.6 1.2 2.6 2.3 2.8C10.8 8.6 11.4 5.6 12 3z"/>',
  fire: '<path d="M12 2.5c1.3 4 6.5 6 6.5 11.5a6.5 6.5 0 0 1-13 0c0-2.5 1.2-4.3 2.6-5.6.3 2 1.5 3.2 2.9 3.5C10.3 8 11.1 5 12 2.5z"/><path d="M12 13.5c.6 1.5 2.2 2.2 2.2 3.8a2.2 2.2 0 0 1-4.4 0c0-.9.4-1.6 1-2 .1.6.5 1 1 1 0-1 .1-1.9.2-2.8z"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
  person: '<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20.5c0-4.2 3.4-7 7.5-7s7.5 2.8 7.5 7"/>',
  compass: '<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  check: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 12.5l3 3 5-6"/>',
};
