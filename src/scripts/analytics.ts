// Umami events (production domain only):
//   pageview        — automatic, from the Umami script itself
//   section-dwell   — seconds a section held attention (this file, ≥2s only)
//   404-view        — a load of the Loki 404 page (this file)
//   easter-egg-view — the Konami/tap egg was opened (scripts/konami.ts)
const MIN_DWELL_SECONDS = 2;

if (document.querySelector('script[data-website-id]')) {
  const locale = document.documentElement.lang;

  if (document.querySelector('[data-analytics-404]')) {
    window.umami?.track('404-view', { locale });
  }

  const sectionEls = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));

  if (sectionEls.length > 0) {
    const dwellSeconds = new Map<string, number>();
    const ratios = new Map<string, number>();
    let activeId: string | null = null;
    let activeSince = 0;

    const accrue = (now: number) => {
      if (activeId !== null) {
        const elapsed = (now - activeSince) / 1000;
        dwellSeconds.set(activeId, (dwellSeconds.get(activeId) ?? 0) + elapsed);
      }
    };

    // Only the most-visible section accrues time; switching banks the previous one's total.
    const pickActive = (now: number) => {
      let bestId: string | null = null;
      let bestRatio = 0;
      for (const [id, ratio] of ratios) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      }
      if (bestId !== activeId) {
        accrue(now);
        activeId = bestId;
        activeSince = now;
      }
    };

    const dwellObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        pickActive(performance.now());
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    sectionEls.forEach((el) => dwellObserver.observe(el));

    let flushed = false;
    const flush = () => {
      if (flushed) return;
      flushed = true;
      accrue(performance.now());
      for (const [id, seconds] of dwellSeconds) {
        if (seconds >= MIN_DWELL_SECONDS) {
          window.umami?.track('section-dwell', {
            section: id,
            seconds: Math.round(seconds),
            locale,
          });
        }
      }
    };

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush();
    });
    window.addEventListener('pagehide', flush);
  }
}
