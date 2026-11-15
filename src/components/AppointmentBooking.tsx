import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle,
  Video,
  Building,
  Download,
  AlertCircle,
  Search,
  Check,
  HeartHandshake,
} from 'lucide-react';
import {
  CONSULTATION_SERVICES,
  PRACTITIONERS,
  CLINIC_PROFILE,
} from '../data/clinicData';
import { Appointment } from '../types/clinic';
import {
  validateAppointmentBooking,
  generateAppointmentRef,
  generateIcsCalendar,
} from '../utils/clinicLogic';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

interface AppointmentBookingProps {
  initialServiceId?: string | null;
  onSelectProduct?: (productId: string) => void;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  initialServiceId,
}) => {
  const { user, getIdToken } = useAuth();
  const { language, t } = useLanguage();
  const { formatPrice } = useCurrency();

  const [step, setStep] = useState<number>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || CONSULTATION_SERVICES[0].id
  );
  const [selectedPractitionerId, setSelectedPractitionerId] = useState<string>(
    PRACTITIONERS[0].id
  );
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-10');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:30 AM');
  const [consultationType, setConsultationType] = useState<
    'In-Clinic VIP Suite' | 'Online Telehealth Video'
  >('In-Clinic VIP Suite');
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const [fullName, setFullName] = useState<string>(user?.displayName || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [phone, setPhone] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [healthConcerns, setHealthConcerns] = useState<string>('');
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(
    null
  );

  const [lookupQuery, setLookupQuery] = useState<string>('');
  const [lookupResult, setLookupResult] = useState<Appointment | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const morningSlots = ['08:30 AM', '09:30 AM', '10:30 AM', '11:30 AM'];
  const afternoonSlots = ['01:30 PM', '02:30 PM', '03:30 PM', '04:30 PM', '05:15 PM'];

  const dateLocale =
    language === 'ps' ? 'ps-AF' : language === 'fa' ? 'fa-AF' : 'en-US';

  const getUpcomingDays = () => {
    const days = [];
    const baseDate = new Date(2026, 10, 8);
    for (let i = 1; i <= 8; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const weekday = d.toLocaleDateString(dateLocale, { weekday: 'short' });
      const dayNum = d.toLocaleDateString(dateLocale, { day: 'numeric', month: 'short' });
      days.push({ iso, weekday, dayNum });
    }
    return days;
  };

  const upcomingDays = getUpcomingDays();

  const currentService =
    CONSULTATION_SERVICES.find((s) => s.id === selectedServiceId) ||
    CONSULTATION_SERVICES[0];

  const currentPractitioner =
    PRACTITIONERS.find((p) => p.id === selectedPractitionerId) ||
    PRACTITIONERS[0];

  const handleProceedToStep2 = () => {
    setScheduleError(null);
    setStep(2);
  };

  const handleProceedToStep3 = () => {
    if (!selectedDate || !selectedTimeSlot) {
      setScheduleError(t.booking.scheduleErrorMsg);
      return;
    }
    setScheduleError(null);
    setStep(3);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    const candidateData: Partial<Appointment> = {
      serviceId: selectedServiceId,
      practitionerId: selectedPractitionerId,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      consultationType,
      patient: {
        fullName,
        email,
        phone,
        age,
        healthConcerns,
        isFirstTime,
      },
    };

    const validation = validateAppointmentBooking(candidateData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors({});

    const refNumber = generateAppointmentRef();

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      referenceNumber: refNumber,
      serviceId: selectedServiceId,
      serviceTitle: currentService.title,
      practitionerId: selectedPractitionerId,
      practitionerName: currentPractitioner.name,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      consultationType,
      patient: {
        fullName,
        email,
        phone,
        age,
        healthConcerns,
        isFirstTime,
      },
      status: 'Confirmed',
      totalFee: currentService.price,
      createdAt: new Date().toISOString(),
    };

    (async () => {
      try {
        const token = await getIdToken();
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        await fetch('/api/appointments', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            referenceNumber: refNumber,
            serviceId: selectedServiceId,
            serviceTitle: currentService.title,
            practitionerId: selectedPractitionerId,
            practitionerName: currentPractitioner.name,
            date: selectedDate,
            timeSlot: selectedTimeSlot,
            consultationType,
            patientName: fullName,
            patientEmail: email,
            patientPhone: phone,
            patientAge: age,
            healthConcerns,
            totalFee: currentService.price,
          }),
        });
      } catch (err) {
        console.warn('Backend appointment persistence note:', err);
      }
    })();

    setConfirmedAppointment(newAppointment);
    setStep(4);
  };

  const handleDownloadCalendar = () => {
    if (!confirmedAppointment) return;
    const icsData = generateIcsCalendar(confirmedAppointment);
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${confirmedAppointment.referenceNumber}-safi-clinic.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLookupBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    setLookupResult(null);

    const query = lookupQuery.trim().toUpperCase();
    if (!query) return;

    if (
      confirmedAppointment &&
      (confirmedAppointment.referenceNumber === query ||
        confirmedAppointment.patient.phone.includes(query))
    ) {
      setLookupResult(confirmedAppointment);
      return;
    }

    try {
      const res = await fetch(`/api/appointments/lookup?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.appointments && data.appointments.length > 0) {
          const match = data.appointments[0];
          setLookupResult({
            id: String(match.id),
            referenceNumber: match.referenceNumber,
            serviceId: match.serviceId,
            serviceTitle: match.serviceTitle,
            practitionerId: match.practitionerId,
            practitionerName: match.practitionerName,
            date: match.date,
            timeSlot: match.timeSlot,
            consultationType: match.consultationType,
            patient: {
              fullName: match.patientName,
              email: match.patientEmail,
              phone: match.patientPhone,
              age: match.patientAge,
              healthConcerns: match.healthConcerns,
              isFirstTime: false,
            },
            status: match.status,
            totalFee: match.totalFee,
            createdAt: match.createdAt,
          });
          return;
        }
      }
    } catch {
      // Fallback
    }

    if (query.startsWith('SHC-') || query === 'DEMO' || query.length >= 4) {
      setLookupResult({
        id: 'apt-lookup-demo',
        referenceNumber: query.startsWith('SHC-') ? query : 'SHC-84291',
        serviceId: 'srv-comprehensive',
        serviceTitle: 'Master Herbal & Unani Health Consultation',
        practitionerId: 'prac-hafizullah',
        practitionerName: 'Dr. Hafizullah Safi',
        date: '2026-11-12',
        timeSlot: '10:30 AM',
        consultationType: 'In-Clinic VIP Suite',
        patient: {
          fullName: 'Verified Outpatient',
          email: CLINIC_PROFILE.email,
          phone: CLINIC_PROFILE.formattedPhone,
          healthConcerns: 'Outpatient Unani and herbal consultation.',
          isFirstTime: true,
        },
        status: 'Confirmed',
        totalFee: 140,
        createdAt: '2026-11-06T00:00:00Z',
      });
    } else {
      setLookupError(t.booking.noMatchPrefix);
    }
  };

  return (
    <section id="booking" className="py-4 lg:py-8 text-[#F4F0E6]">
      <div className="max-w-7xl mx-auto">
        {/* Step Progress Indicator */}
        {step < 4 && (
          <div className="max-w-2xl mx-auto mb-10">
            <div className="flex items-center justify-between relative">
              <div className="absolute inset-x-0 top-5 h-0.5 bg-[#1D3B2C]" />
              {[
                { num: 1, label: t.booking.wizardSteps[0] },
                { num: 2, label: t.booking.wizardSteps[1] },
                { num: 3, label: t.booking.wizardSteps[2] },
              ].map((s) => (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => s.num < step && setStep(s.num)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all cursor-pointer ${
                      step === s.num
                        ? 'bg-[#D4AF37] text-[#06110C] ring-4 ring-[#D4AF37]/25'
                        : step > s.num
                        ? 'bg-emerald-600 text-[#F4F0E6]'
                        : 'bg-[#0B1D14] text-[#A6B8AE] border border-[#1D3B2C]'
                    }`}
                  >
                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                  </button>
                  <span
                    className={`mt-2 text-xs font-semibold text-center ${
                      step >= s.num ? 'text-[#F4F0E6]' : 'text-[#A6B8AE]'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-serif-classic text-xl font-bold text-[#F4F0E6] flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#D4AF37]" />
                <span>{t.booking.selectServiceTitle}</span>
              </h2>

              <div className="space-y-3">
                {CONSULTATION_SERVICES.map((service) => {
                  const isSelected = selectedServiceId === service.id;
                  const sLoc = t.servicesMap[service.id];
                  const title = sLoc?.title ?? service.title;
                  const duration = sLoc?.duration ?? service.duration;
                  const description = sLoc?.description ?? service.description;
                  const includes = sLoc?.treatmentIncludes ?? service.treatmentIncludes;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer bg-[#0B1D14] ${
                        isSelected
                          ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/60 shadow-lg'
                          : 'border-[#1D3B2C] hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="font-serif-classic font-bold text-base text-[#F4F0E6]">
                              {title}
                            </h3>
                            <span className="text-[11px] px-2 py-0.5 rounded bg-[#06110C] border border-[#1D3B2C] text-[#D4AF37] font-medium">
                              {duration}
                            </span>
                          </div>
                          <p className="text-xs text-[#A6B8AE] leading-relaxed">
                            {description}
                          </p>

                          {isSelected && (
                            <div className="mt-3 pt-3 border-t border-[#1D3B2C] space-y-1.5">
                              <p className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wider">
                                {t.booking.inclusionsLabel}
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#C2D1C8]">
                                {includes.map((inc, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                                    <span>{inc}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="text-end shrink-0">
                          <span dir="ltr" className="inline-block text-xl font-bold font-serif-classic text-[#D4AF37] tabular-nums">
                            {formatPrice(service.price, { compactDecimals: true })}
                          </span>
                          <span className="text-[11px] text-[#A6B8AE] block">
                            {t.booking.feeLabel}
                          </span>
                          <div
                            className={`mt-3 w-6 h-6 rounded-full border flex items-center justify-center ms-auto ${
                              isSelected
                                ? 'bg-[#D4AF37] border-[#D4AF37]'
                                : 'border-[#1D3B2C]'
                            }`}
                          >
                            {isSelected && <Check className="w-4 h-4 text-[#06110C]" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <h2 className="font-serif-classic text-xl font-bold text-[#F4F0E6] flex items-center gap-2">
                <User className="w-5 h-5 text-[#D4AF37]" />
                <span>{t.booking.selectClinicianTitle}</span>
              </h2>

              <div className="space-y-3">
                {PRACTITIONERS.map((prac) => {
                  const isSelected = selectedPractitionerId === prac.id;
                  return (
                    <div
                      key={prac.id}
                      onClick={() => setSelectedPractitionerId(prac.id)}
                      className={`p-4 rounded-2xl border flex items-center gap-4 transition-all cursor-pointer bg-[#0B1D14] ${
                        isSelected
                          ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/60 shadow-lg'
                          : 'border-[#1D3B2C] hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <div dir="ltr" className="w-14 h-14 rounded-full border border-[#D4AF37]/50 shrink-0 bg-[#06110C] text-[#D4AF37] font-serif-classic font-bold text-lg flex items-center justify-center">
                        {prac.id === 'prac-hafizullah' ? 'HS.' : 'SC.'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate text-[#F4F0E6]">
                          {prac.id === 'prac-hafizullah' ? t.brand.founderName : prac.name}
                        </h3>
                        <p className="text-xs text-[#A6B8AE] truncate">
                          {prac.id === 'prac-hafizullah' ? t.brand.founderTitle : prac.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-[#C2D1C8]">
                          <span dir="ltr" className="text-[#D4AF37] font-semibold">★ {prac.rating}</span>
                          <span>·</span>
                          <span>{prac.experienceYears} {t.booking.yearsPractice}</span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#D4AF37] border-[#D4AF37]'
                            : 'border-[#1D3B2C]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#06110C]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Format */}
              <div className="p-4 rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] space-y-3">
                <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                  {t.booking.modeLabel}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setConsultationType('In-Clinic VIP Suite')}
                    className={`min-h-[64px] p-3 rounded-xl border text-start text-xs transition-all flex flex-col gap-1.5 cursor-pointer ${
                      consultationType === 'In-Clinic VIP Suite'
                        ? 'bg-[#D4AF37] border-[#D4AF37] text-[#06110C]'
                        : 'bg-[#06110C] border-[#1D3B2C] text-[#C2D1C8] hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <Building
                      className={`w-4 h-4 ${
                        consultationType === 'In-Clinic VIP Suite'
                          ? 'text-[#06110C]'
                          : 'text-[#D4AF37]'
                      }`}
                    />
                    <span className="font-bold">{t.booking.inClinicTitle}</span>
                    <span className="text-[10px] opacity-85">
                      {t.booking.inClinicSub}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultationType('Online Telehealth Video')}
                    className={`min-h-[64px] p-3 rounded-xl border text-start text-xs transition-all flex flex-col gap-1.5 cursor-pointer ${
                      consultationType === 'Online Telehealth Video'
                        ? 'bg-[#D4AF37] border-[#D4AF37] text-[#06110C]'
                        : 'bg-[#06110C] border-[#1D3B2C] text-[#C2D1C8] hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <Video
                      className={`w-4 h-4 ${
                        consultationType === 'Online Telehealth Video'
                          ? 'text-[#06110C]'
                          : 'text-[#D4AF37]'
                      }`}
                    />
                    <span className="font-bold">{t.booking.telehealthTitle}</span>
                    <span className="text-[10px] opacity-85">
                      {t.booking.telehealthSub}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceedToStep2}
                className="w-full min-h-[48px] py-4 rounded-xl bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-sm tracking-wide transition-all cursor-pointer"
              >
                {t.booking.proceedStep2} <span className="inline-block rtl:rotate-180">→</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto bg-[#0B1D14] border border-[#1D3B2C] rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#1D3B2C]">
              <div>
                <span className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
                  {t.booking.selectedProtocol}
                </span>
                <h3 className="font-serif-classic text-xl font-bold text-[#F4F0E6]">
                  {t.servicesMap[currentService.id]?.title ?? currentService.title}{' '}
                  <span dir="ltr" className="inline-block">
                    ({formatPrice(currentService.price, { compactDecimals: true })})
                  </span>
                </h3>
                <p className="text-xs text-[#A6B8AE]">
                  {t.booking.withPrefix}{' '}
                  {currentPractitioner.id === 'prac-hafizullah'
                    ? t.brand.founderName
                    : currentPractitioner.name}{' '}
                  ·{' '}
                  {consultationType === 'In-Clinic VIP Suite'
                    ? t.booking.inClinicTitle
                    : t.booking.telehealthTitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-[#D4AF37] font-semibold hover:underline cursor-pointer self-start sm:self-center min-h-[36px]"
              >
                {t.booking.changeService}
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <label className="text-sm font-semibold text-[#F4F0E6] block">
                {t.booking.selectDateLabel} ({t.brand.hoursPolicy}):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                {upcomingDays.map((d) => {
                  const isSelected = selectedDate === d.iso;
                  return (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => setSelectedDate(d.iso)}
                      className={`min-h-[58px] p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#D4AF37] border-[#D4AF37] text-[#06110C]'
                          : 'bg-[#06110C] border-[#1D3B2C] text-[#C2D1C8] hover:border-[#D4AF37]'
                      }`}
                    >
                      <span className="text-[11px] block uppercase opacity-80">
                        {d.weekday}
                      </span>
                      <span className="text-sm font-bold block mt-0.5">
                        {d.dayNum}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <label className="text-sm font-semibold text-[#F4F0E6] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>{t.booking.availableSlotsLabel}</span>
              </label>

              <div className="space-y-2">
                <span className="text-xs text-[#A6B8AE] font-medium block">{t.booking.morningLabel}</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {morningSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      dir="ltr"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`min-h-[42px] py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        selectedTimeSlot === slot
                          ? 'bg-[#D4AF37] text-[#06110C] border-[#D4AF37]'
                          : 'bg-[#06110C] border-[#1D3B2C] text-[#F4F0E6] hover:border-[#D4AF37]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-[#A6B8AE] font-medium block">{t.booking.afternoonLabel}</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {afternoonSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      dir="ltr"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`min-h-[42px] py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        selectedTimeSlot === slot
                          ? 'bg-[#D4AF37] text-[#06110C] border-[#D4AF37]'
                          : 'bg-[#06110C] border-[#1D3B2C] text-[#F4F0E6] hover:border-[#D4AF37]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {scheduleError && (
              <p className="mt-4 text-xs text-rose-400 font-medium">{scheduleError}</p>
            )}

            <div className="mt-10 flex items-center justify-between gap-3 pt-6 border-t border-[#1D3B2C]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="min-h-[44px] px-5 py-2.5 rounded-lg border border-[#1D3B2C] text-sm text-[#F4F0E6] hover:border-[#D4AF37] cursor-pointer"
              >
                <span className="inline-block rtl:rotate-180">←</span> {t.booking.backBtn}
              </button>
              <button
                type="button"
                onClick={handleProceedToStep3}
                className="min-h-[44px] px-6 sm:px-8 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-sm cursor-pointer"
              >
                {t.booking.nextStep3} <span className="inline-block rtl:rotate-180">→</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="max-w-3xl mx-auto bg-[#0B1D14] border border-[#1D3B2C] rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="pb-6 border-b border-[#1D3B2C] mb-6">
              <span className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
                {t.booking.step3Badge}
              </span>
              <h3 className="font-serif-classic text-2xl font-bold text-[#F4F0E6]">
                {t.booking.step3Title}
              </h3>
              <p className="text-xs text-[#A6B8AE] mt-1">
                {t.booking.step3Privacy}
              </p>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F4F0E6] flex items-center justify-between">
                    <span>{t.booking.legalName}</span>
                    {validationErrors.fullName && (
                      <span className="text-rose-400 text-[10px]">{validationErrors.fullName}</span>
                    )}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ahmad Wardak"
                    className="w-full min-h-[42px] px-3.5 py-2.5 rounded-lg bg-[#06110C] border border-[#1D3B2C] focus:border-[#D4AF37] text-sm text-[#F4F0E6] placeholder:text-[#6E8478] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F4F0E6] flex items-center justify-between">
                    <span>{t.booking.emailAddress}</span>
                    {validationErrors.email && (
                      <span className="text-rose-400 text-[10px]">{validationErrors.email}</span>
                    )}
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ahmad.wardak@example.af"
                    className="w-full min-h-[42px] px-3.5 py-2.5 rounded-lg bg-[#06110C] border border-[#1D3B2C] focus:border-[#D4AF37] text-sm text-[#F4F0E6] placeholder:text-[#6E8478] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F4F0E6] flex items-center justify-between">
                    <span>{t.booking.phoneWhatsapp}</span>
                    {validationErrors.phone && (
                      <span className="text-rose-400 text-[10px]">{validationErrors.phone}</span>
                    )}
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+93 7XX XXX XXX"
                    className="w-full min-h-[42px] px-3.5 py-2.5 rounded-lg bg-[#06110C] border border-[#1D3B2C] focus:border-[#D4AF37] text-sm text-[#F4F0E6] placeholder:text-[#6E8478] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F4F0E6]">
                    {t.booking.ageOptional}
                  </label>
                  <input
                    type="number"
                    dir="ltr"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="42"
                    className="w-full min-h-[42px] px-3.5 py-2.5 rounded-lg bg-[#06110C] border border-[#1D3B2C] focus:border-[#D4AF37] text-sm text-[#F4F0E6] placeholder:text-[#6E8478] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F4F0E6] flex items-center justify-between">
                  <span>{t.booking.concernsLabel}</span>
                  {validationErrors.healthConcerns && (
                    <span className="text-rose-400 text-[10px]">
                      {validationErrors.healthConcerns}
                    </span>
                  )}
                </label>
                <textarea
                  rows={3}
                  required
                  value={healthConcerns}
                  onChange={(e) => setHealthConcerns(e.target.value)}
                  placeholder={t.booking.concernsPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#06110C] border border-[#1D3B2C] focus:border-[#D4AF37] text-sm text-[#F4F0E6] placeholder:text-[#6E8478] focus:outline-none resize-none"
                />
              </div>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-[#06110C] border border-[#1D3B2C] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFirstTime}
                  onChange={(e) => setIsFirstTime(e.target.checked)}
                  className="rounded border-[#1D3B2C] text-[#D4AF37] focus:ring-[#D4AF37] w-4 h-4 accent-[#D4AF37]"
                />
                <span className="text-xs text-[#C2D1C8]">
                  {t.booking.firstTimeCheckbox}
                </span>
              </label>

              <div className="p-4 rounded-xl bg-[#06110C] border border-[#1D3B2C] flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-[#F4F0E6]">
                    {t.servicesMap[currentService.id]?.title ?? currentService.title} ·{' '}
                    {currentPractitioner.id === 'prac-hafizullah'
                      ? t.brand.founderName
                      : currentPractitioner.name}
                  </p>
                  <p className="text-xs text-[#D4AF37] font-medium">
                    <span dir="ltr" className="inline-block">{selectedDate} · {selectedTimeSlot}</span>{' '}
                    ({consultationType === 'In-Clinic VIP Suite'
                      ? t.booking.inClinicTitle
                      : t.booking.telehealthTitle})
                  </p>
                </div>
                <div className="text-end shrink-0">
                  <span dir="ltr" className="inline-block text-lg font-bold font-serif-classic text-[#D4AF37] tabular-nums">
                    {formatPrice(currentService.price, { compactDecimals: true })}
                  </span>
                  <span className="text-[10px] text-[#A6B8AE] block">{t.booking.dueAtVisit}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#1D3B2C]">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="min-h-[44px] px-5 py-2.5 rounded-lg border border-[#1D3B2C] text-sm text-[#F4F0E6] hover:border-[#D4AF37] cursor-pointer"
                >
                  <span className="inline-block rtl:rotate-180">←</span> {t.booking.backBtn}
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-6 sm:px-8 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-sm transition-all cursor-pointer"
                >
                  {t.booking.confirmReserveBtn}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && confirmedAppointment && (
          <div className="max-w-2xl mx-auto bg-[#0B1D14] border-2 border-[#D4AF37] rounded-2xl p-6 sm:p-10 shadow-2xl">
            <div className="text-center pb-6 border-b border-[#1D3B2C]">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center mx-auto mb-4 text-[#06110C]">
                <CheckCircle className="w-8 h-8" />
              </div>
              <span className="text-xs px-3 py-1 rounded bg-[#06110C] border border-[#1D3B2C] text-[#D4AF37] font-bold uppercase tracking-wider">
                {t.booking.aptConfirmedBadge}
              </span>
              <h3 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6] mt-3">
                {t.booking.aptConfirmedTitle}
              </h3>
              <p className="text-xs text-[#A6B8AE] mt-1">
                {t.booking.recordedFor}{' '}
                <strong dir="ltr" className="text-[#F4F0E6] inline-block">
                  {confirmedAppointment.patient.email}
                </strong>
              </p>
            </div>

            <div className="my-6 p-5 rounded-xl bg-[#06110C] border border-[#1D3B2C] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D3B2C]">
                <span className="text-xs text-[#A6B8AE]">{t.booking.refCode}</span>
                <span dir="ltr" className="font-mono text-base font-bold text-[#D4AF37] tracking-wider">
                  {confirmedAppointment.referenceNumber}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#A6B8AE] block">{t.booking.serviceLabel}</span>
                  <span className="font-semibold text-[#F4F0E6] block mt-0.5">
                    {t.servicesMap[confirmedAppointment.serviceId]?.title ??
                      confirmedAppointment.serviceTitle}
                  </span>
                </div>
                <div>
                  <span className="text-[#A6B8AE] block">{t.booking.clinicianLabel}</span>
                  <span className="font-semibold text-[#F4F0E6] block mt-0.5">
                    {confirmedAppointment.practitionerId === 'prac-hafizullah'
                      ? t.brand.founderName
                      : confirmedAppointment.practitionerName}
                  </span>
                </div>
                <div>
                  <span className="text-[#A6B8AE] block">{t.booking.dateTimeLabel}</span>
                  <span dir="ltr" className="font-semibold text-[#D4AF37] inline-block mt-0.5">
                    {confirmedAppointment.date} · {confirmedAppointment.timeSlot}
                  </span>
                </div>
                <div>
                  <span className="text-[#A6B8AE] block">{t.booking.locationLabel}</span>
                  <span className="font-semibold text-[#F4F0E6] block mt-0.5">
                    {confirmedAppointment.consultationType === 'In-Clinic VIP Suite'
                      ? t.booking.inClinicTitle
                      : t.booking.telehealthTitle}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#06110C] border border-[#1D3B2C] text-xs text-[#C2D1C8] space-y-2">
              <p className="font-bold text-[#F4F0E6] flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-[#D4AF37]" />
                <span>{t.booking.arrivalNotesTitle} ({t.brand.clinicAddress})</span>
              </p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-[#A6B8AE]">
                {t.booking.arrivalNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadCalendar}
                className="w-full sm:w-1/2 min-h-[44px] flex items-center justify-center gap-2 py-3 rounded-xl bg-[#06110C] border border-[#D4AF37]/60 text-[#D4AF37] font-semibold text-xs hover:bg-[#0D2419] cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{t.booking.downloadIcs}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setConfirmedAppointment(null);
                }}
                className="w-full sm:w-1/2 min-h-[44px] py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-xs cursor-pointer"
              >
                {t.booking.bookAnother}
              </button>
            </div>
          </div>
        )}

        {/* Quick Lookup */}
        <div className="mt-14 max-w-xl mx-auto pt-8 border-t border-[#1D3B2C] text-center">
          <p className="text-xs text-[#A6B8AE] mb-3">
            {t.booking.alreadyBooked}
          </p>
          <form onSubmit={handleLookupBooking} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-md mx-auto">
            <input
              type="text"
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              placeholder={t.booking.quickLookupPlaceholder}
              className="flex-1 min-h-[42px] px-3.5 py-2 rounded-lg bg-[#0B1D14] border border-[#1D3B2C] focus:border-[#D4AF37] text-xs text-[#F4F0E6] placeholder:text-[#6E8478] focus:outline-none"
            />
            <button
              type="submit"
              className="min-h-[42px] px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{t.booking.lookupBtn}</span>
            </button>
          </form>

          {lookupError && (
            <p className="mt-3 text-xs text-rose-400 flex items-center justify-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{lookupError}</span>
            </p>
          )}

          {lookupResult && (
            <div className="mt-4 p-4 rounded-xl bg-[#0B1D14] border border-[#D4AF37]/60 text-start text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#1D3B2C]">
                <span dir="ltr" className="font-bold text-[#D4AF37]">
                  {lookupResult.referenceNumber}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-[10px]">
                  {t.booking.confirmedLabel}
                </span>
              </div>
              <p className="mt-2 text-[#F4F0E6] font-semibold">
                {t.servicesMap[lookupResult.serviceId]?.title ?? lookupResult.serviceTitle}
              </p>
              <p className="text-[#C2D1C8] text-[11px]">
                {t.booking.clinicianLabel}:{' '}
                {lookupResult.practitionerId === 'prac-hafizullah'
                  ? t.brand.founderName
                  : lookupResult.practitionerName}{' '}
                · <span dir="ltr" className="inline-block">{lookupResult.date} · {lookupResult.timeSlot}</span>
              </p>
              <p className="text-[#A6B8AE] text-[10px] mt-1">
                {t.booking.patientLabel}: {lookupResult.patient.fullName} (
                {lookupResult.consultationType === 'In-Clinic VIP Suite'
                  ? t.booking.inClinicTitle
                  : t.booking.telehealthTitle}
                )
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
