/**
 * Microsoft Office Accounting 2009 (MOA 2009) Double-Entry Accounting Engine
 * ----------------------------------------------------------------------------
 * Pure, framework-agnostic accounting mathematics and statement generators.
 * Tested directly via Node.js native test runner (`node:test`).
 */

export type GlAccountType =
  | 'Asset'
  | 'Liability'
  | 'Equity'
  | 'Revenue'
  | 'COGS'
  | 'Expense';

export type NormalBalance = 'Debit' | 'Credit';

export interface JournalLineInput {
  accountId?: number;
  accountNumber: string;
  accountName?: string;
  description?: string;
  debit: number;
  credit: number;
}

export interface GlAccountWithTotals {
  id: number;
  accountNumber: string;
  name: string;
  accountType: GlAccountType;
  normalBalance: NormalBalance;
  description?: string | null;
  isSystem?: boolean;
  totalDebits: number;
  totalCredits: number;
  balance: number;
}

export interface TrialBalanceRow {
  accountNumber: string;
  name: string;
  accountType: GlAccountType;
  debitBalance: number;
  creditBalance: number;
}

export interface TrialBalanceReport {
  rows: TrialBalanceRow[];
  totalDebits: number;
  totalCredits: number;
  difference: number;
  isBalanced: boolean;
}

export interface IncomeStatementReport {
  revenueRows: Array<{ accountNumber: string; name: string; amount: number }>;
  cogsRows: Array<{ accountNumber: string; name: string; amount: number }>;
  expenseRows: Array<{ accountNumber: string; name: string; amount: number }>;
  totalRevenue: number;
  totalCogs: number;
  grossProfit: number;
  totalExpenses: number;
  netIncome: number;
}

export interface BalanceSheetReport {
  assetRows: Array<{ accountNumber: string; name: string; amount: number }>;
  liabilityRows: Array<{ accountNumber: string; name: string; amount: number }>;
  equityRows: Array<{ accountNumber: string; name: string; amount: number }>;
  totalAssets: number;
  totalLiabilities: number;
  totalEquityBeforeIncome: number;
  currentPeriodNetIncome: number;
  totalEquity: number;
  totalLiabilitiesAndEquity: number;
  difference: number;
  isBalanced: boolean;
}

export interface AgingItemInput {
  id: number | string;
  dueDate: string; // YYYY-MM-DD
  totalAmount: number;
  amountPaid: number;
  status?: string;
}

export interface AgingBucketsSummary {
  current: number;
  days1to30: number;
  days31to60: number;
  days61Plus: number;
  totalOpen: number;
  openCount: number;
}

export function roundCurrency(value: number): number {
  return Math.round((Number(value) || 0) * 100) / 100;
}

/**
 * Determines standard MOA 2009 normal balance from Account Type.
 * Assets, COGS, and Operating Expenses carry a Debit normal balance.
 * Liabilities, Equity, and Revenue carry a Credit normal balance.
 */
export function getNormalBalanceForType(accountType: GlAccountType): NormalBalance {
  if (accountType === 'Asset' || accountType === 'COGS' || accountType === 'Expense') {
    return 'Debit';
  }
  return 'Credit';
}

/**
 * Computes an account's current net balance according to its normal balance side.
 */
export function calculateAccountBalance(
  normalBalance: NormalBalance,
  totalDebits: number,
  totalCredits: number
): number {
  const dr = Number(totalDebits) || 0;
  const cr = Number(totalCredits) || 0;
  return normalBalance === 'Debit' ? roundCurrency(dr - cr) : roundCurrency(cr - dr);
}

/**
 * Validates double-entry balance rule:
 * - At least 2 non-zero lines
 * - Each line may have either debit > 0 or credit > 0 (never negative)
 * - SUM(debits) === SUM(credits) within 1 cent floating point tolerance
 */
export function validateJournalEntry(lines: JournalLineInput[]): {
  isValid: boolean;
  totalDebits: number;
  totalCredits: number;
  difference: number;
  error?: string;
} {
  const activeLines = lines.filter(
    (l) => (Number(l.debit) || 0) > 0 || (Number(l.credit) || 0) > 0
  );

  if (activeLines.length < 2) {
    return {
      isValid: false,
      totalDebits: 0,
      totalCredits: 0,
      difference: 0,
      error: 'Double-entry requires at least 2 active debit/credit lines.',
    };
  }

  let totalDebits = 0;
  let totalCredits = 0;

  for (const line of activeLines) {
    const dr = Number(line.debit) || 0;
    const cr = Number(line.credit) || 0;
    if (dr < 0 || cr < 0) {
      return {
        isValid: false,
        totalDebits: roundCurrency(totalDebits),
        totalCredits: roundCurrency(totalCredits),
        difference: 0,
        error: 'Debit and credit amounts cannot be negative.',
      };
    }
    if (dr > 0 && cr > 0) {
      return {
        isValid: false,
        totalDebits: roundCurrency(totalDebits),
        totalCredits: roundCurrency(totalCredits),
        difference: 0,
        error: 'A single journal line cannot carry both a debit and a credit.',
      };
    }
    if (!line.accountNumber) {
      return {
        isValid: false,
        totalDebits: roundCurrency(totalDebits),
        totalCredits: roundCurrency(totalCredits),
        difference: 0,
        error: 'Every active journal line must select a General Ledger account.',
      };
    }
    totalDebits += dr;
    totalCredits += cr;
  }

  const roundedDr = roundCurrency(totalDebits);
  const roundedCr = roundCurrency(totalCredits);
  const diff = roundCurrency(roundedDr - roundedCr);

  if (Math.abs(diff) >= 0.01) {
    return {
      isValid: false,
      totalDebits: roundedDr,
      totalCredits: roundedCr,
      difference: diff,
      error: `Entry is out of balance by $${Math.abs(diff).toFixed(2)}. Debits must equal Credits.`,
    };
  }

  return {
    isValid: true,
    totalDebits: roundedDr,
    totalCredits: roundedCr,
    difference: 0,
  };
}

/**
 * Generates MOA 2009 Trial Balance from GL Accounts with accumulated Debits/Credits.
 * Proves Total Debits === Total Credits across the entire General Ledger.
 */
export function generateTrialBalance(
  accounts: GlAccountWithTotals[]
): TrialBalanceReport {
  const rows: TrialBalanceRow[] = [];
  let totalDebits = 0;
  let totalCredits = 0;

  const sorted = [...accounts].sort((a, b) =>
    a.accountNumber.localeCompare(b.accountNumber)
  );

  for (const acct of sorted) {
    const rawNet = roundCurrency((acct.totalDebits || 0) - (acct.totalCredits || 0));
    if (Math.abs(rawNet) < 0.005) continue;

    let debitBalance = 0;
    let creditBalance = 0;
    if (rawNet >= 0) {
      debitBalance = rawNet;
    } else {
      creditBalance = Math.abs(rawNet);
    }

    totalDebits = roundCurrency(totalDebits + debitBalance);
    totalCredits = roundCurrency(totalCredits + creditBalance);

    rows.push({
      accountNumber: acct.accountNumber,
      name: acct.name,
      accountType: acct.accountType,
      debitBalance,
      creditBalance,
    });
  }

  const difference = roundCurrency(totalDebits - totalCredits);
  return {
    rows,
    totalDebits,
    totalCredits,
    difference,
    isBalanced: Math.abs(difference) < 0.01,
  };
}

/**
 * Generates MOA 2009 Profit & Loss (Income Statement):
 * Revenue - COGS = Gross Profit; Gross Profit - Operating Expenses = Net Income.
 */
export function generateIncomeStatement(
  accounts: GlAccountWithTotals[]
): IncomeStatementReport {
  const sorted = [...accounts].sort((a, b) =>
    a.accountNumber.localeCompare(b.accountNumber)
  );

  const revenueRows = sorted
    .filter((a) => a.accountType === 'Revenue')
    .map((a) => ({ accountNumber: a.accountNumber, name: a.name, amount: a.balance }));

  const cogsRows = sorted
    .filter((a) => a.accountType === 'COGS')
    .map((a) => ({ accountNumber: a.accountNumber, name: a.name, amount: a.balance }));

  const expenseRows = sorted
    .filter((a) => a.accountType === 'Expense')
    .map((a) => ({ accountNumber: a.accountNumber, name: a.name, amount: a.balance }));

  const totalRevenue = roundCurrency(
    revenueRows.reduce((sum, r) => sum + r.amount, 0)
  );
  const totalCogs = roundCurrency(cogsRows.reduce((sum, r) => sum + r.amount, 0));
  const grossProfit = roundCurrency(totalRevenue - totalCogs);
  const totalExpenses = roundCurrency(
    expenseRows.reduce((sum, r) => sum + r.amount, 0)
  );
  const netIncome = roundCurrency(grossProfit - totalExpenses);

  return {
    revenueRows,
    cogsRows,
    expenseRows,
    totalRevenue,
    totalCogs,
    grossProfit,
    totalExpenses,
    netIncome,
  };
}

/**
 * Generates MOA 2009 Balance Sheet:
 * Total Assets === Total Liabilities + Total Equity + Current Period Net Income.
 */
export function generateBalanceSheet(
  accounts: GlAccountWithTotals[],
  currentPeriodNetIncome: number
): BalanceSheetReport {
  const sorted = [...accounts].sort((a, b) =>
    a.accountNumber.localeCompare(b.accountNumber)
  );

  const assetRows = sorted
    .filter((a) => a.accountType === 'Asset')
    .map((a) => ({ accountNumber: a.accountNumber, name: a.name, amount: a.balance }));

  const liabilityRows = sorted
    .filter((a) => a.accountType === 'Liability')
    .map((a) => ({ accountNumber: a.accountNumber, name: a.name, amount: a.balance }));

  const equityRows = sorted
    .filter((a) => a.accountType === 'Equity')
    .map((a) => ({ accountNumber: a.accountNumber, name: a.name, amount: a.balance }));

  const totalAssets = roundCurrency(assetRows.reduce((s, r) => s + r.amount, 0));
  const totalLiabilities = roundCurrency(
    liabilityRows.reduce((s, r) => s + r.amount, 0)
  );
  const totalEquityBeforeIncome = roundCurrency(
    equityRows.reduce((s, r) => s + r.amount, 0)
  );
  const netInc = roundCurrency(currentPeriodNetIncome);
  const totalEquity = roundCurrency(totalEquityBeforeIncome + netInc);
  const totalLiabilitiesAndEquity = roundCurrency(totalLiabilities + totalEquity);
  const difference = roundCurrency(totalAssets - totalLiabilitiesAndEquity);

  return {
    assetRows,
    liabilityRows,
    equityRows,
    totalAssets,
    totalLiabilities,
    totalEquityBeforeIncome,
    currentPeriodNetIncome: netInc,
    totalEquity,
    totalLiabilitiesAndEquity,
    difference,
    isBalanced: Math.abs(difference) < 0.01,
  };
}

/**
 * Computes MOA 2009 Accounts Receivable / Accounts Payable Aging buckets.
 */
export function calculateAgingBuckets(
  items: AgingItemInput[],
  referenceDate: Date = new Date()
): AgingBucketsSummary {
  const buckets: AgingBucketsSummary = {
    current: 0,
    days1to30: 0,
    days31to60: 0,
    days61Plus: 0,
    totalOpen: 0,
    openCount: 0,
  };

  const refMidnight = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate()
    )
  ).getTime();

  for (const item of items) {
    const remaining = roundCurrency(
      (Number(item.totalAmount) || 0) - (Number(item.amountPaid) || 0)
    );
    if (remaining <= 0.009 || item.status === 'Paid') continue;

    buckets.openCount += 1;
    buckets.totalOpen = roundCurrency(buckets.totalOpen + remaining);

    const parsedDue = new Date(`${item.dueDate}T00:00:00Z`).getTime();
    const diffDays = Number.isNaN(parsedDue)
      ? 0
      : Math.floor((refMidnight - parsedDue) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      buckets.current = roundCurrency(buckets.current + remaining);
    } else if (diffDays <= 30) {
      buckets.days1to30 = roundCurrency(buckets.days1to30 + remaining);
    } else if (diffDays <= 60) {
      buckets.days31to60 = roundCurrency(buckets.days31to60 + remaining);
    } else {
      buckets.days61Plus = roundCurrency(buckets.days61Plus + remaining);
    }
  }

  return buckets;
}

/**
 * Computes MOA 2009 Bank Reconciliation mathematical state:
 * Cleared Balance = Opening Reconciled Balance + Sum(Cleared Deposits - Cleared Payments)
 * Difference = Statement Ending Balance - Cleared Balance
 */
export function calculateReconciliationSummary(
  statementEndingBalance: number,
  previouslyReconciledBalance: number,
  selectedLines: Array<{ debit: number; credit: number }>
): {
  statementEndingBalance: number;
  previouslyReconciledBalance: number;
  selectedDeposits: number;
  selectedPayments: number;
  clearedBalance: number;
  difference: number;
  canComplete: boolean;
} {
  let selectedDeposits = 0;
  let selectedPayments = 0;

  for (const line of selectedLines) {
    selectedDeposits += Number(line.debit) || 0;
    selectedPayments += Number(line.credit) || 0;
  }

  const clearedBalance = roundCurrency(
    previouslyReconciledBalance + selectedDeposits - selectedPayments
  );
  const target = roundCurrency(statementEndingBalance);
  const difference = roundCurrency(target - clearedBalance);

  return {
    statementEndingBalance: target,
    previouslyReconciledBalance: roundCurrency(previouslyReconciledBalance),
    selectedDeposits: roundCurrency(selectedDeposits),
    selectedPayments: roundCurrency(selectedPayments),
    clearedBalance,
    difference,
    canComplete: Math.abs(difference) < 0.01,
  };
}
