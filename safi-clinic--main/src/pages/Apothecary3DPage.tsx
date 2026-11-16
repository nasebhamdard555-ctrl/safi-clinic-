import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Layers,
  Leaf,
  Calendar,
  Phone,
  Flame,
  Droplets,
  Activity,
  Award,
} from 'lucide-react';
import { Apothecary3DScene } from '../components/Apothecary3DScene';

interface Apothecary3DPageProps {
  onOpenBooking: () => void;
  onNavigateToShop: () => void;
}

export const Apothecary3DPage: React.FC<Apothecary3DPageProps> = ({
  onOpenBooking,
  onNavigateToShop,
}) => {
  return (
    <div className="pt-24 lg:pt-32 pb-20 min-h-screen bg-[#050c09] text-[#f5f3ec] relative selection:bg-[#d97706] selection:text-black">
      {/* Page Ambient Alchemical Crucible Bronze Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-amber-600/25 via-emerald-950/20 to-transparent blur-[150px] pointer-events-none -z-10" />

      {/* Header Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a1e15] border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold uppercase tracking-widest shadow-md mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive 3D Procedural Craft</span>
        </div>

        <h1 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f5f3ec]">
          The Classical Botanical Apothecary
        </h1>

        <p className="text-sm sm:text-base text-[#a6b6ad] max-w-2xl mx-auto mt-3 leading-relaxed">
          Explore our signature Unani-Tibb pharmaceutical instruments in full 3D. Inspect the procedural chalice mortar, pure brass collar pestle, and botanical spagyric alembic vessel utilized at Safi Natural Care Clinic in Kabul.
        </p>
      </section>

      {/* 3D Viewport Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <Apothecary3DScene />
      </section>

      {/* Craftsmanship & Extraction Protocols */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            Pharmaceutical Standards
          </span>
          <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec] mt-1">
            Centuries of Unani Craftsmanship
          </h2>
          <p className="text-xs sm:text-sm text-[#8da396] mt-2">
            Every custom remedy at Safi Natural Care Clinic is compounded using classical non-metallic, heavy-metal-free processing:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#081810] border border-[#234b3c] hover:border-[#d4af37]/60 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-serif-classic font-bold text-base text-[#f5f3ec]">
              Cold-Mortar Trituration (Saheeq)
            </h3>
            <p className="text-xs text-[#a6b6ad] leading-relaxed">
              Herbs are pulverized slowly in solid mineral onyx and basalt bowls at low ambient temperatures, protecting delicate essential oils, flavonoids, and terpenes from frictional heat denaturation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#081810] border border-[#234b3c] hover:border-[#d4af37]/60 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="font-serif-classic font-bold text-base text-[#f5f3ec]">
              Spagyric Alembic Distillation (Taqteer)
            </h3>
            <p className="text-xs text-[#a6b6ad] leading-relaxed">
              Glass condensers extract volatile floral waters (Arq-e-Gulab, Arq-e-Kasni) with closed-loop purity, preserving natural hydrosols without artificial preservatives or alcohol denaturants.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#081810] border border-[#234b3c] hover:border-[#d4af37]/60 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif-classic font-bold text-base text-[#f5f3ec]">
              Zero Toxic or Restricted Species
            </h3>
            <p className="text-xs text-[#a6b6ad] leading-relaxed">
              In full alignment with WHO TCIM guidelines and MoPH regulations, our dispensary strictly rejects toxic or heavy-metal compounds, using only documented, safe, wildcrafted botanical species.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#0c261b] via-[#071710] to-[#040e08] border border-[#d4af37]/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <h3 className="font-serif-classic text-xl sm:text-2xl font-bold text-[#f5f3ec]">
              Order Hand-Compounded Formulations
            </h3>
            <p className="text-xs sm:text-sm text-[#a6b6ad]">
              Browse our laboratory-prepared herbal oils, bitter elixirs, and bespoke tea tisanes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onNavigateToShop}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer"
            >
              Explore Dispensary
            </button>
            <button
              onClick={onOpenBooking}
              className="px-5 py-3 rounded-xl bg-[#0e2118] border border-[#234b3c] hover:border-[#d4af37] text-xs font-semibold text-[#f5f3ec] transition-colors cursor-pointer"
            >
              Book In-Person Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
