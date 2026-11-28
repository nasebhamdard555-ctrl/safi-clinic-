import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPatientFinancialSummary, isOwedRow } from '../src/lib/patientReceipt.ts';
import type { Row } from '../src/lib/types.ts';

const patient: Row = {
  id: 'pat98765-4321-abcd',
  createdAt: '2026-04-01T08:00:00Z',
  fullName: 'Amina Rahimi',
  phone: '0700 111 222',
};

const visits: Row[] = [
  {
    id: 'v1',
    createdAt: '2026-04-05T09:00:00Z',
    date: '2026-04-05T09:00',
    patientName: 'Amina Rahimi',
    doctor: 'Dr. Safi',
    reason: 'Follow-up',
    fee: 500,
    paymentStatus: 'Paid',
  },
  {
    id: 'v2',
    createdAt: '2026-04-12T11:30:00Z',
    date: '2026-04-12T11:30',
    patientName: 'Amina Rahimi',
    doctor: 'Dr. Noor',
    reason: 'Lab review',
    fee: 300,
    paymentStatus: 'Unpaid',
  },
];

const consults: Row[] = [
  {
    id: 'c1',
    createdAt: '2026-04-05T09:30:00Z',
    patientName: 'Amina Rahimi',
    date: '2026-04-05',
  },
];

const sales: Row[] = [
  {
    id: 's1',
    createdAt: '2026-04-10T10:00:00Z',
    date: '2026-04-10',
    patientName: 'Amina Rahimi',
    items: 'Amoxicillin 500mg x14',
    amount: 250,
    paymentMethod: 'Cash',
    paymentStatus: 'Partly paid',
  },
  {
    id: 's2',
    createdAt: '2026-04-02T14:00:00Z',
    date: '2026-04-02',
    patientName: 'Amina Rahimi',
    items: 'Paracetamol 500mg',
    amount: 150,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
  },
];

test('isOwedRow flags unpaid and partly paid statuses case-insensitively', () => {
  assert.equal(isOwedRow({ id: '1', createdAt: '', paymentStatus: 'Unpaid' }), true);
  assert.equal(isOwedRow({ id: '2', createdAt: '', paymentStatus: 'Partly paid' }), true);
  assert.equal(isOwedRow({ id: '3', createdAt: '', paymentStatus: 'Paid' }), false);
  assert.equal(isOwedRow({ id: '4', createdAt: '' }), false);
});

test('buildPatientFinancialSummary totals billed, settled, outstanding, and sorts items newest-first', () => {
  const summary = buildPatientFinancialSummary(patient, visits, consults, sales);

  assert.equal(summary.receiptNo, 'PS-PAT98765');
  assert.equal(summary.patientName, 'Amina Rahimi');
  assert.equal(summary.visitCount, 2);
  assert.equal(summary.consultationCount, 1);
  assert.equal(summary.dispensingCount, 2);
  assert.equal(summary.appointmentsTotal, 800);
  assert.equal(summary.dispensingTotal, 400);
  assert.equal(summary.totalBilled, 1200);
  assert.equal(summary.outstanding, 550);
  assert.equal(summary.totalSettled, 650);

  assert.deepEqual(
    summary.items.map((i) => i.id),
    ['v2', 's1', 'v1', 's2'],
  );
  assert.equal(summary.items[0].description, 'Lab review (Dr. Noor)');
  assert.equal(summary.items[1].paymentMethod, 'Cash');
  assert.equal(summary.items[1].isOutstanding, true);
});

test('buildPatientFinancialSummary handles patient with zero billing history cleanly', () => {
  const summary = buildPatientFinancialSummary(patient, [], [], []);
  assert.equal(summary.totalBilled, 0);
  assert.equal(summary.totalSettled, 0);
  assert.equal(summary.outstanding, 0);
  assert.deepEqual(summary.items, []);
});
