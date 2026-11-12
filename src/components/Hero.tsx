import React from 'react';
import {
  Calendar,
  ShoppingBag,
  Sparkles,
  Award,
  Leaf,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  HeartPulse,
} from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onNavigateToShop: () => void;
  onNavigateToBlog: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBooking,
  onNavigateToShop,
  onNavigateToBlog,
}) => {
  return (
    <section
      id="hero"
      className="relative pt-28 lg:pt-36 pb-16 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#06120d] via-[#091a13] to-[#06120d]"
    >
      {/* Decorative Botanical & Gold Glow Backdrops */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#c5a059]/10 via-[#103828]/20 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0e3b28]/30 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-[#d4af37]/10 blur-3xl pointer-events-none rounded-full" />

      {/* Subtle Botanical Line Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #d4af37 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Brand Statement & Booking CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10291f] border border-[#c5a059]/40 text-[#f5e6c8] text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm flex-wrap">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Herbal Medicine · Unani Medicine · Naturopathy</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              <span className="text-[#a6b6ad]">Kabul, Afghanistan</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-classic text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#f5f3ec] leading-[1.12]">
              Rooted in Nature.{' '}
              <span className="block mt-1 font-serif-editorial italic font-normal text-[#d4af37]">
                Proven in Traditional Medicine.
              </span>
            </h1>

            {/* Body Description */}
            <p className="mt-5 text-base sm:text-lg text-[#b8c9bf] max-w-2xl leading-relaxed font-light">
              Welcome to <strong className="text-[#f5f3ec] font-medium">Safi Natural Care Clinic</strong>, a community-based outpatient healthcare facility in Kabul, Afghanistan. We provide ethical, non-invasive, and supportive traditional clinical care emphasizing patient safety, informed consent, and holistic well-being.
            </p>

            {/* Credibility Key Points */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#d0ded6] w-full max-w-xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Herbal Phytotherapy & Non-Toxic Botanicals</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Unani Mizaj, Akhlat & Tabiat Principles</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Naturopathic Lifestyle & Nutrition Counseling</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Aligned with WHO TCIM & MoPH Guidelines</span>
              </div>
            </div>

            {/* Interactive Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <button
                onClick={onOpenBooking}
                className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#9e7d32] text-black font-bold text-sm tracking-wide shadow-xl shadow-[#d4af37]/20 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Calendar className="w-4 h-4 text-black" />
                <span>Schedule Consultation</span>
                <ArrowRight className="w-4 h-4 text-black ml-1" />
              </button>

              <button
                onClick={onNavigateToShop}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#0e241b] border border-[#2d5e4b] hover:border-[#d4af37] text-[#f5f3ec] hover:text-[#d4af37] font-semibold text-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]"
              >
                <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                <span>Herbal Dispensary</span>
              </button>
            </div>

            {/* Quick Live Contact Ribbon */}
            <div className="mt-8 pt-6 border-t border-[#1b3b2f]/80 flex flex-wrap items-center gap-6 text-xs text-[#8da396]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[#d8e2dc] font-medium">Clinic Desk Open:</span>
                <span>Sat – Thu: 8:30 AM – 7:00 PM</span>
              </div>
              <span className="hidden sm:inline text-[#234b3c]">|</span>
              <div>
                <span>Phone / WhatsApp: </span>
                <a href="https://wa.me/93780299299" target="_blank" rel="noreferrer" className="text-[#d4af37] hover:underline font-bold">
                  +93 780 299 299
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Graphic Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Golden Border Frame */}
              <div className="relative p-1.5 rounded-2xl bg-gradient-to-b from-[#d4af37]/60 via-[#1b3b2f] to-[#0a1811] shadow-2xl shadow-black/80">
                <div className="rounded-[14px] bg-[#091a13] p-5 sm:p-6 overflow-hidden relative">
                  {/* Visual Image Banner */}
                  <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden mb-5 border border-[#1b3b2f]">
                    <img
                      src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
                      alt="Herbal apothecary bottles, organic dried roots, and gold measuring scale"
                      className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091a13] via-transparent to-transparent opacity-80" />
                    
                    {/* Floating Doctor Badge */}
                    <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-[#07150f]/90 backdrop-blur-md border border-[#c5a059]/40 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-[#d4af37] shrink-0">
                          <img
                            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80"
                            alt="Dr. Hakim Safi"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#f5f3ec]">Dr. Naseb Hamdard & Dr. Hakim Safi</p>
                          <p className="text-[10px] text-[#d4af37]">Clinical Director & Senior Herbalist · Kabul</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 font-semibold block">Accepting Patients</span>
                        <span className="text-[9px] text-[#8da396]">In-Clinic & Virtual</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="p-3 rounded-xl bg-[#0d2319] border border-[#1b3b2f]/70">
                      <div className="flex items-center gap-2 text-[#d4af37] mb-1">
                        <Award className="w-4 h-4" />
                        <span className="font-serif-classic font-bold text-sm">28+ Years</span>
                      </div>
                      <p className="text-[11px] text-[#a6b6ad]">Trusted botanical clinical practice</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0d2319] border border-[#1b3b2f]/70">
                      <div className="flex items-center gap-2 text-[#d4af37] mb-1">
                        <HeartPulse className="w-4 h-4" />
                        <span className="font-serif-classic font-bold text-sm">18,500+</span>
                      </div>
                      <p className="text-[11px] text-[#a6b6ad]">Patients healed worldwide</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0d2319] border border-[#1b3b2f]/70">
                      <div className="flex items-center gap-2 text-[#d4af37] mb-1">
                        <Leaf className="w-4 h-4" />
                        <span className="font-serif-classic font-bold text-sm">100% Organic</span>
                      </div>
                      <p className="text-[11px] text-[#a6b6ad]">Wildcrafted & lab tested pure</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0d2319] border border-[#1b3b2f]/70">
                      <div className="flex items-center gap-2 text-[#d4af37] mb-1">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="font-serif-classic font-bold text-sm">Certified</span>
                      </div>
                      <p className="text-[11px] text-[#a6b6ad]">Licensed botanical dispensary</p>
                    </div>
                  </div>

                  {/* Bottom Quick Feature Link */}
                  <div className="mt-4 pt-3 border-t border-[#1b3b2f]/60 flex items-center justify-between text-xs">
                    <span className="text-[#8da396]">Need guidance on your symptoms?</span>
                    <button
                      onClick={onNavigateToBlog}
                      className="text-[#d4af37] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Read Remedy Guide
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
