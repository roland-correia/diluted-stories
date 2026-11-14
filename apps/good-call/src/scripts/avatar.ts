// Draws a visitor's character as an SVG string, from the choices saved in their
// profile. Used on the Profile tab, in the character builder and on every card
// they play. The drawing is decoration: wherever it appears, the character's name
// is written next to it as text.

import { accessories, type AccessoryId } from '../lib/courses';
import { backgrounds, bonusBackgrounds, hairColours, skins, tops, type Character } from '../lib/game';

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
    case 'headset':
      return '<path d="M34 54c0-20 12-30 26-30s26 10 26 30" fill="none" stroke="#2b2b33" stroke-width="3.5"/><rect x="30" y="50" width="8" height="13" rx="4" fill="#2f6690"/><rect x="82" y="50" width="8" height="13" rx="4" fill="#2f6690"/><path d="M34 62c0 8 6 10 14 10" fill="none" stroke="#2b2b33" stroke-width="2.5"/><circle cx="49" cy="72" r="2.5" fill="#2b2b33"/>';
    default:
      return '';
  }
}

// Each drawing needs its own clip-path id, so several can share a page.
let drawn = 0;

/** The character as an SVG. `size` is in CSS pixels; the drawing scales to fit. */
export function avatarSvg(character: Character, size = 96): string {
  const clip = `avatar-clip-${(drawn += 1)}`;
  const skin = skins[character.skin] ?? skins[2];
  const hairColour = hairColours[character.hairColour] ?? hairColours[0];
  const top = tops[character.top] ?? tops[0];
  const { back, front } = hair(character.hair, hairColour);
  const wearing = character.wearing.filter((id) => id in accessories);
  // Head items replace the hair's front, so a beanie or cap is not drawn over a fringe.
  const headItem = wearing.some((id) => accessories[id].slot === 'head' && id !== 'headband' && id !== 'headphones' && id !== 'headset');

  return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" aria-hidden="true" focusable="false" class="avatar-svg">
  <clipPath id="${clip}"><circle cx="60" cy="60" r="60"/></clipPath>
  <g clip-path="url(#${clip})">
    <rect width="120" height="120" fill="${backgroundColour(character)}"/>
    ${back}
    <path d="M18 122c0-24 18-38 42-38s42 14 42 38z" fill="${top}"/>
    <path d="M50 84c3 4 7 6 10 6s7-2 10-6" fill="none" stroke="${shade(top, -0.25)}" stroke-width="2"/>
    <rect x="52" y="68" width="16" height="17" rx="6" fill="${shade(skin, -0.12)}"/>
    <circle cx="60" cy="52" r="24" fill="${skin}"/>
    <circle cx="36.5" cy="55" r="4" fill="${shade(skin, -0.08)}"/>
    <circle cx="83.5" cy="55" r="4" fill="${shade(skin, -0.08)}"/>
    ${headItem ? '' : front}
    <circle cx="51" cy="54" r="2.4" fill="#1d1d1f"/>
    <circle cx="69" cy="54" r="2.4" fill="#1d1d1f"/>
    <path d="M53 63c4 4 10 4 14 0" fill="none" stroke="#7a3b2e" stroke-width="2" stroke-linecap="round"/>
    <circle cx="46" cy="61" r="3" fill="#f08a7a" opacity="0.35"/>
    <circle cx="74" cy="61" r="3" fill="#f08a7a" opacity="0.35"/>
    ${wearing.map((id) => accessory(id, character)).join('')}
  </g>
</svg>`;
}
