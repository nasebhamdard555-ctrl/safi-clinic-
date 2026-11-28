import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildReminderMessage,
  getPatientPhone,
  hasBeenNotified,
  isReminderEligible,
} from '../src/lib/appointmentReminder.ts';
import type { Row } from '../src/lib/types.ts';

test('isReminderEligible allows upcoming active appointments and blocks past, completed, cancelled, or no-show', () => {
  const todayStr = '2026-11-28';
  assert.equal(isReminderEligible({ id: '1', createdAt: '', date: '2026-11-28T09:30', status: 'Pending' }, todayStr), true);
  assert.equal(isReminderEligible({ id: '2', createdAt: '', date: '2026-11-29T11:00', status: 'Confirmed' }, todayStr), true);
  assert.equal(isReminderEligible({ id: '3', createdAt: '', date: '2026-11-28T14:00', status: 'Scheduled' }, todayStr), true);
  assert.equal(isReminderEligible({ id: '4', createdAt: '', date: '2026-11-28T14:00', status: 'Completed' }, todayStr), false);
  assert.equal(isReminderEligible({ id: '5', createdAt: '', date: '2026-11-28T14:00', status: 'Cancelled' }, todayStr), false);
  assert.equal(isReminderEligible({ id: '6', createdAt: '', date: '2026-11-28T14:00', status: 'No show' }, todayStr), false);
  assert.equal(isReminderEligible({ id: '7', createdAt: '', date: '2026-11-20T09:30', status: 'Pending' }, todayStr), false);
});

test('hasBeenNotified detects remindedAt timestamp on appointment row', () => {
  assert.equal(hasBeenNotified({ id: '1', createdAt: '' }), false);
  assert.equal(hasBeenNotified({ id: '2', createdAt: '', remindedAt: '' }), false);
  assert.equal(hasBeenNotified({ id: '3', createdAt: '', remindedAt: '2026-11-28T08:00:00.000Z' }), true);
});

test('getPatientPhone matches patient name case-insensitively and returns trimmed phone', () => {
  const patients: Row[] = [
    { id: 'p1', createdAt: '', fullName: 'Sample Patient A', phone: '0700 000 001' },
    { id: 'p2', createdAt: '', fullName: 'Sample Patient B', phone: '' },
  ];
  assert.equal(getPatientPhone('sample patient a', patients), '0700 000 001');
  assert.equal(getPatientPhone('Sample Patient B', patients), '');
  assert.equal(getPatientPhone('Unknown', patients), '');
});

test('buildReminderMessage formats toast text with or without phone number', () => {
  const appt: Row = {
    id: 'a1',
    createdAt: '',
    patientName: 'Sample Patient A',
    date: '2026-11-28T09:30',
  };
  const withPhone = buildReminderMessage(appt, '0700 000 001');
  assert.match(withPhone, /^Reminder sent to Sample Patient A \(0700 000 001\) for .+\.$/);

  const withoutPhone = buildReminderMessage(appt, '');
  assert.match(withoutPhone, /^Reminder sent to Sample Patient A for .+\.$/);
});
