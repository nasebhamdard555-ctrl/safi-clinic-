import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getNormalBalanceForType,
  calculateAccountBalance,
  validateJournalEntry,
  generateTrialBalance,
  generateIncomeStatement,
  generateBalanceSheet,
  calculateAgingBuckets,
  calculateReconciliationSummary,
  GlAccountWithTotals,
} from './accountingEngine';

test('getNormalBalanceForType returns Debit for Assets/COGS/Expense and Credit for Liability/Equity/Revenue', () => {
  assert.equal(getNormalBalanceForType('Asset'), 'Debit');
  assert.equal(getNormalBalanceForType('COGS'), 'Debit');
  assert.equal(getNormalBalanceForType('Expense'), 'Debit');
  assert.equal(getNormalBalanceForType('Liability'), 'Credit');
  assert.equal(getNormalBalanceForType('Equity'), 'Credit');
  assert.equal(getNormalBalanceForType('Revenue'), 'Credit');
});

test('calculateAccountBalance respects Debit vs Credit normal balance rules', () => {
  // Cash (Debit normal): $1000 debit, $250 credit = $750
  assert.equal(calculateAccountBalance('Debit', 1000, 250), 750);
  // Accounts Payable (Credit normal): $200 debit, $850 credit = $650
  assert.equal(calculateAccountBalance('Credit', 200, 850), 650);
});

test('validateJournalEntry rejects unbalanced entries and single-line entries', () => {
  const unbalanced = validateJournalEntry([
    { accountNumber: '1020', debit: 150, credit: 0 },
    { accountNumber: '4010', debit: 0, credit: 140 },
  ]);
  assert.equal(unbalanced.isValid, false);
  assert.equal(unbalanced.difference, 10);
  assert.match(unbalanced.error || '', /out of balance/i);

  const singleLine = validateJournalEntry([
    { accountNumber: '1020', debit: 100, credit: 0 },
  ]);
  assert.equal(singleLine.isValid, false);
});

test('validateJournalEntry accepts multi-line balanced journal voucher', () => {
  const valid = validateJournalEntry([
    { accountNumber: '1020', debit: 105, credit: 0, description: 'Cash collected' },
    { accountNumber: '4020', debit: 0, credit: 100, description: 'Pharmacy revenue' },
    { accountNumber: '2100', debit: 0, credit: 5, description: 'Sales tax payable' },
  ]);
  assert.equal(valid.isValid, true);
  assert.equal(valid.totalDebits, 105);
  assert.equal(valid.totalCredits, 105);
  assert.equal(valid.difference, 0);
});

test('generateTrialBalance, generateIncomeStatement, and generateBalanceSheet prove accounting identity', () => {
  // Simulate a complete balanced cycle:
  // 1) Owner invests $5,000 into Checking (DR 1020 $5000 / CR 3000 $5000)
  // 2) Consultation Revenue $200 (DR 1020 $200 / CR 4010 $200)
  // 3) Herbal Sale $100 with COGS $35 (DR 1020 $100 / CR 4020 $100; DR 5010 $35 / CR 1200 $35)
  // 4) Utility Expense $40 paid (DR 5100 $40 / CR 1020 $40)
  // Checking 1020: DR 5300, CR 40 -> 5260
  // Inventory 1200 (opening 500 - 35): DR 500, CR 35 -> 465 (assume opening 500 from Owner Equity 5500 total)
  const accounts: GlAccountWithTotals[] = [
    { id: 1, accountNumber: '1020', name: 'Main Clinic Checking', accountType: 'Asset', normalBalance: 'Debit', totalDebits: 5300, totalCredits: 40, balance: 5260 },
    { id: 2, accountNumber: '1200', name: 'Herbal Inventory Asset', accountType: 'Asset', normalBalance: 'Debit', totalDebits: 500, totalCredits: 35, balance: 465 },
    { id: 3, accountNumber: '3000', name: "Owner's Capital", accountType: 'Equity', normalBalance: 'Credit', totalDebits: 0, totalCredits: 5500, balance: 5500 },
    { id: 4, accountNumber: '4010', name: 'Clinical Consultation Revenue', accountType: 'Revenue', normalBalance: 'Credit', totalDebits: 0, totalCredits: 200, balance: 200 },
    { id: 5, accountNumber: '4020', name: 'Herbal Pharmacy Sales', accountType: 'Revenue', normalBalance: 'Credit', totalDebits: 0, totalCredits: 100, balance: 100 },
    { id: 6, accountNumber: '5010', name: 'Cost of Botanical Goods Sold', accountType: 'COGS', normalBalance: 'Debit', totalDebits: 35, totalCredits: 0, balance: 35 },
    { id: 7, accountNumber: '5100', name: 'Clinic Overhead & Utilities', accountType: 'Expense', normalBalance: 'Debit', totalDebits: 40, totalCredits: 0, balance: 40 },
  ];

  const tb = generateTrialBalance(accounts);
  assert.equal(tb.isBalanced, true);
  assert.equal(tb.totalDebits, tb.totalCredits);
  assert.equal(tb.totalDebits, 5800);

  const pnl = generateIncomeStatement(accounts);
  assert.equal(pnl.totalRevenue, 300);
  assert.equal(pnl.totalCogs, 35);
  assert.equal(pnl.grossProfit, 265);
  assert.equal(pnl.totalExpenses, 40);
  assert.equal(pnl.netIncome, 225);

  const bs = generateBalanceSheet(accounts, pnl.netIncome);
  assert.equal(bs.totalAssets, 5725); // 5260 + 465
  assert.equal(bs.totalLiabilitiesAndEquity, 5725); // 5500 + 225 net income
  assert.equal(bs.isBalanced, true);
  assert.equal(bs.difference, 0);
});

test('calculateAgingBuckets distributes A/R and A/P balances into Current, 1-30, 31-60, and 61+ buckets', () => {
  const ref = new Date('2026-11-12T00:00:00Z');
  const summary = calculateAgingBuckets(
    [
      { id: 1, dueDate: '2026-11-20', totalAmount: 200, amountPaid: 0, status: 'Open' }, // Current
      { id: 2, dueDate: '2026-10-25', totalAmount: 150, amountPaid: 50, status: 'Partial' }, // 18 days overdue (1-30) -> 100 remaining
      { id: 3, dueDate: '2026-09-28', totalAmount: 300, amountPaid: 0, status: 'Overdue' }, // 45 days overdue (31-60)
      { id: 4, dueDate: '2026-08-01', totalAmount: 500, amountPaid: 0, status: 'Overdue' }, // 103 days overdue (61+)
      { id: 5, dueDate: '2026-07-01', totalAmount: 900, amountPaid: 900, status: 'Paid' }, // Excluded
    ],
    ref
  );

  assert.equal(summary.current, 200);
  assert.equal(summary.days1to30, 100);
  assert.equal(summary.days31to60, 300);
  assert.equal(summary.days61Plus, 500);
  assert.equal(summary.totalOpen, 1100);
  assert.equal(summary.openCount, 4);
});

test('calculateReconciliationSummary converges Difference to $0.00 when statement matches cleared transactions', () => {
  const summary = calculateReconciliationSummary(1250, 1000, [
    { debit: 400, credit: 0 },
    { debit: 0, credit: 150 },
  ]);

  assert.equal(summary.clearedBalance, 1250);
  assert.equal(summary.difference, 0);
  assert.equal(summary.canComplete, true);
});
