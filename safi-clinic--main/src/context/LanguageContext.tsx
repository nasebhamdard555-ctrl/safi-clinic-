import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  LanguageCode,
  LANGUAGE_STORAGE_KEY,
  normalizeLanguage,
  isRtlLanguage,
  getDirection,
  getHtmlLang,
} from '../utils/i18n';
import { TRANSLATIONS, LocalizedDictionary } from '../data/translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isRtl: boolean;
  dir: 'ltr' | 'rtl';
  t: LocalizedDictionary;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      return normalizeLanguage(saved);
    } catch {
      return 'en';
    }
  });

  const dir = getDirection(language);
  const isRtl = isRtlLanguage(language);

  useEffect(() => {
    const htmlEl = document.documentElement;
    htmlEl.dir = dir;
    htmlEl.lang = getHtmlLang(language);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Ignore storage failures
    }
  }, [language, dir]);

  const setLanguage = (nextLang: LanguageCode) => {
    const normalized = normalizeLanguage(nextLang);
    setLanguageState(normalized);
  };

  const value = useMemo<LanguageContextType>(
    () => ({
      language,
      setLanguage,
      isRtl,
      dir,
      t: TRANSLATIONS[language],
    }),
    [language, isRtl, dir]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      language: 'en',
      setLanguage: () => {},
      isRtl: false,
      dir: 'ltr',
      t: TRANSLATIONS.en,
    };
  }
  return ctx;
};
