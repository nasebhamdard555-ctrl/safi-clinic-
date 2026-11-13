import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ShieldCheck,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle2,
  Search,
  MapPin,
  Video,
  Users,
} from 'lucide-react';
import { AppointmentBooking } from '../components/AppointmentBooking';
import { StaffCalendar } from '../components/StaffCalendar';
import { Appointment } from '../types/clinic';
import { CLINIC_PROFILE } from '../data/clinicData';

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
    <div className="pt-24 lg:pt-32 pb-20 min-h-screen bg-[#FAF8F5] text-[#18201B] selection:bg-[#18201B] selection:text-[#FAF8F5]">
      {/* Header Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8C5A32]">
            {CLINIC_PROFILE.name} · {CLINIC_PROFILE.hoursPolicy}
          </p>

          <h1 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#18201B]">
            Book Your Clinical Consultation
          </h1>

          <p className="text-sm sm:text-base text-[#525C56] leading-relaxed">
            Reserve an in-person consultation with Dr. Hafizullah Safi and our clinical care team at Main Airport Road, Charahi Shaheed, Kabul, or book a telehealth video review.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#525C56] pt-1 font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#8C5A32]" />
              {CLINIC_PROFILE.clinicAddress}
            </span>
            <span className="text-[#D6CFC3]">·</span>
            <span className="flex items-center gap-1.5">
              <Video className="w-4 h-4 text-[#18201B]" />
              Telehealth Video Available
            </span>
            <span className="text-[#D6CFC3]">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#18201B]" />
              Patient Confidentiality
            </span>
          </div>
        </div>
      </section>

      {/* Navigation View Switcher */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-10">
        <div className="p-1.5 rounded-2xl bg-[#F2EEE7] border border-[#D6CFC3] flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setActiveTab('patient-booking')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'patient-booking'
                ? 'bg-[#18201B] text-[#FAF8F5] shadow-sm'
                : 'text-[#525C56] hover:text-[#18201B] hover:bg-white/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Patient Booking Wizard</span>
          </button>

          <button
            onClick={() => setActiveTab('staff-calendar')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'staff-calendar'
                ? 'bg-[#18201B] text-[#FAF8F5] shadow-sm'
                : 'text-[#525C56] hover:text-[#18201B] hover:bg-white/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Clinic Staff Master Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('lookup')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'lookup'
                ? 'bg-[#18201B] text-[#FAF8F5] shadow-sm'
                : 'text-[#525C56] hover:text-[#18201B] hover:bg-white/60'
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
          <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-white border border-[#D6CFC3] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F2EEE7] flex items-center justify-center text-[#18201B] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-classic font-bold text-sm text-[#18201B] mb-1">
                    Scheduling & Walk-In Policy
                  </h3>
                  <p className="text-xs text-[#525C56] leading-relaxed">
                    {CLINIC_PROFILE.hoursPolicy}. Scheduled appointments take priority, followed by walk-in evaluations.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#D6CFC3] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F2EEE7] flex items-center justify-center text-[#18201B] shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-classic font-bold text-sm text-[#18201B] mb-1">
                    Bring Recent Medical Records
                  </h3>
                  <p className="text-xs text-[#525C56] leading-relaxed">
                    Bring lab reports and current prescription names so we can run a thorough herb-drug safety review.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#D6CFC3] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F2EEE7] flex items-center justify-center text-[#18201B] shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-classic font-bold text-sm text-[#18201B] mb-1">
                    2-Hour Pre-Visit Fast
                  </h3>
                  <p className="text-xs text-[#525C56] leading-relaxed">
                    Avoid coffee or heavy meals 2 hours prior for accurate pulse (Nabz) and tongue evaluation.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
            <AppointmentBooking
              initialServiceId={initialServiceId}
              onSelectProduct={onSelectProduct}
            />
          </section>
        </>
      )}

      {/* VIEW 2: Clinic Staff Master Calendar */}
      {activeTab === 'staff-calendar' && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
          <StaffCalendar />
        </section>
      )}

      {/* VIEW 3: Booking Lookup Tool */}
      {activeTab === 'lookup' && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-14">
          <div className="p-8 rounded-3xl bg-white border border-[#D6CFC3] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif-classic text-2xl font-bold text-[#18201B]">
                  Look Up an Existing Booking
                </h2>
                <p className="text-xs text-[#525C56] mt-1">
                  Enter your booking reference number (e.g. SHC-8401), phone number, or email.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#F2EEE7] flex items-center justify-center text-[#18201B] shrink-0">
                <Search className="w-5 h-5" />
              </div>
            </div>

            <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="e.g. SHC-8401 or +93 780 299 299"
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="flex-1 px-4 py-3.5 rounded-xl bg-[#FAF8F5] border border-[#D6CFC3] focus:border-[#18201B] text-sm text-[#18201B] placeholder:text-[#8A918C] focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-[#18201B] hover:bg-[#2C3931] text-[#FAF8F5] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Search Booking
              </button>
            </form>

            {lookupResult.searched && (
              <div className="mt-6 pt-6 border-t border-[#E6E0D6]">
                {lookupResult.found && lookupResult.appointment ? (
                  <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#18201B] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-wider text-[#8C5A32]">
                        Booking Confirmed #{lookupResult.appointment.referenceNumber || lookupResult.appointment.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold">
                        {lookupResult.appointment.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#525C56]">
                      <div>
                        <span className="block text-[10px]">Patient</span>
                        <strong className="text-[#18201B]">{lookupResult.appointment.patient?.fullName || 'Patient'}</strong>
                      </div>
                      <div>
                        <span className="block text-[10px]">Service</span>
                        <strong className="text-[#18201B]">{lookupResult.appointment.serviceTitle}</strong>
                      </div>
                      <div>
                        <span className="block text-[10px]">Date & Time</span>
                        <strong className="text-[#18201B]">{lookupResult.appointment.date} at {lookupResult.appointment.timeSlot}</strong>
                      </div>
                      <div>
                        <span className="block text-[10px]">Clinician</span>
                        <strong className="text-[#18201B]">{lookupResult.appointment.practitionerName}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>
                      No booking found matching &ldquo;{lookupQuery}&rdquo;. Contact our reception desk at {CLINIC_PROFILE.formattedPhone}.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Urgent Notice */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="p-6 rounded-2xl bg-white border border-[#D6CFC3] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#18201B] text-[#FAF8F5] flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#18201B]">
                Direct Reception & Walk-In Coordination
              </h4>
              <p className="text-xs text-[#525C56]">
                {CLINIC_PROFILE.clinicAddress} · {CLINIC_PROFILE.hoursPolicy}
              </p>
            </div>
          </div>

          <a
            href={`tel:${CLINIC_PROFILE.phone}`}
            className="px-5 py-2.5 rounded-lg bg-[#18201B] hover:bg-[#2C3931] text-xs font-bold text-[#FAF8F5] transition-colors shrink-0"
          >
            Call {CLINIC_PROFILE.formattedPhone}
          </a>
        </div>
      </section>
    </div>
  );
};
