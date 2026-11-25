import { CollectionPage } from './CollectionPage';
import { MODULES } from '../modules';
import { Stat } from '../components/ui';
import { useCollection } from '../lib/useCollection';
import { money } from '../lib/format';
import type { Row } from '../lib/types';

const sumOf = (rows: Row[], type: string) =>
  rows.filter((r) => r.type === type).reduce((total, r) => total + Number(r.amount || 0), 0);

export function AccountingPage() {
  const { rows } = useCollection('accounting');
  const month = new Date().toISOString().slice(0, 7);
  const thisMonth = rows.filter((r) => String(r.date).startsWith(month));
  const inc = sumOf(thisMonth, 'Income');
  const exp = sumOf(thisMonth, 'Expense');
  const allInc = sumOf(rows, 'Income');
  const allExp = sumOf(rows, 'Expense');

  return (
    <CollectionPage
      mod={MODULES.accounting}
      header={
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Income this month" value={money(inc)} />
          <Stat label="Expenses this month" value={money(exp)} />
          <Stat label="Net this month" value={money(inc - exp)} />
          <Stat label="Net all time" value={money(allInc - allExp)} hint={`In ${money(allInc)} · Out ${money(allExp)}`} />
        </div>
      }
    />
  );
}
