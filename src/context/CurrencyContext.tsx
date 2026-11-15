import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  CurrencyCode,
  CURRENCY_STORAGE_KEY,
  USD_TO_AFN_RATE,
  normalizeCurrency,
  convertFromUsd,
  formatPrice as formatPriceHelper,
  FormatPriceOptions,
} from '../utils/currency';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (next: CurrencyCode) => void;
  toggleCurrency: () => void;
  rateToAfn: number;
  convertAmount: (usdAmount: number) => number;
  formatPrice: (usdAmount: number, options?: FormatPriceOptions) => string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
      return normalizeCurrency(saved);
    } catch {
      return 'USD';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
    } catch {
      // Ignore storage failures
    }
  }, [currency]);

  const setCurrency = (next: CurrencyCode) => {
    setCurrencyState(normalizeCurrency(next));
  };

  const toggleCurrency = () => {
    setCurrencyState((prev) => (prev === 'USD' ? 'AFN' : 'USD'));
  };

  const value = useMemo<CurrencyContextType>(
    () => ({
      currency,
      setCurrency,
      toggleCurrency,
      rateToAfn: USD_TO_AFN_RATE,
      convertAmount: (usdAmount: number) => convertFromUsd(usdAmount, currency),
      formatPrice: (usdAmount: number, options?: FormatPriceOptions) =>
        formatPriceHelper(usdAmount, currency, options),
    }),
    [currency]
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    return {
      currency: 'USD',
      setCurrency: () => {},
      toggleCurrency: () => {},
      rateToAfn: USD_TO_AFN_RATE,
      convertAmount: (usdAmount: number) => convertFromUsd(usdAmount, 'USD'),
      formatPrice: (usdAmount: number, options?: FormatPriceOptions) =>
        formatPriceHelper(usdAmount, 'USD', options),
    };
  }
  return ctx;
};
