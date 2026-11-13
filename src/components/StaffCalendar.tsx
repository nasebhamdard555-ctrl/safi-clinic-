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

interface StaffCalendarProps {
  onSelectBooking?: (appointment: Appointment) => void;
}

export const StaffCalendar: React.FC<StaffCalendarProps> = () => {
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
    <div className="rounded-3xl bg-white border border-[#D6CFC3] p-6 sm:p-10 shadow-sm space-y-7 text-[#18201B]">
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E6E0D6] pb-6">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8C5A32]">
            Staff Reception Roster · {CLINIC_PROFILE.hoursPolicy}
          </span>
          <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#18201B]">
            Clinic Master Calendar &amp; Walk-In Log
          </h2>
          <p className="text-xs sm:text-sm text-[#525C56]">
            Daily outpatient schedule for Dr. Hafizullah Safi and Safi Clinical Care Team in Kabul.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddingWalkin(!isAddingWalkin)}
            className="px-4 py-2.5 rounded-xl bg-[#18201B] hover:bg-[#2C3931] text-[#FAF8F5] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Walk-in Visit</span>
          </button>
          <button
            onClick={loadAppointments}
            className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#D6CFC3] text-[#525C56] hover:text-[#18201B] transition-colors cursor-pointer"
            title="Refresh schedule"
            aria-label="Refresh schedule"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date Navigation & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#D6CFC3]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => shiftDate(-1)}
            className="p-2 rounded-lg bg-white border border-[#D6CFC3] hover:border-[#18201B] text-[#18201B] cursor-pointer"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            aria-label="Select date"
            className="px-3 py-1.5 rounded-lg bg-white border border-[#D6CFC3] text-xs font-bold text-[#18201B] focus:outline-none focus:border-[#18201B]"
          />

          <button
            onClick={() => shiftDate(1)}
            className="p-2 rounded-lg bg-white border border-[#D6CFC3] hover:border-[#18201B] text-[#18201B] cursor-pointer"
            aria-label="Next day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSelectedDate(todayStr)}
            className="px-2.5 py-1.5 rounded-lg bg-[#F2EEE7] border border-[#D6CFC3] text-[11px] font-semibold text-[#18201B] cursor-pointer"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#525C56]" />
          <select
            value={selectedPractitionerId}
            onChange={(e) => setSelectedPractitionerId(e.target.value)}
            aria-label="Filter by practitioner"
            className="px-3 py-1.5 rounded-lg bg-white border border-[#D6CFC3] text-xs text-[#18201B] focus:outline-none focus:border-[#18201B]"
          >
            <option value="all">All Clinicians</option>
            {PRACTITIONERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Walk-in Drawer */}
      {isAddingWalkin && (
        <form
          onSubmit={handleAddWalkin}
          className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#18201B] space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-serif-classic font-bold text-sm text-[#18201B] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#8C5A32]" />
              Register Walk-In Patient
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingWalkin(false)}
              className="text-xs text-[#525C56] hover:text-[#18201B] cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-[#525C56] block mb-1">
                Patient Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ahmad Shah"
                value={walkinName}
                onChange={(e) => setWalkinName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#D6CFC3] text-xs text-[#18201B] focus:outline-none focus:border-[#18201B]"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-[#525C56] block mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+93 7XX XXX XXX"
                value={walkinPhone}
                onChange={(e) => setWalkinPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#D6CFC3] text-xs text-[#18201B] focus:outline-none focus:border-[#18201B]"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-[#525C56] block mb-1">
                Service
              </label>
              <select
                value={walkinService}
                onChange={(e) => setWalkinService(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#D6CFC3] text-xs text-[#18201B] focus:outline-none focus:border-[#18201B]"
              >
                {CONSULTATION_SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} (${s.price})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-[#525C56] block mb-1">
                Clinician
              </label>
              <select
                value={walkinPractitioner}
                onChange={(e) => setWalkinPractitioner(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#D6CFC3] text-xs text-[#18201B] focus:outline-none focus:border-[#18201B]"
              >
                {PRACTITIONERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#18201B] text-[#FAF8F5] font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Confirm Walk-In
            </button>
          </div>
        </form>
      )}

      {/* Appointment List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#525C56] px-1">
          <span>
            Schedule for <strong className="text-[#18201B]">{selectedDate}</strong> ({dailyAppointments.length} bookings)
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600" /> Confirmed
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-600" /> Pending
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-600" /> Completed
            </span>
          </div>
        </div>

        {dailyAppointments.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#FAF8F5] border border-[#D6CFC3] space-y-2">
            <CalendarIcon className="w-8 h-8 text-[#8C5A32] mx-auto" />
            <p className="text-sm font-semibold text-[#18201B]">
              No appointments scheduled for this date filter
            </p>
            <p className="text-xs text-[#525C56]">
              Use &ldquo;Add Walk-in Visit&rdquo; or pick another date above.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dailyAppointments.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#D6CFC3] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="px-3.5 py-2.5 rounded-xl bg-white border border-[#D6CFC3] text-center shrink-0">
                    <Clock className="w-4 h-4 text-[#8C5A32] mx-auto mb-1" />
                    <span className="text-xs font-bold text-[#18201B] block">{app.timeSlot}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-[#18201B]">
                        {app.patient?.fullName || 'Patient'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#F2EEE7] text-[#8C5A32] font-bold">
                        #{app.referenceNumber || app.id}
                      </span>
                      {app.consultationType === 'Online Telehealth Video' ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-sky-100 text-sky-800 flex items-center gap-1 font-medium">
                          <Video className="w-3 h-3" /> Telehealth
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3" /> In-Clinic
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#2B3730] font-medium">{app.serviceTitle}</p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#525C56]">
                      <span>
                        Clinician: <strong className="text-[#18201B]">{app.practitionerName}</strong>
                      </span>
                      {app.patient?.phone && (
                        <a
                          href={`tel:${app.patient.phone}`}
                          className="flex items-center gap-1 text-[#8C5A32] font-medium hover:underline"
                        >
                          <Phone className="w-3 h-3" /> {app.patient.phone}
                        </a>
                      )}
                    </div>

                    {app.patient?.healthConcerns && (
                      <p className="text-[11px] text-[#525C56] italic line-clamp-1 pt-0.5">
                        Concern: {app.patient.healthConcerns}
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
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#D6CFC3] text-xs font-semibold text-[#18201B] focus:outline-none focus:border-[#18201B]"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <button
                    onClick={() => handleUpdateStatus(app.id, 'Completed')}
                    className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors cursor-pointer"
                    title="Mark Completed"
                    aria-label={`Mark ${app.patient?.fullName || app.id} completed`}
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
