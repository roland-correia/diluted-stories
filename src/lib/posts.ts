import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

// Drafts appear while you work (`npm run dev`) and in a preview built with
// PUBLIC_SHOW_DRAFTS=true. A normal build for the live site leaves them out.
const showDrafts = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_DRAFTS === 'true';

export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('blog', ({ data }) => showDrafts || !data.draft);
  return all.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

const WORDS_PER_MINUTE = 200;

// Measured from the words in the post, never typed by hand. HTML comments are
// left out because they never show on the page.
export function readMinutes(post: Post): number {
  const body = (post.body ?? '').replace(/<!--[\s\S]*?-->/g, '');
  const words = `${post.data.title} ${body}`.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
