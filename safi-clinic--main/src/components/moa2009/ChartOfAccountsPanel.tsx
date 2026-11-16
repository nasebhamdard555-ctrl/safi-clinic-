import React, { useState, useMemo } from 'react';
import { BookOpen, Plus, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { GlAccountRecord, MoaAccountType } from '../../types/clinic';
import { getNormalBalanceForType } from '../../utils/accountingEngine';
import { useCurrency } from '../../context/CurrencyContext';

interface ChartOfAccountsPanelProps {
  accounts: GlAccountRecord[];
  onRefresh: () => void;
}

const ACCOUNT_TYPES: Array<'All' | MoaAccountType> = [
  'All',
  'Asset',
  'Liability',
  'Equity',
  'Revenue',
  'COGS',
  'Expense',
];

export const ChartOfAccountsPanel: React.FC<ChartOfAccountsPanelProps> = ({
  accounts,
  onRefresh,
}) => {
  const { formatPrice } = useCurrency();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | MoaAccountType>('All');
  const [showAddForm, setShowAddForm] = useState(false);

  const [accountNumber, setAccountNumber] = useState('');
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState<MoaAccountType>('Expense');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return accounts.filter((a) => {
      const matchType = typeFilter === 'All' || a.accountType === typeFilter;
      const matchQuery =
        !q ||
        a.accountNumber.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        (a.description || '').toLowerCase().includes(q);
      return matchType && matchQuery;
    });
  }, [accounts, search, typeFilter]);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/accounting/coa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountNumber,
          name,
          accountType,
          description,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create GL account');
      setFeedback({
        type: 'ok',
        msg: `Account #${accountNumber} (${name}) added to Chart of Accounts.`,
      });
      setAccountNumber('');
      setName('');
      setDescription('');
      setShowAddForm(false);
      onRefresh();
    } catch (err: any) {
      setFeedback({ type: 'err', msg: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="font-serif-classic text-lg font-bold text-[#f5f3ec] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#d4af37]" />
            <span>Chart of Accounts (1000–5999)</span>
          </h3>
          <p className="text-xs text-[#8da396]">
            Standard Microsoft Office Accounting 2009 general ledger numbering & live posted balances
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm((p) => !p)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#d4af37] text-black text-xs font-bold hover:brightness-110 transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Close Form' : 'New GL Account'}</span>
        </button>
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

      {/* New GL Account Drawer */}
      {showAddForm && (
        <form
          onSubmit={handleCreateAccount}
          className="p-4 rounded-xl bg-[#05110a] border border-[#1b3b2f] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end"
        >
          <div>
            <label className="block text-[11px] font-semibold text-[#a6b6ad] mb-1">
              Account # (e.g. 5300)
            </label>
            <input
              type="text"
              required
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="5300"
              className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-[#1b3b2f] text-xs font-mono text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-[11px] font-semibold text-[#a6b6ad] mb-1">
              Account Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Clinic Marketing & Outreach"
              className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#a6b6ad] mb-1">
              Type (Normal: {getNormalBalanceForType(accountType)})
            </label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as MoaAccountType)}
              className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
            >
              <option value="Asset">Asset (1000s)</option>
              <option value="Liability">Liability (2000s)</option>
              <option value="Equity">Equity (3000s)</option>
              <option value="Revenue">Revenue (4000s)</option>
              <option value="COGS">COGS (5000s)</option>
              <option value="Expense">Expense (5100s+)</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#a6b6ad] mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional note"
              className="w-full px-3 py-2 rounded-lg bg-[#07160f] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Create Account'}
          </button>
        </form>
      )}

      {/* Search + Type Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#8da396] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by account #, name, or description..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#05110a] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ACCOUNT_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer ${
                typeFilter === t
                  ? 'bg-[#122e22] border-[#d4af37] text-[#d4af37]'
                  : 'bg-[#05110a] border-[#1b3b2f] text-[#a6b6ad] hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* High-Density COA Ledger Grid */}
      <div className="rounded-xl bg-[#07160f] border border-[#1b3b2f] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#05110a] border-b border-[#1b3b2f] text-[#8da396] uppercase text-[11px] tracking-wider">
                <th className="py-2.5 px-4">Acct #</th>
                <th className="py-2.5 px-4">Account Name</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Normal</th>
                <th className="py-2.5 px-4 text-right">Total Debits</th>
                <th className="py-2.5 px-4 text-right">Total Credits</th>
                <th className="py-2.5 px-4 text-right">Current Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b3b2f]/60">
              {filtered.map((acct) => (
                <tr key={acct.id} className="hover:bg-[#0b2117] transition-colors">
                  <td className="py-2.5 px-4 font-mono font-bold text-[#d4af37] tabular-nums">
                    {acct.accountNumber}
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="font-semibold text-[#f5f3ec]">{acct.name}</div>
                    {acct.description && (
                      <div className="text-[11px] text-[#8da396]">{acct.description}</div>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-[#a6b6ad] font-medium">{acct.accountType}</td>
                  <td className="py-2.5 px-4 text-[#8da396]">{acct.normalBalance}</td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[#a6b6ad] whitespace-nowrap">
                    <span dir="ltr">{formatPrice(acct.totalDebits)}</span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[#a6b6ad] whitespace-nowrap">
                    <span dir="ltr">{formatPrice(acct.totalCredits)}</span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums font-bold text-[#f5f3ec] whitespace-nowrap">
                    <span dir="ltr">{formatPrice(acct.balance)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
