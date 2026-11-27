// Draws a visitor's character as SVG, from the choices saved in their profile.
// - avatarSvg: head and shoulders in a circle, for small places (the greeting on
//   Home, "Playing as" on each card, the course unlock preview).
// - characterSvg: the full-length character, which src/scripts/stage.ts animates
//   on the Profile tab and in the character builder.
// Both share one head, so the two always match. The drawings are decoration:
// wherever they appear, the character's name is written as text too.

import { accessories, type AccessoryId } from '../lib/courses';
import {
  backgrounds,
  bonusBackgrounds,
  bottomColours,
  bottoms,
  facialHair,
  hairColours,
  hairStyles,
  outfits,
  skins,
  tops,
  type Character,
} from '../lib/game';

function shade(hex: string, amount: number): string {
  // Darken (negative) or lighten (positive) a #rrggbb colour by a fraction.
  const n = parseInt(hex.slice(1), 16);
  const channel = (shift: number) => {
    const c = (n >> shift) & 255;
    const v = amount < 0 ? c * (1 + amount) : c + (255 - c) * amount;
    return Math.round(Math.max(0, Math.min(255, v)));
  };
  return `#${[16, 8, 0].map((s) => channel(s).toString(16).padStart(2, '0')).join('')}`;
}

export function backgroundColour(character: Character): string {
  const bg = character.background;
  return typeof bg === 'number' ? (backgrounds[bg] ?? backgrounds[0]) : bonusBackgrounds[bg]?.colour ?? backgrounds[0];
}

// Every saved choice is checked, so an old or damaged save still draws a character.
function pick<T extends readonly string[]>(list: T, value: unknown): T[number] {
  return (list as readonly string[]).includes(value as string) ? (value as T[number]) : list[0];
}

function colours(character: Character) {
  const skin = skins[character.skin] ?? skins[2];
  const top = tops[character.top] ?? tops[0];
  return {
    skin,
    hair: hairColours[character.hairColour] ?? hairColours[0],
    top,
    topDark: shade(top, -0.22),
    bottom: bottomColours[character.bottomColour] ?? bottomColours[0],
    shoe: '#2b2b33',
  };
}

// Hair is drawn in two parts: what sits behind the head, and what sits in front.
function hair(style: Character['hair'], colour: string): { back: string; front: string } {
  switch (style) {
    case 'long':
      return {
        back: `<path d="M34 52c0-18 11-30 26-30s26 12 26 30v34c0 4-4 6-8 6H42c-4 0-8-2-8-6z" fill="${colour}"/>`,
        front: `<path d="M35 50c1-16 12-26 25-26 14 0 24 9 25 25-6-9-15-13-25-13-11 0-20 5-25 14z" fill="${colour}"/>`,
      };
    case 'curly':
      return {
        back: [
          [44, 34, 11], [60, 28, 12], [76, 34, 11], [36, 48, 10], [84, 48, 10], [40, 62, 8], [80, 62, 8],
        ].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${colour}"/>`).join(''),
        front: `<path d="M38 46c2-10 11-18 22-18s20 8 22 18c-6-5-14-7-22-7s-16 2-22 7z" fill="${colour}"/>`,
      };
    case 'buzz':
      return {
        back: '',
        front: `<path d="M37 48c0-14 10-22 23-22s23 8 23 22c-5-7-13-10-23-10s-18 3-23 10z" fill="${colour}" opacity="0.85"/>`,
      };
    case 'bun':
      return {
        back: `<circle cx="60" cy="22" r="10" fill="${colour}"/>`,
        front: `<path d="M36 50c0-16 11-24 24-24s24 8 24 24c-5-9-14-13-24-13s-19 4-24 13z" fill="${colour}"/>`,
      };
    case 'waves':
      return {
        back: `<path d="M35 54c-2-20 9-31 25-31s27 11 25 31l-3 12-5-8H43l-5 8z" fill="${colour}"/>`,
        front: `<path d="M36 50c2-15 12-24 26-24 12 0 21 7 23 21-9-3-15-9-17-14-6 8-18 14-32 17z" fill="${colour}"/>`,
      };
    case 'short':
    default:
      return {
        back: '',
        front: `<path d="M36 50c0-17 11-26 24-26 14 0 24 9 24 26-4-8-12-13-24-13-11 0-19 5-24 13z" fill="${colour}"/>`,
      };
  }
}

function accessory(id: AccessoryId, character: Character): string {
  switch (id) {
    case 'heart':
      return '<path d="M44 96c-3-3-1-7 2-7 2 0 3 2 3 2s1-2 3-2c3 0 5 4 2 7l-5 4z" fill="#e2456b"/>';
    case 'scarf':
      return '<path d="M44 80c8 5 24 5 32 0l2 6c-9 6-27 6-36 0z" fill="#e0a43a"/><path d="M68 84l4 14-7 1-2-13z" fill="#c98f2c"/>';
    case 'stars':
      return '<path d="M76 34l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" fill="#f6d36b"/>';
    case 'earrings':
      return '<circle cx="36" cy="60" r="3.2" fill="none" stroke="#e2c068" stroke-width="1.6"/><circle cx="84" cy="60" r="3.2" fill="none" stroke="#e2c068" stroke-width="1.6"/>';
    case 'beanie':
      return '<path d="M35 44c0-15 11-24 25-24s25 9 25 24z" fill="#c4473a"/><rect x="33" y="40" width="54" height="8" rx="4" fill="#a83a2f"/><circle cx="60" cy="18" r="5" fill="#f1e4d0"/>';
    case 'headband':
      return '<path d="M36 44c6-9 15-13 24-13s18 4 24 13" fill="none" stroke="#e2456b" stroke-width="5" stroke-linecap="round"/>';
    case 'cap':
      return '<path d="M36 44c0-14 10-22 24-22s24 8 24 22z" fill="#2f6690"/><path d="M60 42h30c3 0 3 5 0 5H60z" fill="#25547a"/>';
    case 'headphones':
      return '<path d="M34 54c0-20 12-30 26-30s26 10 26 30" fill="none" stroke="#2b2b33" stroke-width="4"/><rect x="29" y="50" width="9" height="15" rx="4" fill="#5a3d8c"/><rect x="82" y="50" width="9" height="15" rx="4" fill="#5a3d8c"/>';
    case 'flower':
      return [0, 72, 144, 216, 288]
        .map((a) => `<circle cx="${80 + 4 * Math.cos((a * Math.PI) / 180)}" cy="${36 + 4 * Math.sin((a * Math.PI) / 180)}" r="3.4" fill="#f4a3b8"/>`)
        .join('') + '<circle cx="80" cy="36" r="2.4" fill="#f6d36b"/>';
    case 'freckles': {
      const dot = shade(skins[character.skin] ?? skins[2], -0.35);
      return [[47, 60], [50, 62], [53, 60], [67, 60], [70, 62], [73, 60]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.9" fill="${dot}"/>`)
        .join('');
    }
    case 'glasses':
      return '<g fill="none" stroke="#1d2a24" stroke-width="2"><circle cx="51" cy="54" r="6"/><circle cx="69" cy="54" r="6"/><path d="M57 54h6M45 53l-8-2M75 53l8-2"/></g>';
    case 'bowtie':
      return '<path d="M60 84l-9-5v10zM60 84l9-5v10z" fill="#9b2f52"/><circle cx="60" cy="84" r="2.2" fill="#7a2341"/>';
    case 'badge':
      return '<circle cx="72" cy="98" r="5.5" fill="#9fe0d0" stroke="#1f4e5f" stroke-width="1.2"/><path d="M69.4 98.2l1.9 1.9 3.6-3.6" fill="none" stroke="#1f4e5f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
    case 'shades':
      return '<rect x="41" y="48" width="16" height="11" rx="4" fill="#1f1f24"/><rect x="63" y="48" width="16" height="11" rx="4" fill="#1f1f24"/><path d="M57 52h6M41 51l-6-2M79 51l6-2" stroke="#1f1f24" stroke-width="2" stroke-linecap="round"/><rect x="44" y="50" width="5" height="2.5" rx="1.2" fill="#fff" opacity="0.35"/><rect x="66" y="50" width="5" height="2.5" rx="1.2" fill="#fff" opacity="0.35"/>';
    case 'headset':
      return '<path d="M34 54c0-20 12-30 26-30s26 10 26 30" fill="none" stroke="#2b2b33" stroke-width="3.5"/><rect x="30" y="50" width="8" height="13" rx="4" fill="#2f6690"/><rect x="82" y="50" width="8" height="13" rx="4" fill="#2f6690"/><path d="M34 62c0 8 6 10 14 10" fill="none" stroke="#2b2b33" stroke-width="2.5"/><circle cx="49" cy="72" r="2.5" fill="#2b2b33"/>';
    default:
      return '';
  }
}

const wornItems = (character: Character) =>
  (Array.isArray(character.wearing) ? character.wearing : []).filter((id) => id in accessories);

/**
 * The head, from the neck up, centred on (60, 52) in a 120-wide drawing.
 * `chest` items (pins, scarves, bow ties) are drawn separately, over the clothes.
 */
function head(character: Character): { back: string; face: string; worn: string } {
  const c = colours(character);
  const { back, front } = hair(pick(hairStyles, character.hair), c.hair);
  const wearing = wornItems(character);
  // Head items replace the hair's front, so a beanie or cap is not drawn over a fringe.
  const headItem = wearing.some((id) => accessories[id].slot === 'head' && id !== 'headband' && id !== 'headphones' && id !== 'headset');
  const facial = pick(facialHair, character.facial);
  const beard =
    facial === 'beard'
      ? `<path d="M40 56c1 14 9 22 20 22s19-8 20-22c-4 6-9 8-12 8-3-2-5-3-8-3s-5 1-8 3c-3 0-8-2-12-8z" fill="${c.hair}"/>`
      : facial === 'stubble'
        ? `<path d="M41 57c2 13 9 20 19 20s17-7 19-20c-4 7-11 10-19 10s-15-3-19-10z" fill="${c.hair}" opacity="0.28"/>`
        : '';
  const moustache =
    facial === 'moustache' || facial === 'beard'
      ? `<path d="M51 62c3-3 6-3 9-1 3-2 6-2 9 1-3 2-6 2-9 0-3 2-6 2-9 0z" fill="${c.hair}"/>`
      : '';
  const lashes = character.lashes
    ? '<path d="M47.5 51.6l-2-1.8M49.5 50.9l-.9-2.4M71.5 51.6l2.2-1.8M69.5 50.9l.9-2.4" stroke="#1d1d1f" stroke-width="1.2" stroke-linecap="round"/>'
    : '';
  const face = `
    <rect x="52" y="68" width="16" height="17" rx="6" fill="${shade(c.skin, -0.12)}"/>
    <circle cx="60" cy="52" r="24" fill="${c.skin}"/>
    <circle cx="36.5" cy="55" r="4" fill="${shade(c.skin, -0.08)}"/>
    <circle cx="83.5" cy="55" r="4" fill="${shade(c.skin, -0.08)}"/>
    ${beard}
    ${headItem ? '' : front}
    <g class="c-eyes"><circle cx="51" cy="54" r="2.4" fill="#1d1d1f"/><circle cx="69" cy="54" r="2.4" fill="#1d1d1f"/></g>
    ${lashes}
    <circle cx="46" cy="61" r="3" fill="#f08a7a" opacity="0.35"/>
    <circle cx="74" cy="61" r="3" fill="#f08a7a" opacity="0.35"/>
    ${moustache}
    <path class="c-mouth" d="M53 63c4 4 10 4 14 0" fill="none" stroke="#7a3b2e" stroke-width="2" stroke-linecap="round"/>`;
  const onHead = wearing.filter((id) => ['head', 'face', 'detail'].includes(accessories[id].slot) && id !== 'heart' && id !== 'badge');
  return { back, face, worn: onHead.map((id) => accessory(id, character)).join('') };
}

/** Items worn on the clothes: the heart pin, Respect badge, scarf and bow tie. */
const chestItems = (character: Character) =>
  wornItems(character)
    .filter((id) => id === 'heart' || id === 'badge' || accessories[id].slot === 'neck')
    .map((id) => accessory(id, character))
    .join('');

/** The neckline of each outfit, for the head-and-shoulders drawing. */
function neckline(outfit: Character['outfit'], topDark: string): string {
  switch (outfit) {
    case 'hoodie':
      return `<path d="M44 85c8 9 24 9 32 0" fill="none" stroke="${topDark}" stroke-width="6" stroke-linecap="round"/><path d="M56 92v9M64 92v9" stroke="#f1f1f1" stroke-width="1.6" stroke-linecap="round"/>`;
    case 'shirt':
      return `<path d="M52 84l8 9 8-9" fill="#f6f6f2"/><path d="M60 93v28" stroke="${topDark}" stroke-width="1.4"/>`;
    case 'dress':
      return `<path d="M48 85c4 7 20 7 24 0" fill="none" stroke="${topDark}" stroke-width="2"/>`;
    default:
      return `<path d="M50 84c3 4 7 6 10 6s7-2 10-6" fill="none" stroke="${topDark}" stroke-width="2"/>`;
  }
}

// Each drawing needs its own clip-path id, so several can share a page.
let drawn = 0;

/** Head and shoulders in a circle. `size` is in CSS pixels; the drawing scales to fit. */
export function avatarSvg(character: Character, size = 96): string {
  const clip = `avatar-clip-${(drawn += 1)}`;
  const c = colours(character);
  const h = head(character);
  return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" aria-hidden="true" focusable="false" class="avatar-svg">
  <clipPath id="${clip}"><circle cx="60" cy="60" r="60"/></clipPath>
  <g clip-path="url(#${clip})">
    <rect width="120" height="120" fill="${backgroundColour(character)}"/>
    ${h.back}
    <path d="M18 122c0-24 18-38 42-38s42 14 42 38z" fill="${c.top}"/>
    ${neckline(pick(outfits, character.outfit), c.topDark)}
    ${h.face}
    ${chestItems(character)}
    ${h.worn}
  </g>
</svg>`;
}

/**
 * The full-length character, 120 x 220, standing on the ground at y = 214.
 * Groups have classes for src/scripts/stage.ts and the CSS to animate:
 * c-body (everything that jumps and sways), c-head, c-eyes, c-arm-l, c-arm-r,
 * c-leg-l, c-leg-r, c-heart (a heart that pops up) and c-shadow.
 */
export function characterSvg(character: Character): string {
  const c = colours(character);
  const h = head(character);
  const outfit = pick(outfits, character.outfit);
  const bottom = pick(bottoms, character.bottom);
  const longSleeves = outfit === 'hoodie' || outfit === 'shirt';
  const dress = outfit === 'dress';

  // Legs hang from the hips (y 148) and end in shoes at y 212.
  const legFill = (x: number) => {
    if (dress) return `<rect x="${x + 2}" y="176" width="10" height="30" rx="5" fill="${c.skin}"/>`;
    if (bottom === 'shorts') {
      return `<rect x="${x + 2}" y="168" width="10" height="38" rx="5" fill="${c.skin}"/><rect x="${x}" y="146" width="14" height="28" rx="6" fill="${c.bottom}"/>`;
    }
    if (bottom === 'skirt') return `<rect x="${x + 2}" y="160" width="10" height="46" rx="5" fill="${c.skin}"/>`;
    return `<rect x="${x}" y="146" width="14" height="60" rx="6" fill="${c.bottom}"/>`;
  };
  const leg = (side: 'l' | 'r', x: number) =>
    `<g class="c-leg-${side}">${legFill(x)}<rect x="${x - 3}" y="202" width="20" height="10" rx="5" fill="${c.shoe}"/></g>`;
  const skirt =
    !dress && bottom === 'skirt'
      ? `<path d="M40 146h40l8 30c-9 4-19 6-28 6s-19-2-28-6z" fill="${c.bottom}"/>`
      : '';
  const dressSkirt = dress
    ? `<path d="M40 118h40l12 62c-10 5-21 7-32 7s-22-2-32-7z" fill="${c.top}"/><path d="M40 118h40" stroke="${c.topDark}" stroke-width="2"/>`
    : '';

  // Arms hang from the shoulders (40, 92) and (80, 92).
  const arm = (side: 'l' | 'r') => {
    const x = side === 'l' ? 28 : 80;
    const hand = side === 'l' ? 34 : 86;
    const sleeve = longSleeves
      ? `<rect x="${x}" y="88" width="12" height="52" rx="6" fill="${c.top}"/><rect x="${x}" y="134" width="12" height="5" rx="2" fill="${c.topDark}"/>`
      : `<rect x="${x + 1}" y="104" width="10" height="36" rx="5" fill="${c.skin}"/><rect x="${x}" y="88" width="12" height="22" rx="6" fill="${c.top}"/>`;
    return `<g class="c-arm-${side}">${sleeve}<circle cx="${hand}" cy="144" r="6" fill="${c.skin}"/></g>`;
  };

  const torso =
    outfit === 'hoodie'
      ? `<path d="M36 96c0-7 5-11 12-11h24c7 0 12 4 12 11v52c0 3-2 5-5 5H41c-3 0-5-2-5-5z" fill="${c.top}"/><path d="M45 126h30v14H45z" fill="${c.topDark}" opacity="0.5"/>`
      : `<path d="M36 96c0-7 5-11 12-11h24c7 0 12 4 12 11v${dress ? 26 : 52}c0 3-2 5-5 5H41c-3 0-5-2-5-5z" fill="${c.top}"/>`;

  return `<svg viewBox="0 0 120 222" class="char" aria-hidden="true" focusable="false">
  <ellipse class="c-shadow" cx="60" cy="214" rx="28" ry="4.5" fill="#000" opacity="0.22"/>
  <g class="c-body">
    ${leg('l', 45)}${leg('r', 61)}
    ${skirt}
    ${dressSkirt}
    ${arm('l')}${arm('r')}
    <g class="c-head">
      ${h.back}
      ${h.face}
      ${h.worn}
    </g>
    ${torso}
    ${neckline(outfit, c.topDark)}
    ${chestItems(character)}
    <path class="c-heart" d="M60 6c-6-6-15-2-12 6 2 5 12 11 12 11s10-6 12-11c3-8-6-12-12-6z" fill="#e2456b" opacity="0"/>
  </g>
</svg>`;
}
