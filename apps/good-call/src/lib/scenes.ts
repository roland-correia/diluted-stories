// Illustrated scenes: a flat drawing of where a scenario happens, with the
// visitor's own character in it and, often, someone else. They replace stock
// photos, so every scenario looks like part of the same story.
//
// - A scene is a setting (a café, a bus stop, a bedroom at night...) and a cast.
// - Drawn in the browser by src/scripts/scene.ts from a short description in the
//   page (data-scene="cafe", data-cast="1", data-seed="consent/hug-hello"), so the
//   pages stay small and the visitor's own character can be put in.
// - The other people are made from the seed, so the same scenario always shows the
//   same faces, and different scenarios show different ones.
// - Decorative: everything a scene shows is also said in the text.
//
// Every scene is drawn in a 360 x 200 box, with the floor at y = 195.

import { characterSvg } from '../scripts/avatar';
import {
  bottomColours,
  bottoms,
  defaultCharacter,
  facialHair,
  hairColours,
  hairStyles,
  outfits,
  skins,
  tops,
  type Character,
} from './game';

export const settings = [
  'cafe', 'bar', 'party', 'club', 'street', 'busstop', 'train', 'bedroom', 'living', 'kitchen',
  'office', 'meeting', 'shop', 'school', 'park', 'gym', 'nursery', 'road', 'clinic', 'desk',
] as const;
export type Setting = (typeof settings)[number];

/**
 * Who is in the scene, besides the visitor:
 * '0' nobody, '1' one person, '2' two people, 'child' a child, 'baby' a baby,
 * 'teen' a teenager (drawn a little smaller than an adult).
 */
export const casts = ['0', '1', '2', 'child', 'baby', 'teen'] as const;
export type Cast = (typeof casts)[number];

export interface SceneSpec {
  setting: Setting;
  cast: Cast;
}

// ---------------------------------------------------------------- a seeded random

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function random(seed: string) {
  let state = hash(seed) || 1;
  return () => {
    // xorshift32: small, fast and good enough for picking hair colours.
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}

const oneOf = <T>(rand: () => number, list: readonly T[]): T => list[Math.floor(rand() * list.length)];

/** Someone else in the scene, made from the seed. */
export function personFrom(seed: string): Character {
  const rand = random(seed);
  const outfit = oneOf(rand, outfits);
  return {
    ...defaultCharacter,
    name: '',
    skin: Math.floor(rand() * skins.length),
    hair: oneOf(rand, hairStyles),
    hairColour: Math.floor(rand() * hairColours.length),
    top: Math.floor(rand() * tops.length),
    outfit,
    bottom: oneOf(rand, bottoms),
    bottomColour: Math.floor(rand() * bottomColours.length),
    facial: rand() < 0.25 ? oneOf(rand, facialHair) : 'none',
    lashes: rand() < 0.5,
    wearing: [],
  };
}

// ---------------------------------------------------------------- people

const FLOOR = 195;

/** A full-length character standing with their feet on the floor, centred on x. */
function figure(character: Character, x: number, height: number, extra = ''): string {
  const width = (height * 120) / 222;
  const inner = characterSvg(character).replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  // The drawing's feet are at y 214 of 222.
  const top = FLOOR - (height * 214) / 222;
  return `<svg class="char ${extra}" x="${(x - width / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${width.toFixed(1)}" height="${height.toFixed(1)}" viewBox="0 0 120 222" overflow="visible">${inner}</svg>`;
}

/** A baby, wrapped in a blanket. */
function baby(x: number, y: number, seed: string): string {
  const rand = random(`${seed}:baby`);
  const skin = oneOf(rand, skins);
  const wrap = oneOf(rand, ['#f4c7c3', '#c7dcf4', '#f6e3a6', '#cfe8d6']);
  return `<g class="baby" transform="translate(${x} ${y})">
    <ellipse cx="0" cy="10" rx="20" ry="13" fill="${wrap}"/>
    <path d="M-16 6c6 6 26 6 32 0" stroke="#fff" stroke-opacity="0.6" stroke-width="2" fill="none"/>
    <circle cx="-14" cy="-2" r="11" fill="${skin}"/>
    <path d="M-24 -6c3-8 16-10 20-2" fill="${wrap}"/>
    <circle cx="-17" cy="-2" r="1.3" fill="#1d1d1f"/><circle cx="-10" cy="-2" r="1.3" fill="#1d1d1f"/>
  </g>`;
}

/** Where the visitor stands, and who is with them. */
function castOf(cast: Cast, seed: string, layout: { me: number; others: number[] }): { me: string; others: string } {
  const me = `<g data-scene-me>${figure(defaultCharacter, layout.me, 150, 'is-me')}</g>`;
  const [a, b] = layout.others;
  switch (cast) {
    case '1':
      return { me, others: figure(personFrom(`${seed}:1`), a, 146) };
    case '2':
      return { me, others: figure(personFrom(`${seed}:1`), a, 146) + figure(personFrom(`${seed}:2`), b, 140) };
    case 'teen':
      return { me, others: figure(personFrom(`${seed}:1`), a, 128) };
    case 'child':
      return { me, others: figure(personFrom(`${seed}:1`), a, 96) };
    case 'baby':
      return { me, others: '' };
    default:
      return { me, others: '' };
  }
}

// ---------------------------------------------------------------- drawing helpers

const r = (x: number, y: number, w: number, h: number, fill: string, rx = 0, extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const c = (x: number, y: number, radius: number, fill: string, extra = '') => `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}" ${extra}/>`;
const p = (d: string, fill: string, extra = '') => `<path d="${d}" fill="${fill}" ${extra}/>`;

const room = (wall: string, floor: string, skirting = 'rgb(0 0 0 / 0.08)') =>
  r(0, 0, 360, 200, wall) + r(0, 172, 360, 28, floor) + r(0, 170, 360, 3, skirting);

function window_(x: number, y: number, w: number, h: number, sky: string, frame = '#ffffff', night = false): string {
  const stars = night
    ? [0.2, 0.5, 0.8].map((f, i) => c(x + w * f, y + h * (0.25 + 0.2 * (i % 2)), 1.2, '#fff', 'class="twinkle"')).join('')
    : '';
  return (
    r(x - 4, y - 4, w + 8, h + 8, frame, 4) +
    r(x, y, w, h, sky, 2) +
    stars +
    (night ? c(x + w * 0.72, y + h * 0.3, 7, '#f6edc8') : c(x + w * 0.25, y + h * 0.75, 18, 'rgb(255 255 255 / 0.35)')) +
    r(x + w / 2 - 1.5, y, 3, h, frame) +
    r(x, y + h / 2 - 1.5, w, 3, frame)
  );
}

const plant = (x: number, y: number, pot = '#c9714f', leaf = '#4f9a6a') =>
  p(`M${x - 10} ${y}h20l-3 18h-14z`, pot) +
  p(`M${x} ${y}c-14-6-16-22-6-28 2 10 6 18 6 28z`, leaf) +
  p(`M${x} ${y}c12-8 18-22 8-30-3 10-7 20-8 30z`, leaf, 'opacity="0.85"') +
  p(`M${x} ${y}c-4-12 0-26 2-32 4 10 2 22-2 32z`, leaf, 'opacity="0.7"');

const lamp = (x: number, y: number, glow: string) =>
  `<line x1="${x}" y1="0" x2="${x}" y2="${y}" stroke="#3a3a3a" stroke-width="1.5"/>` +
  c(x, y + 16, 30, glow, 'opacity="0.18" class="glow"') +
  p(`M${x - 13} ${y + 14}c0-9 6-14 13-14s13 5 13 14z`, '#3d4a44') +
  c(x, y + 15, 4, glow);

// ---------------------------------------------------------------- the settings

type Drawn = { back: string; front?: string; me: number; others: number[]; night?: boolean };

const draw: Record<Setting, (seed: string) => Drawn> = {
  cafe: () => ({
    back:
      room('#f3e6d3', '#c79f7a') +
      window_(22, 34, 92, 74, '#cfe6ee') +
      lamp(150, 12, '#f6c26b') +
      lamp(250, 18, '#f6c26b') +
      r(250, 116, 110, 58, '#8a5a3c', 4) +
      r(246, 112, 118, 8, '#6b4329', 3) +
      r(300, 84, 34, 28, '#3d4a44', 4) +
      r(306, 90, 10, 6, '#a9b8ad', 2) +
      `<g class="steam">${p('M268 104c-4-6 4-8 0-14', 'none', 'stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.8"')}${p('M276 104c-4-6 4-8 0-14', 'none', 'stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.6"')}</g>` +
      r(262, 104, 18, 10, '#fff', 3) +
      plant(56, 154, '#b9644a'),
    front: r(18, 150, 70, 7, '#6b4329', 3) + r(48, 157, 8, 38, '#6b4329') + r(30, 140, 14, 10, '#fff', 3),
    me: 150,
    others: [222, 82],
  }),

  bar: () => ({
    back:
      room('#2e2540', '#3b2a2c', 'rgb(255 255 255 / 0.06)') +
      [36, 72].map((y) => r(20, y, 320, 4, '#5b3a29')).join('') +
      [30, 46, 60, 78, 96, 116, 134, 150, 176, 196, 214, 238, 256, 274, 296, 314].map((x, i) =>
        r(x, (i % 2 ? 50 : 48) - 0, 9, i % 3 ? 22 : 24, ['#7ec4a6', '#e2a24c', '#c25b5b', '#8fb8e3'][i % 4], 3, 'opacity="0.85"'),
      ).join('') +
      lamp(90, 0, '#f6c26b') +
      lamp(270, 0, '#f6c26b'),
    front: r(0, 150, 360, 8, '#7a4b33', 2) + r(0, 158, 360, 42, '#5b3a29'),
    me: 150,
    others: [230, 76],
    night: true,
  }),

  party: () => ({
    back:
      room('#3b3561', '#2b2744', 'rgb(255 255 255 / 0.05)') +
      window_(250, 30, 80, 66, '#1d2b4a', '#4d4775', true) +
      p('M0 18 Q90 52 180 22 T360 20', 'none', 'stroke="#cbbbe8" stroke-width="1.2"') +
      [20, 52, 84, 116, 148, 196, 228, 262, 296, 330].map((x, i) =>
        c(x, 20 + Math.sin((x / 360) * Math.PI * 2) * 10 + 12, 3.4, ['#f6d36b', '#f4a3b8', '#8fe0c9', '#a7c4ff'][i % 4], `class="twinkle" style="animation-delay:${(i % 5) * 0.4}s"`),
      ).join('') +
      r(14, 128, 96, 44, '#6b5ba8', 10) +
      r(14, 112, 96, 24, '#7b6bb8', 10) +
      r(320, 118, 30, 54, '#1f1b33', 4) +
      c(335, 136, 8, '#3a345c') +
      c(335, 158, 6, '#3a345c'),
    me: 160,
    others: [236, 74],
    night: true,
  }),

  club: () => ({
    back:
      r(0, 0, 360, 200, '#1b1530') +
      `<g class="sweep">${p('M60 0L20 172H110z', '#f4a3b8', 'opacity="0.16"')}</g>` +
      `<g class="sweep sweep-2">${p('M300 0L250 172H340z', '#8fe0c9', 'opacity="0.16"')}</g>` +
      c(180, 22, 12, '#cfd5e6') +
      [-6, 0, 6].map((d) => `<line x1="${170 + d * 2}" y1="12" x2="${190 + d * 2}" y2="32" stroke="#8a90a6" stroke-width="0.8"/>`).join('') +
      Array.from({ length: 12 }, (_, i) =>
        r(i * 30, 172, 30, 28, ['#3a2b63', '#2a2050', '#4b2f6b'][i % 3], 0, `class="tile" style="animation-delay:${(i % 4) * 0.5}s"`),
      ).join(''),
    me: 150,
    others: [222, 80],
    night: true,
  }),

  street: () => ({
    back:
      r(0, 0, 360, 200, '#1f2d4d') +
      r(0, 0, 360, 90, '#18233d') +
      [30, 80, 140, 210, 300, 330].map((x, i) => c(x, 14 + (i % 3) * 10, 1.1, '#fff', `class="twinkle" style="animation-delay:${i * 0.5}s"`)).join('') +
      c(306, 30, 12, '#f6edc8') +
      p('M0 120h40v-40l25-20 25 20v40h30v-56h60v56h20v-30l30-24 30 24v30h100v80H0z', '#2c3a5c') +
      [52, 70, 142, 166, 238, 262].map((x, i) => r(x, i % 2 ? 98 : 92, 10, 12, i % 3 === 0 ? '#f6d68a' : '#3d4d73', 1)).join('') +
      r(0, 168, 360, 32, '#4a4f5a') +
      r(0, 166, 360, 4, '#6b707b') +
      r(316, 70, 5, 98, '#2b2f38') +
      c(318, 68, 7, '#f6d68a') +
      p('M318 70L290 168H346z', '#f6d68a', 'opacity="0.14" class="glow"'),
    me: 150,
    others: [226, 80],
    night: true,
  }),

  busstop: () => ({
    back:
      r(0, 0, 360, 200, '#f3cdb0') +
      r(0, 70, 360, 100, '#c8d5e6', 0, 'opacity="0.8"') +
      p('M0 130c60-20 120-10 180-20s120 0 180-10v70H0z', '#a7b6cc') +
      r(0, 168, 360, 32, '#9aa1a8') +
      r(0, 166, 360, 4, '#c6cbd1') +
      r(22, 64, 6, 104, '#3d4a44') +
      r(132, 64, 6, 104, '#3d4a44') +
      r(18, 58, 124, 10, '#3d4a44', 3) +
      r(30, 70, 100, 70, '#e6f1f6', 2, 'opacity="0.55"') +
      r(34, 140, 92, 6, '#5b6670', 2) +
      r(300, 52, 5, 116, '#3d4a44') +
      c(302, 52, 13, '#2f6690') +
      r(292, 48, 20, 8, '#fff', 2, 'opacity="0.85"'),
    me: 190,
    others: [262, 80],
  }),

  train: () => ({
    back:
      r(0, 0, 360, 200, '#dfe6ea') +
      [24, 132, 240].map((x) =>
        r(x - 3, 37, 102, 66, '#c3ccd2', 10) +
        `<svg x="${x}" y="40" width="96" height="60" viewBox="0 0 96 60"><rect width="96" height="60" fill="#bcd8e8"/><g class="drift"><path d="M0 44c20-10 40-6 60-12s40 4 80-4v32H0z" fill="#8fbf8f"/><path d="M96 44c20-10 40-6 60-12s40 4 80-4v32H96z" fill="#8fbf8f"/><rect x="30" y="26" width="4" height="20" fill="#6b8f6b"/><circle cx="32" cy="24" r="8" fill="#7fae7f"/><rect x="126" y="26" width="4" height="20" fill="#6b8f6b"/><circle cx="128" cy="24" r="8" fill="#7fae7f"/></g></svg>`,
      ).join('') +
      r(0, 120, 360, 6, '#c3ccd2') +
      r(0, 126, 360, 46, '#2f6690', 0, 'opacity="0.92"') +
      [0, 90, 180, 270].map((x) => r(x + 6, 132, 78, 34, '#3a76a6', 8)).join('') +
      r(0, 172, 360, 28, '#8b9399') +
      r(118, 0, 4, 172, '#a9b2b8') +
      r(238, 0, 4, 172, '#a9b2b8'),
    me: 160,
    others: [222, 72],
  }),

  bedroom: () => ({
    back:
      room('#2f3a5c', '#3d3a4f', 'rgb(255 255 255 / 0.05)') +
      window_(220, 30, 92, 70, '#1d2b4a', '#4a557a', true) +
      r(6, 128, 120, 44, '#5a6a9c', 8) +
      r(6, 118, 120, 18, '#7584b6', 8) +
      r(12, 108, 40, 18, '#e5e8f2', 8) +
      r(0, 104, 10, 68, '#4a557a', 3) +
      r(138, 140, 30, 32, '#4a557a', 3) +
      c(153, 120, 22, '#f6d68a', 'opacity="0.2" class="glow"') +
      p('M144 132h18l-4-14h-10z', '#f6d68a'),
    me: 200,
    others: [270, 84],
    night: true,
  }),

  living: () => ({
    back:
      room('#ece3d6', '#b89a7a') +
      window_(150, 30, 80, 66, '#cfe6ee') +
      r(30, 40, 40, 30, '#fff', 3) +
      r(34, 44, 32, 22, '#9fc6b5', 2) +
      r(80, 52, 28, 22, '#fff', 3) +
      r(84, 56, 20, 14, '#e8b48a', 2) +
      r(10, 122, 120, 50, '#7f9c8f', 12) +
      r(10, 106, 120, 28, '#8fae9f', 12) +
      r(274, 98, 70, 46, '#1f1f24', 4) +
      r(278, 102, 62, 38, '#2f4858', 2) +
      r(270, 144, 78, 28, '#8a6a4f', 3) +
      plant(250, 154) +
      r(60, 186, 220, 9, '#d9c6ae', 4, 'opacity="0.7"'),
    me: 170,
    others: [236, 82],
  }),

  kitchen: () => ({
    back:
      room('#eef0e6', '#c9b79f') +
      r(0, 20, 360, 46, '#9fc6b5') +
      [0, 60, 120, 180, 240, 300].map((x) => r(x + 4, 24, 52, 38, '#b7d6c8', 4)).join('') +
      r(0, 116, 360, 6, '#d6d0c2') +
      r(0, 122, 360, 50, '#9fc6b5') +
      [0, 72, 144, 216, 288].map((x) => r(x + 6, 128, 60, 40, '#b7d6c8', 4)).join('') +
      r(300, 70, 50, 46, '#e5e7ea', 4) +
      window_(140, 72, 70, 38, '#cfe6ee') +
      `<g class="steam">${p('M60 104c-4-6 4-8 0-14', 'none', 'stroke="#fff" stroke-width="2" stroke-linecap="round"')}</g>` +
      r(48, 104, 26, 12, '#3d4a44', 4),
    front: r(30, 156, 300, 8, '#8a6a4f', 3) + r(48, 164, 8, 31, '#8a6a4f') + r(304, 164, 8, 31, '#8a6a4f') + c(110, 152, 7, '#fff') + c(240, 152, 7, '#fff'),
    me: 140,
    others: [226, 70],
  }),

  office: () => ({
    back:
      room('#e7ecef', '#9aa7b0') +
      window_(24, 30, 120, 70, '#cfe2ee') +
      p('M28 100v-30h14v-12h18v24h16v-20h16v38z', '#a9bccb', 'opacity="0.7"') +
      c(300, 44, 13, '#fff') +
      `<line x1="300" y1="44" x2="300" y2="36" stroke="#3d4a44" stroke-width="2" stroke-linecap="round" class="tick"/>` +
      `<line x1="300" y1="44" x2="306" y2="44" stroke="#3d4a44" stroke-width="2" stroke-linecap="round"/>` +
      plant(336, 154),
    front:
      r(10, 142, 130, 8, '#cfd7dd', 3) +
      r(20, 150, 6, 45, '#8a969e') +
      r(124, 150, 6, 45, '#8a969e') +
      r(50, 108, 50, 32, '#2b3a55', 4) +
      r(54, 112, 42, 24, '#8fb8e3', 2, 'class="screen"') +
      r(72, 140, 6, 4, '#2b3a55') +
      r(250, 146, 100, 8, '#cfd7dd', 3) +
      r(266, 118, 40, 26, '#2b3a55', 4) +
      r(270, 122, 32, 18, '#9fe0d0', 2, 'class="screen"'),
    me: 175,
    others: [226, 290],
  }),

  meeting: () => ({
    back:
      room('#e9e5ef', '#a99fb5') +
      window_(110, 24, 140, 78, '#cfe2ee') +
      r(24, 40, 46, 34, '#fff', 3) +
      r(28, 44, 38, 26, '#c9b7e0', 2) +
      plant(330, 154, '#8a6a9f'),
    front:
      r(20, 150, 320, 10, '#7a6a8c', 4) +
      r(40, 160, 10, 35, '#5f5170') +
      r(310, 160, 10, 35, '#5f5170') +
      r(196, 136, 10, 14, '#d9ecf5', 2, 'opacity="0.9"') +
      r(110, 140, 40, 10, '#fff', 1) +
      r(114, 138, 32, 2, '#c9b7e0'),
    me: 130,
    others: [240, 70],
  }),

  shop: () => ({
    back:
      room('#f1ede4', '#d2c8b6') +
      [26, 62, 98].map((y) =>
        r(10, y + 26, 200, 5, '#b9a88f') +
        [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => r(14 + i * 22, y, 16, 26, ['#e2a24c', '#7ec4a6', '#c25b5b', '#8fb8e3', '#f6d36b'][(i + y) % 5], 2)).join(''),
      ).join('') +
      r(250, 40, 90, 22, '#2f6690', 4),
    front: r(232, 132, 128, 42, '#5b6670', 4) + r(232, 126, 128, 8, '#3d4a44', 3) + r(300, 104, 34, 22, '#2b2b33', 3) + r(304, 108, 26, 12, '#9fe0d0', 2),
    me: 150,
    others: [286, 76],
  }),

  school: () => ({
    back:
      room('#e5ecf3', '#c8cfd6') +
      Array.from({ length: 7 }, (_, i) =>
        r(10 + i * 34, 70, 30, 102, ['#5b8fb9', '#4f9a8a'][i % 2], 3) + r(14 + i * 34, 82, 22, 3, 'rgb(255 255 255 / 0.4)') + r(30 + i * 34, 118, 3, 10, 'rgb(255 255 255 / 0.6)'),
      ).join('') +
      r(262, 34, 84, 60, '#c99a6b', 4) +
      r(268, 40, 24, 18, '#fff') +
      r(298, 44, 20, 26, '#f6d36b') +
      r(322, 40, 18, 16, '#f4a3b8') +
      r(272, 64, 30, 22, '#cfe8df'),
    me: 170,
    others: [236, 92],
  }),

  park: () => ({
    back:
      r(0, 0, 360, 200, '#cfe7f3') +
      c(300, 34, 16, '#f6e3a6') +
      `<g class="drift-slow">${c(60, 34, 12, '#fff')}${c(74, 30, 15, '#fff')}${c(90, 36, 11, '#fff')}${c(200, 22, 9, '#fff')}${c(212, 20, 12, '#fff')}</g>` +
      p('M0 120c60-26 120-30 180-16s120 8 180-10v106H0z', '#a8d4a0') +
      p('M0 150c80-14 160-10 240-2s100 0 120-4v56H0z', '#8fc487') +
      r(36, 92, 8, 62, '#7a5a3c') +
      c(40, 84, 26, '#6fae6a') +
      c(28, 98, 18, '#62a25e') +
      r(318, 100, 7, 50, '#7a5a3c') +
      c(322, 92, 20, '#6fae6a') +
      p('M120 200c20-30 80-40 120-50h40c-40 10-100 20-120 50z', '#e8dcc2', 'opacity="0.8"') +
      r(70, 160, 54, 6, '#8a6a4f', 2) +
      r(74, 166, 4, 14, '#6b5039') +
      r(116, 166, 4, 14, '#6b5039'),
    me: 170,
    others: [240, 110],
  }),

  gym: () => ({
    back:
      room('#dfe3e8', '#4b5058', 'rgb(0 0 0 / 0.15)') +
      r(20, 28, 150, 110, '#c8d6e0', 4) +
      r(24, 32, 142, 102, '#e3edf3', 2, 'opacity="0.7"') +
      p('M40 40l30 80M90 40l30 80', 'none', 'stroke="#fff" stroke-width="3" opacity="0.6"') +
      r(250, 120, 100, 6, '#3d4a44') +
      [262, 290, 318].map((x) => r(x, 108, 8, 18, '#2b2b33', 2) + r(x + 12, 108, 8, 18, '#2b2b33', 2)).join('') +
      r(250, 150, 100, 6, '#3d4a44') +
      r(254, 126, 4, 46, '#3d4a44') +
      r(342, 126, 4, 46, '#3d4a44'),
    me: 160,
    others: [224, 80],
  }),

  nursery: () => ({
    back:
      room('#f6e7e1', '#e5cdbd') +
      window_(232, 30, 80, 62, '#cfe6ee') +
      [40, 80, 120, 300].map((x, i) => p(`M${x} ${22 + (i % 2) * 14}l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z`, '#f6d36b', 'opacity="0.7"')).join('') +
      `<g class="sway">${`<line x1="80" y1="0" x2="80" y2="54" stroke="#8a8f98"/>`}${p('M54 54h52', 'none', 'stroke="#8a8f98"')}${c(56, 64, 6, '#f4a3b8')}${c(80, 68, 6, '#8fb8e3')}${c(104, 64, 6, '#f6d36b')}</g>` +
      r(22, 112, 116, 60, '#fff', 6, 'opacity="0.4"') +
      r(18, 108, 124, 6, '#d9b9a4', 3) +
      Array.from({ length: 9 }, (_, i) => r(26 + i * 13, 114, 4, 52, '#d9b9a4', 2)).join('') +
      r(18, 164, 124, 8, '#d9b9a4', 3),
    me: 196,
    others: [262, 90],
  }),

  road: () => ({
    back:
      r(0, 0, 360, 200, '#d6e8f2') +
      p('M0 110h50v-34l26-18 26 18v34h40v-50h70v50h30v-30l28-20 28 20v30h62v60H0z', '#e8d9c6') +
      [62, 80, 152, 184, 256, 284].map((x, i) => r(x, i % 2 ? 88 : 82, 12, 14, '#9fc6d8', 2)).join('') +
      r(0, 150, 360, 50, '#6b707b') +
      r(0, 148, 360, 6, '#c6cbd1') +
      [20, 100, 180, 260, 340].map((x) => r(x, 182, 40, 4, '#e5e7ea', 2, 'opacity="0.8"')).join('') +
      p('M232 172c0-18 8-30 26-34l18-16c6-4 12-6 20-6h30c10 0 18 8 22 18l6 14c6 2 8 8 8 14v10z', '#2f6690') +
      r(272, 124, 22, 16, '#bcd8e8', 3) +
      r(298, 124, 26, 16, '#bcd8e8', 3) +
      c(262, 176, 11, '#2b2b33') +
      c(330, 176, 11, '#2b2b33') +
      c(262, 176, 4, '#9aa1a8') +
      c(330, 176, 4, '#9aa1a8'),
    me: 130,
    others: [190, 70],
  }),

  clinic: () => ({
    back:
      room('#e3eff0', '#b9cdd0') +
      r(30, 36, 60, 70, '#fff', 4) +
      r(36, 44, 48, 6, '#9fd0c8', 2) +
      r(36, 56, 40, 4, '#c8dadc', 2) +
      r(36, 64, 44, 4, '#c8dadc', 2) +
      r(36, 72, 34, 4, '#c8dadc', 2) +
      c(290, 50, 16, '#4f9a8a') +
      r(287, 40, 6, 20, '#fff', 1) +
      r(280, 47, 20, 6, '#fff', 1) +
      r(250, 118, 100, 10, '#fff', 3) +
      r(250, 128, 100, 44, '#cfe3e5', 3),
    front: r(10, 150, 110, 8, '#9fb8bb', 3) + r(20, 158, 6, 37, '#7f9a9d') + r(104, 158, 6, 37, '#7f9a9d'),
    me: 170,
    others: [234, 90],
  }),

  desk: () => ({
    back:
      room('#29324d', '#353148', 'rgb(255 255 255 / 0.05)') +
      window_(36, 28, 84, 64, '#1d2b4a', '#454f73', true) +
      c(270, 120, 44, '#9fe0d0', 'opacity="0.14" class="glow"') +
      r(238, 104, 64, 40, '#1f2433', 4) +
      r(242, 108, 56, 32, '#9fe0d0', 2, 'opacity="0.85" class="screen"') +
      p('M232 144h76l6 6h-88z', '#3a4258') +
      r(200, 150, 150, 8, '#6b5b8c', 3) +
      r(212, 158, 6, 37, '#52466f') +
      r(332, 158, 6, 37, '#52466f') +
      c(340, 130, 14, '#f6d68a', 'opacity="0.18" class="glow"') +
      p('M334 146h12l-3-12h-6z', '#f6d68a'),
    me: 150,
    others: [90, 60],
    night: true,
  }),
};

// ---------------------------------------------------------------- the whole scene

/** The scene as an SVG string. `seed` keeps the people the same on every visit. */
export function sceneSvg(spec: SceneSpec, seed: string): string {
  const scene = draw[spec.setting](seed);
  const people = castOf(spec.cast, seed, scene);
  // A baby lies in the cot in the nursery; anywhere else, on a play mat beside the visitor.
  let babyAt = '';
  if (spec.cast === 'baby') {
    babyAt =
      spec.setting === 'nursery'
        ? baby(84, 146, seed)
        : `<ellipse cx="${scene.me + 66}" cy="188" rx="34" ry="7" fill="#f4c7c3" opacity="0.8"/>` + baby(scene.me + 70, 172, seed);
  }
  return `<svg viewBox="0 0 360 200" preserveAspectRatio="xMidYMax slice" class="scene-art${scene.night ? ' night' : ''}" aria-hidden="true" focusable="false">${scene.back}${people.others}${people.me}${babyAt}${scene.front ?? ''}</svg>`;
}

export const isSetting = (value: string): value is Setting => (settings as readonly string[]).includes(value);
export const isCast = (value: string): value is Cast => (casts as readonly string[]).includes(value);
