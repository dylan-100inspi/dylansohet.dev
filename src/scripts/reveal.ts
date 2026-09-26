// Section-entrance reveal: each `[data-reveal-stagger]` group reveals as a whole
// when its top hits the viewport, its children rippling in with a capped stagger.
// Armed by the `reveal-enabled` class so content stays visible with JS off / reduced motion.
const STAGGER_STEP = 80;
const STAGGER_MAX = 240;

const reveals = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));

if (reveals.length > 0) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    reveals.forEach((el) => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.querySelectorAll<HTMLElement>('.reveal').forEach((child) => {
            child.classList.add('is-visible');
          });
          if (entry.target instanceof HTMLElement && entry.target.classList.contains('reveal')) {
            entry.target.classList.add('is-visible');
          }
          obs.unobserve(entry.target);
        }
      },
      { threshold: 0, rootMargin: '0px 0px -15% 0px' },
    );

    const groups = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal-stagger]'));

    for (const group of groups) {
      group.querySelectorAll<HTMLElement>('.reveal').forEach((el, index) => {
        if (index > 0)
          el.style.transitionDelay = `${Math.min(index * STAGGER_STEP, STAGGER_MAX)}ms`;
      });
      observer.observe(group);
    }

    // Safety net: reveal any element outside a stagger group on its own.
    for (const el of reveals) {
      if (!el.closest('[data-reveal-stagger]')) observer.observe(el);
    }
  }
}
