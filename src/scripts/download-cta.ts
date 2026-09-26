// Download CTA: replay the arrow animation once per click.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll<HTMLElement>('.download-cta').forEach((btn) => {
  const icon = btn.querySelector<HTMLElement>('.download-cta-icon');
  if (!icon) return;

  btn.addEventListener('click', () => {
    if (reduceMotion.matches) return;
    btn.classList.add('is-downloading');
  });

  icon.addEventListener('animationend', () => {
    btn.classList.remove('is-downloading');
  });
});
