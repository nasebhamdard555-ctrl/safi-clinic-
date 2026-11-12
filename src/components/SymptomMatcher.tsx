import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Leaf,
  CheckCircle2,
  Calendar,
  ShoppingBag,
  Activity,
  Heart,
  Moon,
  Wind,
  Flame,
} from 'lucide-react';
import { SYMPTOM_MATCHES, HERBAL_PRODUCTS, CONSULTATION_SERVICES } from '../data/clinicData';

interface SymptomMatcherProps {
  onSelectService: (serviceId: string) => void;
  onOpenBooking: () => void;
  onSelectProduct?: (productId: string) => void;
}

export const SymptomMatcher: React.FC<SymptomMatcherProps> = ({
  onSelectService,
  onOpenBooking,
  onSelectProduct,
}) => {
  const [selectedConcernId, setSelectedConcernId] = useState<string>('digestive');

  const activeConcern =
    SYMPTOM_MATCHES.find((s) => s.concernId === selectedConcernId) ||
    SYMPTOM_MATCHES[0];

  const matchedService = CONSULTATION_SERVICES.find(
    (s) => s.id === activeConcern.matchedServiceId
  );

  const matchedProducts = HERBAL_PRODUCTS.filter((p) =>
    activeConcern.matchedProducts.includes(p.id)
  );

  const handleBookProtocol = () => {
    onSelectService(activeConcern.matchedServiceId);
    onOpenBooking();
  };

  const getConcernIcon = (id: string) => {
    switch (id) {
      case 'digestive':
        return <Activity className="w-5 h-5" />;
      case 'pain-joints':
        return <Flame className="w-5 h-5" />;
      case 'stress-sleep':
        return <Moon className="w-5 h-5" />;
      case 'immunity-lungs':
        return <Wind className="w-5 h-5" />;
      case 'skin-dermatology':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <Heart className="w-5 h-5" />;
    }
  };

  return (
    <section id="symptoms" className="py-20 bg-[#06140e] relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d2319] border border-[#c5a059]/40 text-[#f5e6c8] text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Interactive Botanical Diagnostician</span>
          </div>
          <h2 className="font-serif-classic text-3xl sm:text-4xl font-bold text-[#f5f3ec]">
            Find Your Herbal Protocol
          </h2>
          <p className="mt-2 text-sm text-[#a6b6ad]">
            Select your health challenge below to uncover traditional botanical wisdom and targeted remedies.
          </p>
        </div>

        {/* Concern Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          {SYMPTOM_MATCHES.map((concern) => {
            const isSelected = selectedConcernId === concern.concernId;
            return (
              <button
                key={concern.concernId}
                onClick={() => setSelectedConcernId(concern.concernId)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black shadow-lg shadow-black/40 ring-2 ring-[#d4af37]/40'
                    : 'bg-[#081810] border border-[#1b3b2f] text-[#c9dad0] hover:border-[#2d5e4b]'
                }`}
              >
                {getConcernIcon(concern.concernId)}
                <span>{concern.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Protocol Card */}
        <div className="max-w-4xl mx-auto bg-[#081b12] border-2 border-[#c5a059]/60 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: Botanical Profile */}
            <div className="md:col-span-7 space-y-4">
              <span className="text-xs text-[#d4af37] font-semibold uppercase tracking-wider block">
                Recommended Holistic Protocol:
              </span>
              <h3 className="font-serif-classic text-2xl font-bold text-[#f5f3ec]">
                {activeConcern.name} Protocol
              </h3>
              <p className="text-xs sm:text-sm text-[#b8c9bf] leading-relaxed">
                {activeConcern.description}
              </p>

              {/* Verified Botanicals */}
              <div className="pt-2">
                <span className="text-[11px] text-[#8da396] font-semibold uppercase tracking-wider block mb-2">
                  Target Botanical Actives:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeConcern.recommendedHerbs.map((herb, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0e2a1d] border border-[#1b3b2f] text-xs text-[#f5e6c8]"
                    >
                      <Leaf className="w-3 h-3 text-[#d4af37]" />
                      <span>{herb}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Matched Consultation Service Link */}
              {matchedService && (
                <div className="p-3.5 rounded-xl bg-[#05130b] border border-[#1b3b2f] flex items-center justify-between text-xs mt-3">
                  <div>
                    <span className="text-[#8da396] block text-[10px]">
                      Recommended Clinical Service:
                    </span>
                    <strong className="text-[#f5f3ec] block mt-0.5">
                      {matchedService.title} (${matchedService.price})
                    </strong>
                  </div>
                  <button
                    onClick={handleBookProtocol}
                    className="px-3.5 py-1.5 rounded-lg bg-[#153a2b] text-[#d4af37] border border-[#d4af37]/40 font-semibold hover:bg-[#1c4836] flex items-center gap-1 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right: Matched Dispensary Remedies */}
            <div className="md:col-span-5 bg-[#05110a] rounded-xl p-4 border border-[#1b3b2f] space-y-3">
              <span className="text-[11px] text-[#d4af37] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Dispensary Match:</span>
              </span>

              {matchedProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-lg bg-[#081810] border border-[#1b3b2f] flex items-center gap-3"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 rounded object-cover border border-[#1b3b2f]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#f5f3ec] truncate">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-[#8da396] truncate">
                      {p.volumeOrWeight}
                    </p>
                    <span className="text-xs font-bold text-[#d4af37]">
                      ${p.price.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (onSelectProduct) onSelectProduct(p.id);
                      const shopEl = document.getElementById('shop');
                      if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2 rounded bg-[#0f2d1e] text-[#d4af37] hover:bg-[#153a2b]"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                onClick={handleBookProtocol}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs shadow-md mt-2 cursor-pointer"
              >
                Schedule Diagnostic Visit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
