export type LanguageCode = 'en' | 'ps' | 'fa';

export interface LanguageMeta {
  code: LanguageCode;
  shortLabel: string;
  nativeName: string;
  englishName: string;
  dir: 'ltr' | 'rtl';
  htmlLang: string;
}

export const DEFAULT_LANGUAGE: LanguageCode = 'en';
export const LANGUAGE_STORAGE_KEY = 'safi_language';

export const LANGUAGES: LanguageMeta[] = [
  {
    code: 'en',
    shortLabel: 'EN',
    nativeName: 'English',
    englishName: 'English',
    dir: 'ltr',
    htmlLang: 'en',
  },
  {
    code: 'ps',
    shortLabel: 'پښتو',
    nativeName: 'پښتو',
    englishName: 'Pashto',
    dir: 'rtl',
    htmlLang: 'ps',
  },
  {
    code: 'fa',
    shortLabel: 'دری',
    nativeName: 'دری',
    englishName: 'Dari',
    dir: 'rtl',
    htmlLang: 'fa-AF',
  },
];

export function normalizeLanguage(raw: string | null | undefined): LanguageCode {
  if (!raw) return DEFAULT_LANGUAGE;
  const clean = raw.trim().toLowerCase();
  if (clean === 'ps' || clean === 'pus' || clean === 'ps-af' || clean === 'pashto') {
    return 'ps';
  }
  if (
    clean === 'fa' ||
    clean === 'fa-af' ||
    clean === 'prs' ||
    clean === 'dari' ||
    clean === 'persian'
  ) {
    return 'fa';
  }
  if (clean === 'en' || clean.startsWith('en-')) {
    return 'en';
  }
  return DEFAULT_LANGUAGE;
}

export function isRtlLanguage(lang: LanguageCode): boolean {
  return lang === 'ps' || lang === 'fa';
}

export function getDirection(lang: LanguageCode): 'ltr' | 'rtl' {
  return isRtlLanguage(lang) ? 'rtl' : 'ltr';
}

export function getHtmlLang(lang: LanguageCode): string {
  const found = LANGUAGES.find((l) => l.code === lang);
  return found ? found.htmlLang : 'en';
}

export function pickLocalized<T>(
  lang: LanguageCode,
  variants: { en: T; ps?: T; fa?: T }
): T {
  if (lang === 'ps' && variants.ps !== undefined) return variants.ps;
  if (lang === 'fa' && variants.fa !== undefined) return variants.fa;
  return variants.en;
}
