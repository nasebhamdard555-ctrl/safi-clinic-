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
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

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
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [selectedConcernId, setSelectedConcernId] = useState<string>('digestive');

  const activeConcern =
    SYMPTOM_MATCHES.find((s) => s.concernId === selectedConcernId) ||
    SYMPTOM_MATCHES[0];

  const activeLoc = t.symptomsMap[activeConcern.concernId];
  const activeName = activeLoc?.name ?? activeConcern.name;
  const activeDesc = activeLoc?.description ?? activeConcern.description;
  const activeHerbs = activeLoc?.recommendedHerbs ?? activeConcern.recommendedHerbs;

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
    <section id="symptoms" className="py-12 bg-[#06110C] text-[#F4F0E6]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-8">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#D4AF37] block mb-1">
            {t.symptoms.kicker}
          </span>
          <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6]">
            {t.symptoms.title}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[#A6B8AE]">
            {t.symptoms.subtitle}
          </p>
        </div>

        {/* Concern Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {SYMPTOM_MATCHES.map((concern) => {
            const isSelected = selectedConcernId === concern.concernId;
            const cName = t.symptomsMap[concern.concernId]?.name ?? concern.name;
            return (
              <button
                key={concern.concernId}
                onClick={() => setSelectedConcernId(concern.concernId)}
                className={`flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#D4AF37] text-[#06110C]'
                    : 'bg-[#0B1D14] border border-[#1D3B2C] text-[#C2D1C8] hover:border-[#D4AF37]'
                }`}
              >
                {getConcernIcon(concern.concernId)}
                <span>{cName}</span>
              </button>
            );
          })}
        </div>

        {/* Active Protocol Card */}
        <div className="bg-[#0B1D14] border border-[#1D3B2C] rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: Botanical Profile */}
            <div className="md:col-span-7 space-y-4">
              <span className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider block">
                {t.symptoms.protocolSummary}
              </span>
              <h3 className="font-serif-classic text-2xl font-bold text-[#F4F0E6]">
                {activeName}
              </h3>
              <p className="text-xs sm:text-sm text-[#C2D1C8] leading-relaxed">
                {activeDesc}
              </p>

              <div className="pt-1">
                <span className="text-[11px] text-[#A6B8AE] font-semibold uppercase tracking-wider block mb-2">
                  {t.symptoms.keyBotanicals}
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeHerbs.map((herb, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#06110C] border border-[#1D3B2C] text-xs text-[#F4F0E6]"
                    >
                      <Leaf className="w-3 h-3 text-[#D4AF37]" />
                      <span>{herb}</span>
                    </span>
                  ))}
                </div>
              </div>

              {matchedService && (
                <div className="p-3.5 rounded-xl bg-[#06110C] border border-[#1D3B2C] flex flex-wrap sm:flex-nowrap items-center justify-between text-xs mt-3 gap-4">
                  <div>
                    <span className="text-[#8FA699] block text-[10px] uppercase tracking-wider">
                      {t.symptoms.recommendedVisit}
                    </span>
                    <strong className="text-[#F4F0E6] block mt-0.5 tabular-nums">
                      {t.servicesMap[matchedService.id]?.title ?? matchedService.title}{' '}
                      <span dir="ltr" className="inline-block">
                        ({formatPrice(matchedService.price, { compactDecimals: true })})
                      </span>
                    </strong>
                  </div>
                  <button
                    onClick={handleBookProtocol}
                    className="min-h-[38px] px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{t.symptoms.bookBtn}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right: Matched Dispensary Remedies */}
            <div className="md:col-span-5 bg-[#06110C] rounded-xl p-4 border border-[#1D3B2C] space-y-3">
              <span className="text-[11px] text-[#D4AF37] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t.symptoms.dispensaryFormulations}</span>
              </span>

              {matchedProducts.map((p) => {
                const pLoc = t.productsMap[p.id];
                const pName = pLoc?.name ?? p.name;
                const pVol = pLoc?.volumeOrWeight ?? p.volumeOrWeight;
                return (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-lg bg-[#0B1D14] border border-[#1D3B2C] flex items-center gap-3"
                  >
                    <BotanicalImage
                      src={p.image}
                      alt={pName}
                      className="w-12 h-12 rounded object-cover border border-[#254736] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#F4F0E6] truncate">
                        {pName}
                      </p>
                      <p className="text-[10px] text-[#A6B8AE] truncate">
                        {pVol}
                      </p>
                      <span dir="ltr" className="inline-block text-xs font-bold text-[#D4AF37] tabular-nums">
                        {formatPrice(p.price)}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (onSelectProduct) onSelectProduct(p.id);
                      }}
                      className="min-w-[36px] min-h-[36px] p-2 rounded-lg bg-[#132E21] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#06110C] transition-colors flex items-center justify-center cursor-pointer"
                      aria-label={pName}
                    >
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </button>
                  </div>
                );
              })}

              <button
                onClick={handleBookProtocol}
                className="w-full min-h-[42px] py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-xs shadow-sm mt-2 cursor-pointer transition-colors"
              >
                {t.symptoms.scheduleEvalBtn}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
