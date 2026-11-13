import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Leaf,
  Calendar,
  ShoppingBag,
  Activity,
  Heart,
  Moon,
  Wind,
  Flame,
} from 'lucide-react';
import { SYMPTOM_MATCHES, HERBAL_PRODUCTS, CONSULTATION_SERVICES } from '../data/clinicData';
import { BotanicalImage } from './BotanicalImage';

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
        return <Activity className="w-4 h-4" />;
      case 'pain-joints':
        return <Flame className="w-4 h-4" />;
      case 'stress-sleep':
        return <Moon className="w-4 h-4" />;
      case 'immunity-lungs':
        return <Wind className="w-4 h-4" />;
      case 'skin-dermatology':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Heart className="w-4 h-4" />;
    }
  };

  return (
    <section id="symptoms" className="py-12 bg-[#F5F2EB] text-[#141815]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-8">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#8C5A32] block mb-1">
            Interactive Botanical Guide
          </span>
          <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#141815]">
            Match Symptoms to Clinic Formulations
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[#4E544F]">
            Select an outpatient focus area to review classical herbs, recommended consultation paths, and targeted remedies.
          </p>
        </div>

        {/* Concern Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {SYMPTOM_MATCHES.map((concern) => {
            const isSelected = selectedConcernId === concern.concernId;
            return (
              <button
                key={concern.concernId}
                onClick={() => setSelectedConcernId(concern.concernId)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#141815] text-[#F5F2EB]'
                    : 'bg-[#EAE5DA] border border-[#D4CEC2] text-[#2D332E] hover:border-[#8C5A32]'
                }`}
              >
                {getConcernIcon(concern.concernId)}
                <span>{concern.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Protocol Card */}
        <div className="bg-[#EAE5DA] border border-[#D4CEC2] rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: Botanical Profile */}
            <div className="md:col-span-7 space-y-4">
              <span className="text-xs text-[#8C5A32] font-bold uppercase tracking-wider block">
                Protocol Summary
              </span>
              <h3 className="font-serif-classic text-2xl font-bold text-[#141815]">
                {activeConcern.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#3D433E] leading-relaxed">
                {activeConcern.description}
              </p>

              <div className="pt-1">
                <span className="text-[11px] text-[#4E544F] font-semibold uppercase tracking-wider block mb-2">
                  Key Botanicals
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeConcern.recommendedHerbs.map((herb, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F5F2EB] border border-[#D4CEC2] text-xs text-[#141815]"
                    >
                      <Leaf className="w-3 h-3 text-[#8C5A32]" />
                      <span>{herb}</span>
                    </span>
                  ))}
                </div>
              </div>

              {matchedService && (
                <div className="p-3.5 rounded-xl bg-[#F5F2EB] border border-[#D4CEC2] flex items-center justify-between text-xs mt-3 gap-4">
                  <div>
                    <span className="text-[#6A706B] block text-[10px] uppercase tracking-wider">
                      Recommended Visit
                    </span>
                    <strong className="text-[#141815] block mt-0.5">
                      {matchedService.title} (${matchedService.price})
                    </strong>
                  </div>
                  <button
                    onClick={handleBookProtocol}
                    className="px-3.5 py-2 rounded-lg bg-[#8C5A32] hover:bg-[#704625] text-[#FAF7F2] font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right: Matched Dispensary Remedies */}
            <div className="md:col-span-5 bg-[#F5F2EB] rounded-xl p-4 border border-[#D4CEC2] space-y-3">
              <span className="text-[11px] text-[#8C5A32] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Dispensary Formulations</span>
              </span>

              {matchedProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-lg bg-[#EAE5DA] border border-[#D4CEC2] flex items-center gap-3"
                >
                  <BotanicalImage
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 rounded object-cover border border-[#C6BEB0] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#141815] truncate">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-[#4E544F] truncate">
                      {p.volumeOrWeight}
                    </p>
                    <span className="text-xs font-bold text-[#8C5A32]">
                      ${p.price.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (onSelectProduct) onSelectProduct(p.id);
                    }}
                    className="p-2 rounded-lg bg-[#141815] text-[#F5F2EB] hover:bg-[#8C5A32] transition-colors cursor-pointer"
                    aria-label={`View ${p.name} in shop`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <button
                onClick={handleBookProtocol}
                className="w-full py-2.5 rounded-lg bg-[#141815] hover:bg-[#8C5A32] text-[#F5F2EB] font-bold text-xs shadow-sm mt-2 cursor-pointer transition-colors"
              >
                Schedule Clinical Evaluation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
