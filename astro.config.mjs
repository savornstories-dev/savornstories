import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://savornstories.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    // Development preview host only; this does not affect the static production build.
    server: { allowedHosts: ['terminal.local'] },
  },
});
