import { db } from './index.ts';
import {
  glAccounts,
  journalEntries,
  journalLines,
  vendors,
  arInvoices,
  apBills,
  bankReconciliations,
  transactions,
} from './schema.ts';
import { eq, desc, asc, inArray, sql } from 'drizzle-orm';
import {
  GlAccountType,
  GlAccountWithTotals,
  JournalLineInput,
  calculateAccountBalance,
  calculateAgingBuckets,
  calculateReconciliationSummary,
  generateBalanceSheet,
  generateIncomeStatement,
  generateTrialBalance,
  getNormalBalanceForType,
  roundCurrency,
  validateJournalEntry,
} from '../utils/accountingEngine.ts';

function formatIsoDate(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Ensures the Standard Microsoft Office Accounting 2009 Chart of Accounts,
 * clinical suppliers, opening capital balance, and synced clinic subledgers exist.
 */
export async function ensureSeededMoa2009() {
  let accounts = await db.select().from(glAccounts).orderBy(asc(glAccounts.accountNumber));

  if (accounts.length === 0) {
    const standardCoa: Array<{
      accountNumber: string;
      name: string;
      accountType: GlAccountType;
      description: string;
      isSystem: boolean;
    }> = [
      {
        accountNumber: '1010',
        name: 'Cash on Hand (Clinic Desk)',
        accountType: 'Asset',
        description: 'Physical cash drawer for walk-in consultations & POS counter',
        isSystem: true,
      },
      {
        accountNumber: '1020',
        name: 'Main Clinic Checking Bank',
        accountType: 'Asset',
        description: 'Primary Safi Natural Care Clinic operating bank account',
        isSystem: true,
      },
      {
        accountNumber: '1100',
        name: 'Accounts Receivable',
        accountType: 'Asset',
        description: 'Open patient & wholesale customer invoice balances',
        isSystem: true,
      },
      {
        accountNumber: '1200',
        name: 'Herbal Inventory Asset',
        accountType: 'Asset',
        description: 'Valuation of compounded botanical tinctures, teas, and resins on hand',
        isSystem: true,
      },
      {
        accountNumber: '2010',
        name: 'Accounts Payable',
        accountType: 'Liability',
        description: 'Unpaid vendor bills for raw herbs, amber bottles, and supplies',
        isSystem: true,
      },
      {
        accountNumber: '2100',
        name: 'Dispensary Sales Tax Payable',
        accountType: 'Liability',
        description: 'Collected dispensary VAT/sales tax remitted periodically',
        isSystem: true,
      },
      {
        accountNumber: '3000',
        name: "Owner's Equity / Capital",
        accountType: 'Equity',
        description: 'Initial clinic capital & founder equity investment',
        isSystem: true,
      },
      {
        accountNumber: '3900',
        name: 'Retained Earnings',
        accountType: 'Equity',
        description: 'Accumulated clinic earnings retained across fiscal periods',
        isSystem: true,
      },
      {
        accountNumber: '4010',
        name: 'Clinical Consultation Revenue',
        accountType: 'Revenue',
        description: 'Unani, Phytotherapy & Naturopathic outpatient diagnostic fees',
        isSystem: true,
      },
      {
        accountNumber: '4020',
        name: 'Herbal Pharmacy Sales',
        accountType: 'Revenue',
        description: 'Dispensary POS & online apothecary retail formulations',
        isSystem: true,
      },
      {
        accountNumber: '5010',
        name: 'Cost of Botanical Goods Sold',
        accountType: 'COGS',
        description: 'Direct compounding & wholesale cost of dispensed remedies',
        isSystem: true,
      },
      {
        accountNumber: '5100',
        name: 'Clinic Overhead & Utilities',
        accountType: 'Expense',
        description: 'Facility utilities, clinic sterilization & administrative overhead',
        isSystem: true,
      },
      {
        accountNumber: '5200',
        name: 'Supplier & Apothecary Expenses',
        accountType: 'Expense',
        description: 'Botanical packaging, glassware, and clinical consumable bills',
        isSystem: true,
      },
    ];

    accounts = await db
      .insert(glAccounts)
      .values(
        standardCoa.map((a) => ({
          accountNumber: a.accountNumber,
          name: a.name,
          accountType: a.accountType,
          normalBalance: getNormalBalanceForType(a.accountType),
          description: a.description,
          isSystem: a.isSystem,
        }))
      )
      .returning();
  }

  let vendorList = await db.select().from(vendors).orderBy(asc(vendors.id));
  if (vendorList.length === 0) {
    vendorList = await db
      .insert(vendors)
      .values([
        {
          name: 'Badakhshan Botanical Cooperative',
          contactName: 'Fayaz Ahmad Noori',
          phone: '+93 700 412 880',
          email: 'supply@badakhshanherbs.af',
          category: 'Raw Medicinal Herbs',
          paymentTerms: 'Net 30',
        },
        {
          name: 'Kabul Miron Amber Glassware',
          contactName: 'Zahir Shah Ahmadi',
          phone: '+93 799 618 220',
          email: 'orders@kabulglass.af',
          category: 'Apothecary Packaging',
          paymentTerms: 'Net 15',
        },
        {
          name: 'Khorasan Clinical Diagnostics & Linen',
          contactName: 'Mariam Sadat',
          phone: '+93 786 330 911',
          email: 'billing@khorasanmed.af',
          category: 'Clinic Utilities & Supplies',
          paymentTerms: 'Due on Receipt',
        },
      ])
      .returning();
  }

  const existingJournals = await db.select().from(journalEntries).limit(1);
  if (existingJournals.length === 0) {
    const today = new Date();
    const dStr = (daysAgo: number) =>
      formatIsoDate(new Date(today.getTime() - daysAgo * 86400000));

    // 1. Opening Balance Entry (Balanced: $18,000 DR Assets / $18,000 CR Owner's Capital)
    await postBalancedJournalEntry({
      entryNumber: 'JE-1000',
      entryDate: dStr(25),
      memo: "Opening Clinical Capital, Cash Drawer & Apothecary Inventory Valuation",
      sourceModule: 'General Journal',
      sourceRef: 'OPENING-BALANCE',
      lines: [
        {
          accountNumber: '1020',
          description: 'Opening Clinic Checking Bank Deposit',
          debit: 12000,
          credit: 0,
        },
        {
          accountNumber: '1010',
          description: 'Opening Reception Cash Float',
          debit: 1500,
          credit: 0,
        },
        {
          accountNumber: '1200',
          description: 'Opening Herbal Dispensary Stock Valuation',
          debit: 4500,
          credit: 0,
        },
        {
          accountNumber: '3000',
          description: "Founder Equity & Initial Capitalization",
          debit: 0,
          credit: 18000,
        },
      ],
    });

    // 2. Sync existing centralized transactions into balanced MOA 2009 Journal Entries
    const existingTx = await db
      .select()
      .from(transactions)
      .orderBy(asc(transactions.createdAt));

    for (const tx of existingTx) {
      await postClinicTransactionToMoaLedger({
        sourceRef: tx.referenceNumber,
        type: tx.type as 'consultation' | 'pharmacy_sale' | 'expense',
        description: tx.description,
        patientName: tx.patientName,
        grossAmount: tx.grossAmount,
        cogsAmount: tx.cogsAmount,
        paymentMethod: tx.paymentMethod,
        entryDate: tx.createdAt ? formatIsoDate(new Date(tx.createdAt)) : dStr(1),
      });
    }

    // 3. Seed realistic A/R Customer Invoices (subledger tied to GL 1100 Accounts Receivable)
    const inv1 = await createArInvoice({
      customerName: 'Kabul Executive Wellness Corporate Plan',
      customerEmail: 'hr@kabulcorporate.af',
      issueDate: dStr(10),
      dueDate: dStr(-20), // Current
      subtotal: 420,
      taxAmount: 0,
      notes: 'Annual Mizaj & Preventive Phytotherapy Screening (3 Staff)',
      revenueAccountNumber: '4010',
    });

    const inv2 = await createArInvoice({
      customerName: 'Hajji Ahmadullah Stanikzai',
      customerEmail: 'ahmadullah.s@kabulmail.af',
      issueDate: dStr(22),
      dueDate: dStr(8), // 8 days overdue (1-30 bucket)
      subtotal: 200,
      taxAmount: 10,
      notes: 'Extended 60-Day Joint & Respiratory Botanical Regimen',
      revenueAccountNumber: '4020',
    });
    // Record $100 partial payment against inv2 so Status = Partial & Checking has an entry
    await receiveArInvoicePayment(inv2.id, 100, '1020', dStr(4));

    // 4. Seed realistic A/P Vendor Bills (subledger tied to GL 2010 Accounts Payable)
    const bill1 = await createApBill({
      vendorId: vendorList[0].id,
      billDate: dStr(14),
      dueDate: dStr(-16), // Current
      expenseAccountNumber: '1200', // Restocked Herbal Inventory Asset
      totalAmount: 480,
      memo: 'Wholesale Harvest: Badakhshan Nigella Sativa & Saffron Extract',
    });

    const bill2 = await createApBill({
      vendorId: vendorList[1].id,
      billDate: dStr(18),
      dueDate: dStr(3),
      expenseAccountNumber: '5200',
      totalAmount: 320,
      memo: '250x UV-Protected Miron Amber Dropper Bottles & Seals',
    });
    await payApBill(bill2.id, 320, '1020', dStr(5));

    void inv1;
    void bill1;
  }

  return accounts;
}

/**
 * Posts a validated double-entry Journal Entry atomically into PostgreSQL.
 * Strictly enforces SUM(debit) === SUM(credit).
 */
export async function postBalancedJournalEntry(input: {
  entryNumber?: string;
  entryDate?: string;
  memo: string;
  sourceModule?: string;
  sourceRef?: string;
  lines: JournalLineInput[];
}) {
  const validation = validateJournalEntry(input.lines);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Journal entry failed double-entry validation.');
  }

  const accountRows = await db.select().from(glAccounts);
  const byNumber = new Map(accountRows.map((a) => [a.accountNumber, a]));

  const resolvedLines: Array<{
    accountId: number;
    description: string;
    debit: number;
    credit: number;
  }> = [];

  for (const l of input.lines) {
    const dr = roundCurrency(l.debit);
    const cr = roundCurrency(l.credit);
    if (dr === 0 && cr === 0) continue;

    const acct = byNumber.get(l.accountNumber);
    if (!acct) {
      throw new Error(`GL Account #${l.accountNumber} does not exist in Chart of Accounts.`);
    }
    resolvedLines.push({
      accountId: acct.id,
      description: l.description?.trim() || input.memo,
      debit: dr,
      credit: cr,
    });
  }

  const entryNumber =
    input.entryNumber ||
    `JE-${Date.now().toString().slice(-6)}-${Math.floor(10 + Math.random() * 89)}`;
  const entryDate = input.entryDate || formatIsoDate(new Date());

  return await db.transaction(async (tx) => {
    const [entry] = await tx
      .insert(journalEntries)
      .values({
        entryNumber,
        entryDate,
        memo: input.memo.trim(),
        sourceModule: input.sourceModule || 'General Journal',
        sourceRef: input.sourceRef || null,
        status: 'Posted',
      })
      .returning();

    const insertedLines = await tx
      .insert(journalLines)
      .values(
        resolvedLines.map((rl) => ({
          journalEntryId: entry.id,
          accountId: rl.accountId,
          description: rl.description,
          debit: rl.debit,
          credit: rl.credit,
          reconciled: false,
        }))
      )
      .returning();

    return { entry, lines: insertedLines };
  });
}

/**
 * Automatically converts clinical consultations, POS pharmacy sales, and online orders
 * into balanced double-entry Journal Entries without affecting caller behavior.
 */
export async function postClinicTransactionToMoaLedger(input: {
  sourceRef: string;
  type: 'consultation' | 'pharmacy_sale' | 'expense';
  description: string;
  patientName?: string | null;
  grossAmount: number;
  cogsAmount: number;
  paymentMethod?: string;
  entryDate?: string;
}) {
  try {
    const acctCheck = await db.select({ id: glAccounts.id }).from(glAccounts).limit(1);
    if (acctCheck.length === 0) {
      return null;
    }

    // Idempotency guard so a given sourceRef never double-posts
    const existing = await db
      .select({ id: journalEntries.id })
      .from(journalEntries)
      .where(eq(journalEntries.sourceRef, input.sourceRef))
      .limit(1);
    if (existing.length > 0) return null;

    const gross = roundCurrency(input.grossAmount);
    const cogs = roundCurrency(input.cogsAmount);
    if (gross <= 0) return null;

    const methodLower = (input.paymentMethod || '').toLowerCase();
    const cashAccount =
      methodLower.includes('bank') ||
      methodLower.includes('online') ||
      methodLower.includes('card') ||
      methodLower.includes('telehealth')
        ? '1020'
        : '1010';

    const lines: JournalLineInput[] = [];

    if (input.type === 'consultation') {
      lines.push(
        {
          accountNumber: cashAccount,
          description: `Consultation payment (${input.patientName || 'Patient'})`,
          debit: gross,
          credit: 0,
        },
        {
          accountNumber: '4010',
          description: input.description,
          debit: 0,
          credit: gross,
        }
      );
    } else if (input.type === 'pharmacy_sale') {
      // Split 5% tax if pharmacy sale
      const netSale = roundCurrency(gross / 1.05);
      const taxPart = roundCurrency(gross - netSale);

      lines.push({
        accountNumber: cashAccount,
        description: `Dispensary receipt (${input.patientName || 'Walk-in'})`,
        debit: gross,
        credit: 0,
      });
      lines.push({
        accountNumber: '4020',
        description: input.description,
        debit: 0,
        credit: netSale,
      });
      if (taxPart > 0) {
        lines.push({
          accountNumber: '2100',
          description: 'Dispensary Sales Tax Collected (5%)',
          debit: 0,
          credit: taxPart,
        });
      }
      if (cogs > 0) {
        lines.push(
          {
            accountNumber: '5010',
            description: 'Cost of Botanical Goods Sold',
            debit: cogs,
            credit: 0,
          },
          {
            accountNumber: '1200',
            description: 'Inventory asset reduction on sale',
            debit: 0,
            credit: cogs,
          }
        );
      }
    } else {
      lines.push(
        {
          accountNumber: '5200',
          description: input.description,
          debit: gross,
          credit: 0,
        },
        {
          accountNumber: cashAccount,
          description: 'Expense disbursement',
          debit: 0,
          credit: gross,
        }
      );
    }

    return await postBalancedJournalEntry({
      entryDate: input.entryDate || formatIsoDate(new Date()),
      memo: `${input.sourceRef} · ${input.description}`,
      sourceModule: input.type === 'consultation' ? 'Consultation' : 'POS Pharmacy',
      sourceRef: input.sourceRef,
      lines,
    });
  } catch (err) {
    console.warn('MOA 2009 journal sync skipped safely:', err);
    return null;
  }
}

export async function getChartOfAccountsWithBalances(): Promise<GlAccountWithTotals[]> {
  await ensureSeededMoa2009();

  const accounts = await db
    .select()
    .from(glAccounts)
    .orderBy(asc(glAccounts.accountNumber));

  const sums = await db
    .select({
      accountId: journalLines.accountId,
      totalDebits: sql<number>`COALESCE(SUM(${journalLines.debit}), 0)`,
      totalCredits: sql<number>`COALESCE(SUM(${journalLines.credit}), 0)`,
    })
    .from(journalLines)
    .groupBy(journalLines.accountId);

  const sumMap = new Map(
    sums.map((s) => [
      s.accountId,
      {
        totalDebits: roundCurrency(Number(s.totalDebits) || 0),
        totalCredits: roundCurrency(Number(s.totalCredits) || 0),
      },
    ])
  );

  return accounts.map((a) => {
    const totals = sumMap.get(a.id) || { totalDebits: 0, totalCredits: 0 };
    const normalBalance = a.normalBalance as 'Debit' | 'Credit';
    return {
      id: a.id,
      accountNumber: a.accountNumber,
      name: a.name,
      accountType: a.accountType as GlAccountType,
      normalBalance,
      description: a.description,
      isSystem: a.isSystem,
      totalDebits: totals.totalDebits,
      totalCredits: totals.totalCredits,
      balance: calculateAccountBalance(normalBalance, totals.totalDebits, totals.totalCredits),
    };
  });
}

export async function createGlAccount(data: {
  accountNumber: string;
  name: string;
  accountType: GlAccountType;
  description?: string;
}) {
  await ensureSeededMoa2009();
  const cleanNum = data.accountNumber.trim();
  const cleanName = data.name.trim();
  if (!cleanNum || !cleanName) {
    throw new Error('Account Number and Account Name are required.');
  }

  const normalBalance = getNormalBalanceForType(data.accountType);
  const [inserted] = await db
    .insert(glAccounts)
    .values({
      accountNumber: cleanNum,
      name: cleanName,
      accountType: data.accountType,
      normalBalance,
      description: data.description?.trim() || null,
      isSystem: false,
    })
    .returning();

  return inserted;
}

export async function getJournalEntriesWithLines(limitCount = 60) {
  await ensureSeededMoa2009();

  const entries = await db
    .select()
    .from(journalEntries)
    .orderBy(desc(journalEntries.entryDate), desc(journalEntries.id))
    .limit(limitCount);

  if (entries.length === 0) return [];

  const entryIds = entries.map((e) => e.id);
  const lines = await db
    .select({
      id: journalLines.id,
      journalEntryId: journalLines.journalEntryId,
      accountId: journalLines.accountId,
      accountNumber: glAccounts.accountNumber,
      accountName: glAccounts.name,
      description: journalLines.description,
      debit: journalLines.debit,
      credit: journalLines.credit,
      reconciled: journalLines.reconciled,
      reconciliationId: journalLines.reconciliationId,
    })
    .from(journalLines)
    .innerJoin(glAccounts, eq(journalLines.accountId, glAccounts.id))
    .where(inArray(journalLines.journalEntryId, entryIds))
    .orderBy(asc(journalLines.id));

  return entries.map((e) => {
    const entryLines = lines.filter((l) => l.journalEntryId === e.id);
    const totalDebits = roundCurrency(entryLines.reduce((s, l) => s + l.debit, 0));
    const totalCredits = roundCurrency(entryLines.reduce((s, l) => s + l.credit, 0));
    return {
      ...e,
      lines: entryLines,
      totalDebits,
      totalCredits,
    };
  });
}

// ============================================================================
// CUSTOMERS & ACCOUNTS RECEIVABLE (INVOICING CENTER)
// ============================================================================

export async function getArInvoicesWithAging() {
  await ensureSeededMoa2009();
  const invoices = await db.select().from(arInvoices).orderBy(desc(arInvoices.id));
  const aging = calculateAgingBuckets(
    invoices.map((inv) => ({
      id: inv.id,
      dueDate: inv.dueDate,
      totalAmount: inv.totalAmount,
      amountPaid: inv.amountPaid,
      status: inv.status,
    }))
  );
  return { invoices, aging };
}

export async function createArInvoice(input: {
  customerName: string;
  customerEmail?: string;
  patientId?: number | null;
  issueDate?: string;
  dueDate?: string;
  subtotal: number;
  taxAmount?: number;
  notes?: string;
  revenueAccountNumber?: string;
}) {
  const subtotal = roundCurrency(input.subtotal);
  const taxAmount = roundCurrency(input.taxAmount || 0);
  const totalAmount = roundCurrency(subtotal + taxAmount);

  if (subtotal <= 0) throw new Error('Invoice subtotal must be greater than $0.00.');

  const issueDate = input.issueDate || formatIsoDate(new Date());
  const dueDate =
    input.dueDate || formatIsoDate(new Date(Date.now() + 30 * 86400000));
  const invoiceNumber = `INV-${Math.floor(10000 + Math.random() * 89999)}`;

  const [invoice] = await db
    .insert(arInvoices)
    .values({
      invoiceNumber,
      patientId: input.patientId || null,
      customerName: input.customerName.trim(),
      customerEmail: input.customerEmail?.trim() || null,
      issueDate,
      dueDate,
      subtotal,
      taxAmount,
      totalAmount,
      amountPaid: 0,
      status: 'Open',
      notes: input.notes?.trim() || null,
    })
    .returning();

  const revAcct = input.revenueAccountNumber || '4010';
  const jeLines: JournalLineInput[] = [
    {
      accountNumber: '1100',
      description: `Invoice ${invoiceNumber} · ${invoice.customerName}`,
      debit: totalAmount,
      credit: 0,
    },
    {
      accountNumber: revAcct,
      description: `Billed clinical/dispensary revenue (${invoiceNumber})`,
      debit: 0,
      credit: subtotal,
    },
  ];
  if (taxAmount > 0) {
    jeLines.push({
      accountNumber: '2100',
      description: `Sales tax on ${invoiceNumber}`,
      debit: 0,
      credit: taxAmount,
    });
  }

  await postBalancedJournalEntry({
    entryDate: issueDate,
    memo: `A/R Invoice ${invoiceNumber} issued to ${invoice.customerName}`,
    sourceModule: 'Invoicing',
    sourceRef: invoiceNumber,
    lines: jeLines,
  });

  return invoice;
}

export async function receiveArInvoicePayment(
  invoiceId: number,
  paymentAmount: number,
  depositAccountNumber = '1020',
  paymentDate?: string
) {
  const rows = await db
    .select()
    .from(arInvoices)
    .where(eq(arInvoices.id, invoiceId))
    .limit(1);
  if (rows.length === 0) throw new Error('Invoice not found.');
  const inv = rows[0];

  const remaining = roundCurrency(inv.totalAmount - inv.amountPaid);
  if (remaining <= 0) throw new Error('Invoice is already paid in full.');

  const payAmt = roundCurrency(Math.min(remaining, Math.max(0.01, paymentAmount)));
  const newPaid = roundCurrency(inv.amountPaid + payAmt);
  const newStatus = newPaid >= inv.totalAmount - 0.009 ? 'Paid' : 'Partial';

  const [updated] = await db
    .update(arInvoices)
    .set({
      amountPaid: newPaid,
      status: newStatus,
    })
    .where(eq(arInvoices.id, invoiceId))
    .returning();

  const dateStr = paymentDate || formatIsoDate(new Date());
  await postBalancedJournalEntry({
    entryDate: dateStr,
    memo: `Customer Payment Received · ${inv.invoiceNumber} (${inv.customerName})`,
    sourceModule: 'Invoicing',
    sourceRef: `PMT-${inv.invoiceNumber}-${Date.now().toString().slice(-4)}`,
    lines: [
      {
        accountNumber: depositAccountNumber,
        description: `Payment from ${inv.customerName}`,
        debit: payAmt,
        credit: 0,
      },
      {
        accountNumber: '1100',
        description: `Reduce A/R for ${inv.invoiceNumber}`,
        debit: 0,
        credit: payAmt,
      },
    ],
  });

  return updated;
}

// ============================================================================
// VENDORS & ACCOUNTS PAYABLE (BILLS CENTER)
// ============================================================================

export async function getVendorsAndBillsWithAging() {
  await ensureSeededMoa2009();
  const vendorList = await db.select().from(vendors).orderBy(asc(vendors.name));
  const bills = await db.select().from(apBills).orderBy(desc(apBills.id));
  const aging = calculateAgingBuckets(
    bills.map((b) => ({
      id: b.id,
      dueDate: b.dueDate,
      totalAmount: b.totalAmount,
      amountPaid: b.amountPaid,
      status: b.status,
    }))
  );
  return { vendors: vendorList, bills, aging };
}

export async function createVendorRecord(input: {
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  category?: string;
  paymentTerms?: string;
}) {
  await ensureSeededMoa2009();
  const [created] = await db
    .insert(vendors)
    .values({
      name: input.name.trim(),
      contactName: input.contactName?.trim() || null,
      phone: input.phone?.trim() || null,
      email: input.email?.trim() || null,
      category: input.category?.trim() || 'Botanical Supplier',
      paymentTerms: input.paymentTerms?.trim() || 'Net 30',
    })
    .returning();
  return created;
}

export async function createApBill(input: {
  vendorId: number;
  billDate?: string;
  dueDate?: string;
  expenseAccountNumber: string;
  totalAmount: number;
  memo?: string;
}) {
  const vendorRows = await db
    .select()
    .from(vendors)
    .where(eq(vendors.id, input.vendorId))
    .limit(1);
  if (vendorRows.length === 0) throw new Error('Selected vendor not found.');
  const vendor = vendorRows[0];

  const amount = roundCurrency(input.totalAmount);
  if (amount <= 0) throw new Error('Vendor bill amount must be greater than $0.00.');

  const billDate = input.billDate || formatIsoDate(new Date());
  const dueDate =
    input.dueDate || formatIsoDate(new Date(Date.now() + 30 * 86400000));
  const billNumber = `BILL-${Math.floor(10000 + Math.random() * 89999)}`;

  const [bill] = await db
    .insert(apBills)
    .values({
      billNumber,
      vendorId: vendor.id,
      vendorName: vendor.name,
      billDate,
      dueDate,
      expenseAccountNumber: input.expenseAccountNumber || '5200',
      totalAmount: amount,
      amountPaid: 0,
      status: 'Open',
      memo: input.memo?.trim() || null,
    })
    .returning();

  await postBalancedJournalEntry({
    entryDate: billDate,
    memo: `Vendor Bill ${billNumber} · ${vendor.name}`,
    sourceModule: 'Vendor Bills',
    sourceRef: billNumber,
    lines: [
      {
        accountNumber: bill.expenseAccountNumber,
        description: input.memo?.trim() || `Supplier invoice from ${vendor.name}`,
        debit: amount,
        credit: 0,
      },
      {
        accountNumber: '2010',
        description: `Accounts Payable (${vendor.name})`,
        debit: 0,
        credit: amount,
      },
    ],
  });

  return bill;
}

export async function payApBill(
  billId: number,
  paymentAmount: number,
  paymentAccountNumber = '1020',
  paymentDate?: string
) {
  const rows = await db.select().from(apBills).where(eq(apBills.id, billId)).limit(1);
  if (rows.length === 0) throw new Error('Vendor bill not found.');
  const bill = rows[0];

  const remaining = roundCurrency(bill.totalAmount - bill.amountPaid);
  if (remaining <= 0) throw new Error('Vendor bill is already settled.');

  const payAmt = roundCurrency(Math.min(remaining, Math.max(0.01, paymentAmount)));
  const newPaid = roundCurrency(bill.amountPaid + payAmt);
  const newStatus = newPaid >= bill.totalAmount - 0.009 ? 'Paid' : 'Partial';

  const [updated] = await db
    .update(apBills)
    .set({
      amountPaid: newPaid,
      status: newStatus,
    })
    .where(eq(apBills.id, billId))
    .returning();

  const dateStr = paymentDate || formatIsoDate(new Date());
  await postBalancedJournalEntry({
    entryDate: dateStr,
    memo: `Bill Payment · ${bill.billNumber} (${bill.vendorName})`,
    sourceModule: 'Vendor Bills',
    sourceRef: `PAYBILL-${bill.billNumber}-${Date.now().toString().slice(-4)}`,
    lines: [
      {
        accountNumber: '2010',
        description: `Settle A/P ${bill.billNumber}`,
        debit: payAmt,
        credit: 0,
      },
      {
        accountNumber: paymentAccountNumber,
        description: `Disbursement to ${bill.vendorName}`,
        debit: 0,
        credit: payAmt,
      },
    ],
  });

  return updated;
}

// ============================================================================
// BANKING REGISTER & ACCOUNT RECONCILIATION
// ============================================================================

export async function getBankRegisterAndReconciliation(accountNumber = '1020') {
  await ensureSeededMoa2009();

  const [acct] = await db
    .select()
    .from(glAccounts)
    .where(eq(glAccounts.accountNumber, accountNumber))
    .limit(1);
  if (!acct) throw new Error(`Bank/Cash account #${accountNumber} not found.`);

  const rawLines = await db
    .select({
      lineId: journalLines.id,
      journalEntryId: journalLines.journalEntryId,
      entryNumber: journalEntries.entryNumber,
      entryDate: journalEntries.entryDate,
      memo: journalEntries.memo,
      sourceModule: journalEntries.sourceModule,
      debit: journalLines.debit,
      credit: journalLines.credit,
      reconciled: journalLines.reconciled,
      reconciliationId: journalLines.reconciliationId,
    })
    .from(journalLines)
    .innerJoin(journalEntries, eq(journalLines.journalEntryId, journalEntries.id))
    .where(eq(journalLines.accountId, acct.id))
    .orderBy(asc(journalEntries.entryDate), asc(journalLines.id));

  let runningBalance = 0;
  let previouslyReconciledBalance = 0;

  const registerLines = rawLines.map((row) => {
    runningBalance = roundCurrency(runningBalance + row.debit - row.credit);
    if (row.reconciled) {
      previouslyReconciledBalance = roundCurrency(
        previouslyReconciledBalance + row.debit - row.credit
      );
    }
    return {
      ...row,
      runningBalance,
    };
  });

  const history = await db
    .select()
    .from(bankReconciliations)
    .where(eq(bankReconciliations.accountId, acct.id))
    .orderBy(desc(bankReconciliations.completedAt))
    .limit(10);

  return {
    account: acct,
    currentBookBalance: runningBalance,
    previouslyReconciledBalance,
    registerLines: [...registerLines].reverse(),
    history,
  };
}

export async function completeBankReconciliation(input: {
  accountNumber: string;
  statementDate: string;
  statementEndingBalance: number;
  selectedLineIds: number[];
}) {
  const data = await getBankRegisterAndReconciliation(input.accountNumber);
  const selectedSet = new Set(input.selectedLineIds.map((id) => Number(id)));

  const selectedLines = data.registerLines.filter(
    (l) => !l.reconciled && selectedSet.has(l.lineId)
  );

  const check = calculateReconciliationSummary(
    Number(input.statementEndingBalance),
    data.previouslyReconciledBalance,
    selectedLines
  );

  if (!check.canComplete) {
    throw new Error(
      `Reconciliation difference must be $0.00 before finishing (currently $${check.difference.toFixed(2)}).`
    );
  }

  return await db.transaction(async (tx) => {
    const [rec] = await tx
      .insert(bankReconciliations)
      .values({
        accountId: data.account.id,
        statementDate: input.statementDate || formatIsoDate(new Date()),
        statementEndingBalance: check.statementEndingBalance,
        clearedBalance: check.clearedBalance,
        difference: check.difference,
        clearedLineCount: selectedLines.length,
        status: 'Reconciled',
      })
      .returning();

    if (selectedLines.length > 0) {
      await tx
        .update(journalLines)
        .set({
          reconciled: true,
          reconciliationId: rec.id,
        })
        .where(
          inArray(
            journalLines.id,
            selectedLines.map((s) => s.lineId)
          )
        );
    }

    return rec;
  });
}

// ============================================================================
// MOA 2009 FINANCIAL STATEMENTS AGGREGATOR
// ============================================================================

export async function getMoaFinancialReports() {
  const accounts = await getChartOfAccountsWithBalances();
  const trialBalance = generateTrialBalance(accounts);
  const profitAndLoss = generateIncomeStatement(accounts);
  const balanceSheet = generateBalanceSheet(accounts, profitAndLoss.netIncome);
  const arData = await getArInvoicesWithAging();
  const apData = await getVendorsAndBillsWithAging();

  return {
    asOfDate: formatIsoDate(new Date()),
    accounts,
    trialBalance,
    profitAndLoss,
    balanceSheet,
    arAging: arData.aging,
    apAging: apData.aging,
  };
}
