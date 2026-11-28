import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyActivityModule,
  filterRecentActivity,
  formatActivityModule,
  formatRecordActivitySummary,
  getActivityActionTone,
} from '../src/lib/activityFeed.ts';
import type { Row } from '../src/lib/types.ts';

test('classifyActivityModule maps patients, clinical, financial, and other modules accurately', () => {
  assert.equal(classifyActivityModule('patient'), 'patients');
  assert.equal(classifyActivityModule('Patients'), 'patients');
  assert.equal(classifyActivityModule('entry'), 'financial');
  assert.equal(classifyActivityModule('Income & expenses'), 'financial');
  assert.equal(classifyActivityModule('sale'), 'financial');
  assert.equal(classifyActivityModule('Dispensing'), 'financial');
  assert.equal(classifyActivityModule('appointment'), 'clinical');
  assert.equal(classifyActivityModule('consultation'), 'clinical');
  assert.equal(classifyActivityModule('item'), 'clinical');
  assert.equal(classifyActivityModule('staff member'), 'other');
});

test('formatActivityModule humanizes internal singular module names', () => {
  assert.equal(formatActivityModule('entry'), 'Financial entry');
  assert.equal(formatActivityModule('sale'), 'Pharmacy sale');
  assert.equal(formatActivityModule('patient'), 'Patient');
  assert.equal(formatActivityModule(''), 'Record');
});

test('getActivityActionTone maps Added, Updated/Notified/Exported, and Deleted to expected tones', () => {
  assert.equal(getActivityActionTone('Added'), 'ok');
  assert.equal(getActivityActionTone('Updated'), 'gold');
  assert.equal(getActivityActionTone('Notified'), 'gold');
  assert.equal(getActivityActionTone('Exported'), 'gold');
  assert.equal(getActivityActionTone('Deleted'), 'danger');
  assert.equal(getActivityActionTone('Viewed'), 'neutral');
});

test('filterRecentActivity sorts newest-first, filters by category, and applies limit', () => {
  const rows: Row[] = [
    { id: '1', createdAt: '2026-11-28T08:00:00Z', by: 'Dr. Admin', action: 'Added', module: 'patient', summary: 'Amina Rahimi' },
    { id: '2', createdAt: '2026-11-28T09:00:00Z', by: 'Dr. Admin', action: 'Added', module: 'entry', summary: 'Income: Fee (AFN 500)' },
    { id: '3', createdAt: '2026-11-28T10:00:00Z', by: 'Dr. Admin', action: 'Updated', module: 'appointment', summary: 'Amina → Confirmed' },
  ];

  assert.deepEqual(
    filterRecentActivity(rows, 'all', 2).map((r) => r.id),
    ['3', '2'],
  );
  assert.deepEqual(
    filterRecentActivity(rows, 'patients', 10).map((r) => r.id),
    ['1'],
  );
  assert.deepEqual(
    filterRecentActivity(rows, 'financial', 10).map((r) => r.id),
    ['2'],
  );
  assert.deepEqual(
    filterRecentActivity(rows, 'clinical', 10).map((r) => r.id),
    ['3'],
  );
});

test('formatRecordActivitySummary builds informative audit descriptions for financial, dispensing, appointment, and patient records', () => {
  assert.equal(
    formatRecordActivitySummary('accounting', { type: 'Income', description: 'Lab fee', amount: 1200 }, 'entry'),
    'Income: Lab fee (AFN 1,200)',
  );
  assert.equal(
    formatRecordActivitySummary('dispensing', { patientName: 'Amina Rahimi', items: 'Paracetamol x10', amount: 40 }, 'sale'),
    'Amina Rahimi · Paracetamol x10 (AFN 40)',
  );
  assert.equal(
    formatRecordActivitySummary('appointments', { patientName: 'Amina Rahimi', reason: 'Follow-up' }, 'appointment'),
    'Amina Rahimi · Follow-up',
  );
  assert.equal(
    formatRecordActivitySummary('patients', { fullName: 'Amina Rahimi' }, 'patient'),
    'Amina Rahimi',
  );
});
