import { useMemo, useState } from 'react';
import { CollectionPage } from './CollectionPage';
import { MODULES } from '../modules';
import { Card, Stat, inputCls } from '../components/ui';
import { useCollection } from '../lib/useCollection';
import { money } from '../lib/format';
import type { Row } from '../lib/types';

const monthOf = (r: Row) => String(r.date ?? '').slice(0, 7);
const sumOf = (rows: Row[], type: string) =>
  rows.filter((r) => r.type === type).reduce((total, r) => total + Number(r.amount || 0), 0);

const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

export function AccountingPage() {
  const { rows } = useCollection('accounting');
  const current = monthKey(new Date());
  const [month, setMonth] = useState<string>('all');

  const months = useMemo(
    () => Array.from(new Set(rows.map(monthOf).filter(Boolean), )).sort().reverse(),
    [rows],
  );
  const inScope = (r: Row) => month === 'all' || monthOf(r) === month;
  const scoped = rows.filter(inScope);
  const inc = sumOf(scoped, 'Income');
  const exp = sumOf(scoped, 'Expense');
  const allInc = sumOf(rows, 'Income');
  const allExp = sumOf(rows, 'Expense');

  // Last six calendar months, ending with the current month.
  const lastSix = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - (5 - i));
        return monthKey(d);
      }),
    [],
  );
  const chart = lastSix.map((m) => {
    const part = rows.filter((r) => monthOf(r) === m);
    return { m, income: sumOf(part, 'Income'), expense: sumOf(part, 'Expense') };
  });
  const peak = Math.max(1, ...chart.flatMap((c) => [c.income, c.expense]));

  return (
    <CollectionPage
      mod={MODULES.accounting}
      rowFilter={inScope}
      header={
        <div className="mb-6">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <label className="text-xs uppercase tracking-wider text-muted" htmlFor="month-filter">
              Period
            </label>
            <select id="month-filter" className={`${inputCls} sm:w-56`} value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="all">All months</option>
              {!months.includes(current) && <option value={current}>This month ({current})</option>}
              {months.map((m) => (
                <option key={m} value={m}>
                  {m === current ? `This month (${m})` : m}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label={month === 'all' ? 'Income (all months)' : 'Income in period'} value={money(inc)} />
            <Stat label={month === 'all' ? 'Expenses (all months)' : 'Expenses in period'} value={money(exp)} />
            <Stat label="Net in period" value={money(inc - exp)} />
            <Stat label="Net all time" value={money(allInc - allExp)} hint={`In ${money(allInc)} · Out ${money(allExp)}`} />
          </div>

          <Card className="p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-gold">Income vs expenses, last 6 months</p>
              <p className="text-xs text-muted">
                <span className="mr-3 inline-block h-2 w-3 rounded-sm bg-gold align-middle" /> Income
                <span className="ml-4 mr-1 inline-block h-2 w-3 rounded-sm bg-danger align-middle" /> Expenses
              </p>
            </div>
            <div className="flex h-44 items-end gap-3 sm:gap-6">
              {chart.map((c) => (
                <div key={c.m} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-36 w-full items-end justify-center gap-1">
                    <div
                      className="w-1/2 max-w-6 rounded-t bg-linear-to-b from-gold-2 to-gold"
                      style={{ height: `${(c.income / peak) * 100}%`, minHeight: c.income ? 2 : 0 }}
                      title={`Income ${money(c.income)}`}
                    />
                    <div
                      className="w-1/2 max-w-6 rounded-t bg-danger/80"
                      style={{ height: `${(c.expense / peak) * 100}%`, minHeight: c.expense ? 2 : 0 }}
                      title={`Expenses ${money(c.expense)}`}
                    />
                  </div>
                  <span className="text-[11px] text-muted">{c.m}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      }
    />
  );
}
