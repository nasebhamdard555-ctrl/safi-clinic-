import test from 'node:test';
import assert from 'node:assert/strict';
import { buildActivityCsv, buildCollectionCsv, buildCsvString, canExportCsv, escapeCsvCell } from '../src/lib/csv.ts';
import { MODULES } from '../src/modules.ts';
import type { Row } from '../src/lib/types.ts';

test('canExportCsv allows only administrators (owner role)', () => {
  assert.equal(canExportCsv('owner'), true);
  assert.equal(canExportCsv('staff'), false);
  assert.equal(canExportCsv('demo'), false);
  assert.equal(canExportCsv(undefined), false);
  assert.equal(canExportCsv(null), false);
});

test('escapeCsvCell handles quotes, commas, newlines, nulls, numbers, and formula prefixes', () => {
  assert.equal(escapeCsvCell(null), '""');
  assert.equal(escapeCsvCell(undefined), '""');
  assert.equal(escapeCsvCell('Jane, "Dr." Doe'), '"Jane, ""Dr."" Doe"');
  assert.equal(escapeCsvCell('Line 1\nLine 2'), '"Line 1\nLine 2"');
  assert.equal(escapeCsvCell(1250), '"1250"');
  assert.equal(escapeCsvCell(-45.5), '"-45.5"');
  assert.equal(escapeCsvCell('=SUM(A1:A5)'), '"\'=SUM(A1:A5)"');
  assert.equal(escapeCsvCell('+93 700 123 456'), '"\'+93 700 123 456"');
  assert.equal(escapeCsvCell('@cmd'), '"\'@cmd"');
  assert.equal(escapeCsvCell('-danger'), '"\'-danger"');
});

test('buildCsvString joins header and data rows with CRLF', () => {
  const csv = buildCsvString(
    ['Date', 'Description', 'Amount'],
    [
      ['2026-04-12', 'Consultation, General', 50],
      ['2026-04-13', 'Lab "CBC" test', 120],
    ],
  );
  assert.equal(
    csv,
    '"Date","Description","Amount"\r\n"2026-04-12","Consultation, General","50"\r\n"2026-04-13","Lab ""CBC"" test","120"',
  );
});

test('buildCollectionCsv includes all clinical fields for patients and consultations without duplicating columns', () => {
  const patientRows: Row[] = [
    {
      id: 'p1',
      createdAt: '2026-04-01T08:00:00Z',
      fullName: 'Amina Rahimi',
      phone: '0700111222',
      gender: 'Female',
      dateOfBirth: '1991-05-14',
      bloodGroup: 'O+',
      allergies: 'Penicillin',
      notes: 'Regular follow-up',
    },
  ];
  const patientCsv = buildCollectionCsv(MODULES.patients, patientRows);
  assert.deepEqual(patientCsv.headers, [
    'Name',
    'Phone',
    'Gender',
    'Date of birth',
    'Blood group',
    'Allergies',
    'Notes',
  ]);
  assert.deepEqual(patientCsv.rows, [
    ['Amina Rahimi', '0700111222', 'Female', '1991-05-14', 'O+', 'Penicillin', 'Regular follow-up'],
  ]);

  const consultRows: Row[] = [
    {
      id: 'c1',
      createdAt: '2026-04-10T09:00:00Z',
      date: '2026-04-10',
      patientName: 'Amina Rahimi',
      doctor: 'Dr. Safi',
      bloodPressure: '120/80',
      temperature: '37.1',
      weight: '62',
      complaint: 'Headache',
      diagnosis: 'Tension headache',
      prescription: 'Paracetamol 500mg',
      followUpDate: '2026-04-20',
      notes: 'Rest and hydration',
    },
  ];
  const consultCsv = buildCollectionCsv(MODULES.consultations, consultRows);
  assert.deepEqual(consultCsv.headers, [
    'Visit date',
    'Patient',
    'Doctor',
    'Diagnosis',
    'Follow-up',
    'Blood pressure (e.g. 120/80)',
    'Temperature (°C)',
    'Weight (kg)',
    'Complaint',
    'Prescription',
    'Notes',
  ]);
  assert.equal(consultCsv.rows[0][5], '120/80');
  assert.equal(consultCsv.rows[0][9], 'Paracetamol 500mg');
});

test('buildCollectionCsv exports complete financial and inventory records including computed columns', () => {
  const accountingRows: Row[] = [
    {
      id: 'a1',
      createdAt: '2026-04-10T10:00:00Z',
      date: '2026-04-10',
      type: 'Income',
      category: 'Consultation fee',
      description: 'Morning clinic visits',
      paymentMethod: 'Cash',
      amount: 450,
    },
  ];
  const accCsv = buildCollectionCsv(MODULES.accounting, accountingRows);
  assert.deepEqual(accCsv.headers, ['Date', 'Type', 'Category', 'Description', 'Payment', 'Amount']);
  assert.deepEqual(accCsv.rows, [['2026-04-10', 'Income', 'Consultation fee', 'Morning clinic visits', 'Cash', 450]]);

  const invRow = MODULES.inventory.decorate({
    id: 'i1',
    createdAt: '2026-04-10T10:00:00Z',
    name: 'Amoxicillin 500mg',
    category: 'Medicine',
    quantity: 10,
    unit: 'tablets',
    reorderLevel: 20,
    unitPrice: 2.5,
    expiryDate: '2028-01-01',
  });
  const invCsv = buildCollectionCsv(MODULES.inventory, [invRow]);
  assert.deepEqual(invCsv.headers, [
    'Item',
    'Category',
    'On hand',
    'Reorder at',
    'Expires',
    'Unit price',
    'Stock',
    'Unit (tablets, pcs, ml)',
  ]);
  assert.equal(invCsv.rows[0][6], 'Low stock');
  assert.equal(invCsv.rows[0][7], 'tablets');
});

test('buildActivityCsv exports compliance-ready audit trail columns with ISO timestamp and record ID', () => {
  const logs: Row[] = [
    {
      id: 'act-001',
      createdAt: '2026-11-28T08:30:00.000Z',
      by: 'Dr. Admin',
      action: 'Added',
      module: 'patient',
      summary: 'Amina Rahimi',
    },
  ];
  const activityCsv = buildActivityCsv(logs);
  assert.deepEqual(activityCsv.headers, [
    'Timestamp (ISO)',
    'When',
    'By',
    'Action',
    'Module',
    'Details',
    'Record ID',
  ]);
  assert.equal(activityCsv.rows.length, 1);
  assert.equal(activityCsv.rows[0][0], '2026-11-28T08:30:00.000Z');
  assert.equal(activityCsv.rows[0][2], 'Dr. Admin');
  assert.equal(activityCsv.rows[0][3], 'Added');
  assert.equal(activityCsv.rows[0][4], 'patient');
  assert.equal(activityCsv.rows[0][5], 'Amina Rahimi');
  assert.equal(activityCsv.rows[0][6], 'act-001');
  assert.deepEqual(buildActivityCsv([]).rows, []);
});
