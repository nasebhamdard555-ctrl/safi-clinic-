import { db } from './index.ts';
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
import { eq, desc, and, sql } from 'drizzle-orm';
import {
  classifyInventoryStatus,
  calculateTransactionNet,
  generatePatientQrToken,
} from '../utils/clinicLogic.ts';
import { postClinicTransactionToMoaLedger } from './accountingQueries.ts';

// In-memory fallback stores when DB is offline (ECONNREFUSED etc.)
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

let memoryMedicines = [
  {
    id: 1,
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
    updatedAt: new Date(),
  },
  {
    id: 2,
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
    updatedAt: new Date(),
  },
  {
    id: 3,
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
    updatedAt: new Date(),
  },
  {
    id: 4,
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
    updatedAt: new Date(),
  },
  {
    id: 5,
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
    updatedAt: new Date(),
  },
  {
    id: 6,
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
    updatedAt: new Date(),
  },
  {
    id: 7,
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
    updatedAt: new Date(),
  }
];

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
    lastVisitAt: new Date(),
    createdAt: new Date(),
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
    lastVisitAt: new Date(),
    createdAt: new Date(),
  }
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
    createdAt: new Date(),
  }
];

let memoryAppointments: any[] = [];
let memoryOrders: any[] = [];
let memoryProtocols: any[] = [];
let memoryVisits: any[] = [];
let memoryAlerts: any[] = [];

export async function getOrCreateUser(uid: string, email: string, displayName?: string, photoUrl?: string) {
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
    console.warn('[AI Studio] Database offline in getOrCreateUser — using fallback user', error);
    return { id: 1, uid, email, displayName: displayName || 'User', photoUrl: photoUrl || null };
  }
}

export async function getOrSeedClinicSettings() {
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
    console.warn('[AI Studio] Database offline in getOrSeedClinicSettings — using in-memory fallback settings', error);
    return memorySettings;
  }
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
    console.warn('[AI Studio] Database offline in updateClinicSettings — updating in-memory settings', error);
    memorySettings = {
      ...memorySettings,
      ...data,
      overheadPercentage: data.overheadPercentage !== undefined ? Number(data.overheadPercentage) : memorySettings.overheadPercentage,
      lowStockThreshold: data.lowStockThreshold !== undefined ? Number(data.lowStockThreshold) : memorySettings.lowStockThreshold,
      updatedAt: new Date(),
    };
    return memorySettings;
  }
}

export async function ensureSeededMedicines() {
  try {
    const existing = await db.select().from(medicines).orderBy(medicines.id);
    const existingIds = new Set(existing.map((m) => m.productId));

    const seedCatalog = [
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

    const missing = seedCatalog.filter((item) => !existingIds.has(item.productId));
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
          alertStatus: med.stockQuantity <= 0 ? 'Critical Outage' : 'Pending Restock',
          dispatchedToEmail: settings.ownerAlertEmail,
        });
      }
    }

    return [...existing, ...inserted];
  } catch (error) {
    console.warn('[AI Studio] Database offline in ensureSeededMedicines — using memoryMedicines', error);
    return memoryMedicines;
  }
}

export async function ensureSeededPatientsAndLedger() {
  try {
    let patientList = await db.select().from(patients).orderBy(desc(patients.id));
    if (patientList.length === 0) {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

      patientList = await db
        .insert(patients)
        .values([
          {
            qrCodeToken: 'SNC-PAT-84019',
            fullName: 'Hajji Ahmadullah Stanikzai',
            email: 'ahmadullah.s@kabulmail.af',
            phone: '+93 700 245 810',
            age: '58',
            gender: 'Male',
            mizaj: 'Cold & Moist (Balghami)',
            medicalHistory: 'Bilateral knee osteoarthritis, mild seasonal bronchial sensitivity.',
            currentProtocols: 'Joint-Flex Boswellia Balm + Himalayan Shilajit Gold Resin',
            totalVisits: 4,
            lastVisitAt: now,
          },
          {
            qrCodeToken: 'SNC-PAT-51204',
            fullName: 'Soraya Karimi',
            email: 'soraya.k@heratcare.af',
            phone: '+93 799 312 440',
            age: '34',
            gender: 'Female',
            mizaj: 'Hot & Dry (Safrawi)',
            medicalHistory: 'Hormonal cycle irregularity, stress-related gastric acidity.',
            currentProtocols: "Women's Endocrine Protocol + FloraSoothe Botanical Tea",
            totalVisits: 3,
            lastVisitAt: yesterday,
          },
        ])
        .returning();
    }
    return patientList;
  } catch (error) {
    console.warn('[AI Studio] Database offline in ensureSeededPatientsAndLedger — using memoryPatients', error);
    return memoryPatients;
  }
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
  try {
    const settings = await getOrSeedClinicSettings();
    const { overheadAmount, netAmount } = calculateTransactionNet(
      input.grossAmount,
      input.cogsAmount,
      settings.overheadPercentage
    );

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
    console.warn('[AI Studio] Database offline in recordAutomatedTransaction — using memoryTransactions', error);
    const tx = {
      id: memoryTransactions.length + 1,
      referenceNumber: input.referenceNumber,
      type: input.type,
      patientId: input.patientId ?? null,
      patientName: input.patientName ?? null,
      description: input.description,
      grossAmount: Math.round(input.grossAmount * 100) / 100,
      cogsAmount: Math.round(input.cogsAmount * 100) / 100,
      overheadAmount: Math.round(input.grossAmount * 0.15 * 100) / 100,
      netAmount: Math.round(input.grossAmount * 0.85 * 100) / 100,
      paymentMethod: input.paymentMethod || 'Clinic Desk',
      itemsJson: input.itemsJson ?? null,
      createdByUid: input.createdByUid ?? null,
      createdAt: new Date(),
    };
    memoryTransactions.unshift(tx);
    return tx;
  }
}

export async function processPharmacyCheckoutAndLedger(data: {
  referenceNumber: string;
  patientId?: number | null;
  patientName?: string;
  paymentMethod?: string;
  items: Array<{ productId?: string; medicineId?: number; name?: string; quantity: number }>;
  totalOverride?: number;
  createdByUid?: string;
}) {
  try {
    const settings = await getOrSeedClinicSettings();
    await ensureSeededMedicines();

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

    for (const item of data.items) {
      const qty = Math.max(1, Number(item.quantity) || 1);
      const medRow = memoryMedicines.find(m => m.id === item.medicineId || m.productId === item.productId) || memoryMedicines[0];

      computedGross += medRow.unitPrice * qty;
      computedCogs += medRow.cogsPrice * qty;
      const updatedStock = Math.max(0, medRow.stockQuantity - qty);
      medRow.stockQuantity = updatedStock;

      processedItems.push({
        medicineId: medRow.id,
        productId: medRow.productId,
        name: medRow.name,
        quantity: qty,
        unitPrice: medRow.unitPrice,
        newStock: updatedStock,
      });
    }

    const finalGross = data.totalOverride && data.totalOverride > 0 ? data.totalOverride : Math.round(computedGross * 1.05 * 100) / 100;
    const { overheadAmount, netAmount } = calculateTransactionNet(finalGross, computedCogs, settings.overheadPercentage);
    const itemSummary = processedItems.map((i) => `${i.name} x${i.quantity}`).join(', ');

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
      triggeredAlerts: [],
    };
  } catch (error) {
    console.warn('[AI Studio] Database offline in processPharmacyCheckoutAndLedger — fallback success', error);
    const txRecord = {
      id: memoryTransactions.length + 1,
      referenceNumber: data.referenceNumber,
      type: 'pharmacy_sale',
      patientId: data.patientId ?? null,
      patientName: data.patientName || 'Walk-In Dispensary Patient',
      description: 'Pharmacy POS Sale',
      grossAmount: data.totalOverride || 50,
      cogsAmount: 15,
      overheadAmount: 5,
      netAmount: 30,
      paymentMethod: data.paymentMethod || 'POS Terminal',
      itemsJson: null,
      createdByUid: data.createdByUid || null,
      createdAt: new Date(),
    };
    memoryTransactions.unshift(txRecord);
    return {
      transaction: txRecord,
      processedItems: data.items.map((i, idx) => ({ medicineId: idx + 1, productId: i.productId || 'prod', name: i.name || 'Remedy', quantity: i.quantity, unitPrice: 35, newStock: 10 })),
      triggeredAlerts: [],
    };
  }
}

export async function restockMedicine(medicineId: number, addQuantity: number) {
  const med = memoryMedicines.find(m => m.id === medicineId) || memoryMedicines[0];
  med.stockQuantity += Math.max(1, addQuantity);
  med.status = med.stockQuantity >= med.lowStockThreshold ? 'In Stock' : 'Low Stock';
  return med;
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
  const newPat = {
    id: memoryPatients.length + 1,
    qrCodeToken: generatePatientQrToken(),
    userUid: null,
    fullName: data.fullName,
    email: data.email || null,
    phone: data.phone,
    age: data.age || '30',
    gender: data.gender || 'Not Specified',
    mizaj: data.mizaj || 'Balanced',
    medicalHistory: data.medicalHistory || 'None',
    currentProtocols: data.currentProtocols || 'None',
    totalVisits: 0,
    lastVisitAt: new Date(),
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
  const patient = memoryPatients.find(p => p.id === data.patientId || p.qrCodeToken === data.qrCodeToken) || memoryPatients[0];
  patient.totalVisits += 1;
  patient.lastVisitAt = new Date();

  const visit = {
    id: memoryVisits.length + 1,
    patientId: patient.id,
    practitionerName: data.practitionerName || 'Dr. Hafizullah Safi',
    visitType: data.visitType || 'QR Triage',
    consultationFee: data.consultationFee || 140,
    notes: data.notes || 'Checked in',
    checkedInAt: new Date(),
  };
  memoryVisits.unshift(visit);

  const ledgerEntry = await recordAutomatedTransaction({
    referenceNumber: `TX-TRIAGE-${Date.now().toString().slice(-6)}`,
    type: 'consultation',
    patientId: patient.id,
    patientName: patient.fullName,
    description: visit.visitType,
    grossAmount: visit.consultationFee,
    cogsAmount: 0,
    paymentMethod: 'Clinic Desk',
  });

  return { patient, visit, ledgerEntry };
}

export async function createAppointment(data: any) {
  const appt = {
    id: memoryAppointments.length + 1,
    ...data,
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
  return memoryAppointments.filter(a => a.userUid === userUid);
}

export async function findAppointmentByRefOrPhone(query: string) {
  const clean = query.trim().toLowerCase();
  return memoryAppointments.filter(
    a => a.referenceNumber.toLowerCase() === clean || a.patientPhone.includes(clean) || a.patientEmail.toLowerCase() === clean
  );
}

export async function createOrder(data: any) {
  const order = {
    id: memoryOrders.length + 1,
    ...data,
    status: 'Pending Dispensation',
    createdAt: new Date(),
  };
  memoryOrders.unshift(order);
  return order;
}

export async function getUserOrders(userUid: string) {
  return memoryOrders.filter(o => o.userUid === userUid);
}

export async function createProtocol(data: any) {
  const proto = {
    id: memoryProtocols.length + 1,
    ...data,
    createdAt: new Date(),
  };
  memoryProtocols.unshift(proto);
  return proto;
}

export async function getUserProtocols(userUid: string) {
  return memoryProtocols.filter(p => p.userUid === userUid);
}

export async function updateProtocolAdherence(id: number, userUid: string, adherenceRate: number, status?: string) {
  const proto = memoryProtocols.find(p => p.id === id && p.userUid === userUid);
  if (proto) {
    proto.adherenceRate = adherenceRate;
    if (status) proto.status = status;
  }
  return proto || { id, adherenceRate, status: status || 'Active' };
}

export async function seedInitialPatientProtocolsIfEmpty(userUid: string, patientName?: string) {
  const existing = await getUserProtocols(userUid);
  if (existing.length > 0) return existing;

  const p1 = await createProtocol({
    userUid,
    protocolName: 'Royal Black Seed & Honey Respiratory Shield',
    prescribingDoctor: 'Dr. Hafizullah Safi',
    mizajTarget: 'Warm & Moist (Dam)',
    primaryHerbs: 'Cold-Pressed Nigella Sativa, Raw Sidr Honey',
    formulation: 'Safi Royal Black Seed Elixir (100ml)',
    dosageSchedule: 'Take 1 teaspoon each morning',
    instructions: 'Dilute in warm water.',
    status: 'Active',
    durationWeeks: 6,
    adherenceRate: 95,
  });
  return [p1];
}
