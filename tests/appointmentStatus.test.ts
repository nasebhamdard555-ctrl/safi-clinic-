import test from 'node:test';
import assert from 'node:assert/strict';
import {
  OVERVIEW_WORKFLOW_STATUSES,
  getAppointmentStatusMeta,
  getUpcomingAppointments,
  isWorkflowStatusActive,
  summarizeTodayAppointments,
} from '../src/lib/appointmentStatus.ts';
import type { Row } from '../src/lib/types.ts';

test('OVERVIEW_WORKFLOW_STATUSES exposes Pending, Confirmed, and Completed in workflow order', () => {
  assert.deepEqual([...OVERVIEW_WORKFLOW_STATUSES], ['Pending', 'Confirmed', 'Completed']);
});

test('getAppointmentStatusMeta maps workflow and legacy statuses to expected tones and dot styles', () => {
  assert.equal(getAppointmentStatusMeta('Pending').tone, 'gold');
  assert.equal(getAppointmentStatusMeta('Scheduled').tone, 'gold');
  assert.equal(getAppointmentStatusMeta('Confirmed').tone, 'ok');
  assert.equal(getAppointmentStatusMeta('Checked in').tone, 'ok');
  assert.equal(getAppointmentStatusMeta('Completed').tone, 'ok');
  assert.equal(getAppointmentStatusMeta('Cancelled').tone, 'danger');
  assert.equal(getAppointmentStatusMeta('No show').tone, 'danger');
  assert.equal(getAppointmentStatusMeta('').label, 'Pending');
});

test('isWorkflowStatusActive matches case-insensitively', () => {
  assert.equal(isWorkflowStatusActive('Pending', 'Pending'), true);
  assert.equal(isWorkflowStatusActive('confirmed', 'Confirmed'), true);
  assert.equal(isWorkflowStatusActive('Scheduled', 'Pending'), false);
  assert.equal(isWorkflowStatusActive('Completed', 'Confirmed'), false);
});

test('getUpcomingAppointments excludes past and cancelled entries and sorts chronologically', () => {
  const rows: Row[] = [
    { id: 'past', createdAt: '', date: '2026-11-20T09:00', status: 'Pending' },
    { id: 'cancelled', createdAt: '', date: '2026-11-28T10:00', status: 'Cancelled' },
    { id: 'later', createdAt: '', date: '2026-11-28T14:00', status: 'Confirmed' },
    { id: 'sooner', createdAt: '', date: '2026-11-28T09:30', status: 'Completed' },
  ];
  const upcoming = getUpcomingAppointments(rows, '2026-11-28', 6);
  assert.deepEqual(
    upcoming.map((r) => r.id),
    ['sooner', 'later'],
  );
});

test('summarizeTodayAppointments tallies pending, confirmed, and completed appointments for today', () => {
  const rows: Row[] = [
    { id: '1', createdAt: '', date: '2026-11-28T09:00', status: 'Pending' },
    { id: '2', createdAt: '', date: '2026-11-28T10:00', status: 'Scheduled' },
    { id: '3', createdAt: '', date: '2026-11-28T11:00', status: 'Confirmed' },
    { id: '4', createdAt: '', date: '2026-11-28T12:00', status: 'Checked in' },
    { id: '5', createdAt: '', date: '2026-11-28T13:00', status: 'Completed' },
    { id: '6', createdAt: '', date: '2026-11-29T09:00', status: 'Confirmed' },
  ];
  assert.deepEqual(summarizeTodayAppointments(rows, '2026-11-28'), {
    total: 5,
    pending: 2,
    confirmed: 2,
    completed: 1,
  });
});
