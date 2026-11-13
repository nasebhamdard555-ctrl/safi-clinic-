import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Star,
  Quote,
  ChevronDown,
  ChevronUp,
  MapPin,
} from 'lucide-react';
import { CLINIC_PROFILE, PRACTITIONERS } from '../data/clinicData';
import { DETAILED_TESTIMONIALS } from './TestimonialsSection';
import { BotanicalImage } from './BotanicalImage';

export const ClinicProfile: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What should I expect during my initial consultation?',
      a: 'Your visit includes a thorough review of your medical history, arterial pulse (Nabz), tongue indicators, and constitutional temperament (Mizaj). Dr. Hafizullah Safi then outlines a supportive herbal and dietary protocol.',
    },
    {
      q: 'Can herbal formulations be taken alongside conventional medications?',
      a: 'Yes, following an herb-medication safety review during your appointment. Our clinical team checks for interactions and keeps clear referral boundaries with conventional doctors.',
    },
    {
      q: 'What is the clinic walk-in and appointment policy?',
      a: 'Appointments go first, then walk-ins · Sat–Thu 8:30am – 6:00pm at Main Airport Road, Charahi Shaheed, Kabul.',
    },
    {
      q: 'How are herbal preparations compounded and verified?',
      a: 'All botanicals are identified for safety, prepared in small batches without restricted or toxic substances, and stored in light-shielded dispensary glass.',
    },
  ];

  return (
    <section id="about" className="py-16 lg:py-24 bg-[#111E17] text-[#F4F0E6] relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* About Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#D4AF7A] block">
            Founder &amp; Clinical Philosophy · Est. {CLINIC_PROFILE.foundedDate}
          </span>
          <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F0E6]">
            {CLINIC_PROFILE.companyName}
          </h2>
          <p className="text-sm sm:text-base text-[#C5D1C8] leading-relaxed">
            Where classical Unani-Tibb wisdom converges with clinical phytotherapy, naturopathy, and supportive traditional acupuncture.
          </p>
        </div>

        {/* Founder Profile & Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <div className="lg:col-span-6 space-y-5 text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#D4AF7A] block">
              {CLINIC_PROFILE.founder.title}
            </span>
            <h3 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6]">
              {CLINIC_PROFILE.founder.name}
            </h3>
            <p className="text-sm text-[#D6DFD8] leading-relaxed">
              {CLINIC_PROFILE.founder.bio}
            </p>
            <p className="text-sm text-[#C5D1C8] leading-relaxed">
              Founded in {CLINIC_PROFILE.foundedDate} in {CLINIC_PROFILE.city}, {CLINIC_PROFILE.country}, {CLINIC_PROFILE.name} emphasizes careful case assessment, patient safety, informed consent, and honest therapeutic boundaries.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#263C31]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF7A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#F4F0E6]">Clinic Address</h4>
                  <p className="text-[11px] text-[#B8C7BD]">
                    {CLINIC_PROFILE.clinicAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#D4AF7A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#F4F0E6]">Registered Office</h4>
                  <p className="text-[11px] text-[#B8C7BD]">
                    {CLINIC_PROFILE.registeredOffice}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative p-2 rounded-2xl bg-[#192B22] border border-[#D4AF7A]/40 shadow-2xl">
              <div className="rounded-xl overflow-hidden aspect-[4/3] bg-white p-2">
                <BotanicalImage
                  src={CLINIC_PROFILE.founder.photo}
                  alt={CLINIC_PROFILE.founder.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-3 px-2 pb-1 flex items-center justify-between text-xs">
                <span className="font-serif-classic font-bold text-[#F4F0E6]">
                  {CLINIC_PROFILE.founder.name}
                </span>
                <span className="text-[#D4AF7A]">{CLINIC_PROFILE.hoursPolicy}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Practitioners */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {PRACTITIONERS.map((prac) => (
              <div
                key={prac.id}
                className="rounded-2xl bg-[#192B22] border border-[#2B4236] hover:border-[#D4AF7A]/60 transition-all p-6 flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl border border-[#D4AF7A] shrink-0 bg-[#111E17] text-[#D4AF7A] font-serif-classic font-bold text-xl flex items-center justify-center">
                    {prac.id === 'prac-hafizullah' ? 'HS.' : 'SC.'}
                  </div>
                  <div>
                    <h4 className="font-serif-classic font-bold text-base text-[#F4F0E6]">
                      {prac.name}
                    </h4>
                    <p className="text-xs text-[#D4AF7A] font-medium mt-0.5">
                      {prac.title}
                    </p>
                    <p className="text-[11px] text-[#B8C7BD] mt-0.5">
                      {prac.degrees}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[#D6DFD8] leading-relaxed">
                  {prac.bio}
                </p>
                <div className="pt-3 border-t border-[#2B4236] flex items-center justify-between text-xs">
                  <span className="text-[#D4AF7A] font-bold">★ {prac.rating}</span>
                  <span className="text-[#B8C7BD]">{prac.experienceYears} Years Clinical Practice</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Testimonials */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs text-[#D4AF7A] font-semibold uppercase tracking-wider block mb-1">
              Verified Patient Stories
            </span>
            <h3 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6]">
              Words from Our Patients
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DETAILED_TESTIMONIALS.slice(0, 3).map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-2xl bg-[#192B22] border border-[#2B4236] hover:border-[#D4AF7A]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <Quote className="w-7 h-7 text-[#D4AF7A]/40 mb-3" />
                  <div className="flex items-center gap-1 text-[#D4AF7A] mb-2">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#E4ECE6] italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#2B4236]">
                  <p className="font-serif-classic font-bold text-sm text-[#F4F0E6]">
                    {t.patientName}
                  </p>
                  <p className="text-[11px] text-[#D4AF7A]">{t.condition}</p>
                  <p className="text-[10px] text-[#B8C7BD]">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="font-serif-classic text-2xl font-bold text-[#F4F0E6]">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div
                  key={i}
                  className="rounded-xl bg-[#192B22] border border-[#2B4236] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-semibold text-xs sm:text-sm text-[#F4F0E6]">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#D4AF7A] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#B8C7BD] shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-2 text-xs text-[#C5D1C8] leading-relaxed border-t border-[#2B4236]">
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
