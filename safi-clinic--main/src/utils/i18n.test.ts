import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LANGUAGES,
  normalizeLanguage,
  isRtlLanguage,
  getDirection,
  getHtmlLang,
  pickLocalized,
} from './i18n.ts';
import { TRANSLATIONS } from '../data/translations.ts';

test('normalizeLanguage resolves valid codes and aliases safely', () => {
  assert.equal(normalizeLanguage('en'), 'en');
  assert.equal(normalizeLanguage('en-US'), 'en');
  assert.equal(normalizeLanguage('ps'), 'ps');
  assert.equal(normalizeLanguage('pashto'), 'ps');
  assert.equal(normalizeLanguage('fa'), 'fa');
  assert.equal(normalizeLanguage('fa-AF'), 'fa');
  assert.equal(normalizeLanguage('prs'), 'fa');
  assert.equal(normalizeLanguage('dari'), 'fa');
  assert.equal(normalizeLanguage(null), 'en');
  assert.equal(normalizeLanguage('unknown'), 'en');
});

test('RTL and HTML lang detection for English, Pashto, and Dari', () => {
  assert.equal(isRtlLanguage('en'), false);
  assert.equal(isRtlLanguage('ps'), true);
  assert.equal(isRtlLanguage('fa'), true);

  assert.equal(getDirection('en'), 'ltr');
  assert.equal(getDirection('ps'), 'rtl');
  assert.equal(getDirection('fa'), 'rtl');

  assert.equal(getHtmlLang('en'), 'en');
  assert.equal(getHtmlLang('ps'), 'ps');
  assert.equal(getHtmlLang('fa'), 'fa-AF');
  assert.equal(LANGUAGES.length, 3);
});

test('pickLocalized selects matching variant or falls back to English', () => {
  const sample = { en: 'Dispensary', ps: 'درملتون', fa: 'دواخانه' };
  assert.equal(pickLocalized('en', sample), 'Dispensary');
  assert.equal(pickLocalized('ps', sample), 'درملتون');
  assert.equal(pickLocalized('fa', sample), 'دواخانه');
  assert.equal(pickLocalized('ps', { en: 'Fallback' }), 'Fallback');
});

test('TRANSLATIONS has complete non-empty parity across en, ps, and fa', () => {
  const langs = ['en', 'ps', 'fa'] as const;
  for (const lang of langs) {
    const dict = TRANSLATIONS[lang];
    assert.ok(dict.brand.clinicName.length > 0);
    assert.ok(dict.nav.home.length > 0);
    assert.ok(dict.nav.treatments.length > 0);
    assert.ok(dict.nav.shop.length > 0);
    assert.equal(dict.systems.length, 3);
    assert.equal(dict.scopeOfServices.length, 8);
    assert.equal(dict.safetyEthics.length, 4);
    assert.equal(dict.treatments.faqs.length, 5);
    assert.equal(dict.booking.wizardSteps.length, 3);
    assert.equal(Object.keys(dict.servicesMap).length, 8);
    assert.equal(Object.keys(dict.symptomsMap).length, 5);
    assert.equal(Object.keys(dict.shop.productCategories).length, 9);
  }
  assert.equal(Object.keys(TRANSLATIONS.ps.productsMap).length, 13);
  assert.equal(Object.keys(TRANSLATIONS.fa.productsMap).length, 13);
});
