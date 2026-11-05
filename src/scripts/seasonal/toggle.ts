import { isSeason, mountSeason, unmountSeason, type Season } from './load';

interface SeasonLabels extends Record<Season, string> {
  on: string;
  off: string;
  status: string;
}

const STORAGE_KEY = 'seasonalTheme';

const root = document.documentElement;
const season = root.dataset.season;

function isEnabled(): boolean {
  return !root.hasAttribute('data-season-off');
}

function whenIdle(callback: () => void): void {
  const schedule = () => {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(callback, { timeout: 2000 });
    } else {
      setTimeout(callback, 200);
    }
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
}

function dismissHint(): void {
  root.classList.add('season-hint-dismissed');
}

function init(activeSeason: Season): void {
  const buttons = Array.from(
    document.querySelectorAll<HTMLButtonElement>('[data-season-button]'),
    (button) => ({ button, labels: JSON.parse(button.dataset.labels ?? '{}') as SeasonLabels }),
  );

  function sync(): void {
    const enabled = isEnabled();
    for (const { button, labels } of buttons) {
      const name = labels[activeSeason];
      const state = enabled ? labels.on : labels.off;
      button.setAttribute('aria-pressed', String(enabled));

      if (button.dataset.seasonButton === 'desktop') {
        button.setAttribute('aria-label', name);
        const tooltip = button.parentElement?.querySelector('[data-season-tooltip]');
        if (tooltip)
          tooltip.textContent = labels.status.replace('{name}', name).replace('{state}', state);
        continue;
      }

      const nameElement = button.querySelector('[data-season-name]');
      const stateElement = button.querySelector('[data-season-state]');
      if (nameElement) nameElement.textContent = name;
      if (stateElement) stateElement.textContent = state;
    }
  }

  function toggle(): void {
    dismissHint();
    const enable = !isEnabled();
    root.toggleAttribute('data-season-off', !enable);

    if (enable) {
      localStorage.removeItem(STORAGE_KEY);
      void mountSeason(activeSeason);
    } else {
      // Only written on an explicit click, and cleared once the season ends.
      localStorage.setItem(STORAGE_KEY, root.dataset.seasonId ?? '');
      unmountSeason();
    }
    sync();
  }

  for (const { button } of buttons) {
    button.addEventListener('click', toggle);
    button.addEventListener('pointerenter', dismissHint, { once: true });
    button.addEventListener('focus', dismissHint, { once: true });

    // WCAG 1.4.13: Escape hides the tooltip without moving focus or pointer.
    const wrapper = button.parentElement;
    if (button.dataset.seasonButton !== 'desktop' || !wrapper) continue;
    wrapper.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') wrapper.setAttribute('data-tooltip-dismissed', '');
    });
    const restoreTooltip = () => wrapper.removeAttribute('data-tooltip-dismissed');
    wrapper.addEventListener('pointerleave', restoreTooltip);
    wrapper.addEventListener('focusout', restoreTooltip);
  }

  document.getElementById('mobile-menu-toggle')?.addEventListener('click', dismissHint, {
    once: true,
  });

  sync();
  if (isEnabled()) {
    whenIdle(() => {
      if (isEnabled()) void mountSeason(activeSeason);
    });
  }
}

if (isSeason(season)) init(season);
