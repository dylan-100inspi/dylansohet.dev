import en from './en.json';
import fr from './fr.json';

type Locale = 'en' | 'fr';

type TranslationSet = typeof en;

const translations: Record<Locale, TranslationSet> = { en, fr };

type DotPath<T, Prefix extends string = ''> =
  T extends Record<string, unknown>
    ? {
        [K in keyof T & string]: DotPath<T[K], Prefix extends '' ? K : `${Prefix}.${K}`>;
      }[keyof T & string]
    : Prefix;

type TranslationKey = DotPath<TranslationSet>;

function resolve(locale: Locale, key: TranslationKey): string {
  const keys = key.split('.');
  let result: unknown = translations[locale];
  for (const k of keys) {
    if (typeof result !== 'object' || result === null || !(k in result)) {
      return key;
    }
    result = (result as Record<string, unknown>)[k];
  }
  return typeof result === 'string' ? result : key;
}

export function useTranslations(locale: Locale) {
  return (key: TranslationKey) => resolve(locale, key);
}

export function getLocaleFromUrl(url: URL): Locale {
  const segment = url.pathname.split('/')[1] ?? '';
  return isLocale(segment) ? segment : 'en';
}

export function isLocale(value: string): value is Locale {
  return value === 'en' || value === 'fr';
}

export type { Locale, TranslationKey };
