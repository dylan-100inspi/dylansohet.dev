import type { SeasonContext, SeasonCleanup } from './load';

export { default as styles } from './starwars.css?inline';

interface Star {
  x: number;
  y: number;
  z: number;
}

const DEPTH = 1000;
const FOCAL = 260;
const STAR_DENSITY = 1 / 6500;
const MAX_STARS = 220;
// Jump timeline (ms): slow acceleration, short peak, then ease out to a still star field.
const RAMP_UP = 2400;
const PEAK = 600;
const RAMP_DOWN = 1400;
const MAX_SPEED = 1800;

const SABER_SVG =
  '<svg viewBox="0 0 100 100" aria-hidden="true">' +
  '<circle class="saber-ring__glow" cx="50" cy="50" r="48.5" pathLength="100"/>' +
  '<circle class="saber-ring__core" cx="50" cy="50" r="48.5" pathLength="100"/>' +
  '</svg>';

function easeInCubic(t: number): number {
  return t * t * t;
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function speedAt(elapsed: number): number {
  if (elapsed < RAMP_UP) return MAX_SPEED * easeInCubic(elapsed / RAMP_UP);
  if (elapsed < RAMP_UP + PEAK) return MAX_SPEED;
  const decel = (elapsed - RAMP_UP - PEAK) / RAMP_DOWN;
  return decel >= 1 ? 0 : MAX_SPEED * (1 - easeOutCubic(decel));
}

function mountHyperspace(layer: HTMLElement, reducedMotion: boolean): SeasonCleanup {
  const canvas = document.createElement('canvas');
  canvas.className = 'starwars-hyperspace';
  layer.append(canvas);
  const context = canvas.getContext('2d');
  if (!context) return () => {};

  let width = 0;
  let height = 0;
  let stars: Star[] = [];
  let frame = 0;
  let finished = reducedMotion;
  let start = 0;
  let previous = 0;

  const spawn = (z = Math.random() * DEPTH): Star => ({
    x: (Math.random() - 0.5) * width * 3,
    y: (Math.random() - 0.5) * height * 3,
    z: Math.max(z, 40),
  });

  const color = () =>
    document.documentElement.classList.contains('dark') ? '226 232 240' : '100 116 139';

  function resize(): void {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = layer.clientWidth;
    height = layer.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context?.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(Math.round(width * height * STAR_DENSITY), MAX_STARS);
    if (stars.length !== count) stars = Array.from({ length: count }, () => spawn());
  }

  function draw(speed: number): void {
    if (!context) return;
    const centerX = width / 2;
    const centerY = height / 2;
    const rgb = color();
    context.clearRect(0, 0, width, height);
    context.lineCap = 'round';

    for (const star of stars) {
      const scale = FOCAL / star.z;
      const headX = centerX + star.x * scale;
      const headY = centerY + star.y * scale;
      const nearness = 1 - star.z / DEPTH;
      const alpha = 0.25 + nearness * 0.65;

      // Tail sits further back in depth, so its length grows with speed.
      const tailScale = FOCAL / (star.z + speed * 0.09);
      const tailX = centerX + star.x * tailScale;
      const tailY = centerY + star.y * tailScale;

      context.strokeStyle = `rgb(${rgb} / ${alpha})`;
      context.lineWidth = 0.6 + nearness * 1.6;
      context.beginPath();
      context.moveTo(tailX, tailY);
      context.lineTo(headX + 0.01, headY);
      context.stroke();
    }
  }

  function tick(now: number): void {
    if (!start) {
      start = now;
      previous = now;
    }
    const elapsed = now - start;
    const delta = Math.min(now - previous, 50) / 1000;
    previous = now;
    const speed = speedAt(elapsed);

    for (const star of stars) {
      star.z -= speed * delta;
      const scale = FOCAL / star.z;
      const offscreen =
        Math.abs(star.x * scale) > width / 2 + 40 || Math.abs(star.y * scale) > height / 2 + 40;
      if (star.z < 40 || offscreen) Object.assign(star, spawn(DEPTH));
    }
    draw(speed);

    if (elapsed >= RAMP_UP + PEAK + RAMP_DOWN) {
      finished = true;
      return;
    }
    frame = requestAnimationFrame(tick);
  }

  resize();
  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (finished) draw(0);
  });
  resizeObserver.observe(layer);

  const themeObserver = new MutationObserver(() => {
    if (finished) draw(0);
  });
  themeObserver.observe(document.documentElement, { attributeFilter: ['class'] });

  if (finished) draw(0);
  else frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    themeObserver.disconnect();
  };
}

function mountSaberRing(photo: HTMLElement | null): SeasonCleanup {
  if (!photo) return () => {};
  const ring = document.createElement('span');
  ring.className = 'saber-ring';
  ring.setAttribute('aria-hidden', 'true');
  ring.dataset.seasonDeco = '';
  ring.innerHTML = SABER_SVG;
  photo.append(ring);
  return () => ring.remove();
}

export function mount({ layer, photo, reducedMotion }: SeasonContext): SeasonCleanup {
  const stopHyperspace = mountHyperspace(layer, reducedMotion);
  const removeRing = mountSaberRing(photo);
  return () => {
    stopHyperspace();
    removeRing();
  };
}
