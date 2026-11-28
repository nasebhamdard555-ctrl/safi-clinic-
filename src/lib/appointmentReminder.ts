import { dateTime } from './format';
import type { Row } from './types';

/** Returns true if an appointment is upcoming and eligible to receive a reminder notification. */
export function isReminderEligible(appt: Row, todayStr: string): boolean {
  const dateStr = String(appt.date ?? '');
  if (!dateStr || dateStr < todayStr) return false;
  const status = String(appt.status ?? '');
  if (/cancel|complete|no show/i.test(status)) return false;
  return true;
}

/** Returns true if a reminder has already been sent for this appointment. */
export function hasBeenNotified(appt: Row): boolean {
  return Boolean(appt.remindedAt && String(appt.remindedAt).trim());
}

/** Looks up the phone number for a patient name from the registered patients list. */
export function getPatientPhone(patientName: unknown, patientRows: Row[]): string {
  const target = String(patientName ?? '').trim().toLowerCase();
  if (!target) return '';
  const match = patientRows.find((p) => String(p.fullName ?? '').trim().toLowerCase() === target);
  return String(match?.phone ?? '').trim();
}

/** Formats the confirmation toast message for an upcoming appointment reminder. */
export function buildReminderMessage(appt: Row, patientPhone?: string): string {
  const name = String(appt.patientName ?? '').trim() || 'Patient';
  const phone = String(patientPhone ?? '').trim();
  const when = dateTime(appt.date);
  const recipient = phone ? `${name} (${phone})` : name;
  return `Reminder sent to ${recipient} for ${when}.`;
}
