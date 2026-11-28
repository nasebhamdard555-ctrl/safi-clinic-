import type { Row } from './types';

export interface FinancialLineItem {
  id: string;
  date: string;
  type: 'Appointment' | 'Dispensing';
  description: string;
  paymentStatus: string;
  paymentMethod?: string;
  amount: number;
  isOutstanding: boolean;
}

export interface PatientFinancialSummary {
  receiptNo: string;
  patientId: string;
  patientName: string;
  phone: string;
  visitCount: number;
  consultationCount: number;
  dispensingCount: number;
  appointmentsTotal: number;
  dispensingTotal: number;
  totalBilled: number;
  totalSettled: number;
  outstanding: number;
  items: FinancialLineItem[];
}

/** Returns true when a billing row is unpaid or partly paid. */
export function isOwedRow(row: Row): boolean {
  return /unpaid|partly/i.test(String(row.paymentStatus ?? ''));
}

/** Builds a normalized financial summary and itemized statement for a patient profile. */
export function buildPatientFinancialSummary(
  patient: Row,
  visits: Row[],
  consults: Row[],
  sales: Row[],
): PatientFinancialSummary {
  const patientId = String(patient.id ?? '');
  const patientName = String(patient.fullName ?? '').trim() || 'Patient';
  const phone = String(patient.phone ?? '').trim();
  const receiptNo = `PS-${patientId.slice(0, 8).toUpperCase() || '00000000'}`;

  const appointmentItems: FinancialLineItem[] = visits.map((v) => {
    const amount = Number(v.fee || 0);
    const reason = String(v.reason ?? '').trim();
    const doctor = String(v.doctor ?? '').trim();
    const description = [reason || 'Clinic appointment', doctor ? `(${doctor})` : ''].filter(Boolean).join(' ');
    return {
      id: v.id,
      date: String(v.date ?? ''),
      type: 'Appointment',
      description,
      paymentStatus: String(v.paymentStatus ?? 'Unpaid') || 'Unpaid',
      amount,
      isOutstanding: isOwedRow(v),
    };
  });

  const dispensingItems: FinancialLineItem[] = sales.map((s) => {
    const amount = Number(s.amount || 0);
    const itemsText = String(s.items ?? '').trim() || 'Pharmacy dispensing';
    const paymentMethod = String(s.paymentMethod ?? '').trim() || undefined;
    return {
      id: s.id,
      date: String(s.date ?? ''),
      type: 'Dispensing',
      description: itemsText,
      paymentStatus: String(s.paymentStatus ?? 'Unpaid') || 'Unpaid',
      paymentMethod,
      amount,
      isOutstanding: isOwedRow(s),
    };
  });

  const appointmentsTotal = appointmentItems.reduce((sum, item) => sum + item.amount, 0);
  const dispensingTotal = dispensingItems.reduce((sum, item) => sum + item.amount, 0);
  const totalBilled = appointmentsTotal + dispensingTotal;
  const items = [...appointmentItems, ...dispensingItems].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const outstanding = items.filter((item) => item.isOutstanding).reduce((sum, item) => sum + item.amount, 0);
  const totalSettled = Math.max(0, totalBilled - outstanding);

  return {
    receiptNo,
    patientId,
    patientName,
    phone,
    visitCount: visits.length,
    consultationCount: consults.length,
    dispensingCount: sales.length,
    appointmentsTotal,
    dispensingTotal,
    totalBilled,
    totalSettled,
    outstanding,
    items,
  };
}
