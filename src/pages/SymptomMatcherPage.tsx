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
  Search,
  Filter,
  HelpCircle,
  Clock,
  Compass,
  AlertCircle,
} from 'lucide-react';
import { SYMPTOM_MATCHES, HERBAL_PRODUCTS, CONSULTATION_SERVICES, CLINIC_PROFILE } from '../data/clinicData';
import { HerbalProduct } from '../types/clinic';
import { BotanicalImage } from '../components/BotanicalImage';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

interface SymptomMatcherPageProps {
  onOpenBooking: (serviceId?: string) => void;
  onNavigateToShop: () => void;
  onAddToCart: (product: HerbalProduct, quantity?: number) => void;
  onQuickViewProduct: (product: HerbalProduct) => void;
}

export const SymptomMatcherPage: React.FC<SymptomMatcherPageProps> = ({
  onOpenBooking,
  onNavigateToShop,
  onAddToCart,
  onQuickViewProduct,
}) => {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [selectedConcernId, setSelectedConcernId] = useState<string>('digestive');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [temperamentFilter, setTemperamentFilter] = useState<string>('all');

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

  const getConcernIcon = (id: string) => {
    switch (id) {
      case 'digestive':
        return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'pain-joints':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'stress-sleep':
        return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'immunity-lungs':
        return <Wind className="w-5 h-5 text-teal-400" />;
      case 'skin-dermatology':
        return <Sparkles className="w-5 h-5 text-pink-400" />;
      default:
        return <Heart className="w-5 h-5 text-rose-400" />;
    }
  };

  const humoralTemperamentGuides = [
    {
      mizaj: 'Dam (Sanguine / Hot & Moist)',
      qualities: 'Warm body, ruddy complexion, active digestion, prone to arterial hypertension & metabolic heat',
      recommendedHerbs: 'FloraSoothe Spearmint, Hibiscus, Coriander seed infusion',
    },
    {
      mizaj: 'Safra (Choleric / Hot & Dry)',
      qualities: 'Sharp pulse, quick irritability, acid reflux, prone to inflammatory skin flare-ups & liver heat',
      recommendedHerbs: 'Pure Neem restorative salve, Licorice root, Rose petal cold extract',
    },
    {
      mizaj: 'Balgham (Phlegmatic / Cold & Moist)',
      qualities: 'Sluggish circulation, morning lethargy, mucus congestion, fluid retention & low metabolic rate',
      recommendedHerbs: 'Himalayan Shilajit pitch, Ginger root decoction, Black Seed oil',
    },
    {
      mizaj: 'Sawda (Melancholic / Cold & Dry)',
      qualities: 'Anxious thoughts, chronic insomnia, dry brittle joints, hyper-vigilance & digestive spasm',
      recommendedHerbs: 'Saffron & KSM-66 Ashwagandha tonic, Chamomile blossoms, Sweet almond oil',
    },
  ];

  return (
    <div className="pt-24 lg:pt-32 pb-24 min-h-screen bg-[#061412] text-[#F4F0E6] relative overflow-x-hidden selection:bg-[#D4AF37] selection:text-[#06110C]">
      {/* Page Ambient Dark Emerald & Gold Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1100px] h-[550px] bg-gradient-to-b from-emerald-600/20 via-[#0B1D14]/20 to-transparent blur-[150px] pointer-events-none -z-10" />

      {/* Header Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#082830] border border-[#06b6d4]/50 text-[#22d3ee] text-xs font-semibold uppercase tracking-widest shadow-md">
            <Compass className="w-3.5 h-3.5 text-[#fde047]" />
            <span>{t.symptoms.pageBadge}</span>
          </div>

          <h1 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f5f3ec]">
            {t.symptoms.pageHeading}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] via-[#fde047] to-[#14b8a6]">
              {t.symptoms.pageAccent}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed">
            {t.symptoms.pageSub}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-[#94a3b8]">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <ShieldCheck className="w-4 h-4 text-[#06b6d4]" />
              {t.symptoms.nonInvasiveBadge}
            </span>
            <span className="text-[#155e75]">·</span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <Activity className="w-4 h-4 text-[#fde047]" />
              {t.symptoms.formulatedByBadge}
            </span>
          </div>
        </div>
      </section>

      {/* Primary Concern Tabs */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {SYMPTOM_MATCHES.map((concern) => {
            const isSelected = selectedConcernId === concern.concernId;
            const cName = t.symptomsMap[concern.concernId]?.name ?? concern.name;
            return (
              <button
                key={concern.concernId}
                onClick={() => setSelectedConcernId(concern.concernId)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#06b6d4] to-[#0e7490] text-black font-bold shadow-cyan-950/60 ring-2 ring-[#06b6d4]/50'
                    : 'bg-[#06242c] text-[#cbd5e1] border border-[#0e4856] hover:border-[#06b6d4]/40 hover:text-white'
                }`}
              >
                {getConcernIcon(concern.concernId)}
                <span>{cName}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Concern Comprehensive Dossier Card */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#06242c] border border-[#0e4856] shadow-2xl space-y-8">
          {/* Top Row: Concern Details */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#0e4856] pb-8">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a3540] text-[11px] font-bold text-[#22d3ee] uppercase tracking-wider">
                <span>{t.symptoms.clinicalProfilePrefix} {activeName}</span>
              </div>
              <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec]">
                {activeDesc}
              </h2>
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                {t.symptoms.unaniContext}
              </p>
            </div>

            {/* Recommended Clinic Consultation Button */}
            {matchedService && (
              <div className="p-5 rounded-2xl bg-[#041d24] border border-[#0e4856] shrink-0 text-center space-y-3 max-w-xs">
                <span className="text-[10px] uppercase tracking-widest text-[#22d3ee] font-bold block">
                  {t.symptoms.recommendedConsult}
                </span>
                <h4 className="font-serif-classic font-bold text-sm text-[#f5f3ec]">
                  {t.servicesMap[matchedService.id]?.title ?? matchedService.title}
                </h4>
                <div className="flex items-center justify-center gap-2">
                  <span dir="ltr" className="text-lg font-bold text-[#fde047] tabular-nums">
                    {formatPrice(matchedService.price, { compactDecimals: true })}
                  </span>
                  <span className="text-[11px] text-[#94a3b8]">
                    ({t.servicesMap[matchedService.id]?.duration ?? matchedService.duration})
                  </span>
                </div>
                <button
                  onClick={() => onOpenBooking(matchedService.id)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#0891b2] text-black font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t.symptoms.bookThisVisit}</span>
                </button>
              </div>
            )}
          </div>

          {/* Key Recommended Herbs & Botanical Action Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#041d24] border border-[#0e4856] space-y-4">
              <h3 className="font-serif-classic font-bold text-sm text-[#fde047] uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22d3ee]" />
                <span>{t.symptoms.targetedCompounds}</span>
              </h3>
              <ul className="space-y-2 text-xs text-[#cbd5e1]">
                {activeHerbs.map((herb: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-[#22d3ee] font-bold mt-0.5">•</span>
                    <span>{herb}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-[#041d24] border border-[#0e4856] space-y-4">
              <h3 className="font-serif-classic font-bold text-sm text-[#fde047] uppercase tracking-wider flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>{t.symptoms.personalizedRegimen}</span>
              </h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                {t.symptoms.regimenDesc}
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-[#22d3ee]">
                <Clock className="w-3.5 h-3.5" />
                <span>{t.symptoms.typicalWindow}</span>
              </div>
            </div>
          </div>

          {/* Matching Products Section */}
          <div className="space-y-4 pt-4 border-t border-[#0e4856]">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#fde047] font-bold">
                  {t.symptoms.compoundedRemediesKicker}
                </span>
                <h3 className="font-serif-classic text-xl font-bold text-[#f5f3ec]">
                  {t.symptoms.targetedProductsFor} {activeName}
                </h3>
              </div>
              <button
                onClick={onNavigateToShop}
                className="text-xs font-semibold text-[#22d3ee] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{t.symptoms.viewFullDispensary}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {matchedProducts.map((prod) => {
                const pLoc = t.productsMap[prod.id];
                const pName = pLoc?.name ?? prod.name;
                const pShort = pLoc?.shortDescription ?? prod.shortDescription;
                const pCat = t.shop.productCategories[prod.category] ?? prod.category;
                return (
                  <div
                    key={prod.id}
                    className="rounded-2xl bg-[#041d24] border border-[#0e4856] hover:border-[#22d3ee]/60 transition-all p-5 flex flex-col justify-between space-y-4 shadow-lg group"
                  >
                    <div className="flex items-start gap-3.5">
                      <BotanicalImage
                        src={prod.image}
                        alt={pName}
                        className="w-16 h-16 rounded-xl object-cover border border-[#0e4856] group-hover:scale-105 transition-transform shrink-0"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#22d3ee] uppercase">
                          {pCat}
                        </span>
                        <h4 className="font-serif-classic font-bold text-sm text-[#f5f3ec] leading-snug">
                          {pName}
                        </h4>
                        <p className="text-[11px] text-[#94a3b8] line-clamp-2">
                          {pShort}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#0e4856] flex items-center justify-between">
                      <span dir="ltr" className="text-base font-bold text-[#fde047] font-serif-classic tabular-nums">
                        {formatPrice(prod.price)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onQuickViewProduct(prod)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#082e38] text-[11px] text-[#cbd5e1] hover:text-white border border-[#0e4856] cursor-pointer"
                        >
                          {t.symptoms.dossierBtn}
                        </button>
                        <button
                          onClick={() => onAddToCart(prod, 1)}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#22d3ee] to-[#0891b2] text-black font-bold text-[11px] hover:brightness-110 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>{t.shop.addBtn}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Humoral Temperament Reference Matrix */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#06242c] border border-[#0e4856] shadow-2xl space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#fde047] font-bold">
              {t.symptoms.mizajSectionKicker}
            </span>
            <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec]">
              {t.symptoms.mizajSectionTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8]">
              {t.symptoms.mizajSectionSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
            {t.symptoms.mizajGuides.map((guide, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#041d24] border border-[#0e4856] space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-serif-classic font-bold text-sm text-[#fde047]">
                    {guide.mizaj}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#0a3540] text-[#22d3ee] font-semibold">
                    {t.symptoms.unaniPillarBadge}
                  </span>
                </div>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">
                  <strong className="text-[#94a3b8]">{t.symptoms.signsLabel} </strong>
                  {guide.qualities}
                </p>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">
                  <strong className="text-emerald-400">{t.symptoms.balancingLabel} </strong>
                  {guide.herbs}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Booking Conversion Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#041e26] via-[#08333e] to-[#041e26] border border-[#06b6d4]/40 shadow-2xl text-center space-y-5">
          <h2 className="font-serif-classic text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f5f3ec]">
            {t.symptoms.ctaTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#94a3b8] max-w-xl mx-auto">
            {t.symptoms.ctaSub}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenBooking()}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#0891b2] text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 cursor-pointer flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.symptoms.scheduleAssessment}</span>
            </button>
            <a
              href="https://wa.me/93780299299"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-xl bg-[#041d24] border border-[#0e4856] hover:border-[#22d3ee] text-xs text-[#f5f3ec] font-semibold transition-colors cursor-pointer flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>{t.symptoms.whatsappTriage}</span>
              <span dir="ltr">{CLINIC_PROFILE.formattedPhone}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
