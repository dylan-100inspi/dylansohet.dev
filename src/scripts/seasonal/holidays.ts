import type { SeasonContext, SeasonCleanup } from './load';

export { default as styles } from './holidays.css?inline';

const LAYERS = [
  { name: 'far', fall: [26, 32], drift: [1.5, 2.5] },
  { name: 'mid', fall: [17, 22], drift: [3, 4.5] },
  { name: 'near', fall: [10, 13], drift: [5, 7.5] },
] as const;

const FLAKES_PER_LAYER = 8;
const LIGHT_COUNT = 12;

function between([min, max]: readonly [number, number], ratio: number): number {
  return min + (max - min) * ratio;
}

export function mount({ layer, photo }: SeasonContext): SeasonCleanup {
  for (const { name, fall, drift } of LAYERS) {
    const snow = document.createElement('div');
    snow.className = `holiday-snow holiday-snow--${name}`;

    for (let index = 0; index < FLAKES_PER_LAYER; index++) {
      const ratio = ((index * 5) % FLAKES_PER_LAYER) / FLAKES_PER_LAYER;
      const duration = between(fall, ratio);
      const flake = document.createElement('span');
      flake.className = 'holiday-flake';
      flake.style.setProperty(
        '--x',
        `${(index + 0.5) * (100 / FLAKES_PER_LAYER) + (ratio - 0.5) * 6}%`,
      );
      flake.style.setProperty('--y', `${(ratio * 90 + 5).toFixed(1)}%`);
      flake.style.setProperty('--fall', `${duration.toFixed(1)}s`);
      flake.style.setProperty('--delay', `${((-duration * ((index * 3) % 7)) / 7).toFixed(1)}s`);
      flake.style.setProperty('--drift', `${between(drift, 1 - ratio).toFixed(1)}vw`);
      flake.append(document.createElement('span'));
      snow.append(flake);
    }
    layer.append(snow);
  }

  const lights = document.createElement('span');
  lights.className = 'holiday-lights';
  lights.setAttribute('aria-hidden', 'true');
  lights.dataset.seasonDeco = '';
  for (let index = 0; index < LIGHT_COUNT; index++) {
    const bulb = document.createElement('span');
    bulb.className = 'holiday-light';
    bulb.style.setProperty('--angle', `${(360 / LIGHT_COUNT) * index}deg`);
    bulb.style.setProperty('--delay', `${-(index % 3) * 0.8}s`);
    lights.append(bulb);
  }
  photo?.append(lights);

  return () => lights.remove();
}
