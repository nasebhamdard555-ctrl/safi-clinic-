import { useState } from 'react';
import { Printer } from 'lucide-react';
import { useCollection } from '../lib/useCollection';
import { dateOnly, dateTime, money, today } from '../lib/format';
import { formatShortId } from '../lib/search';
import type { PatientFinancialSummary } from '../lib/patientReceipt';
import { BRAND } from '../config/brand';
import type { Row } from '../lib/types';
import type { ModuleDef } from '../modules';
import { Button, Modal } from './ui';

// Printable receipt built from the clinic settings. Printing uses the browser's
// print dialog; only the receipt area is printed (see index.css).
export function ReceiptModal({ mod, row, onClose }: { mod: ModuleDef; row: Row; onClose: () => void }) {
  const { rows } = useCollection('settings');
  const clinic = (rows.find((r) => r.id === 'clinic') ?? {}) as Row;
  const amountKey = mod.receiptAmountKey ?? '';
  const receiptNo = `R-${String(row.id).slice(0, 8).toUpperCase()}`;
  const lines = mod.columns.filter((c) => c.key !== amountKey);

  const print = () => {
    try {
      window.print();
    } catch {
      window.alert('Printing is not available in this preview. Use your browser menu to print this page.');
    }
  };

  const show = (key: string, format?: string) => {
    const v = row[key];
    if (v === undefined || v === null || v === '') return '—';
    if (format === 'date') return dateOnly(v);
    if (format === 'datetime') return dateTime(v);
    return String(v);
  };

  return (
    <Modal title={mod.receiptTitle ?? 'Receipt'} onClose={onClose}>
      <div id="receipt-print" className="rounded-lg border border-line bg-cream p-5 text-ink">
        <div className="text-center">
          <p className="text-lg font-bold">{String(clinic.name || BRAND.company)}</p>
          {clinic.address ? <p className="text-xs">{String(clinic.address)}</p> : null}
          {clinic.phone ? <p className="text-xs">Tel: {String(clinic.phone)}</p> : null}
          {clinic.email ? <p className="text-xs">{String(clinic.email)}</p> : null}
          {clinic.hours ? <p className="text-xs">{String(clinic.hours)}</p> : null}
        </div>
        <hr className="my-4 border-ink/30" />
        <p className="mb-3 text-sm font-semibold">
          {mod.receiptTitle ?? 'Receipt'} · {receiptNo}
        </p>
        <table className="w-full text-sm">
          <tbody>
            {lines.map((c) => (
              <tr key={c.key} className="border-b border-ink/10">
                <td className="py-1.5 pr-3 text-ink/70">{c.label}</td>
                <td className="py-1.5 text-right">{show(c.key, c.format)}</td>
              </tr>
            ))}
            <tr>
              <td className="pt-3 text-base font-bold">Amount paid</td>
              <td className="pt-3 text-right text-base font-bold">{money(row[amountKey])}</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-6 text-center text-xs text-ink/60">Thank you for choosing {String(clinic.name || BRAND.company)}.</p>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        <Button onClick={print}>
          <Printer size={16} /> Print receipt
        </Button>
      </div>
    </Modal>
  );
}

// Printable patient financial summary receipt using the existing #receipt-print @media print styles.
export function PatientReceiptModal({
  summary,
  patient,
  onClose,
}: {
  summary: PatientFinancialSummary;
  patient: Row;
  onClose: () => void;
}) {
  const { rows } = useCollection('settings');
  const [printError, setPrintError] = useState<string | null>(null);
  const clinic = (rows.find((r) => r.id === 'clinic') ?? {}) as Row;
  const clinicName = String(clinic.name || BRAND.company);

  const handlePrint = () => {
    setPrintError(null);
    try {
      window.print();
    } catch {
      setPrintError('Printing is not available in this preview. Use your browser menu to print this page.');
    }
  };

  return (
    <Modal title="Patient Financial Receipt" onClose={onClose} wide>
      <div id="receipt-print" className="rounded-lg border border-line bg-cream p-6 text-ink">
        <div className="text-center">
          <p className="text-xl font-bold tracking-tight">{clinicName}</p>
          {clinic.address ? <p className="text-xs text-ink/75">{String(clinic.address)}</p> : null}
          <div className="mt-0.5 flex flex-wrap justify-center gap-x-3 text-xs text-ink/75">
            {clinic.phone ? <span>Tel: {String(clinic.phone)}</span> : null}
            {clinic.email ? <span>{String(clinic.email)}</span> : null}
            {clinic.hours ? <span>{String(clinic.hours)}</span> : null}
          </div>
        </div>

        <hr className="my-4 border-ink/25" />

        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm font-bold uppercase tracking-wider">Patient Financial Summary Receipt</p>
          <p className="text-xs text-ink/75">
            <span className="font-mono font-semibold text-ink">{summary.receiptNo}</span> · Issued {today()}
          </p>
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 rounded-md border border-ink/15 bg-white/60 p-3 text-xs sm:grid-cols-4">
          <div>
            <dt className="uppercase tracking-wider text-ink/60">Patient</dt>
            <dd className="mt-0.5 font-semibold text-ink">{summary.patientName}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wider text-ink/60">Patient ID</dt>
            <dd className="mt-0.5 font-mono font-semibold text-ink">{formatShortId(summary.patientId)}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wider text-ink/60">Phone</dt>
            <dd className="mt-0.5 font-medium text-ink">{summary.phone || '—'}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wider text-ink/60">Records</dt>
            <dd className="mt-0.5 font-medium text-ink">
              {summary.visitCount} {summary.visitCount === 1 ? 'visit' : 'visits'} · {summary.dispensingCount}{' '}
              {summary.dispensingCount === 1 ? 'purchase' : 'purchases'}
            </dd>
          </div>
          {patient.dateOfBirth ? (
            <div>
              <dt className="uppercase tracking-wider text-ink/60">Date of birth</dt>
              <dd className="mt-0.5 font-medium text-ink">{dateOnly(patient.dateOfBirth)}</dd>
            </div>
          ) : null}
          {patient.bloodGroup ? (
            <div>
              <dt className="uppercase tracking-wider text-ink/60">Blood group</dt>
              <dd className="mt-0.5 font-medium text-ink">{String(patient.bloodGroup)}</dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink/70">Itemized Charges</p>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-ink/30 text-[11px] uppercase tracking-wider text-ink/70">
                <th className="py-1.5 pr-2 font-semibold">Date</th>
                <th className="py-1.5 pr-2 font-semibold">Type</th>
                <th className="py-1.5 pr-2 font-semibold">Description</th>
                <th className="py-1.5 pr-2 font-semibold">Status</th>
                <th className="py-1.5 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {summary.items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-ink/60">
                    No billable visits or pharmacy purchases recorded.
                  </td>
                </tr>
              ) : (
                summary.items.map((item) => (
                  <tr key={`${item.type}-${item.id}`} className="border-b border-ink/10">
                    <td className="whitespace-nowrap py-1.5 pr-2 text-ink/80">{dateOnly(item.date)}</td>
                    <td className="whitespace-nowrap py-1.5 pr-2 font-medium">{item.type}</td>
                    <td className="py-1.5 pr-2">{item.description}</td>
                    <td className="whitespace-nowrap py-1.5 pr-2 text-ink/80">
                      {item.paymentStatus}
                      {item.paymentMethod ? ` · ${item.paymentMethod}` : ''}
                    </td>
                    <td className="whitespace-nowrap py-1.5 text-right font-medium">{money(item.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 ml-auto max-w-xs border-t border-ink/25 pt-3 text-sm">
          <div className="flex justify-between py-0.5 text-xs text-ink/75">
            <span>Appointments ({summary.visitCount})</span>
            <span>{money(summary.appointmentsTotal)}</span>
          </div>
          <div className="flex justify-between py-0.5 text-xs text-ink/75">
            <span>Pharmacy / Dispensing ({summary.dispensingCount})</span>
            <span>{money(summary.dispensingTotal)}</span>
          </div>
          <div className="mt-1.5 flex justify-between border-t border-ink/20 pt-1.5 font-semibold">
            <span>Total Billed</span>
            <span>{money(summary.totalBilled)}</span>
          </div>
          <div className="flex justify-between py-0.5 text-xs text-ink/75">
            <span>Settled / Paid</span>
            <span>{money(summary.totalSettled)}</span>
          </div>
          <div className="mt-1.5 flex justify-between border-t border-ink/30 pt-2 text-base font-bold">
            <span>Outstanding Balance</span>
            <span>{money(summary.outstanding)}</span>
          </div>
        </div>

        <p className="mt-6 border-t border-ink/15 pt-3 text-center text-xs text-ink/60">
          Thank you for choosing {clinicName}.
        </p>
      </div>

      {printError && <p className="mt-3 text-sm text-danger">{printError}</p>}

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        <Button onClick={handlePrint}>
          <Printer size={16} /> Print Receipt
        </Button>
      </div>
    </Modal>
  );
}

