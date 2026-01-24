/**
 * Language Provider
 * 
 * Context provider for managing the current language/locale.
 */

'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Locale, defaultLocale, getTranslations, type Translations, locales } from '@/lib/i18n';

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCALE_STORAGE_KEY = 'galodev-locale';

type LanguageProviderProps = {
  children: ReactNode;
  initialLocale?: Locale;
};

/**
 * Provider component for language/locale management.
 */
export function LanguageProvider({ children, initialLocale }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || defaultLocale);
  const [t, setT] = useState<Translations>(getTranslations(locale));

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
    if (savedLocale && locales.includes(savedLocale)) {
      setLocaleState(savedLocale);
      setT(getTranslations(savedLocale));
    } else {
      const browserLang = navigator.language?.toLowerCase() || '';
      if (browserLang.startsWith('en')) {
        setLocaleState('en');
        setT(getTranslations('en'));
      } else {
        setLocaleState('es');
        setT(getTranslations('es'));
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    setLocaleState(newLocale);
    setT(getTranslations(newLocale));
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to access language context.
 */
export function useLanguage() {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
}

/**
 * Hook to get translations only.
 */
export function useTranslations() {
  const { t } = useLanguage();
  return t;
}
