import type { TranslationKey } from '../i18n/translations';

export interface SectionLink {
  readonly id: string;
  readonly labelKey: TranslationKey;
  /** Present when the section is also a header menu link; absent = rail-only. */
  readonly header?: { readonly showClass: string };
}

// Single source of truth for on-page sections, shared by the header menu and the side dot rail.
export const sections: readonly SectionLink[] = [
  { id: 'home', labelKey: 'nav.home' },
  { id: 'about', labelKey: 'nav.about', header: { showClass: 'md:inline' } },
  { id: 'now', labelKey: 'nav.now', header: { showClass: 'md:inline' } },
  { id: 'skills', labelKey: 'nav.skills', header: { showClass: 'md:inline' } },
  { id: 'projects', labelKey: 'nav.projects', header: { showClass: 'lg:inline' } },
  { id: 'formations', labelKey: 'nav.formations', header: { showClass: 'lg:inline' } },
  { id: 'recommendations', labelKey: 'nav.recommendations', header: { showClass: 'lg:inline' } },
  { id: 'contact', labelKey: 'nav.contact', header: { showClass: 'md:inline' } },
];
