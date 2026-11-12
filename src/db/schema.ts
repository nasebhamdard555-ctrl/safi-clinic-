import { relations } from 'drizzle-orm';
import {
  doublePrecision,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

// Users table linked to Firebase Authentication UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Patients CRM & QR Identity table
export const patients = pgTable('patients', {
  id: serial('id').primaryKey(),
  qrCodeToken: text('qr_code_token').notNull().unique(), // e.g., SNC-PAT-84019
  userUid: text('user_uid'), // Optional Firebase link
  fullName: text('full_name').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),
  age: text('age'),
  gender: text('gender'),
  mizaj: text('mizaj').notNull().default('Balanced / Under Assessment'),
  medicalHistory: text('medical_history'),
  currentProtocols: text('current_protocols'),
  totalVisits: integer('total_visits').notNull().default(0),
  lastVisitAt: timestamp('last_visit_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Patient Arrival & Clinical Triage Visit Logs
export const patientVisits = pgTable('patient_visits', {
  id: serial('id').primaryKey(),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  practitionerName: text('practitioner_name').notNull(),
  visitType: text('visit_type').notNull().default('In-Clinic Consultation'),
  consultationFee: doublePrecision('consultation_fee').notNull().default(140),
  notes: text('notes'),
  checkedInAt: timestamp('checked_in_at').defaultNow(),
});

// Pharmacy Medicines Inventory & Smart Stock Tracking
export const medicines = pgTable('medicines', {
  id: serial('id').primaryKey(),
  productId: text('product_id').notNull().unique(), // Matches HERBAL_PRODUCTS[].id
  sku: text('sku').notNull().unique(), // Human SKU e.g. SNC-BLK-100
  barcodeQr: text('barcode_qr').notNull().unique(), // Scannable QR/Barcode string e.g. MED-BLACK-SEED
  name: text('name').notNull(),
  category: text('category').notNull(),
  unitPrice: doublePrecision('unit_price').notNull(),
  cogsPrice: doublePrecision('cogs_price').notNull(), // Wholesale/Compounding Cost of Goods Sold
  stockQuantity: integer('stock_quantity').notNull().default(50),
  lowStockThreshold: integer('low_stock_threshold').notNull().default(20),
  status: text('status').notNull().default('In Stock'), // 'In Stock' | 'Low Stock' | 'Out of Stock'
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Automated Financial & Accounting Ledger Table
// Every consultation fee or pharmacy/POS checkout writes automatically to this table.
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  referenceNumber: text('reference_number').notNull().unique(),
  type: text('type').notNull(), // 'consultation' | 'pharmacy_sale' | 'expense'
  patientId: integer('patient_id').references(() => patients.id, {
    onDelete: 'set null',
  }),
  patientName: text('patient_name'),
  description: text('description').notNull(),
  grossAmount: doublePrecision('gross_amount').notNull().default(0),
  cogsAmount: doublePrecision('cogs_amount').notNull().default(0),
  overheadAmount: doublePrecision('overhead_amount').notNull().default(0),
  netAmount: doublePrecision('net_amount').notNull().default(0),
  paymentMethod: text('payment_method').notNull().default('Cash / Clinic Desk'),
  itemsJson: text('items_json'),
  createdByUid: text('created_by_uid'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Proactive Low-Stock Owner Alert Dispatch Logs
export const inventoryAlerts = pgTable('inventory_alerts', {
  id: serial('id').primaryKey(),
  medicineId: integer('medicine_id')
    .notNull()
    .references(() => medicines.id, { onDelete: 'cascade' }),
  medicineName: text('medicine_name').notNull(),
  remainingStock: integer('remaining_stock').notNull(),
  threshold: integer('threshold').notNull(),
  alertStatus: text('alert_status').notNull().default('Pending Restock'),
  dispatchedToEmail: text('dispatched_to_email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Configurable Clinic Social Media & Accounting Overhead Settings
export const clinicSettings = pgTable('clinic_settings', {
  id: serial('id').primaryKey(),
  clinicName: text('clinic_name').notNull().default('Safi Natural Care Clinic'),
  facebookUrl: text('facebook_url').notNull().default('https://facebook.com/safinaturalcare'),
  instagramUrl: text('instagram_url').notNull().default('https://instagram.com/safinaturalcare'),
  whatsappNumber: text('whatsapp_number').notNull().default('+93780299299'),
  twitterUrl: text('twitter_url').notNull().default('https://x.com/safinaturalcare'),
  overheadPercentage: doublePrecision('overhead_percentage').notNull().default(15),
  lowStockThreshold: integer('low_stock_threshold').notNull().default(20),
  ownerAlertEmail: text('owner_alert_email').notNull().default('info@safihealthcare.com'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Appointments table for clinical consultations
export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  referenceNumber: text('reference_number').notNull().unique(),
  userId: integer('user_id').references(() => users.id),
  userUid: text('user_uid'),
  serviceId: text('service_id').notNull(),
  serviceTitle: text('service_title').notNull(),
  practitionerId: text('practitioner_id').notNull(),
  practitionerName: text('practitioner_name').notNull(),
  date: text('date').notNull(),
  timeSlot: text('time_slot').notNull(),
  consultationType: text('consultation_type').notNull(),
  patientName: text('patient_name').notNull(),
  patientEmail: text('patient_email').notNull(),
  patientPhone: text('patient_phone').notNull(),
  patientAge: text('patient_age'),
  healthConcerns: text('health_concerns'),
  status: text('status').notNull().default('Confirmed'),
  totalFee: integer('total_fee').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Orders table for herbal dispensary purchases
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  referenceNumber: text('reference_number').notNull().unique(),
  userId: integer('user_id').references(() => users.id),
  userUid: text('user_uid'),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  shippingAddress: text('shipping_address').notNull(),
  city: text('city').notNull(),
  country: text('country').notNull(),
  itemsJson: text('items_json').notNull(),
  subtotal: integer('subtotal').notNull(),
  total: integer('total').notNull(),
  status: text('status').notNull().default('Pending Dispensation'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Recommended Herbal Protocols table
export const protocols = pgTable('protocols', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  userUid: text('user_uid').notNull(),
  protocolName: text('protocol_name').notNull(),
  prescribingDoctor: text('prescribing_doctor').notNull(),
  mizajTarget: text('mizaj_target').notNull(),
  primaryHerbs: text('primary_herbs').notNull(),
  formulation: text('formulation').notNull(),
  dosageSchedule: text('dosage_schedule').notNull(),
  instructions: text('instructions').notNull(),
  dietaryAdvice: text('dietary_advice'),
  contraindications: text('contraindications'),
  status: text('status').notNull().default('Active'),
  durationWeeks: integer('duration_weeks').notNull().default(4),
  adherenceRate: integer('adherence_rate').notNull().default(100),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  appointments: many(appointments),
  orders: many(orders),
  protocols: many(protocols),
}));

export const patientsRelations = relations(patients, ({ many }) => ({
  visits: many(patientVisits),
  transactions: many(transactions),
}));

export const patientVisitsRelations = relations(patientVisits, ({ one }) => ({
  patient: one(patients, {
    fields: [patientVisits.patientId],
    references: [patients.id],
  }),
}));

export const medicinesRelations = relations(medicines, ({ many }) => ({
  alerts: many(inventoryAlerts),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  patient: one(patients, {
    fields: [transactions.patientId],
    references: [patients.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));

export const protocolsRelations = relations(protocols, ({ one }) => ({
  user: one(users, {
    fields: [protocols.userId],
    references: [users.id],
  }),
}));
