import { Printer } from 'lucide-react';
import { useCollection } from '../lib/useCollection';
import { dateOnly, dateTime, money } from '../lib/format';
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
