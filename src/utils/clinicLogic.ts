import { CartItem, Appointment, HerbalProduct } from '../types/clinic';

export interface CartTotals {
  subtotal: number;
  discount: number;
  discountCodeApplied: string | null;
  shipping: number;
  freeShippingProgress: number;
  remainingForFreeShipping: number;
  tax: number;
  total: number;
}

const FREE_SHIPPING_THRESHOLD = 60;
const STANDARD_SHIPPING_FEE = 7.99;
const TAX_RATE = 0.05; // 5% herbal clinic tax

export function calculateCartTotals(
  items: CartItem[],
  promoCode?: string
): CartTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * Math.max(1, item.quantity),
    0
  );

  let discount = 0;
  let discountCodeApplied: string | null = null;

  if (promoCode) {
    const cleanCode = promoCode.trim().toUpperCase();
    if (cleanCode === 'HERBAL10') {
      discount = Math.round(subtotal * 0.1 * 100) / 100;
      discountCodeApplied = 'HERBAL10 (10% Off)';
    } else if (cleanCode === 'SAFI20') {
      discount = Math.round(subtotal * 0.2 * 100) / 100;
      discountCodeApplied = 'SAFI20 (20% Off VIP)';
    }
  }

  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING_FEE;

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const remainingForFreeShipping = Math.max(
    0,
    Math.round((FREE_SHIPPING_THRESHOLD - subtotal) * 100) / 100
  );

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * TAX_RATE * 100) / 100;
  const total =
    subtotal === 0
      ? 0
      : Math.round((taxableAmount + shipping + tax) * 100) / 100;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount,
    discountCodeApplied,
    shipping,
    freeShippingProgress,
    remainingForFreeShipping,
    tax,
    total,
  };
}

export interface BookingValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateAppointmentBooking(data: Partial<Appointment>): BookingValidationResult {
  const errors: Record<string, string> = {};

  if (!data.serviceId) {
    errors.serviceId = 'Please select a consultation service';
  }
  if (!data.practitionerId) {
    errors.practitionerId = 'Please select a herbal specialist';
  }
  if (!data.date) {
    errors.date = 'Please choose an appointment date';
  }
  if (!data.timeSlot) {
    errors.timeSlot = 'Please select a time slot';
  }
  if (!data.patient?.fullName || data.patient.fullName.trim().length < 2) {
    errors.fullName = 'Full legal name is required';
  }
  if (
    !data.patient?.email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.patient.email)
  ) {
    errors.email = 'Valid email address is required';
  }
  if (
    !data.patient?.phone ||
    data.patient.phone.replace(/[^0-9]/g, '').length < 7
  ) {
    errors.phone = 'Valid contact phone number is required';
  }
  if (!data.patient?.healthConcerns || data.patient.healthConcerns.trim().length < 5) {
    errors.healthConcerns = 'Please briefly state your symptoms or reason for visit';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function generateAppointmentRef(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `SHC-${randomNum}`;
}

export function generateOrderRef(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `ORD-${randomNum}`;
}

export function generateIcsCalendar(appointment: Appointment): string {
  const dateFormatted = appointment.date.replace(/-/g, '');
  const startTime = appointment.timeSlot.split(' ')[0].replace(':', '') + '00';
  
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Safi Herbal Clinic//Appointment System//EN',
    'BEGIN:VEVENT',
    `UID:${appointment.referenceNumber}@safiherbalclinic.com`,
    `SUMMARY:Herbal Consultation - ${appointment.serviceTitle}`,
    `DESCRIPTION:Consultation with ${appointment.practitionerName} (${appointment.consultationType}). Patient: ${appointment.patient.fullName}. Booking Ref: ${appointment.referenceNumber}`,
    `LOCATION:${appointment.consultationType === 'Online Telehealth Video' ? 'Secure Telehealth Room' : 'Safi Herbal Clinic, 742 Botanical Way, Suite 400'}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function filterProducts(
  products: HerbalProduct[],
  category: string,
  searchQuery: string
): HerbalProduct[] {
  return products.filter((product) => {
    const matchesCategory =
      category === 'All' || product.category === category;
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.botanicalIngredients.some(
        (b) =>
          b.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.botanicalName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });
}

export interface BinauralTuning {
  leftHz: number;
  rightHz: number;
  beatHz: number;
  stateLabel: string;
}

export function calculateBinauralFrequencies(
  baseFreq: number,
  brainwave: 'delta' | 'theta' | 'alpha' | 'beta'
): BinauralTuning {
  const beatOffsets: Record<'delta' | 'theta' | 'alpha' | 'beta', { beat: number; label: string }> = {
    delta: { beat: 2.5, label: 'Delta (0.5-4 Hz) - Deep Regenerative Sleep' },
    theta: { beat: 6.0, label: 'Theta (4-8 Hz) - Deep Meditation & Vagal Tone' },
    alpha: { beat: 10.0, label: 'Alpha (8-13 Hz) - Calm Alertness & Stress Relief' },
    beta: { beat: 18.0, label: 'Beta (13-30 Hz) - Cognitive Focus & Vitality' },
  };

  const config = beatOffsets[brainwave] || beatOffsets.theta;
  const leftHz = Math.round((baseFreq - config.beat / 2) * 10) / 10;
  const rightHz = Math.round((baseFreq + config.beat / 2) * 10) / 10;

  return {
    leftHz,
    rightHz,
    beatHz: config.beat,
    stateLabel: config.label,
  };
}

export function formatAcousticTimer(seconds: number): string {
  if (seconds <= 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getSoundscapeProfile(id: string): { title: string; element: string; humorEffect: string } {
  const soundscapes: Record<string, { title: string; element: string; humorEffect: string }> = {
    rain: {
      title: 'Forest Rain',
      element: "Water (Ma'a)",
      humorEffect: 'Cooling & Moistening — Moderates excessive Safra (Yellow Bile) & internal heat',
    },
    garden: {
      title: 'Herbal Garden',
      element: 'Air & Earth (Hawa wa Ard)',
      humorEffect: 'Balancing & Grounding — Disperses nervous stagnation and elevates Tabiat',
    },
    oud: {
      title: 'Traditional Oud',
      element: 'Aether & Fire (Atheer wa Nar)',
      humorEffect: 'Nervine Restorative — Classical Ilaj bil-Mousiqi for cerebral tranquility',
    },
    bowl: {
      title: 'Singing Bowl & Bell',
      element: "Mineral Metal (Ma'adin)",
      humorEffect: 'Harmonic Centering — Releases deep musculoskeletal and occipital tension',
    },
  };
  return soundscapes[id] || soundscapes.rain;
}

export function calculateProtocolAdherenceAverage(protocols: { adherenceRate: number }[]): number {
  if (!protocols || protocols.length === 0) return 100;
  const total = protocols.reduce((acc, p) => acc + (p.adherenceRate || 0), 0);
  return Math.round(total / protocols.length);
}

export function categorizePatientProtocols(protocols: { status: string }[]): {
  active: number;
  completed: number;
  maintenance: number;
} {
  const result = { active: 0, completed: 0, maintenance: 0 };
  for (const p of protocols) {
    if (p.status === 'Active') result.active++;
    else if (p.status === 'Completed') result.completed++;
    else if (p.status === 'Maintenance') result.maintenance++;
  }
  return result;
}

export function formatPatientMrn(identifier: string): string {
  if (!identifier) return 'SNC-1000';
  const hash = Math.abs(
    identifier.split('').reduce((acc, char) => acc + char.charCodeAt(0), 1000)
  );
  return `SNC-${hash.toString().padStart(4, '0')}`;
}

// ============================================================================
// CLINICAL ACCOUNTING, INVENTORY, POS & QR IDENTITY PURE LOGIC
// ============================================================================

export type AnalyticsPeriod = 'daily' | 'weekly' | 'monthly';

export interface NetRevenueMetrics {
  totalPatientsSeen: number;
  consultationCount: number;
  pharmacyOrderCount: number;
  grossRevenue: number;
  totalCogs: number;
  totalOverhead: number;
  netRevenue: number;
  profitMarginPercent: number;
}

/**
 * Classifies medicine stock counts against the clinic's configurable threshold.
 * - <= 0 units -> "Out of Stock" (Red)
 * - < threshold (default 20) -> "Low Stock" (Yellow/Amber) + Triggers Owner Alert
 * - >= threshold -> "In Stock" (Green)
 */
export function classifyInventoryStatus(
  stockQuantity: number,
  threshold: number = 20
): 'In Stock' | 'Low Stock' | 'Out of Stock' {
  if (stockQuantity <= 0) return 'Out of Stock';
  if (stockQuantity < threshold) return 'Low Stock';
  return 'In Stock';
}

export function needsRestockAlert(
  stockQuantity: number,
  threshold: number = 20
): boolean {
  return stockQuantity < threshold;
}

/**
 * Core Accounting Math:
 * Calculates Net Revenue for a single transaction using:
 *   Overhead Amount = Gross Amount * (overheadPercent / 100)
 *   Net Revenue     = Gross Amount - COGS Amount - Overhead Amount
 */
export function calculateTransactionNet(
  grossAmount: number,
  cogsAmount: number,
  overheadPercent: number
): { overheadAmount: number; netAmount: number } {
  const safeGross = Math.max(0, Number(grossAmount) || 0);
  const safeCogs = Math.max(0, Number(cogsAmount) || 0);
  const safeRate = Math.max(0, Math.min(100, Number(overheadPercent) || 0));

  const overheadAmount = Math.round(safeGross * (safeRate / 100) * 100) / 100;
  const netAmount = Math.round((safeGross - safeCogs - overheadAmount) * 100) / 100;

  return { overheadAmount, netAmount };
}

/**
 * Aggregates ledger transactions within a selected window ('daily' | 'weekly' | 'monthly')
 * into executive KPI metrics for consultations, pharmacy sales, COGS, overhead, and Net Profit.
 */
export function calculatePeriodFinancialSummary(
  transactions: Array<{
    type: string;
    grossAmount: number;
    cogsAmount: number;
    overheadAmount: number;
    netAmount: number;
    patientId?: number | null;
    patientName?: string | null;
    createdAt: string | Date | null;
  }>,
  period: AnalyticsPeriod,
  referenceDate: Date = new Date()
): NetRevenueMetrics {
  const cutoff = new Date(referenceDate);
  if (period === 'daily') {
    cutoff.setHours(0, 0, 0, 0);
  } else if (period === 'weekly') {
    cutoff.setDate(cutoff.getDate() - 7);
    cutoff.setHours(0, 0, 0, 0);
  } else {
    cutoff.setDate(cutoff.getDate() - 30);
    cutoff.setHours(0, 0, 0, 0);
  }

  const filtered = transactions.filter((tx) => {
    if (!tx.createdAt) return false;
    const dt = tx.createdAt instanceof Date ? tx.createdAt : new Date(tx.createdAt);
    return !Number.isNaN(dt.getTime()) && dt >= cutoff;
  });

  let grossRevenue = 0;
  let totalCogs = 0;
  let totalOverhead = 0;
  let netRevenue = 0;
  let consultationCount = 0;
  let pharmacyOrderCount = 0;
  const uniquePatients = new Set<string>();

  for (const tx of filtered) {
    grossRevenue += Number(tx.grossAmount) || 0;
    totalCogs += Number(tx.cogsAmount) || 0;
    totalOverhead += Number(tx.overheadAmount) || 0;
    netRevenue += Number(tx.netAmount) || 0;

    if (tx.type === 'consultation') {
      consultationCount++;
    } else if (tx.type === 'pharmacy_sale') {
      pharmacyOrderCount++;
    }

    if (tx.patientId) {
      uniquePatients.add(`id-${tx.patientId}`);
    } else if (tx.patientName) {
      uniquePatients.add(`name-${tx.patientName.toLowerCase()}`);
    }
  }

  grossRevenue = Math.round(grossRevenue * 100) / 100;
  totalCogs = Math.round(totalCogs * 100) / 100;
  totalOverhead = Math.round(totalOverhead * 100) / 100;
  netRevenue = Math.round(netRevenue * 100) / 100;

  const profitMarginPercent =
    grossRevenue > 0 ? Math.round((netRevenue / grossRevenue) * 1000) / 10 : 0;

  return {
    totalPatientsSeen: Math.max(uniquePatients.size, consultationCount),
    consultationCount,
    pharmacyOrderCount,
    grossRevenue,
    totalCogs,
    totalOverhead,
    netRevenue,
    profitMarginPercent,
  };
}

/**
 * Generates a unique, human-readable Patient QR Identity Token.
 */
export function generatePatientQrToken(): string {
  const randomCode = Math.floor(10000 + Math.random() * 89999);
  return `SNC-PAT-${randomCode}`;
}

/**
 * Computes POS Cart totals including wholesale COGS so the ledger entry logs exact margin.
 */
export function calculatePosCartTotals(
  items: Array<{ unitPrice: number; cogsPrice: number; quantity: number }>,
  taxRate: number = 0.05
): { subtotal: number; tax: number; total: number; totalCogs: number } {
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * Math.max(1, item.quantity),
    0
  );
  const totalCogs = items.reduce(
    (sum, item) => sum + item.cogsPrice * Math.max(1, item.quantity),
    0
  );
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax,
    total,
    totalCogs: Math.round(totalCogs * 100) / 100,
  };
}

/**
 * Builds platform-specific share URLs for dispensary products using configurable clinic settings.
 */
export function buildSocialShareUrl(
  platform: 'facebook' | 'twitter' | 'whatsapp',
  productName: string,
  productPrice: number,
  whatsappNumber: string = '+93780299299',
  siteUrl: string = 'https://www.safihealthcare.com'
): string {
  const shareText = `${productName} ($${productPrice.toFixed(2)}) — Authentic botanical formulation from Safi Natural Care Clinic, Kabul.`;
  if (platform === 'facebook') {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}&quote=${encodeURIComponent(shareText)}`;
  }
  if (platform === 'twitter') {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(siteUrl)}`;
  }
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`${shareText} Order at ${siteUrl}`)}`;
}

