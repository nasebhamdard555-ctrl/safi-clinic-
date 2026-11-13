import React, { useState } from 'react';
import { Scale, Download, CheckCircle2, AlertTriangle, Printer } from 'lucide-react';
import {
  BalanceSheetReport,
  IncomeStatementReport,
  TrialBalanceReport,
} from '../../utils/accountingEngine';

interface FinancialReportsPanelProps {
  asOfDate: string;
  profitAndLoss: IncomeStatementReport;
  balanceSheet: BalanceSheetReport;
  trialBalance: TrialBalanceReport;
}

type StatementTab = 'pnl' | 'balance_sheet' | 'trial_balance';

export const FinancialReportsPanel: React.FC<FinancialReportsPanelProps> = ({
  asOfDate,
  profitAndLoss,
  balanceSheet,
  trialBalance,
}) => {
  const [statement, setStatement] = useState<StatementTab>('pnl');

  const handleExportCsv = () => {
    let csv = 'Safi Natural Care Clinic - Microsoft Office Accounting 2009 Report\n';
    csv += `As Of Date,${asOfDate}\n\n`;

    if (statement === 'pnl') {
      csv += 'PROFIT AND LOSS (INCOME STATEMENT)\nAccount #,Account Name,Amount ($)\n';
      profitAndLoss.revenueRows.forEach((r) => {
        csv += `${r.accountNumber},"${r.name}",${r.amount.toFixed(2)}\n`;
      });
      csv += `,Total Revenue,${profitAndLoss.totalRevenue.toFixed(2)}\n`;
      profitAndLoss.cogsRows.forEach((r) => {
        csv += `${r.accountNumber},"${r.name}",${r.amount.toFixed(2)}\n`;
      });
      csv += `,Gross Profit,${profitAndLoss.grossProfit.toFixed(2)}\n`;
      profitAndLoss.expenseRows.forEach((r) => {
        csv += `${r.accountNumber},"${r.name}",${r.amount.toFixed(2)}\n`;
      });
      csv += `,Net Income,${profitAndLoss.netIncome.toFixed(2)}\n`;
    } else if (statement === 'balance_sheet') {
      csv += 'BALANCE SHEET\nSection,Account #,Account Name,Amount ($)\n';
      balanceSheet.assetRows.forEach((r) => {
        csv += `Asset,${r.accountNumber},"${r.name}",${r.amount.toFixed(2)}\n`;
      });
      csv += `Asset,,Total Assets,${balanceSheet.totalAssets.toFixed(2)}\n`;
      balanceSheet.liabilityRows.forEach((r) => {
        csv += `Liability,${r.accountNumber},"${r.name}",${r.amount.toFixed(2)}\n`;
      });
      csv += `Liability,,Total Liabilities,${balanceSheet.totalLiabilities.toFixed(2)}\n`;
      balanceSheet.equityRows.forEach((r) => {
        csv += `Equity,${r.accountNumber},"${r.name}",${r.amount.toFixed(2)}\n`;
      });
      csv += `Equity,,Current Period Net Income,${balanceSheet.currentPeriodNetIncome.toFixed(2)}\n`;
      csv += `Total,,Total Liabilities & Equity,${balanceSheet.totalLiabilitiesAndEquity.toFixed(2)}\n`;
    } else {
      csv += 'TRIAL BALANCE\nAccount #,Account Name,Type,Debit ($),Credit ($)\n';
      trialBalance.rows.forEach((r) => {
        csv += `${r.accountNumber},"${r.name}",${r.accountType},${r.debitBalance.toFixed(2)},${r.creditBalance.toFixed(2)}\n`;
      });
      csv += `,Totals,,${trialBalance.totalDebits.toFixed(2)},${trialBalance.totalCredits.toFixed(2)}\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `safi-clinic-${statement}-${asOfDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Header & Statement Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="font-serif-classic text-lg font-bold text-[#f5f3ec] flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#d4af37]" />
            <span>MOA 2009 Financial Statements</span>
          </h3>
          <p className="text-xs text-[#8da396]">
            Audit-ready statements generated directly from posted double-entry General Ledger lines
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex p-1 rounded-lg bg-[#05110a] border border-[#1b3b2f]">
            <button
              type="button"
              onClick={() => setStatement('pnl')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                statement === 'pnl'
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'text-[#a6b6ad] hover:text-white'
              }`}
            >
              Profit & Loss
            </button>
            <button
              type="button"
              onClick={() => setStatement('balance_sheet')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                statement === 'balance_sheet'
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'text-[#a6b6ad] hover:text-white'
              }`}
            >
              Balance Sheet
            </button>
            <button
              type="button"
              onClick={() => setStatement('trial_balance')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                statement === 'trial_balance'
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'text-[#a6b6ad] hover:text-white'
              }`}
            >
              Trial Balance
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#05110a] border border-[#1b3b2f] hover:border-[#d4af37] text-xs font-semibold text-[#f5f3ec] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#05110a] border border-[#1b3b2f] hover:border-[#d4af37] text-xs font-semibold text-[#f5f3ec] cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Statement 1: Profit & Loss */}
      {statement === 'pnl' && (
        <div className="rounded-xl bg-[#07160f] border border-[#1b3b2f] overflow-hidden">
          <div className="p-5 border-b border-[#1b3b2f] bg-[#05110a] flex justify-between items-center">
            <div>
              <h4 className="font-serif-classic text-base font-bold text-[#f5f3ec]">
                Safi Natural Care Clinic · Profit & Loss (Income Statement)
              </h4>
              <p className="text-[11px] text-[#8da396]">Fiscal Period Through {asOfDate}</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase text-[#8da396]">Net Income</div>
              <div className="text-lg font-bold font-mono tabular-nums text-emerald-400">
                ${profitAndLoss.netIncome.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="p-5 space-y-5 text-xs">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#d4af37] pb-1.5 border-b border-[#1b3b2f]">
                Operating Revenue
              </div>
              <div className="divide-y divide-[#1b3b2f]/50">
                {profitAndLoss.revenueRows.map((r) => (
                  <div key={r.accountNumber} className="py-2 flex justify-between">
                    <span className="text-[#f5f3ec]">
                      <span className="font-mono text-[#8da396] mr-2">{r.accountNumber}</span>
                      {r.name}
                    </span>
                    <span className="font-mono tabular-nums text-[#f5f3ec]">
                      ${r.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="py-2 flex justify-between font-bold text-[#d4af37]">
                  <span>Total Operating Revenue</span>
                  <span className="font-mono tabular-nums">
                    ${profitAndLoss.totalRevenue.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300 pb-1.5 border-b border-[#1b3b2f]">
                Cost of Goods Sold (COGS)
              </div>
              <div className="divide-y divide-[#1b3b2f]/50">
                {profitAndLoss.cogsRows.map((r) => (
                  <div key={r.accountNumber} className="py-2 flex justify-between">
                    <span className="text-[#a6b6ad]">
                      <span className="font-mono text-[#8da396] mr-2">{r.accountNumber}</span>
                      {r.name}
                    </span>
                    <span className="font-mono tabular-nums text-[#a6b6ad]">
                      ${r.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="py-2 flex justify-between font-bold text-[#f5f3ec]">
                  <span>Gross Profit</span>
                  <span className="font-mono tabular-nums">
                    ${profitAndLoss.grossProfit.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#a6b6ad] pb-1.5 border-b border-[#1b3b2f]">
                Operating Expenses
              </div>
              <div className="divide-y divide-[#1b3b2f]/50">
                {profitAndLoss.expenseRows.map((r) => (
                  <div key={r.accountNumber} className="py-2 flex justify-between">
                    <span className="text-[#a6b6ad]">
                      <span className="font-mono text-[#8da396] mr-2">{r.accountNumber}</span>
                      {r.name}
                    </span>
                    <span className="font-mono tabular-nums text-[#a6b6ad]">
                      ${r.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="py-2.5 flex justify-between font-bold text-sm text-emerald-400 border-t border-[#1b3b2f]">
                  <span>Net Operating Income</span>
                  <span className="font-mono tabular-nums">
                    ${profitAndLoss.netIncome.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statement 2: Balance Sheet */}
      {statement === 'balance_sheet' && (
        <div className="rounded-xl bg-[#07160f] border border-[#1b3b2f] overflow-hidden">
          <div className="p-5 border-b border-[#1b3b2f] bg-[#05110a] flex flex-wrap justify-between items-center gap-3">
            <div>
              <h4 className="font-serif-classic text-base font-bold text-[#f5f3ec]">
                Safi Natural Care Clinic · Balance Sheet
              </h4>
              <p className="text-[11px] text-[#8da396]">As of {asOfDate}</p>
            </div>
            <div
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 ${
                balanceSheet.isBalanced
                  ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                  : 'bg-red-950/60 border-red-700 text-red-300'
              }`}
            >
              {balanceSheet.isBalanced ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Assets = Liabilities + Equity</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Out of Balance: ${balanceSheet.difference.toFixed(2)}</span>
                </>
              )}
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* Left: Assets */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#d4af37] pb-1.5 border-b border-[#1b3b2f]">
                Assets
              </div>
              <div className="divide-y divide-[#1b3b2f]/50">
                {balanceSheet.assetRows.map((r) => (
                  <div key={r.accountNumber} className="py-2 flex justify-between">
                    <span className="text-[#f5f3ec]">
                      <span className="font-mono text-[#8da396] mr-2">{r.accountNumber}</span>
                      {r.name}
                    </span>
                    <span className="font-mono tabular-nums text-[#f5f3ec]">
                      ${r.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="py-2.5 flex justify-between font-bold text-sm text-[#d4af37]">
                  <span>Total Assets</span>
                  <span className="font-mono tabular-nums">
                    ${balanceSheet.totalAssets.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Liabilities & Equity */}
            <div className="space-y-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300 pb-1.5 border-b border-[#1b3b2f]">
                  Liabilities
                </div>
                <div className="divide-y divide-[#1b3b2f]/50">
                  {balanceSheet.liabilityRows.map((r) => (
                    <div key={r.accountNumber} className="py-2 flex justify-between">
                      <span className="text-[#f5f3ec]">
                        <span className="font-mono text-[#8da396] mr-2">{r.accountNumber}</span>
                        {r.name}
                      </span>
                      <span className="font-mono tabular-nums text-[#f5f3ec]">
                        ${r.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="py-2 flex justify-between font-bold text-amber-300">
                    <span>Total Liabilities</span>
                    <span className="font-mono tabular-nums">
                      ${balanceSheet.totalLiabilities.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 pb-1.5 border-b border-[#1b3b2f]">
                  Owner&apos;s Equity & Earnings
                </div>
                <div className="divide-y divide-[#1b3b2f]/50">
                  {balanceSheet.equityRows.map((r) => (
                    <div key={r.accountNumber} className="py-2 flex justify-between">
                      <span className="text-[#f5f3ec]">
                        <span className="font-mono text-[#8da396] mr-2">{r.accountNumber}</span>
                        {r.name}
                      </span>
                      <span className="font-mono tabular-nums text-[#f5f3ec]">
                        ${r.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="py-2 flex justify-between">
                    <span className="text-emerald-300 font-medium">
                      Current Period Net Income
                    </span>
                    <span className="font-mono tabular-nums text-emerald-300">
                      ${balanceSheet.currentPeriodNetIncome.toFixed(2)}
                    </span>
                  </div>
                  <div className="py-2.5 flex justify-between font-bold text-sm text-[#d4af37]">
                    <span>Total Liabilities &amp; Equity</span>
                    <span className="font-mono tabular-nums">
                      ${balanceSheet.totalLiabilitiesAndEquity.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statement 3: Trial Balance */}
      {statement === 'trial_balance' && (
        <div className="rounded-xl bg-[#07160f] border border-[#1b3b2f] overflow-hidden">
          <div className="p-5 border-b border-[#1b3b2f] bg-[#05110a] flex flex-wrap justify-between items-center gap-3">
            <div>
              <h4 className="font-serif-classic text-base font-bold text-[#f5f3ec]">
                Safi Natural Care Clinic · General Ledger Trial Balance
              </h4>
              <p className="text-[11px] text-[#8da396]">As of {asOfDate}</p>
            </div>
            <div
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 ${
                trialBalance.isBalanced
                  ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                  : 'bg-red-950/60 border-red-700 text-red-300'
              }`}
            >
              {trialBalance.isBalanced ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Balanced: Debits = Credits</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Imbalance: ${trialBalance.difference.toFixed(2)}</span>
                </>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#05110a] border-b border-[#1b3b2f] text-[#8da396] uppercase text-[11px]">
                  <th className="py-2.5 px-4">Acct #</th>
                  <th className="py-2.5 px-4">Account Name</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4 text-right">Debit Balance ($)</th>
                  <th className="py-2.5 px-4 text-right">Credit Balance ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b3b2f]/60">
                {trialBalance.rows.map((row) => (
                  <tr key={row.accountNumber} className="hover:bg-[#0b2117]">
                    <td className="py-2.5 px-4 font-mono font-bold text-[#d4af37] tabular-nums">
                      {row.accountNumber}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-[#f5f3ec]">{row.name}</td>
                    <td className="py-2.5 px-4 text-[#a6b6ad]">{row.accountType}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[#f5f3ec]">
                      {row.debitBalance > 0 ? `$${row.debitBalance.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[#f5f3ec]">
                      {row.creditBalance > 0 ? `$${row.creditBalance.toFixed(2)}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[#05110a] border-t border-[#1b3b2f] font-bold">
                  <td colSpan={3} className="py-3 px-4 text-right text-[#a6b6ad]">
                    Trial Balance Totals
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-[#d4af37]">
                    ${trialBalance.totalDebits.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-[#d4af37]">
                    ${trialBalance.totalCredits.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
