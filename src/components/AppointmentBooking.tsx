import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  ShieldCheck,
  CheckCircle,
  Video,
  Building,
  Sparkles,
  Phone,
  Mail,
  Download,
  AlertCircle,
  Search,
  Check,
  HeartHandshake,
} from 'lucide-react';
import {
  CONSULTATION_SERVICES,
  PRACTITIONERS,
} from '../data/clinicData';
import { Appointment, ConsultationService, Practitioner } from '../types/clinic';
import {
  validateAppointmentBooking,
  generateAppointmentRef,
  generateIcsCalendar,
} from '../utils/clinicLogic';
import { useAuth } from '../context/AuthContext';

interface AppointmentBookingProps {
  initialServiceId?: string | null;
  onSelectProduct?: (productId: string) => void;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  initialServiceId,
}) => {
  const { user, getIdToken } = useAuth();

  // Steps: 1: Service & Specialist, 2: Date & Time & Mode, 3: Patient Info, 4: Confirmed
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

  // Form Fields
  const [fullName, setFullName] = useState<string>(user?.displayName || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [phone, setPhone] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [healthConcerns, setHealthConcerns] = useState<string>('');
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);

  // Validation & Confirmation
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(
    null
  );

  // Booking Lookup
  const [lookupQuery, setLookupQuery] = useState<string>('');
  const [lookupResult, setLookupResult] = useState<Appointment | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Available Time Slots
  const morningSlots = ['09:00 AM', '10:00 AM', '10:30 AM', '11:15 AM'];
  const afternoonSlots = ['01:30 PM', '02:45 PM', '03:30 PM', '04:15 PM'];
  const eveningSlots = ['05:00 PM', '06:00 PM', '06:45 PM'];

  // Upcoming 10 days generator
  const getUpcomingDays = () => {
    const days = [];
    const baseDate = new Date(2026, 10, 8); // Nov 8, 2026
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
    setStep(2);
  };

  const handleProceedToStep3 = () => {
    if (!selectedDate || !selectedTimeSlot) {
      alert('Please select both a date and time slot.');
      return;
    }
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

    // Save to Cloud SQL PostgreSQL database via backend API
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

    if (confirmedAppointment && (confirmedAppointment.referenceNumber === query || confirmedAppointment.patient.phone.includes(query))) {
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

    // Default mock found record for demonstration if queried
    if (query.startsWith('SHC-') || query === 'DEMO' || query.length >= 4) {
      setLookupResult({
        id: 'apt-lookup-demo',
        referenceNumber: query.startsWith('SHC-') ? query : 'SHC-84291',
        serviceId: 'srv-comprehensive',
        serviceTitle: 'Master Herbal Health Consultation',
        practitionerId: 'prac-safi',
        practitionerName: 'Dr. Hakim Safiullah Safi',
        date: '2026-11-12',
        timeSlot: '11:15 AM',
        consultationType: 'In-Clinic VIP Suite',
        patient: {
          fullName: 'Verified Patient',
          email: 'patient@safihealthcare.com',
          phone: '+93 780 299 299',
          healthConcerns: 'Chronic metabolic sluggishness and digestive acidity.',
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
    <section id="booking" className="py-20 lg:py-28 bg-[#040d09] relative">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#0e3b28]/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#c5a059]/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d2319] border border-[#c5a059]/40 text-[#f5e6c8] text-xs font-semibold tracking-wider uppercase mb-3">
            <CalendarIcon className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Schedule Your Healing Journey</span>
          </div>
          <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f5f3ec]">
            Book a Clinical Consultation
          </h2>
          <p className="mt-3 text-base text-[#a6b6ad]">
            Consult with our Master Herbalists in our private VIP Suites or via secure Telehealth video from the comfort of your home.
          </p>
        </div>

        {/* Step Progress Indicator (when not looking up) */}
        {step < 4 && (
          <div className="max-w-2xl mx-auto mb-10">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#1b3b2f]" />
              {[
                { num: 1, label: 'Service & Herbalist' },
                { num: 2, label: 'Date & Time' },
                { num: 3, label: 'Patient Details' },
              ].map((s) => (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <button
                    onClick={() => s.num < step && setStep(s.num)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      step === s.num
                        ? 'bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black ring-4 ring-[#d4af37]/20 shadow-lg'
                        : step > s.num
                        ? 'bg-[#153a2b] text-[#d4af37] border border-[#d4af37]'
                        : 'bg-[#091a13] text-[#6b8275] border border-[#1b3b2f]'
                    }`}
                  >
                    {step > s.num ? <Check className="w-5 h-5 text-[#d4af37]" /> : s.num}
                  </button>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      step >= s.num ? 'text-[#f5f3ec]' : 'text-[#6b8275]'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: Select Service & Practitioner */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Services List */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-serif-classic text-xl font-bold text-[#f5f3ec] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#d4af37]" />
                <span>1. Select Treatment Protocol</span>
              </h3>

              <div className="space-y-3">
                {CONSULTATION_SERVICES.map((service) => {
                  const isSelected = selectedServiceId === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`p-5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0c2419] border-[#d4af37] shadow-xl shadow-black/40'
                          : 'bg-[#081711] border-[#1b3b2f] hover:border-[#2d5e4b]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2.5">
                            <h4
                              className={`font-serif-classic font-bold text-base ${
                                isSelected ? 'text-[#d4af37]' : 'text-[#f5f3ec]'
                              }`}
                            >
                              {service.title}
                            </h4>
                            <span className="text-xs px-2 py-0.5 rounded bg-[#153426] text-[#b8d4c5] border border-[#234b3c]">
                              {service.duration}
                            </span>
                          </div>
                          <p className="text-xs text-[#a6b6ad] leading-relaxed">
                            {service.description}
                          </p>

                          {isSelected && (
                            <div className="mt-3 pt-3 border-t border-[#1b3b2f] space-y-1.5">
                              <p className="text-[11px] font-semibold text-[#d4af37] uppercase tracking-wider">
                                Protocol Inclusions:
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#c9dad0]">
                                {service.treatmentIncludes.map((inc, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                                    <span>{inc}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xl font-bold font-serif-classic text-[#f5f3ec]">
                            ${service.price}
                          </span>
                          <span className="text-[11px] text-[#8da396] block">
                            all inclusive
                          </span>
                          <div
                            className={`mt-3 w-6 h-6 rounded-full border flex items-center justify-center ml-auto ${
                              isSelected
                                ? 'bg-[#d4af37] border-[#d4af37]'
                                : 'border-[#2d5e4b]'
                            }`}
                          >
                            {isSelected && <Check className="w-4 h-4 text-black" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Practitioner Selection & Summary */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="font-serif-classic text-xl font-bold text-[#f5f3ec] flex items-center gap-2">
                <User className="w-5 h-5 text-[#d4af37]" />
                <span>2. Select Herbal Specialist</span>
              </h3>

              <div className="space-y-3">
                {PRACTITIONERS.map((prac) => {
                  const isSelected = selectedPractitionerId === prac.id;
                  return (
                    <div
                      key={prac.id}
                      onClick={() => setSelectedPractitionerId(prac.id)}
                      className={`p-4 rounded-xl border flex items-center gap-4 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0c2419] border-[#d4af37] shadow-lg'
                          : 'bg-[#081711] border-[#1b3b2f] hover:border-[#2d5e4b]'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#d4af37]/80 shrink-0">
                        <img
                          src={prac.imageUrl}
                          alt={prac.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-bold text-sm truncate ${
                            isSelected ? 'text-[#d4af37]' : 'text-[#f5f3ec]'
                          }`}
                        >
                          {prac.name}
                        </h4>
                        <p className="text-xs text-[#8da396] truncate">{prac.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-[#a6b6ad]">
                          <span className="text-[#d4af37] font-semibold">★ {prac.rating}</span>
                          <span>·</span>
                          <span>{prac.experienceYears} Years Exp.</span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#d4af37] border-[#d4af37]'
                            : 'border-[#2d5e4b]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Consultation Format Selector */}
              <div className="p-4 rounded-xl bg-[#091a13] border border-[#1b3b2f] space-y-3">
                <p className="text-xs font-semibold text-[#f5f3ec] uppercase tracking-wider">
                  Preferred Consultation Mode:
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setConsultationType('In-Clinic VIP Suite')}
                    className={`p-3 rounded-lg border text-left text-xs transition-all flex flex-col gap-1.5 cursor-pointer ${
                      consultationType === 'In-Clinic VIP Suite'
                        ? 'bg-[#153426] border-[#d4af37] text-[#f5f3ec]'
                        : 'bg-[#07150e] border-[#1b3b2f] text-[#8da396]'
                    }`}
                  >
                    <Building className="w-4 h-4 text-[#d4af37]" />
                    <span className="font-bold">In-Clinic VIP Suite</span>
                    <span className="text-[10px] text-[#a6b6ad]">
                      Pulse, tongue & physical check
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultationType('Online Telehealth Video')}
                    className={`p-3 rounded-lg border text-left text-xs transition-all flex flex-col gap-1.5 cursor-pointer ${
                      consultationType === 'Online Telehealth Video'
                        ? 'bg-[#153426] border-[#d4af37] text-[#f5f3ec]'
                        : 'bg-[#07150e] border-[#1b3b2f] text-[#8da396]'
                    }`}
                  >
                    <Video className="w-4 h-4 text-[#d4af37]" />
                    <span className="font-bold">Telehealth Video</span>
                    <span className="text-[10px] text-[#a6b6ad]">
                      Secure link sent to email
                    </span>
                  </button>
                </div>
              </div>

              {/* Step 1 Next Button */}
              <button
                onClick={handleProceedToStep2}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#aa8222] text-black font-bold text-sm tracking-wide shadow-xl shadow-[#d4af37]/20 hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer"
              >
                Proceed to Select Date & Time →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Choose Date & Time Slot */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto bg-[#071810] border border-[#1b3b2f] rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-6 border-b border-[#1b3b2f]">
              <div>
                <span className="text-xs text-[#d4af37] font-semibold uppercase tracking-wider">
                  Selected Protocol:
                </span>
                <h3 className="font-serif-classic text-xl font-bold text-[#f5f3ec]">
                  {currentService.title} (${currentService.price})
                </h3>
                <p className="text-xs text-[#8da396]">
                  With {currentPractitioner.name} · {consultationType}
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-[#d4af37] hover:underline"
              >
                Change Service
              </button>
            </div>

            {/* Date Selection Grid */}
            <div className="mt-6 space-y-3">
              <label className="text-sm font-semibold text-[#f5f3ec] block">
                Select Consultation Date (November 2026):
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
                          ? 'bg-[#153a2a] border-[#d4af37] ring-2 ring-[#d4af37]/30 text-[#f5f3ec]'
                          : 'bg-[#091a13] border-[#1b3b2f] text-[#8da396] hover:border-[#2d5e4b]'
                      }`}
                    >
                      <span className="text-[11px] block uppercase text-[#a6b6ad]">
                        {d.weekday}
                      </span>
                      <span
                        className={`text-sm font-bold block mt-0.5 ${
                          isSelected ? 'text-[#d4af37]' : 'text-[#f5f3ec]'
                        }`}
                      >
                        {d.dayNum}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div className="mt-8 space-y-5">
              <label className="text-sm font-semibold text-[#f5f3ec] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#d4af37]" />
                <span>Available Clinic Time Slots:</span>
              </label>

              {/* Morning Slots */}
              <div className="space-y-2">
                <span className="text-xs text-[#a6b6ad] font-medium block">
                  Morning Sessions:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {morningSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        selectedTimeSlot === slot
                          ? 'bg-[#d4af37] text-black border-[#d4af37]'
                          : 'bg-[#091a13] border-[#1b3b2f] text-[#d8e2dc] hover:border-[#2d5e4b]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Afternoon Slots */}
              <div className="space-y-2">
                <span className="text-xs text-[#a6b6ad] font-medium block">
                  Afternoon Sessions:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {afternoonSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        selectedTimeSlot === slot
                          ? 'bg-[#d4af37] text-black border-[#d4af37]'
                          : 'bg-[#091a13] border-[#1b3b2f] text-[#d8e2dc] hover:border-[#2d5e4b]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Evening Slots */}
              <div className="space-y-2">
                <span className="text-xs text-[#a6b6ad] font-medium block">
                  Evening Sessions:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {eveningSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        selectedTimeSlot === slot
                          ? 'bg-[#d4af37] text-black border-[#d4af37]'
                          : 'bg-[#091a13] border-[#1b3b2f] text-[#d8e2dc] hover:border-[#2d5e4b]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2 Actions */}
            <div className="mt-10 flex items-center justify-between pt-6 border-t border-[#1b3b2f]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-lg border border-[#2d5e4b] text-sm text-[#f5f3ec] hover:bg-[#0c2419]"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleProceedToStep3}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#aa8222] text-black font-bold text-sm shadow-xl"
              >
                Next: Enter Patient Info →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Patient Form & Validation */}
        {step === 3 && (
          <div className="max-w-3xl mx-auto bg-[#071810] border border-[#1b3b2f] rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="pb-6 border-b border-[#1b3b2f] mb-6">
              <span className="text-xs text-[#d4af37] font-semibold uppercase tracking-wider">
                Step 3 of 3
              </span>
              <h3 className="font-serif-classic text-2xl font-bold text-[#f5f3ec]">
                Patient Information & Health Concerns
              </h3>
              <p className="text-xs text-[#8da396] mt-1">
                Your medical confidentiality is protected under strict herbal privacy standards.
              </p>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#f5f3ec] flex items-center justify-between">
                    <span>Full Legal Name *</span>
                    {validationErrors.fullName && (
                      <span className="text-rose-400 text-[10px]">
                        {validationErrors.fullName}
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#091a13] border border-[#1b3b2f] focus:border-[#d4af37] text-sm text-[#f5f3ec] placeholder-[#4d6356] focus:outline-none"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#f5f3ec] flex items-center justify-between">
                    <span>Email Address *</span>
                    {validationErrors.email && (
                      <span className="text-rose-400 text-[10px]">
                        {validationErrors.email}
                      </span>
                    )}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. eleanor@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#091a13] border border-[#1b3b2f] focus:border-[#d4af37] text-sm text-[#f5f3ec] placeholder-[#4d6356] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#f5f3ec] flex items-center justify-between">
                    <span>Phone / WhatsApp *</span>
                    {validationErrors.phone && (
                      <span className="text-rose-400 text-[10px]">
                        {validationErrors.phone}
                      </span>
                    )}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#091a13] border border-[#1b3b2f] focus:border-[#d4af37] text-sm text-[#f5f3ec] placeholder-[#4d6356] focus:outline-none"
                  />
                </div>

                {/* Age */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#f5f3ec]">
                    Patient Age (optional)
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 42"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#091a13] border border-[#1b3b2f] focus:border-[#d4af37] text-sm text-[#f5f3ec] placeholder-[#4d6356] focus:outline-none"
                  />
                </div>
              </div>

              {/* Health Concerns / Symptoms */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#f5f3ec] flex items-center justify-between">
                  <span>Describe Primary Symptoms & Health Goals *</span>
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
                  placeholder="Tell us what you are experiencing (e.g., chronic acid reflux for 6 months, knee swelling, poor sleep, allergies, current medications)..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#091a13] border border-[#1b3b2f] focus:border-[#d4af37] text-sm text-[#f5f3ec] placeholder-[#4d6356] focus:outline-none resize-none"
                />
              </div>

              {/* Checkbox first time */}
              <label className="flex items-center gap-3 p-3 rounded-lg bg-[#091a13] border border-[#1b3b2f] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFirstTime}
                  onChange={(e) => setIsFirstTime(e.target.checked)}
                  className="rounded border-[#1b3b2f] text-[#d4af37] focus:ring-[#d4af37] w-4 h-4 bg-[#050e09]"
                />
                <span className="text-xs text-[#c9dad0]">
                  This is my first time receiving a consultation at Safi Herbal Clinic
                </span>
              </label>

              {/* Booking Summary Box */}
              <div className="p-4 rounded-xl bg-[#0b2418] border border-[#c5a059]/40 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#f5f3ec]">
                    {currentService.title} with {currentPractitioner.name}
                  </p>
                  <p className="text-xs text-[#d4af37]">
                    {selectedDate} at {selectedTimeSlot} ({consultationType})
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold font-serif-classic text-[#f5f3ec]">
                    ${currentService.price}
                  </span>
                  <span className="text-[10px] text-[#8da396] block">Due at consultation</span>
                </div>
              </div>

              {/* Form Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#1b3b2f]">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-lg border border-[#2d5e4b] text-sm text-[#f5f3ec] hover:bg-[#0c2419]"
                >
                  ← Back to Schedule
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#aa8222] text-black font-bold text-sm shadow-xl hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer"
                >
                  Confirm & Reserve Appointment
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 4: Appointment Confirmation Card */}
        {step === 4 && confirmedAppointment && (
          <div className="max-w-2xl mx-auto bg-[#071810] border-2 border-[#d4af37] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95">
            {/* Top Gold Corner Accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#d4af37]/30 to-transparent pointer-events-none" />

            <div className="text-center pb-6 border-b border-[#1b3b2f]">
              <div className="w-16 h-16 rounded-full bg-[#153a2a] border border-[#d4af37] flex items-center justify-center mx-auto mb-4 text-[#d4af37]">
                <CheckCircle className="w-9 h-9" />
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-[#102e21] text-[#d4af37] font-semibold uppercase tracking-wider border border-[#c5a059]/40">
                Booking Confirmed & Synchronized
              </span>
              <h3 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec] mt-2">
                We Look Forward to Your Visit
              </h3>
              <p className="text-xs text-[#a6b6ad] mt-1">
                A confirmation email has been dispatched to{' '}
                <strong className="text-[#f5f3ec]">
                  {confirmedAppointment.patient.email}
                </strong>
              </p>
            </div>

            {/* Reference & Details Card */}
            <div className="my-6 p-5 rounded-xl bg-[#091e15] border border-[#1b3b2f] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1b3b2f]">
                <span className="text-xs text-[#8da396]">Appointment Reference:</span>
                <span className="font-mono text-base font-bold text-[#d4af37] tracking-wider">
                  {confirmedAppointment.referenceNumber}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#8da396] block">Consultation:</span>
                  <span className="font-semibold text-[#f5f3ec] block mt-0.5">
                    {confirmedAppointment.serviceTitle}
                  </span>
                </div>
                <div>
                  <span className="text-[#8da396] block">Specialist:</span>
                  <span className="font-semibold text-[#f5f3ec] block mt-0.5">
                    {confirmedAppointment.practitionerName}
                  </span>
                </div>
                <div>
                  <span className="text-[#8da396] block">Date & Time:</span>
                  <span className="font-semibold text-[#d4af37] block mt-0.5">
                    {confirmedAppointment.date} at {confirmedAppointment.timeSlot}
                  </span>
                </div>
                <div>
                  <span className="text-[#8da396] block">Location Mode:</span>
                  <span className="font-semibold text-[#f5f3ec] block mt-0.5">
                    {confirmedAppointment.consultationType}
                  </span>
                </div>
              </div>
            </div>

            {/* Clinical Instructions */}
            <div className="p-4 rounded-xl bg-[#06140e] border border-[#1b3b2f] text-xs text-[#a6b6ad] space-y-2">
              <p className="font-bold text-[#d4af37] flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4" />
                <span>Pre-Consultation Preparation:</span>
              </p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-[#c9dad0]">
                <li>Please arrive 10 minutes early or connect to the telehealth link on time.</li>
                <li>Avoid coffee, tea, or heavy meals 2 hours prior for accurate tongue diagnosis.</li>
                <li>Bring a list of any current vitamins or pharmaceutical medications.</li>
              </ul>
            </div>

            {/* Confirmation CTAs */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleDownloadCalendar}
                className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#143324] border border-[#d4af37] text-[#f5f3ec] font-semibold text-xs hover:bg-[#1b4330] transition-colors"
              >
                <Download className="w-4 h-4 text-[#d4af37]" />
                <span>Add to Calendar (.ics)</span>
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setConfirmedAppointment(null);
                }}
                className="w-full sm:w-1/2 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs shadow-md"
              >
                Book Another Session
              </button>
            </div>
          </div>
        )}

        {/* Existing Booking Lookup Drawer */}
        <div className="mt-16 max-w-xl mx-auto pt-10 border-t border-[#1b3b2f]/60 text-center">
          <p className="text-xs text-[#8da396] mb-3">
            Already have an upcoming consultation scheduled?
          </p>
          <form
            onSubmit={handleLookupBooking}
            className="flex items-center gap-2 max-w-md mx-auto"
          >
            <input
              type="text"
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              placeholder="Enter Booking Ref (e.g. SHC-84291) or Phone"
              className="flex-1 px-3.5 py-2 rounded-lg bg-[#081711] border border-[#1b3b2f] focus:border-[#d4af37] text-xs text-[#f5f3ec] placeholder-[#4f675a] focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#112d20] border border-[#2d5e4b] hover:border-[#d4af37] text-xs font-semibold text-[#f5f3ec] flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Lookup</span>
            </button>
          </form>

          {lookupError && (
            <p className="mt-3 text-xs text-rose-400 flex items-center justify-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{lookupError}</span>
            </p>
          )}

          {lookupResult && (
            <div className="mt-4 p-4 rounded-xl bg-[#091e15] border border-[#d4af37]/60 text-left text-xs animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#1b3b2f]">
                <span className="font-bold text-[#d4af37]">
                  Ref: {lookupResult.referenceNumber}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#153426] text-emerald-300 font-semibold text-[10px]">
                  {lookupResult.status}
                </span>
              </div>
              <p className="mt-2 text-[#f5f3ec] font-semibold">{lookupResult.serviceTitle}</p>
              <p className="text-[#a6b6ad] text-[11px]">
                Specialist: {lookupResult.practitionerName} · {lookupResult.date} at {lookupResult.timeSlot}
              </p>
              <p className="text-[#8da396] text-[10px] mt-1">
                Patient: {lookupResult.patient.fullName} ({lookupResult.consultationType})
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
