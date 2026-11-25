import { BRAND } from '../config/brand';

export const money = (n: unknown) => `${BRAND.currency} ${Number(n ?? 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

export const dateOnly = (s: unknown) => (s ? String(s).slice(0, 10) : '—');

export const dateTime = (s: unknown) => {
  if (!s) return '—';
  const d = new Date(String(s));
  return Number.isNaN(d.getTime()) ? String(s) : d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
};

export const today = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

export const nowLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};
