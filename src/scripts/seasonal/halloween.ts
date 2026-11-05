import type { SeasonContext, SeasonCleanup } from './load';
import ghostSvg from './assets/ghost.svg?raw';
import pumpkinSvg from './assets/pumpkin.svg?raw';

export { default as styles } from './halloween.css?inline';

export function mount({ photo }: SeasonContext): SeasonCleanup {
  const pumpkin = document.createElement('span');
  pumpkin.className = 'halloween-pumpkin';
  pumpkin.innerHTML = pumpkinSvg;

  // Sits behind the photo and peeks out from its top-right edge.
  const ghost = document.createElement('span');
  ghost.className = 'halloween-ghost';
  ghost.innerHTML = `<span class="halloween-ghost__float">${ghostSvg}</span>`;

  const decorations = [pumpkin, ghost];
  for (const decoration of decorations) {
    decoration.setAttribute('aria-hidden', 'true');
    decoration.dataset.seasonDeco = '';
    photo?.append(decoration);
  }

  return () => {
    for (const decoration of decorations) decoration.remove();
  };
}
