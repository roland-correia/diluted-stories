// The character builder (src/pages/profile/character.astro): shows the saved
// choices, unlocks earned items, redraws the character on its stage after every
// change, and saves.

import { readProfile, unlockedAchievements, unlockedItems, updateProfile } from './store';
import { backgroundColour } from './avatar';
import { mountStage } from './stage';
import { accessories, type AccessoryId } from '../lib/courses';
import { bonusBackgrounds, bottoms, defaultCharacter, facialHair, hairStyles, outfits, type Character } from '../lib/game';
import { href } from '../lib/paths';

const form = document.querySelector<HTMLFormElement>('[data-builder]');

if (form) {
  const preview = form.querySelector<HTMLElement>('[data-preview]')!;
  const items = unlockedItems();
  const earned = unlockedAchievements();

  // Unlock what has been earned. Locked choices stay visible, so it is clear what there is to win.
  form.querySelectorAll<HTMLInputElement>('[data-needs-course]').forEach((input) => {
    const open = items.has(input.value as AccessoryId);
    input.disabled = !open;
    const note = input.parentElement!.querySelector<HTMLElement>('[data-lock-note]');
    if (open && note) note.textContent = 'Unlocked';
  });
  form.querySelectorAll<HTMLInputElement>('[data-needs-achievement]').forEach((input) => {
    input.disabled = !earned.has(input.dataset.needsAchievement!);
  });

  const pick = (name: string, value: string) => {
    const input = form.querySelector<HTMLInputElement>(`input[name="${name}"][value="${CSS.escape(value)}"]`);
    if (input && !input.disabled) input.checked = true;
  };

  // Show the saved character.
  const saved = readProfile().character;
  form.querySelector<HTMLInputElement>('input[name="name"]')!.value = saved.name;
  pick('skin', String(saved.skin));
  pick('hair', saved.hair);
  pick('hairColour', String(saved.hairColour));
  pick('top', String(saved.top));
  pick('background', String(saved.background));
  pick('outfit', saved.outfit);
  pick('bottom', saved.bottom);
  pick('bottomColour', String(saved.bottomColour));
  pick('facial', saved.facial);
  pick('lashes', saved.lashes ? 'yes' : 'no');
  for (const id of saved.wearing) if (id in accessories) pick(`slot-${accessories[id].slot}`, id);

  function current(): Character {
    const data = new FormData(form!);
    const number = (name: string, fallback: number) => {
      const n = Number(data.get(name));
      return Number.isInteger(n) && n >= 0 ? n : fallback;
    };
    const hair = String(data.get('hair'));
    const oneOf = <T extends readonly string[]>(list: T, name: string, fallback: T[number]): T[number] => {
      const value = String(data.get(name) ?? '');
      return (list as readonly string[]).includes(value) ? (value as T[number]) : fallback;
    };
    const background = String(data.get('background') ?? '');
    const wearing = ['head', 'face', 'neck', 'detail']
      .map((slot) => String(data.get(`slot-${slot}`) ?? ''))
      .filter((id): id is AccessoryId => id in accessories);
    return {
      name: String(data.get('name') ?? '').trim().slice(0, 20),
      skin: number('skin', defaultCharacter.skin),
      hair: (hairStyles as readonly string[]).includes(hair) ? (hair as Character['hair']) : defaultCharacter.hair,
      hairColour: number('hairColour', defaultCharacter.hairColour),
      top: number('top', defaultCharacter.top),
      background: background in bonusBackgrounds ? (background as keyof typeof bonusBackgrounds) : number('background', 0),
      wearing,
      outfit: oneOf(outfits, 'outfit', defaultCharacter.outfit),
      bottom: oneOf(bottoms, 'bottom', defaultCharacter.bottom),
      bottomColour: number('bottomColour', defaultCharacter.bottomColour),
      facial: oneOf(facialHair, 'facial', defaultCharacter.facial),
      lashes: data.get('lashes') === 'yes',
    };
  }

  // The character stands on its stage and moves about; each change redraws it in place.
  const stage = mountStage(preview, current());
  let look = '';
  const draw = () => {
    const character = current();
    preview.style.setProperty('--char-bg', backgroundColour(character));
    // Typing a name does not change the drawing, so it does not interrupt a move.
    const next = JSON.stringify({ ...character, name: '' });
    if (next !== look) stage.draw(character);
    look = next;
  };
  form.addEventListener('input', draw);
  form.addEventListener('change', draw);
  draw();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const character = current();
    updateProfile((profile) => {
      profile.character = character;
      profile.customised = true;
    });
    location.href = href('/profile/');
  });
}
