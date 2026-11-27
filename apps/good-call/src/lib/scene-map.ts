// Which scene each scenario is drawn in (src/lib/scenes.ts).
//
// In order: the scenario's own `scene:` field in its YAML file, then an entry in
// `byScenario` below, then its topic's default in `byTopic`, then the course's.
// Each is written 'setting:cast', such as 'cafe:1' (a café, with one other person)
// or 'nursery:baby'.

import { isCast, isSetting, type SceneSpec } from './scenes';

const byCourse: Record<string, string> = {
  consent: 'living:1',
  'respect-first': 'party:1',
  racism: 'busstop:1',
  'parent-newborn': 'nursery:baby',
  'parent-baby': 'living:baby',
  'parent-toddler': 'living:child',
  'parent-preschool': 'living:child',
  'parent-school': 'kitchen:child',
  'parent-teen': 'kitchen:teen',
  'parent-adoption': 'living:child',
  'parent-you': 'kitchen:1',
  interview: 'meeting:1',
  administrator: 'office:1',
  'customer-service': 'shop:1',
  online: 'bedroom:0',
};

const byTopic: Record<string, string> = {
  'consent/touch': 'living:1',
  'consent/privacy': 'living:1',
  'consent/texting': 'bedroom:0',
  'consent/pressure': 'living:1',
  'consent/nights': 'bar:1',
  'consent/intimacy': 'bedroom:1',
  'consent/yourself': 'desk:0',
  'consent/relationships': 'living:1',
  'respect-first/signals': 'party:1',
  'respect-first/consent': 'living:2',
  'respect-first/people': 'street:1',
  'respect-first/porn': 'desk:0',
  'respect-first/habit': 'bedroom:0',
  'racism/online': 'desk:0',
  'racism/everyday': 'busstop:1',
  'racism/family': 'kitchen:2',
  'racism/work': 'office:1',
  'parent-newborn/safety': 'nursery:baby',
  'parent-newborn/bonding': 'living:baby',
  'parent-newborn/care': 'clinic:baby',
  'parent-baby/safety': 'kitchen:baby',
  'parent-toddler/safety': 'park:child',
  'parent-you/support': 'cafe:1',
  'customer-service/pressure': 'shop:2',
  'online/apps': 'cafe:1',
  'online/snap': 'bedroom:0',
  'online/nudes': 'bedroom:0',
  'online/adult-sites': 'desk:0',
  'online/hooking-up': 'bedroom:1',
  'online/feeds': 'bedroom:0',
};

const byScenario: Record<string, string> = {
  'consent/hug-hello': 'cafe:1',
  'consent/offering-help': 'street:1',
  'consent/stop-means-stop': 'living:2',
  'consent/forwarded-image': 'desk:0',
  'consent/group-photo': 'party:2',
  'consent/told-in-confidence': 'cafe:1',
  'consent/bought-a-drink': 'bar:1',
  'consent/dance-floor': 'club:1',
  'consent/down-it': 'bar:2',
  'consent/staying-over': 'living:1',
  'consent/the-spare-room': 'living:1',
  'consent/the-work-do': 'bar:2',
  'consent/threes-a-crowd': 'party:2',
  'consent/both-had-a-few': 'bedroom:1',
  'consent/the-dare': 'party:2',
  'consent/the-manager': 'bar:1',
  'consent/not-like-the-videos': 'bedroom:1',

  'respect-first/dressed-for-the-night': 'club:1',
  'respect-first/friendly-barista': 'cafe:1',
  'respect-first/her-friend-steps-in': 'bar:2',
  'respect-first/short-replies': 'bedroom:0',
  'respect-first/the-gym-chat': 'gym:1',
  'respect-first/last-weekend': 'living:1',
  'respect-first/not-sure': 'bedroom:1',
  'respect-first/things-go-quiet': 'bedroom:1',
  'respect-first/yes-earlier-drunk-now': 'party:1',
  'respect-first/at-the-bus-stop': 'busstop:1',
  'respect-first/jokes-at-work': 'office:2',
  'respect-first/on-the-train': 'train:1',
  'respect-first/the-group-chat': 'desk:0',
  'respect-first/feeling-guilty': 'bedroom:0',
  'respect-first/its-normal-now': 'living:1',
  'respect-first/measuring-up': 'bedroom:0',
  'respect-first/shown-at-lunch': 'school:2',
  'respect-first/after-a-bad-day': 'desk:0',
  'respect-first/not-cool-mate': 'bar:2',
  'respect-first/telling-someone': 'cafe:1',
  'respect-first/the-slip': 'bedroom:0',
  'respect-first/time-to-get-help': 'clinic:1',

  'racism/on-the-bus': 'train:2',
  'racism/really-from': 'party:1',
  'racism/the-hair': 'office:1',
  'racism/said-it-at-school': 'kitchen:child',
  'racism/too-dark': 'park:child',
  'racism/the-cv-pile': 'office:0',
  'racism/someone-english': 'shop:1',
  'racism/watch-those-two': 'shop:2',

  'parent-newborn/sofa-sleep': 'living:baby',
  'parent-newborn/visitors': 'living:baby',
  'parent-newborn/not-just-tired': 'living:0',
  'parent-newborn/partner-left-out': 'living:1',
  'parent-newborn/slow-bond': 'nursery:baby',
  'parent-newborn/feeding-comments': 'living:1',

  'parent-baby/drop-off': 'nursery:baby',
  'parent-baby/stranger-anxiety': 'living:1',
  'parent-baby/not-crawling': 'park:baby',
  'parent-baby/car-seat': 'road:baby',
  'parent-baby/hot-drink': 'living:baby',
  'parent-baby/on-the-move': 'living:baby',
  'parent-baby/the-fall': 'nursery:baby',

  'parent-toddler/monsters': 'bedroom:child',
  'parent-toddler/supermarket-tantrum': 'shop:child',
  'parent-toddler/button-battery': 'living:child',
  'parent-toddler/biting': 'nursery:child',

  'parent-preschool/starting-school': 'school:child',
  'parent-preschool/bedwetting': 'bedroom:child',
  'parent-preschool/crossing-roads': 'road:child',
  'parent-preschool/safe-adult': 'shop:child',
  'parent-preschool/loud-question': 'busstop:child',
  'parent-preschool/the-sweets': 'shop:child',

  'parent-school/bedtime-worries': 'bedroom:child',
  'parent-school/left-out': 'park:child',
  'parent-school/first-sleepover': 'living:child',
  'parent-school/gaming-chat': 'living:child',
  'parent-school/goodbye-hug': 'living:child',
  'parent-school/walking-alone': 'road:child',
  'parent-school/your-child-the-bully': 'school:child',

  'parent-teen/first-breakup': 'bedroom:teen',
  'parent-teen/self-harm': 'bedroom:teen',
  'parent-teen/exam-results': 'school:teen',
  'parent-teen/school-refusal': 'bedroom:teen',
  'parent-teen/new-driver': 'road:teen',
  'parent-teen/no-answer': 'street:0',
  'parent-teen/search-history': 'desk:0',
  'parent-teen/the-vape': 'bedroom:0',
  'parent-teen/reading-messages': 'kitchen:0',
  'parent-teen/shoplifting': 'shop:teen',

  'parent-adoption/hiding-food': 'bedroom:child',
  'parent-adoption/birth-family-message': 'living:0',
  'parent-adoption/not-my-real-mum': 'kitchen:teen',

  'parent-you/arguing': 'kitchen:1',
  'parent-you/co-parenting': 'road:1',
  'parent-you/lost-your-temper': 'kitchen:child',
  'parent-you/comparing': 'living:0',
  'parent-you/the-mental-load': 'kitchen:1',

  'administrator/phone-number-request': 'office:0',
  'administrator/petty-cash': 'office:0',
  'administrator/shared-login': 'office:1',
  'administrator/wrong-recipient': 'office:0',
  'administrator/two-deadlines': 'office:0',

  'customer-service/abusive-caller': 'office:0',
  'customer-service/colleague-wrong': 'shop:2',
};

function parse(value: string | undefined): SceneSpec | undefined {
  if (!value) return undefined;
  const [setting, cast = '0'] = value.split(':');
  return isSetting(setting) && isCast(cast) ? { setting, cast } : undefined;
}

/** The scene for a scenario, given its id ('consent/hug-hello'), course, topic and any `scene:` of its own. */
export function sceneFor(id: string, set: string, topic: string | undefined, own?: string): SceneSpec {
  return (
    parse(own) ?? parse(byScenario[id]) ?? parse(topic ? byTopic[`${set}/${topic}`] : undefined) ?? parse(byCourse[set]) ?? { setting: 'living', cast: '0' }
  );
}

/** The scene for a topic as a whole, as shown on its intro and on the course page. */
export function sceneForTopic(set: string, topic: string): SceneSpec {
  return parse(byTopic[`${set}/${topic}`]) ?? parse(byCourse[set]) ?? { setting: 'living', cast: '0' };
}

/** The same, as the 'setting:cast' text written into the page. */
export const specText = (spec: SceneSpec) => `${spec.setting}:${spec.cast}`;
