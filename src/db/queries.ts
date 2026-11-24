import { db, isDbOnline, markDbOffline } from './index.ts';
import {
  users,
  appointments,
  orders,
  protocols,
  patients,
  patientVisits,
  medicines,
  transactions,
  inventoryAlerts,
  clinicSettings,
} from './schema.ts';
import { eq, desc, and } from 'drizzle-orm';
import {
  classifyInventoryStatus,
  calculateTransactionNet,
  generatePatientQrToken,
} from '../utils/clinicLogic.ts';
import { postClinicTransactionToMoaLedger } from './accountingQueries.ts';

// ============================================================================
// IN-MEMORY CLINICAL DATA STORE (Active automatically when PostgreSQL is offline)
// ============================================================================

const SEED_MEDICINES_CATALOG = [
  {
    productId: 'prod-hormone-balance',
    sku: 'SNC-HRM-060',
    barcodeQr: 'MED-HORMONE-BALANCE',
    name: 'Safi Hormone Balance',
    category: "Women's Health & Hormonal Wellness",
    unitPrice: 42.0,
    cogsPrice: 14.5,
    stockQuantity: 48,
    lowStockThreshold: 20,
    status: 'In Stock',
  },
  {
    productId: 'prod-chill-af',
    sku: 'SNC-CHL-050',
    barcodeQr: 'MED-CHILL-AF',
    name: 'Safi Chill AF',
    category: 'Stress, Sleep & Neurological Wellness',
    unitPrice: 39.0,
    cogsPrice: 13.0,
    stockQuantity: 52,
    lowStockThreshold: 20,
    status: 'In Stock',
  },
  {
    productId: 'prod-beauty-drops',
    sku: 'SNC-BTY-050',
    barcodeQr: 'MED-BEAUTY-DROPS',
    name: 'Safi Beauty Drops',
    category: 'Immunity & General Wellness',
    unitPrice: 45.0,
    cogsPrice: 15.0,
    stockQuantity: 36,
    lowStockThreshold: 20,
    status: 'In Stock',
  },
  {
    productId: 'prod-black-seed',
    sku: 'SNC-BLK-100',
    barcodeQr: 'MED-BLACK-SEED',
    name: 'Safi Royal Black Seed Elixir',
    category: 'Cardiometabolic Wellness',
    unitPrice: 38.0,
    cogsPrice: 13.5,
    stockQuantity: 64,
    lowStockThreshold: 20,
    status: 'In Stock',
  },
  {
    productId: 'prod-ashwagandha',
    sku: 'SNC-ASH-060',
    barcodeQr: 'MED-ASHWAGANDHA',
    name: 'Safi KSM-66 & Saffron Vitality Tonic',
    category: 'Stress, Sleep & Neurological Wellness',
    unitPrice: 44.0,
    cogsPrice: 16.0,
    stockQuantity: 42,
    lowStockThreshold: 20,
    status: 'In Stock',
  },
  {
    productId: 'prod-joint-balm',
    sku: 'SNC-JNT-080',
    barcodeQr: 'MED-JOINT-BALM',
    name: 'Joint-Flex Boswellia & Turmeric Balm',
    category: 'Bone, Joint & Pain Management',
    unitPrice: 36.0,
    cogsPrice: 12.0,
    stockQuantity: 38,
    lowStockThreshold: 20,
    status: 'In Stock',
  },
  {
    productId: 'prod-shilajit-gold',
    sku: 'SNC-SHL-030',
    barcodeQr: 'MED-SHILAJIT-GOLD',
    name: 'Pure Himalayan Shilajit Gold Resin',
    category: 'Male Wellness & Fertility',
    unitPrice: 58.0,
    cogsPrice: 22.0,
    stockQuantity: 12,
    lowStockThreshold: 20,
    status: 'Low Stock',
  },
  {
    productId: 'prod-gut-tea',
    sku: 'SNC-GUT-120',
    barcodeQr: 'MED-FLORA-TEA',
    name: 'FloraSoothe Digestive Botanical Tea',
    category: 'Digestive & Gastrointestinal Wellness',
    unitPrice: 26.0,
    cogsPrice: 8.5,
    stockQuantity: 55,
    lowStockThreshold: 20,
    status: 'In Stock',
  },
  {
    productId: 'prod-renal-drops',
    sku: 'SNC-RNL-060',
    barcodeQr: 'MED-URICLEANSE',
    name: 'Safi Uricleanse Renal & Bladder Drops',
    category: 'Kidney & Urinary Wellness',
    unitPrice: 34.0,
    cogsPrice: 11.5,
    stockQuantity: 30,
    lowStockThreshold: 20,
    status: 'In Stock',
  },
  {
    productId: 'prod-liver-tonic',
    sku: 'SNC-LVR-100',
    barcodeQr: 'MED-HEPATOX',
    name: 'Safi Hepatox Liver & Bile Bitter Tonic',
    category: 'Liver & Detox Wellness',
    unitPrice: 37.0,
    cogsPrice: 12.5,
    stockQuantity: 28,
    lowStockThreshold: 20,
    status: 'In Stock',
  },
  {
    productId: 'prod-lung-syrup',
    sku: 'SNC-BRN-200',
    barcodeQr: 'MED-BRONCHO-SYRUP',
    name: 'Broncho-Vital Lung & Throat Elixir',
    category: 'Immunity & General Wellness',
    unitPrice: 32.0,
    cogsPrice: 11.0,
    stockQuantity: 14,
    lowStockThreshold: 20,
    status: 'Low Stock',
  },
  {
    productId: 'prod-sleep-drops',
    sku: 'SNC-SLP-050',
    barcodeQr: 'MED-SOMNA-CALM',
    name: 'Somna-Calm Valerian & Skullcap Drops',
    category: 'Stress, Sleep & Neurological Wellness',
    unitPrice: 29.0,
    cogsPrice: 10.0,
    stockQuantity: 31,
    lowStockThreshold: 20,
    status: 'In Stock',
  },
  {
    productId: 'prod-neem-salve',
    sku: 'SNC-NEM-060',
    barcodeQr: 'MED-NEEM-SALVE',
    name: 'Neem & Calendula Restorative Skin Salve',
    category: 'Immunity & General Wellness',
    unitPrice: 28.0,
    cogsPrice: 9.5,
    stockQuantity: 0,
    lowStockThreshold: 20,
    status: 'Out of Stock',
  },
];

let memorySettings = {
  id: 1,
  clinicName: 'Safi Natural Care Clinic',
  facebookUrl: 'https://facebook.com/safinaturalcare',
  instagramUrl: 'https://instagram.com/safinaturalcare',
  whatsappNumber: '+93780299299',
  twitterUrl: 'https://x.com/safinaturalcare',
  overheadPercentage: 15,
  lowStockThreshold: 20,
  ownerAlertEmail: 'info@safihealthcare.com',
  updatedAt: new Date(),
};

let memoryMedicines = SEED_MEDICINES_CATALOG.map((item, idx) => ({
  id: idx + 1,
  ...item,
  updatedAt: new Date(),
}));

const seedNow = new Date();
const seedHoursAgo = (h: number) => new Date(seedNow.getTime() - h * 60 * 60 * 1000);
const seedDaysAgo = (d: number) => new Date(seedNow.getTime() - d * 24 * 60 * 60 * 1000);

let memoryPatients: any[] = [
  {
    id: 1,
    qrCodeToken: 'SNC-PAT-84019',
    userUid: null,
    fullName: 'Hajji Ahmadullah Stanikzai',
    email: 'ahmadullah.s@kabulmail.af',
    phone: '+93 700 245 810',
    age: '58',
    gender: 'Male',
    mizaj: 'Cold & Moist (Balghami)',
    medicalHistory: 'Bilateral knee osteoarthritis, mild seasonal bronchial sensitivity.',
    currentProtocols: 'Joint-Flex Boswellia Balm + Himalayan Shilajit Gold Resin',
    totalVisits: 4,
    lastVisitAt: seedNow,
    createdAt: seedDaysAgo(30),
  },
  {
    id: 2,
    qrCodeToken: 'SNC-PAT-51204',
    userUid: null,
    fullName: 'Soraya Karimi',
    email: 'soraya.k@heratcare.af',
    phone: '+93 799 312 440',
    age: '34',
    gender: 'Female',
    mizaj: 'Hot & Dry (Safrawi)',
    medicalHistory: 'Hormonal cycle irregularity, stress-related gastric acidity.',
    currentProtocols: "Women's Endocrine Protocol + FloraSoothe Botanical Tea",
    totalVisits: 3,
    lastVisitAt: seedDaysAgo(1),
    createdAt: seedDaysAgo(24),
  },
  {
    id: 3,
    qrCodeToken: 'SNC-PAT-39172',
    userUid: null,
    fullName: 'Mirwais Rahimi',
    email: 'mirwais.r@mazar.af',
    phone: '+93 786 901 234',
    age: '44',
    gender: 'Male',
    mizaj: 'Hot & Moist (Damawi)',
    medicalHistory: 'Cervical tension migraines, elevated work fatigue.',
    currentProtocols: 'Hijama Cupping Follow-up + Safi Royal Black Seed Elixir',
    totalVisits: 2,
    lastVisitAt: seedDaysAgo(3),
    createdAt: seedDaysAgo(18),
  },
  {
    id: 4,
    qrCodeToken: 'SNC-PAT-67431',
    userUid: null,
    fullName: 'Fatima Al-Zahra',
    email: 'fatima.z@kabul.af',
    phone: '+93 771 552 890',
    age: '31',
    gender: 'Female',
    mizaj: 'Cold & Dry (Sawdawi)',
    medicalHistory: 'Chronic skin barrier dryness & eczema flare recovery.',
    currentProtocols: 'Herbal Dermatology Protocol + Neem Restorative Salve',
    totalVisits: 5,
    lastVisitAt: seedDaysAgo(1),
    createdAt: seedDaysAgo(40),
  },
];

let memoryTransactions: any[] = [
  {
    id: 1,
    referenceNumber: 'TX-CLINIC-1001',
    type: 'consultation',
    patientId: 1,
    patientName: 'Hajji Ahmadullah Stanikzai',
    description: 'Chronic Pain, Joints & Arthritis Therapy (Dr. Hafizullah Safi)',
    grossAmount: 130,
    cogsAmount: 0,
    overheadAmount: 19.5,
    netAmount: 110.5,
    paymentMethod: 'Cash / Clinic Desk',
    itemsJson: null,
    createdByUid: null,
    createdAt: seedHoursAgo(2),
  },
  {
    id: 2,
    referenceNumber: 'TX-POS-1002',
    type: 'pharmacy_sale',
    patientId: 1,
    patientName: 'Hajji Ahmadullah Stanikzai',
    description: 'POS Dispensary Sale: Safi Royal Black Seed Elixir x2, Joint-Flex Balm x1',
    grossAmount: 112,
    cogsAmount: 39,
    overheadAmount: 16.8,
    netAmount: 56.2,
    paymentMethod: 'Cash / POS Terminal',
    itemsJson: JSON.stringify([
      { name: 'Safi Royal Black Seed Elixir', qty: 2, price: 38 },
      { name: 'Joint-Flex Boswellia & Turmeric Balm', qty: 1, price: 36 },
    ]),
    createdByUid: null,
    createdAt: seedHoursAgo(1),
  },
  {
    id: 3,
    referenceNumber: 'TX-CLINIC-1003',
    type: 'consultation',
    patientId: 2,
    patientName: 'Soraya Karimi',
    description: 'Hormonal & Reproductive Health Support (Dr. Hafizullah Safi)',
    grossAmount: 145,
    cogsAmount: 0,
    overheadAmount: 21.75,
    netAmount: 123.25,
    paymentMethod: 'Bank Transfer / Clinic Desk',
    itemsJson: null,
    createdByUid: null,
    createdAt: seedDaysAgo(1),
  },
  {
    id: 4,
    referenceNumber: 'TX-POS-1004',
    type: 'pharmacy_sale',
    patientId: 2,
    patientName: 'Soraya Karimi',
    description: 'POS Dispensary Sale: KSM-66 & Saffron Tonic x1, FloraSoothe Tea x2',
    grossAmount: 96,
    cogsAmount: 33,
    overheadAmount: 14.4,
    netAmount: 48.6,
    paymentMethod: 'Cash / POS Terminal',
    itemsJson: null,
    createdByUid: null,
    createdAt: seedDaysAgo(2),
  },
  {
    id: 5,
    referenceNumber: 'TX-CLINIC-1005',
    type: 'consultation',
    patientId: 3,
    patientName: 'Mirwais Rahimi',
    description: 'Hijama (Wet Cupping) & Traditional Acupuncture (Dr. Hafizullah Safi)',
    grossAmount: 150,
    cogsAmount: 8,
    overheadAmount: 22.5,
    netAmount: 119.5,
    paymentMethod: 'Cash / Clinic Desk',
    itemsJson: null,
    createdByUid: null,
    createdAt: seedDaysAgo(4),
  },
  {
    id: 6,
    referenceNumber: 'TX-POS-1006',
    type: 'pharmacy_sale',
    patientId: 4,
    patientName: 'Fatima Al-Zahra',
    description: 'Online Dispensary: Pure Himalayan Shilajit Gold Resin x2',
    grossAmount: 116,
    cogsAmount: 44,
    overheadAmount: 17.4,
    netAmount: 54.6,
    paymentMethod: 'Online Dispensary',
    itemsJson: null,
    createdByUid: null,
    createdAt: seedDaysAgo(6),
  },
  {
    id: 7,
    referenceNumber: 'TX-CLINIC-1007',
    type: 'consultation',
    patientId: 4,
    patientName: 'Fatima Al-Zahra',
    description: 'Therapeutic Skin & Hair Care Consultation (Safi Clinical Care Team)',
    grossAmount: 120,
    cogsAmount: 0,
    overheadAmount: 18,
    netAmount: 102,
    paymentMethod: 'Cash / Clinic Desk',
    itemsJson: null,
    createdByUid: null,
    createdAt: seedDaysAgo(12),
  },
  {
    id: 8,
    referenceNumber: 'TX-POS-1008',
    type: 'pharmacy_sale',
    patientId: 3,
    patientName: 'Mirwais Rahimi',
    description: 'POS Dispensary Sale: Broncho-Vital Elixir x3, Somna-Calm Drops x1',
    grossAmount: 125,
    cogsAmount: 43,
    overheadAmount: 18.75,
    netAmount: 63.25,
    paymentMethod: 'Cash / POS Terminal',
    itemsJson: null,
    createdByUid: null,
    createdAt: seedDaysAgo(19),
  },
];

let memoryAlerts: any[] = memoryMedicines
  .filter((m) => m.stockQuantity < m.lowStockThreshold)
  .map((m, idx) => ({
    id: idx + 1,
    medicineId: m.id,
    medicineName: m.name,
    remainingStock: m.stockQuantity,
    threshold: m.lowStockThreshold,
    alertStatus: m.stockQuantity <= 0 ? 'Critical Outage' : 'Pending Restock',
    dispatchedToEmail: memorySettings.ownerAlertEmail,
    createdAt: seedHoursAgo(idx + 1),
  }));

let memoryVisits: any[] = [
  {
    id: 1,
    patientId: 1,
    practitionerName: 'Dr. Hafizullah Safi',
    visitType: 'Chronic Pain & Joint Follow-Up',
    consultationFee: 130,
    notes: 'Responded well to Boswellia & Turmeric Balm. Continue 4-week regimen.',
    checkedInAt: seedHoursAgo(2),
  },
  {
    id: 2,
    patientId: 2,
    practitionerName: 'Dr. Hafizullah Safi',
    visitType: 'Endocrine & Mizaj Assessment',
    consultationFee: 145,
    notes: 'Assigned Safrawi cooling diet and FloraSoothe botanical tea.',
    checkedInAt: seedDaysAgo(1),
  },
];

let memoryAppointments: any[] = [];
let memoryOrders: any[] = [];
let memoryProtocols: any[] = [];
let memoryUsers: Map<string, any> = new Map();

export function getInMemorySeedTransactions() {
  return [...memoryTransactions];
}

// ============================================================================
// USER ACCOUNTS
// ============================================================================

export async function getOrCreateUser(
  uid: string,
  email: string,
  displayName?: string,
  photoUrl?: string
) {
  if (isDbOnline()) {
    try {
      const result = await db
        .insert(users)
        .values({
          uid,
          email,
          displayName: displayName || null,
          photoUrl: photoUrl || null,
        })
        .onConflictDoUpdate({
          target: users.uid,
          set: {
            email,
            displayName: displayName || null,
            photoUrl: photoUrl || null,
          },
        })
        .returning();

      return result[0];
    } catch (error) {
      markDbOffline(error);
    }
  }

  const existing = memoryUsers.get(uid);
  const record = {
    id: existing?.id ?? memoryUsers.size + 1,
    uid,
    email,
    displayName: displayName || existing?.displayName || null,
    photoUrl: photoUrl || existing?.photoUrl || null,
    createdAt: existing?.createdAt ?? new Date(),
  };
  memoryUsers.set(uid, record);
  return record;
}

// ============================================================================
// CLINIC SETTINGS
// ============================================================================

export async function getOrSeedClinicSettings() {
  if (isDbOnline()) {
    try {
      const rows = await db.select().from(clinicSettings).limit(1);
      if (rows.length > 0) return rows[0];

      const inserted = await db
        .insert(clinicSettings)
        .values({
          clinicName: 'Safi Natural Care Clinic',
          facebookUrl: 'https://facebook.com/safinaturalcare',
          instagramUrl: 'https://instagram.com/safinaturalcare',
          whatsappNumber: '+93780299299',
          twitterUrl: 'https://x.com/safinaturalcare',
          overheadPercentage: 15,
          lowStockThreshold: 20,
          ownerAlertEmail: 'info@safihealthcare.com',
        })
        .returning();
      return inserted[0];
    } catch (error) {
      markDbOffline(error);
    }
  }

  return memorySettings;
}

export async function updateClinicSettings(data: {
  facebookUrl?: string;
  instagramUrl?: string;
  whatsappNumber?: string;
  twitterUrl?: string;
  overheadPercentage?: number;
  lowStockThreshold?: number;
  ownerAlertEmail?: string;
}) {
  if (isDbOnline()) {
    try {
      const current = await getOrSeedClinicSettings();
      const updated = await db
        .update(clinicSettings)
        .set({
          facebookUrl: data.facebookUrl ?? current.facebookUrl,
          instagramUrl: data.instagramUrl ?? current.instagramUrl,
          whatsappNumber: data.whatsappNumber ?? current.whatsappNumber,
          twitterUrl: data.twitterUrl ?? current.twitterUrl,
          overheadPercentage:
            data.overheadPercentage !== undefined
              ? Number(data.overheadPercentage)
              : current.overheadPercentage,
          lowStockThreshold:
            data.lowStockThreshold !== undefined
              ? Number(data.lowStockThreshold)
              : current.lowStockThreshold,
          ownerAlertEmail: data.ownerAlertEmail ?? current.ownerAlertEmail,
          updatedAt: new Date(),
        })
        .where(eq(clinicSettings.id, current.id))
        .returning();
      return updated[0];
    } catch (error) {
      markDbOffline(error);
    }
  }

  memorySettings = {
    ...memorySettings,
    facebookUrl: data.facebookUrl ?? memorySettings.facebookUrl,
    instagramUrl: data.instagramUrl ?? memorySettings.instagramUrl,
    whatsappNumber: data.whatsappNumber ?? memorySettings.whatsappNumber,
    twitterUrl: data.twitterUrl ?? memorySettings.twitterUrl,
    overheadPercentage:
      data.overheadPercentage !== undefined
        ? Number(data.overheadPercentage)
        : memorySettings.overheadPercentage,
    lowStockThreshold:
      data.lowStockThreshold !== undefined
        ? Number(data.lowStockThreshold)
        : memorySettings.lowStockThreshold,
    ownerAlertEmail: data.ownerAlertEmail ?? memorySettings.ownerAlertEmail,
    updatedAt: new Date(),
  };
  return memorySettings;
}

// ============================================================================
// PHARMACY INVENTORY & ALERTS
// ============================================================================

export async function ensureSeededMedicines() {
  if (isDbOnline()) {
    try {
      const existing = await db.select().from(medicines).orderBy(medicines.id);
      const existingIds = new Set(existing.map((m) => m.productId));

      const missing = SEED_MEDICINES_CATALOG.filter(
        (item) => !existingIds.has(item.productId)
      );
      if (missing.length === 0) return existing;

      const inserted = await db.insert(medicines).values(missing).returning();
      const settings = await getOrSeedClinicSettings();
      for (const med of inserted) {
        if (med.stockQuantity < med.lowStockThreshold) {
          await db.insert(inventoryAlerts).values({
            medicineId: med.id,
            medicineName: med.name,
            remainingStock: med.stockQuantity,
            threshold: med.lowStockThreshold,
            alertStatus:
              med.stockQuantity <= 0 ? 'Critical Outage' : 'Pending Restock',
            dispatchedToEmail: settings.ownerAlertEmail,
          });
        }
      }

      return [...existing, ...inserted];
    } catch (error) {
      markDbOffline(error);
    }
  }

  return memoryMedicines;
}

export async function getInventoryAlerts(limit = 20) {
  if (isDbOnline()) {
    try {
      return await db
        .select()
        .from(inventoryAlerts)
        .orderBy(desc(inventoryAlerts.createdAt))
        .limit(limit);
    } catch (error) {
      markDbOffline(error);
    }
  }

  return memoryAlerts.slice(0, limit);
}

export async function dispatchLowStockAlerts() {
  const settings = await getOrSeedClinicSettings();
  const list = await ensureSeededMedicines();
  const lowItems = list.filter(
    (m) => m.stockQuantity < settings.lowStockThreshold
  );

  if (isDbOnline()) {
    try {
      for (const item of lowItems) {
        await db.insert(inventoryAlerts).values({
          medicineId: item.id,
          medicineName: item.name,
          remainingStock: item.stockQuantity,
          threshold: settings.lowStockThreshold,
          alertStatus: 'Email Dispatched to Owner',
          dispatchedToEmail: settings.ownerAlertEmail,
        });
      }
      return {
        dispatchedTo: settings.ownerAlertEmail,
        alertCount: lowItems.length,
        items: lowItems.map((i) => ({ name: i.name, stock: i.stockQuantity })),
      };
    } catch (error) {
      markDbOffline(error);
    }
  }

  for (const item of lowItems) {
    memoryAlerts.unshift({
      id: memoryAlerts.length + 1,
      medicineId: item.id,
      medicineName: item.name,
      remainingStock: item.stockQuantity,
      threshold: settings.lowStockThreshold,
      alertStatus: 'Email Dispatched to Owner',
      dispatchedToEmail: settings.ownerAlertEmail,
      createdAt: new Date(),
    });
  }

  return {
    dispatchedTo: settings.ownerAlertEmail,
    alertCount: lowItems.length,
    items: lowItems.map((i) => ({ name: i.name, stock: i.stockQuantity })),
  };
}

export async function restockMedicine(medicineId: number, addQuantity: number) {
  const settings = await getOrSeedClinicSettings();

  if (isDbOnline()) {
    try {
      const rows = await db
        .select()
        .from(medicines)
        .where(eq(medicines.id, medicineId))
        .limit(1);
      if (rows.length === 0) throw new Error('Medicine not found');

      const med = rows[0];
      const nextQty = Math.max(0, med.stockQuantity + Math.max(1, addQuantity));
      const nextStatus = classifyInventoryStatus(
        nextQty,
        settings.lowStockThreshold
      );

      const updated = await db
        .update(medicines)
        .set({
          stockQuantity: nextQty,
          status: nextStatus,
          updatedAt: new Date(),
        })
        .where(eq(medicines.id, medicineId))
        .returning();

      if (nextQty >= settings.lowStockThreshold) {
        await db
          .update(inventoryAlerts)
          .set({ alertStatus: 'Resolved / Restocked' })
          .where(eq(inventoryAlerts.medicineId, medicineId));
      }

      return updated[0];
    } catch (error: any) {
      if (error?.message === 'Medicine not found') throw error;
      markDbOffline(error);
    }
  }

  const med = memoryMedicines.find((m) => m.id === medicineId);
  if (!med) throw new Error('Medicine not found');
  med.stockQuantity = Math.max(0, med.stockQuantity + Math.max(1, addQuantity));
  med.status = classifyInventoryStatus(
    med.stockQuantity,
    settings.lowStockThreshold
  );
  med.updatedAt = new Date();

  if (med.stockQuantity >= settings.lowStockThreshold) {
    for (const alert of memoryAlerts) {
      if (alert.medicineId === medicineId) {
        alert.alertStatus = 'Resolved / Restocked';
      }
    }
  }

  return med;
}

// ============================================================================
// PATIENTS CRM & TRIAGE
// ============================================================================

export async function ensureSeededPatientsAndLedger() {
  if (isDbOnline()) {
    try {
      let patientList = await db
        .select()
        .from(patients)
        .orderBy(desc(patients.id));
      if (patientList.length === 0) {
        patientList = await db
          .insert(patients)
          .values(
            memoryPatients.map((p) => ({
              qrCodeToken: p.qrCodeToken,
              fullName: p.fullName,
              email: p.email,
              phone: p.phone,
              age: p.age,
              gender: p.gender,
              mizaj: p.mizaj,
              medicalHistory: p.medicalHistory,
              currentProtocols: p.currentProtocols,
              totalVisits: p.totalVisits,
              lastVisitAt: p.lastVisitAt,
            }))
          )
          .returning();
      }

      const existingTx = await db
        .select()
        .from(transactions)
        .orderBy(desc(transactions.createdAt));
      if (existingTx.length === 0) {
        await db.insert(transactions).values(
          memoryTransactions.map((tx, idx) => ({
            referenceNumber: tx.referenceNumber,
            type: tx.type,
            patientId: patientList[idx % patientList.length]?.id ?? null,
            patientName: tx.patientName,
            description: tx.description,
            grossAmount: tx.grossAmount,
            cogsAmount: tx.cogsAmount,
            overheadAmount: tx.overheadAmount,
            netAmount: tx.netAmount,
            paymentMethod: tx.paymentMethod,
            itemsJson: tx.itemsJson,
            createdAt: tx.createdAt,
          }))
        );
      }

      return patientList;
    } catch (error) {
      markDbOffline(error);
    }
  }

  return memoryPatients;
}

export async function getPatientsWithVisits() {
  await ensureSeededPatientsAndLedger();

  if (isDbOnline()) {
    try {
      const list = await db.select().from(patients).orderBy(desc(patients.id));
      const visits = await db
        .select()
        .from(patientVisits)
        .orderBy(desc(patientVisits.checkedInAt))
        .limit(30);

      return list.map((p) => ({
        ...p,
        visits: visits.filter((v) => v.patientId === p.id),
      }));
    } catch (error) {
      markDbOffline(error);
    }
  }

  return [...memoryPatients]
    .sort((a, b) => b.id - a.id)
    .map((p) => ({
      ...p,
      visits: memoryVisits.filter((v) => v.patientId === p.id),
    }));
}

export async function getPatientByQrToken(rawToken: string) {
  await ensureSeededPatientsAndLedger();
  const token = rawToken.trim().toUpperCase();

  if (isDbOnline()) {
    try {
      const rows = await db
        .select()
        .from(patients)
        .where(eq(patients.qrCodeToken, token))
        .limit(1);

      if (rows.length === 0) return null;

      const visits = await db
        .select()
        .from(patientVisits)
        .where(eq(patientVisits.patientId, rows[0].id))
        .orderBy(desc(patientVisits.checkedInAt));

      return { ...rows[0], visits };
    } catch (error) {
      markDbOffline(error);
    }
  }

  const found = memoryPatients.find(
    (p) => p.qrCodeToken.toUpperCase() === token
  );
  if (!found) return null;

  return {
    ...found,
    visits: memoryVisits.filter((v) => v.patientId === found.id),
  };
}

export async function createPatientProfile(data: {
  fullName: string;
  email?: string;
  phone: string;
  age?: string;
  gender?: string;
  mizaj?: string;
  medicalHistory?: string;
  currentProtocols?: string;
}) {
  const qrCodeToken = generatePatientQrToken();

  if (isDbOnline()) {
    try {
      const inserted = await db
        .insert(patients)
        .values({
          qrCodeToken,
          fullName: data.fullName.trim(),
          email: data.email?.trim() || null,
          phone: data.phone.trim(),
          age: data.age?.trim() || null,
          gender: data.gender?.trim() || null,
          mizaj: data.mizaj?.trim() || 'Balanced / Under Assessment',
          medicalHistory:
            data.medicalHistory?.trim() || 'Initial clinical intake registered.',
          currentProtocols:
            data.currentProtocols?.trim() || 'Pending Practitioner Assessment',
          totalVisits: 0,
        })
        .returning();

      return inserted[0];
    } catch (error) {
      markDbOffline(error);
    }
  }

  const nextId =
    memoryPatients.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  const newPat = {
    id: nextId,
    qrCodeToken,
    userUid: null,
    fullName: data.fullName.trim(),
    email: data.email?.trim() || null,
    phone: data.phone.trim(),
    age: data.age?.trim() || null,
    gender: data.gender?.trim() || null,
    mizaj: data.mizaj?.trim() || 'Balanced / Under Assessment',
    medicalHistory:
      data.medicalHistory?.trim() || 'Initial clinical intake registered.',
    currentProtocols:
      data.currentProtocols?.trim() || 'Pending Practitioner Assessment',
    totalVisits: 0,
    lastVisitAt: null,
    createdAt: new Date(),
  };
  memoryPatients.unshift(newPat);
  return newPat;
}

export async function checkInPatientTriage(data: {
  patientId?: number;
  qrCodeToken?: string;
  practitionerName?: string;
  visitType?: string;
  consultationFee?: number;
  notes?: string;
}) {
  const fee = Number(data.consultationFee ?? 140);
  const practitioner = data.practitionerName || 'Dr. Hafizullah Safi';
  const visitType = data.visitType || 'QR Triage In-Clinic Arrival';

  if (isDbOnline()) {
    try {
      let patientRow;
      if (data.patientId) {
        const rows = await db
          .select()
          .from(patients)
          .where(eq(patients.id, data.patientId))
          .limit(1);
        patientRow = rows[0];
      } else if (data.qrCodeToken) {
        const cleanToken = data.qrCodeToken.trim().toUpperCase();
        const rows = await db
          .select()
          .from(patients)
          .where(eq(patients.qrCodeToken, cleanToken))
          .limit(1);
        patientRow = rows[0];
      }

      if (!patientRow) throw new Error('Patient QR profile not found');

      const visitInserted = await db
        .insert(patientVisits)
        .values({
          patientId: patientRow.id,
          practitionerName: practitioner,
          visitType,
          consultationFee: fee,
          notes: data.notes || 'Instant QR arrival logged at reception desk.',
        })
        .returning();

      const updatedPatientRows = await db
        .update(patients)
        .set({
          totalVisits: (patientRow.totalVisits || 0) + 1,
          lastVisitAt: new Date(),
        })
        .where(eq(patients.id, patientRow.id))
        .returning();

      let ledgerEntry = null;
      if (fee > 0) {
        ledgerEntry = await recordAutomatedTransaction({
          referenceNumber: `TX-TRIAGE-${Date.now().toString().slice(-6)}`,
          type: 'consultation',
          patientId: patientRow.id,
          patientName: patientRow.fullName,
          description: `${visitType} (${practitioner})`,
          grossAmount: fee,
          cogsAmount: 0,
          paymentMethod: 'Clinic Reception Desk',
        });
      }

      return {
        patient: updatedPatientRows[0],
        visit: visitInserted[0],
        ledgerEntry,
      };
    } catch (error: any) {
      if (error?.message === 'Patient QR profile not found') throw error;
      markDbOffline(error);
    }
  }

  const patient = memoryPatients.find(
    (p) =>
      (data.patientId && p.id === data.patientId) ||
      (data.qrCodeToken &&
        p.qrCodeToken.toUpperCase() === data.qrCodeToken.trim().toUpperCase())
  );
  if (!patient) throw new Error('Patient QR profile not found');

  patient.totalVisits = (patient.totalVisits || 0) + 1;
  patient.lastVisitAt = new Date();

  const visit = {
    id: memoryVisits.length + 1,
    patientId: patient.id,
    practitionerName: practitioner,
    visitType,
    consultationFee: fee,
    notes: data.notes || 'Instant QR arrival logged at reception desk.',
    checkedInAt: new Date(),
  };
  memoryVisits.unshift(visit);

  let ledgerEntry = null;
  if (fee > 0) {
    ledgerEntry = await recordAutomatedTransaction({
      referenceNumber: `TX-TRIAGE-${Date.now().toString().slice(-6)}`,
      type: 'consultation',
      patientId: patient.id,
      patientName: patient.fullName,
      description: `${visitType} (${practitioner})`,
      grossAmount: fee,
      cogsAmount: 0,
      paymentMethod: 'Clinic Reception Desk',
    });
  }

  return { patient, visit, ledgerEntry };
}

// ============================================================================
// TRANSACTIONS, ANALYTICS & POS CHECKOUT
// ============================================================================

export async function getAllTransactions() {
  await ensureSeededPatientsAndLedger();

  if (isDbOnline()) {
    try {
      return await db
        .select()
        .from(transactions)
        .orderBy(desc(transactions.createdAt));
    } catch (error) {
      markDbOffline(error);
    }
  }

  return [...memoryTransactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function recordAutomatedTransaction(input: {
  referenceNumber: string;
  type: 'consultation' | 'pharmacy_sale' | 'expense';
  patientId?: number | null;
  patientName?: string | null;
  description: string;
  grossAmount: number;
  cogsAmount: number;
  paymentMethod?: string;
  itemsJson?: string;
  createdByUid?: string;
}) {
  const settings = await getOrSeedClinicSettings();
  const { overheadAmount, netAmount } = calculateTransactionNet(
    input.grossAmount,
    input.cogsAmount,
    settings.overheadPercentage
  );

  if (isDbOnline()) {
    try {
      const inserted = await db
        .insert(transactions)
        .values({
          referenceNumber: input.referenceNumber,
          type: input.type,
          patientId: input.patientId || null,
          patientName: input.patientName || null,
          description: input.description,
          grossAmount: Math.round(input.grossAmount * 100) / 100,
          cogsAmount: Math.round(input.cogsAmount * 100) / 100,
          overheadAmount,
          netAmount,
          paymentMethod: input.paymentMethod || 'Clinic Desk',
          itemsJson: input.itemsJson || null,
          createdByUid: input.createdByUid || null,
        })
        .returning();

      await postClinicTransactionToMoaLedger({
        sourceRef: input.referenceNumber,
        type: input.type,
        description: input.description,
        patientName: input.patientName,
        grossAmount: Number(input.grossAmount) || 0,
        cogsAmount: Number(input.cogsAmount) || 0,
        paymentMethod: input.paymentMethod,
      });

      return inserted[0];
    } catch (error) {
      markDbOffline(error);
    }
  }

  const tx = {
    id: memoryTransactions.length + 1,
    referenceNumber: input.referenceNumber,
    type: input.type,
    patientId: input.patientId ?? null,
    patientName: input.patientName ?? null,
    description: input.description,
    grossAmount: Math.round(input.grossAmount * 100) / 100,
    cogsAmount: Math.round(input.cogsAmount * 100) / 100,
    overheadAmount,
    netAmount,
    paymentMethod: input.paymentMethod || 'Clinic Desk',
    itemsJson: input.itemsJson ?? null,
    createdByUid: input.createdByUid ?? null,
    createdAt: new Date(),
  };
  memoryTransactions.unshift(tx);

  await postClinicTransactionToMoaLedger({
    sourceRef: input.referenceNumber,
    type: input.type,
    description: input.description,
    patientName: input.patientName,
    grossAmount: Number(input.grossAmount) || 0,
    cogsAmount: Number(input.cogsAmount) || 0,
    paymentMethod: input.paymentMethod,
  });

  return tx;
}

export async function processPharmacyCheckoutAndLedger(data: {
  referenceNumber: string;
  patientId?: number | null;
  patientName?: string;
  paymentMethod?: string;
  items: Array<{
    productId?: string;
    medicineId?: number;
    name?: string;
    quantity: number;
  }>;
  totalOverride?: number;
  createdByUid?: string;
}) {
  const settings = await getOrSeedClinicSettings();
  await ensureSeededMedicines();

  if (isDbOnline()) {
    try {
      const txResult = await db.transaction(async (tx) => {
        let computedGross = 0;
        let computedCogs = 0;
        const processedItems: Array<{
          medicineId: number;
          productId: string;
          name: string;
          quantity: number;
          unitPrice: number;
          newStock: number;
        }> = [];
        const triggeredAlerts: Array<{
          medicineName: string;
          remainingStock: number;
          threshold: number;
        }> = [];

        for (const item of data.items) {
          const qty = Math.max(1, Number(item.quantity) || 1);
          let medRow;

          if (item.medicineId) {
            const rows = await tx
              .select()
              .from(medicines)
              .where(eq(medicines.id, item.medicineId))
              .limit(1);
            medRow = rows[0];
          } else if (item.productId) {
            const rows = await tx
              .select()
              .from(medicines)
              .where(eq(medicines.productId, item.productId))
              .limit(1);
            medRow = rows[0];
          }

          if (!medRow) continue;

          computedGross += medRow.unitPrice * qty;
          computedCogs += medRow.cogsPrice * qty;

          const updatedStock = Math.max(0, medRow.stockQuantity - qty);
          const newStatus = classifyInventoryStatus(
            updatedStock,
            settings.lowStockThreshold
          );

          await tx
            .update(medicines)
            .set({
              stockQuantity: updatedStock,
              status: newStatus,
              updatedAt: new Date(),
            })
            .where(eq(medicines.id, medRow.id));

          if (updatedStock < settings.lowStockThreshold) {
            await tx.insert(inventoryAlerts).values({
              medicineId: medRow.id,
              medicineName: medRow.name,
              remainingStock: updatedStock,
              threshold: settings.lowStockThreshold,
              alertStatus:
                updatedStock <= 0 ? 'Critical Outage' : 'Pending Restock',
              dispatchedToEmail: settings.ownerAlertEmail,
            });
            triggeredAlerts.push({
              medicineName: medRow.name,
              remainingStock: updatedStock,
              threshold: settings.lowStockThreshold,
            });
          }

          processedItems.push({
            medicineId: medRow.id,
            productId: medRow.productId,
            name: medRow.name,
            quantity: qty,
            unitPrice: medRow.unitPrice,
            newStock: updatedStock,
          });
        }

        const finalGross =
          data.totalOverride && data.totalOverride > 0
            ? data.totalOverride
            : Math.round(computedGross * 1.05 * 100) / 100;

        const { overheadAmount, netAmount } = calculateTransactionNet(
          finalGross,
          computedCogs,
          settings.overheadPercentage
        );

        const itemSummary = processedItems
          .map((i) => `${i.name} x${i.quantity}`)
          .join(', ');
        const ledgerRows = await tx
          .insert(transactions)
          .values({
            referenceNumber: data.referenceNumber,
            type: 'pharmacy_sale',
            patientId: data.patientId || null,
            patientName: data.patientName || 'Walk-In Dispensary Patient',
            description: `Pharmacy POS Sale: ${itemSummary || 'Herbal Remedies'}`,
            grossAmount: Math.round(finalGross * 100) / 100,
            cogsAmount: Math.round(computedCogs * 100) / 100,
            overheadAmount,
            netAmount,
            paymentMethod: data.paymentMethod || 'POS Terminal',
            itemsJson: JSON.stringify(processedItems),
            createdByUid: data.createdByUid || null,
          })
          .returning();

        return {
          transaction: ledgerRows[0],
          processedItems,
          triggeredAlerts,
          meta: {
            finalGross: Math.round(finalGross * 100) / 100,
            computedCogs: Math.round(computedCogs * 100) / 100,
            itemSummary,
          },
        };
      });

      await postClinicTransactionToMoaLedger({
        sourceRef: data.referenceNumber,
        type: 'pharmacy_sale',
        description: `Pharmacy POS Sale: ${txResult.meta.itemSummary || 'Herbal Remedies'}`,
        patientName: data.patientName || 'Walk-In Dispensary Patient',
        grossAmount: txResult.meta.finalGross,
        cogsAmount: txResult.meta.computedCogs,
        paymentMethod: data.paymentMethod || 'POS Terminal',
      });

      return {
        transaction: txResult.transaction,
        processedItems: txResult.processedItems,
        triggeredAlerts: txResult.triggeredAlerts,
      };
    } catch (error) {
      markDbOffline(error);
    }
  }

  let computedGross = 0;
  let computedCogs = 0;
  const processedItems: Array<{
    medicineId: number;
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    newStock: number;
  }> = [];
  const triggeredAlerts: Array<{
    medicineName: string;
    remainingStock: number;
    threshold: number;
  }> = [];

  for (const item of data.items) {
    const qty = Math.max(1, Number(item.quantity) || 1);
    const medRow = memoryMedicines.find(
      (m) =>
        (item.medicineId && m.id === item.medicineId) ||
        (item.productId && m.productId === item.productId)
    );
    if (!medRow) continue;

    computedGross += medRow.unitPrice * qty;
    computedCogs += medRow.cogsPrice * qty;

    const updatedStock = Math.max(0, medRow.stockQuantity - qty);
    medRow.stockQuantity = updatedStock;
    medRow.status = classifyInventoryStatus(
      updatedStock,
      settings.lowStockThreshold
    );
    medRow.updatedAt = new Date();

    if (updatedStock < settings.lowStockThreshold) {
      memoryAlerts.unshift({
        id: memoryAlerts.length + 1,
        medicineId: medRow.id,
        medicineName: medRow.name,
        remainingStock: updatedStock,
        threshold: settings.lowStockThreshold,
        alertStatus:
          updatedStock <= 0 ? 'Critical Outage' : 'Pending Restock',
        dispatchedToEmail: settings.ownerAlertEmail,
        createdAt: new Date(),
      });
      triggeredAlerts.push({
        medicineName: medRow.name,
        remainingStock: updatedStock,
        threshold: settings.lowStockThreshold,
      });
    }

    processedItems.push({
      medicineId: medRow.id,
      productId: medRow.productId,
      name: medRow.name,
      quantity: qty,
      unitPrice: medRow.unitPrice,
      newStock: updatedStock,
    });
  }

  const finalGross =
    data.totalOverride && data.totalOverride > 0
      ? data.totalOverride
      : Math.round(computedGross * 1.05 * 100) / 100;

  const itemSummary = processedItems
    .map((i) => `${i.name} x${i.quantity}`)
    .join(', ');

  const txRecord = await recordAutomatedTransaction({
    referenceNumber: data.referenceNumber,
    type: 'pharmacy_sale',
    patientId: data.patientId || null,
    patientName: data.patientName || 'Walk-In Dispensary Patient',
    description: `Pharmacy POS Sale: ${itemSummary || 'Herbal Remedies'}`,
    grossAmount: finalGross,
    cogsAmount: computedCogs,
    paymentMethod: data.paymentMethod || 'POS Terminal',
    itemsJson: JSON.stringify(processedItems),
    createdByUid: data.createdByUid,
  });

  return {
    transaction: txRecord,
    processedItems,
    triggeredAlerts,
  };
}

// ============================================================================
// APPOINTMENTS, ORDERS & HERBAL PROTOCOLS
// ============================================================================

export async function createAppointment(data: {
  referenceNumber: string;
  userUid?: string;
  serviceId: string;
  serviceTitle: string;
  practitionerId: string;
  practitionerName: string;
  date: string;
  timeSlot: string;
  consultationType: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge?: string;
  healthConcerns?: string;
  totalFee: number;
}) {
  if (isDbOnline()) {
    try {
      let userId: number | undefined;
      if (data.userUid) {
        const userList = await db
          .select()
          .from(users)
          .where(eq(users.uid, data.userUid))
          .limit(1);
        if (userList.length > 0) userId = userList[0].id;
      }

      const result = await db
        .insert(appointments)
        .values({
          referenceNumber: data.referenceNumber,
          userId: userId || null,
          userUid: data.userUid || null,
          serviceId: data.serviceId,
          serviceTitle: data.serviceTitle,
          practitionerId: data.practitionerId,
          practitionerName: data.practitionerName,
          date: data.date,
          timeSlot: data.timeSlot,
          consultationType: data.consultationType,
          patientName: data.patientName,
          patientEmail: data.patientEmail,
          patientPhone: data.patientPhone,
          patientAge: data.patientAge || null,
          healthConcerns: data.healthConcerns || null,
          totalFee: data.totalFee,
          status: 'Confirmed',
        })
        .returning();

      await recordAutomatedTransaction({
        referenceNumber: `TX-${data.referenceNumber}`,
        type: 'consultation',
        patientName: data.patientName,
        description: `${data.serviceTitle} · ${data.practitionerName}`,
        grossAmount: Number(data.totalFee) || 0,
        cogsAmount: 0,
        paymentMethod: data.consultationType,
        createdByUid: data.userUid,
      });

      return result[0];
    } catch (error) {
      markDbOffline(error);
    }
  }

  const appt = {
    id: memoryAppointments.length + 1,
    userId: null,
    ...data,
    patientAge: data.patientAge || null,
    healthConcerns: data.healthConcerns || null,
    status: 'Confirmed',
    createdAt: new Date(),
  };
  memoryAppointments.unshift(appt);

  await recordAutomatedTransaction({
    referenceNumber: `TX-${data.referenceNumber}`,
    type: 'consultation',
    patientName: data.patientName,
    description: `${data.serviceTitle} · ${data.practitionerName}`,
    grossAmount: Number(data.totalFee) || 0,
    cogsAmount: 0,
    paymentMethod: data.consultationType,
    createdByUid: data.userUid,
  });

  return appt;
}

export async function getUserAppointments(userUid: string) {
  if (isDbOnline()) {
    try {
      return await db
        .select()
        .from(appointments)
        .where(eq(appointments.userUid, userUid))
        .orderBy(desc(appointments.createdAt));
    } catch (error) {
      markDbOffline(error);
    }
  }

  return memoryAppointments.filter((a) => a.userUid === userUid);
}

export async function findAppointmentByRefOrPhone(query: string) {
  const clean = query.trim().toLowerCase();

  if (isDbOnline()) {
    try {
      const all = await db
        .select()
        .from(appointments)
        .orderBy(desc(appointments.createdAt));
      return all.filter(
        (a) =>
          a.referenceNumber.toLowerCase() === clean ||
          a.patientPhone.includes(clean) ||
          a.patientEmail.toLowerCase() === clean
      );
    } catch (error) {
      markDbOffline(error);
    }
  }

  return memoryAppointments.filter(
    (a) =>
      a.referenceNumber.toLowerCase() === clean ||
      a.patientPhone.includes(clean) ||
      a.patientEmail.toLowerCase() === clean
  );
}

export async function createOrder(data: {
  referenceNumber: string;
  userUid?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  country: string;
  itemsJson: string;
  subtotal: number;
  total: number;
}) {
  if (isDbOnline()) {
    try {
      let userId: number | undefined;
      if (data.userUid) {
        const userList = await db
          .select()
          .from(users)
          .where(eq(users.uid, data.userUid))
          .limit(1);
        if (userList.length > 0) userId = userList[0].id;
      }

      const result = await db
        .insert(orders)
        .values({
          referenceNumber: data.referenceNumber,
          userId: userId || null,
          userUid: data.userUid || null,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          shippingAddress: data.shippingAddress,
          city: data.city,
          country: data.country,
          itemsJson: data.itemsJson,
          subtotal: data.subtotal,
          total: data.total,
          status: 'Pending Dispensation',
        })
        .returning();

      try {
        const parsedItems = JSON.parse(data.itemsJson || '[]');
        if (Array.isArray(parsedItems) && parsedItems.length > 0) {
          await processPharmacyCheckoutAndLedger({
            referenceNumber: `TX-${data.referenceNumber}`,
            patientName: data.customerName,
            paymentMethod: 'Online Dispensary',
            items: parsedItems.map((i: any) => ({
              productId: i.id,
              name: i.name,
              quantity: Number(i.quantity) || 1,
            })),
            totalOverride: Number(data.total) || undefined,
            createdByUid: data.userUid,
          });
        }
      } catch {
        // Ignore ledger sync issues for guest orders
      }

      return result[0];
    } catch (error) {
      markDbOffline(error);
    }
  }

  const order = {
    id: memoryOrders.length + 1,
    userId: null,
    ...data,
    status: 'Pending Dispensation',
    createdAt: new Date(),
  };
  memoryOrders.unshift(order);

  try {
    const parsedItems = JSON.parse(data.itemsJson || '[]');
    if (Array.isArray(parsedItems) && parsedItems.length > 0) {
      await processPharmacyCheckoutAndLedger({
        referenceNumber: `TX-${data.referenceNumber}`,
        patientName: data.customerName,
        paymentMethod: 'Online Dispensary',
        items: parsedItems.map((i: any) => ({
          productId: i.id,
          name: i.name,
          quantity: Number(i.quantity) || 1,
        })),
        totalOverride: Number(data.total) || undefined,
        createdByUid: data.userUid,
      });
    }
  } catch {
    // Ignore parse issues
  }

  return order;
}

export async function getUserOrders(userUid: string) {
  if (isDbOnline()) {
    try {
      return await db
        .select()
        .from(orders)
        .where(eq(orders.userUid, userUid))
        .orderBy(desc(orders.createdAt));
    } catch (error) {
      markDbOffline(error);
    }
  }

  return memoryOrders.filter((o) => o.userUid === userUid);
}

export async function createProtocol(data: {
  userUid: string;
  protocolName: string;
  prescribingDoctor: string;
  mizajTarget: string;
  primaryHerbs: string;
  formulation: string;
  dosageSchedule: string;
  instructions: string;
  dietaryAdvice?: string;
  contraindications?: string;
  status?: string;
  durationWeeks?: number;
  adherenceRate?: number;
}) {
  if (isDbOnline()) {
    try {
      let userId: number | undefined;
      const userList = await db
        .select()
        .from(users)
        .where(eq(users.uid, data.userUid))
        .limit(1);
      if (userList.length > 0) userId = userList[0].id;

      const result = await db
        .insert(protocols)
        .values({
          userId: userId || null,
          userUid: data.userUid,
          protocolName: data.protocolName,
          prescribingDoctor: data.prescribingDoctor,
          mizajTarget: data.mizajTarget,
          primaryHerbs: data.primaryHerbs,
          formulation: data.formulation,
          dosageSchedule: data.dosageSchedule,
          instructions: data.instructions,
          dietaryAdvice: data.dietaryAdvice || null,
          contraindications: data.contraindications || null,
          status: data.status || 'Active',
          durationWeeks: data.durationWeeks || 4,
          adherenceRate: data.adherenceRate || 100,
        })
        .returning();

      return result[0];
    } catch (error) {
      markDbOffline(error);
    }
  }

  const proto = {
    id: memoryProtocols.length + 1,
    userId: null,
    ...data,
    dietaryAdvice: data.dietaryAdvice || null,
    contraindications: data.contraindications || null,
    status: data.status || 'Active',
    durationWeeks: data.durationWeeks || 4,
    adherenceRate: data.adherenceRate || 100,
    createdAt: new Date(),
  };
  memoryProtocols.unshift(proto);
  return proto;
}

export async function getUserProtocols(userUid: string) {
  if (isDbOnline()) {
    try {
      return await db
        .select()
        .from(protocols)
        .where(eq(protocols.userUid, userUid))
        .orderBy(desc(protocols.createdAt));
    } catch (error) {
      markDbOffline(error);
    }
  }

  return memoryProtocols.filter((p) => p.userUid === userUid);
}

export async function updateProtocolAdherence(
  id: number,
  userUid: string,
  adherenceRate: number,
  status?: string
) {
  if (isDbOnline()) {
    try {
      const updateValues: Record<string, any> = { adherenceRate };
      if (status) updateValues.status = status;

      const result = await db
        .update(protocols)
        .set(updateValues)
        .where(and(eq(protocols.id, id), eq(protocols.userUid, userUid)))
        .returning();

      return result[0];
    } catch (error) {
      markDbOffline(error);
    }
  }

  const proto = memoryProtocols.find(
    (p) => p.id === id && p.userUid === userUid
  );
  if (proto) {
    proto.adherenceRate = adherenceRate;
    if (status) proto.status = status;
  }
  return proto || { id, adherenceRate, status: status || 'Active' };
}

export async function seedInitialPatientProtocolsIfEmpty(
  userUid: string,
  _patientName?: string
) {
  const existing = await getUserProtocols(userUid);
  if (existing.length > 0) return existing;

  const p1 = await createProtocol({
    userUid,
    protocolName: 'Royal Black Seed & Honey Respiratory Shield',
    prescribingDoctor: 'Dr. Hafizullah Safi',
    mizajTarget: 'Warm & Moist (Dam) · Constitutional Metabolic Warmth',
    primaryHerbs:
      'Cold-Pressed Nigella Sativa (2.8% Thymoquinone), Raw Sidr Mountain Honey, Cardamom',
    formulation: 'Safi Royal Black Seed Elixir (100ml)',
    dosageSchedule:
      'Take 1 teaspoon (5ml) each morning on an empty stomach with 6 oz warm structured water',
    instructions:
      'Dilute in warm spring water with 1 tbsp raw honey. Continue for 40 consecutive days during seasonal shifts to clear bronchial airways and elevate cellular immunity.',
    dietaryAdvice:
      'Favor warming spices (cinnamon, ginger, cloves). Avoid icy drinks and cold dairy.',
    contraindications:
      'Do not boil or cook the oil. Safe for long-term respiratory tonification.',
    status: 'Active',
    durationWeeks: 6,
    adherenceRate: 95,
  });

  const p2 = await createProtocol({
    userUid,
    protocolName: 'Enteric Mucilage & Gastric Restoration',
    prescribingDoctor: 'Dr. Hafizullah Safi',
    mizajTarget: 'Cooling & Hydrating · Calming Excess Heat (Safra)',
    primaryHerbs:
      'Marshmallow Root (Althaea), Egyptian Chamomile, Fennel Seed, DGL Licorice',
    formulation: 'FloraSoothe Botanical Loose-Leaf Infusion (120g tin)',
    dosageSchedule: '1 cup lukewarm infusion 20 minutes before lunch and evening meal',
    instructions:
      'Steep 1 tbsp in 8 oz freshly boiled water covered for 12 minutes. High mucilage coats esophageal lining and relieves post-meal burning and bloating.',
    dietaryAdvice:
      'Avoid deep-fried foods and synthetic vinegar. Consume gentle steamed vegetables and bone broth.',
    contraindications:
      'Take 1 hour away from pharmaceutical medications to prevent absorption delay.',
    status: 'Active',
    durationWeeks: 4,
    adherenceRate: 100,
  });

  return [p1, p2];
}
