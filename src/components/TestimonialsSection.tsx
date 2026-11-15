import React, { useState } from 'react';
import {
  Star,
  TrendingUp,
  Quote,
  UserCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface PatientTestimonial {
  id: string;
  patientName: string;
  age?: number;
  location: string;
  condition: string;
  category: 'digestive' | 'joints' | 'stress' | 'skin' | 'vitality';
  treatmentProtocol: string;
  practitioner: string;
  duration: string;
  outcomeMetric: string;
  outcomeHighlight: string;
  quote: string;
  rating: number;
  verified: boolean;
  date: string;
}

export const DETAILED_TESTIMONIALS: PatientTestimonial[] = [
  {
    id: 'test-1',
    patientName: 'Dr. Tariq Mohammadi, MD',
    age: 49,
    location: 'Kabul, Afghanistan',
    condition: 'Chronic Acid Reflux & Functional Dyspepsia',
    category: 'digestive',
    treatmentProtocol: 'Digestive & Microbiome Protocol + FloraSoothe Infusion',
    practitioner: 'Dr. Hafizullah Safi',
    duration: '6 Weeks',
    outcomeMetric: '88% Symptom Reduction',
    outcomeHighlight: 'Marked resolution of nocturnal reflux & improved post-meal comfort',
    quote:
      'After months of stubborn gastric reflux, Dr. Hafizullah Safi’s Unani temperament assessment and demulcent herbal infusion restored my digestive comfort within 6 weeks.',
    rating: 5,
    verified: true,
    date: 'November 2026',
  },
  {
    id: 'test-2',
    patientName: 'Hajji Ahmadullah Stanikzai',
    age: 58,
    location: 'Kabul, Afghanistan',
    condition: 'Bilateral Knee Stiffness & Joint Discomfort',
    category: 'joints',
    treatmentProtocol: 'Joint-Flex Boswellia Balm + Himalayan Shilajit Gold Resin',
    practitioner: 'Dr. Hafizullah Safi',
    duration: '5 Weeks',
    outcomeMetric: 'Mobility Restored',
    outcomeHighlight: 'Able to walk comfortably and pray without sharp knee strain',
    quote:
      'Dr. Hafizullah Safi combined botanical joint compresses with topical Boswellia balm and dietary warmth. Within three weeks the stiffness subsided and I resumed daily walks.',
    rating: 5,
    verified: true,
    date: 'October 2026',
  },
  {
    id: 'test-3',
    patientName: 'Nadia Rahmati',
    age: 38,
    location: 'Qalai Fathullah, Kabul',
    condition: 'Adrenal Fatigue & Chronic Sleep Disruption',
    category: 'stress',
    treatmentProtocol: 'Stress & Sleep Support + Safi Chill AF Botanical Tonic',
    practitioner: 'Safi Clinical Care Team',
    duration: '4 Weeks',
    outcomeMetric: '7.5 hrs Restful Sleep',
    outcomeHighlight: 'Steady evening wind-down and clearer daytime focus without grogginess',
    quote:
      'I struggled with fractured sleep and stress exhaustion. With consistent herbal support from the clinic team and practical lifestyle changes, my sleep rhythm stabilized naturally.',
    rating: 5,
    verified: true,
    date: 'September 2026',
  },
  {
    id: 'test-4',
    patientName: 'Fatima Al-Zahra',
    age: 31,
    location: 'Dubai & Kabul',
    condition: 'Dry Skin Flare-Ups & Scalp Health Support',
    category: 'skin',
    treatmentProtocol: 'Therapeutic Skin Protocol + Safi Beauty Drops',
    practitioner: 'Safi Clinical Care Team',
    duration: '8 Weeks',
    outcomeMetric: '92% Clearance',
    outcomeHighlight: 'Calmer skin barrier through internal blood-cooling & topical care',
    quote:
      'Instead of only masking surface redness, the clinic addressed my dietary heat alongside gentle herbal salves and Safi Beauty Drops. My skin steadily cleared over eight weeks.',
    rating: 5,
    verified: true,
    date: 'October 2026',
  },
  {
    id: 'test-5',
    patientName: 'Mirwais Rahimi',
    age: 44,
    location: 'Mazar-i-Sharif, Afghanistan',
    condition: 'Tension Headaches & Cervical Muscular Strain',
    category: 'vitality',
    treatmentProtocol: 'Traditional Acupuncture & Regimenal Care + Black Seed Oil',
    practitioner: 'Dr. Hafizullah Safi',
    duration: '3 Sessions',
    outcomeMetric: '60 Days Headache-Free',
    outcomeHighlight: 'Relieved upper-neck tension and recurring occipital headaches',
    quote:
      'Non-invasive traditional acupuncture paired with Dr. Hafizullah Safi’s Unani dietary adjustments relieved cervical tension that had persisted for over a year.',
    rating: 5,
    verified: true,
    date: 'November 2026',
  },
  {
    id: 'test-6',
    patientName: 'Soraya Karimi',
    age: 34,
    location: 'Herat, Afghanistan',
    condition: 'Hormonal Irregularity & Metabolic Fatigue',
    category: 'vitality',
    treatmentProtocol: "Women's Hormonal Protocol + Safi Hormone Balance",
    practitioner: 'Dr. Hafizullah Safi',
    duration: '12 Weeks',
    outcomeMetric: 'Cycle Rhythm Balanced',
    outcomeHighlight: 'Consistent 29-day rhythm with steadier daily energy',
    quote:
      'Safi Hormone Balance and the temperament nutrition guidance from Safi Natural Care Clinic helped restore steady monthly balance with respectful, attentive follow-up.',
    rating: 5,
    verified: true,
    date: 'August 2026',
  },
];

interface TestimonialsSectionProps {
  onOpenBooking?: (serviceId?: string) => void;
  variant?: 'limestone' | 'dark';
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  onOpenBooking,
  variant = 'dark',
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const isLight = variant === 'limestone';

  const filtered =
    selectedCategory === 'all'
      ? DETAILED_TESTIMONIALS
      : DETAILED_TESTIMONIALS.filter((item) => item.category === selectedCategory);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="max-w-3xl mb-10 space-y-2">
        <span
          className={`text-xs font-semibold uppercase tracking-widest block ${
            isLight ? 'text-[#8C5A32]' : 'text-[#d4af37]'
          }`}
        >
          {t.testimonials.kicker}
        </span>

        <h2
          className={`font-serif-classic text-2xl sm:text-3xl lg:text-4xl font-bold ${
            isLight ? 'text-[#141815]' : 'text-[#f5f3ec]'
          }`}
        >
          {t.testimonials.heading}
        </h2>

        <p
          className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${
            isLight ? 'text-[#4E544F]' : 'text-[#8da396]'
          }`}
        >
          {t.testimonials.sub}
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {[
          { id: 'all', label: t.testimonials.allStories },
          { id: 'digestive', label: t.symptomsMap['digestive']?.name ?? 'Digestive' },
          { id: 'joints', label: t.symptomsMap['pain-joints']?.name ?? 'Joints & Mobility' },
          { id: 'stress', label: t.symptomsMap['stress-sleep']?.name ?? 'Stress & Sleep' },
          { id: 'skin', label: t.symptomsMap['skin-immunity']?.name ?? 'Skin & Hair' },
          { id: 'vitality', label: t.symptomsMap['hormonal-wellness']?.name ?? 'Hormonal & Acupuncture' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === tab.id
                ? isLight
                  ? 'bg-[#8C5A32] text-[#FAF7F2] shadow-sm'
                  : 'bg-[#d4af37] text-black shadow-md'
                : isLight
                ? 'bg-[#EAE5DA] text-[#353B36] hover:text-[#141815] border border-[#D4CEC2]'
                : 'bg-[#081810] text-[#a6b6ad] hover:text-[#f5f3ec] border border-[#234b3c]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((test) => (
          <div
            key={test.id}
            className={`p-6 rounded-2xl transition-all flex flex-col justify-between space-y-4 ${
              isLight
                ? 'bg-[#EAE5DA] border border-[#D4CEC2] hover:border-[#8C5A32]/60'
                : 'bg-[#091b12] border border-[#234b3c] hover:border-[#d4af37]/60 shadow-xl'
            }`}
          >
            <div className="space-y-3.5">
              {/* Top Meta: Stars & Verified */}
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-0.5 ${isLight ? 'text-[#8C5A32]' : 'text-[#d4af37]'}`}>
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <div
                  className={`flex items-center gap-1 text-[10px] font-semibold ${
                    isLight ? 'text-[#24593C]' : 'text-emerald-400'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{t.testimonials.verifiedPatient}</span>
                </div>
              </div>

              {/* Outcome Metric Box */}
              <div
                className={`p-3 rounded-xl space-y-1 ${
                  isLight
                    ? 'bg-[#F5F2EB] border border-[#D4CEC2]'
                    : 'bg-[#0e2419] border border-[#d4af37]/30'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`text-[10px] uppercase tracking-wider font-semibold ${
                      isLight ? 'text-[#6A706B]' : 'text-[#8da396]'
                    }`}
                  >
                    {t.testimonials.progressLabel}
                  </span>
                  <span
                    className={`font-bold text-xs flex items-center gap-1 ${
                      isLight ? 'text-[#8C5A32]' : 'text-[#d4af37]'
                    }`}
                  >
                    <TrendingUp className={`w-3 h-3 ${isLight ? 'text-[#24593C]' : 'text-emerald-400'}`} />
                    {test.outcomeMetric}
                  </span>
                </div>
                <p
                  className={`text-[11px] font-medium leading-tight ${
                    isLight ? 'text-[#141815]' : 'text-[#f5f3ec]'
                  }`}
                >
                  {test.outcomeHighlight}
                </p>
              </div>

              {/* Patient Quote */}
              <div className="relative pt-1">
                <Quote
                  className={`w-5 h-5 absolute -top-1 -start-1 shrink-0 ${
                    isLight ? 'text-[#8C5A32]/25' : 'text-[#d4af37]/20'
                  }`}
                />
                <p
                  className={`text-xs italic leading-relaxed ps-5 ${
                    isLight ? 'text-[#2D332E]' : 'text-[#d8e2dc]'
                  }`}
                >
                  &ldquo;{test.quote}&rdquo;
                </p>
              </div>
            </div>

            {/* Bottom Section */}
            <div
              className={`pt-4 border-t space-y-2 ${
                isLight ? 'border-[#D4CEC2]' : 'border-[#1b3b2f]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4
                    className={`font-semibold text-xs ${
                      isLight ? 'text-[#141815]' : 'text-[#f5f3ec]'
                    }`}
                  >
                    {test.patientName}{' '}
                    {test.age && (
                      <span className={`font-normal ${isLight ? 'text-[#6A706B]' : 'text-[#8da396]'}`}>
                        ({test.age} yrs)
                      </span>
                    )}
                  </h4>
                  <span className={`text-[10px] ${isLight ? 'text-[#6A706B]' : 'text-[#8da396]'}`}>
                    {test.location}
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    isLight
                      ? 'bg-[#F5F2EB] border border-[#D4CEC2] text-[#8C5A32]'
                      : 'bg-[#07150e] border border-[#234b3c] text-[#d4af37]'
                  }`}
                >
                  {test.duration}
                </span>
              </div>

              <div className={`text-[10px] leading-snug space-y-0.5 ${isLight ? 'text-[#4E544F]' : 'text-[#8da396]'}`}>
                <div>
                  <span>{t.testimonials.conditionLabel} </span>
                  <strong className={isLight ? 'text-[#141815]' : 'text-[#f5f3ec]'}>
                    {test.condition}
                  </strong>
                </div>
                <div>
                  <span>{t.testimonials.clinicianLabel} </span>
                  <span className={`font-medium ${isLight ? 'text-[#24593C]' : 'text-emerald-400'}`}>
                    {test.practitioner}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      {onOpenBooking && (
        <div
          className={`mt-10 p-6 rounded-2xl max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isLight
              ? 'bg-[#EAE5DA] border border-[#D4CEC2]'
              : 'bg-[#081810] border border-[#234b3c]'
          }`}
        >
          <div className="text-center sm:text-start space-y-0.5">
            <h4 className={`font-serif-classic font-bold text-sm ${isLight ? 'text-[#141815]' : 'text-[#f5f3ec]'}`}>
              {t.testimonials.lookingForCare}
            </h4>
            <p className={`text-xs ${isLight ? 'text-[#4E544F]' : 'text-[#8da396]'}`}>
              {t.brand.hoursPolicy}
            </p>
          </div>

          <button
            onClick={() => onOpenBooking()}
            className={`px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
              isLight
                ? 'bg-[#141815] text-[#F5F2EB] hover:bg-[#8C5A32]'
                : 'bg-[#d4af37] text-black hover:brightness-110'
            }`}
          >
            {t.testimonials.bookVisit}
          </button>
        </div>
      )}
    </section>
  );
};
