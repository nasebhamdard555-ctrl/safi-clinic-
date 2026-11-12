import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { desc, eq } from 'drizzle-orm';
import { db } from './src/db/index.ts';
import {
  medicines,
  patients,
  patientVisits,
  transactions,
  inventoryAlerts,
} from './src/db/schema.ts';
import { requireAuth, optionalAuth, AuthRequest } from './src/middleware/auth.ts';
import {
  getOrCreateUser,
  createAppointment,
  getUserAppointments,
  findAppointmentByRefOrPhone,
  createOrder,
  getUserOrders,
  getUserProtocols,
  createProtocol,
  updateProtocolAdherence,
  seedInitialPatientProtocolsIfEmpty,
  getOrSeedClinicSettings,
  updateClinicSettings,
  ensureSeededMedicines,
  ensureSeededPatientsAndLedger,
  processPharmacyCheckoutAndLedger,
  restockMedicine,
  createPatientProfile,
  checkInPatientTriage,
} from './src/db/queries.ts';
import {
  AnalyticsPeriod,
  calculatePeriodFinancialSummary,
} from './src/utils/clinicLogic.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ============================================================================
// CLINICAL MANAGEMENT, POS PHARMACY, INVENTORY & ACCOUNTING API ROUTES
// ============================================================================

// A. Configurable Social Media & Clinic Overhead Settings
app.get('/api/settings/social', async (_req, res) => {
  try {
    const settings = await getOrSeedClinicSettings();
    res.json({ success: true, settings });
  } catch (err: any) {
    console.error('Error in GET /api/settings/social:', err);
    res.status(500).json({ error: err.message || 'Failed to load clinic settings' });
  }
});

app.put('/api/settings/social', async (req, res) => {
  try {
    const updated = await updateClinicSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    console.error('Error in PUT /api/settings/social:', err);
    res.status(500).json({ error: err.message || 'Failed to update clinic settings' });
  }
});

// B. Pharmacy Inventory & Smart Restock Alerts
app.get('/api/medicines', async (_req, res) => {
  try {
    const settings = await getOrSeedClinicSettings();
    const list = await ensureSeededMedicines();
    const alerts = await db
      .select()
      .from(inventoryAlerts)
      .orderBy(desc(inventoryAlerts.createdAt))
      .limit(20);
    res.json({
      success: true,
      medicines: list,
      lowStockItems: list.filter((m) => m.stockQuantity < settings.lowStockThreshold),
      alerts,
      threshold: settings.lowStockThreshold,
    });
  } catch (err: any) {
    console.error('Error in GET /api/medicines:', err);
    res.status(500).json({ error: err.message || 'Failed to load inventory' });
  }
});

app.post('/api/medicines/:id/restock', async (req, res) => {
  try {
    const medicineId = parseInt(req.params.id, 10);
    const quantity = Number(req.body.quantity) || 25;
    const updated = await restockMedicine(medicineId, quantity);
    res.json({ success: true, medicine: updated });
  } catch (err: any) {
    console.error('Error in POST /api/medicines/:id/restock:', err);
    res.status(500).json({ error: err.message || 'Failed to restock medicine' });
  }
});

app.post('/api/medicines/alerts/dispatch', async (_req, res) => {
  try {
    const settings = await getOrSeedClinicSettings();
    const list = await ensureSeededMedicines();
    const lowItems = list.filter((m) => m.stockQuantity < settings.lowStockThreshold);

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

    res.json({
      success: true,
      dispatchedTo: settings.ownerAlertEmail,
      alertCount: lowItems.length,
      items: lowItems.map((i) => ({ name: i.name, stock: i.stockQuantity })),
    });
  } catch (err: any) {
    console.error('Error in POST /api/medicines/alerts/dispatch:', err);
    res.status(500).json({ error: err.message || 'Failed to dispatch restock email alert' });
  }
});

// C. Point of Sale (POS) Checkout -> Atomic Stock Decrement + Automated Ledger Write
app.post('/api/pos/checkout', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { items, patientId, patientName, paymentMethod, totalOverride } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'POS cart items are required' });
    }

    const refNumber = `POS-${Math.floor(100000 + Math.random() * 899999)}`;
    const result = await processPharmacyCheckoutAndLedger({
      referenceNumber: refNumber,
      patientId: patientId ? Number(patientId) : null,
      patientName: patientName || 'Walk-In Dispensary Patient',
      paymentMethod: paymentMethod || 'Cash / POS Terminal',
      items,
      totalOverride: totalOverride ? Number(totalOverride) : undefined,
      createdByUid: req.user?.uid,
    });

    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error('Error in POST /api/pos/checkout:', err);
    res.status(500).json({ error: err.message || 'POS checkout failed' });
  }
});

// D. Patient CRM & QR Identity Triage
app.get('/api/patients', async (_req, res) => {
  try {
    await ensureSeededPatientsAndLedger();
    const list = await db.select().from(patients).orderBy(desc(patients.id));
    const visits = await db
      .select()
      .from(patientVisits)
      .orderBy(desc(patientVisits.checkedInAt))
      .limit(30);

    const enriched = list.map((p) => ({
      ...p,
      visits: visits.filter((v) => v.patientId === p.id),
    }));

    res.json({ success: true, patients: enriched });
  } catch (err: any) {
    console.error('Error in GET /api/patients:', err);
    res.status(500).json({ error: err.message || 'Failed to load patients' });
  }
});

app.post('/api/patients', async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    if (!fullName || !phone) {
      return res.status(400).json({ error: 'Full name and phone are required' });
    }
    const created = await createPatientProfile(req.body);
    res.json({ success: true, patient: { ...created, visits: [] } });
  } catch (err: any) {
    console.error('Error in POST /api/patients:', err);
    res.status(500).json({ error: err.message || 'Failed to register patient' });
  }
});

app.get('/api/patients/qr/:token', async (req, res) => {
  try {
    await ensureSeededPatientsAndLedger();
    const token = req.params.token.trim().toUpperCase();
    const rows = await db
      .select()
      .from(patients)
      .where(eq(patients.qrCodeToken, token))
      .limit(1);

    if (rows.length === 0) {
      return res.status(404).json({ error: `No patient found for QR token ${token}` });
    }

    const visits = await db
      .select()
      .from(patientVisits)
      .where(eq(patientVisits.patientId, rows[0].id))
      .orderBy(desc(patientVisits.checkedInAt));

    res.json({ success: true, patient: { ...rows[0], visits } });
  } catch (err: any) {
    console.error('Error in GET /api/patients/qr/:token:', err);
    res.status(500).json({ error: err.message || 'QR lookup failed' });
  }
});

app.post('/api/patients/:id/checkin', async (req, res) => {
  try {
    const patientId = parseInt(req.params.id, 10);
    const result = await checkInPatientTriage({
      patientId,
      practitionerName: req.body.practitionerName,
      visitType: req.body.visitType,
      consultationFee: req.body.consultationFee,
      notes: req.body.notes,
    });
    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error('Error in POST /api/patients/:id/checkin:', err);
    res.status(500).json({ error: err.message || 'Failed to log patient arrival' });
  }
});

// E. Real-Time Financial & Accounting Analytics Summary + Automated Ledger
app.get('/api/analytics/summary', async (req, res) => {
  try {
    const periodParam = (req.query.period as AnalyticsPeriod) || 'monthly';
    const validPeriod: AnalyticsPeriod =
      periodParam === 'daily' || periodParam === 'weekly' || periodParam === 'monthly'
        ? periodParam
        : 'monthly';

    const settings = await getOrSeedClinicSettings();
    await ensureSeededMedicines();
    await ensureSeededPatientsAndLedger();

    const allTx = await db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.createdAt));

    const summary = calculatePeriodFinancialSummary(allTx, validPeriod, new Date());

    // Build daily/period chart series from transactions (oldest to newest)
    const chartBuckets = new Map<
      string,
      { label: string; grossRevenue: number; netRevenue: number; cogsAndOverhead: number }
    >();
    const reversed = [...allTx].reverse();
    for (const tx of reversed) {
      const d = tx.createdAt ? new Date(tx.createdAt) : new Date();
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const prev = chartBuckets.get(label) || {
        label,
        grossRevenue: 0,
        netRevenue: 0,
        cogsAndOverhead: 0,
      };
      prev.grossRevenue = Math.round((prev.grossRevenue + tx.grossAmount) * 100) / 100;
      prev.netRevenue = Math.round((prev.netRevenue + tx.netAmount) * 100) / 100;
      prev.cogsAndOverhead =
        Math.round((prev.cogsAndOverhead + tx.cogsAmount + tx.overheadAmount) * 100) / 100;
      chartBuckets.set(label, prev);
    }

    res.json({
      success: true,
      period: validPeriod,
      overheadPercentage: settings.overheadPercentage,
      summary,
      chartData: Array.from(chartBuckets.values()),
      transactions: allTx.slice(0, 50),
    });
  } catch (err: any) {
    console.error('Error in GET /api/analytics/summary:', err);
    res.status(500).json({ error: err.message || 'Failed to compute analytics summary' });
  }
});

// API Routes

// 1. Sync User with Cloud SQL
app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;
    const email = req.user!.email || `${uid}@anonymous.safi`;
    const { displayName, photoUrl } = req.body;

    const userRecord = await getOrCreateUser(uid, email, displayName, photoUrl);
    res.json({ success: true, user: userRecord });
  } catch (err: any) {
    console.error('Error in /api/auth/sync:', err);
    res.status(500).json({ error: err.message || 'Failed to sync user' });
  }
});

// 2. Appointments API
app.post('/api/appointments', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const userUid = req.user?.uid;
    const data = {
      ...req.body,
      userUid: userUid || req.body.userUid,
    };

    const newAppointment = await createAppointment(data);
    res.json({ success: true, appointment: newAppointment });
  } catch (err: any) {
    console.error('Error in POST /api/appointments:', err);
    res.status(500).json({ error: err.message || 'Failed to create appointment' });
  }
});

app.get('/api/appointments', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userUid = req.user!.uid;
    const list = await getUserAppointments(userUid);
    res.json({ success: true, appointments: list });
  } catch (err: any) {
    console.error('Error in GET /api/appointments:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch appointments' });
  }
});

app.get('/api/appointments/lookup', async (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    const matches = await findAppointmentByRefOrPhone(query);
    res.json({ success: true, appointments: matches });
  } catch (err: any) {
    console.error('Error in /api/appointments/lookup:', err);
    res.status(500).json({ error: err.message || 'Lookup failed' });
  }
});

// 3. Orders API
app.post('/api/orders', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const userUid = req.user?.uid;
    const data = {
      ...req.body,
      userUid: userUid || req.body.userUid,
    };

    const newOrder = await createOrder(data);
    res.json({ success: true, order: newOrder });
  } catch (err: any) {
    console.error('Error in POST /api/orders:', err);
    res.status(500).json({ error: err.message || 'Failed to create order' });
  }
});

app.get('/api/orders', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userUid = req.user!.uid;
    const list = await getUserOrders(userUid);
    res.json({ success: true, orders: list });
  } catch (err: any) {
    console.error('Error in GET /api/orders:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch orders' });
  }
});

// 4. Patient Recommended Herbal Protocols API
app.get('/api/protocols', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userUid = req.user!.uid;
    let list = await getUserProtocols(userUid);
    if (list.length === 0) {
      list = await seedInitialPatientProtocolsIfEmpty(userUid, req.user?.displayName || 'Patient');
    }
    res.json({ success: true, protocols: list });
  } catch (err: any) {
    console.error('Error in GET /api/protocols:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch herbal protocols' });
  }
});

app.post('/api/protocols', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userUid = req.user!.uid;
    const data = {
      ...req.body,
      userUid,
    };
    const newProtocol = await createProtocol(data);
    res.json({ success: true, protocol: newProtocol });
  } catch (err: any) {
    console.error('Error in POST /api/protocols:', err);
    res.status(500).json({ error: err.message || 'Failed to create protocol' });
  }
});

app.patch('/api/protocols/:id/adherence', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userUid = req.user!.uid;
    const id = parseInt(req.params.id, 10);
    const { adherenceRate, status } = req.body;
    const updated = await updateProtocolAdherence(id, userUid, adherenceRate, status);
    res.json({ success: true, protocol: updated });
  } catch (err: any) {
    console.error('Error in PATCH /api/protocols/:id/adherence:', err);
    res.status(500).json({ error: err.message || 'Failed to update protocol adherence' });
  }
});

// 5. Gemini Chatbot with Search and Maps Grounding
const CLINIC_SYSTEM_INSTRUCTION = `You are Hakim Assistant, the official AI Clinical Consultation Companion for Safi Natural Care Clinic (Herbal, Unani & Naturopathic Clinical Practice in Kabul, Afghanistan).

Clinical Leadership:
- Dr. Naseb Hamdard (Lead Practitioner & Clinical Director)
- Dr. Hakim Safiullah Safi (Senior Herbalist & Unani Scholar)

Clinical Principles:
- Core systems: Classical Herbal Medicine (phytotherapy), Unani-Tibb (Mizaj/temperament, Akhlat/humors, Tabiat/vital self-healing), and Naturopathy (lifestyle and nutrition counseling).
- Central Faith & Healing pillar: "وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ" (Surah Ash-Shu'ara 26:80 - "And when I am ill, it is He who cures me").
- Scope of Outpatient Care: Digestive & metabolic conditions, musculoskeletal & joint discomfort, chronic stress & lifestyle conditions, hormonal & reproductive support, respiratory & urological care, and therapeutic skin & hair health (non-cosmetic).
- Ethics & Safety: Adhere to Afghanistan Ministry of Public Health (MoPH) regulations and WHO Traditional Medicine (TCIM) standards. Never guarantee miracles or definitive cure claims. Always advise patient safety, pulse/temperament diagnosis, and complementary alignment with conventional physicians.
- Clinic details: Kabul, Afghanistan | Phone/WhatsApp: +93 780 299 299 | Portal: www.safihealthcare.com | Email: info@safihealthcare.com.

Tone: Warm, wise, deeply respectful, evidence-informed, and clear. Structure responses with concise herbal insights and practical advice.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model, grounding, userLocation } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Model selection based on user request:
    // gemini-4-argon for complex tasks
    // gemini-3.8-flash for general tasks (default)
    // gemini-3.1-flash-lite for tasks that should happen fast
    let selectedModel = 'gemini-3.8-flash';
    if (model === 'gemini-4-argon' || model === 'complex') {
      selectedModel = 'gemini-4-argon';
    } else if (model === 'gemini-3.1-flash-lite' || model === 'fast') {
      selectedModel = 'gemini-3.1-flash-lite';
    }

    // Grounding configuration (search or maps)
    const tools: any[] = [];
    let toolConfig: any = undefined;

    if (grounding === 'maps') {
      tools.push({ googleMaps: {} });
      if (userLocation?.latitude && userLocation?.longitude) {
        toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            },
          },
        };
      }
    } else if (grounding === 'search' || (!grounding && selectedModel === 'gemini-3.8-flash')) {
      tools.push({ googleSearch: {} });
    }

    // Convert messages to Gemini format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const config: any = {
      systemInstruction: CLINIC_SYSTEM_INSTRUCTION,
    };

    if (tools.length > 0) {
      config.tools = tools;
    }
    if (toolConfig) {
      config.toolConfig = toolConfig;
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config,
    });

    const replyText = response.text || 'I am reflecting on your health inquiry. Please consult our clinic desk at +93 780 299 299.';

    // Extract grounding sources (Search or Maps)
    const groundingSources: Array<{ title: string; uri: string; type: 'web' | 'maps' }> = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (Array.isArray(chunks)) {
      for (const chunk of chunks) {
        if (chunk.web?.uri) {
          groundingSources.push({
            title: chunk.web.title || 'Web Citation',
            uri: chunk.web.uri,
            type: 'web',
          });
        }
        if (chunk.maps?.uri) {
          groundingSources.push({
            title: chunk.maps.title || 'Google Maps Location',
            uri: chunk.maps.uri,
            type: 'maps',
          });
        }
      }
    }

    res.json({
      reply: replyText,
      groundingSources,
      modelUsed: selectedModel,
    });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({ error: err.message || 'Chat generation failed' });
  }
});

// Vite middleware in development or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Safi Natural Care Clinic server running on port ${port}`);
  });
}

startServer();
