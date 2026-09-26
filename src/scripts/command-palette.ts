// Command palette controller. Drives the single `dialog[data-command-palette]`
// with keyboard, filtering, and action handlers.
function initCommandPalette(dialog: HTMLDialogElement) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const input = dialog.querySelector<HTMLInputElement>('.cmdk-input');
  const live = dialog.querySelector<HTMLElement>('[data-cmdk-live]');
  const resultsOne = live?.dataset.resultsOne ?? '1 result';
  const resultsManyTemplate = live?.dataset.resultsMany ?? '{count} results';
  let lastAnnouncement = '';

  const items = () => Array.from(dialog.querySelectorAll<HTMLElement>('[data-cmdk-item]'));
  const visibleItems = () => items().filter((item) => !item.classList.contains('hidden'));

  function syncThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    document
      .querySelectorAll<HTMLElement>('.cmdk-theme-sun')
      .forEach((el) => el.classList.toggle('hidden', isDark));
    document
      .querySelectorAll<HTMLElement>('.cmdk-theme-moon')
      .forEach((el) => el.classList.toggle('hidden', !isDark));
  }

  function setActive(target: HTMLElement | null) {
    items().forEach((item) => {
      item.classList.remove('is-active');
      item.setAttribute('aria-selected', 'false');
    });
    if (target) {
      target.classList.add('is-active');
      target.setAttribute('aria-selected', 'true');
      target.scrollIntoView({ block: 'nearest' });
      input?.setAttribute('aria-activedescendant', target.id);
    } else {
      input?.removeAttribute('aria-activedescendant');
    }
  }

  function filter(rawQuery: string) {
    const query = rawQuery.trim().toLowerCase();
    let anyVisible = false;

    items().forEach((item) => {
      const label = item.querySelector('.cmdk-item-label')?.textContent?.toLowerCase() ?? '';
      const keywords = (item.dataset.keywords ?? '').toLowerCase();
      const match = query === '' || label.includes(query) || keywords.includes(query);
      item.classList.toggle('hidden', !match);
      if (match) anyVisible = true;
    });

    // Hide a group header when none of its items are visible.
    let header: HTMLElement | null = null;
    let headerHasVisible = false;
    const flush = () => header?.classList.toggle('hidden', !headerHasVisible);
    Array.from(dialog.querySelectorAll<HTMLElement>('.cmdk-list > *')).forEach((el) => {
      if (el.hasAttribute('data-cmdk-group')) {
        flush();
        header = el;
        headerHasVisible = false;
      } else if (el.hasAttribute('data-cmdk-item') && !el.classList.contains('hidden')) {
        headerHasVisible = true;
      }
    });
    flush();

    dialog.querySelector('.cmdk-empty')?.classList.toggle('hidden', anyVisible);
    const visible = visibleItems();
    setActive(visible[0] ?? null);

    if (live) {
      const message =
        visible.length === 1
          ? resultsOne
          : resultsManyTemplate.replace('{count}', String(visible.length));
      if (message !== lastAnnouncement) {
        live.textContent = message;
        lastAnnouncement = message;
      }
    }
  }

  function openPalette() {
    if (dialog.open) return;
    if (input) input.value = '';
    syncThemeIcons();
    dialog.showModal();
    filter('');
    input?.focus();
  }

  function closePalette() {
    if (reduceMotion.matches) {
      dialog.close();
      return;
    }
    dialog.classList.add('is-closing');
    const panel = dialog.querySelector<HTMLElement>('.cmdk-panel');
    const finish = () => {
      dialog.close();
      dialog.classList.remove('is-closing');
    };
    panel?.addEventListener('transitionend', finish, { once: true });
    window.setTimeout(finish, 220);
  }

  function runAction(item: HTMLElement) {
    switch (item.dataset.action) {
      case 'navigate': {
        const id = item.id.replace('cmdk-', '');
        closePalette();
        window.location.hash = id;
        break;
      }
      case 'download': {
        const href = item.dataset.href;
        if (!href) break;
        const link = document.createElement('a');
        link.href = href;
        link.download = '';
        document.body.appendChild(link);
        link.click();
        link.remove();
        closePalette();
        break;
      }
      case 'theme': {
        document.getElementById('theme-toggle')?.click();
        syncThemeIcons();
        break;
      }
      case 'lang': {
        const target = item.dataset.targetLocale ?? 'en';
        localStorage.setItem('preferredLocale', target);
        window.location.href = `/${target}/${window.location.hash || ''}`;
        break;
      }
      case 'copy': {
        const text = item.dataset.copy;
        if (!text) break;
        navigator.clipboard
          .writeText(text)
          .then(() => {
            const idle = item.querySelector('.cmdk-copy-idle');
            const done = item.querySelector('.cmdk-copy-done');
            const label = item.querySelector<HTMLElement>('.cmdk-item-label');
            const original = label?.textContent ?? '';
            const copied = label?.dataset.copiedLabel;
            idle?.classList.add('hidden');
            done?.classList.remove('hidden');
            if (label && copied) label.textContent = copied;
            window.setTimeout(() => {
              idle?.classList.remove('hidden');
              done?.classList.add('hidden');
              if (label) label.textContent = original;
            }, 1500);
          })
          .catch(() => {});
        break;
      }
      case 'external': {
        const href = item.dataset.href;
        if (!href) break;
        window.open(href, '_blank', 'noopener,noreferrer');
        closePalette();
        break;
      }
    }
  }

  input?.addEventListener('input', () => filter(input.value));

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closePalette();
  });

  // Clicking the backdrop targets the dialog element itself.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closePalette();
  });

  dialog.addEventListener('keydown', (event) => {
    const visible = visibleItems();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (visible.length === 0) return;
      const index = visible.findIndex((item) => item.classList.contains('is-active'));
      setActive(visible[(index + 1) % visible.length] ?? null);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (visible.length === 0) return;
      const index = visible.findIndex((item) => item.classList.contains('is-active'));
      setActive(visible[(index - 1 + visible.length) % visible.length] ?? null);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActive(visible[0] ?? null);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActive(visible[visible.length - 1] ?? null);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const active = visible.find((item) => item.classList.contains('is-active')) ?? visible[0];
      if (active) runAction(active);
    }
  });

  items().forEach((item) => {
    item.addEventListener('click', () => runAction(item));
    item.addEventListener('mousemove', () => {
      if (!item.classList.contains('is-active')) setActive(item);
    });
  });

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (dialog.open) closePalette();
      else openPalette();
    }
  });

  document
    .querySelectorAll<HTMLElement>('[data-command-launcher]')
    .forEach((btn) => btn.addEventListener('click', () => openPalette()));

  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
    navigator.platform;
  const isApple = /mac|ipad/i.test(platform);
  if (!isApple) {
    document
      .querySelectorAll<HTMLElement>('[data-command-kbd]')
      .forEach((el) => (el.textContent = 'Ctrl K'));
  }
}

const paletteDialog = document.querySelector<HTMLDialogElement>('dialog[data-command-palette]');
if (paletteDialog) initCommandPalette(paletteDialog);
