import React from 'react';
import {
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  Droplets,
  Award,
  CheckCircle2,
  Calendar,
  HelpCircle,
} from 'lucide-react';
import { HerbalShop } from '../components/HerbalShop';
import { HerbalProduct } from '../types/clinic';

interface ShopPageProps {
  onAddToCart: (product: HerbalProduct, quantity?: number) => void;
  onOpenBooking: () => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  onAddToCart,
  onOpenBooking,
}) => {
  return (
    <div className="pt-28 lg:pt-36 pb-20 min-h-screen bg-[#021810] text-[#f5f3ec] relative selection:bg-[#facc15] selection:text-black">
      {/* Page Ambient Lustrous Malachite & Crown Gold Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-emerald-500/25 via-green-900/15 to-transparent blur-[150px] pointer-events-none -z-10" />

      {/* Header Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a1e15] border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold uppercase tracking-widest shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Online Herbal Dispensary</span>
          </div>

          <h1 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f5f3ec]">
            Authentic Botanical Formulations & Natural Remedies
          </h1>

          <p className="text-sm sm:text-base text-[#a6b6ad] leading-relaxed">
            Every tincture, topical balm, medicinal resin, and botanical tea is compounded in our clinical laboratory from certified organic and wildcrafted herbs.
          </p>
        </div>
      </section>

      {/* Promo & Guarantees Bar */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#0d261a] to-[#07170f] border border-[#d4af37]/40 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#d4af37] block">Free Express Shipping</span>
              <p className="text-[11px] text-[#a6b6ad]">On all orders over $60 in amber UV glass</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-[#0d261a] to-[#07170f] border border-[#d4af37]/40 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#d4af37] block">Active Promo Codes</span>
              <p className="text-[11px] text-[#a6b6ad]">
                Use <code className="text-white font-mono bg-black/40 px-1 rounded">HERBAL10</code> for 10% off
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-[#0d261a] to-[#07170f] border border-[#d4af37]/40 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#d4af37] block">Lab-Certified Purity</span>
              <p className="text-[11px] text-[#a6b6ad]">Zero heavy metals, solvent-free cold extraction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Herbal Shop Component */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <HerbalShop onAddToCart={onAddToCart} onOpenBooking={onOpenBooking} />
      </section>

      {/* The Safi Apothecary Quality Standards */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#091a13] to-[#040b07] border border-[#d4af37]/40 shadow-2xl space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              Pharmacopeia Standards
            </span>
            <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec] mt-1">
              How We Formulate Our Botanical Medicines
            </h2>
            <p className="text-xs sm:text-sm text-[#8da396] mt-2">
              Unlike mass commercial supplements that rely on chemical synthetics and fillers, every Safi batch adheres to ancient unrefined processing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#081810] border border-[#234b3c] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="font-serif-classic font-bold text-base text-[#f5f3ec]">
                Slow Artisan Maceration
              </h3>
              <p className="text-xs text-[#a6b6ad] leading-relaxed">
                Tinctures are extracted over 6 to 8 weeks in dark glass demijohns, allowing the full phytochemical spectrum of volatile oils, flavonoids, and bitter glycosides to harmonize.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#081810] border border-[#234b3c] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif-classic font-bold text-base text-[#f5f3ec]">
                ICP-MS Heavy Metal Testing
              </h3>
              <p className="text-xs text-[#a6b6ad] leading-relaxed">
                Every shipment of wildcrafted Himalayan Shilajit, Black Seed, and Frankincense resin is tested down to parts-per-billion for lead, arsenic, cadmium, and mercury.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#081810] border border-[#234b3c] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif-classic font-bold text-base text-[#f5f3ec]">
                Biophotonic Amber Packaging
              </h3>
              <p className="text-xs text-[#a6b6ad] leading-relaxed">
                We store all preparations in European Miron and amber glass bottles to shield fragile botanical actives from harmful UV light degradation without chemical preservatives.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1b3b2f] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-xs text-[#a6b6ad]">
              Unsure which remedy is suitable for your condition? Consult our clinical herbalists directly.
            </p>
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-semibold text-xs tracking-wide shadow-md hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Formulation Consultation</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
