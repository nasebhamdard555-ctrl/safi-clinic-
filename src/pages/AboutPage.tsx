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
  const [selectedSlideCategory, setSelectedSlideCategory] = useState<string>('all');
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [lightboxSlide, setLightboxSlide] = useState<ClinicPresentationSlide | null>(null);

  const filteredSlides =
    selectedSlideCategory === 'all'
      ? CLINIC_PRESENTATION_SLIDES
      : CLINIC_PRESENTATION_SLIDES.filter((s) => s.category === selectedSlideCategory);

  return (
    <div className="pt-24 lg:pt-32 pb-20 min-h-screen bg-[#111E17] text-[#F4F0E6] selection:bg-[#D4AF7A] selection:text-[#111E17]">
      {/* Editorial Header */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4AF7A]">
            {CLINIC_PROFILE.companyName} · Est. {CLINIC_PROFILE.foundedDate} · {CLINIC_PROFILE.city}
          </p>

          <h1 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F0E6]">
            {CLINIC_PROFILE.name}
          </h1>

          <p className="text-sm text-[#D4AF7A]" dir="rtl">
            {CLINIC_PROFILE.pashtoName} · {CLINIC_PROFILE.persianName}
          </p>

          <p className="text-sm sm:text-base text-[#B8C7BE] leading-relaxed max-w-2xl mx-auto">
            {CLINIC_PROFILE.overview}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#9BB0A3] pt-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF7A]" />
              {CLINIC_PROFILE.clinicAddress}
            </span>
            <span className="text-[#294436]">·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D4AF7A]" />
              {CLINIC_PROFILE.hoursPolicy}
            </span>
          </div>
        </div>
      </section>

      {/* Founder & Director Spotlight Card */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-16">
        <div className="rounded-3xl bg-[#192B22] border border-[#294436] overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-5 p-6 bg-[#14231B] flex items-center justify-center border-b lg:border-b-0 lg:border-r border-[#294436]">
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white p-2 border border-[#D4AF7A]/40 shadow-md">
              <BotanicalImage
                src={CLINIC_PROFILE.founder.photo}
                alt={CLINIC_PROFILE.founder.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF7A] font-semibold block">
                Leadership · {CLINIC_PROFILE.companySubtitle}
              </span>
              <div>
                <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6]">
                  {CLINIC_PROFILE.founder.name}
                </h2>
                <p className="text-xs sm:text-sm font-medium text-[#D4AF7A] mt-1">
                  {CLINIC_PROFILE.founder.title} · {CLINIC_PROFILE.founder.location}
                </p>
              </div>
              <p className="text-sm text-[#C7D4CC] leading-relaxed">
                {CLINIC_PROFILE.founder.bio}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-[#111E17] border border-[#294436]">
                  <span className="text-[10px] uppercase tracking-wider text-[#D4AF7A] block font-semibold">
                    Clinic Address
                  </span>
                  <span className="text-[#F4F0E6] mt-0.5 block">
                    {CLINIC_PROFILE.clinicAddress}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#111E17] border border-[#294436]">
                  <span className="text-[10px] uppercase tracking-wider text-[#D4AF7A] block font-semibold">
                    Registered Office
                  </span>
                  <span className="text-[#F4F0E6] mt-0.5 block">
                    {CLINIC_PROFILE.registeredOffice}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#294436] flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenBooking}
                className="px-5 py-2.5 rounded-lg bg-[#D4AF7A] hover:bg-[#C39B62] text-[#111E17] font-bold text-xs tracking-wide transition-colors cursor-pointer"
              >
                Book With Dr. Hafizullah Safi
              </button>
              <button
                onClick={onNavigateToTreatments}
                className="px-5 py-2.5 rounded-lg border border-[#345544] hover:border-[#D4AF7A] text-[#F4F0E6] font-semibold text-xs transition-colors cursor-pointer"
              >
                View 8 Outpatient Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sacred Epigraph */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-16">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#192B22] border border-[#D4AF7A]/35 text-center space-y-4">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF7A] font-semibold block">
            Faith & Healing · Surah Ash-Shu&apos;ara 26:80
          </span>

          <h2 className="font-serif-classic text-3xl sm:text-4xl font-bold text-[#F4F0E6]" dir="rtl">
            {CLINIC_PROFILE.faithAndHealing.arabic}
          </h2>

          <p className="text-base sm:text-lg text-[#D4AF7A] font-medium" dir="rtl">
            {CLINIC_PROFILE.faithAndHealing.pashto}
          </p>

          <p className="text-xs sm:text-sm text-[#B8C7BE] italic max-w-xl mx-auto">
            &ldquo;{CLINIC_PROFILE.faithAndHealing.english}&rdquo;
          </p>
        </div>
      </section>

      {/* Vision, Mission & 3 Systems */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-7 rounded-2xl bg-[#192B22] border border-[#294436] space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF7A] font-semibold">
              <Compass className="w-4 h-4" />
              <span>Vision</span>
            </div>
            <h3 className="font-serif-classic font-bold text-xl text-[#F4F0E6]">
              Ethical Community Care
            </h3>
            <p className="text-sm text-[#B8C7BE] leading-relaxed">
              {CLINIC_PROFILE.vision}
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-[#192B22] border border-[#294436] space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF7A] font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Mission</span>
            </div>
            <h3 className="font-serif-classic font-bold text-xl text-[#F4F0E6]">
              Safety & Informed Consent
            </h3>
            <ul className="space-y-2 text-sm text-[#B8C7BE]">
              {CLINIC_PROFILE.mission.map((m, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#D4AF7A] font-bold">·</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3 Systems of Medicine */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {CLINIC_PROFILE.systemsOfMedicine.map((sys) => (
            <div
              key={sys.code}
              className="p-7 rounded-2xl bg-[#192B22] border border-[#294436] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#294436] pb-3">
                  <span className="font-serif-classic text-2xl font-bold text-[#D4AF7A]">
                    {sys.code}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8C7BE]">
                    {sys.tagline}
                  </span>
                </div>
                <h3 className="font-serif-classic font-bold text-xl text-[#F4F0E6]">
                  {sys.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#B8C7BE] leading-relaxed">
                  {sys.description}
                </p>
              </div>
              <ul className="space-y-1.5 pt-3 border-t border-[#294436] text-xs text-[#D5E0D9]">
                {sys.principles.map((pr, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2">
                    <span className="text-[#D4AF7A] font-bold">·</span>
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
          <div className="lg:col-span-7 p-7 rounded-2xl bg-[#192B22] border border-[#294436] space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF7A] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Clinical Safety & WHO TCIM Principles</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {CLINIC_PROFILE.safetyEthics.map((se, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#111E17] border border-[#294436] space-y-1.5">
                  <h4 className="font-serif-classic font-bold text-sm text-[#F4F0E6]">
                    {se.title}
                  </h4>
                  <p className="text-xs text-[#B8C7BE] leading-relaxed">
                    {se.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 p-7 rounded-2xl bg-[#192B22] border border-[#D4AF7A]/40 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF7A] uppercase tracking-wider">
                <FileCheck className="w-4 h-4" />
                <span>MoPH Compliance</span>
              </div>
              <h3 className="font-serif-classic text-xl font-bold text-[#F4F0E6]">
                Legal & Scope Notice
              </h3>
              <p className="text-xs text-[#C7D4CC] leading-relaxed">
                {CLINIC_PROFILE.legalStatement}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#294436] text-xs">
              <a
                href={`tel:${CLINIC_PROFILE.phone}`}
                className="w-full py-2.5 rounded-lg bg-[#D4AF7A] hover:bg-[#C39B62] text-[#111E17] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Direct Desk: {CLINIC_PROFILE.formattedPhone}</span>
              </a>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#B8C7BE] pt-1">
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#D4AF7A]" />
                  {CLINIC_PROFILE.secondaryEmail}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Globe className="w-3 h-3 text-[#D4AF7A]" />
                  {CLINIC_PROFILE.website}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Clinic Photo Gallery & Profile Slides */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16" id="official-dossier">
        <div className="p-7 sm:p-10 rounded-3xl bg-[#192B22] border border-[#294436] space-y-7">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-[#294436]">
            <div className="space-y-1.5 max-w-2xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF7A]">
                Clinic Archive & Portraits
              </span>
              <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6]">
                Official Documentation & Clinical Photos
              </h2>
              <p className="text-xs sm:text-sm text-[#B8C7BE]">
                Click any record or photo below to inspect full resolution in the lightbox viewer.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#111E17] p-1 rounded-xl border border-[#294436] self-start lg:self-auto shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#D4AF7A] text-[#111E17]'
                    : 'text-[#B8C7BE] hover:text-[#F4F0E6]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Grid ({CLINIC_PRESENTATION_SLIDES.length})</span>
              </button>
              <button
                onClick={() => setViewMode('carousel')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'carousel'
                    ? 'bg-[#D4AF7A] text-[#111E17]'
                    : 'text-[#B8C7BE] hover:text-[#F4F0E6]'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Projector</span>
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Records' },
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
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedSlideCategory === cat.id
                    ? 'bg-[#D4AF7A] text-[#111E17] font-semibold'
                    : 'bg-[#111E17] text-[#B8C7BE] border border-[#294436] hover:text-[#F4F0E6]'
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
                  className="group rounded-2xl bg-[#111E17] border border-[#294436] hover:border-[#D4AF7A]/70 transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] bg-[#0B140F] overflow-hidden border-b border-[#294436]">
                    <BotanicalImage
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => setLightboxSlide(slide)}
                      className="absolute bottom-3 right-3 px-2.5 py-1.5 rounded-lg bg-[#D4AF7A] text-[#111E17] font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#111E17]/90 border border-[#294436] text-[10px] font-bold text-[#D4AF7A]">
                      {String(sIdx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#D4AF7A]">
                      {slide.category}
                    </span>
                    <h3 className="font-serif-classic font-bold text-base text-[#F4F0E6]">
                      {slide.title}
                    </h3>
                    <p className="text-xs text-[#B8C7BE] line-clamp-2 leading-relaxed">
                      {slide.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="p-5 sm:p-7 rounded-2xl bg-[#111E17] border border-[#294436] space-y-5">
                <div className="relative aspect-[16/10] sm:aspect-[16/9] max-h-[520px] w-full bg-[#0B140F] rounded-xl overflow-hidden border border-[#294436] flex items-center justify-center">
                  <BotanicalImage
                    src={CLINIC_PRESENTATION_SLIDES[activeSlideIndex].image}
                    alt={CLINIC_PRESENTATION_SLIDES[activeSlideIndex].title}
                    className="max-h-full max-w-full object-contain p-2"
                  />
                  <button
                    onClick={() => setLightboxSlide(CLINIC_PRESENTATION_SLIDES[activeSlideIndex])}
                    className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-[#D4AF7A] text-[#111E17] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Lightbox</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[#294436]">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#D4AF7A]">
                      Slide {activeSlideIndex + 1} of {CLINIC_PRESENTATION_SLIDES.length} ·{' '}
                      {CLINIC_PRESENTATION_SLIDES[activeSlideIndex].category}
                    </span>
                    <h3 className="font-serif-classic font-bold text-lg text-[#F4F0E6]">
                      {CLINIC_PRESENTATION_SLIDES[activeSlideIndex].title}
                    </h3>
                    <p className="text-xs text-[#B8C7BE] max-w-2xl mt-1">
                      {CLINIC_PRESENTATION_SLIDES[activeSlideIndex].description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        setActiveSlideIndex((prev) =>
                          prev === 0 ? CLINIC_PRESENTATION_SLIDES.length - 1 : prev - 1
                        )
                      }
                      aria-label="Previous slide"
                      className="p-2.5 rounded-xl bg-[#192B22] border border-[#294436] hover:border-[#D4AF7A] text-[#F4F0E6] cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-mono text-xs text-[#B8C7BE] px-2">
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
                      className="p-2.5 rounded-xl bg-[#192B22] border border-[#294436] hover:border-[#D4AF7A] text-[#F4F0E6] cursor-pointer"
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
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF7A] font-semibold">
            Medical Team
          </span>
          <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6] mt-1">
            Director & Clinical Staff
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {PRACTITIONERS.map((p) => (
            <div
              key={p.id}
              className="p-6 rounded-2xl bg-[#192B22] border border-[#294436] flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl border border-[#D4AF7A] bg-[#111E17] text-[#D4AF7A] font-serif-classic font-bold text-xl flex items-center justify-center shrink-0">
                  {p.id === 'prac-hafizullah' ? 'HS.' : 'SC.'}
                </div>
                <div>
                  <h3 className="font-serif-classic font-bold text-lg text-[#F4F0E6]">
                    {p.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#D4AF7A]">{p.title}</p>
                  <p className="text-[11px] text-[#B8C7BE]">{p.degrees}</p>
                  <div className="flex items-center gap-1 text-xs text-[#D4AF7A] mt-1">
                    <Star className="w-3.5 h-3.5 fill-[#D4AF7A]" />
                    <span>{p.rating} · {p.experienceYears} Years Practice</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#C7D4CC] leading-relaxed">
                {p.bio}
              </p>

              <div className="pt-3 border-t border-[#294436] flex items-center justify-between">
                <span className="text-[11px] text-[#9BB0A3]">Kabul, Afghanistan</span>
                <button
                  onClick={onOpenBooking}
                  className="px-4 py-2 rounded-lg bg-[#D4AF7A] hover:bg-[#C39B62] text-[#111E17] font-bold text-xs cursor-pointer"
                >
                  Schedule Consultation
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="p-8 rounded-3xl bg-[#192B22] border border-[#D4AF7A]/40 text-center space-y-4">
          <h3 className="font-serif-classic text-2xl font-bold text-[#F4F0E6]">
            Visit Our Kabul Outpatient Clinic
          </h3>
          <p className="text-xs sm:text-sm text-[#B8C7BE] max-w-xl mx-auto">
            {CLINIC_PROFILE.clinicAddress} · {CLINIC_PROFILE.hoursPolicy}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenBooking}
              className="px-6 py-3 rounded-xl bg-[#D4AF7A] hover:bg-[#C39B62] text-[#111E17] font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Book Clinical Consultation
            </button>
            <button
              onClick={onNavigateToContact}
              className="px-6 py-3 rounded-xl bg-[#111E17] border border-[#294436] hover:border-[#D4AF7A] text-xs font-semibold text-[#F4F0E6] cursor-pointer"
            >
              Contact Clinic Desk
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
          <div className="relative w-full max-w-5xl bg-[#111E17] border border-[#D4AF7A]/60 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-5 bg-[#0B140F] border-b border-[#294436]">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-[#192B22] border border-[#D4AF7A]/40 text-[#D4AF7A] text-xs font-bold uppercase tracking-wider">
                  {lightboxSlide.category}
                </span>
                <div>
                  <h3 className="font-serif-classic font-bold text-base sm:text-lg text-[#F4F0E6]">
                    {lightboxSlide.title}
                  </h3>
                  <p className="text-[11px] text-[#9BB0A3]">
                    {CLINIC_PROFILE.name} · Kabul, Afghanistan
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={lightboxSlide.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-[#192B22] border border-[#294436] text-[#B8C7BE] hover:text-[#D4AF7A]"
                  title="Open Image in New Tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setLightboxSlide(null)}
                  aria-label="Close lightbox"
                  className="p-2 rounded-xl bg-[#192B22] border border-[#294436] text-[#B8C7BE] hover:text-[#F4F0E6] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-[#0B140F]">
              <div className="max-h-[60vh] max-w-full flex items-center justify-center rounded-xl overflow-hidden border border-[#294436] bg-black">
                <BotanicalImage
                  src={lightboxSlide.image}
                  alt={lightboxSlide.title}
                  className="max-h-[60vh] max-w-full object-contain"
                />
              </div>
              <div className="w-full mt-4 p-4 rounded-xl bg-[#192B22] border border-[#294436] text-xs">
                <p className="text-[#F4F0E6]">{lightboxSlide.description}</p>
              </div>
            </div>

            <div className="p-4 bg-[#0B140F] border-t border-[#294436] flex items-center justify-between text-xs text-[#9BB0A3]">
              <span>{CLINIC_PROFILE.name} · {CLINIC_PROFILE.clinicAddress}</span>
              <button
                onClick={() => setLightboxSlide(null)}
                className="px-4 py-1.5 rounded-lg bg-[#D4AF7A] text-[#111E17] font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
