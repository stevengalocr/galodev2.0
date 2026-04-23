/**
 * Internationalization (i18n) System
 *
 * Simple and lightweight i18n system for Spanish/English support.
 */

import es from './locales/es.json';
import en from './locales/en.json';

export type Locale = 'es' | 'en';

export const locales: Locale[] = ['es', 'en'];
export const defaultLocale: Locale = 'es';

const translations = { es, en } as const;

export type Translations = typeof es;

/**
 * Get translations for a specific locale.
 */
export function getTranslations(locale: Locale = defaultLocale): Translations {
  return translations[locale] || translations[defaultLocale];
}

/**
 * Get a nested translation value by key path.
 * Example: t('nav.home', 'es') -> 'Inicio'
 */
export function t(key: string, locale: Locale = defaultLocale): string {
  const keys = key.split('.');
  let value: unknown = translations[locale] || translations[defaultLocale];

  for (const k of keys) {
    if (typeof value === 'object' && value !== null && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key; // Return key if translation not found
    }
  }

  return typeof value === 'string' ? value : key;
}

/**
 * Locale display names.
 */
export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

/**
 * Get the opposite locale (for language switcher).
 */
export function getAlternateLocale(current: Locale): Locale {
  return current === 'es' ? 'en' : 'es';
}
