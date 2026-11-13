import React, { useState, useEffect, useCallback } from 'react';
import { Landmark, CheckSquare, Square, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { BankReconciliationLog, BankRegisterLine } from '../../types/clinic';
import { calculateReconciliationSummary } from '../../utils/accountingEngine';

interface BankingReconcilePanelProps {
  onRefreshAll: () => void;
}

export const BankingReconcilePanel: React.FC<BankingReconcilePanelProps> = ({
  onRefreshAll,
}) => {
  const [accountNumber, setAccountNumber] = useState<'1020' | '1010'>('1020');
  const [bookBalance, setBookBalance] = useState(0);
  const [prevReconciledBalance, setPrevReconciledBalance] = useState(0);
  const [registerLines, setRegisterLines] = useState<BankRegisterLine[]>([]);
  const [history, setHistory] = useState<BankReconciliationLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Interactive MOA 2009 Bank Reconciliation state
  const [statementDate, setStatementDate] = useState(new Date().toISOString().slice(0, 10));
  const [statementBalanceInput, setStatementBalanceInput] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const loadBanking = useCallback(async (acct: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/accounting/banking?accountNumber=${acct}`);
      if (res.ok) {
        const data = await res.json();
        setBookBalance(data.currentBookBalance || 0);
        setPrevReconciledBalance(data.previouslyReconciledBalance || 0);
        setRegisterLines(data.registerLines || []);
        setHistory(data.history || []);
        setSelectedIds([]);
        setStatementBalanceInput(String(data.currentBookBalance ?? 0));
      }
    } catch (err) {
      console.error('Failed to load bank register:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanking(accountNumber);
  }, [accountNumber, loadBanking]);

  const unreconciledLines = registerLines.filter((l) => !l.reconciled);
  const selectedSet = new Set(selectedIds);
  const selectedLines = unreconciledLines.filter((l) => selectedSet.has(l.lineId));

  const recSummary = calculateReconciliationSummary(
    parseFloat(statementBalanceInput) || 0,
    prevReconciledBalance,
    selectedLines
  );

  const toggleLine = (lineId: number) => {
    setSelectedIds((prev) =>
      prev.includes(lineId) ? prev.filter((id) => id !== lineId) : [...prev, lineId]
    );
  };

  const selectAllUnreconciled = () => {
    setSelectedIds(unreconciledLines.map((l) => l.lineId));
  };

  const handleCompleteReconciliation = async () => {
    setFeedback(null);
    if (!recSummary.canComplete) {
      setFeedback({
        type: 'err',
        msg: `Statement difference must be $0.00 before finishing (currently $${recSummary.difference.toFixed(2)}).`,
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/accounting/reconcile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountNumber,
          statementDate,
          statementEndingBalance: parseFloat(statementBalanceInput) || 0,
          selectedLineIds: selectedIds,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reconciliation failed');

      setFeedback({
        type: 'ok',
        msg: `Bank Statement reconciled through ${statementDate} (${data.reconciliation.clearedLineCount} items locked).`,
      });
      await loadBanking(accountNumber);
      onRefreshAll();
    } catch (err: any) {
      setFeedback({ type: 'err', msg: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Account Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-serif-classic text-lg font-bold text-[#f5f3ec] flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#d4af37]" />
            <span>Banking Register & Account Reconciliation</span>
          </h3>
          <p className="text-xs text-[#8da396]">
            Match posted bank deposits and check disbursements against your monthly bank statement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 rounded-lg bg-[#05110a] border border-[#1b3b2f]">
            <button
              type="button"
              onClick={() => setAccountNumber('1020')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                accountNumber === '1020'
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'text-[#a6b6ad] hover:text-white'
              }`}
            >
              1020 · Checking Bank
            </button>
            <button
              type="button"
              onClick={() => setAccountNumber('1010')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                accountNumber === '1010'
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'text-[#a6b6ad] hover:text-white'
              }`}
            >
              1010 · Cash Drawer
            </button>
          </div>

          <button
            type="button"
            onClick={() => loadBanking(accountNumber)}
            aria-label="Refresh bank register"
            className="p-2 rounded-lg bg-[#05110a] border border-[#1b3b2f] text-[#a6b6ad] hover:text-[#d4af37] cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* MOA 2009 Statement Reconciliation Bar */}
      <div className="p-5 rounded-xl bg-[#07160f] border border-[#1b3b2f] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-[11px] font-semibold text-[#a6b6ad] mb-1">
              Statement Ending Date
            </label>
            <input
              type="date"
              value={statementDate}
              onChange={(e) => setStatementDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#05110a] border border-[#1b3b2f] text-xs font-mono text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#a6b6ad] mb-1">
              Statement Ending Balance ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={statementBalanceInput}
              onChange={(e) => setStatementBalanceInput(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#05110a] border border-[#1b3b2f] text-xs font-mono tabular-nums text-[#d4af37] font-bold focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <div className="p-2.5 rounded-lg bg-[#05110a] border border-[#1b3b2f]">
            <div className="text-[10px] uppercase text-[#8da396]">Book Balance</div>
            <div className="text-sm font-bold font-mono tabular-nums text-[#f5f3ec]">
              ${bookBalance.toFixed(2)}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#05110a] border border-[#1b3b2f]">
            <div className="text-[10px] uppercase text-[#8da396]">Cleared Balance</div>
            <div className="text-sm font-bold font-mono tabular-nums text-sky-300">
              ${recSummary.clearedBalance.toFixed(2)}
            </div>
          </div>
          <div
            className={`p-2.5 rounded-lg border ${
              recSummary.canComplete
                ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                : 'bg-amber-950/60 border-amber-700 text-amber-300'
            }`}
          >
            <div className="text-[10px] uppercase">Difference</div>
            <div className="text-sm font-bold font-mono tabular-nums">
              ${recSummary.difference.toFixed(2)}
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
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.msg}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={selectAllUnreconciled}
              disabled={unreconciledLines.length === 0}
              className="px-3 py-1.5 rounded-lg bg-[#05110a] border border-[#1b3b2f] hover:border-[#d4af37] text-xs font-semibold text-[#f5f3ec] cursor-pointer disabled:opacity-40"
            >
              Mark All Unreconciled Cleared ({unreconciledLines.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              disabled={selectedIds.length === 0}
              className="px-3 py-1.5 rounded-lg bg-[#05110a] border border-[#1b3b2f] text-xs text-[#a6b6ad] hover:text-white cursor-pointer disabled:opacity-40"
            >
              Clear Selection
            </button>
          </div>

          <button
            type="button"
            disabled={submitting || !recSummary.canComplete || selectedIds.length === 0}
            onClick={handleCompleteReconciliation}
            className="px-5 py-2 rounded-lg bg-[#d4af37] text-black text-xs font-bold hover:brightness-110 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting
              ? 'Reconciling...'
              : `Finish Reconciliation (${selectedIds.length} cleared)`}
          </button>
        </div>
      </div>

      {/* Bank Register Transactions Table */}
      <div className="rounded-xl bg-[#07160f] border border-[#1b3b2f] overflow-hidden">
        <div className="p-4 border-b border-[#1b3b2f] flex items-center justify-between">
          <h4 className="font-serif-classic font-bold text-base text-[#f5f3ec]">
            Account Register ({accountNumber})
          </h4>
          <span className="text-xs font-mono text-[#8da396]">
            Prior Reconciled Balance: ${prevReconciledBalance.toFixed(2)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#05110a] border-b border-[#1b3b2f] text-[#8da396] uppercase text-[11px]">
                <th className="py-2.5 px-4 w-12 text-center">Clr</th>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Voucher</th>
                <th className="py-2.5 px-4">Payee / Description</th>
                <th className="py-2.5 px-4 text-right">Deposit (+)</th>
                <th className="py-2.5 px-4 text-right">Payment (-)</th>
                <th className="py-2.5 px-4 text-right">Running Bal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b3b2f]/60">
              {registerLines.map((row) => {
                const isChecked = row.reconciled || selectedSet.has(row.lineId);
                return (
                  <tr
                    key={row.lineId}
                    className={`hover:bg-[#0b2117] transition-colors ${
                      row.reconciled ? 'opacity-75' : ''
                    }`}
                  >
                    <td className="py-2.5 px-4 text-center">
                      {row.reconciled ? (
                        <span
                          title="Locked & Reconciled"
                          className="inline-flex items-center justify-center text-emerald-400 font-bold text-[11px]"
                        >
                          R
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleLine(row.lineId)}
                          aria-label={`Toggle clear for ${row.entryNumber}`}
                          className="text-[#d4af37] hover:brightness-125 cursor-pointer"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4 text-[#8da396]" />
                          )}
                        </button>
                      )}
                    </td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-[#a6b6ad]">
                      {row.entryDate}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-semibold text-[#d4af37]">
                      {row.entryNumber}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="text-[#f5f3ec] font-medium line-clamp-1">{row.memo}</div>
                      <div className="text-[11px] text-[#8da396]">{row.sourceModule}</div>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-emerald-400">
                      {row.debit > 0 ? `$${row.debit.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-amber-300">
                      {row.credit > 0 ? `$${row.credit.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums font-bold text-[#f5f3ec]">
                      ${row.runningBalance.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Past Reconciliation History */}
      {history.length > 0 && (
        <div className="rounded-xl bg-[#07160f] border border-[#1b3b2f] p-4 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
            Completed Reconciliation Audit Log
          </h4>
          <div className="space-y-1.5">
            {history.map((h) => (
              <div
                key={h.id}
                className="flex flex-wrap items-center justify-between text-xs py-1.5 px-3 rounded bg-[#05110a] border border-[#1b3b2f]"
              >
                <span className="font-mono text-[#f5f3ec]">
                  Statement {h.statementDate} · {h.clearedLineCount} transactions cleared
                </span>
                <span className="font-mono font-bold text-emerald-400 tabular-nums">
                  Ending Balance: ${h.statementEndingBalance.toFixed(2)} (Diff: $0.00)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
