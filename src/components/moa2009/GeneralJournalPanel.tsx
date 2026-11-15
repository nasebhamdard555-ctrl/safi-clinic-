import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { GlAccountRecord, JournalEntryRecord } from '../../types/clinic';
import { validateJournalEntry } from '../../utils/accountingEngine';
import { useCurrency } from '../../context/CurrencyContext';

interface GeneralJournalPanelProps {
  accounts: GlAccountRecord[];
  entries: JournalEntryRecord[];
  onRefresh: () => void;
}

interface DraftLine {
  accountNumber: string;
  description: string;
  debit: string;
  credit: string;
}

export const GeneralJournalPanel: React.FC<GeneralJournalPanelProps> = ({
  accounts,
  entries,
  onRefresh,
}) => {
  const { formatPrice } = useCurrency();
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [memo, setMemo] = useState('');
  const [lines, setLines] = useState<DraftLine[]>([
    { accountNumber: '5100', description: '', debit: '', credit: '' },
    { accountNumber: '1020', description: '', debit: '', credit: '' },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(
    entries.length > 0 ? entries[0].id : null
  );

  const parsedLines = lines.map((l) => ({
    accountNumber: l.accountNumber,
    description: l.description,
    debit: parseFloat(l.debit) || 0,
    credit: parseFloat(l.credit) || 0,
  }));
  const balanceCheck = validateJournalEntry(parsedLines);

  const updateLine = (idx: number, field: keyof DraftLine, value: string) => {
    setLines((prev) =>
      prev.map((row, i) => {
        if (i !== idx) return row;
        if (field === 'debit' && parseFloat(value) > 0) {
          return { ...row, debit: value, credit: '' };
        }
        if (field === 'credit' && parseFloat(value) > 0) {
          return { ...row, credit: value, debit: '' };
        }
        return { ...row, [field]: value };
      })
    );
  };

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      {
        accountNumber: accounts[0]?.accountNumber || '1020',
        description: '',
        debit: '',
        credit: '',
      },
    ]);
  };

  const removeLine = (idx: number) => {
    if (lines.length <= 2) return;
    setLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlePostEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!balanceCheck.isValid) {
      setFeedback({ type: 'err', msg: balanceCheck.error || 'Debits must equal Credits.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/accounting/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entryDate,
          memo: memo.trim() || 'General Journal Adjustment',
          lines: parsedLines,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post journal voucher');

      setFeedback({
        type: 'ok',
        msg: `Posted Journal Entry ${data.entry.entryNumber} (${formatPrice(balanceCheck.totalDebits)} balanced).`,
      });
      setMemo('');
      setLines([
        { accountNumber: '5100', description: '', debit: '', credit: '' },
        { accountNumber: '1020', description: '', debit: '', credit: '' },
      ]);
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'err', msg: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Double-Entry Journal Voucher */}
      <form
        onSubmit={handlePostEntry}
        className="p-5 rounded-xl bg-[#07160f] border border-[#1b3b2f] space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1b3b2f]">
          <div>
            <h3 className="font-serif-classic text-lg font-bold text-[#f5f3ec] flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#d4af37]" />
              <span>Make General Journal Entry</span>
            </h3>
            <p className="text-xs text-[#8da396]">
              Microsoft Office Accounting 2009 Double-Entry Voucher · Total Debits must equal Total Credits
            </p>
          </div>
          <div
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold tabular-nums flex items-center gap-1.5 ${
              balanceCheck.isValid
                ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                : balanceCheck.totalDebits === 0 && balanceCheck.totalCredits === 0
                  ? 'bg-[#05110a] border-[#1b3b2f] text-[#a6b6ad]'
                  : 'bg-amber-950/60 border-amber-700 text-amber-300'
            }`}
          >
            {balanceCheck.isValid ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Balanced ({formatPrice(0)} diff)</span>
              </>
            ) : balanceCheck.totalDebits === 0 && balanceCheck.totalCredits === 0 ? (
              <span>Ready · Enter Debit &amp; Credit Lines</span>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>
                  Out of Balance: {formatPrice(Math.abs(balanceCheck.difference))}
                </span>
              </>
            )}
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
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.msg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-[#a6b6ad] mb-1">
              Posting Date
            </label>
            <input
              type="date"
              required
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#05110a] border border-[#1b3b2f] text-xs font-mono text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-[#a6b6ad] mb-1">
              Journal Memo / Narration
            </label>
            <input
              type="text"
              required
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="e.g., Monthly clinic rent accrual, owner capital injection, inventory write-off"
              className="w-full px-3 py-2 rounded-lg bg-[#05110a] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        {/* Journal Lines Table */}
        <div className="overflow-x-auto rounded-lg border border-[#1b3b2f]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#05110a] border-b border-[#1b3b2f] text-[#8da396] uppercase text-[11px]">
                <th className="py-2 px-3">GL Account</th>
                <th className="py-2 px-3">Line Description</th>
                <th className="py-2 px-3 text-right w-32">Debit ($)</th>
                <th className="py-2 px-3 text-right w-32">Credit ($)</th>
                <th className="py-2 px-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b3b2f]/60">
              {lines.map((line, idx) => (
                <tr key={idx} className="bg-[#07160f]">
                  <td className="py-2 px-3">
                    <select
                      value={line.accountNumber}
                      onChange={(e) => updateLine(idx, 'accountNumber', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-[#05110a] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                    >
                      {accounts.map((a) => (
                        <option key={a.id} value={a.accountNumber}>
                          {a.accountNumber} · {a.name} ({a.accountType})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={line.description}
                      onChange={(e) => updateLine(idx, 'description', e.target.value)}
                      placeholder="Line memo..."
                      className="w-full px-2.5 py-1.5 rounded bg-[#05110a] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={line.debit}
                      onChange={(e) => updateLine(idx, 'debit', e.target.value)}
                      placeholder="0.00"
                      className="w-full px-2.5 py-1.5 rounded bg-[#05110a] border border-[#1b3b2f] text-xs text-right font-mono tabular-nums text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={line.credit}
                      onChange={(e) => updateLine(idx, 'credit', e.target.value)}
                      placeholder="0.00"
                      className="w-full px-2.5 py-1.5 rounded bg-[#05110a] border border-[#1b3b2f] text-xs text-right font-mono tabular-nums text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeLine(idx)}
                      disabled={lines.length <= 2}
                      className="p-1 text-[#8da396] hover:text-red-400 disabled:opacity-30 cursor-pointer"
                      aria-label="Remove journal line"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#05110a] border-t border-[#1b3b2f] font-bold">
                <td colSpan={2} className="py-2.5 px-3 text-right text-[#a6b6ad]">
                  Voucher Totals
                </td>
                <td className="py-2.5 px-3 text-right font-mono tabular-nums text-[#d4af37] whitespace-nowrap">
                  <span dir="ltr">{formatPrice(balanceCheck.totalDebits)}</span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono tabular-nums text-[#d4af37] whitespace-nowrap">
                  <span dir="ltr">{formatPrice(balanceCheck.totalCredits)}</span>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={addLine}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#05110a] border border-[#1b3b2f] hover:border-[#d4af37] text-xs font-semibold text-[#f5f3ec] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Add Line</span>
          </button>

          <button
            type="submit"
            disabled={submitting || !balanceCheck.isValid}
            className="px-5 py-2.5 rounded-lg bg-[#d4af37] text-black text-xs font-bold hover:brightness-110 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? 'Posting...' : 'Post Balanced Journal Entry'}
          </button>
        </div>
      </form>

      {/* Posted Journal Register Audit Trail */}
      <div className="rounded-xl bg-[#07160f] border border-[#1b3b2f] overflow-hidden">
        <div className="p-4 border-b border-[#1b3b2f] flex items-center justify-between">
          <div>
            <h4 className="font-serif-classic font-bold text-base text-[#f5f3ec]">
              General Journal Audit Register
            </h4>
            <p className="text-[11px] text-[#8da396]">
              Every automatic clinic sale, invoice, vendor bill, and manual adjustment
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-[#a6b6ad]">
            {entries.length} posted vouchers
          </span>
        </div>

        <div className="divide-y divide-[#1b3b2f]/60">
          {entries.map((entry) => {
            const isOpen = expandedId === entry.id;
            return (
              <div key={entry.id} className="bg-[#07160f]">
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : entry.id)}
                  className="w-full px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-left hover:bg-[#0b2117] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-bold text-[#d4af37] tabular-nums shrink-0">
                      {entry.entryNumber}
                    </span>
                    <span className="font-mono text-[11px] text-[#8da396] tabular-nums shrink-0">
                      {entry.entryDate}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#05110a] border border-[#1b3b2f] text-[#a6b6ad] shrink-0">
                      {entry.sourceModule}
                    </span>
                    <span className="text-xs text-[#f5f3ec] font-medium truncate">
                      {entry.memo}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span dir="ltr" className="font-mono text-xs font-bold text-emerald-400 tabular-nums whitespace-nowrap">
                      {formatPrice(entry.totalDebits)}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#8da396]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#8da396]" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-3 pt-1 bg-[#05110a]/70">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="text-[#8da396] border-b border-[#1b3b2f]">
                          <th className="py-1.5 px-2">Acct #</th>
                          <th className="py-1.5 px-2">Account</th>
                          <th className="py-1.5 px-2">Description</th>
                          <th className="py-1.5 px-2 text-right">Debit</th>
                          <th className="py-1.5 px-2 text-right">Credit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1b3b2f]/40">
                        {entry.lines.map((line) => (
                          <tr key={line.id}>
                            <td className="py-1.5 px-2 font-mono text-[#d4af37] tabular-nums">
                              {line.accountNumber}
                            </td>
                            <td className="py-1.5 px-2 text-[#f5f3ec] font-medium">
                              {line.accountName}
                            </td>
                            <td className="py-1.5 px-2 text-[#8da396]">
                              {line.description || '-'}
                            </td>
                            <td className="py-1.5 px-2 text-right font-mono tabular-nums text-[#f5f3ec] whitespace-nowrap">
                              {line.debit > 0 ? <span dir="ltr">{formatPrice(line.debit)}</span> : '—'}
                            </td>
                            <td className="py-1.5 px-2 text-right font-mono tabular-nums text-[#a6b6ad] whitespace-nowrap">
                              {line.credit > 0 ? <span dir="ltr">{formatPrice(line.credit)}</span> : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
