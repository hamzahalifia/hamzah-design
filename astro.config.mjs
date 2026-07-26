// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'url';

// https://astro.build/config
export default defineConfig({
  site: 'https://hamzah.design',
  integrations: [react(), sitemap()],
  server: {
    headers: {
      'Link': '</.well-known/api-catalog>; rel="api-catalog", </docs/api>; rel="service-doc"',
    },
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});


