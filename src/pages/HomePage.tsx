// src/pages/HomePage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Phone,
  MapPin,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import Hero from "../components/Hero";
import { CLINIC_INFO, INITIAL_MEDICINES, CLINIC_ASSET_IMAGES } from "../data/clinicData";

const CLINICAL_CONSULTATIONS = [
  {
    code: "UN.",
    name: "Unani Mizaj (Temperament) Assessment & Diet Therapy",
    duration: "30 min",
    price: "500 AFN",
    description:
      "Holistic evaluation of your constitutional temperament (Mizaj), humoral balance, and personalized nutrition plan.",
  },
  {
    code: "HM.",
    name: "Herbal Medicine (Phytotherapy) Consultation",
    duration: "30 min",
    price: "500 AFN",
    description:
      "Targeted plant-based formulations for digestive, metabolic, hormonal, respiratory, or musculoskeletal support.",
  },
  {
    code: "NA.",
    name: "Naturopathic & Chronic Stress Counseling",
    duration: "40 min",
    price: "600 AFN",
    description:
      "Non-pharmacological lifestyle regulation supporting sleep recovery, immunity, and natural self-healing capacity.",
  },
  {
    code: "AC.",
    name: "Traditional Supportive Acupuncture Session",
    duration: "45 min",
    price: "800 AFN",
    description:
      "Non-invasive traditional acupuncture for joint discomfort, back pain, migraine relief, and nerve relaxation.",
  },
  {
    code: "FU.",
    name: "Follow-Up Clinical Review & Formulation Adjustment",
    duration: "20 min",
    price: "300 AFN",
    description:
      "Case documentation review and dosage refinement for returning Safi Natural Care Clinic patients.",
  },
];

export const HomePage: React.FC = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryImages = CLINIC_ASSET_IMAGES.slice(0, 8);

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + galleryImages.length) % galleryImages.length);
  };

  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % galleryImages.length);
  };

  return (
    <div className="bg-[#F6F3EC] text-[#121E17] min-h-screen">
      {/* 1. Editorial Hero */}
      <Hero />

      {/* 2. Smoky Barbershop-Style Service & Price Menu */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#121E17]/12">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            <span className="font-mono-code text-xs uppercase tracking-widest text-[#9C6B3B]">
              01 / Outpatient Consultations
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl font-semibold leading-tight">
              Not sure what to book?{" "}
              <span className="italic font-normal text-[#1B3B2B]">Start with a Mizaj review.</span>
            </h2>
            <p className="text-sm text-[#545E56] leading-relaxed">
              We provide non-invasive, patient-centered care for digestive, metabolic, joint, hormonal, and stress-related conditions. Pick your consultation below or walk in at Charahi Shaheed.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-xs font-mono-code text-[#545E56]">
              <span>• Consultations from 300 AFN</span>
              <span>• Most visits take 30–40 minutes</span>
              <span>• Strict informed consent & ethical practice</span>
            </div>
            <div className="pt-4">
              <Link
                to="/booking"
                className="group inline-flex items-center gap-2 bg-[#121E17] text-[#F6F3EC] px-6 py-3.5 rounded-full text-xs font-mono-code uppercase tracking-wider hover:bg-[#1B3B2B] transition"
              >
                <span>Lock In Your Time</span>
                <ArrowRight className="w-3.5 h-3.5 arrow-glide" />
              </Link>
            </div>
          </div>

          {/* Right Ledger List */}
          <div className="lg:col-span-8 border-t border-[#121E17]/12">
            {CLINICAL_CONSULTATIONS.map((item) => (
              <Link
                to="/booking"
                key={item.code}
                className="group editorial-row py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 block"
              >
                <div className="flex items-start gap-4 max-w-xl">
                  <span className="font-mono-code text-xs font-semibold px-2.5 py-1 rounded bg-[#EFECE4] border border-[#121E17]/15 text-[#1B3B2B] shrink-0 mt-0.5">
                    {item.code}
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-base sm:text-lg text-[#121E17] group-hover:text-[#1B3B2B] transition">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#545E56] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0 pl-11 sm:pl-0">
                  <span className="font-mono-code text-base font-semibold text-[#121E17]">
                    {item.price}
                  </span>
                  <span className="font-mono-code text-[11px] text-[#545E56] inline-flex items-center gap-1">
                    {item.duration} · <span className="underline">Book →</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Apothecary Formulations (Clean Editorial Grid) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#121E17]/12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <span className="font-mono-code text-xs uppercase tracking-widest text-[#9C6B3B]">
              02 / Clinic-Integrated Apothecary
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl font-semibold">
              Standardized Herbal Formulations
            </h2>
          </div>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 font-mono-code text-xs uppercase tracking-wider text-[#121E17] border-b border-[#121E17] pb-1 self-start md:self-auto"
          >
            <span>Open Full Dispensary ({INITIAL_MEDICINES.length} Formulations)</span>
            <ArrowRight className="w-3.5 h-3.5 arrow-glide" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_MEDICINES.slice(0, 6).map((med, idx) => {
            const monogram = med.name
              .replace(/^Safi\s+/i, "")
              .slice(0, 2)
              .toUpperCase();
            return (
              <div
                key={med.id}
                className="group bg-[#EFECE4]/70 border border-[#121E17]/12 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:border-[#121E17]/40"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#E5E0D5] border-b border-[#121E17]/10">
                    <img
                      src={med.image}
                      alt={med.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 font-mono-code text-[11px] font-semibold px-2.5 py-1 rounded bg-[#F6F3EC]/90 backdrop-blur-sm border border-[#121E17]/15 text-[#121E17]">
                      {monogram}. · {med.form}
                    </span>
                    <span className="absolute top-3 right-3 font-mono-code text-xs font-semibold px-3 py-1 rounded-full bg-[#121E17] text-[#F6F3EC]">
                      {med.price} AFN
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <p className="font-mono-code text-[10px] uppercase tracking-wider text-[#9C6B3B]">
                      {med.category}
                    </p>
                    <h3 className="font-editorial text-2xl font-semibold text-[#121E17] leading-snug">
                      {med.name}
                    </h3>
                    <p className="text-xs text-[#545E56] leading-relaxed line-clamp-2">
                      {med.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-[#121E17]/10">
                  <span className="font-mono-code text-[11px] text-[#545E56]">
                    SKU: {med.sku}
                  </span>
                  <Link
                    to="/shop"
                    className="group/btn inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B3B2B]"
                  >
                    <span>Order / Scan</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Personal Founder Section (Smoky Barbershop "Hi, I'm..." Pattern) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#121E17]/12">
        <div className="grid lg:grid-cols-12 gap-12 items-center bg-[#121E17] text-[#F6F3EC] rounded-3xl p-8 sm:p-12 lg:p-16">
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-[#F6F3EC]/15 aspect-[4/5]">
              <img
                src={CLINIC_INFO.founder.image}
                alt={CLINIC_INFO.founder.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <span className="font-mono-code text-xs uppercase tracking-widest text-amber-300/90">
              03 / From the Founder's Desk
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl font-semibold leading-tight">
              Hi, I'm {CLINIC_INFO.founder.name}.
            </h2>
            <p className="text-base sm:text-lg text-[#F6F3EC]/85 leading-relaxed">
              {CLINIC_INFO.founder.message}
            </p>
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {CLINIC_INFO.mission.slice(0, 4).map((m, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-[#F6F3EC]/80">
                  <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-[#F6F3EC]/15 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-editorial text-xl font-semibold text-white">
                  {CLINIC_INFO.founder.name}
                </p>
                <p className="font-mono-code text-xs text-amber-200/80">
                  {CLINIC_INFO.founder.role} · {CLINIC_INFO.founder.organization}
                </p>
              </div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F6F3EC] text-[#121E17] text-xs font-mono-code uppercase tracking-wider font-semibold hover:bg-amber-100 transition"
              >
                <span>Read Full Clinic Profile</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Interactive Clinic & Apothecary Gallery with Lightbox (× ‹ ›) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="font-mono-code text-xs uppercase tracking-widest text-[#9C6B3B]">
              04 / Inside Safi Natural Care
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl font-semibold mt-1">
              From the Apothecary & Clinic
            </h2>
          </div>
          <p className="text-xs font-mono-code text-[#545E56]">
            Click any photograph to inspect formulation details →
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((imgSrc, index) => (
            <button
              key={imgSrc}
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-[#121E17]/15 bg-[#EFECE4] text-left focus:outline-none"
            >
              <img
                src={imgSrc}
                alt={`Safi Natural Care Gallery ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#121E17]/0 group-hover:bg-[#121E17]/30 transition-colors duration-300 flex items-end p-4">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity font-mono-code text-[11px] bg-[#F6F3EC] text-[#121E17] px-2.5 py-1 rounded">
                  Inspect 0{index + 1} ↗
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Fullscreen Lightbox Modal (Smoky Barbershop × ‹ › Pattern) */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-[#121E17]/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-[#F6F3EC]/10 hover:bg-[#F6F3EC]/20 text-white flex items-center justify-center transition"
            aria-label="Close gallery"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 sm:left-8 w-11 h-11 rounded-full bg-[#F6F3EC]/10 hover:bg-[#F6F3EC]/20 text-white flex items-center justify-center transition"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-3xl max-h-[82vh] overflow-hidden rounded-2xl border border-white/15">
            <img
              src={galleryImages[lightboxIndex]}
              alt="Enlarged view"
              className="w-full h-full max-h-[78vh] object-contain bg-black"
            />
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 sm:right-8 w-11 h-11 rounded-full bg-[#F6F3EC]/10 hover:bg-[#F6F3EC]/20 text-white flex items-center justify-center transition"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
