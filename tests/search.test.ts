import test from 'node:test';
import assert from 'node:assert/strict';
import { filterCollectionRows, formatShortId } from '../src/lib/search.ts';
import type { Row } from '../src/lib/types.ts';

const patients: Row[] = [
  {
    id: 'pat-1001-aabbccdd',
    createdAt: '2026-04-01T08:00:00Z',
    fullName: 'Amina Rahimi',
    phone: '0700 111 222',
  },
  {
    id: 'pat-2002-eeff0011',
    createdAt: '2026-04-02T08:00:00Z',
    fullName: 'Karimullah Safi',
    phone: '0700 333 444',
  },
];

const appointments: Row[] = [
  {
    id: 'apt-9001-11223344',
    createdAt: '2026-04-10T09:00:00Z',
    patientName: 'Amina Rahimi',
    doctor: 'Dr. Noor',
    reason: 'Follow-up',
  },
  {
    id: 'apt-9002-55667788',
    createdAt: '2026-04-11T10:00:00Z',
    patientName: 'Karimullah Safi',
    doctor: 'Dr. Wahid',
    reason: 'Checkup',
  },
];

test('formatShortId returns compact 8-character prefix', () => {
  assert.equal(formatShortId('550e8400-e29b-41d4-a716-446655440000'), '550e8400');
  assert.equal(formatShortId('short'), 'short');
});

test('filterCollectionRows returns all rows when query is empty or whitespace', () => {
  assert.equal(filterCollectionRows(patients, '', ['fullName', 'phone']).length, 2);
  assert.equal(filterCollectionRows(patients, '   ', ['fullName', 'phone']).length, 2);
});

test('filterCollectionRows filters patients by fullName or record ID case-insensitively', () => {
  const byName = filterCollectionRows(patients, 'amina', ['fullName', 'phone']);
  assert.deepEqual(
    byName.map((r) => r.id),
    ['pat-1001-aabbccdd'],
  );

  const byShortId = filterCollectionRows(patients, 'PAT-2002', ['fullName', 'phone']);
  assert.deepEqual(
    byShortId.map((r) => r.id),
    ['pat-2002-eeff0011'],
  );

  const byFullId = filterCollectionRows(patients, 'pat-1001-aabbccdd', ['fullName', 'phone']);
  assert.deepEqual(
    byFullId.map((r) => r.id),
    ['pat-1001-aabbccdd'],
  );
});

test('filterCollectionRows filters linked clinical records by patientName, own ID, or linked patient ID', () => {
  const byPatientName = filterCollectionRows(appointments, 'karimullah', ['patientName', 'doctor'], patients);
  assert.deepEqual(
    byPatientName.map((r) => r.id),
    ['apt-9002-55667788'],
  );

  const byOwnId = filterCollectionRows(appointments, 'apt-9001', ['patientName', 'doctor'], patients);
  assert.deepEqual(
    byOwnId.map((r) => r.id),
    ['apt-9001-11223344'],
  );

  const byLinkedPatientId = filterCollectionRows(appointments, 'pat-1001', ['patientName', 'doctor'], patients);
  assert.deepEqual(
    byLinkedPatientId.map((r) => r.id),
    ['apt-9001-11223344'],
  );
});

test('filterCollectionRows preserves module searchKeys and returns empty array for non-matches', () => {
  const byDoctor = filterCollectionRows(appointments, 'dr. wahid', ['patientName', 'doctor'], patients);
  assert.deepEqual(
    byDoctor.map((r) => r.id),
    ['apt-9002-55667788'],
  );

  const noMatch = filterCollectionRows(appointments, 'nonexistent-xyz', ['patientName', 'doctor'], patients);
  assert.deepEqual(noMatch, []);
});
