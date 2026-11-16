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
import { useLanguage } from '../context/LanguageContext';

interface BookingPageProps {
  initialServiceId?: string | null;
  onSelectProduct?: (productId: string) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  initialServiceId,
  onSelectProduct,
}) => {
  const { t } = useLanguage();
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
    <div className="pt-24 lg:pt-32 pb-20 min-h-screen bg-[#07130D] text-[#F4F0E6] selection:bg-[#D4AF37] selection:text-[#06110C]">
      {/* Header Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
            {t.brand.clinicName} · {t.brand.hoursPolicy}
          </p>

          <h1 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F0E6]">
            {t.booking.pageTitle}
          </h1>

          <p className="text-sm sm:text-base text-[#C2D1C8] leading-relaxed">
            {t.booking.pageSub}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#A6B8AE] pt-1 font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              {t.brand.clinicAddress}
            </span>
            <span className="text-[#1D3B2C]">·</span>
            <span className="flex items-center gap-1.5">
              <Video className="w-4 h-4 text-[#D4AF37]" />
              {t.booking.telehealthBadge}
            </span>
            <span className="text-[#1D3B2C]">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              {t.booking.confidentialBadge}
            </span>
          </div>
        </div>
      </section>

      {/* Navigation View Switcher */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-10">
        <div className="p-1.5 rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setActiveTab('patient-booking')}
            className={`flex-1 min-h-[44px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'patient-booking'
                ? 'bg-[#D4AF37] text-[#06110C] shadow-sm'
                : 'text-[#C2D1C8] hover:text-[#F4F0E6] hover:bg-[#06110C]/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{t.booking.tabPatient}</span>
          </button>

          <button
            onClick={() => setActiveTab('staff-calendar')}
            className={`flex-1 min-h-[44px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'staff-calendar'
                ? 'bg-[#D4AF37] text-[#06110C] shadow-sm'
                : 'text-[#C2D1C8] hover:text-[#F4F0E6] hover:bg-[#06110C]/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t.booking.tabStaff}</span>
          </button>

          <button
            onClick={() => setActiveTab('lookup')}
            className={`flex-1 min-h-[44px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'lookup'
                ? 'bg-[#D4AF37] text-[#06110C] shadow-sm'
                : 'text-[#C2D1C8] hover:text-[#F4F0E6] hover:bg-[#06110C]/60'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>{t.booking.tabLookup}</span>
          </button>
        </div>
      </section>

      {/* VIEW 1: Patient Booking Wizard */}
      {activeTab === 'patient-booking' && (
        <>
          <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#06110C] border border-[#1D3B2C] flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-classic font-bold text-sm text-[#F4F0E6] mb-1">
                    {t.booking.policyTitle}
                  </h3>
                  <p className="text-xs text-[#A6B8AE] leading-relaxed">
                    {t.booking.policyDesc}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#06110C] border border-[#1D3B2C] flex items-center justify-center text-[#D4AF37] shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-classic font-bold text-sm text-[#F4F0E6] mb-1">
                    {t.booking.recordsTitle}
                  </h3>
                  <p className="text-xs text-[#A6B8AE] leading-relaxed">
                    {t.booking.recordsDesc}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#06110C] border border-[#1D3B2C] flex items-center justify-center text-[#D4AF37] shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-classic font-bold text-sm text-[#F4F0E6] mb-1">
                    {t.booking.fastTitle}
                  </h3>
                  <p className="text-xs text-[#A6B8AE] leading-relaxed">
                    {t.booking.fastDesc}
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
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1D14] border border-[#1D3B2C] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif-classic text-2xl font-bold text-[#F4F0E6]">
                  {t.booking.lookupTitle}
                </h2>
                <p className="text-xs text-[#A6B8AE] mt-1">
                  {t.booking.lookupSub}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#06110C] border border-[#1D3B2C] flex items-center justify-center text-[#D4AF37] shrink-0">
                <Search className="w-5 h-5" />
              </div>
            </div>

            <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder={t.booking.lookupPlaceholder}
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="flex-1 min-h-[44px] px-4 py-3 rounded-xl bg-[#06110C] border border-[#1D3B2C] focus:border-[#D4AF37] text-sm text-[#F4F0E6] placeholder:text-[#6E8478] focus:outline-none"
              />
              <button
                type="submit"
                className="min-h-[44px] px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                {t.booking.searchBtn}
              </button>
            </form>

            {lookupResult.searched && (
              <div className="mt-6 pt-6 border-t border-[#1D3B2C]">
                {lookupResult.found && lookupResult.appointment ? (
                  <div className="p-5 rounded-2xl bg-[#06110C] border border-[#D4AF37]/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-wider text-[#D4AF37]">
                        {t.booking.confirmedLabel} #{lookupResult.appointment.referenceNumber || lookupResult.appointment.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                        {lookupResult.appointment.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-[#A6B8AE]">
                      <div>
                        <span className="block text-[10px]">{t.booking.patientLabel}</span>
                        <strong className="text-[#F4F0E6]">{lookupResult.appointment.patient?.fullName || 'Patient'}</strong>
                      </div>
                      <div>
                        <span className="block text-[10px]">{t.booking.serviceLabel}</span>
                        <strong className="text-[#F4F0E6]">{lookupResult.appointment.serviceTitle}</strong>
                      </div>
                      <div>
                        <span className="block text-[10px]">{t.booking.dateTimeLabel}</span>
                        <strong className="text-[#F4F0E6]" dir="ltr">
                          {lookupResult.appointment.date} · {lookupResult.appointment.timeSlot}
                        </strong>
                      </div>
                      <div>
                        <span className="block text-[10px]">{t.booking.clinicianLabel}</span>
                        <strong className="text-[#F4F0E6]">{lookupResult.appointment.practitionerName}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
                    <span>
                      {t.booking.noMatchPrefix} &ldquo;{lookupQuery}&rdquo;. {t.booking.noMatchSuffix}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Reception Hotline Notice */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="p-6 rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#06110C] flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#F4F0E6]">
                {t.booking.hotlineTitle}
              </h4>
              <p className="text-xs text-[#A6B8AE]">
                {t.brand.clinicAddress} · {t.brand.hoursPolicy}
              </p>
            </div>
          </div>

          <a
            href={`tel:${CLINIC_PROFILE.phone}`}
            dir="ltr"
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#E2C36B] text-xs font-bold text-[#06110C] transition-colors flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>{t.booking.callBtnPrefix}</span>
            <span>{CLINIC_PROFILE.formattedPhone}</span>
          </a>
        </div>
      </section>
    </div>
  );
};
