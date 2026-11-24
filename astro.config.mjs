// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

// The deploy workflow sets these from GitHub Pages (actions/configure-pages):
//   SITE_URL  = https://<user>.github.io        (or a custom domain)
//   BASE_PATH = /<repo>   ('' for a user/organization site or a custom domain)
// Locally they're unset, so the site runs at http://localhost:4321/edu-learn/.
const site = process.env.SITE_URL || 'https://example.github.io';
const base = process.env.BASE_PATH !== undefined ? process.env.BASE_PATH || '/' : '/edu-learn';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  output: 'static',
  integrations: [preact()],
  vite: {
    plugins: [tailwindcss()],
  },
});
