import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Activity,
  Heart,
  Droplets,
  Layers,
  Leaf,
  ArrowRight,
  Flame,
  Wind,
  Phone,
} from 'lucide-react';
import { CONSULTATION_SERVICES, PRACTITIONERS } from '../data/clinicData';
import { ConsultationService } from '../types/clinic';

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
      a: 'Unani-Tibb evaluates the whole human system through constitutional temperament (Mizaj: Dam/Sanguine, Safra/Choleric, Balgham/Phlegmatic, Sawda/Melancholic), arterial pulse (Nabz), tongue, and metabolic digestion. Rather than solely treating symptoms, we identify humoral imbalances and restore the body\'s innate healing force (Physis/Tabiat) through targeted botanicals, clinical nutrition, and regimenal therapies.',
    },
    {
      q: 'Does Hijama (Wet Cupping) hurt and is it sterile?',
      a: 'Hijama is gentle and causes minimal sensation—most patients describe it as a light stretching or warm suction followed by immediate relief from chronic tension and brain fog. At Safi Herbal Clinic, patient safety is paramount: we strictly use 100% single-use surgical vacuum cups, individually sealed lancets, medical antiseptics, and organic black seed post-care oil. Everything is clinical grade and sterile.',
    },
    {
      q: 'Can I take Safi herbal remedies alongside my conventional prescription medications?',
      a: 'Yes, with proper clinical oversight. During your initial consultation, our pharmacognosists and clinical herbalists review your full medication list, checking for cytochrome P450 pathway interactions, blood pressure synergies, and metabolic timing. We ensure botanical formulations work safely and synergistically without adverse contraindications.',
    },
    {
      q: 'How many treatment sessions will I need?',
      a: 'Acute conditions (such as acute tension migraines or minor digestive spasms) often see marked improvement within 1 to 2 sessions. Deep-seated chronic conditions (such as rheumatoid arthritis, long-standing psoriasis, or hormonal dysregulation) typically follow a 3-month botanical restoration cycle with bi-weekly or monthly progress reviews.',
    },
    {
      q: 'Are your botanical medicines prepared on-site?',
      a: 'Yes. Safi Herbal Clinic houses a specialized botanical laboratory and dispensary. We formulate slow-macerated spagyric tinctures, cold-pressed raw elixirs, organic beeswax balms, and customized loose-leaf tisanes using verified organic and wildcrafted herbs tested for purity and potency.',
    },
  ];

  return (
    <div className="pt-24 lg:pt-32 pb-20 min-h-screen bg-[#021a17] text-[#f5f3ec] relative selection:bg-[#2dd4bf] selection:text-black">
      {/* Page Ambient Classical Jade Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-teal-500/25 via-emerald-800/15 to-transparent blur-[150px] pointer-events-none -z-10" />

      {/* Hero Header */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d9b25f]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#0f382a]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a1e15] border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold uppercase tracking-widest shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clinical Treatments & Therapies</span>
          </div>

          <h1 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f5f3ec] leading-tight">
            Holistic Healing Rooted in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa8222]">
              Classical Unani-Tibb
            </span>{' '}
            & Botanical Science
          </h1>

          <p className="text-sm sm:text-base text-[#a6b6ad] leading-relaxed">
            Every therapy at Safi Herbal Clinic is custom tailored to your unique constitutional temperament (Mizaj).
            Our master practitioners unite centuries-old humoral medicine with rigorous phytochemical pharmacology.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-[#8da396]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              Licensed Practitioners
            </span>
            <span className="text-[#234b3c]">·</span>
            <span className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-[#d4af37]" />
              100% Sterile Single-Use Clinical Protocols
            </span>
            <span className="text-[#234b3c]">·</span>
            <span className="flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-[#d4af37]" />
              In-House Custom Formulations
            </span>
          </div>
        </div>
      </section>

      {/* The 4 Diagnostic Pillars */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-[#081710] to-[#040c08] border border-[#d4af37]/30 shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec]">
              The 4 Diagnostic Pillars of Safi Clinic
            </h2>
            <p className="text-xs sm:text-sm text-[#8da396] mt-2">
              Before prescribing a single drop of botanical extract, our physicians conduct a comprehensive constitutional diagnosis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-[#0e2118] border border-[#234b3c] hover:border-[#d4af37]/60 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-serif-classic font-bold text-base text-[#f5f3ec] mb-1">
                1. Nabz (Arterial Pulse)
              </h3>
              <p className="text-xs text-[#d4af37] font-medium mb-2">Hemodynamic Vitality</p>
              <p className="text-xs text-[#a6b6ad] leading-relaxed">
                Evaluating the 10 parameters of the radial pulse to assess organ elasticity, metabolic heat, arterial tension, and systemic stamina.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0e2118] border border-[#234b3c] hover:border-[#d4af37]/60 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mb-4">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-serif-classic font-bold text-base text-[#f5f3ec] mb-1">
                2. Mizaj (Temperament)
              </h3>
              <p className="text-xs text-[#d4af37] font-medium mb-2">Humoral Equilibrium</p>
              <p className="text-xs text-[#a6b6ad] leading-relaxed">
                Determining your balance across the 4 primary humors (Blood, Yellow Bile, Phlegm, Black Bile) to personalize diet, herbs, and therapies.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0e2118] border border-[#234b3c] hover:border-[#d4af37]/60 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-serif-classic font-bold text-base text-[#f5f3ec] mb-1">
                3. Lisan (Tongue & Iris)
              </h3>
              <p className="text-xs text-[#d4af37] font-medium mb-2">Mucosal & Digestive Mapping</p>
              <p className="text-xs text-[#a6b6ad] leading-relaxed">
                Direct visual examination of the tongue coating, papillae, color, and iris patterns to detect gut stagnation, liver congestion, and inflammation.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0e2118] border border-[#234b3c] hover:border-[#d4af37]/60 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif-classic font-bold text-base text-[#f5f3ec] mb-1">
                4. Herb-Drug Safety Audit
              </h3>
              <p className="text-xs text-[#d4af37] font-medium mb-2">Pharmacokinetic Review</p>
              <p className="text-xs text-[#a6b6ad] leading-relaxed">
                Screening all proposed herbal extracts against your existing conventional prescriptions to ensure zero adverse interactions and maximum safety.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scope of Clinical Services (Slide 10) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="p-8 sm:p-10 rounded-2xl bg-[#081810] border border-[#234b3c] shadow-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                Clinical Focus Areas (Slide 10)
              </span>
              <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec] mt-1">
                Scope of Outpatient Clinical Services
              </h2>
              <p className="text-xs sm:text-sm text-[#8da396] mt-2">
                Safi Natural Care Clinic provides outpatient care primarily for non-communicable and functional health conditions, emphasizing non-invasive, preventive, and supportive clinical care.
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-[#0a1e15] border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold shrink-0">
              Kabul Outpatient Practice
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-[#0e2118] border border-[#1b3b2f] hover:border-[#d4af37]/60 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-lg bg-[#d4af37]/15 text-[#d4af37] font-bold text-xs flex items-center justify-center">
                  01
                </span>
                <h3 className="font-serif-classic font-bold text-sm text-[#f5f3ec]">
                  Digestive & Metabolic Conditions
                </h3>
              </div>
              <p className="text-xs text-[#a6b6ad] leading-relaxed">
                Dyspepsia, IBS, acid reflux, hepatic congestion, fatty liver support, metabolic sluggishness, and gut microbiome optimization through customized bitter herbs.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0e2118] border border-[#1b3b2f] hover:border-[#d4af37]/60 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-lg bg-[#d4af37]/15 text-[#d4af37] font-bold text-xs flex items-center justify-center">
                  02
                </span>
                <h3 className="font-serif-classic font-bold text-sm text-[#f5f3ec]">
                  Musculoskeletal & Joint Discomfort
                </h3>
              </div>
              <p className="text-xs text-[#a6b6ad] leading-relaxed">
                Osteoarthritis support, lumbar stiffness, cervical spondylosis, rheumatoid inflammation, and localized analgesic herbal compress therapies.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0e2118] border border-[#1b3b2f] hover:border-[#d4af37]/60 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-lg bg-[#d4af37]/15 text-[#d4af37] font-bold text-xs flex items-center justify-center">
                  03
                </span>
                <h3 className="font-serif-classic font-bold text-sm text-[#f5f3ec]">
                  Chronic Stress & Lifestyle Conditions
                </h3>
              </div>
              <p className="text-xs text-[#a6b6ad] leading-relaxed">
                Nervous exhaustion, insomnia, adrenal fatigue, psychosomatic tension, and vitality depletion via adaptogenic herbal formulations and calming regimenal oils.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0e2118] border border-[#1b3b2f] hover:border-[#d4af37]/60 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-lg bg-[#d4af37]/15 text-[#d4af37] font-bold text-xs flex items-center justify-center">
                  04
                </span>
                <h3 className="font-serif-classic font-bold text-sm text-[#f5f3ec]">
                  Hormonal & Reproductive Health Support
                </h3>
              </div>
              <p className="text-xs text-[#a6b6ad] leading-relaxed">
                PCOS management, menstrual irregularities, menopausal transitions, male hormonal vitality, and constitutional reproductive toning.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0e2118] border border-[#1b3b2f] hover:border-[#d4af37]/60 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-lg bg-[#d4af37]/15 text-[#d4af37] font-bold text-xs flex items-center justify-center">
                  05
                </span>
                <h3 className="font-serif-classic font-bold text-sm text-[#f5f3ec]">
                  Respiratory & Urological Supportive Care
                </h3>
              </div>
              <p className="text-xs text-[#a6b6ad] leading-relaxed">
                Chronic bronchitis, allergic rhinitis, asthma supportive botanicals, recurrent UTI relief, and benign prostatic constitutional maintenance.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0e2118] border border-[#1b3b2f] hover:border-[#d4af37]/60 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-lg bg-[#d4af37]/15 text-[#d4af37] font-bold text-xs flex items-center justify-center">
                  06
                </span>
                <h3 className="font-serif-classic font-bold text-sm text-[#f5f3ec]">
                  Skin & Hair Health (Therapeutic Care)
                </h3>
              </div>
              <p className="text-xs text-[#a6b6ad] leading-relaxed">
                Eczema, psoriasis, non-cosmetic therapeutic skin care, hair thinning caused by humoral dysregulation, and blood-purifying botanical infusions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Treatments Directory */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec]">
              Explore Our Clinical Offerings
            </h2>
            <p className="text-sm text-[#8da396] mt-1">
              Select any therapy below to review the clinical roadmap, protocols, and book your session.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#d4af37] text-black shadow-md'
                    : 'bg-[#0d2117] text-[#a6b6ad] hover:text-[#f5f3ec] border border-[#1b3b2f]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Treatments List */}
        <div className="space-y-6">
          {filteredServices.map((service) => {
            const isExpanded = expandedTreatmentId === service.id;

            return (
              <div
                key={service.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? 'bg-[#091b13] border-[#d4af37]/60 shadow-xl shadow-black/50'
                    : 'bg-[#07150f] border-[#1b3b2f]/60 hover:border-[#234b3c]'
                }`}
              >
                {/* Header Row */}
                <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-2.5 py-1 rounded bg-[#0e2118] border border-[#234b3c] text-[11px] font-semibold text-[#d4af37] uppercase tracking-wider">
                        {service.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-[#8da396]">
                        <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{service.duration}</span>
                      </div>
                    </div>

                    <h3 className="font-serif-classic text-xl sm:text-2xl font-bold text-[#f5f3ec]">
                      {service.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#a6b6ad] leading-relaxed max-w-3xl">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-[#1b3b2f]">
                    <div className="text-left lg:text-right">
                      <span className="text-[11px] text-[#8da396] block uppercase tracking-wider">Consultation Fee</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-[#d4af37] font-serif-classic">${service.price}</span>
                        <span className="text-xs text-[#8da396]">USD</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedTreatmentId(isExpanded ? null : service.id)}
                        className="px-3 py-2 rounded-lg bg-[#0e2118] border border-[#234b3c] hover:border-[#d4af37] text-xs text-[#d8e2dc] hover:text-[#f5f3ec] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? 'Less Details' : 'Protocol Dossier'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => onSelectServiceAndBook(service.id)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-semibold text-xs tracking-wide shadow-md hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Visit</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Dossier Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-[#1b3b2f]/60 bg-[#05110a]/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                      {/* What It Includes */}
                      <div className="space-y-3 p-4 rounded-xl bg-[#081810] border border-[#1b3b2f]">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-[#d4af37] flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                          What This Visit Includes
                        </h4>
                        <ul className="space-y-2">
                          {service.treatmentIncludes.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-[#d8e2dc]">
                              <span className="text-[#d4af37] mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Suitable For */}
                      <div className="space-y-3 p-4 rounded-xl bg-[#081810] border border-[#1b3b2f]">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-[#d4af37] flex items-center gap-2">
                          <Heart className="w-4 h-4 text-[#d4af37]" />
                          Primary Clinical Indications
                        </h4>
                        <ul className="space-y-2">
                          {service.suitableFor.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-[#d8e2dc]">
                              <span className="text-[#d4af37] mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Preparation & Instructions */}
                      <div className="space-y-3 p-4 rounded-xl bg-[#081810] border border-[#1b3b2f]">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-[#d4af37] flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                          Patient Preparation Guidelines
                        </h4>
                        <div className="space-y-2 text-xs text-[#a6b6ad] leading-relaxed">
                          <p>
                            • Avoid heavy caffeine or food 2 hours prior to allow accurate pulse reading.
                          </p>
                          <p>
                            • Please bring any recent bloodwork panels and current prescription medications.
                          </p>
                          <p>
                            • Wear loose, comfortable clothing for physical and pulse examinations.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-[#1b3b2f] flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs text-[#8da396]">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Direct prescription dispensing available at our clinic apothecary.</span>
                      </div>
                      <button
                        onClick={() => onSelectServiceAndBook(service.id)}
                        className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs tracking-wide shadow-lg hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer"
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

      {/* The 4-Step Patient Journey */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            Clinical Workflow
          </span>
          <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec] mt-1">
            Your Healing Journey at Safi Clinic
          </h2>
          <p className="text-xs sm:text-sm text-[#8da396] mt-2">
            A structured, compassionate framework designed to restore balance from the roots up.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="p-6 rounded-xl bg-[#081810] border border-[#234b3c] relative">
            <span className="font-serif-classic text-3xl font-bold text-[#d4af37]/30 absolute top-4 right-4">01</span>
            <div className="w-10 h-10 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-serif-classic font-bold text-base text-[#f5f3ec] mb-2">
              Intake & Diagnostic
            </h3>
            <p className="text-xs text-[#a6b6ad] leading-relaxed">
              Pulse, tongue, and constitutional evaluation alongside clinical history analysis to understand root pathology.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#081810] border border-[#234b3c] relative">
            <span className="font-serif-classic text-3xl font-bold text-[#d4af37]/30 absolute top-4 right-4">02</span>
            <div className="w-10 h-10 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mb-4">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-serif-classic font-bold text-base text-[#f5f3ec] mb-2">
              Custom Formulation
            </h3>
            <p className="text-xs text-[#a6b6ad] leading-relaxed">
              Our apothecary compounds your personal tincture, botanical balm, and synergistic herbal tea blend on-site.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#081810] border border-[#234b3c] relative">
            <span className="font-serif-classic text-3xl font-bold text-[#d4af37]/30 absolute top-4 right-4">03</span>
            <div className="w-10 h-10 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-serif-classic font-bold text-base text-[#f5f3ec] mb-2">
              Lifestyle & Dietary Diet
            </h3>
            <p className="text-xs text-[#a6b6ad] leading-relaxed">
              Specific food synergies, herbal decoctions, and thermal therapies aligned with your bodily temperament.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#081810] border border-[#234b3c] relative">
            <span className="font-serif-classic text-3xl font-bold text-[#d4af37]/30 absolute top-4 right-4">04</span>
            <div className="w-10 h-10 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mb-4">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif-classic font-bold text-base text-[#f5f3ec] mb-2">
              Follow-Up & Refinements
            </h3>
            <p className="text-xs text-[#a6b6ad] leading-relaxed">
              Regular reviews to calibrate botanical dosages as vitality strengthens, ensuring long-term sustained health.
            </p>
          </div>
        </div>
      </section>

      {/* Clinical Hygiene & Safety Guarantee */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="p-8 sm:p-10 rounded-2xl bg-[#040d08] border border-[#d4af37]/40 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#d4af37] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              Medical Safety Guarantee
            </div>
            <h3 className="font-serif-classic text-2xl font-bold text-[#f5f3ec]">
              Zero-Compromise Clinical Sterilization & Botanical Quality
            </h3>
            <p className="text-xs sm:text-sm text-[#a6b6ad] leading-relaxed">
              Every procedure room adheres to hospital-grade sterilization protocols. All Hijama cups, micro-needling lancets, and skin applicators are 100% single-use and disposed of in medical sharps bio-waste. All herbs are certified heavy-metal free (ICP-MS tested) with verified botanical authenticity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer"
            >
              Book Consultation Now
            </button>
            <a
              href="tel:+93780299299"
              className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[#0e2118] border border-[#234b3c] hover:border-[#d4af37] text-xs font-semibold text-[#f5f3ec] flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Call Reception: +93 780 299 299</span>
            </a>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d4af37] uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-[#d4af37]" />
            Frequently Asked Questions
          </div>
          <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec] mt-1">
            Questions About Our Treatments
          </h2>
        </div>

        <div className="space-y-4">
          {treatmentFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-xl border border-[#1b3b2f] bg-[#07150f] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-serif-classic font-semibold text-sm sm:text-base text-[#f5f3ec]">
                    {faq.q}
                  </span>
                  <div className="p-1 rounded-md bg-[#0e2118] border border-[#234b3c] text-[#d4af37] shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#a6b6ad] leading-relaxed border-t border-[#1b3b2f]/50 bg-[#040b07]/40">
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
