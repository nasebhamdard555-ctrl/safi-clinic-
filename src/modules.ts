import type { Row } from './lib/types';

export type ColFormat = 'text' | 'money' | 'date' | 'datetime' | 'badge';

export interface FieldDef {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'datetime-local' | 'textarea' | 'select' | 'patient';
  options?: string[];
  required?: boolean;
}

export interface ColDef {
  key: string;
  label: string;
  format?: ColFormat;
}

export interface ModuleDef {
  title: string;
  subtitle: string;
  singular: string;
  collection: string;
  fields: FieldDef[];
  columns: ColDef[];
  searchKeys: string[];
  decorate?: (row: Row) => Row;
  // If set, each row gets a Receipt button that prints the row using this amount field.
  receiptAmountKey?: string;
  receiptTitle?: string;
}

const GENDERS = ['Female', 'Male', 'Other'];
const BLOOD = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
const APPT_STATUS = ['Scheduled', 'Checked in', 'Completed', 'Cancelled', 'No show'];
const PAYMENT = ['Cash', 'Card', 'Mobile transfer'];
const PAY_STATUS = ['Unpaid', 'Partly paid', 'Paid'];
const INV_CATEGORY = ['Medicine', 'Consumable', 'Lab supply', 'Equipment'];
const ACC_TYPE = ['Income', 'Expense'];
const ACC_CATEGORY = ['Consultation fee', 'Pharmacy sales', 'Lab fee', 'Rent', 'Salaries', 'Utilities', 'Medical supplies', 'Equipment', 'Other'];
const STAFF_ROLE = ['Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'Lab technician', 'Accountant', 'Manager'];
const SHIFT = ['Morning', 'Evening', 'Full day'];

export const MODULES = {
  patients: {
    title: 'Patients',
    subtitle: 'Register patients. Click a name to open the full patient record.',
    singular: 'patient',
    collection: 'patients',
    searchKeys: ['fullName', 'phone'],
    fields: [
      { key: 'fullName', label: 'Full name', required: true },
      { key: 'phone', label: 'Phone' },
      { key: 'gender', label: 'Gender', type: 'select', options: GENDERS },
      { key: 'dateOfBirth', label: 'Date of birth', type: 'date' },
      { key: 'bloodGroup', label: 'Blood group', type: 'select', options: BLOOD },
      { key: 'allergies', label: 'Allergies', type: 'textarea' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ],
    columns: [
      { key: 'fullName', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'gender', label: 'Gender' },
      { key: 'dateOfBirth', label: 'Date of birth', format: 'date' },
      { key: 'bloodGroup', label: 'Blood group' },
    ],
  },
  appointments: {
    title: 'Appointments',
    subtitle: 'Book, check in and track appointments and their payment.',
    singular: 'appointment',
    collection: 'appointments',
    searchKeys: ['patientName', 'doctor', 'reason', 'status', 'paymentStatus'],
    receiptAmountKey: 'fee',
    receiptTitle: 'Appointment receipt',
    fields: [
      { key: 'patientName', label: 'Patient', type: 'patient', required: true },
      { key: 'doctor', label: 'Doctor' },
      { key: 'date', label: 'Date and time', type: 'datetime-local', required: true },
      { key: 'reason', label: 'Reason' },
      { key: 'status', label: 'Status', type: 'select', options: APPT_STATUS },
      { key: 'fee', label: 'Fee', type: 'number' },
      { key: 'paymentStatus', label: 'Payment', type: 'select', options: PAY_STATUS },
    ],
    columns: [
      { key: 'date', label: 'When', format: 'datetime' },
      { key: 'patientName', label: 'Patient' },
      { key: 'doctor', label: 'Doctor' },
      { key: 'reason', label: 'Reason' },
      { key: 'status', label: 'Status', format: 'badge' },
      { key: 'fee', label: 'Fee', format: 'money' },
      { key: 'paymentStatus', label: 'Payment', format: 'badge' },
    ],
  },
  consultations: {
    title: 'Consultations',
    subtitle: 'Record complaints, vitals, diagnoses and prescriptions from each visit.',
    singular: 'consultation',
    collection: 'consultations',
    searchKeys: ['patientName', 'doctor', 'diagnosis'],
    fields: [
      { key: 'patientName', label: 'Patient', type: 'patient', required: true },
      { key: 'doctor', label: 'Doctor' },
      { key: 'date', label: 'Visit date', type: 'date', required: true },
      { key: 'bloodPressure', label: 'Blood pressure (e.g. 120/80)' },
      { key: 'temperature', label: 'Temperature (°C)' },
      { key: 'weight', label: 'Weight (kg)' },
      { key: 'complaint', label: 'Complaint', type: 'textarea' },
      { key: 'diagnosis', label: 'Diagnosis' },
      { key: 'prescription', label: 'Prescription', type: 'textarea' },
      { key: 'followUpDate', label: 'Follow-up date', type: 'date' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ],
    columns: [
      { key: 'date', label: 'Visit date', format: 'date' },
      { key: 'patientName', label: 'Patient' },
      { key: 'doctor', label: 'Doctor' },
      { key: 'diagnosis', label: 'Diagnosis' },
      { key: 'followUpDate', label: 'Follow-up', format: 'date' },
    ],
  },
  dispensing: {
    title: 'Dispensing',
    subtitle: 'Record medicines handed to patients, how they paid, and print receipts.',
    singular: 'sale',
    collection: 'dispensing',
    searchKeys: ['patientName', 'items', 'paymentStatus'],
    receiptAmountKey: 'amount',
    receiptTitle: 'Pharmacy receipt',
    fields: [
      { key: 'patientName', label: 'Patient', type: 'patient' },
      { key: 'items', label: 'Items dispensed', type: 'textarea', required: true },
      { key: 'amount', label: 'Amount', type: 'number' },
      { key: 'paymentMethod', label: 'Payment method', type: 'select', options: PAYMENT },
      { key: 'paymentStatus', label: 'Payment status', type: 'select', options: PAY_STATUS },
      { key: 'date', label: 'Date', type: 'date', required: true },
    ],
    columns: [
      { key: 'date', label: 'Date', format: 'date' },
      { key: 'patientName', label: 'Patient' },
      { key: 'items', label: 'Items' },
      { key: 'paymentMethod', label: 'Payment' },
      { key: 'paymentStatus', label: 'Status', format: 'badge' },
      { key: 'amount', label: 'Amount', format: 'money' },
    ],
  },
  inventory: {
    title: 'Inventory',
    subtitle: 'Track clinic stock, reorder levels and expiry dates.',
    singular: 'item',
    collection: 'inventory',
    searchKeys: ['name', 'category'],
    decorate: (row: Row) => {
      const low = Number(row.quantity) <= Number(row.reorderLevel);
      const exp = row.expiryDate ? new Date(String(row.expiryDate)).getTime() : null;
      const now = Date.now();
      let stockStatus = low ? 'Low stock' : 'In stock';
      if (exp !== null && exp < now) stockStatus = 'Expired';
      else if (exp !== null && exp - now < 90 * 86400000) stockStatus = 'Expiring soon';
      return { ...row, stockStatus };
    },
    fields: [
      { key: 'name', label: 'Item name', required: true },
      { key: 'category', label: 'Category', type: 'select', options: INV_CATEGORY },
      { key: 'quantity', label: 'Quantity on hand', type: 'number' },
      { key: 'unit', label: 'Unit (tablets, pcs, ml)' },
      { key: 'reorderLevel', label: 'Reorder level', type: 'number' },
      { key: 'unitPrice', label: 'Unit price', type: 'number' },
      { key: 'expiryDate', label: 'Expiry date', type: 'date' },
    ],
    columns: [
      { key: 'name', label: 'Item' },
      { key: 'category', label: 'Category' },
      { key: 'quantity', label: 'On hand' },
      { key: 'reorderLevel', label: 'Reorder at' },
      { key: 'expiryDate', label: 'Expires', format: 'date' },
      { key: 'unitPrice', label: 'Unit price', format: 'money' },
      { key: 'stockStatus', label: 'Stock', format: 'badge' },
    ],
  },
  accounting: {
    title: 'Income & expenses',
    subtitle: 'Simple clinic ledger: money in, money out, and net for each month.',
    singular: 'entry',
    collection: 'accounting',
    searchKeys: ['description', 'category', 'type'],
    fields: [
      { key: 'type', label: 'Type', type: 'select', options: ACC_TYPE, required: true },
      { key: 'category', label: 'Category', type: 'select', options: ACC_CATEGORY },
      { key: 'description', label: 'Description', required: true },
      { key: 'amount', label: 'Amount', type: 'number', required: true },
      { key: 'paymentMethod', label: 'Payment method', type: 'select', options: PAYMENT },
      { key: 'date', label: 'Date', type: 'date', required: true },
    ],
    columns: [
      { key: 'date', label: 'Date', format: 'date' },
      { key: 'type', label: 'Type', format: 'badge' },
      { key: 'category', label: 'Category' },
      { key: 'description', label: 'Description' },
      { key: 'paymentMethod', label: 'Payment' },
      { key: 'amount', label: 'Amount', format: 'money' },
    ],
  },
  staff: {
    title: 'Staff directory',
    subtitle: 'Clinic team members, roles and shifts.',
    singular: 'staff member',
    collection: 'staff',
    searchKeys: ['fullName', 'role'],
    fields: [
      { key: 'fullName', label: 'Full name', required: true },
      { key: 'role', label: 'Role', type: 'select', options: STAFF_ROLE },
      { key: 'phone', label: 'Phone' },
      { key: 'shift', label: 'Shift', type: 'select', options: SHIFT },
    ],
    columns: [
      { key: 'fullName', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'phone', label: 'Phone' },
      { key: 'shift', label: 'Shift' },
    ],
  },
} satisfies Record<string, ModuleDef>;

export type ModuleKey = keyof typeof MODULES;
