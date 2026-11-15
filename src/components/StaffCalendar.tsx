import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Video,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  RefreshCw,
  Phone,
} from 'lucide-react';
import {
  PRACTITIONERS,
  CONSULTATION_SERVICES,
  CLINIC_PROFILE,
} from '../data/clinicData';
import { Appointment } from '../types/clinic';
import { useLanguage } from '../context/LanguageContext';
import { pickLocalized } from '../utils/i18n';

interface StaffCalendarProps {
  onSelectBooking?: (appointment: Appointment) => void;
}

export const StaffCalendar: React.FC<StaffCalendarProps> = () => {
  const { language, t } = useLanguage();
  const tx = <T,>(en: T, ps: T, fa: T) => pickLocalized(language, { en, ps, fa });

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedPractitionerId, setSelectedPractitionerId] = useState<string>('all');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [walkinName, setWalkinName] = useState<string>('');
  const [walkinPhone, setWalkinPhone] = useState<string>('');
  const [walkinService, setWalkinService] = useState<string>(CONSULTATION_SERVICES[0].id);
  const [walkinTime] = useState<string>('11:00 AM');
  const [walkinPractitioner, setWalkinPractitioner] = useState<string>(PRACTITIONERS[0].id);
  const [isAddingWalkin, setIsAddingWalkin] = useState<boolean>(false);

  useEffect(() => {
    loadAppointments();
  }, [selectedDate]);

  const loadAppointments = () => {
    try {
      const stored = localStorage.getItem('safi_appointments');
      let list: Appointment[] = stored ? JSON.parse(stored) : [];

      // Sanitize any stale non-official practitioner names from previous browser sessions
      list = list.map((item) => {
        if (item.practitionerId === 'prac-hafizullah' || item.practitionerId === 'prac-clinical-team') {
          return item;
        }
        return {
          ...item,
          practitionerId: 'prac-hafizullah',
          practitionerName: 'Dr. Hafizullah Safi',
        };
      });

      const hasEntriesForDate = list.some((a) => a.date === selectedDate);
      if (!hasEntriesForDate) {
        const seeded: Appointment[] = [
          {
            id: 'SHC-8401',
            referenceNumber: 'SHC-8401',
            serviceId: 'srv-comprehensive',
            serviceTitle: 'Master Herbal & Unani Health Consultation',
            practitionerId: 'prac-hafizullah',
            practitionerName: 'Dr. Hafizullah Safi',
            date: selectedDate,
            timeSlot: '09:30 AM',
            consultationType: 'In-Clinic VIP Suite',
            status: 'Confirmed',
            totalFee: 140,
            patient: {
              fullName: 'Ahmad Fawad Wardak',
              email: 'fawad.wardak@example.af',
              phone: '+93 799 123 456',
              healthConcerns: 'Digestive bloating and acid reflux following meals.',
              isFirstTime: true,
            },
            createdAt: new Date().toISOString(),
          },
          {
            id: 'SHC-8402',
            referenceNumber: 'SHC-8402',
            serviceId: 'srv-pain-arthritis',
            serviceTitle: 'Musculoskeletal, Joint & Mobility Care',
            practitionerId: 'prac-hafizullah',
            practitionerName: 'Dr. Hafizullah Safi',
            date: selectedDate,
            timeSlot: '11:00 AM',
            consultationType: 'In-Clinic VIP Suite',
            status: 'Pending',
            totalFee: 130,
            patient: {
              fullName: 'Mohammad Tariq Stanikzai',
              email: 'tariq.s@example.af',
              phone: '+93 788 345 678',
              healthConcerns: 'Lower back stiffness and knee discomfort.',
              isFirstTime: false,
            },
            createdAt: new Date().toISOString(),
          },
          {
            id: 'SHC-8403',
            referenceNumber: 'SHC-8403',
            serviceId: 'srv-stress-sleep',
            serviceTitle: 'Stress, Sleep & Lifestyle Naturopathy',
            practitionerId: 'prac-clinical-team',
            practitionerName: 'Safi Clinical Care Team',
            date: selectedDate,
            timeSlot: '02:00 PM',
            consultationType: 'Online Telehealth Video',
            status: 'Confirmed',
            totalFee: 115,
            patient: {
              fullName: 'Fariba Noori',
              email: 'fariba.n@example.af',
              phone: '+93 777 987 654',
              healthConcerns: 'Interrupted sleep and persistent fatigue.',
              isFirstTime: true,
            },
            createdAt: new Date().toISOString(),
          },
        ];

        list = [...seeded, ...list];
        localStorage.setItem('safi_appointments', JSON.stringify(list));
      }

      setAppointments(list);
    } catch {
      // ignore storage errors
    }
  };

  const handleUpdateStatus = (appId: string, newStatus: 'Confirmed' | 'Pending' | 'Completed') => {
    const updated = appointments.map((a) => (a.id === appId ? { ...a, status: newStatus } : a));
    setAppointments(updated);
    localStorage.setItem('safi_appointments', JSON.stringify(updated));
  };

  const handleAddWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim()) return;

    const chosenService = CONSULTATION_SERVICES.find((s) => s.id === walkinService);
    const chosenPrac = PRACTITIONERS.find((p) => p.id === walkinPractitioner);

    const newApp: Appointment = {
      id: `SHC-${Math.floor(1000 + Math.random() * 9000)}`,
      referenceNumber: `SHC-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceId: walkinService,
      serviceTitle: chosenService?.title || 'Outpatient Clinical Consultation',
      practitionerId: walkinPractitioner,
      practitionerName: chosenPrac?.name || 'Dr. Hafizullah Safi',
      date: selectedDate,
      timeSlot: walkinTime,
      consultationType: 'In-Clinic VIP Suite',
      status: 'Confirmed',
      totalFee: chosenService?.price || 120,
      patient: {
        fullName: walkinName.trim(),
        email: 'walkin@safinaturalcare.af',
        phone: walkinPhone.trim() || CLINIC_PROFILE.formattedPhone,
        healthConcerns: 'Walk-in outpatient consultation.',
        isFirstTime: true,
      },
      createdAt: new Date().toISOString(),
    };

    const updated = [newApp, ...appointments];
    setAppointments(updated);
    localStorage.setItem('safi_appointments', JSON.stringify(updated));

    setWalkinName('');
    setWalkinPhone('');
    setIsAddingWalkin(false);
  };

  const shiftDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const dailyAppointments = appointments.filter((a) => {
    if (a.date !== selectedDate) return false;
    if (selectedPractitionerId !== 'all' && a.practitionerId !== selectedPractitionerId) {
      return false;
    }
    return true;
  });

  return (
    <div className="rounded-3xl bg-[#0B1D14] border border-[#1D3B2C] p-6 sm:p-10 shadow-xl space-y-7 text-[#F4F0E6]">
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1D3B2C] pb-6">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
            {t.brand.hoursPolicy}
          </span>
          <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6]">
            {t.booking.tabStaff}
          </h2>
          <p className="text-xs sm:text-sm text-[#A6B8AE]">
            {t.booking.pageSub}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddingWalkin(!isAddingWalkin)}
            className="min-h-[42px] px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{tx('Add Walk-in Visit', 'حاضر ناروغ اضافه کړئ', 'ثبت مراجعه حضوری')}</span>
          </button>
          <button
            onClick={loadAppointments}
            className="min-w-[42px] min-h-[42px] p-2.5 rounded-xl bg-[#06110C] border border-[#1D3B2C] text-[#A6B8AE] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors flex items-center justify-center cursor-pointer"
            title={tx('Refresh schedule', 'مهالویش تازه کړئ', 'تازه‌سازی برنامه')}
            aria-label={tx('Refresh schedule', 'مهالویش تازه کړئ', 'تازه‌سازی برنامه')}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date Navigation & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#06110C] border border-[#1D3B2C]">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => shiftDate(-1)}
            className="min-w-[38px] min-h-[38px] p-2 rounded-lg bg-[#0B1D14] border border-[#1D3B2C] hover:border-[#D4AF37] text-[#F4F0E6] flex items-center justify-center cursor-pointer"
            aria-label={tx('Previous day', 'تېره ورځ', 'روز قبل')}
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          </button>

          <input
            type="date"
            dir="ltr"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            aria-label={t.booking.selectDateLabel}
            className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#0B1D14] border border-[#1D3B2C] text-xs font-bold text-[#F4F0E6] focus:outline-none focus:border-[#D4AF37]"
          />

          <button
            onClick={() => shiftDate(1)}
            className="min-w-[38px] min-h-[38px] p-2 rounded-lg bg-[#0B1D14] border border-[#1D3B2C] hover:border-[#D4AF37] text-[#F4F0E6] flex items-center justify-center cursor-pointer"
            aria-label={tx('Next day', 'راتلونکې ورځ', 'روز بعد')}
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>

          <button
            onClick={() => setSelectedDate(todayStr)}
            className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#0B1D14] border border-[#1D3B2C] hover:border-[#D4AF37] text-[11px] font-semibold text-[#D4AF37] cursor-pointer"
          >
            {tx('Today', 'نن', 'امروز')}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
          <select
            value={selectedPractitionerId}
            onChange={(e) => setSelectedPractitionerId(e.target.value)}
            aria-label={t.booking.clinicianLabel}
            className="w-full sm:w-auto min-h-[38px] px-3 py-1.5 rounded-lg bg-[#0B1D14] border border-[#1D3B2C] text-xs text-[#F4F0E6] focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="all">{t.treatments.allCat}</option>
            {PRACTITIONERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id === 'prac-hafizullah' ? t.brand.founderName : tx('Safi Clinical Care Team', 'د صافي کلینیکي پاملرنې ټیم', 'تیم مراقبت کلینیکی صافی')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Walk-in Drawer */}
      {isAddingWalkin && (
        <form
          onSubmit={handleAddWalkin}
          className="p-6 rounded-2xl bg-[#06110C] border border-[#D4AF37]/60 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-serif-classic font-bold text-sm text-[#F4F0E6] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              {tx('Register Walk-In Patient', 'د حاضر ناروغ ثبتول', 'ثبت بیمار حضوری')}
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingWalkin(false)}
              className="text-xs text-[#A6B8AE] hover:text-[#F4F0E6] cursor-pointer"
            >
              {t.about.closeBtn}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-[#A6B8AE] block mb-1">
                {t.booking.legalName}
              </label>
              <input
                type="text"
                required
                placeholder="Ahmad Shah"
                value={walkinName}
                onChange={(e) => setWalkinName(e.target.value)}
                className="w-full min-h-[38px] px-3 py-2 rounded-lg bg-[#0B1D14] border border-[#1D3B2C] text-xs text-[#F4F0E6] placeholder:text-[#6E8478] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-[#A6B8AE] block mb-1">
                {t.booking.phoneWhatsapp}
              </label>
              <input
                type="text"
                dir="ltr"
                placeholder="+93 7XX XXX XXX"
                value={walkinPhone}
                onChange={(e) => setWalkinPhone(e.target.value)}
                className="w-full min-h-[38px] px-3 py-2 rounded-lg bg-[#0B1D14] border border-[#1D3B2C] text-xs text-[#F4F0E6] placeholder:text-[#6E8478] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-[#A6B8AE] block mb-1">
                {t.booking.serviceLabel}
              </label>
              <select
                value={walkinService}
                onChange={(e) => setWalkinService(e.target.value)}
                className="w-full min-h-[38px] px-3 py-2 rounded-lg bg-[#0B1D14] border border-[#1D3B2C] text-xs text-[#F4F0E6] focus:outline-none focus:border-[#D4AF37]"
              >
                {CONSULTATION_SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {t.servicesMap[s.id]?.title || s.title} (${s.price})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-[#A6B8AE] block mb-1">
                {t.booking.clinicianLabel}
              </label>
              <select
                value={walkinPractitioner}
                onChange={(e) => setWalkinPractitioner(e.target.value)}
                className="w-full min-h-[38px] px-3 py-2 rounded-lg bg-[#0B1D14] border border-[#1D3B2C] text-xs text-[#F4F0E6] focus:outline-none focus:border-[#D4AF37]"
              >
                {PRACTITIONERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id === 'prac-hafizullah' ? t.brand.founderName : tx('Safi Clinical Care Team', 'د صافي کلینیکي پاملرنې ټیم', 'تیم مراقبت کلینیکی صافی')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="min-h-[40px] px-5 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              {t.booking.confirmReserveBtn}
            </button>
          </div>
        </form>
      )}

      {/* Appointment List */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#A6B8AE] px-1">
          <span>
            <strong className="text-[#F4F0E6]" dir="ltr">{selectedDate}</strong> ({dailyAppointments.length})
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> {tx('Confirmed', 'تایید شوی', 'تاییدشده')}
            </span>
            <span className="flex items-center gap-1.5 text-[#D4AF37]">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" /> {tx('Pending', 'په تمه', 'در انتظار')}
            </span>
            <span className="flex items-center gap-1.5 text-[#A6B8AE]">
              <span className="w-2 h-2 rounded-full bg-[#A6B8AE]" /> {tx('Completed', 'بشپړ شوی', 'تکمیل‌شده')}
            </span>
          </div>
        </div>

        {dailyAppointments.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#06110C] border border-[#1D3B2C] space-y-2">
            <CalendarIcon className="w-8 h-8 text-[#D4AF37] mx-auto" />
            <p className="text-sm font-semibold text-[#F4F0E6]">
              {tx('No appointments scheduled for this date filter', 'د دې نیټې لپاره کوم نوبت نشته', 'هیچ نوبتی برای این تاریخ ثبت نشده است')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dailyAppointments.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-2xl bg-[#06110C] border border-[#1D3B2C] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="px-3.5 py-2.5 rounded-xl bg-[#0B1D14] border border-[#1D3B2C] text-center shrink-0">
                    <Clock className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
                    <span className="text-xs font-bold text-[#F4F0E6] block tabular-nums" dir="ltr">{app.timeSlot}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-[#F4F0E6]">
                        {app.patient?.fullName || t.booking.patientLabel}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#0B1D14] border border-[#1D3B2C] text-[#D4AF37] font-bold" dir="ltr">
                        #{app.referenceNumber || app.id}
                      </span>
                      {app.consultationType === 'Online Telehealth Video' ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 text-sky-300 flex items-center gap-1 font-medium">
                          <Video className="w-3 h-3" /> {t.booking.telehealthTitle}
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3" /> {t.booking.inClinicTitle}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#C2D1C8] font-medium">
                      {t.servicesMap[app.serviceId]?.title || app.serviceTitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#A6B8AE]">
                      <span>
                        {t.booking.clinicianLabel}: <strong className="text-[#F4F0E6]">
                          {app.practitionerId === 'prac-hafizullah' ? t.brand.founderName : tx('Safi Clinical Care Team', 'د صافي کلینیکي پاملرنې ټیم', 'تیم مراقبت کلینیکی صافی')}
                        </strong>
                      </span>
                      {app.patient?.phone && (
                        <a
                          href={`tel:${app.patient.phone}`}
                          dir="ltr"
                          className="flex items-center gap-1 text-[#D4AF37] font-medium hover:underline"
                        >
                          <Phone className="w-3 h-3" /> {app.patient.phone}
                        </a>
                      )}
                    </div>

                    {app.patient?.healthConcerns && (
                      <p className="text-[11px] text-[#A6B8AE] italic line-clamp-1 pt-0.5">
                        {app.patient.healthConcerns}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <select
                    value={app.status}
                    onChange={(e) =>
                      handleUpdateStatus(
                        app.id,
                        e.target.value as 'Confirmed' | 'Pending' | 'Completed'
                      )
                    }
                    aria-label={`Status for ${app.patient?.fullName || app.id}`}
                    className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#0B1D14] border border-[#1D3B2C] text-xs font-semibold text-[#F4F0E6] focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Confirmed">{tx('Confirmed', 'تایید شوی', 'تاییدشده')}</option>
                    <option value="Pending">{tx('Pending', 'په تمه', 'در انتظار')}</option>
                    <option value="Completed">{tx('Completed', 'بشپړ شوی', 'تکمیل‌شده')}</option>
                  </select>

                  <button
                    onClick={() => handleUpdateStatus(app.id, 'Completed')}
                    className="min-w-[38px] min-h-[38px] p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-colors flex items-center justify-center cursor-pointer"
                    title={tx('Mark Completed', 'بشپړ شو', 'تکمیل شد')}
                    aria-label={tx('Mark Completed', 'بشپړ شو', 'تکمیل شد')}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
