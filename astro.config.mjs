// @ts-check
import { defineConfig } from 'astro/config';

// The site is served from the root of dilutedstories.com. `site` is used for
// canonical and Open Graph URLs; keep it in step with src/lib/paths.ts.
export default defineConfig({
  site: 'https://dilutedstories.com',
  trailingSlash: 'always',
  build: {
    // One small stylesheet per page: inline it so there is no render-blocking request.
    inlineStylesheets: 'always',
  },
});
