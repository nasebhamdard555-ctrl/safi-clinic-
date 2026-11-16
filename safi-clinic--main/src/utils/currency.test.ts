import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  USD_TO_AFN_RATE,
  normalizeCurrency,
  convertFromUsd,
  formatPrice,
  formatShortAxisPrice,
} from './currency';

test('normalizeCurrency resolves USD and AFN/AFG aliases safely', () => {
  assert.equal(normalizeCurrency('USD'), 'USD');
  assert.equal(normalizeCurrency('usd'), 'USD');
  assert.equal(normalizeCurrency('$'), 'USD');
  assert.equal(normalizeCurrency('AFN'), 'AFN');
  assert.equal(normalizeCurrency('afg'), 'AFN');
  assert.equal(normalizeCurrency('AFG'), 'AFN');
  assert.equal(normalizeCurrency('afghani'), 'AFN');
  assert.equal(normalizeCurrency('؋'), 'AFN');
  assert.equal(normalizeCurrency(''), DEFAULT_CURRENCY);
  assert.equal(normalizeCurrency(null), DEFAULT_CURRENCY);
  assert.equal(normalizeCurrency('EUR'), DEFAULT_CURRENCY);
});

test('CURRENCIES exposes USD and AFG labels', () => {
  assert.deepEqual(
    CURRENCIES.map((c) => ({ code: c.code, shortLabel: c.shortLabel })),
    [
      { code: 'USD', shortLabel: 'USD' },
      { code: 'AFN', shortLabel: 'AFG' },
    ]
  );
});

test('convertFromUsd converts USD to AFN accurately at clinic rate', () => {
  assert.equal(convertFromUsd(42, 'USD'), 42);
  assert.equal(convertFromUsd(7.99, 'USD'), 7.99);
  assert.equal(convertFromUsd(42, 'AFN'), 42 * USD_TO_AFN_RATE);
  assert.equal(convertFromUsd(60, 'AFN'), 60 * USD_TO_AFN_RATE);
  assert.equal(convertFromUsd(7.99, 'AFN'), Math.round(7.99 * USD_TO_AFN_RATE));
  assert.equal(convertFromUsd(Number.NaN, 'AFN'), 0);
});

test('formatPrice formats USD and AFG amounts cleanly', () => {
  assert.equal(formatPrice(42, 'USD'), '$42.00');
  assert.equal(formatPrice(125, 'USD', { compactDecimals: true }), '$125');
  assert.equal(
    formatPrice(125, 'USD', { compactDecimals: true, includeCode: true }),
    '$125 USD'
  );
  assert.equal(formatPrice(42, 'AFN'), '2,940 AFG');
  assert.equal(formatPrice(125, 'AFN', { compactDecimals: true }), '8,750 AFG');
  assert.equal(formatPrice(-10, 'AFN'), '-700 AFG');
  assert.equal(formatPrice(-4.2, 'USD'), '-$4.20');
});

test('formatShortAxisPrice formats chart Y-axis ticks for USD and AFG', () => {
  assert.equal(formatShortAxisPrice(100, 'USD'), '$100');
  assert.equal(formatShortAxisPrice(100, 'AFN'), '7k AFG');
  assert.equal(formatShortAxisPrice(10, 'AFN'), '700 AFG');
});
