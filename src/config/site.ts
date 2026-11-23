const githubUsername = 'dylan-100inspi';
const linkedinUsername = 'dylan-sohet';

export const author = {
  fullName: 'Dylan Sohet',
  email: 'dylan.sohet@gmail.com',
  githubUsername,
  linkedinUsername,
  github: `https://github.com/${githubUsername}`,
  linkedin: `https://www.linkedin.com/in/${linkedinUsername}`,
} as const;

// LinkedIn profile link with the visitor's site language pre-selected.
// Keep the bare `author.linkedin` for canonical/structured-data (JSON-LD sameAs).
export const linkedinFor = (locale: 'en' | 'fr'): string =>
  `${author.linkedin}/?locale=${locale === 'fr' ? 'fr-FR' : 'en-US'}`;

export const site = {
  domain: 'dylansohet.dev',
  url: 'https://dylansohet.dev',
  repo: `${author.github}/dylansohet.dev`,
} as const;
