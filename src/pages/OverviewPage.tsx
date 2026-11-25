import { Card, EmptyState, PageHeader, Stat, formatCell } from '../components/ui';
import { useCollection } from '../lib/useCollection';
import { money, today } from '../lib/format';
import type { Row } from '../lib/types';
import { useAuth } from '../lib/auth';

const sumOf = (rows: Row[], type: string) =>
  rows.filter((r) => r.type === type).reduce((total, r) => total + Number(r.amount || 0), 0);

export function OverviewPage() {
  const { user } = useAuth();
  const patients = useCollection('patients').rows;
  const appts = useCollection('appointments').rows;
  const inventory = useCollection('inventory').rows;
  const accounting = useCollection('accounting').rows;

  const todayStr = today();
  const month = todayStr.slice(0, 7);
  const todayAppts = appts.filter((a) => String(a.date).startsWith(todayStr));
  const upcoming = appts
    .filter((a) => String(a.date) >= todayStr && a.status !== 'Cancelled')
    .sort((a, b) => (String(a.date) < String(b.date) ? -1 : 1))
    .slice(0, 6);
  const lowStock = inventory.filter((i) => Number(i.quantity) <= Number(i.reorderLevel));
  const monthRows = accounting.filter((a) => String(a.date).startsWith(month));
  const net = sumOf(monthRows, 'Income') - sumOf(monthRows, 'Expense');

  return (
    <div>
      <PageHeader title={`Welcome, ${user?.displayName ?? 'there'}`} subtitle="Today at a glance: patients, appointments, stock and this month's money." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Patients" value={patients.length} hint="Registered in total" />
        <Stat label="Today's appointments" value={todayAppts.length} hint={`${todayAppts.filter((a) => a.status === 'Checked in').length} checked in`} />
        <Stat label="Low-stock items" value={lowStock.length} hint={lowStock.length ? 'Reorder soon' : 'All stock above reorder level'} />
        <Stat label="Net this month" value={money(net)} hint="Income minus expenses" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="border-b border-line px-4 py-3">
            <h2 className="font-semibold text-gold">Upcoming appointments</h2>
          </div>
          {upcoming.length === 0 ? (
            <EmptyState text="No upcoming appointments." />
          ) : (
            <ul className="divide-y divide-line/60">
              {upcoming.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <div>
                    <p className="text-cream">{String(a.patientName || '—')}</p>
                    <p className="text-xs text-muted">{String(a.reason || a.doctor || '')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted">{formatCell(a.date, 'datetime')}</p>
                    {formatCell(a.status, 'badge')}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-line px-4 py-3">
            <h2 className="font-semibold text-gold">Stock to reorder</h2>
          </div>
          {lowStock.length === 0 ? (
            <EmptyState text="Nothing is below its reorder level." />
          ) : (
            <ul className="divide-y divide-line/60">
              {lowStock.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <span className="text-cream">{String(i.name)}</span>
                  <span className="text-muted">
                    {String(i.quantity)} left · reorder at {String(i.reorderLevel)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
