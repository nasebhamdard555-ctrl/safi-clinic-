import React from 'react';
import {
  ShieldCheck,
  Truck,
  Droplets,
  Award,
  Calendar,
  Tag,
} from 'lucide-react';
import { HerbalShop } from '../components/HerbalShop';
import { HerbalProduct } from '../types/clinic';
import { CLINIC_PROFILE } from '../data/clinicData';

interface ShopPageProps {
  onAddToCart: (product: HerbalProduct, quantity?: number) => void;
  onOpenBooking: () => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  onAddToCart,
  onOpenBooking,
}) => {
  return (
    <div className="pt-28 lg:pt-36 pb-20 min-h-screen bg-[#F3ECE3] text-[#211813] selection:bg-[#9E5334] selection:text-[#FAF6F0]">
      {/* Editorial Header */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9E5334]">
            {CLINIC_PROFILE.companyName} · Botanical Dispensary
          </p>

          <h1 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211813]">
            Herbal Formulations & Apothecary
          </h1>

          <p className="text-sm sm:text-base text-[#665448] leading-relaxed">
            Compounded botanical formulations across 9 wellness categories — including Safi Hormone Balance, Safi Chill AF, and Safi Beauty Drops.
          </p>
        </div>
      </section>

      {/* Concise Dispensary Assurances */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#E2D7C8] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#9E5334]/12 flex items-center justify-center text-[#9E5334] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#211813] block">Kabul & Dispatch</span>
              <p className="text-[11px] text-[#665448]">Free shipping over $60 · Clinic pickup on Airport Rd</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#E2D7C8] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#9E5334]/12 flex items-center justify-center text-[#9E5334] shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#211813] block">Patient Promo Code</span>
              <p className="text-[11px] text-[#665448]">
                Apply <code className="text-[#9E5334] font-mono font-bold bg-[#F3ECE3] px-1.5 py-0.5 rounded">HERBAL10</code> for 10% off
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#E2D7C8] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#9E5334]/12 flex items-center justify-center text-[#9E5334] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#211813] block">Verified Botanical Purity</span>
              <p className="text-[11px] text-[#665448]">Zero heavy metals or synthetic adulterants</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Herbal Shop Component */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <HerbalShop onAddToCart={onAddToCart} onOpenBooking={onOpenBooking} />
      </section>

      {/* Apothecary Standards */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#FAF6F0] border border-[#E2D7C8] shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#9E5334] font-semibold">
              Preparation Standards
            </span>
            <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#211813] mt-1">
              Clean Botanical Extraction & Storage
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#F3ECE3]/70 border border-[#E2D7C8] space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#9E5334] text-[#FAF6F0] flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="font-serif-classic font-bold text-base text-[#211813]">
                Verified Sourcing
              </h3>
              <p className="text-xs text-[#665448] leading-relaxed">
                Botanical extracts, capsules, and oils are sourced and bottled under clean, inspected dispensary standards.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F3ECE3]/70 border border-[#E2D7C8] space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#9E5334] text-[#FAF6F0] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif-classic font-bold text-base text-[#211813]">
                Transparent Labeling
              </h3>
              <p className="text-xs text-[#665448] leading-relaxed">
                Full botanical nomenclature, conservative dosing instructions, and clear clinical contraindication notes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F3ECE3]/70 border border-[#E2D7C8] space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#9E5334] text-[#FAF6F0] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif-classic font-bold text-base text-[#211813]">
                Amber UV Packaging
              </h3>
              <p className="text-xs text-[#665448] leading-relaxed">
                Protected in UV-shielded glass and sealed apothecary jars without harsh chemical preservatives.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2D7C8] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-xs text-[#665448]">
              Unsure which category fits your Mizaj temperament? Speak directly with Dr. Hafizullah Safi’s clinic team.
            </p>
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-lg bg-[#9E5334] hover:bg-[#824127] text-[#FAF6F0] font-semibold text-xs tracking-wide transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Consultation</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
