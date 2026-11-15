import React from 'react';
import {
  Calendar,
  ShoppingBag,
  ArrowRight,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { CLINIC_PROFILE, CLINIC_ASSETS } from '../data/clinicData';
import { BotanicalImage } from './BotanicalImage';
import { useLanguage } from '../context/LanguageContext';

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
  const { language, t } = useLanguage();

  return (
    <section
      id="hero"
      className="relative pt-24 lg:pt-32 pb-14 lg:pb-20 bg-[#06110C] text-[#F4F0E6] border-b border-[#173024] bg-grain"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Editorial Value Proposition & Direct Clinic Utility */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#D4AF37]">
                {t.brand.tagline} · {t.brand.cityCountry}
              </p>

              <h1 className="font-serif-classic text-3xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-[#F4F0E6] leading-[1.12] max-w-2xl">
                {t.hero.headlineTop}{' '}
                <span className="block mt-1.5 font-serif-editorial italic font-normal gold-gradient-text">
                  {t.hero.headlineAccent}
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#C2D1C8] max-w-xl leading-relaxed">
                {t.hero.welcomePrefix}{' '}
                <strong className="font-semibold text-[#F4F0E6]">{t.brand.clinicName}</strong>{' '}
                {language === 'en' && (
                  <span className="text-[#D4AF37]" dir="rtl">({CLINIC_PROFILE.pashtoName})</span>
                )}
                . {t.hero.directedByPrefix}{' '}
                <strong className="font-semibold text-[#F4F0E6]">{t.brand.founderName}</strong>،{' '}
                {t.hero.descriptionSuffix}
              </p>
            </div>

            <div className="space-y-5 pt-2">
              {/* Concise Operational Hours & Kabul Location Strip */}
              <div className="w-full max-w-xl p-4 rounded-xl bg-[#0B1D14] border border-[#1D3B2C] space-y-2 text-xs text-[#C2D1C8]">
                <div className="flex items-center gap-2 font-semibold text-[#F4F0E6]">
                  <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>{t.brand.hoursPolicy}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[#A6B8AE]">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    {t.brand.clinicAddress}
                  </span>
                  <a
                    href={`tel:${CLINIC_PROFILE.phone}`}
                    dir="ltr"
                    className="inline-flex items-center gap-1.5 text-[#D4AF37] font-semibold hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    {CLINIC_PROFILE.formattedPhone}
                  </a>
                </div>
              </div>

              {/* Primary Action Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={onOpenBooking}
                  className="flex items-center justify-center gap-2.5 min-h-[46px] px-7 py-3 rounded-lg bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-sm tracking-wide transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>{t.hero.scheduleCta}</span>
                  <ArrowRight className="w-4 h-4 shrink-0 rtl:rotate-180" />
                </button>

                <button
                  onClick={onNavigateToShop}
                  className="flex items-center justify-center gap-2.5 min-h-[46px] px-6 py-3 rounded-lg bg-[#0C1E15] border border-[#1D3B2C] hover:border-[#D4AF37] text-[#F4F0E6] font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>{t.hero.dispensaryCta}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Dark Emerald & Gold Apothecary Showcase */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] p-4 sm:p-5 shadow-2xl flex-1 flex flex-col justify-between space-y-4">
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#254736] bg-[#06110C]">
                <BotanicalImage
                  src={CLINIC_ASSETS.heroApothecaryImg}
                  alt={t.brand.clinicName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="pt-1 pb-3 border-b border-[#1D3B2C] flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif-classic text-base font-bold text-[#F4F0E6]">
                    {t.brand.founderName}
                  </p>
                  <p className="text-xs text-[#D4AF37] font-medium mt-0.5">
                    {t.brand.founderTitle} · {t.brand.foundedText}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] text-[#A6B8AE] shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {t.brand.mophShort}
                </span>
              </div>

              {/* 2-Column Editorial Key Facts */}
              <div className="grid grid-cols-2 gap-3 text-start">
                <div className="p-3 rounded-xl bg-[#06110C] border border-[#1A3527]">
                  <span className="font-serif-classic font-bold text-sm text-[#D4AF37] block tabular-nums">
                    {t.hero.modalitiesCount}
                  </span>
                  <p className="text-[11px] text-[#A6B8AE] mt-0.5">
                    {t.hero.modalitiesDesc}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#06110C] border border-[#1A3527]">
                  <span className="font-serif-classic font-bold text-sm text-[#D4AF37] block tabular-nums">
                    {t.hero.formulasCount}
                  </span>
                  <p className="text-[11px] text-[#A6B8AE] mt-0.5">
                    {t.hero.formulasDesc}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1D3B2C] flex items-center justify-between text-xs gap-2">
                <span className="text-[#8FA699]">{t.hero.lookingForGuide}</span>
                <button
                  onClick={onNavigateToBlog}
                  className="text-[#D4AF37] font-semibold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>{t.hero.remedyGuideLink}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
