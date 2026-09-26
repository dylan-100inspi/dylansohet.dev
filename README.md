# dylansohet.dev

<img src="https://img.shields.io/badge/Astro-0C1222?style=for-the-badge&logo=astro&logoColor=FDFDFE" />
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
<img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
<img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" />
<img src="https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white" />
<img src="https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E" />
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
<img src="https://img.shields.io/badge/Lighthouse-F44B21?style=for-the-badge&logo=Lighthouse&logoColor=white" />

[![CI](https://github.com/dylan-100inspi/dylansohet.dev/actions/workflows/ci.yml/badge.svg)](https://github.com/dylan-100inspi/dylansohet.dev/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-14B8A6.svg)](./LICENSE)
[![Live](https://img.shields.io/website?url=https%3A%2F%2Fdylansohet.dev&label=dylansohet.dev)](https://dylansohet.dev)

Source code for my personal portfolio — a fast, bilingual (FR/EN), static site built with Astro.

**Live:** [dylansohet.dev](https://dylansohet.dev)

## Tech Stack

| Category     | Choice                                                                         |
| ------------ | ------------------------------------------------------------------------------ |
| Framework    | [Astro](https://astro.build/) — static-first, zero-JS by default, native i18n  |
| Styling      | [Tailwind CSS v4](https://tailwindcss.com/) — utility-first, mobile-first      |
| Language     | [TypeScript](https://www.typescriptlang.org/) (strict mode)                    |
| Icons        | [Lucide](https://lucide.dev/)                                                  |
| Tooling      | [ESLint](https://eslint.org/) (flat config) + [Prettier](https://prettier.io/) |
| Runtime      | [Node.js](https://nodejs.org/) LTS                                             |
| Package man. | [pnpm](https://pnpm.io/)                                                       |
| Hosting      | [Vercel](https://vercel.com/) — auto-deploy from `main`, HTTPS + CDN           |

Interactive widgets (command palette, menus) are vanilla TypeScript on native elements — no client-side framework runtime.

## Development

**Prerequisites**

- Node.js — version pinned in [`.nvmrc`](./.nvmrc) (current LTS line)
- pnpm via [Corepack](https://nodejs.org/api/corepack.html) — `corepack enable pnpm`

**Commands**

```bash
pnpm install   # install dependencies
pnpm dev       # start the dev server (http://localhost:4321)
pnpm build     # build the production site to ./dist
pnpm preview   # preview the production build
pnpm check     # type-check (astro check)
pnpm lint      # lint (ESLint)
pnpm format    # format (Prettier)
```

## Project Structure

```
src/
  assets/       — Images and fonts (optimized/bundled by Astro)
  components/   — Astro components (feature folders: command-palette/, projects/)
  config/       — Brand constants and section config
  i18n/         — French/English translation dictionaries
  layouts/      — Base layout with <head> meta, nav, footer
  pages/        — Routes: root redirect, /fr/, /en/, 404
  scripts/      — Client-side TypeScript (progressive enhancement)
  styles/       — Global styles and Tailwind config
public/         — Static assets: docs, icons, robots.txt, manifest
```

## License

The source **code** in this repository is licensed under the [MIT License](./LICENSE).

Personal **content and assets** — written copy, translations, photographs, the downloadable CV/résumé files, and personal branding — are **not** covered by MIT and remain all rights reserved. See [`LICENSE-CONTENT`](./LICENSE-CONTENT) for the full terms. You may read and learn from the code, but you may not reuse the personal content or present it as your own.
