# Good Call

Practice for judgement: short scenarios on consent, race, parenting and situations at work. You
choose what you would do, then see why each choice helps or harms. It works like a reading app:
each course is a book with its own cover, read one card at a time, with a character, streaks,
achievements and points. Built with [Astro](https://astro.build), served at
`dilutedstories.com/projects/good-call/`.

## Run it on your computer

You need Node 22.12 or newer (`brew install node`). Then, from this folder:

```bash
npm install     # once, to download the dependencies
npm run dev     # live preview at http://localhost:4321/projects/good-call/
```

Stop it with `Ctrl+C`. `npm run dev` also shows **draft** scenarios.

| Command | What it does |
| --- | --- |
| `npm run dev` | Live preview while you write. Drafts are visible. |
| `npm run check` | Type-checks the code. Run it before you commit. |
| `npm run build` | Builds the real site into `dist/`. Drafts are left out. |
| `npm run preview` | Serves what `build` produced. |

## Add a scenario

1. Copy a file in a folder under `src/content/scenarios/`. There is one folder per set, such as
   `consent/`, `parent-toddler/` or `interview/`. Rename the copy: the file name becomes the URL
   (`my-scenario.yaml` is `/practice/consent/my-scenario/`).
2. Fill in the fields and leave `draft: true` while you work on it.
3. Run `npm run dev` and answer it the way a visitor will. Check every option, not just the best one.
4. Check any fact or law it mentions against the source. Then change `draft` to `false`.
5. Commit on a new branch, open a pull request, and merge it. The site rebuilds and deploys itself.

Every scenario needs these fields, and the build **fails with a clear message** if one is missing:

| Field | What it is |
| --- | --- |
| `set`, `order` | Which set it belongs to (the folder name, such as `consent` or `interview`) and its position in it. |
| `category` | Which chapter it belongs to. Every set is split into chapters, listed in `categories` in `src/lib/site.ts`. `order` then sorts within the chapter. |
| `title`, `topic` | The heading, and the skill or theme shown as a small label. |
| `situation` | What is happening. Leave a blank line between paragraphs. |
| `question` | Optional. Defaults to "What is the best call?". Interview questions use "Which answer works best?". |
| `options` | Three or four. Each has `text`, `call` and `why`. Exactly one must be `call: best`. |
| `principle` | The idea to take away, shown once the best answer is found. |
| `draft` | Whether it is still a draft. |

`call` is the verdict: `best` (Good call), `okay` (Could be better) or `risky` (Not the best call).
`why` is the feedback, and every option must have one, including the best. Vary which position the
best answer sits in.

Each set (a course) is split into topics, listed in `categories` in `src/lib/site.ts`, in the order
shown. Every course has two pages:

- **The book page**, `/courses/<set>/`: the cover, progress, what it covers, a card per topic with
  its photograph, the character item it unlocks, the charities connected to it, and a Start
  (or Continue) button.
- **The reader**, `/practice/<set>/`: one continuous deck of cards through every topic in turn
  (`src/scripts/deck.ts`). It opens on the first unanswered card, with round Back and Next buttons
  and a Listen button (read aloud by the browser) at the bottom of the screen, swiping on touch
  screens and arrow keys. The bar at the top has one segment per topic. After the last card, a
  summary shows every answer by topic, the points earned and the item unlocked, then the next book.

Each question also has a page of its own at `/practice/<set>/<scenario>/`, for direct links. The old
topic pages at `/practice/<set>/topics/<topic>/` redirect to that topic's first card, and the old
`/parenting/` and `/work/` pages to their shelves on the home page. To add a topic, add a line to
`categories`, use its name in a scenario's `category`, and give it a photo (see below).

## Add a set, a role or a parenting module

1. Add it to `sets` in `src/lib/site.ts` with a `group`, an `intro`, a `note`, its `rules` and
   `live: true`. The group decides which shelf of the home page it sits on: `everyday`,
   `parenting` or `work`. Sets marked `live: false` show as "Coming soon".
2. Add it to `courses` in `src/lib/courses.ts`: its cover (title lines, colours and picture), the line
   on its book page, its Explore category, its charities and the character item it unlocks.
3. Add its name to the `set` list in `src/content.config.ts`.
4. Create `src/content/scenarios/<set>/` and add scenarios to it.
5. Add a photo for each of its topics (see below).

The parenting courses (`parent-newborn` to `parent-teen`, then `parent-adoption` and `parent-you`)
are on the home page's "Parenting, age by age" shelf in the order they are written in `site.ts`,
and share one list of support links in `src/components/Support.astro`.

## Module notes

A topic can open with short teaching before its first question: an opener, tables, key points and one habit
to practise, with a link to the course's help list. Write them in `src/lib/lessons.ts`, keyed by
`set/topic`; `src/components/Lesson.astro` shows them, folded open, at the top of the topic's first card
in the reader. Respect First uses them for all five modules. A topic without notes goes straight to its
questions. Tables of three or more columns stack into blocks on phones.

## Photos

Each topic has one photograph, shown on its course's book page and on every card in the topic. They
are in `src/assets/photos/` and listed, with alt text and credits, in `src/lib/photos.ts`. Astro
resizes them and serves WebP at the right size. Rules:

- Only photos under the [Unsplash Licence](https://unsplash.com/license), downloaded from
  `images.unsplash.com`. Never Unsplash+ photos, which need a paid licence.
- Look at every photo before using it. On sensitive topics (sex, pornography, abuse, racism) prefer
  hands, objects or places to identifiable faces, and never show a child next to a sensitive topic.
- Write alt text that says what the photo shows, and credit the photographer. Credits appear on each
  card and on the About page.

## Opening screen and name

Arriving from outside Good Call shows the opening screen: the mark draws itself, the speech
bubble then the tick. Until a visitor has given a name, it also asks "What should we call you?",
and that name is used throughout ("Hi, Sam", "Playing as Sam"). Moving between Good Call's own
pages does not show it again. The decision is made by a small inline script in `Base.astro`
before the page paints, so it never flashes. Without JavaScript it never appears.

## Info pop-ups, saved courses and long-form pages

- Detail that would crowd a page sits behind an "i" button (`src/components/InfoTip.astro`), which
  opens a pop-up using the browser's popover; `src/scripts/info.ts` covers older browsers.
- Saved courses are on Explore: the bookmark beside the title opens a half-screen sheet
  (`src/scripts/saved.ts`) with one sideways-scrolling shelf.
- About, Disclaimer and Privacy are separate pages, linked from the footer with Cookies. Their text is
  justified, and About's Donate button is a placeholder until a payment link exists.

## Text and spacing

Every font size comes from one scale, the `--t-*` tokens at the top of `src/styles/global.css`
(xs, sm, base, md, lg, xl, 2xl). Use a token rather than a new size, so text that plays the same
part looks the same everywhere. Long-form pages (About, Disclaimer) use `.longform` and
`.page-section`: plain text, no cards, with space and a hairline between sections.

## Character, points, streaks and achievements

All of it lives in the visitor's browser, under `gc-profile` and `gc-stats` (`src/scripts/store.ts`),
beside `gc-progress` (answers) and `gc-settings` (reading settings). The cookies page of the root
site lists every key (`src/data/storage.ts` in the repository root); keep it in step.

- **Points, streaks and achievements are worked out, not stored**, from the answers, the time spent
  and the learning days (`src/lib/game.ts`), so they can never drift out of step.
- **Time** counts only while a page is on screen and the visitor has done something in the last three
  minutes (`src/scripts/activity.ts`). A day counts towards the streak after a minute of learning or
  one answer.
- **Points are collected, not spent, for now.** Turning them into real donations to each course's
  charities is planned but not released, and the pages say so. Before it is switched on, it needs an
  agreement with each charity (in the UK, the commercial participator rules apply).
- **The character** is drawn as SVG (`src/scripts/avatar.ts`): head and shoulders in small places,
  full length on the Profile tab and in the builder, where `src/scripts/stage.ts` makes it breathe,
  blink, walk about and do moves (wave, jump, dance, cheer, a heart), livelier on hover and on tap.
  Clothes and features (T-shirt, hoodie, shirt or dress; trousers, shorts or skirt; facial hair;
  lashes) are open to every character, with no gender labels. Finishing a course unlocks the item
  named in `courses`. The name appears on each card ("Playing as Sam") and in the question.
- **Ads are not used.** Unlocking outfits or earning points by watching ads was considered and left
  out for now: it needs an ad network account, a cookie consent banner and changes to the privacy
  notice, which currently promises no tracking.
- **Book covers** are drawn as animated SVG (`src/components/BookCover.astro`), so they need no image
  licence. All movement stops for visitors who ask their device for reduced motion.

## How it is put together

```
src/content.config.ts    the rules every scenario must follow (the schema)
src/content/scenarios/   the scenarios, one YAML file each, in a folder per set
src/lib/site.ts          the sets, their categories (topics) and the three verdicts
src/lib/courses.ts       each course as a book: cover, Explore category, charities and unlockable item
src/lib/game.ts          character options, points, achievements, streak and time rules
src/lib/photos.ts        the photo for each topic, with alt text and credit
src/pages/               home (shelves), explore (search), profile and the character builder, a course's
                         book page, its reader, one scenario, about (the brand page)
src/layouts/Base.astro   the page shell: app bar with streak and points, tab bar, footer, the opening screen,
                         or a bare page for reading
src/components/          book covers, books, the tab bar, quiz card, settings dialog, support links
src/scripts/             splash.ts (the opening screen, which asks for a name), scenario.ts (lock in an answer), deck.ts (the reader), listen.ts (read aloud),
                         cast.ts (the visitor's character in each card), progress.ts (saved answers),
                         store.ts (profile and stats), activity.ts (time, streak, toasts), books.ts,
                         book.ts, explore.ts, profile.ts, character.ts, avatar.ts, settings.ts
src/styles/global.css    colours, type and layout, all in one place
```

Choices worth knowing about:

- **No timer, but one go.** Visitors can take as long as they like, then lock in an answer. A locked
  answer cannot be changed, on that visit or a later one, so it is their real first judgement.
  They can still read the reasons for the other answers afterwards.
- **Three verdicts, not right and wrong.** Each has a label and a mark, so it never depends on colour.
- **The quiz is progressive enhancement.** Without JavaScript every reason is on the page, so each
  scenario reads as a worked example.
- **Nothing leaves the browser.** Answers, the character, time and reading settings are kept in
  `localStorage`. There is no account, no analytics and no third-party request: photos and fonts
  are served from this site.
- **Progress is saved and shown** on every book and book page. "Clear my answers and start again" at
  the end of a course is the only way to answer again, and "Delete all my Good Call data" on the
  Profile tab removes everything.
- **Uploads are not possible.** Courses are written here, reviewed and published by us.
- **Links use `href()`** from `src/lib/paths.ts`, so nothing hard-codes the `/projects/good-call` base path.

## Before this is promoted

The scenarios are first versions. The Disclaimer page (`/disclaimer/`) says so. They have not been reviewed by a consent
educator, a lawyer or a recruiter. The legal points (capacity to consent, sleep, agreed conditions,
sending and sharing intimate images, reporting a data breach) describe the law in England and Wales
and should be re-checked before each is relied on.

## How it deploys

`.github/workflows/deploy.yml` (in the repo root) runs on every pull request, to catch problems,
and on every merge to `main`, to publish. It builds the Diluted Stories site, builds each app in
`apps/` into `projects/<app name>/` beside it, and uploads the result to GitHub Pages.
