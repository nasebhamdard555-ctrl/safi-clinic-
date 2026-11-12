import React from 'react';
import {
  Sparkles,
  Calendar,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Award,
  CheckCircle2,
  Clock,
  Phone,
  MessageCircle,
  Activity,
  Heart,
  Droplets,
  Star,
  BookOpen,
  Leaf,
  Radio,
  User,
} from 'lucide-react';
import { Hero } from '../components/Hero';
import { SymptomMatcher } from '../components/SymptomMatcher';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { AcousticWellness } from '../components/AcousticWellness';
import {
  CONSULTATION_SERVICES,
  HERBAL_PRODUCTS,
  BLOG_POSTS,
  CLINIC_PROFILE,
  CLINIC_PRESENTATION_SLIDES,
} from '../data/clinicData';
import { HerbalProduct } from '../types/clinic';

interface HomePageProps {
  onOpenBooking: (serviceId?: string) => void;
  onNavigateToTreatments: () => void;
  onNavigateToShop: () => void;
  onNavigateToBlog: () => void;
  onNavigateToAbout: () => void;
  onNavigateToContact: () => void;
  onNavigateTo3D?: () => void;
  onNavigateToSymptoms?: () => void;
  onNavigateToSoundscapes?: () => void;
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
  onNavigateToContact,
  onNavigateTo3D,
  onNavigateToSymptoms,
  onNavigateToSoundscapes,
  onNavigateToTestimonials,
  onNavigateToPortal,
  onAddToCart,
  onQuickViewProduct,
}) => {
  // Top 3 featured services for preview
  const featuredServices = CONSULTATION_SERVICES.slice(0, 3);
  // Top 3 featured products from shop (strictly 3 as requested)
  const featuredShopProducts = HERBAL_PRODUCTS.filter((p) => p.isPopular).slice(0, 3);
  // 3 most recent blog posts about herbal remedies (strictly 3 as requested)
  const recentBlogPosts = BLOG_POSTS.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#05130d] text-[#f5f3ec] relative selection:bg-[#d4af37] selection:text-black">
      {/* Page Ambient Emerald Radiance Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-emerald-600/15 via-emerald-800/5 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <Hero
        onOpenBooking={() => onOpenBooking()}
        onNavigateToShop={onNavigateToShop}
        onNavigateToBlog={onNavigateToBlog}
      />

      {/* Emergency & Direct Triage Strip */}
      <section className="bg-gradient-to-r from-[#061810] via-[#0b291c] to-[#061810] border-y border-[#d4af37]/35 py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-[#f5f3ec]">
              {CLINIC_PROFILE.name} · {CLINIC_PROFILE.facilityType} in {CLINIC_PROFILE.city}, {CLINIC_PROFILE.country}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href="tel:+93780299299"
              className="flex items-center gap-1.5 text-[#d4af37] hover:underline font-bold"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{CLINIC_PROFILE.formattedPhone}</span>
            </a>
            <span className="text-[#1e4837]">|</span>
            <a
              href="https://wa.me/93780299299"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:underline font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Consultation</span>
            </a>
          </div>
        </div>
      </section>

      {/* Faith & Healing Banner */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#092015] to-[#040e08] border border-[#d4af37]/45 shadow-xl text-center space-y-3">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#d4af37] font-semibold block">
            Faith & Healing · د شفا او ایمان اصل
          </span>
          <h2 className="font-serif-classic text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f5f3ec] tracking-wide" dir="rtl">
            {CLINIC_PROFILE.faithAndHealing.arabic}
          </h2>
          <p className="text-sm sm:text-base text-[#d4af37] font-medium" dir="rtl">
            {CLINIC_PROFILE.faithAndHealing.pashto}
          </p>
          <p className="text-xs text-[#a6b6ad] max-w-xl mx-auto italic">
            "{CLINIC_PROFILE.faithAndHealing.english}"
          </p>
          <div className="pt-2 text-[11px] text-[#8da396] max-w-2xl mx-auto border-t border-[#1b3b2f]/60">
            At Safi Natural Care Clinic, healing is guided by ethical compassion, patient safety, and honoring the body’s innate self-healing capacity given by the Creator.
          </div>
        </div>
      </section>

      {/* 3 Systems of Medicine Practiced */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-[#0a1e15] border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold uppercase tracking-widest mb-3">
            Systems of Medicine Practiced
          </span>
          <h2 className="font-serif-classic text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f5f3ec]">
            Herbal Medicine · Unani Medicine · Naturopathy
          </h2>
          <p className="text-xs sm:text-sm text-[#8da396] mt-3 leading-relaxed">
            Our outpatient practice in Kabul harmonizes traditional clinical systems within the recognized scope of Traditional, Complementary, and Integrative Medicine (TCIM).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#081b12] border border-[#224838] hover:border-[#d4af37]/60 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-serif-classic font-bold text-xl text-[#f5f3ec]">
                1. Herbal Medicine
              </h3>
              <p className="text-xs font-medium text-[#d4af37]">Phytotherapy Principles</p>
              <ul className="space-y-2 text-xs text-[#a6b6ad] pt-2 border-t border-[#1b3b2f]">
                <li className="flex items-start gap-2">
                  <span className="text-[#d4af37] font-bold">•</span>
                  <span>Plant-based preparations guided by traditional knowledge and phytotherapy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d4af37] font-bold">•</span>
                  <span>Emphasis on quality, proper identification, and safe use of medicinal plants</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d4af37] font-bold">•</span>
                  <span>Strict avoidance of toxic, endangered, or restricted botanical substances</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigateToAbout()}
              className="text-xs font-semibold text-[#d4af37] hover:underline text-left pt-2 flex items-center gap-1 cursor-pointer"
            >
              Learn about our botanical standards →
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-[#081b12] border border-[#224838] hover:border-[#d4af37]/60 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-serif-classic font-bold text-xl text-[#f5f3ec]">
                2. Unani Medicine
              </h3>
              <p className="text-xs font-medium text-[#d4af37]">Mizaj, Akhlat & Tabiat</p>
              <ul className="space-y-2 text-xs text-[#a6b6ad] pt-2 border-t border-[#1b3b2f]">
                <li className="flex items-start gap-2">
                  <span className="text-[#d4af37] font-bold">•</span>
                  <span>Assessment of Mizaj (individual constitutional temperament)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d4af37] font-bold">•</span>
                  <span>Balancing of Akhlat (the four primary humors: Blood, Yellow Bile, Phlegm, Black Bile)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d4af37] font-bold">•</span>
                  <span>Supporting Tabiat (the body's natural innate self-healing capacity)</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigateToTreatments()}
              className="text-xs font-semibold text-[#d4af37] hover:underline text-left pt-2 flex items-center gap-1 cursor-pointer"
            >
              Explore Unani consultations →
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-[#081b12] border border-[#224838] hover:border-[#d4af37]/60 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif-classic font-bold text-xl text-[#f5f3ec]">
                3. Naturopathy
              </h3>
              <p className="text-xs font-medium text-[#d4af37]">Lifestyle & Nutrition</p>
              <ul className="space-y-2 text-xs text-[#a6b6ad] pt-2 border-t border-[#1b3b2f]">
                <li className="flex items-start gap-2">
                  <span className="text-[#d4af37] font-bold">•</span>
                  <span>Comprehensive lifestyle and personalized nutrition counseling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d4af37] font-bold">•</span>
                  <span>Natural non-pharmacological approaches to support vitality</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d4af37] font-bold">•</span>
                  <span>Complementary supportive care alongside conventional medical treatments</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onOpenBooking()}
              className="text-xs font-semibold text-[#d4af37] hover:underline text-left pt-2 flex items-center gap-1 cursor-pointer"
            >
              Schedule a visit →
            </button>
          </div>
        </div>
      </section>

      {/* Scope of Outpatient Clinical Services Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1b3b2f]">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            Clinical Scope of Care
          </span>
          <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec] mt-1">
            Outpatient Care for Functional & Non-Communicable Conditions
          </h2>
          <p className="text-xs sm:text-sm text-[#8da396] mt-2">
            Targeted supportive traditional medicine provided by Safi Natural Care Clinic in Kabul:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CLINIC_PROFILE.scopeOfServices.map((scope, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-[#081b12] border border-[#224838] space-y-2">
              <h4 className="font-serif-classic font-bold text-sm text-[#f5f3ec] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                {scope.title}
              </h4>
              <p className="text-xs text-[#a6b6ad] leading-relaxed">
                {scope.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Official Institutional Slides & Presentation Archive Preview */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#081b12] to-[#040e09] border border-[#d4af37]/45 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Verified Institutional Records
              </span>
              <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec]">
                Official Presentation & Governance Archive
              </h2>
              <p className="text-xs sm:text-sm text-[#8da396] max-w-2xl leading-relaxed">
                Direct documents from Safi Natural Care Clinic's institutional presentation in Kabul, detailing our WHO TCIM alignment, public health collaborations, and ethical standards.
              </p>
            </div>

            <button
              onClick={onNavigateToAbout}
              className="text-xs font-bold text-[#d4af37] hover:text-[#fde68a] transition-colors flex items-center gap-1.5 cursor-pointer uppercase tracking-wider self-start sm:self-auto shrink-0"
            >
              <span>Explore All 12 Presentation Slides</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4 Featured Slides Highlight Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {CLINIC_PRESENTATION_SLIDES.slice(0, 4).map((slide, idx) => (
              <div
                key={slide.id}
                onClick={onNavigateToAbout}
                className="group rounded-2xl bg-[#06140d] border border-[#234b3c] hover:border-[#d4af37]/70 transition-all overflow-hidden flex flex-col justify-between cursor-pointer shadow-lg"
              >
                <div className="relative aspect-[4/3] bg-black overflow-hidden border-b border-[#1b3b2f]">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-[#234b3c] text-[10px] font-bold text-[#d4af37] uppercase">
                    Slide {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="p-4 space-y-1.5">
                  <span className="text-[10px] text-[#8da396] uppercase tracking-wider block font-medium">
                    {slide.category}
                  </span>
                  <h4 className="font-serif-classic font-bold text-sm text-[#f5f3ec] group-hover:text-[#d4af37] transition-colors leading-tight">
                    {slide.title}
                  </h4>
                  <p className="text-[11px] text-[#a6b6ad] line-clamp-2 leading-relaxed">
                    {slide.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Acoustic Wellness: Sound Medicine & Clinic Atmospheres */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#d4af37]" />
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-bold">
              Ilaj bil-Mousiqi · Acoustic Wellness Chamber
            </span>
          </div>
          {onNavigateToSoundscapes && (
            <button
              onClick={onNavigateToSoundscapes}
              className="text-xs font-bold text-[#c084fc] hover:text-[#d8b4fe] transition-colors flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              <span>Open Dedicated Acoustic Medicine Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <AcousticWellness />
      </section>

      {/* Interactive Symptom Matcher Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-xs uppercase tracking-widest text-[#06b6d4] font-bold">
              Botanical Triage & Symptom Checker
            </span>
          </div>
          {onNavigateToSymptoms && (
            <button
              onClick={onNavigateToSymptoms}
              className="text-xs font-bold text-[#06b6d4] hover:text-[#22d3ee] transition-colors flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              <span>Open Full Symptom Triage Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <SymptomMatcher
          onSelectService={(serviceId) => onOpenBooking(serviceId)}
          onOpenBooking={() => onOpenBooking()}
          onSelectProduct={() => onNavigateToShop()}
        />
      </section>

      {/* 3 Featured Products from Online Shop Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1b3b2f]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              The Botanical Dispensary
            </span>
            <h2 className="font-serif-classic text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f5f3ec] mt-1">
              Featured Formulations From Our Shop
            </h2>
            <p className="text-xs sm:text-sm text-[#8da396] mt-2 max-w-2xl">
              Handcrafted in small batches using 100% pure, unadulterated cold-pressed extracts, organic resins, and clinical herbal balms.
            </p>
          </div>

          <button
            onClick={onNavigateToShop}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#d4af37] hover:text-[#f3e5ab] transition-colors uppercase tracking-wider group cursor-pointer"
          >
            <span>Explore All Dispensary Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3 Featured Shop Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredShopProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl bg-[#081b12] border border-[#224838] hover:border-[#d4af37]/60 transition-all overflow-hidden flex flex-col justify-between group shadow-xl"
            >
              {/* Product Image & Badges */}
              <div className="relative aspect-4/3 overflow-hidden bg-black/40">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="px-2.5 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-[#d4af37]/60 text-[10px] font-bold text-[#d4af37] uppercase">
                    {product.category}
                  </span>
                  {product.isPopular && (
                    <span className="px-2 py-0.5 rounded bg-[#d4af37] text-black text-[9px] font-bold uppercase tracking-wider">
                      Best Seller
                    </span>
                  )}
                </div>
              </div>

              {/* Product Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-[#d4af37]">
                      <Star className="w-3.5 h-3.5 fill-[#d4af37]" />
                      <span className="font-semibold">{product.rating}</span>
                      <span className="text-[#8da396]">({product.reviewsCount} reviews)</span>
                    </div>
                    <span className="text-[11px] text-[#8da396]">{product.volumeOrWeight}</span>
                  </div>

                  <h3 className="font-serif-classic font-bold text-lg text-[#f5f3ec] group-hover:text-[#d4af37] transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-xs text-[#8da396] font-medium">{product.subtitle}</p>

                  <p className="text-xs text-[#a6b6ad] line-clamp-2 leading-relaxed">
                    {product.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1b3b2f] flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-[#d4af37] font-serif-classic">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-[#8da396] line-through ml-2">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onQuickViewProduct(product)}
                      className="px-3 py-1.5 rounded-lg bg-[#0e2419] border border-[#224838] hover:border-[#d4af37] text-xs text-[#f5f3ec] cursor-pointer transition-colors"
                      title="View formulation dossier"
                    >
                      Dossier
                    </button>
                    <button
                      onClick={() => onAddToCart(product, 1)}
                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 Most Recent Blog Posts About Herbal Remedies Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1b3b2f]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              Clinical Botanical Insights
            </span>
            <h2 className="font-serif-classic text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f5f3ec] mt-1">
              Latest From Our Herbal Remedies Blog
            </h2>
            <p className="text-xs sm:text-sm text-[#8da396] mt-2 max-w-2xl">
              Educational monographs, home Unani recipes, and phytotherapy research written by Dr. Hakim Safiullah Safi and clinical phytotherapists.
            </p>
          </div>

          <button
            onClick={onNavigateToBlog}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#d4af37] hover:text-[#f3e5ab] transition-colors uppercase tracking-wider group cursor-pointer"
          >
            <span>Read All Herbal Articles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3 Recent Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentBlogPosts.map((post) => (
            <article
              key={post.id}
              onClick={onNavigateToBlog}
              className="rounded-2xl bg-[#081b12] border border-[#224838] hover:border-[#d4af37]/60 transition-all overflow-hidden flex flex-col justify-between group shadow-xl cursor-pointer"
            >
              {/* Blog Image */}
              <div className="relative aspect-16/10 overflow-hidden bg-black/50">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-[#d4af37]/50 text-[10px] font-bold text-[#d4af37] uppercase">
                  {post.category}
                </span>
                <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-[10px] text-[#a6b6ad] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#d4af37]" />
                  {post.readTime}
                </span>
              </div>

              {/* Blog Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <h3 className="font-serif-classic font-bold text-base sm:text-lg text-[#f5f3ec] group-hover:text-[#d4af37] transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#a6b6ad] line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                {/* Author & Read Link */}
                <div className="pt-4 border-t border-[#1b3b2f] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-7 h-7 rounded-full object-cover border border-[#d4af37]/40"
                    />
                    <div className="text-[11px] leading-tight">
                      <div className="font-semibold text-[#f5f3ec]">{post.author.name}</div>
                      <div className="text-[#8da396] text-[10px]">{post.author.role}</div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-[#d4af37] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Interactive 3D Apothecary Showcase Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0a2318] via-[#06170f] to-[#030e08] border border-[#d4af37]/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Three.js Procedural 3D Experience</span>
            </div>
            <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec]">
              Step Inside the Royal Botanical Apothecary
            </h2>
            <p className="text-xs sm:text-sm text-[#a6b6ad] leading-relaxed">
              Experience our custom 3D procedural mortar, brass collar pestle, and botanical alembic distillation vessel. Inspect internal herb grinding chambers, test exploded-view anatomy, and discover our classical extraction craft.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onNavigateTo3D && onNavigateTo3D()}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs uppercase tracking-wider shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Launch 3D Apothecary</span>
            </button>
          </div>
        </div>
      </section>

      {/* Patient Health History & Prescribed Protocols Portal Banner */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#061523] via-[#081f33] to-[#040e18] border border-sky-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b243b] border border-sky-400/40 text-sky-300 text-xs font-semibold uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Confidential Patient Health History</span>
            </div>
            <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f0f4f8]">
              Track Your Consultations & Herbal Protocols
            </h2>
            <p className="text-xs sm:text-sm text-[#94a9be] leading-relaxed">
              Log into your verified patient dashboard to track your past consultations, review personalized Unani botanical dosage schedules prescribed by our doctors, and manage dispensary orders with one click.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-sky-200 pt-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Prescribed Botanical Regimens
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Dispensary Purchase History
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Unani Mizaj Scorecard
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onNavigateToPortal && onNavigateToPortal()}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-sky-400 to-[#d4af37] text-black font-bold text-xs uppercase tracking-wider shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>Access Patient Health History</span>
            </button>
          </div>
        </div>
      </section>

      {/* Patient Success Stories & Clinical Proof Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex justify-end">
          {onNavigateToTestimonials && (
            <button
              onClick={onNavigateToTestimonials}
              className="text-xs font-bold text-[#fbbf24] hover:text-[#fde68a] transition-colors flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              <span>View All Documented Case Studies & Outcomes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <TestimonialsSection onOpenBooking={(serviceId) => onOpenBooking(serviceId)} />
      </section>

      {/* Bottom Conversion Strip: Book or Call */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#071b12] via-[#0d2a1d] to-[#071b12] border border-[#d4af37]/50 shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Begin Your Restoration</span>
          </div>

          <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f5f3ec] max-w-2xl mx-auto">
            Ready to Experience True Botanical Medicine?
          </h2>

          <p className="text-xs sm:text-base text-[#a6b6ad] max-w-xl mx-auto leading-relaxed">
            Schedule an in-clinic consultation in Kabul or telehealth video visit with our master herbalists today.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenBooking()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-sm tracking-wide shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-black" />
              <span>Book Your Consultation</span>
            </button>

            <a
              href="tel:+93780299299"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#081b12] border border-[#224838] hover:border-[#d4af37] text-sm font-semibold text-[#f5f3ec] flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-[#d4af37]" />
              <span>Reception / WhatsApp: +93 780 299 299</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
