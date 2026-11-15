import React, { useState } from 'react';
import {
  ShieldCheck,
  Phone,
  Star,
  CheckCircle2,
  Compass,
  MapPin,
  Clock,
  Globe,
  FileCheck,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Layers,
  X,
  ExternalLink,
  Mail,
} from 'lucide-react';
import {
  CLINIC_PROFILE,
  PRACTITIONERS,
  CLINIC_PRESENTATION_SLIDES,
} from '../data/clinicData';
import { ClinicPresentationSlide } from '../types/clinic';
import { BotanicalImage } from '../components/BotanicalImage';
import { useLanguage } from '../context/LanguageContext';

interface AboutPageProps {
  onOpenBooking: () => void;
  onNavigateToTreatments: () => void;
  onNavigateToContact: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onOpenBooking,
  onNavigateToTreatments,
  onNavigateToContact,
}) => {
  const { t } = useLanguage();
  const [selectedSlideCategory, setSelectedSlideCategory] = useState<string>('all');
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [lightboxSlide, setLightboxSlide] = useState<ClinicPresentationSlide | null>(null);

  const filteredSlides =
    selectedSlideCategory === 'all'
      ? CLINIC_PRESENTATION_SLIDES
      : CLINIC_PRESENTATION_SLIDES.filter((s) => s.category === selectedSlideCategory);

  return (
    <div className="pt-24 lg:pt-32 pb-20 min-h-screen bg-[#08140E] text-[#F4F0E6] selection:bg-[#D4AF37] selection:text-[#06110C]">
      {/* Editorial Header */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
            {t.brand.companyName} · {t.brand.foundedText} · {t.brand.cityCountry}
          </p>

          <h1 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F0E6]">
            {t.brand.clinicName}
          </h1>

          <p className="text-sm text-[#D4AF37]" dir="rtl">
            {CLINIC_PROFILE.pashtoName} · {CLINIC_PROFILE.persianName}
          </p>

          <p className="text-sm sm:text-base text-[#C2D1C8] leading-relaxed max-w-2xl mx-auto">
            {t.brand.overview}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#A6B8AE] pt-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              {t.brand.clinicAddress}
            </span>
            <span className="text-[#1D3B2C]">·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              {t.brand.hoursPolicy}
            </span>
          </div>
        </div>
      </section>

      {/* Founder & Director Spotlight Card */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-16">
        <div className="rounded-3xl bg-[#0B1D14] border border-[#1D3B2C] overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-5 p-6 bg-[#06110C] flex items-center justify-center border-b lg:border-b-0 lg:border-e border-[#1D3B2C]">
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white p-2 border border-[#D4AF37]/50 shadow-md">
              <BotanicalImage
                src={CLINIC_PROFILE.founder.photo}
                alt={t.brand.founderName}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block">
                {t.about.leadershipKicker}
              </span>
              <div>
                <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6]">
                  {t.brand.founderName}
                </h2>
                <p className="text-xs sm:text-sm font-medium text-[#D4AF37] mt-1">
                  {t.brand.founderTitle} · {t.brand.cityCountry}
                </p>
              </div>
              <p className="text-sm text-[#C2D1C8] leading-relaxed">
                {t.brand.founderBio}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-[#06110C] border border-[#1D3B2C]">
                  <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] block font-semibold">
                    {t.about.clinicAddressLabel}
                  </span>
                  <span className="text-[#F4F0E6] mt-0.5 block">
                    {t.brand.clinicAddress}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#06110C] border border-[#1D3B2C]">
                  <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] block font-semibold">
                    {t.about.registeredOfficeLabel}
                  </span>
                  <span className="text-[#F4F0E6] mt-0.5 block">
                    {t.brand.registeredOffice}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1D3B2C] flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenBooking}
                className="min-h-[42px] px-5 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-xs tracking-wide transition-colors cursor-pointer"
              >
                {t.about.bookWithFounder}
              </button>
              <button
                onClick={onNavigateToTreatments}
                className="min-h-[42px] px-5 py-2.5 rounded-lg border border-[#1D3B2C] hover:border-[#D4AF37] text-[#F4F0E6] font-semibold text-xs transition-colors cursor-pointer"
              >
                {t.about.viewServices}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sacred Epigraph */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-16">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0B1D14] border border-[#D4AF37]/40 text-center space-y-4">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block">
            {t.about.faithKicker}
          </span>

          <h2 className="font-serif-classic text-3xl sm:text-4xl font-bold text-[#F4F0E6]" dir="rtl">
            {CLINIC_PROFILE.faithAndHealing.arabic}
          </h2>

          <p className="text-base sm:text-lg text-[#D4AF37] font-medium" dir="rtl">
            {CLINIC_PROFILE.faithAndHealing.pashto}
          </p>

          <p className="text-xs sm:text-sm text-[#C2D1C8] italic max-w-xl mx-auto">
            &ldquo;{t.brand.epigraphTranslation}&rdquo;
          </p>
        </div>
      </section>

      {/* Vision, Mission & 3 Systems */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-7 rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
              <Compass className="w-4 h-4" />
              <span>{t.about.visionTitle}</span>
            </div>
            <h3 className="font-serif-classic font-bold text-xl text-[#F4F0E6]">
              {t.about.visionSubtitle}
            </h3>
            <p className="text-sm text-[#C2D1C8] leading-relaxed">
              {t.brand.vision}
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.about.missionTitle}</span>
            </div>
            <h3 className="font-serif-classic font-bold text-xl text-[#F4F0E6]">
              {t.about.missionSubtitle}
            </h3>
            <ul className="space-y-2 text-sm text-[#C2D1C8]">
              {t.brand.mission.map((m, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#D4AF37] font-bold">·</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3 Systems of Medicine */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {t.systems.map((sys) => (
            <div
              key={sys.code}
              className="p-7 rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#1D3B2C] pb-3">
                  <span dir="ltr" className="font-serif-classic text-2xl font-bold text-[#D4AF37]">
                    {sys.code}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C2D1C8]">
                    {sys.tagline}
                  </span>
                </div>
                <h3 className="font-serif-classic font-bold text-xl text-[#F4F0E6]">
                  {sys.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#A6B8AE] leading-relaxed">
                  {sys.description}
                </p>
              </div>
              <ul className="space-y-1.5 pt-3 border-t border-[#1D3B2C] text-xs text-[#C2D1C8]">
                {sys.principles.map((pr, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2">
                    <span className="text-[#D4AF37] font-bold">·</span>
                    <span>{pr}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* MoPH Regulatory Scope & Patient Safety */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 sm:p-7 rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.about.safetyKicker}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {t.safetyEthics.map((se, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#06110C] border border-[#1D3B2C] space-y-1.5">
                  <h4 className="font-serif-classic font-bold text-sm text-[#F4F0E6]">
                    {se.title}
                  </h4>
                  <p className="text-xs text-[#A6B8AE] leading-relaxed">
                    {se.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-7 rounded-2xl bg-[#0B1D14] border border-[#D4AF37]/40 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                <FileCheck className="w-4 h-4" />
                <span>{t.about.mophKicker}</span>
              </div>
              <h3 className="font-serif-classic text-xl font-bold text-[#F4F0E6]">
                {t.about.mophTitle}
              </h3>
              <p className="text-xs text-[#C2D1C8] leading-relaxed">
                {t.brand.legalStatement}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#1D3B2C] text-xs">
              <a
                href={`tel:${CLINIC_PROFILE.phone}`}
                className="w-full min-h-[42px] py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>{t.about.directDesk}</span>
                <span dir="ltr">{CLINIC_PROFILE.formattedPhone}</span>
              </a>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#A6B8AE] pt-1">
                <span dir="ltr" className="inline-flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#D4AF37]" />
                  {CLINIC_PROFILE.secondaryEmail}
                </span>
                <span dir="ltr" className="inline-flex items-center gap-1">
                  <Globe className="w-3 h-3 text-[#D4AF37]" />
                  {CLINIC_PROFILE.website}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Clinic Photo Gallery & Profile Slides */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16" id="official-dossier">
        <div className="p-6 sm:p-10 rounded-3xl bg-[#0B1D14] border border-[#1D3B2C] space-y-7">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-[#1D3B2C]">
            <div className="space-y-1.5 max-w-2xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                {t.about.archiveKicker}
              </span>
              <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6]">
                {t.about.archiveTitle}
              </h2>
              <p className="text-xs sm:text-sm text-[#A6B8AE]">
                {t.about.archiveSub}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#06110C] p-1 rounded-xl border border-[#1D3B2C] self-start lg:self-auto shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#D4AF37] text-[#06110C]'
                    : 'text-[#C2D1C8] hover:text-[#F4F0E6]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t.about.gridLabel} ({CLINIC_PRESENTATION_SLIDES.length})</span>
              </button>
              <button
                onClick={() => setViewMode('carousel')}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'carousel'
                    ? 'bg-[#D4AF37] text-[#06110C]'
                    : 'text-[#C2D1C8] hover:text-[#F4F0E6]'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{t.about.projectorLabel}</span>
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: t.about.allRecords },
              { id: 'Overview', label: 'Overview' },
              { id: 'Clinical Systems', label: 'Systems & Naturopathy' },
              { id: 'Governance', label: 'Vision & Mission' },
              { id: 'Philosophy', label: 'Faith & Healing' },
              { id: 'Services', label: 'Services' },
              { id: 'Ethics & QA', label: 'Ethics' },
              { id: 'WHO Alignment', label: 'WHO TCIM' },
              { id: 'Legal', label: 'MoPH Statement' },
              { id: 'Contact', label: 'Contact' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedSlideCategory(cat.id)}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedSlideCategory === cat.id
                    ? 'bg-[#D4AF37] text-[#06110C] font-semibold'
                    : 'bg-[#06110C] text-[#C2D1C8] border border-[#1D3B2C] hover:text-[#F4F0E6]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSlides.map((slide, sIdx) => (
                <div
                  key={slide.id}
                  className="group rounded-2xl bg-[#06110C] border border-[#1D3B2C] hover:border-[#D4AF37]/70 transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] bg-white overflow-hidden border-b border-[#1D3B2C]">
                    <BotanicalImage
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => setLightboxSlide(slide)}
                      className="min-h-[34px] absolute bottom-3 end-3 px-2.5 py-1.5 rounded-lg bg-[#D4AF37] text-[#06110C] font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t.about.inspectBtn}</span>
                    </button>
                    <span className="absolute top-2.5 start-2.5 px-2 py-0.5 rounded bg-[#06110C]/90 border border-[#1D3B2C] text-[10px] font-bold text-[#D4AF37]">
                      {String(sIdx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#D4AF37]">
                      {slide.category}
                    </span>
                    <h3 className="font-serif-classic font-bold text-base text-[#F4F0E6]">
                      {slide.title}
                    </h3>
                    <p className="text-xs text-[#A6B8AE] line-clamp-2 leading-relaxed">
                      {slide.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="p-5 sm:p-7 rounded-2xl bg-[#06110C] border border-[#1D3B2C] space-y-5">
                <div className="relative aspect-[16/10] sm:aspect-[16/9] max-h-[520px] w-full bg-white rounded-xl overflow-hidden border border-[#1D3B2C] flex items-center justify-center">
                  <BotanicalImage
                    src={CLINIC_PRESENTATION_SLIDES[activeSlideIndex].image}
                    alt={CLINIC_PRESENTATION_SLIDES[activeSlideIndex].title}
                    className="max-h-full max-w-full object-contain p-2"
                  />
                  <button
                    onClick={() => setLightboxSlide(CLINIC_PRESENTATION_SLIDES[activeSlideIndex])}
                    className="min-h-[36px] absolute bottom-4 end-4 px-3 py-1.5 rounded-lg bg-[#D4AF37] text-[#06110C] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>{t.about.lightboxBtn}</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[#1D3B2C]">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#D4AF37]">
                      {t.about.slideLabel} {activeSlideIndex + 1} {t.about.ofWord}{' '}
                      {CLINIC_PRESENTATION_SLIDES.length} ·{' '}
                      {CLINIC_PRESENTATION_SLIDES[activeSlideIndex].category}
                    </span>
                    <h3 className="font-serif-classic font-bold text-lg text-[#F4F0E6]">
                      {CLINIC_PRESENTATION_SLIDES[activeSlideIndex].title}
                    </h3>
                    <p className="text-xs text-[#A6B8AE] max-w-2xl mt-1">
                      {CLINIC_PRESENTATION_SLIDES[activeSlideIndex].description}
                    </p>
                  </div>

                  <div dir="ltr" className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        setActiveSlideIndex((prev) =>
                          prev === 0 ? CLINIC_PRESENTATION_SLIDES.length - 1 : prev - 1
                        )
                      }
                      aria-label="Previous slide"
                      className="min-w-[42px] min-h-[42px] p-2.5 rounded-xl bg-[#0B1D14] border border-[#1D3B2C] hover:border-[#D4AF37] text-[#F4F0E6] flex items-center justify-center cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-mono text-xs text-[#C2D1C8] px-2 tabular-nums">
                      {String(activeSlideIndex + 1).padStart(2, '0')} /{' '}
                      {String(CLINIC_PRESENTATION_SLIDES.length).padStart(2, '0')}
                    </span>
                    <button
                      onClick={() =>
                        setActiveSlideIndex((prev) =>
                          prev === CLINIC_PRESENTATION_SLIDES.length - 1 ? 0 : prev + 1
                        )
                      }
                      aria-label="Next slide"
                      className="min-w-[42px] min-h-[42px] p-2.5 rounded-xl bg-[#0B1D14] border border-[#1D3B2C] hover:border-[#D4AF37] text-[#F4F0E6] flex items-center justify-center cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Clinical Leadership & Care Team */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
            {t.about.teamKicker}
          </span>
          <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6] mt-1">
            {t.about.teamTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {PRACTITIONERS.map((p) => (
            <div
              key={p.id}
              className="p-6 rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-4">
                <div dir="ltr" className="w-16 h-16 rounded-2xl border border-[#D4AF37] bg-[#06110C] text-[#D4AF37] font-serif-classic font-bold text-xl flex items-center justify-center shrink-0">
                  {p.id === 'prac-hafizullah' ? 'HS.' : 'SC.'}
                </div>
                <div>
                  <h3 className="font-serif-classic font-bold text-lg text-[#F4F0E6]">
                    {p.id === 'prac-hafizullah' ? t.brand.founderName : p.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#D4AF37]">
                    {p.id === 'prac-hafizullah' ? t.brand.founderTitle : p.title}
                  </p>
                  <p className="text-[11px] text-[#A6B8AE]">{p.degrees}</p>
                  <div className="flex items-center gap-1 text-xs text-[#D4AF37] mt-1">
                    <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                    <span dir="ltr">{p.rating}</span>
                    <span>· {p.experienceYears} {t.about.yearsPractice}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#C2D1C8] leading-relaxed">
                {p.id === 'prac-hafizullah' ? t.brand.founderBio : p.bio}
              </p>

              <div className="pt-3 border-t border-[#1D3B2C] flex items-center justify-between">
                <span className="text-[11px] text-[#A6B8AE]">{t.brand.cityCountry}</span>
                <button
                  onClick={onOpenBooking}
                  className="min-h-[38px] px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-xs cursor-pointer"
                >
                  {t.about.scheduleBtn}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="p-7 sm:p-8 rounded-3xl bg-[#0B1D14] border border-[#D4AF37]/40 text-center space-y-4">
          <h3 className="font-serif-classic text-2xl font-bold text-[#F4F0E6]">
            {t.about.bottomCtaTitle}
          </h3>
          <p className="text-xs sm:text-sm text-[#C2D1C8] max-w-xl mx-auto">
            {t.brand.clinicAddress} · {t.brand.hoursPolicy}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              {t.about.bookClinicalBtn}
            </button>
            <button
              onClick={onNavigateToContact}
              className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-xl bg-[#06110C] border border-[#1D3B2C] hover:border-[#D4AF37] text-xs font-semibold text-[#F4F0E6] cursor-pointer"
            >
              {t.about.contactDeskBtn}
            </button>
          </div>
        </div>
      </section>

      {/* Slide Lightbox Modal */}
      {lightboxSlide && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        >
          <div className="relative w-full max-w-5xl bg-[#0B1D14] border border-[#D4AF37]/60 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-5 bg-[#06110C] border-b border-[#1D3B2C]">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-[#0B1D14] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                  {lightboxSlide.category}
                </span>
                <div>
                  <h3 className="font-serif-classic font-bold text-base sm:text-lg text-[#F4F0E6]">
                    {lightboxSlide.title}
                  </h3>
                  <p className="text-[11px] text-[#A6B8AE]">
                    {t.brand.clinicName} · {t.brand.cityCountry}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={lightboxSlide.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[38px] min-h-[38px] p-2 rounded-xl bg-[#0B1D14] border border-[#1D3B2C] text-[#A6B8AE] hover:text-[#D4AF37] flex items-center justify-center"
                  title="Open Image in New Tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setLightboxSlide(null)}
                  aria-label={t.about.closeBtn}
                  className="min-w-[38px] min-h-[38px] p-2 rounded-xl bg-[#0B1D14] border border-[#1D3B2C] text-[#A6B8AE] hover:text-[#F4F0E6] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-[#06110C]">
              <div className="max-h-[60vh] max-w-full flex items-center justify-center rounded-xl overflow-hidden border border-[#1D3B2C] bg-white p-2">
                <BotanicalImage
                  src={lightboxSlide.image}
                  alt={lightboxSlide.title}
                  className="max-h-[56vh] max-w-full object-contain"
                />
              </div>
              <div className="w-full mt-4 p-4 rounded-xl bg-[#0B1D14] border border-[#1D3B2C] text-xs">
                <p className="text-[#F4F0E6]">{lightboxSlide.description}</p>
              </div>
            </div>

            <div className="p-4 bg-[#06110C] border-t border-[#1D3B2C] flex items-center justify-between text-xs text-[#A6B8AE]">
              <span>{t.brand.clinicName} · {t.brand.clinicAddress}</span>
              <button
                onClick={() => setLightboxSlide(null)}
                className="min-h-[36px] px-4 py-1.5 rounded-lg bg-[#D4AF37] text-[#06110C] font-bold text-xs cursor-pointer"
              >
                {t.about.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
