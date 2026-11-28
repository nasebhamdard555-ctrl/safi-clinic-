import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createDebouncedAutoSaver,
  extractPatientForm,
  getPatientFormDiff,
  validatePatientForm,
} from '../src/lib/patientAutoSave.ts';
import { MODULES } from '../src/modules.ts';
import type { Row } from '../src/lib/types.ts';

const fields = MODULES.patients.fields;

test('extractPatientForm pulls all patient fields as strings with empty fallbacks', () => {
  const row: Row = {
    id: 'p1',
    createdAt: '2026-11-28T08:00:00Z',
    fullName: 'Amina Rahimi',
    phone: '0700 111 222',
    gender: 'Female',
    dateOfBirth: '1990-05-01',
    bloodGroup: 'O+',
    allergies: null,
    notes: undefined,
  };
  const form = extractPatientForm(row, fields);
  assert.deepEqual(form, {
    fullName: 'Amina Rahimi',
    phone: '0700 111 222',
    gender: 'Female',
    dateOfBirth: '1990-05-01',
    bloodGroup: 'O+',
    allergies: '',
    notes: '',
  });
});

test('validatePatientForm enforces required fullName and passes when populated', () => {
  assert.equal(validatePatientForm({ fullName: '   ', phone: '' }, fields), 'Full name is required.');
  assert.equal(validatePatientForm({ fullName: 'Amina Rahimi', phone: '' }, fields), null);
});

test('getPatientFormDiff returns only modified fields and human-readable labels', () => {
  const saved = {
    fullName: 'Amina Rahimi',
    phone: '0700 111 222',
    gender: 'Female',
    dateOfBirth: '1990-05-01',
    bloodGroup: 'O+',
    allergies: '',
    notes: 'Initial note',
  };
  const current = {
    ...saved,
    phone: '0700 999 888',
    allergies: 'Penicillin',
    notes: 'Follow-up required',
  };

  assert.deepEqual(getPatientFormDiff(saved, current, fields), {
    patch: {
      phone: '0700 999 888',
      allergies: 'Penicillin',
      notes: 'Follow-up required',
    },
    changedLabels: ['Phone', 'Allergies', 'Notes'],
  });

  assert.deepEqual(getPatientFormDiff(saved, saved, fields), {
    patch: {},
    changedLabels: [],
  });
});

test('createDebouncedAutoSaver debounces rapid edits, flushes periodically under maxWaitMs, and supports immediate flush', async () => {
  let saves = 0;
  const saver = createDebouncedAutoSaver(
    () => {
      saves += 1;
    },
    { debounceMs: 40, maxWaitMs: 90 },
  );

  // Rapid edits collapse into a single debounced save
  saver.schedule();
  await new Promise((r) => setTimeout(r, 15));
  saver.schedule();
  assert.equal(saves, 0);
  await new Promise((r) => setTimeout(r, 60));
  assert.equal(saves, 1);

  // Continuous typing still triggers a periodic save via maxWaitMs
  saver.schedule();
  await new Promise((r) => setTimeout(r, 30));
  saver.schedule();
  await new Promise((r) => setTimeout(r, 30));
  saver.schedule();
  await new Promise((r) => setTimeout(r, 45));
  assert.equal(saves, 2);

  // Immediate flush persists pending edits right away
  saver.schedule();
  await saver.flush();
  assert.equal(saves, 3);
  saver.cancel();
});
