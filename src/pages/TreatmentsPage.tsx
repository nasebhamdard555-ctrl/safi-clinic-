import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Activity,
  Heart,
  Layers,
  Leaf,
  ArrowRight,
  Flame,
  Phone,
} from 'lucide-react';
import { CLINIC_PROFILE, CONSULTATION_SERVICES } from '../data/clinicData';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

interface TreatmentsPageProps {
  onSelectServiceAndBook: (serviceId: string) => void;
  onOpenBooking: () => void;
}

export const TreatmentsPage: React.FC<TreatmentsPageProps> = ({
  onSelectServiceAndBook,
  onOpenBooking,
}) => {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedTreatmentId, setExpandedTreatmentId] = useState<string | null>(
    'srv-comprehensive'
  );
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const categories = ['All', 'General', 'Chronic Care', 'Specialized', 'Vitality'];

  const filteredServices =
    selectedCategory === 'All'
      ? CONSULTATION_SERVICES
      : CONSULTATION_SERVICES.filter((s) => s.category === selectedCategory);

  const pillarIcons = [
    <Activity key="nabz" className="w-5 h-5" />,
    <Flame key="mizaj" className="w-5 h-5" />,
    <Layers key="lisan" className="w-5 h-5" />,
    <ShieldCheck key="audit" className="w-5 h-5" />,
  ];

  return (
    <div className="pt-24 lg:pt-32 pb-20 min-h-screen bg-[#07150F] text-[#F4F0E6] selection:bg-[#D4AF37] selection:text-[#06110C]">
      {/* Editorial Header */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
            {t.brand.clinicName} · {t.brand.clinicAddress}
          </p>

          <h1 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F0E6] leading-tight">
            {t.treatments.headerTitle}
          </h1>

          <p className="text-sm sm:text-base text-[#C2D1C8] leading-relaxed">
            {t.treatments.headerSubtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#A6B8AE] font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              {t.treatments.mophBadge}
            </span>
            <span className="text-[#1D3B2C]">·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              {t.brand.hoursPolicy}
            </span>
          </div>
        </div>
      </section>

      {/* 3 Systems of Medicine (Monogram Strip) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.systems.map((sys) => (
            <div
              key={sys.code}
              className="p-6 sm:p-7 rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] hover:border-[#D4AF37]/50 transition-colors flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#1D3B2C] pb-3">
                  <span className="font-serif-classic text-2xl font-bold text-[#D4AF37]">
                    {sys.code}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C2D1C8]">
                    {sys.tagline}
                  </span>
                </div>
                <h2 className="font-serif-classic text-xl font-bold text-[#F4F0E6]">
                  {sys.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#A6B8AE] leading-relaxed">
                  {sys.description}
                </p>
              </div>
              <ul className="space-y-1.5 pt-3 border-t border-[#1D3B2C]">
                {sys.principles.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#C2D1C8]">
                    <span className="text-[#D4AF37] font-bold">·</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* All 8 Outpatient Clinical Services */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="p-6 sm:p-10 rounded-3xl bg-[#0B1D14] border border-[#1D3B2C]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-[#1D3B2C] pb-6">
            <div className="max-w-2xl">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                {t.treatments.scopeKicker}
              </span>
              <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6] mt-1">
                {t.treatments.scopeHeading}
              </h2>
              <p className="text-xs sm:text-sm text-[#A6B8AE] mt-2">
                {t.treatments.scopeSub}
              </p>
            </div>
            <span className="text-xs font-semibold text-[#D4AF37] shrink-0">
              {t.brand.clinicAddress}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.scopeOfServices.map((srv, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#06110C] border border-[#1D3B2C] hover:border-[#D4AF37]/40 transition-colors flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif-classic font-bold text-base text-[#D4AF37]">
                      {srv.code}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A6B8AE]">
                      {srv.category}
                    </span>
                  </div>
                  <h3 className="font-serif-classic font-bold text-sm text-[#F4F0E6] leading-snug">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-[#A6B8AE] leading-relaxed">
                    {srv.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The 4 Diagnostic Pillars */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="p-6 sm:p-10 rounded-3xl bg-[#0B1D14] border border-[#1D3B2C]">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              {t.treatments.pillarsKicker}
            </span>
            <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6] mt-1">
              {t.treatments.pillarsHeading}
            </h2>
            <p className="text-xs sm:text-sm text-[#A6B8AE] mt-2">
              {t.treatments.pillarsSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {t.treatments.pillars.map((pillar, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-[#06110C] border border-[#1D3B2C]">
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37] text-[#06110C] flex items-center justify-center mb-4">
                  {pillarIcons[idx] || pillarIcons[0]}
                </div>
                <h3 className="font-serif-classic font-bold text-base text-[#F4F0E6] mb-1">
                  {pillar.title}
                </h3>
                <p className="text-[11px] text-[#D4AF37] font-semibold uppercase tracking-wider mb-2">
                  {pillar.subtitle}
                </p>
                <p className="text-xs text-[#A6B8AE] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Protocols Directory */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              {t.treatments.directoryKicker}
            </span>
            <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6] mt-1">
              {t.treatments.directoryHeading}
            </h2>
            <p className="text-sm text-[#A6B8AE] mt-1">
              {t.treatments.directorySub}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#D4AF37] text-[#06110C] shadow-sm'
                    : 'bg-[#0B1D14] text-[#C2D1C8] hover:text-[#F4F0E6] border border-[#1D3B2C]'
                }`}
              >
                {t.treatments.catLabels[cat] || cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {filteredServices.map((service) => {
            const isExpanded = expandedTreatmentId === service.id;
            const locSrv = t.servicesMap[service.id];
            const srvTitle = locSrv?.title || service.title;
            const srvDuration = locSrv?.duration || service.duration;
            const srvCategory = locSrv?.category || service.category;
            const srvDesc = locSrv?.description || service.description;
            const srvIncludes = locSrv?.treatmentIncludes || service.treatmentIncludes;
            const srvSuitable = locSrv?.suitableFor || service.suitableFor;

            return (
              <div
                key={service.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-[#0B1D14] ${
                  isExpanded
                    ? 'border-[#D4AF37]/70 shadow-lg'
                    : 'border-[#1D3B2C] hover:border-[#2B533F]'
                }`}
              >
                <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded bg-[#06110C] border border-[#1D3B2C] text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wider">
                        {srvCategory}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-[#A6B8AE]">
                        <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{srvDuration}</span>
                      </div>
                    </div>

                    <h3 className="font-serif-classic text-xl sm:text-2xl font-bold text-[#F4F0E6]">
                      {srvTitle}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#A6B8AE] leading-relaxed max-w-3xl">
                      {srvDesc}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-[#1D3B2C]">
                    <div className="text-start lg:text-end">
                      <span className="text-[11px] text-[#A6B8AE] block uppercase tracking-wider">
                        {t.treatments.feeLabel}
                      </span>
                      <div className="flex items-baseline gap-1" dir="ltr">
                        <span className="text-2xl font-bold text-[#D4AF37] font-serif-classic tabular-nums">
                          {formatPrice(service.price, { compactDecimals: true, includeCode: true })}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setExpandedTreatmentId(isExpanded ? null : service.id)}
                        className="flex-1 sm:flex-none min-h-[40px] px-3.5 py-2 rounded-lg bg-[#06110C] border border-[#1D3B2C] hover:border-[#D4AF37] text-xs font-semibold text-[#F4F0E6] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>
                          {isExpanded ? t.treatments.hideDetails : t.treatments.protocolDossier}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-[#D4AF37]" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37]" />
                        )}
                      </button>

                      <button
                        onClick={() => onSelectServiceAndBook(service.id)}
                        className="flex-1 sm:flex-none min-h-[40px] px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{t.treatments.bookVisit}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 pt-3 border-t border-[#1D3B2C] bg-[#081710]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-3">
                      <div className="space-y-3 p-4 rounded-xl bg-[#06110C] border border-[#1D3B2C]">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-[#D4AF37] flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                          {t.treatments.includesTitle}
                        </h4>
                        <ul className="space-y-2">
                          {srvIncludes.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-[#C2D1C8]">
                              <span className="text-[#D4AF37] font-bold">·</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3 p-4 rounded-xl bg-[#06110C] border border-[#1D3B2C]">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-[#D4AF37] flex items-center gap-2">
                          <Heart className="w-4 h-4 text-[#D4AF37]" />
                          {t.treatments.indicationsTitle}
                        </h4>
                        <ul className="space-y-2">
                          {srvSuitable.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-[#C2D1C8]">
                              <span className="text-[#D4AF37] font-bold">·</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3 p-4 rounded-xl bg-[#06110C] border border-[#1D3B2C]">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-[#D4AF37] flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                          {t.treatments.prepTitle}
                        </h4>
                        <div className="space-y-2 text-xs text-[#A6B8AE] leading-relaxed">
                          {t.treatments.prepNotes.map((note, nIdx) => (
                            <p key={nIdx}>· {note}</p>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-[#1D3B2C] flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs text-[#C2D1C8]">
                        <Leaf className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        <span>{t.treatments.dispensaryNote}</span>
                      </div>
                      <button
                        onClick={() => onSelectServiceAndBook(service.id)}
                        className="min-h-[42px] px-5 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-xs tracking-wide transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <span>
                          {t.treatments.schedulePrefix}: {srvTitle}
                        </span>
                        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Safety Guarantee Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="p-7 sm:p-9 rounded-2xl bg-[#0B1D14] border border-[#D4AF37]/40 text-[#F4F0E6] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              {t.treatments.safetyBannerKicker}
            </div>
            <h3 className="font-serif-classic text-2xl font-bold">
              {t.treatments.safetyBannerTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[#C2D1C8] leading-relaxed">
              {t.treatments.safetyBannerBody}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-lg bg-[#D4AF37] text-[#06110C] font-bold text-xs uppercase tracking-wider hover:bg-[#E2C36B] transition-all cursor-pointer"
            >
              {t.treatments.bookConsultation}
            </button>
            <a
              href={`tel:${CLINIC_PROFILE.phone}`}
              dir="ltr"
              className="w-full sm:w-auto min-h-[44px] px-5 py-3 rounded-lg border border-[#1D3B2C] bg-[#06110C] hover:border-[#D4AF37] text-xs font-semibold text-[#F4F0E6] flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{CLINIC_PROFILE.formattedPhone}</span>
            </a>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
            {t.treatments.faqKicker}
          </span>
          <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6] mt-1">
            {t.treatments.faqHeading}
          </h2>
        </div>

        <div className="space-y-3">
          {t.treatments.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#1D3B2C] bg-[#0B1D14] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full min-h-[52px] text-start p-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-serif-classic font-semibold text-sm sm:text-base text-[#F4F0E6]">
                    {faq.q}
                  </span>
                  <span className="p-1.5 rounded-md bg-[#06110C] border border-[#1D3B2C] text-[#D4AF37] shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-3 text-xs sm:text-sm text-[#C2D1C8] leading-relaxed border-t border-[#1D3B2C]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
