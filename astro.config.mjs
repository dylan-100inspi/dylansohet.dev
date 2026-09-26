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

  // CSP is emitted as a <meta> tag: Astro auto-hashes every script/style it
  // bundles or inlines. Only the hand-written `is:inline` scripts and external
  // origins need manual entries below. `frame-ancestors` cannot live in a
  // <meta> CSP, so it stays as an HTTP header in vercel.json.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "form-action 'self'",
        // blob: lets the 3D easter-egg (model-viewer) load GLB-embedded textures.
        "img-src 'self' data: blob:",
        "font-src 'self'",
        "connect-src 'self' https://cloud.umami.is blob:",
        "manifest-src 'self'",
        'upgrade-insecure-requests',
      ],
      scriptDirective: {
        // 'wasm-unsafe-eval' lets model-viewer compile its WebAssembly (3D egg)
        // without enabling general eval().
        resources: ["'self'", 'https://cloud.umami.is', "'wasm-unsafe-eval'"],
        // Hand-written is:inline scripts Astro does not process: root-locale
        // redirect (index.astro), no-FOUC theme + reveal-motion (BaseLayout).
        hashes: [
          'sha256-VuXFE0ohOPI6dGIChn1AKT6R/NpHAaNQuDnuJm3KtNY=',
          'sha256-SjdYx78752ievk2BYq/lFta32vpVf6gmzU/+C1VQGvQ=',
          'sha256-3Ozvi5u5h5KMcX/2rz6VATYOk96IS1yU7S0wlSFpcuo=',
        ],
      },
      styleDirective: {
        resources: ["'self'", "'unsafe-inline'"],
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['@google/model-viewer'],
    },
  },
});
