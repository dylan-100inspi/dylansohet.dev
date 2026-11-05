import baseStyles from './base.css?inline';

const SEASONS = ['autumn', 'halloween', 'holidays', 'starwars'] as const;

export type Season = (typeof SEASONS)[number];

export interface SeasonContext {
  readonly layer: HTMLElement;
  readonly photo: HTMLElement | null;
  readonly reducedMotion: boolean;
}

export type SeasonCleanup = () => void;

interface SeasonModule {
  styles: string;
  mount: (context: SeasonContext) => SeasonCleanup;
}

// One chunk per season: only the active season's JS and CSS are ever downloaded.
// CSS is imported with `?inline` because Astro would otherwise hoist it into every page.
const loaders: Record<Season, () => Promise<SeasonModule>> = {
  autumn: () => import('./autumn'),
  halloween: () => import('./halloween'),
  holidays: () => import('./holidays'),
  starwars: () => import('./starwars'),
};

let cleanup: SeasonCleanup | null = null;
let generation = 0;
let stylesAdopted = false;

function adoptStyles(styles: string): void {
  if (stylesAdopted) return;
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(baseStyles + styles);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  stylesAdopted = true;
}

export function isSeason(value: string | undefined): value is Season {
  return (SEASONS as readonly string[]).includes(value ?? '');
}

export async function mountSeason(season: Season): Promise<void> {
  if (cleanup) return;
  const hero = document.getElementById('home');
  if (!hero) return;

  const current = ++generation;
  const { mount, styles } = await loaders[season]();
  // Bail out if the visitor turned the theme off while the chunk was loading.
  if (current !== generation || cleanup) return;
  adoptStyles(styles);

  const layer = document.createElement('div');
  layer.className = 'season-layer';
  layer.setAttribute('aria-hidden', 'true');
  layer.dataset.seasonDeco = '';
  hero.prepend(layer);

  const observer = new IntersectionObserver(([entry]) => {
    if (entry) hero.toggleAttribute('data-season-paused', !entry.isIntersecting);
  });
  observer.observe(hero);

  const unmount = mount({
    layer,
    photo: hero.querySelector<HTMLElement>('[data-season-photo]'),
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  });

  cleanup = () => {
    observer.disconnect();
    hero.removeAttribute('data-season-paused');
    unmount();
    layer.remove();
  };
}

export function unmountSeason(): void {
  generation++;
  cleanup?.();
  cleanup = null;
}
