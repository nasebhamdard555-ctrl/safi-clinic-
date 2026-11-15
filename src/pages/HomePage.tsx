import React, { useState } from 'react';
import {
  Calendar,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Clock,
  Phone,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { Hero } from '../components/Hero';
import { SymptomMatcher } from '../components/SymptomMatcher';
import { TestimonialsSection } from '../components/TestimonialsSection';
import {
  HERBAL_PRODUCTS,
  BLOG_POSTS,
  CLINIC_PROFILE,
  CLINIC_PRESENTATION_SLIDES,
  CLINIC_ASSETS,
} from '../data/clinicData';
import { ClinicPresentationSlide, HerbalProduct } from '../types/clinic';
import { BotanicalImage } from '../components/BotanicalImage';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

interface HomePageProps {
  onOpenBooking: (serviceId?: string) => void;
  onNavigateToTreatments: () => void;
  onNavigateToShop: () => void;
  onNavigateToBlog: () => void;
  onNavigateToAbout: () => void;
  onNavigateToContact: () => void;
  onNavigateToSymptoms?: () => void;
  onNavigateToTestimonials?: () => void;
  onNavigateToPortal?: () => void;
  onAddToCart: (product: HerbalProduct, quantity?: number) => void;
  onQuickViewProduct: (product: HerbalProduct) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenBooking,
  onNavigateToTreatments,
  onNavigateToShop,
  onNavigateToBlog,
  onNavigateToAbout,
  onNavigateToSymptoms,
  onNavigateToTestimonials,
  onNavigateToPortal,
  onAddToCart,
  onQuickViewProduct,
}) => {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const featuredShopProducts = HERBAL_PRODUCTS.filter((p) => p.isPopular).slice(0, 3);
  const recentBlogPosts = BLOG_POSTS.slice(0, 3);
  const gallerySlides = CLINIC_PRESENTATION_SLIDES.slice(0, 4);

  const activeLightboxSlide: ClinicPresentationSlide | null =
    lightboxIndex !== null ? CLINIC_PRESENTATION_SLIDES[lightboxIndex] : null;

  return (
    <div className="min-h-screen bg-[#06110C] text-[#F4F0E6] relative selection:bg-[#D4AF37] selection:text-[#06110C]">
      {/* Hero Section */}
      <Hero
        onOpenBooking={() => onOpenBooking()}
        onNavigateToShop={onNavigateToShop}
        onNavigateToBlog={onNavigateToBlog}
      />

      {/* Faith & Healing Epigraph */}
      <section className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] text-center space-y-2.5">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block">
            {t.brand.clinicName}
          </span>
          <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6]" dir="rtl">
            {CLINIC_PROFILE.faithAndHealing.arabic}
          </h2>
          <p className="text-sm sm:text-base text-[#D4AF37] font-medium">
            {t.brand.epigraphTranslation}
          </p>
        </div>
      </section>

      {/* 3 Systems of Medicine */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#173024]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold block mb-1">
              {t.home.systemsKicker}
            </span>
            <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6]">
              {t.home.systemsHeading}
            </h2>
          </div>
          <button
            onClick={onNavigateToAbout}
            className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1.5 cursor-pointer self-start md:self-auto min-h-[40px]"
          >
            <span>{t.home.founderProfileLink}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.systems.map((sys, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] flex flex-col justify-between space-y-4 hover:border-[#D4AF37]/50 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif-classic text-2xl font-bold text-[#D4AF37]">
                    {sys.code || `0${idx + 1}.`}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#A6B8AE]">
                    {sys.tagline}
                  </span>
                </div>
                <h3 className="font-serif-classic font-bold text-xl text-[#F4F0E6]">
                  {sys.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#C2D1C8] leading-relaxed">
                  {sys.description}
                </p>
                <ul className="space-y-1.5 text-xs text-[#A6B8AE] pt-3 border-t border-[#173024]">
                  {sys.principles.map((p, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="text-[#D4AF37] font-bold">·</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8 Outpatient Clinical Services */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#173024]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold block mb-1">
              {t.home.servicesKicker}
            </span>
            <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6]">
              {t.home.servicesHeading}
            </h2>
          </div>
          <button
            onClick={onNavigateToTreatments}
            className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1.5 cursor-pointer self-start sm:self-auto min-h-[40px]"
          >
            <span>{t.home.allFeesLink}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {t.scopeOfServices.map((srv, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#0B1D14] border border-[#1D3B2C] flex items-start gap-4 hover:border-[#D4AF37]/60 transition-colors"
            >
              <span className="font-serif-classic text-sm font-bold text-[#D4AF37] w-10 h-10 rounded-lg bg-[#06110C] border border-[#1D3B2C] flex items-center justify-center shrink-0">
                {srv.code || 'SN.'}
              </span>
              <div className="min-w-0">
                <h3 className="font-serif-classic font-bold text-sm text-[#F4F0E6]">
                  {srv.title}
                </h3>
                <p className="text-xs text-[#A6B8AE] mt-1 leading-relaxed">
                  {srv.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Dispensary Formulations */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#173024]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold block mb-1">
              {t.home.dispensaryKicker}
            </span>
            <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6]">
              {t.home.dispensaryHeading}
            </h2>
          </div>

          <button
            onClick={onNavigateToShop}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-wider cursor-pointer self-start sm:self-auto min-h-[40px]"
          >
            <span>{t.home.browseCategoriesLink}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredShopProducts.map((product) => {
            const locProd = t.productsMap[product.id];
            return (
              <div
                key={product.id}
                className="rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] hover:border-[#D4AF37]/70 transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#06110C]">
                  <BotanicalImage
                    src={product.image}
                    alt={locProd?.name || product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <span className="text-[11px] font-semibold text-[#D4AF37] truncate">
                        {t.shop.productCategories[product.category] || product.category}
                      </span>
                      <div className="flex items-center gap-1 text-[#D4AF37] shrink-0">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold text-[#F4F0E6] tabular-nums">{product.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-serif-classic font-bold text-lg text-[#F4F0E6]">
                      {locProd?.name || product.name}
                    </h3>
                    <p className="text-xs text-[#A6B8AE] line-clamp-2 leading-relaxed">
                      {locProd?.shortDescription || product.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#173024] flex items-center justify-between gap-2">
                    <div dir="ltr" className="flex items-baseline flex-wrap gap-1.5">
                      <span className="text-lg sm:text-xl font-bold text-[#D4AF37] font-serif-classic tabular-nums">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-[#6E8478] line-through tabular-nums">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onQuickViewProduct(product)}
                        className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#06110C] border border-[#1D3B2C] hover:border-[#D4AF37] text-xs font-semibold text-[#F4F0E6] cursor-pointer transition-colors"
                      >
                        {t.home.detailsBtn}
                      </button>
                      <button
                        onClick={() => onAddToCart(product, 1)}
                        className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{t.home.addBtn}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Symptom Matcher */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#173024]">
        <div className="pt-6 flex justify-end">
          {onNavigateToSymptoms && (
            <button
              onClick={onNavigateToSymptoms}
              className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer min-h-[36px]"
            >
              <span>{t.home.fullTriageLink}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          )}
        </div>
        <SymptomMatcher
          onSelectService={(serviceId) => onOpenBooking(serviceId)}
          onOpenBooking={() => onOpenBooking()}
          onSelectProduct={() => onNavigateToShop()}
        />
      </section>

      {/* Kabul Consultation Room & Clinic Profile Gallery */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#173024]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-[#1D3B2C] bg-[#0B1D14]">
            <BotanicalImage
              src={CLINIC_ASSETS.clinicConsultationImg}
              alt={t.brand.clinicName}
              className="w-full h-full min-h-[240px] object-cover"
            />
          </div>
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] flex flex-col justify-between space-y-5">
            <div className="space-y-2.5">
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold block">
                {t.home.insideClinicKicker}
              </span>
              <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6]">
                {t.home.insideClinicHeading}
              </h2>
              <p className="text-xs sm:text-sm text-[#C2D1C8] leading-relaxed">
                {t.brand.founderBio} {t.home.insideClinicBody}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#173024]">
              <span className="text-xs text-[#A6B8AE]">
                {t.brand.clinicAddress}
              </span>
              <button
                onClick={onNavigateToAbout}
                className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>
                  {t.home.viewGalleryBtn} ({CLINIC_PRESENTATION_SLIDES.length} {t.home.documentsWord})
                </span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gallerySlides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setLightboxIndex(idx)}
              className="group text-start rounded-xl bg-[#0B1D14] border border-[#1D3B2C] hover:border-[#D4AF37] overflow-hidden flex flex-col cursor-pointer transition-all"
            >
              <div className="relative aspect-[4/3] w-full bg-white p-1.5 overflow-hidden">
                <BotanicalImage
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
                />
                <span className="absolute bottom-2 end-2 p-1.5 rounded-lg bg-[#06110C]/85 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="p-3.5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold block">
                  {slide.category}
                </span>
                <h3 className="font-serif-classic font-bold text-sm text-[#F4F0E6]">
                  {slide.title}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Remedy Monographs */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#173024]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold block mb-1">
              {t.home.journalKicker}
            </span>
            <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6]">
              {t.home.journalHeading}
            </h2>
          </div>

          <button
            onClick={onNavigateToBlog}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-wider cursor-pointer self-start sm:self-auto min-h-[40px]"
          >
            <span>{t.home.allArticlesBtn}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentBlogPosts.map((post) => (
            <article
              key={post.id}
              onClick={onNavigateToBlog}
              className="rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] hover:border-[#D4AF37]/70 transition-all overflow-hidden flex flex-col justify-between group cursor-pointer"
            >
              <div className="relative aspect-video overflow-hidden bg-[#06110C]">
                <BotanicalImage
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2.5 end-2.5 px-2.5 py-0.5 rounded bg-[#06110C]/90 border border-[#1D3B2C] text-[10px] text-[#F4F0E6] inline-flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#D4AF37]" />
                  {post.readTime}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37]">
                    {post.category}
                  </span>
                  <h3 className="font-serif-classic font-bold text-base text-[#F4F0E6] leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#A6B8AE] line-clamp-2 leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#173024] flex items-center justify-between text-[11px] text-[#A6B8AE]">
                  <span className="font-semibold text-[#F4F0E6]">{post.author.name}</span>
                  <span className="text-[#D4AF37] font-semibold flex items-center gap-1">
                    {t.home.readBtn} <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Patient Portal Banner */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold block">
              {t.home.portalKicker}
            </span>
            <h2 className="font-serif-classic text-xl sm:text-2xl font-bold text-[#F4F0E6]">
              {t.home.portalHeading}
            </h2>
            <p className="text-xs sm:text-sm text-[#A6B8AE]">
              {t.home.portalBody}
            </p>
          </div>
          {onNavigateToPortal && (
            <button
              onClick={onNavigateToPortal}
              className="min-h-[44px] px-5 py-3 rounded-lg bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shrink-0"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t.home.portalBtn}</span>
            </button>
          )}
        </div>
      </section>

      {/* Patient Stories */}
      <section className="border-t border-[#173024]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex justify-end">
          {onNavigateToTestimonials && (
            <button
              onClick={onNavigateToTestimonials}
              className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer uppercase tracking-wider min-h-[36px]"
            >
              <span>{t.home.allStoriesLink}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          )}
        </div>
        <TestimonialsSection
          onOpenBooking={(serviceId) => onOpenBooking(serviceId)}
          variant="dark"
        />
      </section>

      {/* Conversion Anchor */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-2xl bg-[#0B1D14] border border-[#D4AF37]/30 text-[#F4F0E6] text-center space-y-5">
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold block">
            {t.brand.clinicAddress}
          </span>
          <h2 className="font-serif-classic text-2xl sm:text-4xl font-bold max-w-2xl mx-auto">
            {t.home.ctaHeading}
          </h2>
          <p className="text-xs sm:text-sm text-[#C2D1C8] max-w-xl mx-auto">
            {t.brand.hoursPolicy}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenBooking()}
              className="w-full sm:w-auto min-h-[44px] px-7 py-3 rounded-lg bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.hero.scheduleCta}</span>
            </button>

            <a
              href={`tel:${CLINIC_PROFILE.phone}`}
              className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-lg bg-[#06110C] border border-[#1D3B2C] hover:border-[#D4AF37] text-xs font-semibold text-[#F4F0E6] flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <span>{t.home.callWhatsappPrefix}</span>
              <span dir="ltr">{CLINIC_PROFILE.formattedPhone}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Official Clinic Deck */}
      {activeLightboxSlide && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-4xl bg-[#0B1D14] text-[#F4F0E6] border border-[#1D3B2C] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-[#1D3B2C] bg-[#06110C]">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#D4AF37]">
                  {activeLightboxSlide.category}
                </span>
                <h3 className="font-serif-classic font-bold text-base text-[#F4F0E6]">
                  {activeLightboxSlide.title}
                </h3>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                aria-label={t.home.closeGalleryAria}
                className="min-w-[40px] min-h-[40px] p-1.5 rounded-lg bg-[#0B1D14] border border-[#1D3B2C] text-[#F4F0E6] hover:text-[#D4AF37] flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 bg-[#040B08] flex items-center justify-center relative flex-1 min-h-0">
              <BotanicalImage
                src={activeLightboxSlide.image}
                alt={activeLightboxSlide.title}
                className="max-h-[60vh] max-w-full object-contain rounded-lg bg-white p-2"
              />
            </div>

            <div className="p-4 border-t border-[#1D3B2C] bg-[#06110C] flex items-center justify-between gap-4 text-xs">
              <p className="text-[#C2D1C8] line-clamp-2">{activeLightboxSlide.description}</p>
              <div className="flex items-center gap-2 shrink-0" dir="ltr">
                <button
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev === null
                        ? 0
                        : prev === 0
                        ? CLINIC_PRESENTATION_SLIDES.length - 1
                        : prev - 1
                    )
                  }
                  aria-label="Previous photo"
                  className="min-w-[40px] min-h-[40px] p-2 rounded-lg bg-[#0B1D14] border border-[#1D3B2C] text-[#F4F0E6] hover:border-[#D4AF37] flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono text-[11px] text-[#A6B8AE] tabular-nums">
                  {lightboxIndex + 1}/{CLINIC_PRESENTATION_SLIDES.length}
                </span>
                <button
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev === null
                        ? 0
                        : prev === CLINIC_PRESENTATION_SLIDES.length - 1
                        ? 0
                        : prev + 1
                    )
                  }
                  aria-label="Next photo"
                  className="min-w-[40px] min-h-[40px] p-2 rounded-lg bg-[#0B1D14] border border-[#1D3B2C] text-[#F4F0E6] hover:border-[#D4AF37] flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
