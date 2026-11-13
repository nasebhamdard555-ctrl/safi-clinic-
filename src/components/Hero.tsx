// src/components/Hero.tsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Phone, MapPin, Clock, Sparkles, ShieldCheck } from "lucide-react";

export const Hero: React.FC = () => {
  return (
    <section className="relative bg-[#F6F3EC] text-[#121E17] border-b border-[#121E17]/12 bg-grain overflow-hidden">
      {/* Top Marquee Ticker */}
      <div className="bg-[#121E17] text-[#F6F3EC] py-2.5 border-b border-[#121E17]/10 overflow-hidden text-xs tracking-widest uppercase font-mono-code">
        <div className="animate-marquee flex items-center gap-10 whitespace-nowrap">
          <span>Safi Natural Care Clinic · صافی د سنتی طب کلینیک · کلینیک طب سنتی صافی</span>
          <span>•</span>
          <span>Herbal Medicine · Unani Mizaj Therapy · Naturopathy</span>
          <span>•</span>
          <span>Main Airport Road, Charahi Shaheed, Kabul</span>
          <span>•</span>
          <span>GMP-Certified Formulations · WHO TCIM Aligned</span>
          <span>•</span>
          <span>Safi Natural Care Clinic · صافی د سنتی طب کلینیک · کلینیک طب سنتی صافی</span>
          <span>•</span>
          <span>Herbal Medicine · Unani Mizaj Therapy · Naturopathy</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Editorial Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8 animate-fade-up">
            {/* Smoky-style Location & Est. Eyebrow */}
            <div className="inline-flex flex-wrap items-center gap-2.5 text-xs font-mono-code uppercase tracking-wider text-[#545E56] border border-[#121E17]/15 bg-[#EFECE4] px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
              <span>Est. April 2026 · Charahi Shaheed, Kabul</span>
            </div>

            {/* Main Editorial Headline */}
            <div className="space-y-4">
              <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.03] text-[#121E17]">
                Traditional healing,{" "}
                <span className="italic font-normal text-[#1B3B2B]">
                  practiced with clinical discipline.
                </span>
              </h1>
              <div className="flex flex-wrap items-center gap-4 pt-1 text-base sm:text-lg text-[#1B3B2B] font-medium" dir="rtl">
                <span>صافی د سنتی طب کلینیک</span>
                <span className="text-[#121E17]/30">|</span>
                <span>کلینیک طب سنتی صافی</span>
              </div>
            </div>

            {/* Grounded 4-Point Value List (Smoky Barbershop Pattern) */}
            <div className="grid sm:grid-cols-2 gap-px bg-[#121E17]/12 border border-[#121E17]/12 rounded-xl overflow-hidden animate-fade-up-delay-1">
              <div className="bg-[#F6F3EC] p-4">
                <p className="font-semibold text-sm text-[#121E17]">Herbal & Unani Formulations</p>
                <p className="text-xs text-[#545E56] mt-0.5">GMP-standardized botanicals & Mizaj balance.</p>
              </div>
              <div className="bg-[#F6F3EC] p-4">
                <p className="font-semibold text-sm text-[#121E17]">Outpatient Clinical Care</p>
                <p className="text-xs text-[#545E56] mt-0.5">Non-invasive, ethical & evidence-informed.</p>
              </div>
              <div className="bg-[#F6F3EC] p-4">
                <p className="font-semibold text-sm text-[#121E17]">Direct Apothecary Dispenser</p>
                <p className="text-xs text-[#545E56] mt-0.5">QR-verified remedies for 9 therapeutic areas.</p>
              </div>
              <div className="bg-[#F6F3EC] p-4">
                <p className="font-semibold text-sm text-[#121E17]">By Charahi Shaheed</p>
                <p className="text-xs text-[#545E56] mt-0.5">Main Airport Road, Kabul · Easy access.</p>
              </div>
            </div>

            {/* Primary CTA Row + Direct Phone Button */}
            <div className="space-y-4 animate-fade-up-delay-2">
              <div className="flex flex-wrap items-center gap-3.5">
                <Link
                  to="/booking"
                  className="group inline-flex items-center gap-2.5 bg-[#121E17] hover:bg-[#1B3B2B] text-[#F6F3EC] px-7 py-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 shadow-sm"
                >
                  <span>Book Consultation</span>
                  <ArrowUpRight className="w-4 h-4 arrow-glide" />
                </Link>

                <a
                  href="tel:+93780299299"
                  className="inline-flex items-center gap-2.5 border border-[#121E17]/25 hover:border-[#121E17] bg-transparent px-6 py-4 rounded-full text-sm font-semibold text-[#121E17] transition-all duration-300"
                >
                  <Phone className="w-4 h-4 text-[#1B3B2B]" />
                  <span>Call +93 780 299 299</span>
                </a>

                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-[#1B3B2B] hover:underline"
                >
                  <span>Browse Apothecary →</span>
                </Link>
              </div>

              {/* Smoky Barbershop-inspired Live Operational Micro-line */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#545E56] font-mono-code pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#1B3B2B]" />
                  Appointments go first, then walk-ins · Today 8:30am – 6:00pm
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#9C6B3B]" />
                  Main Airport Road, Charahi Shaheed
                </span>
              </div>
            </div>
          </div>

          {/* Right Editorial Visual Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4 animate-fade-up-delay-1">
            {/* Spiritual Epigraph Card */}
            <div className="bg-[#121E17] text-[#F6F3EC] p-6 rounded-2xl border border-[#121E17] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono-code uppercase tracking-widest text-[#9C6B3B]">
                <span>Sacred Epigraph</span>
                <span>Ash-Shu'ara 26:80</span>
              </div>
              <p className="text-2xl sm:text-3xl font-editorial text-amber-100 text-right" dir="rtl">
                وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ
              </p>
              <p className="text-sm text-emerald-100/90 text-right font-medium" dir="rtl">
                او کله چ زه ناروغ شم، نو همغه ما ته شفا راکوي (الله)
              </p>
              <p className="text-xs text-[#F6F3EC]/70 italic pt-1">
                "And when I am ill, it is He who cures me."
              </p>
            </div>

            {/* Asymmetric Image Pair with Smooth Zoom */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-7 group relative overflow-hidden rounded-2xl border border-[#121E17]/15 bg-[#EFECE4] aspect-[4/5]">
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-11-06_at_2.48.10_PM_29fcc7b7.jpeg"
                  alt="Dr. Hafizullah Safi — Founder & Director"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#121E17]/90 via-[#121E17]/40 to-transparent p-4 text-[#F6F3EC]">
                  <p className="font-mono-code text-[10px] uppercase tracking-widest text-amber-200">
                    Founder & Director
                  </p>
                  <p className="font-editorial text-lg font-semibold leading-tight">
                    Dr. Hafizullah Safi
                  </p>
                </div>
              </div>

              <div className="col-span-5 flex flex-col justify-between gap-4">
                <div className="group relative overflow-hidden rounded-2xl border border-[#121E17]/15 bg-[#EFECE4] flex-1">
                  <img
                    src="/assets/aistudio/WhatsApp_Image_2026-11-06_at_2.48.11_PM_351ed87f.jpeg"
                    alt="Safi Natural Care Formulations"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="bg-[#EFECE4] border border-[#121E17]/15 rounded-2xl p-4 space-y-1.5">
                  <ShieldCheck className="w-5 h-5 text-[#1B3B2B]" />
                  <p className="font-mono-code text-[11px] uppercase tracking-wider font-semibold text-[#121E17]">
                    MoPH Regulated
                  </p>
                  <p className="text-[11px] text-[#545E56] leading-snug">
                    Complementary outpatient practice aligned with WHO TCIM benchmarks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
