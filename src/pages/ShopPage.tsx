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
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

interface ShopPageProps {
  onAddToCart: (product: HerbalProduct, quantity?: number) => void;
  onOpenBooking: () => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  onAddToCart,
  onOpenBooking,
}) => {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const standardIcons = [
    <Droplets key="drop" className="w-5 h-5" />,
    <ShieldCheck key="shield" className="w-5 h-5" />,
    <Award key="award" className="w-5 h-5" />,
  ];

  return (
    <div className="pt-28 lg:pt-36 pb-20 min-h-screen bg-[#081610] text-[#F4F0E6] selection:bg-[#D4AF37] selection:text-[#081610]">
      {/* Editorial Header */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
            {t.shop.pageKicker}
          </p>

          <h1 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F0E6]">
            {t.shop.pageTitle}
          </h1>

          <p className="text-sm sm:text-base text-[#A6B8AE] leading-relaxed">
            {t.shop.pageSub}
          </p>
        </div>
      </section>

      {/* Concise Dispensary Assurances */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0C2117] border border-[#1D3B2C] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/12 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#F4F0E6] block">
                {t.shop.dispatchTitle}
              </span>
              <p className="text-[11px] text-[#A6B8AE]">
                {t.shop.dispatchFreePrefix}{' '}
                <span dir="ltr" className="font-semibold text-[#D4AF37] inline-block">
                  {formatPrice(60, { compactDecimals: true })}
                </span>{' '}
                {t.shop.dispatchFreeSuffix}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0C2117] border border-[#1D3B2C] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/12 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#F4F0E6] block">
                {t.shop.promoTitle}
              </span>
              <p className="text-[11px] text-[#A6B8AE]">
                {t.shop.promoSubPrefix}{' '}
                <code
                  dir="ltr"
                  className="text-[#D4AF37] font-mono font-bold bg-[#06110C] px-1.5 py-0.5 rounded inline-block"
                >
                  HERBAL10
                </code>{' '}
                {t.shop.promoSubSuffix}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0C2117] border border-[#1D3B2C] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/12 flex items-center justify-center text-[#D4AF37] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#F4F0E6] block">
                {t.shop.purityTitle}
              </span>
              <p className="text-[11px] text-[#A6B8AE]">{t.shop.puritySub}</p>
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
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0C2117] border border-[#1D3B2C] shadow-xl space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              {t.shop.standardsKicker}
            </span>
            <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6] mt-1">
              {t.shop.standardsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.shop.standards.map((std, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#06110C] border border-[#1D3B2C] space-y-2.5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#06110C] flex items-center justify-center">
                  {standardIcons[idx] || standardIcons[0]}
                </div>
                <h3 className="font-serif-classic font-bold text-base text-[#F4F0E6]">
                  {std.title}
                </h3>
                <p className="text-xs text-[#A6B8AE] leading-relaxed">{std.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#1D3B2C] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
            <p className="text-xs text-[#A6B8AE]">{t.shop.unsureNote}</p>
            <button
              onClick={onOpenBooking}
              className="min-h-[42px] px-5 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-xs tracking-wide transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.shop.bookConsultation}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
