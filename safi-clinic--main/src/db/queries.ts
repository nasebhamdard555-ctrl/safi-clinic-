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
    console.error('Failed to get or create user:', error);
    throw new Error('Database operation failed. Please try again.', { cause: error });
  }
}

export async function getOrSeedClinicSettings() {
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
}

export async function ensureSeededMedicines() {
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
}

export async function ensureSeededPatientsAndLedger() {
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
        {
          qrCodeToken: 'SNC-PAT-39172',
          fullName: 'Mirwais Rahimi',
          email: 'mirwais.r@mazar.af',
          phone: '+93 786 901 234',
          age: '44',
          gender: 'Male',
          mizaj: 'Hot & Moist (Damawi)',
          medicalHistory: 'Cervical tension migraines, elevated work fatigue.',
          currentProtocols: 'Hijama Cupping Follow-up + Safi Royal Black Seed Elixir',
          totalVisits: 2,
          lastVisitAt: threeDaysAgo,
        },
        {
          qrCodeToken: 'SNC-PAT-67431',
          fullName: 'Fatima Al-Zahra',
          email: 'fatima.z@kabul.af',
          phone: '+93 771 552 890',
          age: '31',
          gender: 'Female',
          mizaj: 'Cold & Dry (Sawdawi)',
          medicalHistory: 'Chronic skin barrier dryness & eczema flare recovery.',
          currentProtocols: 'Herbal Dermatology Protocol + Neem Restorative Salve',
          totalVisits: 5,
          lastVisitAt: yesterday,
        },
      ])
      .returning();
  }

  const existingTx = await db.select().from(transactions).orderBy(desc(transactions.createdAt));
  if (existingTx.length === 0) {
    const now = new Date();
    const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000);
    const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

    const p0 = patientList[0];
    const p1 = patientList[1];
    const p2 = patientList[2];
    const p3 = patientList[3];

    const seedEntries = [
      {
        referenceNumber: 'TX-CLINIC-1001',
        type: 'consultation',
        patientId: p0?.id || null,
        patientName: p0?.fullName || 'Hajji Ahmadullah Stanikzai',
        description: 'Chronic Pain, Joints & Arthritis Therapy (Dr. Hafizullah Safi)',
        grossAmount: 130,
        cogsAmount: 0,
        overheadAmount: 19.5,
        netAmount: 110.5,
        paymentMethod: 'Cash / Clinic Desk',
        createdAt: hoursAgo(2),
      },
      {
        referenceNumber: 'TX-POS-1002',
        type: 'pharmacy_sale',
        patientId: p0?.id || null,
        patientName: p0?.fullName || 'Hajji Ahmadullah Stanikzai',
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
        createdAt: hoursAgo(1),
      },
      {
        referenceNumber: 'TX-CLINIC-1003',
        type: 'consultation',
        patientId: p1?.id || null,
        patientName: p1?.fullName || 'Soraya Karimi',
        description: 'Hormonal & Reproductive Health Support (Dr. Hafizullah Safi)',
        grossAmount: 145,
        cogsAmount: 0,
        overheadAmount: 21.75,
        netAmount: 123.25,
        paymentMethod: 'Bank Transfer / Clinic Desk',
        createdAt: daysAgo(1),
      },
      {
        referenceNumber: 'TX-POS-1004',
        type: 'pharmacy_sale',
        patientId: p1?.id || null,
        patientName: p1?.fullName || 'Soraya Karimi',
        description: 'POS Dispensary Sale: KSM-66 & Saffron Tonic x1, FloraSoothe Tea x2',
        grossAmount: 96,
        cogsAmount: 33,
        overheadAmount: 14.4,
        netAmount: 48.6,
        paymentMethod: 'Cash / POS Terminal',
        createdAt: daysAgo(2),
      },
      {
        referenceNumber: 'TX-CLINIC-1005',
        type: 'consultation',
        patientId: p2?.id || null,
        patientName: p2?.fullName || 'Mirwais Rahimi',
        description: 'Hijama (Wet Cupping) & Traditional Acupuncture (Dr. Hafizullah Safi)',
        grossAmount: 150,
        cogsAmount: 8,
        overheadAmount: 22.5,
        netAmount: 119.5,
        paymentMethod: 'Cash / Clinic Desk',
        createdAt: daysAgo(4),
      },
      {
        referenceNumber: 'TX-POS-1006',
        type: 'pharmacy_sale',
        patientId: p3?.id || null,
        patientName: p3?.fullName || 'Fatima Al-Zahra',
        description: 'Online Dispensary: Pure Himalayan Shilajit Gold Resin x2',
        grossAmount: 116,
        cogsAmount: 44,
        overheadAmount: 17.4,
        netAmount: 54.6,
        paymentMethod: 'Online Dispensary',
        createdAt: daysAgo(6),
      },
      {
        referenceNumber: 'TX-CLINIC-1007',
        type: 'consultation',
        patientId: p3?.id || null,
        patientName: p3?.fullName || 'Fatima Al-Zahra',
        description: 'Therapeutic Skin & Hair Care Consultation (Safi Clinical Care Team)',
        grossAmount: 120,
        cogsAmount: 0,
        overheadAmount: 18,
        netAmount: 102,
        paymentMethod: 'Cash / Clinic Desk',
        createdAt: daysAgo(12),
      },
      {
        referenceNumber: 'TX-POS-1008',
        type: 'pharmacy_sale',
        patientId: p2?.id || null,
        patientName: p2?.fullName || 'Mirwais Rahimi',
        description: 'POS Dispensary Sale: Broncho-Vital Elixir x3, Somna-Calm Drops x1',
        grossAmount: 125,
        cogsAmount: 43,
        overheadAmount: 18.75,
        netAmount: 63.25,
        paymentMethod: 'Cash / POS Terminal',
        createdAt: daysAgo(19),
      },
    ];

    await db.insert(transactions).values(seedEntries);
  }

  return patientList;
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

  // Mirror automatically to Microsoft Office Accounting 2009 General Ledger
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
  const settings = await getOrSeedClinicSettings();
  await ensureSeededMedicines();

  return await db.transaction(async (tx) => {
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
    const triggeredAlerts: Array<{ medicineName: string; remainingStock: number; threshold: number }> = [];

    for (const item of data.items) {
      const qty = Math.max(1, Number(item.quantity) || 1);
      let medRow;

      if (item.medicineId) {
        const rows = await tx.select().from(medicines).where(eq(medicines.id, item.medicineId)).limit(1);
        medRow = rows[0];
      } else if (item.productId) {
        const rows = await tx.select().from(medicines).where(eq(medicines.productId, item.productId)).limit(1);
        medRow = rows[0];
      }

      if (!medRow) continue;

      computedGross += medRow.unitPrice * qty;
      computedCogs += medRow.cogsPrice * qty;

      const updatedStock = Math.max(0, medRow.stockQuantity - qty);
      const newStatus = classifyInventoryStatus(updatedStock, settings.lowStockThreshold);

      await tx
        .update(medicines)
        .set({
          stockQuantity: updatedStock,
          status: newStatus,
          updatedAt: new Date(),
        })
        .where(eq(medicines.id, medRow.id));

      // Proactive Low-Stock Trigger if crossing below threshold
      if (updatedStock < settings.lowStockThreshold) {
        await tx.insert(inventoryAlerts).values({
          medicineId: medRow.id,
          medicineName: medRow.name,
          remainingStock: updatedStock,
          threshold: settings.lowStockThreshold,
          alertStatus: updatedStock <= 0 ? 'Critical Outage' : 'Pending Restock',
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
        : Math.round(computedGross * 1.05 * 100) / 100; // includes 5% tax if POS default

    const { overheadAmount, netAmount } = calculateTransactionNet(
      finalGross,
      computedCogs,
      settings.overheadPercentage
    );

    const itemSummary = processedItems.map((i) => `${i.name} x${i.quantity}`).join(', ');
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

    const txRecord = ledgerRows[0];

    return {
      transaction: txRecord,
      processedItems,
      triggeredAlerts,
      meta: {
        finalGross: Math.round(finalGross * 100) / 100,
        computedCogs: Math.round(computedCogs * 100) / 100,
        itemSummary,
      },
    };
  }).then(async (txResult) => {
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
  });
}

export async function restockMedicine(medicineId: number, addQuantity: number) {
  const settings = await getOrSeedClinicSettings();
  const rows = await db.select().from(medicines).where(eq(medicines.id, medicineId)).limit(1);
  if (rows.length === 0) throw new Error('Medicine not found');

  const med = rows[0];
  const nextQty = Math.max(0, med.stockQuantity + Math.max(1, addQuantity));
  const nextStatus = classifyInventoryStatus(nextQty, settings.lowStockThreshold);

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
      medicalHistory: data.medicalHistory?.trim() || 'Initial clinical intake registered.',
      currentProtocols: data.currentProtocols?.trim() || 'Pending Practitioner Assessment',
      totalVisits: 0,
    })
    .returning();

  return inserted[0];
}

export async function checkInPatientTriage(data: {
  patientId?: number;
  qrCodeToken?: string;
  practitionerName?: string;
  visitType?: string;
  consultationFee?: number;
  notes?: string;
}) {
  let patientRow;
  if (data.patientId) {
    const rows = await db.select().from(patients).where(eq(patients.id, data.patientId)).limit(1);
    patientRow = rows[0];
  } else if (data.qrCodeToken) {
    const cleanToken = data.qrCodeToken.trim().toUpperCase();
    const rows = await db.select().from(patients).where(eq(patients.qrCodeToken, cleanToken)).limit(1);
    patientRow = rows[0];
  }

  if (!patientRow) throw new Error('Patient QR profile not found');

  const fee = Number(data.consultationFee ?? 140);
  const practitioner = data.practitionerName || 'Dr. Hafizullah Safi';
  const visitType = data.visitType || 'QR Triage In-Clinic Arrival';

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

  // Automated Ledger Entry for today's consultation check-in
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
}

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
  try {
    let userId: number | undefined;
    if (data.userUid) {
      const userList = await db.select().from(users).where(eq(users.uid, data.userUid)).limit(1);
      if (userList.length > 0) {
        userId = userList[0].id;
      }
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

    // Automatically log consultation revenue into the centralized Accounting Ledger
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
    console.error('Failed to save appointment in database:', error);
    throw new Error('Could not create appointment. Please try again.', { cause: error });
  }
}

export async function getUserAppointments(userUid: string) {
  try {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.userUid, userUid))
      .orderBy(desc(appointments.createdAt));
  } catch (error) {
    console.error('Failed to retrieve user appointments:', error);
    throw new Error('Failed to retrieve appointments.', { cause: error });
  }
}

export async function findAppointmentByRefOrPhone(query: string) {
  try {
    const clean = query.trim().toLowerCase();
    const all = await db.select().from(appointments).orderBy(desc(appointments.createdAt));
    return all.filter(
      (a) =>
        a.referenceNumber.toLowerCase() === clean ||
        a.patientPhone.includes(clean) ||
        a.patientEmail.toLowerCase() === clean
    );
  } catch (error) {
    console.error('Failed to search appointments:', error);
    throw new Error('Failed to search appointments.', { cause: error });
  }
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
  try {
    let userId: number | undefined;
    if (data.userUid) {
      const userList = await db.select().from(users).where(eq(users.uid, data.userUid)).limit(1);
      if (userList.length > 0) {
        userId = userList[0].id;
      }
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

    // Parse items and automatically decrement stock & log ledger sale
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
    } catch (ledgerErr) {
      console.warn('Order ledger sync warning:', ledgerErr);
    }

    return result[0];
  } catch (error) {
    console.error('Failed to save order in database:', error);
    throw new Error('Could not create order. Please try again.', { cause: error });
  }
}

export async function getUserOrders(userUid: string) {
  try {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userUid, userUid))
      .orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error('Failed to retrieve user orders:', error);
    throw new Error('Failed to retrieve orders.', { cause: error });
  }
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
  try {
    let userId: number | undefined;
    const userList = await db.select().from(users).where(eq(users.uid, data.userUid)).limit(1);
    if (userList.length > 0) {
      userId = userList[0].id;
    }

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
    console.error('Failed to create protocol:', error);
    throw new Error('Failed to create protocol.', { cause: error });
  }
}

export async function getUserProtocols(userUid: string) {
  try {
    return await db
      .select()
      .from(protocols)
      .where(eq(protocols.userUid, userUid))
      .orderBy(desc(protocols.createdAt));
  } catch (error) {
    console.error('Failed to retrieve user protocols:', error);
    throw new Error('Failed to retrieve protocols.', { cause: error });
  }
}

export async function updateProtocolAdherence(id: number, userUid: string, adherenceRate: number, status?: string) {
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
    console.error('Failed to update protocol adherence:', error);
    throw new Error('Failed to update protocol adherence.', { cause: error });
  }
}

export async function seedInitialPatientProtocolsIfEmpty(userUid: string, patientName?: string) {
  try {
    const existing = await getUserProtocols(userUid);
    if (existing.length > 0) {
      return existing;
    }

    const p1 = await createProtocol({
      userUid,
      protocolName: 'Royal Black Seed & Honey Respiratory Shield',
      prescribingDoctor: 'Dr. Hafizullah Safi',
      mizajTarget: 'Warm & Moist (Dam) · Constitutional Metabolic Warmth',
      primaryHerbs: 'Cold-Pressed Nigella Sativa (2.8% Thymoquinone), Raw Sidr Mountain Honey, Cardamom',
      formulation: 'Safi Royal Black Seed Elixir (100ml)',
      dosageSchedule: 'Take 1 teaspoon (5ml) each morning on an empty stomach with 6 oz warm structured water',
      instructions: 'Dilute in warm spring water with 1 tbsp raw honey. Continue for 40 consecutive days during seasonal shifts to clear bronchial airways and elevate cellular immunity.',
      dietaryAdvice: 'Favor warming spices (cinnamon, ginger, cloves). Avoid icy drinks and cold dairy.',
      contraindications: 'Do not boil or cook the oil. Safe for long-term respiratory tonification.',
      status: 'Active',
      durationWeeks: 6,
      adherenceRate: 95,
    });

    const p2 = await createProtocol({
      userUid,
      protocolName: 'Enteric Mucilage & Gastric Restoration',
      prescribingDoctor: 'Dr. Hafizullah Safi',
      mizajTarget: 'Cooling & Hydrating · Calming Excess Heat (Safra)',
      primaryHerbs: 'Marshmallow Root (Althaea), Egyptian Chamomile, Fennel Seed, DGL Licorice',
      formulation: 'FloraSoothe Botanical Loose-Leaf Infusion (120g tin)',
      dosageSchedule: '1 cup lukewarm infusion 20 minutes before lunch and evening meal',
      instructions: 'Steep 1 tbsp in 8 oz freshly boiled water covered for 12 minutes. High mucilage coats esophageal lining and relieves post-meal burning and bloating.',
      dietaryAdvice: 'Avoid deep-fried foods and synthetic vinegar. Consume gentle steamed vegetables and bone broth.',
      contraindications: 'Take 1 hour away from pharmaceutical medications to prevent absorption delay.',
      status: 'Active',
      durationWeeks: 4,
      adherenceRate: 100,
    });

    return [p1, p2];
  } catch (error) {
    console.error('Failed to seed initial patient protocols:', error);
    return [];
  }
}

