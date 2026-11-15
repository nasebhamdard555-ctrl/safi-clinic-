import React, { useState } from 'react';
import { FileText, Plus, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { ArInvoiceRecord } from '../../types/clinic';
import { AgingBucketsSummary } from '../../utils/accountingEngine';
import { useCurrency } from '../../context/CurrencyContext';

interface ReceivablesPanelProps {
  invoices: ArInvoiceRecord[];
  aging: AgingBucketsSummary;
  onRefresh: () => void;
}

export const ReceivablesPanel: React.FC<ReceivablesPanelProps> = ({
  invoices,
  aging,
  onRefresh,
}) => {
  const { formatPrice } = useCurrency();
  const [showForm, setShowForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [subtotal, setSubtotal] = useState('');
  const [taxAmount, setTaxAmount] = useState('0');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
  );
  const [revenueAccountNumber, setRevenueAccountNumber] = useState('4010');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/accounting/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          subtotal: parseFloat(subtotal) || 0,
          taxAmount: parseFloat(taxAmount) || 0,
          dueDate,
          revenueAccountNumber,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create invoice');
      setFeedback({
        type: 'ok',
        msg: `Invoice ${data.invoice.invoiceNumber} created & posted to A/R (Acct 1100).`,
      });
      setCustomerName('');
      setCustomerEmail('');
      setSubtotal('');
      setTaxAmount('0');
      setNotes('');
      setShowForm(false);
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'err', msg: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReceivePayment = async (inv: ArInvoiceRecord) => {
    const remaining = Math.max(0, inv.totalAmount - inv.amountPaid);
    if (remaining <= 0) return;

    setBusyId(inv.id);
    setFeedback(null);
    try {
      const res = await fetch(`/api/accounting/invoices/${inv.id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: remaining,
          depositAccountNumber: '1020',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record payment');
      setFeedback({
        type: 'ok',
        msg: `Received ${formatPrice(remaining)} for ${inv.invoiceNumber} -> Deposited to Checking (1020).`,
      });
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'err', msg: err.message });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-serif-classic text-lg font-bold text-[#f5f3ec] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#d4af37]" />
            <span>Customers & Accounts Receivable (Invoicing)</span>
          </h3>
          <p className="text-xs text-[#8da396]">
            Issue clinical invoices, record customer payments into Bank (1020), and monitor A/R Aging
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((p) => !p)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#d4af37] text-black text-xs font-bold hover:brightness-110 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showForm ? 'Close Invoice Form' : 'Create Customer Invoice'}</span>
        </button>
      </div>

      {/* A/R Aging Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-lg bg-[#05110a] border border-[#1b3b2f]">
          <div className="text-[10px] uppercase tracking-wider text-[#8da396]">Current</div>
          <div className="text-base font-bold font-mono tabular-nums text-[#f5f3ec] mt-0.5">
            <span dir="ltr">{formatPrice(aging.current)}</span>
          </div>
        </div>
        <div className="p-3.5 rounded-lg bg-[#05110a] border border-[#1b3b2f]">
          <div className="text-[10px] uppercase tracking-wider text-[#8da396]">1–30 Days</div>
          <div className="text-base font-bold font-mono tabular-nums text-amber-300 mt-0.5">
            <span dir="ltr">{formatPrice(aging.days1to30)}</span>
          </div>
        </div>
        <div className="p-3.5 rounded-lg bg-[#05110a] border border-[#1b3b2f]">
          <div className="text-[10px] uppercase tracking-wider text-[#8da396]">31–60 Days</div>
          <div className="text-base font-bold font-mono tabular-nums text-amber-400 mt-0.5">
            <span dir="ltr">{formatPrice(aging.days31to60)}</span>
          </div>
        </div>
        <div className="p-3.5 rounded-lg bg-[#05110a] border border-[#1b3b2f]">
          <div className="text-[10px] uppercase tracking-wider text-[#8da396]">61+ Days</div>
          <div className="text-base font-bold font-mono tabular-nums text-red-400 mt-0.5">
            <span dir="ltr">{formatPrice(aging.days61Plus)}</span>
          </div>
        </div>
        <div className="p-3.5 rounded-lg bg-[#07160f] border border-[#d4af37]/60 col-span-2 sm:col-span-1">
          <div className="text-[10px] uppercase tracking-wider text-[#d4af37]">Total Open A/R</div>
          <div className="text-base font-bold font-mono tabular-nums text-[#d4af37] mt-0.5">
            <span dir="ltr">{formatPrice(aging.totalOpen)}</span>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
            feedback.type === 'ok'
              ? 'bg-emerald-950/50 border-emerald-700 text-emerald-300'
              : 'bg-red-950/50 border-red-700 text-red-300'
          }`}
        >
          {feedback.type === 'ok' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Create Invoice Form */}
      {showForm && (
        <form
          onSubmit={handleCreateInvoice}
          className="p-4 rounded-xl bg-[#05110a] border border-[#1b3b2f] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          <div>
            <label className="block text-[11px] font-semibold text-[#a6b6ad] mb-1">
              Customer / Patient Name
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Patient or Corporate Account"
              className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#a6b6ad] mb-1">
              Customer Email
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="billing@customer.af"
              className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#a6b6ad] mb-1">
              Revenue GL Account
            </label>
            <select
              value={revenueAccountNumber}
              onChange={(e) => setRevenueAccountNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
            >
              <option value="4010">4010 · Clinical Consultation Revenue</option>
              <option value="4020">4020 · Herbal Pharmacy Sales</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#a6b6ad] mb-1">
              Subtotal ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              required
              value={subtotal}
              onChange={(e) => setSubtotal(e.target.value)}
              placeholder="140.00"
              className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-[#1b3b2f] text-xs font-mono text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#a6b6ad] mb-1">
              Sales Tax ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={taxAmount}
              onChange={(e) => setTaxAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-[#1b3b2f] text-xs font-mono text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#a6b6ad] mb-1">
              Due Date
            </label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-[#1b3b2f] text-xs font-mono text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-[#a6b6ad] mb-1">
              Services / Remedies Description
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., VIP Unani Consultation + Compounded Tonic"
              className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Issuing...' : 'Issue Invoice & Post to GL'}
            </button>
          </div>
        </form>
      )}

      {/* Invoices Table */}
      <div className="rounded-xl bg-[#07160f] border border-[#1b3b2f] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#05110a] border-b border-[#1b3b2f] text-[#8da396] uppercase text-[11px]">
                <th className="py-2.5 px-4">Invoice #</th>
                <th className="py-2.5 px-4">Customer</th>
                <th className="py-2.5 px-4">Due Date</th>
                <th className="py-2.5 px-4 text-right">Total</th>
                <th className="py-2.5 px-4 text-right">Paid</th>
                <th className="py-2.5 px-4 text-right">Balance Due</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b3b2f]/60">
              {invoices.map((inv) => {
                const balanceDue = Math.max(0, inv.totalAmount - inv.amountPaid);
                return (
                  <tr key={inv.id} className="hover:bg-[#0b2117] transition-colors">
                    <td className="py-2.5 px-4 font-mono font-bold text-[#d4af37] tabular-nums">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-[#f5f3ec]">{inv.customerName}</div>
                      {inv.notes && (
                        <div className="text-[11px] text-[#8da396] line-clamp-1">{inv.notes}</div>
                      )}
                    </td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-[#a6b6ad]">
                      {inv.dueDate}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[#f5f3ec] whitespace-nowrap">
                      <span dir="ltr">{formatPrice(inv.totalAmount)}</span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-emerald-400 whitespace-nowrap">
                      <span dir="ltr">{formatPrice(inv.amountPaid)}</span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums font-bold text-amber-300 whitespace-nowrap">
                      <span dir="ltr">{formatPrice(balanceDue)}</span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                            : inv.status === 'Partial'
                              ? 'bg-sky-950/60 border-sky-700 text-sky-300'
                              : 'bg-amber-950/60 border-amber-700 text-amber-300'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {balanceDue > 0 ? (
                        <button
                          type="button"
                          disabled={busyId === inv.id}
                          onClick={() => handleReceivePayment(inv)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer disabled:opacity-50"
                        >
                          <DollarSign className="w-3 h-3" />
                          <span>{busyId === inv.id ? 'Recording...' : 'Receive Payment'}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#8da396]">Settled</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
