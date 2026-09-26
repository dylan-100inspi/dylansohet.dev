// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dylansohet.dev',

  devToolbar: {
    enabled: false,
  },

  fonts: [
    {
      provider: fontProviders.fontshare(),
      name: 'Satoshi',
      cssVariable: '--font-satoshi',
      weights: [400, 500, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['monospace'],
    },
    // Display faces for the Loki-style font-roll on the 404 page (loaded only there).
    {
      provider: fontProviders.google(),
      name: 'Kirang Haerang',
      cssVariable: '--font-loki-kirang',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['cursive'],
    },
    {
      provider: fontProviders.google(),
      name: 'Indie Flower',
      cssVariable: '--font-loki-indie',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['cursive'],
    },
    {
      provider: fontProviders.google(),
      name: 'Rye',
      cssVariable: '--font-loki-rye',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Amatic SC',
      cssVariable: '--font-loki-amatic',
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['cursive'],
    },
    {
      provider: fontProviders.google(),
      name: 'Bangers',
      cssVariable: '--font-loki-bangers',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['cursive'],
    },
    {
      provider: fontProviders.google(),
      name: 'Fredericka the Great',
      cssVariable: '--font-loki-fredericka',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['serif'],
    },
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: {
      prefixDefaultLocale: true,
    },
  },

  integrations: [
    sitemap({
      // Exclude the root `/` language-redirect stub (noindex) from the sitemap.
      filter: (page) => page !== 'https://dylansohet.dev/',
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-CA',
          fr: 'fr-CA',
        },
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['@google/model-viewer'],
    },
  },
});
