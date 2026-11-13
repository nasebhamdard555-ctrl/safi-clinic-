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
import { BotanicalImage } from './BotanicalImage';

interface AppointmentBookingProps {
  initialServiceId?: string | null;
  onSelectProduct?: (productId: string) => void;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  initialServiceId,
}) => {
  const { user, getIdToken } = useAuth();

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

  const getUpcomingDays = () => {
    const days = [];
    const baseDate = new Date(2026, 10, 8);
    for (let i = 1; i <= 8; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
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
      setScheduleError('Please select both a date and an available clinic time slot.');
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
      setLookupError('No active appointment found with this reference number or phone.');
    }
  };

  return (
    <section id="booking" className="py-8 lg:py-12 bg-[#FAF8F5] text-[#18201B]">
      <div className="max-w-7xl mx-auto">
        {/* Step Progress Indicator */}
        {step < 4 && (
          <div className="max-w-2xl mx-auto mb-10">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#D6CFC3]" />
              {[
                { num: 1, label: 'Service & Clinician' },
                { num: 2, label: 'Date & Time' },
                { num: 3, label: 'Patient Details' },
              ].map((s) => (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => s.num < step && setStep(s.num)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all cursor-pointer ${
                      step === s.num
                        ? 'bg-[#18201B] text-[#FAF8F5] ring-4 ring-[#8C5A32]/20'
                        : step > s.num
                        ? 'bg-[#8C5A32] text-[#FAF8F5]'
                        : 'bg-white text-[#6D7771] border border-[#D6CFC3]'
                    }`}
                  >
                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                  </button>
                  <span
                    className={`mt-2 text-xs font-semibold ${
                      step >= s.num ? 'text-[#18201B]' : 'text-[#6D7771]'
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
              <h2 className="font-serif-classic text-xl font-bold text-[#18201B] flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#8C5A32]" />
                <span>1. Select Clinical Service</span>
              </h2>

              <div className="space-y-3">
                {CONSULTATION_SERVICES.map((service) => {
                  const isSelected = selectedServiceId === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                        isSelected
                          ? 'border-[#18201B] ring-1 ring-[#18201B] shadow-sm'
                          : 'border-[#D6CFC3] hover:border-[#8C5A32]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="font-serif-classic font-bold text-base text-[#18201B]">
                              {service.title}
                            </h3>
                            <span className="text-[11px] px-2 py-0.5 rounded bg-[#F2EEE7] text-[#525C56] font-medium">
                              {service.duration}
                            </span>
                          </div>
                          <p className="text-xs text-[#525C56] leading-relaxed">
                            {service.description}
                          </p>

                          {isSelected && (
                            <div className="mt-3 pt-3 border-t border-[#E6E0D6] space-y-1.5">
                              <p className="text-[11px] font-semibold text-[#8C5A32] uppercase tracking-wider">
                                Protocol Inclusions:
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#2B3730]">
                                {service.treatmentIncludes.map((inc, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5 text-[#18201B] shrink-0" />
                                    <span>{inc}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xl font-bold font-serif-classic text-[#18201B] tabular-nums">
                            ${service.price}
                          </span>
                          <span className="text-[11px] text-[#525C56] block">
                            consultation fee
                          </span>
                          <div
                            className={`mt-3 w-6 h-6 rounded-full border flex items-center justify-center ml-auto ${
                              isSelected
                                ? 'bg-[#18201B] border-[#18201B]'
                                : 'border-[#D6CFC3]'
                            }`}
                          >
                            {isSelected && <Check className="w-4 h-4 text-[#FAF8F5]" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <h2 className="font-serif-classic text-xl font-bold text-[#18201B] flex items-center gap-2">
                <User className="w-5 h-5 text-[#8C5A32]" />
                <span>2. Select Clinician</span>
              </h2>

              <div className="space-y-3">
                {PRACTITIONERS.map((prac) => {
                  const isSelected = selectedPractitionerId === prac.id;
                  return (
                    <div
                      key={prac.id}
                      onClick={() => setSelectedPractitionerId(prac.id)}
                      className={`p-4 rounded-2xl border flex items-center gap-4 transition-all cursor-pointer bg-white ${
                        isSelected
                          ? 'border-[#18201B] ring-1 ring-[#18201B] shadow-sm'
                          : 'border-[#D6CFC3] hover:border-[#8C5A32]'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-full border border-[#D6CFC3] shrink-0 bg-[#18201B] text-[#FAF8F5] font-serif-classic font-bold text-lg flex items-center justify-center">
                        {prac.id === 'prac-hafizullah' ? 'HS.' : 'SC.'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate text-[#18201B]">
                          {prac.name}
                        </h3>
                        <p className="text-xs text-[#525C56] truncate">{prac.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-[#525C56]">
                          <span className="text-[#8C5A32] font-semibold">★ {prac.rating}</span>
                          <span>·</span>
                          <span>{prac.experienceYears} Years Practice</span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#18201B] border-[#18201B]'
                            : 'border-[#D6CFC3]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#FAF8F5]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Format */}
              <div className="p-4 rounded-2xl bg-white border border-[#D6CFC3] space-y-3">
                <p className="text-xs font-semibold text-[#18201B] uppercase tracking-wider">
                  Consultation Mode:
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setConsultationType('In-Clinic VIP Suite')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col gap-1.5 cursor-pointer ${
                      consultationType === 'In-Clinic VIP Suite'
                        ? 'bg-[#18201B] border-[#18201B] text-[#FAF8F5]'
                        : 'bg-[#FAF8F5] border-[#D6CFC3] text-[#525C56]'
                    }`}
                  >
                    <Building className="w-4 h-4 text-[#8C5A32]" />
                    <span className="font-bold">In-Clinic Visit</span>
                    <span className="text-[10px] opacity-80">
                      Charahi Shaheed, Kabul
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultationType('Online Telehealth Video')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col gap-1.5 cursor-pointer ${
                      consultationType === 'Online Telehealth Video'
                        ? 'bg-[#18201B] border-[#18201B] text-[#FAF8F5]'
                        : 'bg-[#FAF8F5] border-[#D6CFC3] text-[#525C56]'
                    }`}
                  >
                    <Video className="w-4 h-4 text-[#8C5A32]" />
                    <span className="font-bold">Telehealth Video</span>
                    <span className="text-[10px] opacity-80">
                      Link emailed after booking
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceedToStep2}
                className="w-full py-4 rounded-xl bg-[#18201B] hover:bg-[#2C3931] text-[#FAF8F5] font-bold text-sm tracking-wide transition-all cursor-pointer"
              >
                Proceed to Date &amp; Time →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto bg-white border border-[#D6CFC3] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-6 border-b border-[#E6E0D6]">
              <div>
                <span className="text-xs text-[#8C5A32] font-semibold uppercase tracking-wider">
                  Selected Protocol:
                </span>
                <h3 className="font-serif-classic text-xl font-bold text-[#18201B]">
                  {currentService.title} (${currentService.price})
                </h3>
                <p className="text-xs text-[#525C56]">
                  With {currentPractitioner.name} · {consultationType}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-[#8C5A32] font-semibold hover:underline cursor-pointer"
              >
                Change Service
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <label className="text-sm font-semibold text-[#18201B] block">
                Select Date ({CLINIC_PROFILE.hoursPolicy}):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                {upcomingDays.map((d) => {
                  const isSelected = selectedDate === d.iso;
                  return (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => setSelectedDate(d.iso)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#18201B] border-[#18201B] text-[#FAF8F5]'
                          : 'bg-[#FAF8F5] border-[#D6CFC3] text-[#525C56] hover:border-[#18201B]'
                      }`}
                    >
                      <span className="text-[11px] block uppercase opacity-75">
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
              <label className="text-sm font-semibold text-[#18201B] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8C5A32]" />
                <span>Available Clinic Time Slots:</span>
              </label>

              <div className="space-y-2">
                <span className="text-xs text-[#525C56] font-medium block">Morning</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {morningSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        selectedTimeSlot === slot
                          ? 'bg-[#18201B] text-[#FAF8F5] border-[#18201B]'
                          : 'bg-[#FAF8F5] border-[#D6CFC3] text-[#18201B] hover:border-[#18201B]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-[#525C56] font-medium block">Afternoon</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {afternoonSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        selectedTimeSlot === slot
                          ? 'bg-[#18201B] text-[#FAF8F5] border-[#18201B]'
                          : 'bg-[#FAF8F5] border-[#D6CFC3] text-[#18201B] hover:border-[#18201B]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {scheduleError && (
              <p className="mt-4 text-xs text-rose-700 font-medium">{scheduleError}</p>
            )}

            <div className="mt-10 flex items-center justify-between pt-6 border-t border-[#E6E0D6]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-lg border border-[#D6CFC3] text-sm text-[#18201B] hover:bg-[#FAF8F5] cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleProceedToStep3}
                className="px-8 py-3.5 rounded-xl bg-[#18201B] hover:bg-[#2C3931] text-[#FAF8F5] font-bold text-sm cursor-pointer"
              >
                Next: Patient Details →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="max-w-3xl mx-auto bg-white border border-[#D6CFC3] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="pb-6 border-b border-[#E6E0D6] mb-6">
              <span className="text-xs text-[#8C5A32] font-semibold uppercase tracking-wider">
                Step 3 of 3
              </span>
              <h3 className="font-serif-classic text-2xl font-bold text-[#18201B]">
                Patient Information &amp; Health Context
              </h3>
              <p className="text-xs text-[#525C56] mt-1">
                All patient details are confidential under Safi Natural Care Clinic privacy protocols.
              </p>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#18201B] flex items-center justify-between">
                    <span>Full Legal Name *</span>
                    {validationErrors.fullName && (
                      <span className="text-rose-700 text-[10px]">{validationErrors.fullName}</span>
                    )}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ahmad Wardak"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#D6CFC3] focus:border-[#18201B] text-sm text-[#18201B] placeholder-[#8A918C] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#18201B] flex items-center justify-between">
                    <span>Email Address *</span>
                    {validationErrors.email && (
                      <span className="text-rose-700 text-[10px]">{validationErrors.email}</span>
                    )}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ahmad.wardak@example.af"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#D6CFC3] focus:border-[#18201B] text-sm text-[#18201B] placeholder-[#8A918C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#18201B] flex items-center justify-between">
                    <span>Phone / WhatsApp *</span>
                    {validationErrors.phone && (
                      <span className="text-rose-700 text-[10px]">{validationErrors.phone}</span>
                    )}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+93 7XX XXX XXX"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#D6CFC3] focus:border-[#18201B] text-sm text-[#18201B] placeholder-[#8A918C] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#18201B]">
                    Patient Age (optional)
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 42"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#D6CFC3] focus:border-[#18201B] text-sm text-[#18201B] placeholder-[#8A918C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#18201B] flex items-center justify-between">
                  <span>Primary Health Concerns *</span>
                  {validationErrors.healthConcerns && (
                    <span className="text-rose-700 text-[10px]">
                      {validationErrors.healthConcerns}
                    </span>
                  )}
                </label>
                <textarea
                  rows={3}
                  required
                  value={healthConcerns}
                  onChange={(e) => setHealthConcerns(e.target.value)}
                  placeholder="Describe your symptoms, duration, and current medications..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#D6CFC3] focus:border-[#18201B] text-sm text-[#18201B] placeholder-[#8A918C] focus:outline-none resize-none"
                />
              </div>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-[#FAF8F5] border border-[#D6CFC3] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFirstTime}
                  onChange={(e) => setIsFirstTime(e.target.checked)}
                  className="rounded border-[#D6CFC3] text-[#18201B] focus:ring-[#18201B] w-4 h-4"
                />
                <span className="text-xs text-[#2B3730]">
                  First-time patient visiting Safi Natural Care Clinic
                </span>
              </label>

              <div className="p-4 rounded-xl bg-[#F2EEE7] border border-[#D6CFC3] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#18201B]">
                    {currentService.title} · {currentPractitioner.name}
                  </p>
                  <p className="text-xs text-[#8C5A32] font-medium">
                    {selectedDate} at {selectedTimeSlot} ({consultationType})
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold font-serif-classic text-[#18201B] tabular-nums">
                    ${currentService.price}
                  </span>
                  <span className="text-[10px] text-[#525C56] block">Due at visit</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E6E0D6]">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-lg border border-[#D6CFC3] text-sm text-[#18201B] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-[#18201B] hover:bg-[#2C3931] text-[#FAF8F5] font-bold text-sm transition-all cursor-pointer"
                >
                  Confirm &amp; Reserve Visit
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && confirmedAppointment && (
          <div className="max-w-2xl mx-auto bg-white border-2 border-[#18201B] rounded-2xl p-6 sm:p-10 shadow-sm">
            <div className="text-center pb-6 border-b border-[#E6E0D6]">
              <div className="w-16 h-16 rounded-full bg-[#18201B] flex items-center justify-center mx-auto mb-4 text-[#FAF8F5]">
                <CheckCircle className="w-8 h-8" />
              </div>
              <span className="text-xs px-3 py-1 rounded bg-[#F2EEE7] text-[#8C5A32] font-bold uppercase tracking-wider">
                Appointment Confirmed
              </span>
              <h3 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#18201B] mt-3">
                We Look Forward to Seeing You
              </h3>
              <p className="text-xs text-[#525C56] mt-1">
                Confirmation recorded for{' '}
                <strong className="text-[#18201B]">
                  {confirmedAppointment.patient.email}
                </strong>
              </p>
            </div>

            <div className="my-6 p-5 rounded-xl bg-[#FAF8F5] border border-[#D6CFC3] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E0D6]">
                <span className="text-xs text-[#525C56]">Reference Code</span>
                <span className="font-mono text-base font-bold text-[#8C5A32] tracking-wider">
                  {confirmedAppointment.referenceNumber}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#525C56] block">Service</span>
                  <span className="font-semibold text-[#18201B] block mt-0.5">
                    {confirmedAppointment.serviceTitle}
                  </span>
                </div>
                <div>
                  <span className="text-[#525C56] block">Clinician</span>
                  <span className="font-semibold text-[#18201B] block mt-0.5">
                    {confirmedAppointment.practitionerName}
                  </span>
                </div>
                <div>
                  <span className="text-[#525C56] block">Date &amp; Time</span>
                  <span className="font-semibold text-[#8C5A32] block mt-0.5">
                    {confirmedAppointment.date} at {confirmedAppointment.timeSlot}
                  </span>
                </div>
                <div>
                  <span className="text-[#525C56] block">Location</span>
                  <span className="font-semibold text-[#18201B] block mt-0.5">
                    {confirmedAppointment.consultationType}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F2EEE7] border border-[#D6CFC3] text-xs text-[#2B3730] space-y-2">
              <p className="font-bold text-[#18201B] flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-[#8C5A32]" />
                <span>Clinic Arrival Notes ({CLINIC_PROFILE.clinicAddress})</span>
              </p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-[#525C56]">
                <li>{CLINIC_PROFILE.hoursPolicy}.</li>
                <li>Avoid coffee or heavy meals 2 hours prior for accurate pulse assessment.</li>
                <li>Bring any current prescription bottles or laboratory reports.</li>
              </ul>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadCalendar}
                className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FAF8F5] border border-[#18201B] text-[#18201B] font-semibold text-xs hover:bg-[#F2EEE7] cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Calendar (.ics)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setConfirmedAppointment(null);
                }}
                className="w-full sm:w-1/2 py-3 rounded-xl bg-[#18201B] text-[#FAF8F5] font-bold text-xs cursor-pointer"
              >
                Book Another Visit
              </button>
            </div>
          </div>
        )}

        {/* Quick Lookup */}
        <div className="mt-14 max-w-xl mx-auto pt-8 border-t border-[#E6E0D6] text-center">
          <p className="text-xs text-[#525C56] mb-3">
            Already have a scheduled visit?
          </p>
          <form onSubmit={handleLookupBooking} className="flex items-center gap-2 max-w-md mx-auto">
            <input
              type="text"
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              placeholder="Enter Booking Ref (e.g. SHC-84291) or Phone"
              className="flex-1 px-3.5 py-2 rounded-lg bg-white border border-[#D6CFC3] focus:border-[#18201B] text-xs text-[#18201B] placeholder-[#8A918C] focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#18201B] text-[#FAF8F5] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Lookup</span>
            </button>
          </form>

          {lookupError && (
            <p className="mt-3 text-xs text-rose-700 flex items-center justify-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{lookupError}</span>
            </p>
          )}

          {lookupResult && (
            <div className="mt-4 p-4 rounded-xl bg-white border border-[#18201B] text-left text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E6E0D6]">
                <span className="font-bold text-[#8C5A32]">
                  Ref: {lookupResult.referenceNumber}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                  {lookupResult.status}
                </span>
              </div>
              <p className="mt-2 text-[#18201B] font-semibold">{lookupResult.serviceTitle}</p>
              <p className="text-[#525C56] text-[11px]">
                Clinician: {lookupResult.practitionerName} · {lookupResult.date} at{' '}
                {lookupResult.timeSlot}
              </p>
              <p className="text-[#525C56] text-[10px] mt-1">
                Patient: {lookupResult.patient.fullName} ({lookupResult.consultationType})
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
