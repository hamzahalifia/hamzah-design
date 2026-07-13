// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { fileURLToPath } from 'url';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
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

