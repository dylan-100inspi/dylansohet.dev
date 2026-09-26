export const author = {
  fullName: 'Dylan Sohet',
  email: 'dylan.sohet@gmail.com',
  github: 'https://github.com/dylan-100inspi',
  linkedin: 'https://www.linkedin.com/in/dylan-sohet',
} as const;

export const linkedinFor = (locale: 'en' | 'fr'): string =>
  `${author.linkedin}/?locale=${locale === 'fr' ? 'fr-FR' : 'en-US'}`;

export const site = {
  domain: 'dylansohet.dev',
  url: 'https://dylansohet.dev',
  repo: 'https://github.com/dylan-100inspi/dylansohet.dev',
} as const;
