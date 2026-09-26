// Konami-code easter egg: reveal the hidden "Crystal Key" 3D overlay.
// Desktop trigger: ↑ ↑ ↓ ↓ ← → ← → b a. Mobile trigger: 7 taps on the profile image.
const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
] as const;

const TAP_THRESHOLD = 7;
const TAP_WINDOW_MS = 3000;

// Loads the model-viewer web component once, on first trigger only.
let modelViewerModule: Promise<unknown> | null = null;
function loadModelViewer() {
  modelViewerModule ??= import('@google/model-viewer');
  return modelViewerModule;
}

function initEasterEgg(dialog: HTMLDialogElement) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const model = dialog.querySelector<HTMLElement>('[data-easter-egg-model]');
  const modelSrc = model?.dataset.src ?? '/models/crystal-key.glb';

  function open() {
    if (dialog.open || !model) return;
    document.documentElement.classList.add('egg-open');
    if (!reduceMotion.matches) model.setAttribute('auto-rotate', '');
    model.setAttribute('src', modelSrc);
    dialog.showModal();
    window.umami?.track('easter-egg-view', { locale: document.documentElement.lang });
    dialog.focus();
    window.setTimeout(() => window.addEventListener('keydown', onCloseKey), 0);
    void loadModelViewer();
  }

  function close() {
    if (dialog.open) dialog.close();
  }

  model?.addEventListener('load', () => model.classList.add('is-revealed'));

  function onCloseKey(event: KeyboardEvent) {
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(event.key)) return;
    close();
  }

  // Release the model (stop WebGL, free memory) and restore state on close.
  dialog.addEventListener('close', () => {
    model?.removeAttribute('src');
    model?.removeAttribute('auto-rotate');
    model?.classList.remove('is-revealed');
    document.documentElement.classList.remove('egg-open');
    window.removeEventListener('keydown', onCloseKey);
  });

  dialog.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element) || !target.closest('[data-easter-egg-model]')) close();
  });

  dialog.querySelector('[data-easter-egg-close]')?.addEventListener('click', close);

  let index = 0;
  document.addEventListener('keydown', (event) => {
    const active = document.activeElement;
    const isTyping =
      active instanceof HTMLElement &&
      (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
    const paletteOpen = Boolean(
      document.querySelector('dialog[data-command-palette]')?.hasAttribute('open'),
    );
    if (isTyping || paletteOpen || dialog.open) {
      index = 0;
      return;
    }

    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (key === KONAMI[index]) {
      index += 1;
      if (index === KONAMI.length) {
        index = 0;
        open();
      }
    } else {
      index = key === KONAMI[0] ? 1 : 0;
    }
  });

  // Touch-only affordances (mobile/tablet): the tap trigger and the visible close button.
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) dialog.classList.add('egg-touch');

  const trigger = document.querySelector<HTMLElement>('[data-easter-egg-trigger]');
  if (trigger && isTouch) {
    let taps = 0;
    let timer = 0;
    trigger.addEventListener('click', () => {
      taps += 1;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        taps = 0;
      }, TAP_WINDOW_MS);
      if (taps >= TAP_THRESHOLD) {
        taps = 0;
        open();
      }
    });
  }
}

const eggDialog = document.querySelector<HTMLDialogElement>('dialog[data-easter-egg]');
if (eggDialog) initEasterEgg(eggDialog);
