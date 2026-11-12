import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Calendar,
  Phone,
  Heart,
  Droplets,
  Star,
  Activity,
  CheckCircle2,
  Users,
  Compass,
  MapPin,
  Clock,
  ArrowRight,
  Globe,
  FileCheck,
  BookOpen,
  Share2,
  Leaf,
  Scale,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Layers,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  CLINIC_PROFILE,
  PRACTITIONERS,
  CLINIC_PRESENTATION_SLIDES,
} from '../data/clinicData';
import { ClinicPresentationSlide } from '../types/clinic';

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

  const filteredSlides = selectedSlideCategory === 'all'
    ? CLINIC_PRESENTATION_SLIDES
    : CLINIC_PRESENTATION_SLIDES.filter((s) => s.category === selectedSlideCategory);
  return (
    <div className="pt-24 lg:pt-32 pb-20 min-h-screen bg-[#041712] text-[#f5f3ec] relative selection:bg-[#d4af37] selection:text-black">
      {/* Page Ambient Noble Alpine Pine & Bronze Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-emerald-600/25 via-teal-950/20 to-transparent blur-[150px] pointer-events-none -z-10" />

      {/* Header Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a1e15] border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold uppercase tracking-widest shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clinic Profile & Official Governance</span>
          </div>

          <h1 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f5f3ec]">
            {CLINIC_PROFILE.name}
          </h1>

          <p className="font-serif-editorial text-base sm:text-lg text-[#d4af37] italic">
            {CLINIC_PROFILE.tagline}
          </p>

          <p className="text-xs sm:text-sm text-[#a6b6ad] leading-relaxed max-w-2xl mx-auto">
            {CLINIC_PROFILE.overview}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#8da396] pt-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              {CLINIC_PROFILE.city}, {CLINIC_PROFILE.country}
            </span>
            <span className="text-[#234b3c]">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              {CLINIC_PROFILE.facilityType}
            </span>
            <span className="text-[#234b3c]">·</span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              WHO TCIM Aligned Practice
            </span>
          </div>
        </div>
      </section>

      {/* Faith & Healing Spiritual Foundation Card */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-16">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#092216] via-[#05130b] to-[#030906] border border-[#d4af37]/50 shadow-2xl text-center space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#d4af37] font-semibold block">
            Faith & Healing · د ایمان او شفا اصل
          </span>

          <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f5f3ec] tracking-wider" dir="rtl">
            {CLINIC_PROFILE.faithAndHealing.arabic}
          </h2>

          <p className="text-base sm:text-lg text-[#d4af37] font-medium" dir="rtl">
            {CLINIC_PROFILE.faithAndHealing.pashto}
          </p>

          <p className="text-xs sm:text-sm text-[#b8c9bf] italic max-w-xl mx-auto">
            "{CLINIC_PROFILE.faithAndHealing.english}"
          </p>

          <div className="pt-3 max-w-2xl mx-auto border-t border-[#1b3b2f]/80 text-xs text-[#8da396] leading-relaxed">
            In our clinic philosophy, traditional medicine, Unani temperament diagnosis, and botanical extracts serve as ethical instruments to nurture and support the innate healing capacity (Tabiat) granted by Allah (SWT).
          </div>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vision */}
          <div className="p-8 rounded-3xl bg-[#081810] border border-[#234b3c] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block">
                Our Vision
              </span>
              <h3 className="font-serif-classic font-bold text-xl sm:text-2xl text-[#f5f3ec]">
                Ethical, Evidence-Informed Community Health
              </h3>
              <p className="text-xs sm:text-sm text-[#a6b6ad] leading-relaxed">
                {CLINIC_PROFILE.vision}
              </p>
            </div>
            <div className="pt-2 text-xs text-[#8da396]">
              Harmonized with modern clinical accountability and international public health principles.
            </div>
          </div>

          {/* Mission */}
          <div className="p-8 rounded-3xl bg-[#081810] border border-[#234b3c] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block">
                Our Mission
              </span>
              <h3 className="font-serif-classic font-bold text-xl sm:text-2xl text-[#f5f3ec]">
                Patient Safety, Access & Informed Consent
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-[#a6b6ad] pt-2">
                {CLINIC_PROFILE.mission.map((m, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#d4af37] shrink-0 mt-1.5" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-2 text-xs text-[#8da396]">
              Outpatient community practice serving families across Kabul and nationwide.
            </div>
          </div>
        </div>
      </section>

      {/* Systems of Medicine Practiced (Deep Breakdown) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            Clinical Methodologies
          </span>
          <h2 className="font-serif-classic text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f5f3ec] mt-1">
            Systems of Medicine Practiced
          </h2>
          <p className="text-xs sm:text-sm text-[#8da396] mt-2 leading-relaxed">
            Safi Natural Care Clinic integrates three classical and complementary modalities within the recognized scope of Traditional, Complementary, and Integrative Medicine:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {CLINIC_PROFILE.systemsOfMedicine.map((sys, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-gradient-to-br from-[#081810] to-[#040b07] border border-[#234b3c] hover:border-[#d4af37]/60 transition-all flex flex-col justify-between space-y-6 shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif-classic text-3xl font-bold text-[#d4af37]/40">
                    0{idx + 1}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#0e2118] border border-[#234b3c] text-[10px] font-bold text-[#d4af37] uppercase">
                    {sys.tagline}
                  </span>
                </div>

                <h3 className="font-serif-classic font-bold text-2xl text-[#f5f3ec]">
                  {sys.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#a6b6ad] leading-relaxed">
                  {sys.description}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-[#1b3b2f]">
                  <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block">
                    Core Principles:
                  </span>
                  <ul className="space-y-2 text-xs text-[#d8e2dc]">
                    {sys.principles.map((pr, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                        <span>{pr}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Safety, Ethics, and Quality Assurance */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#081810] border border-[#d4af37]/40 shadow-2xl space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              Quality Assurance
            </span>
            <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec] mt-1">
              Safety, Ethics, and Clinical Principles
            </h2>
            <p className="text-xs sm:text-sm text-[#8da396] mt-2">
              The clinic operates with strict adherence to patient dignity, non-invasive therapies, and transparent medical boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CLINIC_PROFILE.safetyEthics.map((se, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#05110a] border border-[#234b3c] space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-serif-classic font-bold text-base text-[#f5f3ec]">
                  {se.title}
                </h4>
                <p className="text-xs text-[#a6b6ad] leading-relaxed">
                  {se.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO Traditional Medicine Alignment & MoPH Legal Statement */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* WHO Alignment */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-[#081810] border border-[#234b3c] space-y-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37] uppercase tracking-wider">
              <Globe className="w-4 h-4 text-[#d4af37]" />
              <span>WHO Traditional Medicine Frameworks</span>
            </div>

            <h3 className="font-serif-classic text-xl sm:text-2xl font-bold text-[#f5f3ec]">
              Alignment with WHO Vision for TCIM
            </h3>

            <p className="text-xs sm:text-sm text-[#a6b6ad] leading-relaxed">
              Safi Natural Care Clinic seeks alignment with the World Health Organization's vision for Traditional, Complementary, and Integrative Medicine by:
            </p>

            <ul className="space-y-3 pt-2">
              {CLINIC_PROFILE.whoAlignment.map((who, wIdx) => (
                <li key={wIdx} className="flex items-start gap-3 text-xs sm:text-sm text-[#d8e2dc]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{who}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal and MoPH Statement */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-gradient-to-br from-[#091a13] to-[#040c08] border border-[#d4af37]/40 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37] uppercase tracking-wider">
                <FileCheck className="w-4 h-4 text-[#d4af37]" />
                <span>Regulatory Compliance</span>
              </div>

              <h3 className="font-serif-classic text-xl sm:text-2xl font-bold text-[#f5f3ec]">
                Legal & Professional Statement
              </h3>

              <div className="p-4 rounded-xl bg-[#06120d] border border-[#1b3b2f] text-xs text-[#a6b6ad] leading-relaxed space-y-2">
                <p>{CLINIC_PROFILE.legalStatement}</p>
              </div>

              <div className="text-[11px] text-[#8da396] space-y-1">
                <p>• Complementary health service for outpatient conditions.</p>
                <p>• Transparent medical referral pathways for emergency care.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1b3b2f]">
              <a
                href={`tel:${CLINIC_PROFILE.phone}`}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Direct Desk: {CLINIC_PROFILE.formattedPhone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Scope of Clinical Services Full Table */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            Scope of Services
          </span>
          <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec] mt-1">
            Outpatient Non-Communicable & Functional Health Care
          </h2>
          <p className="text-xs sm:text-sm text-[#8da396] mt-2">
            Non-invasive therapeutic care protocols evaluated during individual consultations:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CLINIC_PROFILE.scopeOfServices.map((srv, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[#081810] border border-[#234b3c] flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <span className="px-2 py-0.5 rounded bg-[#0e2118] border border-[#234b3c] text-[10px] font-bold text-[#d4af37] uppercase">
                  {srv.category}
                </span>
                <h4 className="font-serif-classic font-bold text-base text-[#f5f3ec]">
                  {srv.title}
                </h4>
                <p className="text-xs text-[#a6b6ad] leading-relaxed">
                  {srv.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Public Health Initiatives & Knowledge Exchange */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#05110a] border border-[#234b3c] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                Collaborative Healthcare
              </span>
              <h3 className="font-serif-classic text-2xl font-bold text-[#f5f3ec] mt-1">
                Public Health-Oriented Initiatives & Knowledge Exchange
              </h3>
              <p className="text-xs sm:text-sm text-[#8da396] mt-1">
                The clinic is open to international academic and professional collaboration:
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#0e2118] border border-[#234b3c] flex items-center justify-center text-[#d4af37] shrink-0">
              <Share2 className="w-6 h-6" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#1b3b2f]">
            {CLINIC_PROFILE.publicHealthInitiatives.map((init, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#081810] border border-[#1b3b2f] flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-[#d8e2dc]">{init}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Official Institutional Profile & Presentation Archive */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20" id="official-dossier">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#081b12] to-[#040e09] border border-[#d4af37]/45 shadow-2xl space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#1b3b2f]">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e2118] border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Primary Clinical Documents</span>
              </div>
              <h2 className="font-serif-classic text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f5f3ec]">
                Official Institutional Dossier & Slides
              </h2>
              <p className="text-xs sm:text-sm text-[#8da396] leading-relaxed">
                Direct photographic records of Safi Natural Care Clinic's institutional governance, WHO TCIM alignment, clinical scope, and ethics charters from our official Kabul presentation.
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-[#05110a] p-1.5 rounded-xl border border-[#234b3c] self-start lg:self-auto shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#d4af37] text-black shadow-md'
                    : 'text-[#8da396] hover:text-[#f5f3ec]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Grid Dossier ({CLINIC_PRESENTATION_SLIDES.length})</span>
              </button>
              <button
                onClick={() => setViewMode('carousel')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'carousel'
                    ? 'bg-[#d4af37] text-black shadow-md'
                    : 'text-[#8da396] hover:text-[#f5f3ec]'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Presentation Projector</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All 12 Slides' },
              { id: 'Overview', label: 'Profile & Overview' },
              { id: 'Clinical Systems', label: 'Systems & Naturopathy' },
              { id: 'Governance', label: 'Vision & Mission' },
              { id: 'Philosophy', label: 'Faith & Healing' },
              { id: 'Services', label: 'Clinical Services' },
              { id: 'Ethics & QA', label: 'Safety & Ethics' },
              { id: 'WHO Alignment', label: 'WHO TCIM' },
              { id: 'Legal', label: 'Ministry of Health' },
              { id: 'Contact', label: 'Contact Desk' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedSlideCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedSlideCategory === cat.id
                    ? 'bg-[#0f3424] text-[#d4af37] border border-[#d4af37]/60 shadow-sm'
                    : 'bg-[#06140d] text-[#8da396] border border-[#1b3b2f] hover:text-[#f5f3ec] hover:border-[#234b3c]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Mode 1: Grid Mode */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSlides.map((slide, sIdx) => (
                <div
                  key={slide.id}
                  className="group rounded-2xl bg-[#06140d] border border-[#234b3c] hover:border-[#d4af37]/70 transition-all overflow-hidden flex flex-col justify-between shadow-lg"
                >
                  {/* Slide Image Container */}
                  <div className="relative aspect-[4/3] bg-black/90 overflow-hidden border-b border-[#1b3b2f]">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <button
                        onClick={() => setLightboxSlide(slide)}
                        className="w-full py-2 rounded-lg bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg hover:brightness-110 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Full Slide</span>
                      </button>
                    </div>
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 border border-[#234b3c] text-[10px] font-bold text-[#d4af37] uppercase">
                      Slide {String(sIdx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Slide Metadata */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8da396]">
                        {slide.category}
                      </span>
                      <h3 className="font-serif-classic font-bold text-base text-[#f5f3ec]">
                        {slide.title}
                      </h3>
                      <p className="text-xs text-[#a6b6ad] line-clamp-2 leading-relaxed">
                        {slide.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1b3b2f]/80 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {slide.highlights.slice(0, 2).map((h, hIdx) => (
                          <span
                            key={hIdx}
                            className="px-2 py-0.5 rounded bg-[#0a2016] text-[10px] text-[#8da396] border border-[#1b3b2f]"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => setLightboxSlide(slide)}
                        className="text-[#d4af37] hover:text-white p-1 rounded hover:bg-[#0e2118] transition-colors"
                        title="Zoom In"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Mode 2: Interactive Presentation Projector */
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-2xl bg-[#06140d] border border-[#234b3c] space-y-6">
                <div className="relative aspect-[16/10] sm:aspect-[16/9] max-h-[550px] w-full bg-black rounded-xl overflow-hidden border border-[#1b3b2f] flex items-center justify-center">
                  <img
                    src={CLINIC_PRESENTATION_SLIDES[activeSlideIndex].image}
                    alt={CLINIC_PRESENTATION_SLIDES[activeSlideIndex].title}
                    className="max-h-full max-w-full object-contain p-2"
                  />
                  <button
                    onClick={() => setLightboxSlide(CLINIC_PRESENTATION_SLIDES[activeSlideIndex])}
                    className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/80 border border-[#d4af37]/60 text-[#d4af37] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#d4af37] hover:text-black transition-all cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Expand High-Res</span>
                  </button>
                </div>

                {/* Projector Controls & Details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#1b3b2f]">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#d4af37]">
                      Slide {activeSlideIndex + 1} of {CLINIC_PRESENTATION_SLIDES.length} · {CLINIC_PRESENTATION_SLIDES[activeSlideIndex].category}
                    </span>
                    <h3 className="font-serif-classic font-bold text-lg sm:text-xl text-[#f5f3ec]">
                      {CLINIC_PRESENTATION_SLIDES[activeSlideIndex].title}
                    </h3>
                    <p className="text-xs text-[#a6b6ad] max-w-2xl mt-1 leading-relaxed">
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
                      className="p-2.5 rounded-xl bg-[#0a2016] border border-[#234b3c] hover:border-[#d4af37] text-[#f5f3ec] hover:text-[#d4af37] transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-mono text-xs text-[#8da396] px-2">
                      {String(activeSlideIndex + 1).padStart(2, '0')} / {String(CLINIC_PRESENTATION_SLIDES.length).padStart(2, '0')}
                    </span>
                    <button
                      onClick={() =>
                        setActiveSlideIndex((prev) =>
                          prev === CLINIC_PRESENTATION_SLIDES.length - 1 ? 0 : prev + 1
                        )
                      }
                      aria-label="Next slide"
                      className="p-2.5 rounded-xl bg-[#0a2016] border border-[#234b3c] hover:border-[#d4af37] text-[#f5f3ec] hover:text-[#d4af37] transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Thumbnails Bar */}
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 pt-2">
                  {CLINIC_PRESENTATION_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.id}
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`aspect-video rounded-lg overflow-hidden border transition-all cursor-pointer ${
                        activeSlideIndex === idx
                          ? 'border-[#d4af37] ring-2 ring-[#d4af37]/40 scale-105'
                          : 'border-[#1b3b2f] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Clinical Leadership & Practitioners */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            Clinical Leadership
          </span>
          <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec] mt-1">
            Our Clinical Practitioners & Specialists
          </h2>
          <p className="text-xs sm:text-sm text-[#8da396] mt-2">
            Providing patient-centered, compassionate traditional and complementary healthcare in Kabul.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PRACTITIONERS.slice(0, 2).map((p) => (
            <div
              key={p.id}
              className="p-6 rounded-3xl bg-[#081810] border border-[#234b3c] hover:border-[#d4af37]/60 transition-all flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#d4af37] bg-black shrink-0">
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-serif-classic font-bold text-lg text-[#f5f3ec]">
                    {p.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#d4af37]">{p.title}</p>
                  <p className="text-[11px] text-[#8da396]">{p.degrees}</p>
                  <div className="flex items-center gap-1 text-xs text-[#d4af37] mt-1">
                    <Star className="w-3.5 h-3.5 fill-[#d4af37]" />
                    <span>{p.rating} · {p.experienceYears} Years Clinical Experience</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#a6b6ad] leading-relaxed">
                {p.bio}
              </p>

              <div className="pt-3 border-t border-[#1b3b2f] flex items-center justify-between">
                <span className="text-[11px] text-[#8da396]">Kabul, Afghanistan</span>
                <button
                  onClick={onOpenBooking}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-semibold text-xs shadow-md hover:brightness-110"
                >
                  Book with {p.name.split(' ')[1] || 'Doctor'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#091a13] via-[#0f2e21] to-[#091a13] border border-[#d4af37]/50 text-center space-y-4">
          <h3 className="font-serif-classic text-2xl font-bold text-[#f5f3ec]">
            Consult With Our Clinical Team
          </h3>
          <p className="text-xs sm:text-sm text-[#a6b6ad] max-w-xl mx-auto">
            Book an outpatient consultation at Safi Natural Care Clinic in Kabul, or reach out to our team with your health history.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenBooking}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 cursor-pointer"
            >
              Book Clinical Consultation
            </button>
            <button
              onClick={onNavigateToContact}
              className="px-6 py-3 rounded-xl bg-[#081810] border border-[#234b3c] hover:border-[#d4af37] text-xs font-semibold text-[#f5f3ec] cursor-pointer"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
        >
          <div className="relative w-full max-w-5xl bg-[#06140d] border border-[#d4af37]/60 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 bg-[#030a06] border-b border-[#1b3b2f]">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-[#0a2016] border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold uppercase tracking-wider">
                  {lightboxSlide.category}
                </span>
                <div>
                  <h3 className="font-serif-classic font-bold text-base sm:text-lg text-[#f5f3ec]">
                    {lightboxSlide.title}
                  </h3>
                  <p className="text-[11px] text-[#8da396]">
                    Official Archival Record · Safi Natural Care Clinic (Kabul)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={lightboxSlide.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-[#0a2016] border border-[#234b3c] text-[#8da396] hover:text-[#d4af37] transition-colors"
                  title="Open Original Image in New Tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setLightboxSlide(null)}
                  className="p-2 rounded-xl bg-[#0a2016] border border-[#234b3c] text-[#8da396] hover:text-white transition-colors cursor-pointer"
                  title="Close Lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-black/60">
              <div className="max-h-[60vh] max-w-full flex items-center justify-center rounded-xl overflow-hidden border border-[#234b3c] bg-black">
                <img
                  src={lightboxSlide.image}
                  alt={lightboxSlide.title}
                  className="max-h-[60vh] max-w-full object-contain"
                />
              </div>

              {/* Slide Context & Transcript */}
              <div className="w-full mt-4 p-4 rounded-xl bg-[#081b12] border border-[#1b3b2f] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[#d4af37] font-semibold uppercase text-[10px] tracking-wider">
                    Official Slide Abstract:
                  </span>
                  <p className="text-[#d8e2dc]">{lightboxSlide.description}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  {lightboxSlide.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded bg-[#0a2016] border border-[#d4af37]/30 text-[#d4af37] text-[10px] font-medium"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#030a06] border-t border-[#1b3b2f] flex items-center justify-between text-xs text-[#8da396]">
              <span>Safi Natural Care Clinic · Herbal, Unani & Naturopathic Clinical Practice</span>
              <button
                onClick={() => setLightboxSlide(null)}
                className="px-4 py-1.5 rounded-lg bg-[#d4af37] text-black font-semibold text-xs hover:brightness-110 cursor-pointer"
              >
                Done Viewing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
