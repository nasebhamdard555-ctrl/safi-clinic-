import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Video,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  RefreshCw,
  Phone,
} from 'lucide-react';
import { PRACTITIONERS, CONSULTATION_SERVICES } from '../data/clinicData';
import { Appointment } from '../types/clinic';

interface StaffCalendarProps {
  onSelectBooking?: (appointment: Appointment) => void;
}

export const StaffCalendar: React.FC<StaffCalendarProps> = () => {
  // Current selected date in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedPractitionerId, setSelectedPractitionerId] = useState<string>('all');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddingWalkin, setIsAddingWalkin] = useState<boolean>(false);
  const [walkinName, setWalkinName] = useState<string>('');
  const [walkinPhone, setWalkinPhone] = useState<string>('');
  const [walkinService, setWalkinService] = useState<string>(CONSULTATION_SERVICES[0].id);
  const [walkinTime, setWalkinTime] = useState<string>('11:00 AM');
  const [walkinPractitioner, setWalkinPractitioner] = useState<string>(PRACTITIONERS[0].id);

  // Load appointments from localStorage and default seed for realistic staff view
  useEffect(() => {
    loadAppointments();
  }, [selectedDate]);

  const loadAppointments = () => {
    try {
      const stored = localStorage.getItem('safi_appointments');
      let list: Appointment[] = stored ? JSON.parse(stored) : [];

      // If empty or missing appointments for today, seed realistic sample schedule
      const hasEntriesForDate = list.some((a) => a.date === selectedDate);
      if (!hasEntriesForDate) {
        const seeded: Appointment[] = [
          {
            id: 'SHC-8401',
            referenceNumber: 'SHC-8401',
            serviceId: 'srv-comprehensive',
            serviceTitle: 'Master Herbal Health Consultation',
            practitionerId: 'prac-naseb',
            practitionerName: 'Dr. Naseb Hamdard',
            date: selectedDate,
            timeSlot: '09:30 AM',
            consultationType: 'In-Clinic VIP Suite',
            status: 'Confirmed',
            totalFee: 140,
            patient: {
              fullName: 'Ahmad Fawad Wardak',
              email: 'fawad.wardak@gmail.com',
              phone: '+93 799 123 456',
              healthConcerns: 'Chronic abdominal bloating and severe gastric acid burning after meals.',
              isFirstTime: true,
            },
            createdAt: new Date().toISOString(),
          },
          {
            id: 'SHC-8402',
            referenceNumber: 'SHC-8402',
            serviceId: 'srv-hijama',
            serviceTitle: 'Hijama (Wet Cupping) & Deep Lymphatic Detox Therapy',
            practitionerId: 'prac-safi',
            practitionerName: 'Dr. Hakim Safiullah Safi',
            date: selectedDate,
            timeSlot: '11:00 AM',
            consultationType: 'In-Clinic VIP Suite',
            status: 'Pending',
            totalFee: 150,
            patient: {
              fullName: 'Mohammad Tariq Stanikzai',
              email: 'tariq.s@outlook.com',
              phone: '+93 788 345 678',
              healthConcerns: 'Chronic cervical migraine and heavy shoulder stagnation.',
              isFirstTime: false,
            },
            createdAt: new Date().toISOString(),
          },
          {
            id: 'SHC-8403',
            referenceNumber: 'SHC-8403',
            serviceId: 'srv-stress-sleep',
            serviceTitle: 'Botanical Neuro-Reset: Stress & Insomnia Protocol',
            practitionerId: 'prac-amina',
            practitionerName: 'Dr. Amina Vance, ND',
            date: selectedDate,
            timeSlot: '02:00 PM',
            consultationType: 'Online Telehealth Video',
            status: 'Confirmed',
            totalFee: 115,
            patient: {
              fullName: 'Fariba Noori',
              email: 'fariba.n@yahoo.com',
              phone: '+93 777 987 654',
              healthConcerns: 'Chronic insomnia, waking at 3am with tachycardia, high daytime cortisol.',
              isFirstTime: true,
            },
            createdAt: new Date().toISOString(),
          },
          {
            id: 'SHC-8404',
            referenceNumber: 'SHC-8404',
            serviceId: 'srv-pain-arthritis',
            serviceTitle: 'Chronic Pain, Joints & Arthritis Therapy',
            practitionerId: 'prac-naseb',
            practitionerName: 'Dr. Naseb Hamdard',
            date: selectedDate,
            timeSlot: '03:30 PM',
            consultationType: 'In-Clinic VIP Suite',
            status: 'Confirmed',
            totalFee: 130,
            patient: {
              fullName: 'Haji Abdul Qadir',
              email: 'qadir.kbl@gmail.com',
              phone: '+93 700 456 789',
              healthConcerns: 'Bilateral knee pain, morning stiffness lasting 90 minutes.',
              isFirstTime: false,
            },
            createdAt: new Date().toISOString(),
          },
        ];

        list = [...seeded, ...list];
        localStorage.setItem('safi_appointments', JSON.stringify(list));
      }

      setAppointments(list);
    } catch {
      // fallback
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
      serviceTitle: chosenService?.title || 'Clinical Consultation',
      practitionerId: walkinPractitioner,
      practitionerName: chosenPrac?.name || 'Dr. Naseb Hamdard',
      date: selectedDate,
      timeSlot: walkinTime,
      consultationType: 'In-Clinic VIP Suite',
      status: 'Confirmed',
      totalFee: chosenService?.price || 120,
      patient: {
        fullName: walkinName.trim(),
        email: 'walkin@saficlinic.af',
        phone: walkinPhone.trim() || '+93 780 299 299',
        healthConcerns: 'Walk-in urgent constitutional evaluation.',
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

  // Change date by offset
  const shiftDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // Filtered appointments for selected day
  const dailyAppointments = appointments.filter((a) => {
    if (a.date !== selectedDate) return false;
    if (selectedPractitionerId !== 'all' && a.practitionerId !== selectedPractitionerId) {
      return false;
    }
    if (filterStatus !== 'all' && a.status !== filterStatus) {
      return false;
    }
    return true;
  });

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#071912] via-[#05140e] to-[#030d09] border border-[#f0c365]/40 p-6 sm:p-10 shadow-2xl space-y-8">
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#1b3b2f] pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-[#f0c365]/40 text-[#f0c365] text-xs font-semibold uppercase tracking-widest">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Staff Operational Dashboard</span>
          </div>
          <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec]">
            Clinic Master Calendar & Patient Schedule
          </h2>
          <p className="text-xs sm:text-sm text-[#8da396]">
            Real-time daily roster for Dr. Naseb Hamdard, Dr. Hakim Safiullah Safi, and clinical staff in Kabul.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddingWalkin(!isAddingWalkin)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#f0c365] to-[#c7993d] text-black font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Walk-in Visit</span>
          </button>
          <button
            onClick={loadAppointments}
            className="p-2 rounded-xl bg-[#091b12] border border-[#234b3c] text-[#8da396] hover:text-[#f0c365] hover:border-[#f0c365] transition-colors"
            title="Refresh schedule"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date Navigation & Practitioner Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#05110a] border border-[#1b3b2f]">
        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => shiftDate(-1)}
            className="p-2 rounded-lg bg-[#0a1e15] border border-[#234b3c] hover:border-[#f0c365] text-[#f5f3ec] hover:text-[#f0c365] transition-colors"
            title="Previous day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#0a1e15] border border-[#234b3c] text-xs font-bold text-[#f0c365] focus:outline-none focus:border-[#f0c365]"
          />

          <button
            onClick={() => shiftDate(1)}
            className="p-2 rounded-lg bg-[#0a1e15] border border-[#234b3c] hover:border-[#f0c365] text-[#f5f3ec] hover:text-[#f0c365] transition-colors"
            title="Next day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSelectedDate(todayStr)}
            className="px-2.5 py-1.5 rounded-lg bg-[#0e2419] border border-[#234b3c] text-[11px] font-semibold text-[#f5f3ec] hover:text-[#f0c365]"
          >
            Today
          </button>
        </div>

        {/* Practitioner Dropdown Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#8da396]" />
          <select
            value={selectedPractitionerId}
            onChange={(e) => setSelectedPractitionerId(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#0a1e15] border border-[#234b3c] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#f0c365]"
          >
            <option value="all">All Practitioners</option>
            {PRACTITIONERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.title.split('&')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Walk-in Modal/Drawer if open */}
      {isAddingWalkin && (
        <form
          onSubmit={handleAddWalkin}
          className="p-6 rounded-2xl bg-[#091f14] border border-[#f0c365]/60 space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-serif-classic font-bold text-sm text-[#f5f3ec] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#f0c365]" />
              Register Immediate In-Clinic Walk-In Patient
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingWalkin(false)}
              className="text-xs text-[#8da396] hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] text-[#8da396] block mb-1">Patient Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Ahmad Shah"
                value={walkinName}
                onChange={(e) => setWalkinName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#05110a] border border-[#234b3c] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#f0c365]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#8da396] block mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+93 7XX XXX XXX"
                value={walkinPhone}
                onChange={(e) => setWalkinPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#05110a] border border-[#234b3c] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#f0c365]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#8da396] block mb-1">Service</label>
              <select
                value={walkinService}
                onChange={(e) => setWalkinService(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#05110a] border border-[#234b3c] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#f0c365]"
              >
                {CONSULTATION_SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} (${s.price})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#8da396] block mb-1">Clinician</label>
              <select
                value={walkinPractitioner}
                onChange={(e) => setWalkinPractitioner(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#05110a] border border-[#234b3c] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#f0c365]"
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
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#f0c365] to-[#c7993d] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110"
            >
              Confirm Walk-In Booking
            </button>
          </div>
        </form>
      )}

      {/* Appointment Slots Matrix for Selected Day */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#8da396] px-1">
          <span>
            Schedule for <strong className="text-[#f0c365]">{selectedDate}</strong> (
            {dailyAppointments.length} bookings)
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Confirmed
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Pending
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400" /> Completed
            </span>
          </div>
        </div>

        {dailyAppointments.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#05110a] border border-[#1b3b2f] space-y-2">
            <CalendarIcon className="w-8 h-8 text-[#8da396] mx-auto" />
            <p className="text-sm font-semibold text-[#f5f3ec]">
              No appointments scheduled for this date & practitioner filter
            </p>
            <p className="text-xs text-[#8da396]">
              Use "Add Walk-in Visit" or choose another date on the calendar.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dailyAppointments.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-2xl bg-[#081810] border border-[#234b3c] hover:border-[#f0c365]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Time & Practitioner */}
                <div className="flex items-start gap-4">
                  <div className="px-3.5 py-2.5 rounded-xl bg-[#0a1e15] border border-[#f0c365]/40 text-center shrink-0">
                    <Clock className="w-4 h-4 text-[#f0c365] mx-auto mb-1" />
                    <span className="text-xs font-bold text-[#f5f3ec] block">{app.timeSlot}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#f5f3ec]">
                        {app.patient?.fullName || 'Patient'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#0e2419] text-[#f0c365] font-semibold">
                        #{app.referenceNumber || app.id}
                      </span>
                      {app.consultationType === 'Online Telehealth Video' ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 flex items-center gap-1">
                          <Video className="w-3 h-3" /> Telehealth Video
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> In-Clinic VIP
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#d8e2dc] font-medium">{app.serviceTitle}</p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#8da396]">
                      <span>Clinician: <strong className="text-[#f5f3ec]">{app.practitionerName}</strong></span>
                      {app.patient?.phone && (
                        <a href={`tel:${app.patient.phone}`} className="flex items-center gap-1 text-[#f0c365] hover:underline">
                          <Phone className="w-3 h-3" /> {app.patient.phone}
                        </a>
                      )}
                    </div>

                    {app.patient?.healthConcerns && (
                      <p className="text-[11px] text-[#8da396] italic line-clamp-1 pt-1">
                        Concern: {app.patient.healthConcerns}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Switcher & Staff Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <select
                    value={app.status}
                    onChange={(e) =>
                      handleUpdateStatus(
                        app.id,
                        e.target.value as 'Confirmed' | 'Pending' | 'Completed'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#05110a] border border-[#234b3c] text-xs font-semibold text-[#f5f3ec] focus:outline-none focus:border-[#f0c365]"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <button
                    onClick={() => handleUpdateStatus(app.id, 'Completed')}
                    className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                    title="Mark Completed"
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
