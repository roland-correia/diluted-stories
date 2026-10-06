# Diluted Stories

The website for Diluted Stories, a business consultancy that runs marketing campaigns and social
media ads and builds websites. Built with [Astro](https://astro.build), served at `dilutedstories.com`.

Pages: Home, Services, Blog, Team and Contact.

## Run it on your computer

You need Node 22.12 or newer (`brew install node`). Then, from this folder:

```bash
npm install     # once, to download the dependencies
npm run dev     # live preview at http://localhost:4321/
```

Stop it with `Ctrl+C`. `npm run dev` also shows **draft** blog posts.

| Command | What it does |
| --- | --- |
| `npm run dev` | Live preview while you work. Drafts are visible. |
| `npm run check` | Type-checks the code. Run it before you commit. |
| `npm run build` | Builds the real site into `dist/`. Drafts are left out. |
| `npm run preview` | Serves what `build` produced. |

## Where to change things

| To change | Edit |
| --- | --- |
| Email address and phone number | `src/lib/site.ts` (`contact`) |
| Menu links | `src/lib/site.ts` (`nav`) |
| Social media links | `src/lib/site.ts` (`socials`) |
| The three services and the "how we work" steps | `src/data/services.ts` |
| The team | `src/data/team.ts` |
| Wording on the home, contact and other pages | the file in `src/pages/` |
| Colours, type and layout | `src/styles/global.css` |

The email address is split in two (`emailUser` and `emailDomain`) and put together in the browser,
so it never appears whole in the page source. That keeps it away from bots that scan for "@". The
phone number is written out normally.

### The team page

Each person in `src/data/team.ts` is a card. Entries marked `placeholder: true` show a
"Placeholder" label. Replace the name, role and bio, then delete the `placeholder` line.

## Write a blog post

1. Copy a file in `src/content/blog/` and rename it. The file name becomes the address
   (`my-post.md` is `/blog/my-post/`).
2. Fill in the front matter (the block between the `---` lines): `title`, `description` (40 to 160
   characters, used for search results and link previews), `publishedAt`, and leave `draft: true`
   while you write.
3. Write the post under it in Markdown. `##` makes a subheading.
4. Run `npm run dev` and read it the way a visitor will.
5. When it is ready, change `draft: true` to `draft: false`.
6. Commit on a new branch, open a pull request, and merge it. The site rebuilds and deploys itself.

Reading time is worked out from the words in the post. To preview drafts in a production build, run
`PUBLIC_SHOW_DRAFTS=true npm run build`.

## Reading settings

The **Aa** button opens a small panel for text size, spacing and background. The choices are saved
in the visitor's browser only. A tiny script in `Base.astro` applies them before the page paints.

## How it deploys

`.github/workflows/deploy.yml` runs on every pull request, to catch problems, and on every merge to
`main`, to publish. It installs, type-checks and builds the site, then uploads `dist/` to GitHub Pages.

The custom domain is set in the repository's **Settings > Pages** (not in a `CNAME` file, which
Actions-based deploys ignore). `dilutedstories.com` needs these DNS records at the registrar:

- Four `A` records on the apex (`@`): `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- A `CNAME` record for `www` pointing to `roland-correia.github.io`

## Other files

- `public/` holds the tab icons and `og-default.png`, the image shown in link previews. Its source
  is `design/og-default.html`; the comment at the top of that file explains how to regenerate it.
- `design/ds-logo.png` is the original logo artwork the tab icons were made from.
