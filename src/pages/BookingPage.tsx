import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ShieldCheck,
  Sparkles,
  Phone,
  MessageCircle,
  FileText,
  AlertCircle,
  CheckCircle2,
  Search,
  MapPin,
  Video,
  Users,
  CalendarCheck,
} from 'lucide-react';
import { AppointmentBooking } from '../components/AppointmentBooking';
import { StaffCalendar } from '../components/StaffCalendar';
import { Appointment } from '../types/clinic';

interface BookingPageProps {
  initialServiceId?: string | null;
  onSelectProduct?: (productId: string) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  initialServiceId,
  onSelectProduct,
}) => {
  const [activeTab, setActiveTab] = useState<'patient-booking' | 'staff-calendar' | 'lookup'>(
    'patient-booking'
  );
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<{
    found: boolean;
    appointment?: Appointment;
    searched: boolean;
  }>({ found: false, searched: false });

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;

    try {
      const stored = localStorage.getItem('safi_appointments');
      if (stored) {
        const list: Appointment[] = JSON.parse(stored);
        const q = lookupQuery.trim().toLowerCase();
        const match = list.find(
          (a) =>
            a.id?.toLowerCase() === q ||
            a.referenceNumber?.toLowerCase() === q ||
            a.patient?.phone?.includes(lookupQuery.trim()) ||
            a.patient?.email?.toLowerCase() === q
        );
        if (match) {
          setLookupResult({ found: true, appointment: match, searched: true });
          return;
        }
      }
      setLookupResult({ found: false, searched: true });
    } catch {
      setLookupResult({ found: false, searched: true });
    }
  };

  return (
    <div className="pt-24 lg:pt-32 pb-20 min-h-screen bg-[#05121a] text-[#f5f3ec] relative selection:bg-[#f59e0b] selection:text-black">
      {/* Page Ambient Midnight Cypress & Amber Topaz Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-cyan-600/25 via-blue-900/15 to-transparent blur-[150px] pointer-events-none -z-10" />

      {/* Header Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0b242a] border border-[#f0c365]/40 text-[#f0c365] text-xs font-semibold uppercase tracking-widest shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consultation Scheduling & Staff Operations Portal</span>
          </div>

          <h1 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f5f3ec]">
            Book Your Clinical Consultation
          </h1>

          <p className="text-sm sm:text-base text-[#a6b6ad] leading-relaxed">
            Choose your preferred therapy, select an experienced herbal practitioner in Kabul, and reserve an in-clinic visit or live telehealth video appointment.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#8da396] pt-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#f0c365]" />
              In-Clinic VIP Dispensary Suite (Kabul)
            </span>
            <span className="text-[#1a444e]">·</span>
            <span className="flex items-center gap-1.5">
              <Video className="w-4 h-4 text-teal-400" />
              Worldwide Telehealth Consultations
            </span>
            <span className="text-[#1a444e]">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#f0c365]" />
              Strict Confidentiality
            </span>
          </div>
        </div>
      </section>

      {/* Navigation View Switcher (Patient Booking vs Staff Calendar vs Lookup) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-10">
        <div className="p-1.5 rounded-2xl bg-[#092228] border border-[#1d4c57] flex flex-col sm:flex-row gap-2 shadow-lg">
          <button
            onClick={() => setActiveTab('patient-booking')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'patient-booking'
                ? 'bg-gradient-to-r from-[#f0c365] to-[#c7993d] text-black shadow-md'
                : 'text-[#a6b6ad] hover:text-[#f5f3ec] hover:bg-[#0d2f38]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Patient Booking Wizard</span>
          </button>

          <button
            onClick={() => setActiveTab('staff-calendar')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'staff-calendar'
                ? 'bg-gradient-to-r from-[#f0c365] to-[#c7993d] text-black shadow-md'
                : 'text-[#a6b6ad] hover:text-[#f5f3ec] hover:bg-[#0d2f38]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Clinic Staff Master Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('lookup')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'lookup'
                ? 'bg-gradient-to-r from-[#f0c365] to-[#c7993d] text-black shadow-md'
                : 'text-[#a6b6ad] hover:text-[#f5f3ec] hover:bg-[#0d2f38]'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Look Up Booking</span>
          </button>
        </div>
      </section>

      {/* VIEW 1: Patient Booking Wizard */}
      {activeTab === 'patient-booking' && (
        <>
          {/* Pre-Appointment Patient Guide Cards */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-[#092228] border border-[#1d4c57] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#f0c365]/15 border border-[#f0c365]/40 flex items-center justify-center text-[#f0c365] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-classic font-bold text-sm text-[#f5f3ec] mb-1">
                    Fast 2-3 Hours Prior
                  </h3>
                  <p className="text-xs text-[#a6b6ad] leading-relaxed">
                    For accurate pulse (Nabz) and abdominal examination, please refrain from heavy meals or excess coffee 2 hours before your visit.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#092228] border border-[#1d4c57] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#f0c365]/15 border border-[#f0c365]/40 flex items-center justify-center text-[#f0c365] shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-classic font-bold text-sm text-[#f5f3ec] mb-1">
                    Bring Medical Records
                  </h3>
                  <p className="text-xs text-[#a6b6ad] leading-relaxed">
                    Bring any recent lab test panels, ultrasound reports, and a complete list of current prescription medicines for our safety audit.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#092228] border border-[#1d4c57] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#f0c365]/15 border border-[#f0c365]/40 flex items-center justify-center text-[#f0c365] shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-classic font-bold text-sm text-[#f5f3ec] mb-1">
                    Flexible 24h Rescheduling
                  </h3>
                  <p className="text-xs text-[#a6b6ad] leading-relaxed">
                    Need to change your appointment date? Easily reschedule anytime up to 24 hours prior with zero cancellation fees.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Main Booking Engine Component */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
            <AppointmentBooking
              initialServiceId={initialServiceId}
              onSelectProduct={onSelectProduct}
            />
          </section>
        </>
      )}

      {/* VIEW 2: Clinic Staff Master Calendar */}
      {activeTab === 'staff-calendar' && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
          <StaffCalendar />
        </section>
      )}

      {/* VIEW 3: Booking Lookup Tool */}
      {activeTab === 'lookup' && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-16">
          <div className="p-8 rounded-3xl bg-[#092228] border border-[#f0c365]/40 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif-classic text-2xl font-bold text-[#f5f3ec]">
                  Look Up an Existing Booking
                </h3>
                <p className="text-xs text-[#8da396] mt-1">
                  Already scheduled? Enter your booking reference number (e.g., SHC-XXXX), phone number, or email.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#06181d] border border-[#1d4c57] flex items-center justify-center text-[#f0c365] shrink-0">
                <Search className="w-5 h-5" />
              </div>
            </div>

            <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="e.g. SHC-8401 or +93 780 299 299"
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="flex-1 px-4 py-3.5 rounded-xl bg-[#051418] border border-[#1d4c57] focus:border-[#f0c365] text-sm text-[#f5f3ec] placeholder:text-[#4d707b] focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#f0c365] to-[#c7993d] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer"
              >
                Search Booking
              </button>
            </form>

            {lookupResult.searched && (
              <div className="mt-6 pt-6 border-t border-[#1a444e]">
                {lookupResult.found && lookupResult.appointment ? (
                  <div className="p-5 rounded-2xl bg-[#06181d] border border-[#f0c365]/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-wider text-[#f0c365]">
                        Booking Confirmed #{lookupResult.appointment.referenceNumber || lookupResult.appointment.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                        {lookupResult.appointment.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#a6b6ad]">
                      <div>
                        <span className="block text-[10px] text-[#8da396]">Patient</span>
                        <strong className="text-[#f5f3ec]">{lookupResult.appointment.patient?.fullName || 'Valued Patient'}</strong>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#8da396]">Service</span>
                        <strong className="text-[#f5f3ec]">{lookupResult.appointment.serviceTitle}</strong>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#8da396]">Date & Time</span>
                        <strong className="text-[#f5f3ec]">{lookupResult.appointment.date} at {lookupResult.appointment.timeSlot}</strong>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#8da396]">Practitioner</span>
                        <strong className="text-[#f5f3ec]">{lookupResult.appointment.practitionerName}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>
                      No booking found matching "{lookupQuery}". Please check the reference code or contact our reception desk in Kabul at +93 780 299 299.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Emergency & Urgent Notice */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="p-6 rounded-2xl bg-[#092228] border border-[#1d4c57] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#f5f3ec]">Need Urgent Same-Day Attention?</h4>
              <p className="text-xs text-[#a6b6ad]">
                For acute pain flare-ups, urgent triage, or prescription inquiries in Kabul, contact our clinical desk directly.
              </p>
            </div>
          </div>

          <a
            href="tel:+93780299299"
            className="px-5 py-2.5 rounded-lg bg-[#06181d] border border-[#f0c365] text-xs font-bold text-[#f0c365] hover:bg-[#f0c365] hover:text-black transition-colors shrink-0"
          >
            Call Desk: +93 780 299 299
          </a>
        </div>
      </section>
    </div>
  );
};
