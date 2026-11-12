import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Heart,
  ShieldCheck,
  CheckCircle,
  Star,
  Quote,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PRACTITIONERS, CLINIC_STATS, TESTIMONIALS } from '../data/clinicData';

export const ClinicProfile: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What should I expect during my initial herbal consultation?',
      a: 'Your consultation begins with a comprehensive diagnostic evaluation: an in-depth review of your medical history, pulse quality, tongue characteristics, and an assessment of your constitutional temperament (Mizaj). Based on this, your practitioner formulates a bespoke herbal treatment protocol.',
    },
    {
      q: 'Can herbal formulations be taken alongside conventional medications?',
      a: 'Yes, when properly audited. Our pharmacognosist Tariq Mansoor conducts a strict Herb-Drug Interaction Audit for every patient to guarantee no adverse pharmacokinetic or cytochrome P450 enzyme interactions with your pharmaceuticals.',
    },
    {
      q: 'How are your herbal medicines and tinctures sourced?',
      a: 'All our botanicals are either wildcrafted from pristine mountain habitats or sourced directly from certified organic family growers. They undergo independent HPLC laboratory testing to ensure zero heavy metals, pesticide residues, or artificial adulterants.',
    },
    {
      q: 'Do you offer international shipping and remote consultations?',
      a: 'Yes. We offer secure Telehealth video consultations to patients globally. Formulations prescribed during telehealth visits are compounded and shipped worldwide with express temperature-controlled courier services.',
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#05110a] relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* About Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d2319] border border-[#c5a059]/40 text-[#f5e6c8] text-xs font-semibold tracking-wider uppercase mb-3">
            <Award className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>The Heritage of Botanical Healing</span>
          </div>
          <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f5f3ec]">
            The Philosophy of Safi Herbal Clinic
          </h2>
          <p className="mt-3 text-base text-[#a6b6ad] leading-relaxed">
            Where classical Unani-Tibb wisdom converges with modern clinical phytotherapy to awaken the body’s innate regenerative power.
          </p>
        </div>

        {/* Story & Philosophy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20">
          <div className="lg:col-span-6 space-y-5 text-left">
            <h3 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec]">
              True Healing Addresses the Whole Human Being, Not Just the Symptom
            </h3>
            <p className="text-sm text-[#b8c9bf] leading-relaxed">
              Founded in 1998 by Hakim Safiullah Safi, our clinic was created on a single unwavering conviction: nature has provided within the botanical kingdom an antidote and restorative compound for every imbalance known to humanity.
            </p>
            <p className="text-sm text-[#b8c9bf] leading-relaxed">
              While conventional symptom-suppressive pharmaceuticals have their place in acute trauma, chronic diseases require restorative cellular nourishment. By identifying a patient’s constitutional Mizaj (temperament) and analyzing the enteric-nervous axis, we eliminate toxic stagnation, rekindle metabolic fire, and restore harmony.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#1b3b2f]">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#f5f3ec]">Licensed Dispensary</h4>
                  <p className="text-[11px] text-[#8da396]">
                    ISO-accredited cleanroom compounding facility
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#f5f3ec]">Spagyric Extractions</h4>
                  <p className="text-[11px] text-[#8da396]">
                    Full mineral ash and organic alcohol-free tinctures
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative p-1.5 rounded-2xl bg-gradient-to-tr from-[#d4af37]/60 via-[#1b3b2f] to-[#0a1811] shadow-2xl">
              <div className="rounded-[14px] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=800&q=80"
                  alt="Herbal apothecary compounding mortars, raw botanicals and amber tincture jars"
                  className="w-full h-80 sm:h-96 object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#081810] border border-[#1b3b2f] mb-20 shadow-xl">
          {CLINIC_STATS.map((stat, i) => (
            <div key={i} className="text-center p-3">
              <span className="font-serif-classic text-3xl sm:text-4xl font-bold text-[#d4af37] block">
                {stat.value}
              </span>
              <span className="text-xs text-[#a6b6ad] mt-1 block">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Meet the Clinicians */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec]">
              Meet Our Master Herbalists
            </h3>
            <p className="text-xs sm:text-sm text-[#8da396] mt-2">
              Decades of rigorous botanical study, clinical practice, and compassionate care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRACTITIONERS.map((prac) => (
              <div
                key={prac.id}
                className="rounded-2xl bg-[#081810] border border-[#1b3b2f] hover:border-[#d4af37]/60 transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#d4af37] mx-auto mb-4">
                    <img
                      src={prac.imageUrl}
                      alt={prac.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-serif-classic font-bold text-base text-[#f5f3ec] text-center">
                    {prac.name}
                  </h4>
                  <p className="text-xs text-[#d4af37] text-center font-medium mt-0.5">
                    {prac.title}
                  </p>
                  <p className="text-[11px] text-[#8da396] text-center mt-1">
                    {prac.degrees}
                  </p>
                  <p className="text-xs text-[#b8c9bf] mt-3 line-clamp-3 leading-relaxed">
                    {prac.bio}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1b3b2f] flex items-center justify-between text-xs">
                  <span className="text-[#d4af37] font-bold">★ {prac.rating}</span>
                  <span className="text-[#8da396]">{prac.experienceYears} Years Exp.</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Testimonials */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs text-[#d4af37] font-semibold uppercase tracking-wider block mb-1">
              Verified Patient Recovery Stories
            </span>
            <h3 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec]">
              Words from Those Restored
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-2xl bg-[#081810] border border-[#1b3b2f] hover:border-[#c5a059]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <Quote className="w-8 h-8 text-[#d4af37]/40 mb-3" />
                  <div className="flex items-center gap-1 text-[#d4af37] mb-2">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#c9dad0] italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1b3b2f]">
                  <p className="font-serif-classic font-bold text-sm text-[#f5f3ec]">
                    {t.patientName}
                  </p>
                  <p className="text-[11px] text-[#d4af37]">{t.condition}</p>
                  <p className="text-[10px] text-[#8da396]">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="font-serif-classic text-2xl font-bold text-[#f5f3ec]">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-[#8da396] mt-1">
              Everything you need to know about our herbal protocols.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div
                  key={i}
                  className="rounded-xl bg-[#081810] border border-[#1b3b2f] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-semibold text-xs sm:text-sm text-[#f5f3ec]">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#d4af37] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#8da396] shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-[#a6b6ad] leading-relaxed border-t border-[#1b3b2f]/60 animate-in fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
