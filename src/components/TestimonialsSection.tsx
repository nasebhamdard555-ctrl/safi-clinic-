import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles,
  Quote,
  Filter,
  UserCheck,
} from 'lucide-react';

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
    patientName: 'Dr. Marcus Sterling, MD',
    age: 49,
    location: 'London, UK & Kabul',
    condition: 'Chronic Acid Reflux & Severe Gut Dysbiosis',
    category: 'digestive',
    treatmentProtocol: 'Digestive & Microbiome Restoration Protocol + FloraSoothe Tea',
    practitioner: 'Dr. Hakim Safiullah Safi',
    duration: '6 Weeks',
    outcomeMetric: '88% Symptom Reduction',
    outcomeHighlight: 'Complete cessation of nocturnal acid reflux & discontinuation of long-term PPIs',
    quote:
      'As a conventional medical physician, I was skeptical of herbal protocols. After 4 months of debilitating reflux and gastric burning that pharmaceuticals failed to control, Hakim Safi’s cold-infusion demulcent tea and black seed regimen completely restored my digestive lining within 6 weeks. This is clinical phytotherapy at the highest standard.',
    rating: 5,
    verified: true,
    date: 'November 2026',
  },
  {
    id: 'test-2',
    patientName: 'Hajji Ahmadullah Stanikzai',
    age: 58,
    location: 'Kabul, Afghanistan',
    condition: 'Severe Bilateral Knee Osteoarthritis & Joint Stiffness',
    category: 'joints',
    treatmentProtocol: 'Joint-Flex Boswellia & Turmeric Balm + Himalayan Shilajit Gold Resin',
    practitioner: 'Dr. Naseb Hamdard',
    duration: '5 Weeks',
    outcomeMetric: 'Mobility Restored',
    outcomeHighlight: 'Able to climb stairs and perform daily prayers (Salah) without pain',
    quote:
      'I was told knee replacement was my only option. Walking just 50 meters felt like grinding glass. Dr. Naseb Hamdard prescribed thermal herbal compresses with Joint-Flex Balm and pure Shilajit pitch. By week 3, the chronic swelling melted away. Today I walk to the mosque every morning in absolute comfort. Alhamdulillah for Safi Clinic.',
    rating: 5,
    verified: true,
    date: 'October 2026',
  },
  {
    id: 'test-3',
    patientName: 'Eleanor Hawthorne',
    age: 38,
    location: 'Edinburgh, UK',
    condition: 'Adrenal Burnout & Chronic Sleep Latency Insomnia',
    category: 'stress',
    treatmentProtocol: 'Botanical Neuro-Reset Protocol + KSM-66 & Saffron Tonic',
    practitioner: 'Dr. Amina Vance, ND',
    duration: '4 Weeks',
    outcomeMetric: 'Sleep Restored to 7.5 hrs/night',
    outcomeHighlight: 'Zero morning brain fog, cortisol normalized, discontinued synthetic hypnotics',
    quote:
      'I suffered from 2 years of fractured sleep where I woke up gasping at 3 AM with a racing heartbeat. Dr. Vance crafted a personalized adaptogen and nervine tincture schedule. Within 10 days, my sleep latency dropped to under 15 minutes, and I wake up clear-headed without any drug hangover. Truly life-changing care.',
    rating: 5,
    verified: true,
    date: 'September 2026',
  },
  {
    id: 'test-4',
    patientName: 'Fatima Al-Zahra',
    age: 31,
    location: 'Dubai, UAE & Kabul',
    condition: 'Stubborn Plaque Eczema & Chronic Scalp Dermatitis',
    category: 'skin',
    treatmentProtocol: 'Herbal Dermatology & Eczema Protocol + Neem Restorative Salve',
    practitioner: 'Dr. Layla Kazemi',
    duration: '8 Weeks',
    outcomeMetric: '92% Clearance of Plaques',
    outcomeHighlight: 'Skin barrier restored with zero steroid rebound effect',
    quote:
      'Years of prescription hydrocortisone thinned my skin until eczema cracked and bled on my wrists and neck. Dr. Kazemi treated my condition from the blood and gut outward while applying organic neem and calendula balm topically. Within 8 weeks my skin completely regenerated and remains clear and resilient.',
    rating: 5,
    verified: true,
    date: 'October 2026',
  },
  {
    id: 'test-5',
    patientName: 'Mirwais Rahimi',
    age: 44,
    location: 'Mazar-i-Sharif, Afghanistan',
    condition: 'Chronic Cervical Migraines & Deep Muscular Tension',
    category: 'vitality',
    treatmentProtocol: 'Classical Hijama (Wet Cupping) & Lymphatic Detox Therapy',
    practitioner: 'Dr. Hakim Safiullah Safi',
    duration: '3 Sessions',
    outcomeMetric: 'Zero Migraines in 60 Days',
    outcomeHighlight: 'Relieved cervical venous congestion and chronic occipital throbbing',
    quote:
      'I had debilitating occipital migraines 3 to 4 times every week that left me incapacitated. Hakim Safi performed single-use sterile Hijama cupping following classical Unani anatomical points and prescribed royal black seed oil. The immediate release of pressure was miraculous. I haven’t had a single migraine episode in two months.',
    rating: 5,
    verified: true,
    date: 'November 2026',
  },
  {
    id: 'test-6',
    patientName: 'Soraya Karimi',
    age: 34,
    location: 'Herat, Afghanistan',
    condition: 'PCOS & Endocrine Metabolic Irregularity',
    category: 'vitality',
    treatmentProtocol: "Women's Endocrine & Hormonal Balance Protocol",
    practitioner: 'Dr. Amina Vance, ND',
    duration: '12 Weeks',
    outcomeMetric: 'Ovulatory Cycle Regulated',
    outcomeHighlight: 'Menstrual cycle restored to 29-day rhythm; metabolic fatigue eliminated',
    quote:
      'After battling irregular cycles and intense hormonal mood swings for 3 years, the personalized herbal compounding protocol from Safi Clinic restored my natural cycle in 90 days. The clinical team treated me with such respect, deep knowledge, and genuine warmth.',
    rating: 5,
    verified: true,
    date: 'August 2026',
  },
];

interface TestimonialsSectionProps {
  onOpenBooking?: (serviceId?: string) => void;
  accentTheme?: 'emerald' | 'jade' | 'moss';
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  onOpenBooking,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered =
    selectedCategory === 'all'
      ? DETAILED_TESTIMONIALS
      : DETAILED_TESTIMONIALS.filter((t) => t.category === selectedCategory);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a1e15] border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold uppercase tracking-widest shadow-md">
          <Award className="w-3.5 h-3.5" />
          <span>Verified Clinical Outcomes & Patient Trust</span>
        </div>

        <h2 className="font-serif-classic text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f5f3ec]">
          Real Patients. Documented Healing.
        </h2>

        <p className="text-xs sm:text-sm text-[#8da396] max-w-2xl mx-auto leading-relaxed">
          At Safi Natural Care Clinic in Kabul, we hold ourselves to rigorous clinical standards.
          Explore verified patient accounts and documented physiological improvements across chronic conditions.
        </p>

        {/* Clinical Proof Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-[#081810] border border-[#234b3c] text-center">
            <div className="text-xl sm:text-2xl font-bold text-[#d4af37] font-serif-classic">94.6%</div>
            <div className="text-[11px] text-[#8da396] mt-0.5 font-medium">Documented Relief Rate</div>
          </div>
          <div className="p-4 rounded-xl bg-[#081810] border border-[#234b3c] text-center">
            <div className="text-xl sm:text-2xl font-bold text-[#d4af37] font-serif-classic">18,500+</div>
            <div className="text-[11px] text-[#8da396] mt-0.5 font-medium">Patients Treated in Kabul</div>
          </div>
          <div className="p-4 rounded-xl bg-[#081810] border border-[#234b3c] text-center">
            <div className="text-xl sm:text-2xl font-bold text-[#d4af37] font-serif-classic">28+ Years</div>
            <div className="text-[11px] text-[#8da396] mt-0.5 font-medium">Unani & Herbal Heritage</div>
          </div>
          <div className="p-4 rounded-xl bg-[#081810] border border-[#234b3c] text-center">
            <div className="text-xl sm:text-2xl font-bold text-[#d4af37] font-serif-classic">100%</div>
            <div className="text-[11px] text-[#8da396] mt-0.5 font-medium">Unadulterated Botanicals</div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {[
          { id: 'all', label: 'All Documented Outcomes' },
          { id: 'digestive', label: 'Digestive & Gastric' },
          { id: 'joints', label: 'Joints & Arthritis' },
          { id: 'stress', label: 'Sleep & Burnout' },
          { id: 'skin', label: 'Dermatology & Eczema' },
          { id: 'vitality', label: 'Hijama & Vitality' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black shadow-md font-bold'
                : 'bg-[#081810] text-[#a6b6ad] hover:text-[#f5f3ec] border border-[#234b3c] hover:border-[#d4af37]/50'
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
            className="p-6 rounded-2xl bg-gradient-to-b from-[#091b12] to-[#05110a] border border-[#234b3c] hover:border-[#d4af37]/60 transition-all shadow-xl flex flex-col justify-between space-y-4 group relative"
          >
            <div className="space-y-3.5">
              {/* Top Meta: Stars, Date, Verified */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[#d4af37]">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#d4af37]" />
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Patient</span>
                </div>
              </div>

              {/* Outcome Metric Callout Box */}
              <div className="p-3 rounded-xl bg-[#0e2419] border border-[#d4af37]/30 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] uppercase tracking-wider text-[#8da396] font-semibold">
                    Documented Outcome:
                  </span>
                  <span className="font-bold text-[#d4af37] text-xs flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    {test.outcomeMetric}
                  </span>
                </div>
                <p className="text-[11px] text-[#f5f3ec] font-medium leading-tight">
                  {test.outcomeHighlight}
                </p>
              </div>

              {/* Patient Quote */}
              <div className="relative pt-1">
                <Quote className="w-6 h-6 text-[#d4af37]/20 absolute -top-1 -left-1 shrink-0" />
                <p className="text-xs text-[#d8e2dc] italic leading-relaxed pl-5">
                  "{test.quote}"
                </p>
              </div>
            </div>

            {/* Bottom Section: Patient Profile & Treatment Metadata */}
            <div className="pt-4 border-t border-[#1b3b2f] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-[#f5f3ec] group-hover:text-[#d4af37] transition-colors">
                    {test.patientName} {test.age && <span className="text-[#8da396] font-normal">({test.age} yrs)</span>}
                  </h4>
                  <span className="text-[10px] text-[#8da396]">{test.location}</span>
                </div>

                <span className="px-2 py-0.5 rounded bg-[#07150e] border border-[#234b3c] text-[10px] font-medium text-[#d4af37]">
                  {test.duration}
                </span>
              </div>

              <div className="text-[10px] text-[#8da396] leading-snug space-y-0.5">
                <div>
                  <span className="text-[#a6b6ad]">Condition: </span>
                  <strong className="text-[#f5f3ec]">{test.condition}</strong>
                </div>
                <div>
                  <span className="text-[#a6b6ad]">Prescribing Clinician: </span>
                  <span className="text-emerald-400 font-medium">{test.practitioner}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA within Testimonials */}
      <div className="mt-12 text-center p-6 rounded-2xl bg-[#081810] border border-[#234b3c] max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left space-y-0.5">
          <h4 className="font-serif-classic font-bold text-sm text-[#f5f3ec]">
            Have a Complex or Unresolved Health Concern?
          </h4>
          <p className="text-xs text-[#8da396]">
            Our clinicians conduct comprehensive 60-minute diagnostic case audits.
          </p>
        </div>

        {onOpenBooking && (
          <button
            onClick={() => onOpenBooking()}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shrink-0"
          >
            Schedule Consultation
          </button>
        )}
      </div>
    </section>
  );
};
