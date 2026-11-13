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

interface TreatmentsPageProps {
  onSelectServiceAndBook: (serviceId: string) => void;
  onOpenBooking: () => void;
}

export const TreatmentsPage: React.FC<TreatmentsPageProps> = ({
  onSelectServiceAndBook,
  onOpenBooking,
}) => {
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

  const treatmentFaqs = [
    {
      q: 'How does Unani-Tibb diagnosis differ from conventional allopathic testing?',
      a: 'Unani-Tibb evaluates the whole human system through constitutional temperament (Mizaj: Dam/Sanguine, Safra/Choleric, Balgham/Phlegmatic, Sawda/Melancholic), arterial pulse (Nabz), tongue, and metabolic digestion. Rather than solely treating symptoms, we identify humoral imbalances and support Tabiat (innate healing capacity) through botanicals, diet therapy, and regimenal care.',
    },
    {
      q: 'What systems of medicine are practiced at Safi Natural Care Clinic?',
      a: 'We practice three complementary systems in Kabul: Herbal Medicine (Phytotherapy), Unani Medicine (Mizaj temperament assessment & diet therapy), and Naturopathy (lifestyle & nutrition counseling), alongside non-invasive supportive traditional acupuncture.',
    },
    {
      q: 'Can I take Safi herbal formulations alongside my prescription medications?',
      a: 'Yes, with clinical oversight. During your initial consultation, Dr. Hafizullah Safi and our clinical care team review your current prescriptions and health history to prevent adverse herb-drug interactions and time remedies safely.',
    },
    {
      q: 'Do you take appointments or walk-in patients?',
      a: `${CLINIC_PROFILE.hoursPolicy}. Scheduled consultations are seen first at ${CLINIC_PROFILE.clinicAddress}, followed by walk-in outpatient triage as slots permit.`,
    },
    {
      q: 'Are your botanical preparations lab-tested and safely sourced?',
      a: 'Yes. Every botanical preparation at Safi Natural Care is compounded using verified medicinal plants, free of toxic, endangered, or adulterated substances, and checked for potency and hygienic storage.',
    },
  ];

  return (
    <div className="pt-24 lg:pt-32 pb-20 min-h-screen bg-[#EBF1EC] text-[#12261A] selection:bg-[#1F4A32] selection:text-[#F9FBF9]">
      {/* Editorial Header */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3E634D]">
            {CLINIC_PROFILE.name} · {CLINIC_PROFILE.clinicAddress}
          </p>

          <h1 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12261A] leading-tight">
            Outpatient Traditional & Integrative Clinical Care
          </h1>

          <p className="text-sm sm:text-base text-[#485E50] leading-relaxed">
            Every consultation is tailored to your constitutional temperament (Mizaj), combining Unani-Tibb, Phytotherapy, Naturopathy, and non-invasive supportive care.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#3E634D] font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#1F4A32]" />
              MoPH Compliant TCIM Practice
            </span>
            <span className="text-[#B8C7BC]">·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#1F4A32]" />
              {CLINIC_PROFILE.hoursPolicy}
            </span>
          </div>
        </div>
      </section>

      {/* 3 Systems of Medicine (Monogram Strip) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CLINIC_PROFILE.systemsOfMedicine.map((sys) => (
            <div
              key={sys.code}
              className="p-6 sm:p-7 rounded-2xl bg-[#F9FBF9] border border-[#DDE6DF] shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#EBF1EC] pb-3">
                  <span className="font-serif-classic text-2xl font-bold text-[#1F4A32]">
                    {sys.code}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6F5A36]">
                    {sys.tagline}
                  </span>
                </div>
                <h2 className="font-serif-classic text-xl font-bold text-[#12261A]">
                  {sys.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#485E50] leading-relaxed">
                  {sys.description}
                </p>
              </div>
              <ul className="space-y-1.5 pt-2 border-t border-[#EBF1EC]">
                {sys.principles.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#3E634D]">
                    <span className="text-[#1F4A32] font-bold">·</span>
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
        <div className="p-7 sm:p-10 rounded-3xl bg-[#F9FBF9] border border-[#DDE6DF] shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-[#EBF1EC] pb-6">
            <div className="max-w-2xl">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#6F5A36] font-semibold">
                Scope of Practice
              </span>
              <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#12261A] mt-1">
                8 Outpatient Clinical Services
              </h2>
              <p className="text-xs sm:text-sm text-[#485E50] mt-2">
                Non-invasive, supportive, and preventive care for chronic and functional conditions.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#1F4A32] shrink-0">
              Main Airport Road, Charahi Shaheed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CLINIC_PROFILE.scopeOfServices.map((srv, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#EBF1EC]/70 border border-[#D4E0D7] flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif-classic font-bold text-base text-[#1F4A32]">
                      {srv.code}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6F5A36]">
                      {srv.category}
                    </span>
                  </div>
                  <h3 className="font-serif-classic font-bold text-sm text-[#12261A] leading-snug">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-[#485E50] leading-relaxed">
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
        <div className="p-7 sm:p-10 rounded-3xl bg-[#F9FBF9] border border-[#DDE6DF] shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#6F5A36] font-semibold">
              Constitutional Evaluation
            </span>
            <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#12261A] mt-1">
              4 Diagnostic Pillars
            </h2>
            <p className="text-xs sm:text-sm text-[#485E50] mt-2">
              Every patient assessment follows structured diagnostic observation before compounding or prescribing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-xl bg-[#EBF1EC]/70 border border-[#D4E0D7]">
              <div className="w-10 h-10 rounded-lg bg-[#1F4A32] text-[#F9FBF9] flex items-center justify-center mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-serif-classic font-bold text-base text-[#12261A] mb-1">
                1. Nabz (Pulse)
              </h3>
              <p className="text-[11px] text-[#6F5A36] font-semibold uppercase tracking-wider mb-2">
                Hemodynamic Vitality
              </p>
              <p className="text-xs text-[#485E50] leading-relaxed">
                Evaluating radial pulse parameters to assess organ vitality, metabolic heat, and vascular balance.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#EBF1EC]/70 border border-[#D4E0D7]">
              <div className="w-10 h-10 rounded-lg bg-[#1F4A32] text-[#F9FBF9] flex items-center justify-center mb-4">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-serif-classic font-bold text-base text-[#12261A] mb-1">
                2. Mizaj (Temperament)
              </h3>
              <p className="text-[11px] text-[#6F5A36] font-semibold uppercase tracking-wider mb-2">
                Humoral Equilibrium
              </p>
              <p className="text-xs text-[#485E50] leading-relaxed">
                Determining your profile across Blood, Yellow Bile, Phlegm, and Black Bile to guide diet and herbs.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#EBF1EC]/70 border border-[#D4E0D7]">
              <div className="w-10 h-10 rounded-lg bg-[#1F4A32] text-[#F9FBF9] flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-serif-classic font-bold text-base text-[#12261A] mb-1">
                3. Lisan (Tongue Review)
              </h3>
              <p className="text-[11px] text-[#6F5A36] font-semibold uppercase tracking-wider mb-2">
                Digestive Mapping
              </p>
              <p className="text-xs text-[#485E50] leading-relaxed">
                Visual observation of coating, moisture, and color to identify digestive stagnation and heat.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#EBF1EC]/70 border border-[#D4E0D7]">
              <div className="w-10 h-10 rounded-lg bg-[#1F4A32] text-[#F9FBF9] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif-classic font-bold text-base text-[#12261A] mb-1">
                4. Herb-Drug Audit
              </h3>
              <p className="text-[11px] text-[#6F5A36] font-semibold uppercase tracking-wider mb-2">
                Clinical Safety Screen
              </p>
              <p className="text-xs text-[#485E50] leading-relaxed">
                Cross-checking herbal formulations against conventional medications for safe complementary care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Protocols Directory */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#6F5A36] font-semibold">
              In-Clinic & Telehealth Protocols
            </span>
            <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#12261A] mt-1">
              Bookable Consultation Programs
            </h2>
            <p className="text-sm text-[#485E50] mt-1">
              Inspect what each consultation includes and reserve your slot directly.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1F4A32] text-[#F9FBF9] shadow-sm'
                    : 'bg-[#F9FBF9] text-[#485E50] hover:text-[#12261A] border border-[#DDE6DF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {filteredServices.map((service) => {
            const isExpanded = expandedTreatmentId === service.id;

            return (
              <div
                key={service.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-[#F9FBF9] ${
                  isExpanded
                    ? 'border-[#1F4A32] shadow-md'
                    : 'border-[#DDE6DF] hover:border-[#A7BDB0]'
                }`}
              >
                <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded bg-[#EBF1EC] border border-[#DDE6DF] text-[11px] font-semibold text-[#1F4A32] uppercase tracking-wider">
                        {service.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-[#485E50]">
                        <Clock className="w-3.5 h-3.5 text-[#1F4A32]" />
                        <span>{service.duration}</span>
                      </div>
                    </div>

                    <h3 className="font-serif-classic text-xl sm:text-2xl font-bold text-[#12261A]">
                      {service.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#485E50] leading-relaxed max-w-3xl">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-[#EBF1EC]">
                    <div className="text-left lg:text-right">
                      <span className="text-[11px] text-[#485E50] block uppercase tracking-wider">
                        Consultation Fee
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-[#12261A] font-serif-classic tabular-nums">
                          ${service.price}
                        </span>
                        <span className="text-xs text-[#485E50]">USD</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedTreatmentId(isExpanded ? null : service.id)}
                        className="px-3.5 py-2 rounded-lg bg-[#EBF1EC] border border-[#D4E0D7] hover:border-[#1F4A32] text-xs font-semibold text-[#12261A] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide Details' : 'Protocol Dossier'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => onSelectServiceAndBook(service.id)}
                        className="px-4 py-2 rounded-lg bg-[#1F4A32] hover:bg-[#173926] text-[#F9FBF9] font-semibold text-xs tracking-wide transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Visit</span>
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 pt-3 border-t border-[#EBF1EC] bg-[#F3F7F4]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-3">
                      <div className="space-y-3 p-4 rounded-xl bg-[#F9FBF9] border border-[#DDE6DF]">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-[#1F4A32] flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#1F4A32]" />
                          What This Visit Includes
                        </h4>
                        <ul className="space-y-2">
                          {service.treatmentIncludes.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-[#2B4234]">
                              <span className="text-[#1F4A32] font-bold">·</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3 p-4 rounded-xl bg-[#F9FBF9] border border-[#DDE6DF]">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-[#1F4A32] flex items-center gap-2">
                          <Heart className="w-4 h-4 text-[#1F4A32]" />
                          Primary Clinical Indications
                        </h4>
                        <ul className="space-y-2">
                          {service.suitableFor.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-[#2B4234]">
                              <span className="text-[#1F4A32] font-bold">·</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3 p-4 rounded-xl bg-[#F9FBF9] border border-[#DDE6DF]">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-[#1F4A32] flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#1F4A32]" />
                          Patient Preparation
                        </h4>
                        <div className="space-y-2 text-xs text-[#485E50] leading-relaxed">
                          <p>· Avoid heavy caffeine or food 2 hours before pulse assessment.</p>
                          <p>· Bring recent lab panels and current prescription names.</p>
                          <p>· {CLINIC_PROFILE.hoursPolicy}.</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-[#DDE6DF] flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs text-[#3E634D]">
                        <Leaf className="w-4 h-4 text-[#1F4A32]" />
                        <span>Direct remedy dispensing available at our on-site Kabul apothecary.</span>
                      </div>
                      <button
                        onClick={() => onSelectServiceAndBook(service.id)}
                        className="px-5 py-2.5 rounded-lg bg-[#1F4A32] hover:bg-[#173926] text-[#F9FBF9] font-semibold text-xs tracking-wide transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <span>Schedule {service.title}</span>
                        <ArrowRight className="w-4 h-4" />
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
        <div className="p-8 rounded-2xl bg-[#12261A] text-[#F9FBF9] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#B9D2C1] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Patient Safety & Sterile Clinical Standards
            </div>
            <h3 className="font-serif-classic text-2xl font-bold">
              Non-Invasive, Honest Outpatient Care in Kabul
            </h3>
            <p className="text-xs sm:text-sm text-[#D1E0D6] leading-relaxed">
              {CLINIC_PROFILE.hoursPolicy} at {CLINIC_PROFILE.clinicAddress}. Single-use sterile equipment and verified botanical formulations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#F9FBF9] text-[#12261A] font-bold text-xs uppercase tracking-wider hover:bg-[#EBF1EC] transition-all cursor-pointer"
            >
              Book Consultation
            </button>
            <a
              href={`tel:${CLINIC_PROFILE.phone}`}
              className="w-full sm:w-auto px-5 py-3 rounded-lg border border-[#4D6E59] hover:border-[#F9FBF9] text-xs font-semibold text-[#F9FBF9] flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{CLINIC_PROFILE.formattedPhone}</span>
            </a>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#6F5A36] font-semibold">
            Patient Information
          </span>
          <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#12261A] mt-1">
            Common Clinical Questions
          </h2>
        </div>

        <div className="space-y-3">
          {treatmentFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#DDE6DF] bg-[#F9FBF9] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-serif-classic font-semibold text-sm sm:text-base text-[#12261A]">
                    {faq.q}
                  </span>
                  <span className="p-1.5 rounded-md bg-[#EBF1EC] text-[#1F4A32] shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-[#485E50] leading-relaxed border-t border-[#EBF1EC]">
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
