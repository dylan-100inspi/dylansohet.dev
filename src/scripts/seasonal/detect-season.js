// Inlined in <head> by BaseLayout so data-season is set before first paint.
// Plain JS (imported with ?raw, not compiled); any edit changes its CSP hash in astro.config.mjs.
(function () {
  const root = document.documentElement;

  // Evaluated in the visitor's local time on every load, never at build time.
  const now = new Date();
  const monthDay = (now.getMonth() + 1) * 100 + now.getDate();
  const isProduction = /^(www\.)?dylansohet\.dev$/.test(location.hostname);
  const forced = isProduction ? null : new URLSearchParams(location.search).get('season');
  const season = ['autumn', 'halloween', 'holidays', 'starwars'].includes(forced)
    ? forced
    : monthDay >= 922 && monthDay <= 1024
      ? 'autumn'
      : monthDay >= 1025 && monthDay <= 1101
        ? 'halloween'
        : monthDay >= 1201 || monthDay <= 106
          ? 'holidays'
          : monthDay === 504
            ? 'starwars'
            : null;

  const storedOptOut = localStorage.getItem('seasonalTheme');
  if (!season) {
    if (storedOptOut) localStorage.removeItem('seasonalTheme');
    return;
  }

  // January belongs to the holiday season that started the previous December.
  const seasonId = season + '-' + (now.getFullYear() - (now.getMonth() === 0 ? 1 : 0));
  root.dataset.season = season;
  root.dataset.seasonId = seasonId;
  if (storedOptOut === seasonId) {
    root.dataset.seasonOff = '';
  } else if (storedOptOut) {
    localStorage.removeItem('seasonalTheme');
  }
})();
