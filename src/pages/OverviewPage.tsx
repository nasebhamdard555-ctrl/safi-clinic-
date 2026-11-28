import { useEffect, useState } from 'react';
import { Bell, BellRing, Check, CheckCircle2, Clock } from 'lucide-react';
import { Card, EmptyState, PageHeader, Stat, formatCell } from '../components/ui';
import { RecentActivity } from '../components/RecentActivity';
import { useCollection } from '../lib/useCollection';
import { store } from '../lib/store';
import { logActivity } from '../lib/activity';
import { dateTime, money, today } from '../lib/format';
import {
  OVERVIEW_WORKFLOW_STATUSES,
  getAppointmentStatusMeta,
  getUpcomingAppointments,
  isWorkflowStatusActive,
  summarizeTodayAppointments,
  type WorkflowStatus,
} from '../lib/appointmentStatus';
import {
  buildReminderMessage,
  getPatientPhone,
  hasBeenNotified,
  isReminderEligible,
} from '../lib/appointmentReminder';
import type { Row } from '../lib/types';
import { useAuth } from '../lib/auth';

const sumOf = (rows: Row[], type: string) =>
  rows.filter((r) => r.type === type).reduce((total, r) => total + Number(r.amount || 0), 0);

const STATUS_ICONS: Record<WorkflowStatus, typeof Clock> = {
  Pending: Clock,
  Confirmed: Check,
  Completed: CheckCircle2,
};

export function OverviewPage({ onOpenActivity }: { onOpenActivity?: () => void } = {}) {
  const { user } = useAuth();
  const patients = useCollection('patients').rows;
  const apptsCollection = useCollection('appointments');
  const appts = apptsCollection.rows;
  const inventory = useCollection('inventory').rows;
  const accounting = useCollection('accounting').rows;
  const activityCollection = useCollection('activity');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const todayStr = today();
  const month = todayStr.slice(0, 7);
  const todayStats = summarizeTodayAppointments(appts, todayStr);
  const upcoming = getUpcomingAppointments(appts, todayStr, 6);
  const lowStock = inventory.filter((i) => Number(i.quantity) <= Number(i.reorderLevel));
  const monthRows = accounting.filter((a) => String(a.date).startsWith(month));
  const net = sumOf(monthRows, 'Income') - sumOf(monthRows, 'Expense');

  const updateAppointmentStatus = async (appt: Row, nextStatus: WorkflowStatus) => {
    if (updatingId || isWorkflowStatusActive(appt.status, nextStatus)) return;
    setStatusError(null);
    setUpdatingId(appt.id);
    try {
      await store.update('appointments', appt.id, { status: nextStatus });
      const label = String(appt.patientName || 'Appointment');
      await logActivity(user?.displayName ?? 'Unknown', 'Updated', 'appointment', `${label} → ${nextStatus}`);
      await Promise.all([apptsCollection.reload(), activityCollection.reload()]);
      setToast(`${label} marked ${nextStatus}.`);
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : 'Could not update appointment status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const notifyAppointment = async (appt: Row) => {
    if (updatingId || !isReminderEligible(appt, todayStr)) return;
    setStatusError(null);
    setUpdatingId(appt.id);
    try {
      const remindedAt = new Date().toISOString();
      await store.update('appointments', appt.id, { remindedAt });
      const phone = getPatientPhone(appt.patientName, patients);
      const message = buildReminderMessage(appt, phone);
      await logActivity(
        user?.displayName ?? 'Unknown',
        'Notified',
        'appointment',
        `${String(appt.patientName || 'Patient')} (${dateTime(appt.date)})`,
      );
      await Promise.all([apptsCollection.reload(), activityCollection.reload()]);
      setToast(message);
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : 'Could not send appointment reminder.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <PageHeader title={`Welcome, ${user?.displayName ?? 'there'}`} subtitle="Today at a glance: patients, appointments, stock and this month's money." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Patients" value={patients.length} hint="Registered in total" />
        <Stat
          label="Today's appointments"
          value={todayStats.total}
          hint={`${todayStats.confirmed} confirmed · ${todayStats.completed} completed`}
        />
        <Stat label="Low-stock items" value={lowStock.length} hint={lowStock.length ? 'Reorder soon' : 'All stock above reorder level'} />
        <Stat label="Net this month" value={money(net)} hint="Income minus expenses" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
            <h2 className="font-semibold text-gold">Upcoming appointments</h2>
            <span className="text-xs text-muted">{upcoming.length} shown</span>
          </div>
          {statusError && (
            <p className="border-b border-danger/30 bg-danger/10 px-4 py-2 text-xs text-danger">{statusError}</p>
          )}
          {upcoming.length === 0 ? (
            <EmptyState text="No upcoming appointments." />
          ) : (
            <ul className="divide-y divide-line/60">
              {upcoming.map((a) => {
                const meta = getAppointmentStatusMeta(a.status);
                const isSaving = updatingId === a.id;
                const notified = hasBeenNotified(a);
                const canNotify = isReminderEligible(a, todayStr);
                return (
                  <li key={a.id} className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-cream">{String(a.patientName || '—')}</p>
                        <p className="text-xs text-muted">
                          {[a.reason, a.doctor].filter(Boolean).map(String).join(' · ') || 'Clinic visit'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 text-right">
                        <p className="text-xs text-muted">{formatCell(a.date, 'datetime')}</p>
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          {notified && (
                            <span
                              className="inline-flex items-center gap-1 rounded-full border border-gold/50 bg-gold/10 px-2 py-0.5 text-[11px] font-medium text-gold"
                              title={`Reminder sent ${dateTime(a.remindedAt)}`}
                              aria-label="Reminder sent"
                            >
                              <BellRing size={11} aria-hidden="true" />
                              Reminded
                            </span>
                          )}
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${meta.indicatorClass}`}
                            aria-label={`Status: ${meta.label}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} aria-hidden="true" />
                            {meta.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5" role="group" aria-label={`Update status for ${String(a.patientName || 'appointment')}`}>
                      <span className="mr-1 text-[11px] uppercase tracking-wider text-muted">Update:</span>
                      {OVERVIEW_WORKFLOW_STATUSES.map((status) => {
                        const active = isWorkflowStatusActive(a.status, status);
                        const Icon = STATUS_ICONS[status];
                        const activeStyle =
                          status === 'Pending'
                            ? 'border-gold/70 bg-gold/20 text-gold'
                            : 'border-ok/70 bg-ok/20 text-ok';
                        return (
                          <button
                            key={status}
                            type="button"
                            disabled={isSaving || active}
                            aria-pressed={active}
                            onClick={() => updateAppointmentStatus(a, status)}
                            className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition disabled:cursor-default ${
                              active
                                ? activeStyle
                                : 'border-line bg-ink/40 text-cream/80 hover:border-gold/60 hover:text-gold disabled:opacity-50'
                            }`}
                          >
                            <Icon size={12} />
                            {status}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        disabled={isSaving || !canNotify}
                        onClick={() => notifyAppointment(a)}
                        title={
                          !canNotify
                            ? 'Reminders are only available for active upcoming appointments'
                            : notified
                              ? `Reminder sent ${dateTime(a.remindedAt)} — click to notify again`
                              : 'Send upcoming appointment reminder'
                        }
                        className={`ml-auto inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                          notified
                            ? 'border-gold/60 bg-gold/15 text-gold hover:bg-gold/25'
                            : 'border-gold/40 bg-ink/40 text-gold hover:border-gold hover:bg-gold/10'
                        }`}
                      >
                        {notified ? <BellRing size={12} /> : <Bell size={12} />}
                        Notify
                      </button>
                    </div>
                  </li>
                );
              })}
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

      <RecentActivity
        rows={activityCollection.rows}
        loading={activityCollection.loading}
        onRefresh={activityCollection.reload}
        onViewAll={onOpenActivity}
      />

      {toast && (
        <div role="status" className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-gold/50 bg-forest px-4 py-3 text-sm text-gold shadow-lg">
          <BellRing size={16} aria-hidden="true" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
