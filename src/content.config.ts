import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Each file in src/content/blog is one post. If a field below is missing or the
// wrong shape, `npm run build` fails and says which one.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    // Shown in the post list and used for search results and link previews.
    description: z.string().min(40).max(160),
    publishedAt: z.coerce.date(),
    // New posts start as drafts. Drafts show in `npm run dev` but are left out of the live site.
    draft: z.boolean().default(true),
  }),
});

export const collections = { blog };
