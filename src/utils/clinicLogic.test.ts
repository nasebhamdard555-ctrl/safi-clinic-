import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCartTotals,
  validateAppointmentBooking,
  generateAppointmentRef,
  generateOrderRef,
  filterProducts,
} from './clinicLogic';
import { HerbalProduct, CartItem, Appointment } from '../types/clinic';

const mockProduct: HerbalProduct = {
  id: 'prod-1',
  name: 'Safi Royal Black Seed Elixir',
  subtitle: 'Cold-Pressed Nigella Sativa',
  category: 'Tinctures & Tonics',
  price: 34.0,
  rating: 4.9,
  reviewsCount: 128,
  inStock: true,
  image: '/assets/aistudio/WhatsApp_Image_2026-11-06_at_2.48.10_PM_29fcc7b7.jpeg',
  volumeOrWeight: '100ml / 3.4 fl oz',
  shortDescription: 'Pure Ethiopian black cumin seed oil.',
  detailedDescription: 'Full cold pressed unfiltered elixir.',
  botanicalIngredients: [
    { commonName: 'Black Cumin', botanicalName: 'Nigella sativa', action: 'Immunomodulating' },
  ],
  keyBenefits: ['Immune defense', 'Digestive relief'],
  suggestedUse: 'Take 1 tsp morning and night.',
  precautions: 'Consult physician if pregnant.',
  certifications: ['100% Organic', 'Cold-Pressed'],
};

test('calculateCartTotals calculates standard subtotal, shipping fee, and tax', () => {
  const items: CartItem[] = [{ product: mockProduct, quantity: 1 }];
  const totals = calculateCartTotals(items);

  assert.equal(totals.subtotal, 34);
  assert.equal(totals.shipping, 7.99); // Under $60 threshold
  assert.equal(totals.discount, 0);
  assert.equal(totals.tax, 1.7); // 5% of 34 = 1.7
  assert.equal(totals.total, 43.69); // 34 + 7.99 + 1.7
  assert.equal(totals.remainingForFreeShipping, 26);
});

test('calculateCartTotals applies free shipping over $60 and promo code discount', () => {
  const items: CartItem[] = [{ product: mockProduct, quantity: 2 }]; // 68.00
  const totals = calculateCartTotals(items, 'HERBAL10');

  assert.equal(totals.subtotal, 68);
  assert.equal(totals.shipping, 0); // Free shipping over 60
  assert.equal(totals.discount, 6.8); // 10% discount
  assert.equal(totals.discountCodeApplied, 'HERBAL10 (10% Off)');
  const taxable = 68 - 6.8; // 61.2
  assert.equal(totals.tax, 3.06);
  assert.equal(totals.total, 64.26);
});

test('validateAppointmentBooking identifies missing required fields', () => {
  const partialBooking: Partial<Appointment> = {
    serviceId: '',
    practitionerId: '',
    date: '',
    timeSlot: '',
    patient: {
      fullName: '',
      email: 'invalid-email',
      phone: '123',
      healthConcerns: '',
      isFirstTime: true,
    },
  };

  const result = validateAppointmentBooking(partialBooking);
  assert.equal(result.isValid, false);
  assert.ok(result.errors.serviceId);
  assert.ok(result.errors.practitionerId);
  assert.ok(result.errors.date);
  assert.ok(result.errors.timeSlot);
  assert.ok(result.errors.fullName);
  assert.ok(result.errors.email);
  assert.ok(result.errors.phone);
});

test('validateAppointmentBooking passes when all required fields are valid', () => {
  const validBooking: Partial<Appointment> = {
    serviceId: 'srv-1',
    practitionerId: 'prac-1',
    date: '2026-11-15',
    timeSlot: '10:30 AM',
    patient: {
      fullName: 'Soraya Miller',
      email: 'soraya@example.com',
      phone: '+1 555-829-1920',
      healthConcerns: 'Chronic acid reflux and digestive sluggishness for 6 months.',
      isFirstTime: true,
    },
  };

  const result = validateAppointmentBooking(validBooking);
  assert.equal(result.isValid, true);
  assert.equal(Object.keys(result.errors).length, 0);
});

test('generateAppointmentRef produces valid reference prefix', () => {
  const ref = generateAppointmentRef();
  assert.match(ref, /^SHC-\d{5}$/);
});

test('generateOrderRef produces valid reference prefix', () => {
  const ref = generateOrderRef();
  assert.match(ref, /^ORD-\d{6}$/);
});

test('filterProducts correctly filters by category and search keyword', () => {
  const products = [mockProduct];
  const resultsCategory = filterProducts(products, 'Herbal Teas', '');
  assert.equal(resultsCategory.length, 0);

  const resultsMatch = filterProducts(products, 'Tinctures & Tonics', 'Nigella');
  assert.equal(resultsMatch.length, 1);
});

test('calculateBinauralFrequencies computes correct offsets for theta and delta', async () => {
  const { calculateBinauralFrequencies } = await import('./clinicLogic');
  
  const thetaTuning = calculateBinauralFrequencies(432, 'theta');
  assert.equal(thetaTuning.beatHz, 6.0);
  assert.equal(thetaTuning.leftHz, 429);
  assert.equal(thetaTuning.rightHz, 435);
  assert.match(thetaTuning.stateLabel, /Theta/);

  const deltaTuning = calculateBinauralFrequencies(528, 'delta');
  assert.equal(deltaTuning.beatHz, 2.5);
  assert.equal(deltaTuning.leftHz, 526.8);
  assert.equal(deltaTuning.rightHz, 529.3);
});

test('formatAcousticTimer formats minutes and seconds with zero padding', async () => {
  const { formatAcousticTimer } = await import('./clinicLogic');
  
  assert.equal(formatAcousticTimer(0), '00:00');
  assert.equal(formatAcousticTimer(65), '01:05');
  assert.equal(formatAcousticTimer(600), '10:00');
  assert.equal(formatAcousticTimer(-5), '00:00');
});

test('getSoundscapeProfile returns correct clinical details for rain, garden, and oud', async () => {
  const { getSoundscapeProfile } = await import('./clinicLogic');

  const rain = getSoundscapeProfile('rain');
  assert.equal(rain.title, 'Forest Rain');
  assert.match(rain.humorEffect, /Cooling & Moistening/);

  const garden = getSoundscapeProfile('garden');
  assert.equal(garden.title, 'Herbal Garden');

  const oud = getSoundscapeProfile('oud');
  assert.equal(oud.title, 'Traditional Oud');
  assert.match(oud.humorEffect, /Mousiqi/);
});

test('calculateProtocolAdherenceAverage computes average across multiple patient protocols', async () => {
  const { calculateProtocolAdherenceAverage } = await import('./clinicLogic');

  assert.equal(calculateProtocolAdherenceAverage([]), 100);
  assert.equal(
    calculateProtocolAdherenceAverage([
      { adherenceRate: 90 },
      { adherenceRate: 100 },
      { adherenceRate: 80 },
    ]),
    90
  );
});

test('categorizePatientProtocols counts active, completed, and maintenance protocols', async () => {
  const { categorizePatientProtocols } = await import('./clinicLogic');

  const categories = categorizePatientProtocols([
    { status: 'Active' },
    { status: 'Active' },
    { status: 'Completed' },
    { status: 'Maintenance' },
  ]);

  assert.equal(categories.active, 2);
  assert.equal(categories.completed, 1);
  assert.equal(categories.maintenance, 1);
});

test('formatPatientMrn creates standardized SNC MRN identifier', async () => {
  const { formatPatientMrn } = await import('./clinicLogic');

  const mrn = formatPatientMrn('user_abc123');
  assert.match(mrn, /^SNC-\d{4,}$/);
  assert.equal(formatPatientMrn(''), 'SNC-1000');
});

test('classifyInventoryStatus categorizes In Stock, Low Stock, and Out of Stock', async () => {
  const { classifyInventoryStatus, needsRestockAlert } = await import('./clinicLogic');

  assert.equal(classifyInventoryStatus(35, 20), 'In Stock');
  assert.equal(needsRestockAlert(35, 20), false);

  assert.equal(classifyInventoryStatus(19, 20), 'Low Stock');
  assert.equal(needsRestockAlert(19, 20), true);

  assert.equal(classifyInventoryStatus(0, 20), 'Out of Stock');
  assert.equal(needsRestockAlert(0, 20), true);
});

test('calculateTransactionNet computes exact COGS, flat overhead %, and Net Revenue', async () => {
  const { calculateTransactionNet } = await import('./clinicLogic');

  const res = calculateTransactionNet(200, 50, 15); // 15% overhead on $200 = $30 -> net = 200 - 50 - 30 = 120
  assert.equal(res.overheadAmount, 30);
  assert.equal(res.netAmount, 120);
});

test('calculatePeriodFinancialSummary filters transactions accurately by daily, weekly, and monthly windows', async () => {
  const { calculatePeriodFinancialSummary } = await import('./clinicLogic');
  const now = new Date('2026-11-12T14:00:00Z');

  const sampleTx = [
    {
      type: 'consultation',
      grossAmount: 140,
      cogsAmount: 0,
      overheadAmount: 21,
      netAmount: 119,
      patientId: 1,
      patientName: 'Ahmad',
      createdAt: '2026-11-12T10:00:00Z', // today
    },
    {
      type: 'pharmacy_sale',
      grossAmount: 100,
      cogsAmount: 35,
      overheadAmount: 15,
      netAmount: 50,
      patientId: 2,
      patientName: 'Sara',
      createdAt: '2026-11-08T10:00:00Z', // 4 days ago (within weekly)
    },
    {
      type: 'pharmacy_sale',
      grossAmount: 200,
      cogsAmount: 80,
      overheadAmount: 30,
      netAmount: 90,
      patientId: 3,
      patientName: 'Tariq',
      createdAt: '2026-10-25T10:00:00Z', // 18 days ago (monthly only)
    },
  ];

  const daily = calculatePeriodFinancialSummary(sampleTx, 'daily', now);
  assert.equal(daily.grossRevenue, 140);
  assert.equal(daily.netRevenue, 119);
  assert.equal(daily.consultationCount, 1);

  const weekly = calculatePeriodFinancialSummary(sampleTx, 'weekly', now);
  assert.equal(weekly.grossRevenue, 240);
  assert.equal(weekly.totalCogs, 35);
  assert.equal(weekly.netRevenue, 169);

  const monthly = calculatePeriodFinancialSummary(sampleTx, 'monthly', now);
  assert.equal(monthly.grossRevenue, 440);
  assert.equal(monthly.totalPatientsSeen, 3);
});

test('calculatePosCartTotals and generatePatientQrToken produce accurate values', async () => {
  const { calculatePosCartTotals, generatePatientQrToken, buildSocialShareUrl } = await import('./clinicLogic');

  const posTotals = calculatePosCartTotals([
    { unitPrice: 38, cogsPrice: 14, quantity: 2 }, // 76 gross, 28 COGS
    { unitPrice: 24, cogsPrice: 9, quantity: 1 },  // 24 gross, 9 COGS
  ]);
  assert.equal(posTotals.subtotal, 100);
  assert.equal(posTotals.tax, 5);
  assert.equal(posTotals.total, 105);
  assert.equal(posTotals.totalCogs, 37);

  const token = generatePatientQrToken();
  assert.match(token, /^SNC-PAT-\d{5}$/);

  const waUrl = buildSocialShareUrl('whatsapp', 'Royal Black Seed Elixir', 38, '+93 780 299 299');
  assert.match(waUrl, /^https:\/\/wa\.me\/93780299299\?text=/);
});

