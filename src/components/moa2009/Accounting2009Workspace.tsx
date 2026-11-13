import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  FileSpreadsheet,
  FileText,
  Truck,
  Landmark,
  Scale,
  RefreshCw,
} from 'lucide-react';
import {
  ApBillRecord,
  ArInvoiceRecord,
  GlAccountRecord,
  JournalEntryRecord,
  VendorRecord,
} from '../../types/clinic';
import {
  AgingBucketsSummary,
  BalanceSheetReport,
  IncomeStatementReport,
  TrialBalanceReport,
} from '../../utils/accountingEngine';
import { ChartOfAccountsPanel } from './ChartOfAccountsPanel';
import { GeneralJournalPanel } from './GeneralJournalPanel';
import { ReceivablesPanel } from './ReceivablesPanel';
import { PayablesPanel } from './PayablesPanel';
import { BankingReconcilePanel } from './BankingReconcilePanel';
import { FinancialReportsPanel } from './FinancialReportsPanel';

interface Accounting2009WorkspaceProps {
  onLedgerChanged?: () => void;
}

type MoaSubView =
  | 'coa'
  | 'journal'
  | 'receivables'
  | 'payables'
  | 'banking'
  | 'reports';

const EMPTY_AGING: AgingBucketsSummary = {
  current: 0,
  days1to30: 0,
  days31to60: 0,
  days61Plus: 0,
  totalOpen: 0,
  openCount: 0,
};

export const Accounting2009Workspace: React.FC<Accounting2009WorkspaceProps> = ({
  onLedgerChanged,
}) => {
  const [subView, setSubView] = useState<MoaSubView>('coa');
  const [loading, setLoading] = useState(true);

  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().slice(0, 10));
  const [accounts, setAccounts] = useState<GlAccountRecord[]>([]);
  const [journals, setJournals] = useState<JournalEntryRecord[]>([]);
  const [invoices, setInvoices] = useState<ArInvoiceRecord[]>([]);
  const [arAging, setArAging] = useState<AgingBucketsSummary>(EMPTY_AGING);
  const [vendors, setVendors] = useState<VendorRecord[]>([]);
  const [bills, setBills] = useState<ApBillRecord[]>([]);
  const [apAging, setApAging] = useState<AgingBucketsSummary>(EMPTY_AGING);

  const [trialBalance, setTrialBalance] = useState<TrialBalanceReport>({
    rows: [],
    totalDebits: 0,
    totalCredits: 0,
    difference: 0,
    isBalanced: true,
  });
  const [profitAndLoss, setProfitAndLoss] = useState<IncomeStatementReport>({
    revenueRows: [],
    cogsRows: [],
    expenseRows: [],
    totalRevenue: 0,
    totalCogs: 0,
    grossProfit: 0,
    totalExpenses: 0,
    netIncome: 0,
  });
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheetReport>({
    assetRows: [],
    liabilityRows: [],
    equityRows: [],
    totalAssets: 0,
    totalLiabilities: 0,
    totalEquityBeforeIncome: 0,
    currentPeriodNetIncome: 0,
    totalEquity: 0,
    totalLiabilitiesAndEquity: 0,
    difference: 0,
    isBalanced: true,
  });

  const loadWorkspaceData = useCallback(async () => {
    setLoading(true);
    try {
      const [reportsRes, journalsRes, invRes, billsRes] = await Promise.all([
        fetch('/api/accounting/reports'),
        fetch('/api/accounting/journals'),
        fetch('/api/accounting/invoices'),
        fetch('/api/accounting/vendors-bills'),
      ]);

      if (reportsRes.ok) {
        const rep = await reportsRes.json();
        setAsOfDate(rep.asOfDate || new Date().toISOString().slice(0, 10));
        setAccounts(rep.accounts || []);
        setTrialBalance(rep.trialBalance);
        setProfitAndLoss(rep.profitAndLoss);
        setBalanceSheet(rep.balanceSheet);
      }
      if (journalsRes.ok) {
        const jData = await journalsRes.json();
        setJournals(jData.entries || []);
      }
      if (invRes.ok) {
        const iData = await invRes.json();
        setInvoices(iData.invoices || []);
        setArAging(iData.aging || EMPTY_AGING);
      }
      if (billsRes.ok) {
        const bData = await billsRes.json();
        setVendors(bData.vendors || []);
        setBills(bData.bills || []);
        setApAging(bData.aging || EMPTY_AGING);
      }
    } catch (err) {
      console.error('Failed to load MOA 2009 workspace:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkspaceData();
  }, [loadWorkspaceData]);

  const handleRefreshAll = () => {
    loadWorkspaceData();
    onLedgerChanged?.();
  };

  const navItems: Array<{ id: MoaSubView; label: string; icon: React.ReactNode }> = [
    { id: 'coa', label: 'Chart of Accounts', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'journal', label: 'General Journal', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
    { id: 'receivables', label: 'Customers & A/R', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'payables', label: 'Vendors & A/P', icon: <Truck className="w-3.5 h-3.5" /> },
    { id: 'banking', label: 'Bank Reconcile', icon: <Landmark className="w-3.5 h-3.5" /> },
    { id: 'reports', label: 'P&L / Balance Sheet', icon: <Scale className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Executive Double-Entry Position Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#07160f] border border-[#1b3b2f]">
          <div className="text-[11px] uppercase tracking-wider text-[#8da396] font-semibold">
            Total Assets
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#f5f3ec] mt-1">
            ${balanceSheet.totalAssets.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#a6b6ad] mt-0.5">
            Cash + Bank + A/R + Inventory
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#07160f] border border-[#1b3b2f]">
          <div className="text-[11px] uppercase tracking-wider text-[#8da396] font-semibold">
            Total Liabilities
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-300 mt-1">
            ${balanceSheet.totalLiabilities.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#a6b6ad] mt-0.5">
            Accounts Payable + Sales Tax
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#07160f] border border-[#1b3b2f]">
          <div className="text-[11px] uppercase tracking-wider text-[#8da396] font-semibold">
            Net Owner&apos;s Equity
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#d4af37] mt-1">
            ${balanceSheet.totalEquity.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#a6b6ad] mt-0.5">
            Capital + Current Net Income
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#07160f] border border-emerald-700/60">
          <div className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold">
            GL Net Income
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
            ${profitAndLoss.netIncome.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-0.5 font-mono">
            {trialBalance.isBalanced ? 'Trial Balance Verified' : 'Check Trial Balance'}
          </div>
        </div>
      </div>

      {/* MOA 2009 Module Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-xl bg-[#05110a] border border-[#1b3b2f]">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Accounting 2009 Modules">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={subView === item.id}
              onClick={() => setSubView(item.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                subView === item.id
                  ? 'bg-[#122e22] border border-[#d4af37] text-[#d4af37]'
                  : 'border border-transparent text-[#a6b6ad] hover:text-white hover:bg-[#07160f]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleRefreshAll}
          aria-label="Reload Accounting 2009 workspace"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#07160f] border border-[#1b3b2f] hover:border-[#d4af37] text-xs text-[#a6b6ad] hover:text-[#d4af37] cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Books</span>
        </button>
      </div>

      {/* Active Sub-Module */}
      {subView === 'coa' && (
        <ChartOfAccountsPanel accounts={accounts} onRefresh={handleRefreshAll} />
      )}
      {subView === 'journal' && (
        <GeneralJournalPanel
          accounts={accounts}
          entries={journals}
          onRefresh={handleRefreshAll}
        />
      )}
      {subView === 'receivables' && (
        <ReceivablesPanel
          invoices={invoices}
          aging={arAging}
          onRefresh={handleRefreshAll}
        />
      )}
      {subView === 'payables' && (
        <PayablesPanel
          vendors={vendors}
          bills={bills}
          aging={apAging}
          onRefresh={handleRefreshAll}
        />
      )}
      {subView === 'banking' && (
        <BankingReconcilePanel onRefreshAll={handleRefreshAll} />
      )}
      {subView === 'reports' && (
        <FinancialReportsPanel
          asOfDate={asOfDate}
          profitAndLoss={profitAndLoss}
          balanceSheet={balanceSheet}
          trialBalance={trialBalance}
        />
      )}
    </div>
  );
};
