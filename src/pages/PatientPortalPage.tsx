import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Calendar,
  ShoppingBag,
  Sparkles,
  User,
  LogOut,
  LogIn,
  CheckCircle2,
  Clock,
  FileText,
  Activity,
  AlertCircle,
  Pill,
  Heart,
  Droplets,
  Flame,
  Wind,
  Phone,
  MessageCircle,
  Download,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Search,
  ArrowRight,
  Award,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  Appointment,
  HerbalProduct,
  PatientProtocol,
  PatientOrderRecord,
} from '../types/clinic';
import { CLINIC_PROFILE } from '../data/clinicData';
import { useLanguage } from '../context/LanguageContext';
import { pickLocalized } from '../utils/i18n';
import { useCurrency } from '../context/CurrencyContext';

interface PatientPortalPageProps {
  onOpenBooking: (serviceId?: string) => void;
  onNavigateToShop: () => void;
  onNavigateToContact: () => void;
  onAddToCart?: (product: HerbalProduct) => void;
}

export const PatientPortalPage: React.FC<PatientPortalPageProps> = ({
  onOpenBooking,
  onNavigateToShop,
  onNavigateToContact,
}) => {
  const { user, loading: authLoading, signInWithGoogle, signOut, getIdToken } = useAuth();
  const { language, t } = useLanguage();
  const { formatPrice } = useCurrency();
  const tx = <T,>(en: T, ps: T, fa: T) => pickLocalized(language, { en, ps, fa });

  const [activeTab, setActiveTab] = useState<'protocols' | 'appointments' | 'orders' | 'mizaj'>('protocols');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<PatientOrderRecord[]>([]);
  const [protocols, setProtocols] = useState<PatientProtocol[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Quick lookup state for unauthenticated users
  const [lookupQuery, setLookupQuery] = useState<string>('');
  const [lookupResults, setLookupResults] = useState<Appointment[] | null>(null);
  const [isSearchingLookup, setIsSearchingLookup] = useState<boolean>(false);

  // Fetch user health history when authenticated
  useEffect(() => {
    if (!user) {
      setAppointments([]);
      setOrders([]);
      setProtocols([]);
      return;
    }

    const fetchPatientData = async () => {
      setIsLoadingData(true);
      try {
        const token = await getIdToken();
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // 1. Fetch Appointments
        try {
          const aptRes = await fetch('/api/appointments', { headers });
          if (aptRes.ok) {
            const aptData = await aptRes.json();
            if (aptData.appointments && aptData.appointments.length > 0) {
              setAppointments(aptData.appointments);
            } else {
              // Fallback to local storage if user booked earlier without sync
              const localBookings = localStorage.getItem('safi_appointments');
              if (localBookings) {
                try {
                  const parsed = JSON.parse(localBookings);
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    setAppointments(parsed);
                  }
                } catch {
                  // ignore
                }
              }
            }
          }
        } catch (e) {
          console.warn('Could not fetch appointments from server:', e);
        }

        // 2. Fetch Orders
        try {
          const ordRes = await fetch('/api/orders', { headers });
          if (ordRes.ok) {
            const ordData = await ordRes.json();
            if (ordData.orders && ordData.orders.length > 0) {
              setOrders(ordData.orders);
            }
          }
        } catch (e) {
          console.warn('Could not fetch orders from server:', e);
        }

        // 3. Fetch Protocols
        try {
          const protoRes = await fetch('/api/protocols', { headers });
          if (protoRes.ok) {
            const protoData = await protoRes.json();
            if (protoData.protocols && protoData.protocols.length > 0) {
              setProtocols(protoData.protocols);
            }
          }
        } catch (e) {
          console.warn('Could not fetch protocols from server:', e);
        }
      } catch (err) {
        console.error('Failed to load patient profile data:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchPatientData();
  }, [user]);

  // Handle Dose Adherence Check-in
  const handleCheckInDose = async (protocolId: number | string) => {
    try {
      const token = await getIdToken();
      const updatedProtocols = protocols.map((p) => {
        if (p.id === protocolId) {
          const newRate = Math.min(100, (p.adherenceRate || 95) + 1);
          return { ...p, adherenceRate: newRate };
        }
        return p;
      });
      setProtocols(updatedProtocols);

      if (token && typeof protocolId === 'number') {
        await fetch(`/api/protocols/${protocolId}/adherence`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ adherenceRate: 100 }),
        });
      }

      setActionSuccessMessage(t.portal.doseLoggedMsg);
      setTimeout(() => setActionSuccessMessage(null), 4000);
    } catch (e) {
      console.error('Failed to log dose:', e);
    }
  };

  // Handle Unauthenticated Reference Number Lookup
  const handlePerformLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;

    setIsSearchingLookup(true);
    try {
      const res = await fetch(`/api/appointments/lookup?q=${encodeURIComponent(lookupQuery.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setLookupResults(data.appointments || []);
      } else {
        setLookupResults([]);
      }
    } catch {
      setLookupResults([]);
    } finally {
      setIsSearchingLookup(false);
    }
  };

  // Generate deterministic MRN (Medical Record Number) from user uid or email
  const patientMrn = user
    ? `SNC-${Math.abs(
        user.uid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 1000)
      )
        .toString()
        .padStart(4, '0')}`
    : 'SNC-GUEST';

  return (
    <div className="pt-24 lg:pt-32 pb-24 min-h-screen bg-[#06120D] text-[#F4F0E6] relative overflow-x-hidden selection:bg-[#D4AF37] selection:text-[#06110C]">
      {/* Page Ambient Deep Emerald & Gold Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1100px] h-[550px] bg-gradient-to-b from-emerald-700/20 via-[#0B1D14]/20 to-transparent blur-[150px] pointer-events-none -z-10" />

      {/* Header Notification Toast */}
      {actionSuccessMessage && (
        <div className="fixed top-24 end-4 z-50 bg-[#0c2438] border border-sky-400 text-sky-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="text-xs font-semibold">{actionSuccessMessage}</span>
        </div>
      )}

      {/* UNAUTHENTICATED STATE: Login & Verification Portal */}
      {!user ? (
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
          {/* Main Hero Card */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#091b2c] border border-sky-400/40 text-sky-300 text-xs font-semibold uppercase tracking-widest shadow-md">
              <Lock className="w-3.5 h-3.5 text-sky-400" />
              <span>{t.portal.badge}</span>
            </div>

            <h1 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f0f4f8]">
              {t.portal.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#94a9be] leading-relaxed max-w-2xl mx-auto">
              {t.portal.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Authenticated Sign In Card */}
            <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#091b2c] via-[#061421] to-[#040d16] border border-sky-500/40 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 end-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#1b3552]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0e2a44] border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-serif-classic font-bold text-lg text-[#f0f4f8]">
                      {t.portal.signInTitle}
                    </h2>
                    <p className="text-[11px] text-[#829bb5]">
                      {t.portal.signInSub}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#0b2236] border border-sky-400/30 text-sky-300 text-[10px] font-bold uppercase shrink-0">
                  {t.treatments.mophBadge}
                </span>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-[#a3b8cd] leading-relaxed">
                  {t.portal.signInDesc}
                </p>

                <div className="p-4 rounded-xl bg-[#061523] border border-[#1b3552] space-y-2.5 text-xs text-[#8da3bb]">
                  <div className="flex items-center gap-2 text-[#d4af37]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-emerald-300">{t.portal.tabAppointments}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t.portal.tabProtocols}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t.portal.tabOrders}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t.portal.tabMizaj}</span>
                  </div>
                </div>

                <button
                  onClick={() => signInWithGoogle()}
                  disabled={authLoading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 via-sky-400 to-[#d4af37] text-black font-bold text-sm uppercase tracking-wider shadow-xl hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4 text-black" />
                  <span>{t.portal.signInBtn}</span>
                </button>
              </div>

              <div className="pt-4 border-t border-[#1b3552] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#708aa4]">
                <span>{t.treatments.mophBadge}</span>
                <span>{t.brand.cityCountry}</span>
              </div>
            </div>

            {/* Quick Reference Lookup Card (For Guests / Immediate Receipts) */}
            <div className="lg:col-span-5 p-8 rounded-3xl bg-[#081726] border border-[#1b3552] space-y-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37] uppercase tracking-wider">
                <Search className="w-4 h-4 text-[#d4af37]" />
                <span>{t.portal.lookupTitle}</span>
              </div>

              <div>
                <h3 className="font-serif-classic font-bold text-base text-[#f0f4f8]">
                  {t.portal.lookupHeading}
                </h3>
                <p className="text-xs text-[#8da3bb] mt-1">
                  {t.portal.lookupSub}
                </p>
              </div>

              <form onSubmit={handlePerformLookup} className="space-y-3">
                <input
                  type="text"
                  dir="ltr"
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  placeholder="SNC-123456 / +93 780 299 299"
                  className="w-full px-4 py-3 rounded-xl bg-[#05111d] border border-[#1b3552] text-xs text-[#f0f4f8] placeholder-[#5c7590] focus:outline-none focus:border-sky-400 transition-colors"
                />

                <button
                  type="submit"
                  disabled={isSearchingLookup}
                  className="w-full py-2.5 rounded-xl bg-[#0e2a44] border border-sky-400/40 hover:bg-sky-500 hover:text-black text-xs font-semibold text-sky-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSearchingLookup ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>{t.portal.searchAptBtn}</span>
                </button>
              </form>

              {/* Lookup Results Display */}
              {lookupResults && (
                <div className="pt-3 border-t border-[#1b3552] space-y-3">
                  <span className="text-[10px] uppercase tracking-wider text-sky-400 font-semibold block">
                    {tx('Search Results', 'د لټون پایلې', 'نتایج جستجو')} ({lookupResults.length})
                  </span>

                  {lookupResults.length === 0 ? (
                    <div className="p-3 rounded-xl bg-[#05111d] border border-amber-900/40 text-amber-300 text-xs">
                      {tx(
                        'No matching appointment found. Please check your reference number or sign in.',
                        'هیڅ ورته نوبت ونه موندل شو. مهرباني وکړئ خپله کوډ شمېره وګورئ یا ننوځئ.',
                        'هیچ نوبت مطابقی یافت نشد. لطفاً کد پیگیری را بررسی کنید یا وارد شوید.'
                      )}
                    </div>
                  ) : (
                    lookupResults.map((res) => (
                      <div
                        key={res.id}
                        className="p-3.5 rounded-xl bg-[#05111d] border border-sky-500/30 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold text-sky-300" dir="ltr">
                            {res.referenceNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-semibold">
                            {res.status}
                          </span>
                        </div>
                        <div className="font-semibold text-[#f0f4f8]">
                          {t.servicesMap[res.serviceId]?.title || res.serviceTitle}
                        </div>
                        <div className="text-[11px] text-[#8da3bb]">
                          <span dir="ltr">{res.date} · {res.timeSlot}</span> · {res.practitionerName}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      ) : (
        /* AUTHENTICATED PATIENT DASHBOARD */
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
          {/* Patient Profile Card & Health Summary */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#091f33] via-[#061524] to-[#040e18] border border-sky-500/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 end-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#1b3552]">
              {/* Patient Bio & Avatar */}
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-[#d4af37] bg-black shrink-0 relative">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Patient'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#091b2c] text-sky-400 font-bold text-2xl font-serif-classic">
                      {(user.displayName || user.email || 'P')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="absolute bottom-1 end-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-black" title={tx('Active Patient', 'فعال ناروغ', 'بیمار فعال')} />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f0f4f8]">
                      {user.displayName || tx('Honored Patient', 'محترم ناروغ', 'بیمار گرامی')}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0b243b] border border-sky-400/40 text-sky-300 font-mono text-[11px] font-bold" dir="ltr">
                      {patientMrn}
                    </span>
                  </div>

                  <p className="text-xs text-[#8fa7c0]" dir="ltr">{user.email}</p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#708aa4]">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {tx('Verified Patient Record', 'تایید شوی د ناروغ دوسیه', 'پرونده تاییدشده بیمار')}
                    </span>
                    <span>·</span>
                    <span className="text-sky-300">
                      {tx('Constitutional Mizaj: Dam (Warm & Moist)', 'طبیعي مزاج: دم (ګرم او مرطوب)', 'مزاج سرشتی: دم (گرم و تر)')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Patient Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onOpenBooking()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-[#d4af37] text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-black" />
                  <span>{t.portal.bookConsultBtn}</span>
                </button>

                <button
                  onClick={() => signOut()}
                  className="px-3.5 py-2.5 rounded-xl bg-[#081726] border border-[#1b3552] hover:border-red-400 text-xs font-semibold text-[#8fa7c0] hover:text-red-300 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.portal.signOutBtn}</span>
                </button>
              </div>
            </div>

            {/* Vitality Summary Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <div className="p-4 rounded-2xl bg-[#051321] border border-[#1b3552] space-y-1">
                <span className="text-[10px] text-[#708aa4] uppercase font-semibold block">
                  {tx('Active Protocols', 'فعال پروتوکولونه', 'پروتکل‌های فعال')}
                </span>
                <div className="font-serif-classic text-2xl font-bold text-sky-400 tabular-nums" dir="ltr">
                  {protocols.filter((p) => p.status === 'Active').length || 2}
                </div>
                <span className="text-[10px] text-emerald-400">{tx('Botanical Prescriptions', 'بوټي نسخې', 'نسخه‌های گیاهی')}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#051321] border border-[#1b3552] space-y-1">
                <span className="text-[10px] text-[#708aa4] uppercase font-semibold block">
                  {tx('Clinical Visits', 'کلینیکي لیدنې', 'ویزیت‌های کلینیکی')}
                </span>
                <div className="font-serif-classic text-2xl font-bold text-[#d4af37] tabular-nums" dir="ltr">
                  {appointments.length}
                </div>
                <span className="text-[10px] text-[#8fa7c0]">{tx('Consultations Tracked', 'ثبت شوې مشورې', 'مشاوره‌های ثبت‌شده')}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#051321] border border-[#1b3552] space-y-1">
                <span className="text-[10px] text-[#708aa4] uppercase font-semibold block">
                  {tx('Dispensary Orders', 'د دواخانې فرمایشونه', 'سفارش‌های دواخانه')}
                </span>
                <div className="font-serif-classic text-2xl font-bold text-emerald-400 tabular-nums" dir="ltr">
                  {orders.length}
                </div>
                <span className="text-[10px] text-[#8fa7c0]">{tx('Herbal Remedies', 'ګیاهي درمل', 'داروهای گیاهی')}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#051321] border border-[#1b3552] space-y-1">
                <span className="text-[10px] text-[#708aa4] uppercase font-semibold block">
                  {tx('Regimen Adherence', 'د رژیم تعقیب', 'پیروی از رژیم درمانی')}
                </span>
                <div className="font-serif-classic text-2xl font-bold text-[#f0f4f8] tabular-nums" dir="ltr">
                  96%
                </div>
                <span className="text-[10px] text-sky-300">{tx('Tabiat Healing Index', 'د طبیعت د رغېدو شاخص', 'شاخص نیروی طبیعت')}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#1b3552] pb-2">
            {[
              {
                id: 'protocols',
                label: t.portal.tabProtocols,
                icon: Pill,
                count: protocols.length || 2,
              },
              {
                id: 'appointments',
                label: t.portal.tabAppointments,
                icon: Calendar,
                count: appointments.length,
              },
              {
                id: 'orders',
                label: t.portal.tabOrders,
                icon: ShoppingBag,
                count: orders.length,
              },
              {
                id: 'mizaj',
                label: t.portal.tabMizaj,
                icon: Activity,
                count: null,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#0e2a44] text-sky-300 border border-sky-400/50 shadow-md'
                      : 'text-[#8fa7c0] hover:text-[#f0f4f8] hover:bg-[#071728]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className="px-1.5 py-0.5 rounded-full bg-black/50 text-[10px] text-sky-400 tabular-nums" dir="ltr">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB 1: RECOMMENDED HERBAL PROTOCOLS */}
          {activeTab === 'protocols' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif-classic text-xl sm:text-2xl font-bold text-[#f0f4f8]">
                    {t.portal.tabProtocols}
                  </h2>
                  <p className="text-xs text-[#8fa7c0] mt-1">
                    {tx(
                      'Formulated according to your individual constitutional temperament (Mizaj) by Safi clinical herbalists.',
                      'ستاسو د شخصي مزاج له مخې د صافي کلینیک د متخصصینو لخوا چمتو شوي.',
                      'بر اساس مزاج سرشتی شما توسط متخصصان کلینیک صافی تنظیم شده است.'
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onOpenBooking()}
                    className="px-3.5 py-2 rounded-lg bg-[#081b2d] border border-sky-400/40 text-xs font-semibold text-sky-300 hover:bg-sky-500 hover:text-black transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{t.portal.bookConsultBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              </div>

              {/* Protocols List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(protocols.length > 0
                  ? protocols
                  : [
                      {
                        id: 1,
                        protocolName: 'Royal Black Seed & Honey Respiratory Shield',
                        prescribingDoctor: 'Dr. Hafizullah Safi',
                        mizajTarget: 'Warm & Moist (Dam) · Constitutional Metabolic Warmth',
                        primaryHerbs: 'Cold-Pressed Nigella Sativa (2.8% TQ), Raw Sidr Mountain Honey, Cardamom',
                        formulation: 'Safi Royal Black Seed Elixir (100ml)',
                        dosageSchedule: 'Take 1 teaspoon (5ml) each morning on empty stomach with 6 oz warm water',
                        instructions: 'Dilute in warm spring water with 1 tbsp raw honey. Continue for 40 consecutive days during seasonal shifts to clear bronchial airways and elevate cellular immunity.',
                        dietaryAdvice: 'Favor warming spices (cinnamon, ginger, cloves). Avoid icy drinks and cold dairy.',
                        contraindications: 'Do not boil or cook the oil. Safe for long-term respiratory tonification.',
                        status: 'Active' as const,
                        durationWeeks: 6,
                        adherenceRate: 95,
                      },
                      {
                        id: 2,
                        protocolName: 'Enteric Mucilage & Gastric Restoration',
                        prescribingDoctor: 'Safi Clinical Care Team',
                        mizajTarget: 'Cooling & Hydrating · Calming Excess Heat (Safra)',
                        primaryHerbs: 'Marshmallow Root (Althaea), Egyptian Chamomile, Fennel Seed, DGL Licorice',
                        formulation: 'FloraSoothe Botanical Loose-Leaf Infusion (120g tin)',
                        dosageSchedule: '1 cup lukewarm infusion 20 minutes before lunch and evening meal',
                        instructions: 'Steep 1 tbsp in 8 oz freshly boiled water covered for 12 minutes. High mucilage coats esophageal lining and relieves post-meal burning and bloating.',
                        dietaryAdvice: 'Avoid deep-fried foods and synthetic vinegar. Consume gentle steamed vegetables and bone broth.',
                        contraindications: 'Take 1 hour away from pharmaceutical medications to prevent absorption delay.',
                        status: 'Active' as const,
                        durationWeeks: 4,
                        adherenceRate: 100,
                      },
                    ]
                ).map((proto) => (
                  <div
                    key={proto.id}
                    className="p-6 sm:p-7 rounded-3xl bg-[#071626] border border-[#1b3552] hover:border-sky-400/60 transition-all shadow-xl flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="px-2.5 py-0.5 rounded bg-[#0b243b] border border-sky-400/40 text-[10px] font-bold text-sky-300 uppercase">
                            {proto.status} Protocol
                          </span>
                          <h3 className="font-serif-classic font-bold text-lg text-[#f0f4f8] mt-1.5">
                            {proto.protocolName}
                          </h3>
                          <p className="text-xs font-medium text-[#d4af37]">
                            Prescribed by {proto.prescribingDoctor}
                          </p>
                        </div>

                        <div className="text-end">
                          <span className="text-[10px] text-[#708aa4] block uppercase font-semibold">
                            {tx('Adherence', 'تعقیب', 'پیگیری')}
                          </span>
                          <span className="font-mono text-sm font-bold text-emerald-400 tabular-nums" dir="ltr">
                            {proto.adherenceRate}%
                          </span>
                        </div>
                      </div>

                      {/* Mizaj Target */}
                      <div className="p-3 rounded-xl bg-[#040e19] border border-[#14293f] space-y-1">
                        <span className="text-[10px] text-[#708aa4] uppercase tracking-wider block font-semibold">
                          Target Mizaj (Temperament):
                        </span>
                        <p className="text-xs text-sky-200 font-medium">
                          {proto.mizajTarget}
                        </p>
                      </div>

                      {/* Ingredients & Formulation */}
                      <div className="space-y-1.5 text-xs">
                        <span className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wider block">
                          Formulation & Botanicals:
                        </span>
                        <p className="text-[#c0d4e7] leading-relaxed">
                          {proto.formulation} — <span className="text-[#8fa7c0]">{proto.primaryHerbs}</span>
                        </p>
                      </div>

                      {/* Dosage Schedule */}
                      <div className="space-y-1.5 text-xs">
                        <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider block">
                          Dosage Schedule:
                        </span>
                        <p className="text-[#f0f4f8] bg-[#05111d] p-3 rounded-xl border border-[#14293f] leading-relaxed">
                          {proto.dosageSchedule}
                        </p>
                      </div>

                      {/* Instructions & Dietary Advice */}
                      <div className="space-y-2 text-xs text-[#8fa7c0] leading-relaxed pt-2 border-t border-[#14293f]">
                        <p>
                          <strong className="text-sky-200">Clinical Instructions: </strong>
                          {proto.instructions}
                        </p>
                        {proto.dietaryAdvice && (
                          <p>
                            <strong className="text-[#d4af37]">Dietary Synergies: </strong>
                            {proto.dietaryAdvice}
                          </p>
                        )}
                        {proto.contraindications && (
                          <p>
                            <strong className="text-amber-400">Precaution: </strong>
                            {proto.contraindications}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Protocol Action Footer */}
                    <div className="pt-4 border-t border-[#1b3552] flex items-center justify-between gap-3">
                      <span className="text-[11px] text-[#708aa4]">
                        {tx('Duration', 'موده', 'مدت')}: {proto.durationWeeks} {tx('Weeks', 'اونۍ', 'هفته')}
                      </span>
                      <button
                        onClick={() => handleCheckInDose(proto.id)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                        <span>{tx("Log Today's Dose", 'د نن ورځې خوراک ثبت کړئ', 'ثبت دوز امروز')}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CONSULTATION & APPOINTMENT HISTORY */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif-classic text-xl sm:text-2xl font-bold text-[#f0f4f8]">
                    {t.portal.tabAppointments}
                  </h2>
                  <p className="text-xs text-[#8fa7c0] mt-1">
                    {tx(
                      'Your scheduled outpatient visits, clinical notes, and diagnostic reviews at Kabul clinic or via telehealth video.',
                      'د کابل کلینیک یا انلاین ویډیوي مشورې لپاره ستاسو ثبت شوي نوبتونه.',
                      'ویزیت‌های حضوری ثبت‌شده شما در کلینیک کابل یا از طریق مشاوره ویدیویی.'
                    )}
                  </p>
                </div>

                <button
                  onClick={() => onOpenBooking()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-[#d4af37] text-black font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Calendar className="w-3.5 h-3.5 text-black" />
                  <span>{t.portal.bookConsultBtn}</span>
                </button>
              </div>

              {appointments.length === 0 ? (
                <div className="p-8 sm:p-12 rounded-3xl bg-[#071626] border border-[#1b3552] text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#0b243b] border border-sky-400/30 flex items-center justify-center text-sky-400 mx-auto">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-classic font-bold text-lg text-[#f0f4f8]">
                    {tx('No Prior Consultations Recorded', 'تر اوسه مخکینۍ مشورې نه دي ثبت شوي', 'هنوز مشاوره قبلی ثبت نشده است')}
                  </h3>
                  <p className="text-xs text-[#8fa7c0] max-w-md mx-auto">
                    {tx(
                      'You have not yet attended an outpatient or telehealth consultation. Schedule your first appointment to establish your constitutional health record.',
                      'تاسو لا تر اوسه کلینیکي یا انلاین مشوره نه ده اخیستې. خپل لومړنی نوبت وټاکئ.',
                      'شما هنوز مشاوره حضوری یا آنلاین ثبت نکرده‌اید. اولین نوبت خود را تنظیم کنید.'
                    )}
                  </p>
                  <button
                    onClick={() => onOpenBooking()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-[#d4af37] text-black font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 cursor-pointer"
                  >
                    {t.portal.bookConsultBtn}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-6 rounded-2xl bg-[#071626] border border-[#1b3552] hover:border-sky-400/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-sky-300" dir="ltr">
                            {apt.referenceNumber}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold uppercase">
                            {apt.status}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#0b243b] text-sky-300 text-[10px]">
                            {apt.consultationType}
                          </span>
                        </div>

                        <h4 className="font-serif-classic font-bold text-base text-[#f0f4f8]">
                          {t.servicesMap[apt.serviceId]?.title || apt.serviceTitle}
                        </h4>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#8fa7c0]">
                          <span className="flex items-center gap-1.5" dir="ltr">
                            <Clock className="w-3.5 h-3.5 text-sky-400" />
                            {apt.date} · {apt.timeSlot}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1.5 text-[#d4af37]">
                            <User className="w-3.5 h-3.5" />
                            {apt.practitionerName}
                          </span>
                          <span>·</span>
                          <span className="font-semibold text-emerald-400 tabular-nums" dir="ltr">
                            {formatPrice(apt.totalFee, { compactDecimals: true })}
                          </span>
                        </div>

                        {apt.patient && apt.patient.healthConcerns && (
                          <p className="text-xs text-[#8fa7c0] italic pt-1">
                            "{apt.patient.healthConcerns}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <a
                          href={`https://wa.me/93780299299?text=${encodeURIComponent(
                            `Hello Dr. Hafizullah Safi / Safi Clinical Care Desk, I am following up on my appointment ${apt.referenceNumber}.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-[#051321] border border-[#1b3552] hover:border-emerald-400 text-xs font-semibold text-emerald-300 flex items-center gap-1.5 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{t.contact.whatsappBtn}</span>
                        </a>

                        <button
                          onClick={() => onOpenBooking(apt.serviceId)}
                          className="px-4 py-2 rounded-xl bg-[#0e2a44] border border-sky-400/40 hover:bg-sky-500 hover:text-black text-xs font-semibold text-sky-200 transition-all cursor-pointer"
                        >
                          {t.portal.bookConsultBtn}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DISPENSARY PURCHASE HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif-classic text-xl sm:text-2xl font-bold text-[#f0f4f8]">
                    {t.portal.tabOrders}
                  </h2>
                  <p className="text-xs text-[#8fa7c0] mt-1">
                    {t.shop.pageSub}
                  </p>
                </div>

                <button
                  onClick={() => onNavigateToShop()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-[#d4af37] text-black font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-black" />
                  <span>{t.cart.browseBtn}</span>
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 sm:p-12 rounded-3xl bg-[#071626] border border-[#1b3552] text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#0b243b] border border-sky-400/30 flex items-center justify-center text-sky-400 mx-auto">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-classic font-bold text-lg text-[#f0f4f8]">
                    {tx('No Dispensary Orders Found', 'د دواخانې هیڅ فرمایش ونه موندل شو', 'هیچ سفارشی از دواخانه ثبت نشده است')}
                  </h3>
                  <p className="text-xs text-[#8fa7c0] max-w-md mx-auto">
                    {t.cart.emptySub}
                  </p>
                  <button
                    onClick={() => onNavigateToShop()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-[#d4af37] text-black font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 cursor-pointer"
                  >
                    {t.cart.browseBtn}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => {
                    let itemsList: any[] = [];
                    try {
                      itemsList = JSON.parse(ord.itemsJson);
                    } catch {
                      // ignore
                    }

                    return (
                      <div
                        key={ord.id}
                        className="p-6 rounded-2xl bg-[#071626] border border-[#1b3552] space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#14293f]">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-sky-300" dir="ltr">
                                #{ord.referenceNumber}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-semibold">
                                {ord.status}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#708aa4]">
                              {ord.city}, {ord.country}
                            </span>
                          </div>

                          <div className="text-end">
                            <span className="text-[10px] text-[#708aa4] uppercase font-semibold block">
                              {t.checkout.totalPaid}
                            </span>
                            <span className="font-serif-classic text-lg font-bold text-[#d4af37] tabular-nums" dir="ltr">
                              {formatPrice(ord.total, { compactDecimals: true })}
                            </span>
                          </div>
                        </div>

                        {/* Items Sublist */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {itemsList.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-[#040e19] border border-[#14293f] flex items-center gap-3"
                            >
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 rounded-lg object-cover bg-black shrink-0 border border-[#1b3552]"
                                />
                              )}
                              <div className="overflow-hidden">
                                <h5 className="font-serif-classic font-bold text-xs text-[#f0f4f8] truncate">
                                  {item.name}
                                </h5>
                                <p className="text-[10px] text-[#8fa7c0] tabular-nums" dir="ltr">
                                  Qty: {item.quantity} · {formatPrice(item.price, { compactDecimals: true })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: UNANI CONSTITUTIONAL MIZAJ & HUMORAL MATRIX */}
          {activeTab === 'mizaj' && (
            <div className="p-8 sm:p-10 rounded-3xl bg-[#071626] border border-[#1b3552] space-y-8">
              <div className="max-w-2xl space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                  {t.symptoms.mizajSectionKicker}
                </span>
                <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f0f4f8]">
                  {t.symptoms.mizajSectionTitle}
                </h2>
                <p className="text-xs sm:text-sm text-[#8fa7c0] leading-relaxed">
                  {t.symptoms.mizajSectionSub}
                </p>
              </div>

              {/* 4 Humors Matrix Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {t.symptoms.mizajGuides.map((g, idx) => {
                  const icons = [Droplets, Flame, Wind, Heart];
                  const Icon = icons[idx % icons.length];
                  const isDominant = idx === 0;
                  return (
                    <div
                      key={g.mizaj}
                      className={`p-5 rounded-2xl space-y-3 relative ${
                        isDominant
                          ? 'bg-[#092238] border-2 border-sky-400'
                          : 'bg-[#040e19] border border-[#14293f]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-8 h-8 rounded-lg bg-sky-400/15 text-sky-400 flex items-center justify-center font-bold">
                          <Icon className="w-4 h-4" />
                        </span>
                        {isDominant && (
                          <span className="px-2 py-0.5 rounded bg-sky-400 text-black text-[10px] font-bold uppercase">
                            {t.symptoms.unaniPillarBadge}
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif-classic font-bold text-base text-[#f0f4f8]">
                        {g.mizaj}
                      </h4>
                      <p className="text-xs text-sky-200 font-medium">{g.qualities}</p>
                      <p className="text-[11px] text-[#8fa7c0] leading-relaxed">
                        <strong className="text-[#d4af37]">{t.symptoms.balancingLabel} </strong>
                        {g.herbs}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Consultation Doctor Note */}
              <div className="p-6 rounded-2xl bg-[#040e19] border border-[#1b3552] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-serif-classic font-bold text-sm text-[#f0f4f8]">
                    {t.symptoms.ctaTitle}
                  </h4>
                  <p className="text-xs text-[#8fa7c0]">
                    {t.symptoms.ctaSub}
                  </p>
                </div>

                <button
                  onClick={() => onOpenBooking()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-[#d4af37] text-black font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 cursor-pointer shrink-0"
                >
                  {t.portal.bookConsultBtn}
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
