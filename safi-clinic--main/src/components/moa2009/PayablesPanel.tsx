import React, { useState } from 'react';
import { Truck, Plus, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { ApBillRecord, VendorRecord } from '../../types/clinic';
import { AgingBucketsSummary } from '../../utils/accountingEngine';
import { useCurrency } from '../../context/CurrencyContext';

interface PayablesPanelProps {
  vendors: VendorRecord[];
  bills: ApBillRecord[];
  aging: AgingBucketsSummary;
  onRefresh: () => void;
}

export const PayablesPanel: React.FC<PayablesPanelProps> = ({
  vendors,
  bills,
  aging,
  onRefresh,
}) => {
  const { formatPrice } = useCurrency();
  const [showBillForm, setShowBillForm] = useState(false);
  const [vendorId, setVendorId] = useState<string>(vendors[0]?.id ? String(vendors[0].id) : '');
  const [expenseAccountNumber, setExpenseAccountNumber] = useState('1200');
  const [totalAmount, setTotalAmount] = useState('');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
  );
  const [memo, setMemo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const handleEnterBill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/accounting/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: Number(vendorId || vendors[0]?.id),
          expenseAccountNumber,
          totalAmount: parseFloat(totalAmount) || 0,
          dueDate,
          memo,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to enter vendor bill');

      setFeedback({
        type: 'ok',
        msg: `Vendor Bill ${data.bill.billNumber} entered -> Credited A/P (Acct 2010).`,
      });
      setTotalAmount('');
      setMemo('');
      setShowBillForm(false);
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'err', msg: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayBill = async (bill: ApBillRecord) => {
    const remaining = Math.max(0, bill.totalAmount - bill.amountPaid);
    if (remaining <= 0) return;

    setBusyId(bill.id);
    setFeedback(null);
    try {
      const res = await fetch(`/api/accounting/bills/${bill.id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: remaining,
          paymentAccountNumber: '1020',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to pay bill');

      setFeedback({
        type: 'ok',
        msg: `Paid ${formatPrice(remaining)} for ${bill.billNumber} via Main Checking (1020).`,
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
            <Truck className="w-4 h-4 text-[#d4af37]" />
            <span>Vendors & Accounts Payable (Bills)</span>
          </h3>
          <p className="text-xs text-[#8da396]">
            Enter botanical supplier bills, disburse payments from Checking (1020), and track A/P Aging
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowBillForm((p) => !p)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#d4af37] text-black text-xs font-bold hover:brightness-110 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showBillForm ? 'Close Bill Form' : 'Enter Vendor Bill'}</span>
        </button>
      </div>

      {/* A/P Aging Summary */}
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
        <div className="p-3.5 rounded-lg bg-[#07160f] border border-amber-600/60 col-span-2 sm:col-span-1">
          <div className="text-[10px] uppercase tracking-wider text-amber-300">Total Open A/P</div>
          <div className="text-base font-bold font-mono tabular-nums text-amber-300 mt-0.5">
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

      {/* Enter Vendor Bill Form */}
      {showBillForm && (
        <form
          onSubmit={handleEnterBill}
          className="p-4 rounded-xl bg-[#05110a] border border-[#1b3b2f] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end"
        >
          <div>
            <label className="block text-[11px] font-semibold text-[#a6b6ad] mb-1">
              Supplier / Vendor
            </label>
            <select
              value={vendorId || vendors[0]?.id || ''}
              onChange={(e) => setVendorId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#a6b6ad] mb-1">
              Charge GL Account
            </label>
            <select
              value={expenseAccountNumber}
              onChange={(e) => setExpenseAccountNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
            >
              <option value="1200">1200 · Herbal Inventory Asset</option>
              <option value="5100">5100 · Clinic Overhead & Utilities</option>
              <option value="5200">5200 · Supplier & Apothecary Expenses</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#a6b6ad] mb-1">
              Bill Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              required
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="250.00"
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
          <div>
            <label className="block text-[11px] font-semibold text-[#a6b6ad] mb-1">
              Bill Memo
            </label>
            <input
              type="text"
              required
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Raw botanical shipment"
              className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-5 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Saving Bill...' : 'Enter Bill & Credit A/P'}
            </button>
          </div>
        </form>
      )}

      {/* Bills Table */}
      <div className="rounded-xl bg-[#07160f] border border-[#1b3b2f] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#05110a] border-b border-[#1b3b2f] text-[#8da396] uppercase text-[11px]">
                <th className="py-2.5 px-4">Bill #</th>
                <th className="py-2.5 px-4">Vendor</th>
                <th className="py-2.5 px-4">GL Acct</th>
                <th className="py-2.5 px-4">Due Date</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
                <th className="py-2.5 px-4 text-right">Paid</th>
                <th className="py-2.5 px-4 text-right">Balance Due</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b3b2f]/60">
              {bills.map((bill) => {
                const balanceDue = Math.max(0, bill.totalAmount - bill.amountPaid);
                return (
                  <tr key={bill.id} className="hover:bg-[#0b2117] transition-colors">
                    <td className="py-2.5 px-4 font-mono font-bold text-[#d4af37] tabular-nums">
                      {bill.billNumber}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-[#f5f3ec]">{bill.vendorName}</div>
                      {bill.memo && (
                        <div className="text-[11px] text-[#8da396] line-clamp-1">{bill.memo}</div>
                      )}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[#a6b6ad]">
                      {bill.expenseAccountNumber}
                    </td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-[#a6b6ad]">
                      {bill.dueDate}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[#f5f3ec] whitespace-nowrap">
                      <span dir="ltr">{formatPrice(bill.totalAmount)}</span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-emerald-400 whitespace-nowrap">
                      <span dir="ltr">{formatPrice(bill.amountPaid)}</span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums font-bold text-amber-300 whitespace-nowrap">
                      <span dir="ltr">{formatPrice(balanceDue)}</span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                          bill.status === 'Paid'
                            ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                            : 'bg-amber-950/60 border-amber-700 text-amber-300'
                        }`}
                      >
                        {bill.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {balanceDue > 0 ? (
                        <button
                          type="button"
                          disabled={busyId === bill.id}
                          onClick={() => handlePayBill(bill)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#d4af37] text-black hover:brightness-110 text-[11px] font-bold cursor-pointer disabled:opacity-50"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>{busyId === bill.id ? 'Paying...' : 'Pay Bill'}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#8da396]">Paid</span>
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
