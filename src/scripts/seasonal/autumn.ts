import type { SeasonContext, SeasonCleanup } from './load';
import leafSvg from './assets/leaf.svg?raw';

export { default as styles } from './autumn.css?inline';

// [left %, rest top %, size px, fall duration s, delay s, color]
const LEAVES: readonly (readonly [number, number, number, number, number, string])[] = [
  [8, 18, 22, 17, -3, '#f59e0b'],
  [24, 62, 18, 21, -12, '#d97706'],
  [41, 30, 26, 19, -7, '#b45309'],
  [63, 74, 20, 23, -16, '#f59e0b'],
  [79, 22, 24, 18, -1, '#ea580c'],
  [92, 55, 18, 22, -9, '#d97706'],
];

export function mount({ layer }: SeasonContext): SeasonCleanup {
  for (const [left, restTop, size, duration, delay, color] of LEAVES) {
    const leaf = document.createElement('span');
    leaf.className = 'autumn-leaf';
    leaf.style.setProperty('--left', `${left}%`);
    leaf.style.setProperty('--rest-top', `${restTop}%`);
    leaf.style.setProperty('--size', `${size}px`);
    leaf.style.setProperty('--duration', `${duration}s`);
    leaf.style.setProperty('--delay', `${delay}s`);
    leaf.style.color = color;

    const sway = document.createElement('span');
    sway.className = 'autumn-leaf__sway';
    sway.innerHTML = leafSvg;
    leaf.append(sway);
    layer.append(leaf);
  }

  return () => {};
}
