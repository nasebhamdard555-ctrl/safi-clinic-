export type CurrencyCode = 'USD' | 'AFN';

export interface CurrencyMeta {
  code: CurrencyCode;
  shortLabel: string;
  symbol: string;
  rateFromUsd: number;
  englishName: string;
}

export const DEFAULT_CURRENCY: CurrencyCode = 'USD';
export const CURRENCY_STORAGE_KEY = 'safi_currency';
export const USD_TO_AFN_RATE = 70;

export const CURRENCIES: CurrencyMeta[] = [
  {
    code: 'USD',
    shortLabel: 'USD',
    symbol: '$',
    rateFromUsd: 1,
    englishName: 'US Dollar',
  },
  {
    code: 'AFN',
    shortLabel: 'AFG',
    symbol: 'AFG',
    rateFromUsd: USD_TO_AFN_RATE,
    englishName: 'Afghan Afghani',
  },
];

export function normalizeCurrency(raw: string | null | undefined): CurrencyCode {
  if (!raw) return DEFAULT_CURRENCY;
  const clean = raw.trim().toUpperCase();
  if (
    clean === 'AFN' ||
    clean === 'AFG' ||
    clean === 'AFGHANI' ||
    clean === 'AFGHANIS' ||
    clean === '؋'
  ) {
    return 'AFN';
  }
  if (clean === 'USD' || clean === '$') {
    return 'USD';
  }
  return DEFAULT_CURRENCY;
}

export function convertFromUsd(
  usdAmount: number,
  currency: CurrencyCode,
  rate: number = USD_TO_AFN_RATE
): number {
  const numeric = Number(usdAmount);
  const safe = Number.isFinite(numeric) ? numeric : 0;
  if (currency === 'AFN') {
    return Math.round(safe * rate);
  }
  return Math.round(safe * 100) / 100;
}

export interface FormatPriceOptions {
  compactDecimals?: boolean;
  includeCode?: boolean;
  rate?: number;
}

export function formatPrice(
  usdAmount: number,
  currency: CurrencyCode,
  options: FormatPriceOptions = {}
): string {
  const numeric = Number(usdAmount);
  const safe = Number.isFinite(numeric) ? numeric : 0;
  const isNegative = safe < 0;
  const absUsd = Math.abs(safe);

  if (currency === 'AFN') {
    const converted = convertFromUsd(absUsd, 'AFN', options.rate ?? USD_TO_AFN_RATE);
    const formatted = `${converted.toLocaleString('en-US')} AFG`;
    return isNegative ? `-${formatted}` : formatted;
  }

  const rounded = Math.round(absUsd * 100) / 100;
  const numberPart =
    options.compactDecimals && Number.isInteger(rounded)
      ? rounded.toLocaleString('en-US')
      : rounded.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  const base = `$${numberPart}${options.includeCode ? ' USD' : ''}`;
  return isNegative ? `-${base}` : base;
}

export function formatShortAxisPrice(
  usdAmount: number,
  currency: CurrencyCode,
  rate: number = USD_TO_AFN_RATE
): string {
  const converted = convertFromUsd(usdAmount, currency, rate);
  if (currency === 'AFN') {
    if (Math.abs(converted) >= 1000) {
      const k = Math.round((converted / 1000) * 10) / 10;
      return `${k}k AFG`;
    }
    return `${converted} AFG`;
  }
  return `$${converted}`;
}
