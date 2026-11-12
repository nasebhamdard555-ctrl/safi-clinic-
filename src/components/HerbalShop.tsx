import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Star,
  Check,
  Eye,
  X,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  Leaf,
  Info,
  Calendar,
  Share2,
  AlertTriangle,
  PackageX,
} from 'lucide-react';
import { HERBAL_PRODUCTS } from '../data/clinicData';
import { HerbalProduct } from '../types/clinic';
import {
  filterProducts,
  classifyInventoryStatus,
  buildSocialShareUrl,
} from '../utils/clinicLogic';
import { useClinicConfig } from '../context/ClinicConfigContext';

interface HerbalShopProps {
  onAddToCart: (product: HerbalProduct, quantity: number) => void;
  onOpenBooking: () => void;
}

export const HerbalShop: React.FC<HerbalShopProps> = ({
  onAddToCart,
  onOpenBooking,
}) => {
  const { getProductInventory, settings } = useClinicConfig();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [activeProductModal, setActiveProductModal] = useState<HerbalProduct | null>(null);
  const [modalQuantity, setModalQuantity] = useState<number>(1);
  const [addedSuccessId, setAddedSuccessId] = useState<string | null>(null);

  const categories = [
    'All',
    'Tinctures & Tonics',
    'Herbal Teas',
    'Healing Salves',
    'Resins',
  ];

  const filtered = useMemo(() => {
    let list = filterProducts(HERBAL_PRODUCTS, selectedCategory, searchQuery);
    if (sortBy === 'price-low') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [selectedCategory, searchQuery, sortBy]);

  const handleQuickAdd = (product: HerbalProduct) => {
    onAddToCart(product, 1);
    setAddedSuccessId(product.id);
    setTimeout(() => {
      setAddedSuccessId(null);
    }, 1800);
  };

  const handleOpenDetailModal = (product: HerbalProduct) => {
    setActiveProductModal(product);
    setModalQuantity(1);
  };

  const handleModalAddToCart = () => {
    if (!activeProductModal) return;
    onAddToCart(activeProductModal, modalQuantity);
    setActiveProductModal(null);
  };

  return (
    <section id="shop" className="py-20 lg:py-28 bg-[#06120d] relative">
      {/* Background Subtle Elements */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-[#c5a059]/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-[#0e3b28]/20 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d2319] border border-[#c5a059]/40 text-[#f5e6c8] text-xs font-semibold tracking-wider uppercase mb-3">
              <Leaf className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Certified Botanical Dispensary</span>
            </div>
            <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f5f3ec]">
              Herbal Remedies & Apothecary
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#a6b6ad] max-w-xl">
              Doctor-compounded organic remedies, unadulterated cold-pressed elixirs, and traditional healing salves lab-tested for potency.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0e2118] border border-[#2d5e4b] hover:border-[#d4af37] text-xs font-semibold text-[#f5f3ec] transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#d4af37]" />
              <span>Need a Custom Formulation?</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-[#091a13] border border-[#1b3b2f] mb-10 shadow-lg">
          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold shadow-md'
                    : 'bg-[#06120d] text-[#b8c9bf] hover:text-[#f5f3ec] border border-[#1b3b2f]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input & Sort Filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-[#8da396] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search herbs, remedies..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#06120d] border border-[#1b3b2f] focus:border-[#d4af37] text-xs text-[#f5f3ec] placeholder-[#4f675a] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8da396] hover:text-[#f5f3ec]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-lg bg-[#06120d] border border-[#1b3b2f] text-xs text-[#d8e2dc] focus:border-[#d4af37] focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center bg-[#091a13] rounded-2xl border border-[#1b3b2f]">
            <Leaf className="w-12 h-12 text-[#688274] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#f5f3ec]">No Herbal Formulations Found</h3>
            <p className="text-xs text-[#8da396] mt-1">
              Try adjusting your category filter or search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#153426] text-xs font-semibold text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#1b4330]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product) => {
              const isAdded = addedSuccessId === product.id;
              const liveInv = getProductInventory(product.id);
              const stockCount = liveInv ? liveInv.stockQuantity : product.inStock ? 25 : 0;
              const stockStatus = classifyInventoryStatus(stockCount, settings.lowStockThreshold);
              const isOut = stockStatus === 'Out of Stock';
              const isLow = stockStatus === 'Low Stock';

              return (
                <div
                  key={product.id}
                  className="group rounded-2xl bg-[#081711] border border-[#1b3b2f] hover:border-[#d4af37]/70 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-black/60 relative"
                >
                  {/* Popular Badge */}
                  {product.isPopular && (
                    <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-[#d4af37] text-black text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                      Clinic Signature
                    </div>
                  )}

                  {/* Product Image Box */}
                  <div className="relative h-56 bg-[#0c2017] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081711] via-transparent to-transparent opacity-60" />

                    {/* Quick View Button Overlay */}
                    <button
                      onClick={() => handleOpenDetailModal(product)}
                      className="absolute inset-0 m-auto w-28 h-9 rounded-lg bg-black/75 backdrop-blur-md border border-[#d4af37] text-[#f5f3ec] text-xs font-semibold flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Quick View</span>
                    </button>
                  </div>

                  {/* Product Content Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Category & Volume */}
                      <div className="flex items-center justify-between text-[11px] text-[#8da396] mb-1.5">
                        <span className="text-[#d4af37] font-medium">
                          {product.category}
                        </span>
                        <span>{product.volumeOrWeight}</span>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => handleOpenDetailModal(product)}
                        className="font-serif-classic font-bold text-base text-[#f5f3ec] group-hover:text-[#d4af37] transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-[#8da396] line-clamp-1 mt-0.5">
                        {product.subtitle}
                      </p>

                      {/* Rating & Reviews */}
                      <div className="flex items-center gap-1.5 mt-2 text-xs">
                        <div className="flex items-center text-[#d4af37]">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="ml-1 font-bold text-[#f5f3ec]">
                            {product.rating}
                          </span>
                        </div>
                        <span className="text-[#688274]">
                          ({product.reviewsCount} patient reviews)
                        </span>
                      </div>

                      {/* Short Description */}
                      <p className="text-xs text-[#a6b6ad] line-clamp-2 mt-2 leading-relaxed">
                        {product.shortDescription}
                      </p>
                    </div>

                    {/* Price, Live Stock Status & Add to Cart */}
                    <div className="mt-5 pt-4 border-t border-[#1b3b2f] space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-serif-classic text-lg font-bold text-[#f5f3ec] tabular-nums">
                              ${product.price.toFixed(2)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-[#688274] line-through tabular-nums">
                                ${product.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-semibold flex items-center gap-1 font-mono tabular-nums ${
                              isOut
                                ? 'text-rose-400'
                                : isLow
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {isOut ? (
                              <PackageX className="w-3 h-3" />
                            ) : isLow ? (
                              <AlertTriangle className="w-3 h-3" />
                            ) : null}
                            {stockStatus} {liveInv ? `(${stockCount})` : ''}
                          </span>
                        </div>

                        <button
                          onClick={() => handleQuickAdd(product)}
                          disabled={isAdded || isOut}
                          aria-label={`Add ${product.name} to cart`}
                          className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                            isOut
                              ? 'bg-[#101e17] text-[#526d5e] border border-[#1b3b2f] cursor-not-allowed'
                              : isAdded
                              ? 'bg-emerald-600 text-white cursor-pointer'
                              : 'bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black hover:brightness-110 active:scale-95 shadow-md cursor-pointer'
                          }`}
                        >
                          {isAdded ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <ShoppingBag className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Share to Socials */}
                      <div className="flex items-center justify-between text-[10px] text-[#8da396] pt-2 border-t border-[#142d22]">
                        <span className="inline-flex items-center gap-1">
                          <Share2 className="w-3 h-3 text-[#d4af37]" />
                          Share:
                        </span>
                        <div className="flex items-center gap-2 font-semibold">
                          <a
                            href={buildSocialShareUrl('whatsapp', product.name, product.price, settings.whatsappNumber)}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-emerald-400 transition-colors"
                          >
                            WhatsApp
                          </a>
                          <span>·</span>
                          <a
                            href={buildSocialShareUrl('facebook', product.name, product.price, settings.whatsappNumber)}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-[#d4af37] transition-colors"
                          >
                            Facebook
                          </a>
                          <span>·</span>
                          <a
                            href={buildSocialShareUrl('twitter', product.name, product.price, settings.whatsappNumber)}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-[#d4af37] transition-colors"
                          >
                            X
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Prescription Custom Blending Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0a1e15] via-[#0e2c1f] to-[#0a1e15] border border-[#c5a059]/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-left">
            <span className="text-xs text-[#d4af37] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              In-House Licensed Compounding Apothecary
            </span>
            <h3 className="font-serif-classic text-xl sm:text-2xl font-bold text-[#f5f3ec]">
              Require a Custom Herbal Tincture or Topical Remedy?
            </h3>
            <p className="text-xs sm:text-sm text-[#b8c9bf] max-w-2xl leading-relaxed">
              Our clinical herbalists formulate bespoke botanical compounds tailored to your specific bloodwork, allergies, and constitutional temperament.
            </p>
          </div>
          <button
            onClick={onOpenBooking}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs sm:text-sm tracking-wide shrink-0 shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            Consult Master Herbalist
          </button>
        </div>
      </div>

      {/* QUICK VIEW / PRODUCT DETAIL MODAL */}
      {activeProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#081711] border-2 border-[#c5a059] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setActiveProductModal(null)}
              aria-label="Close product view"
              className="absolute top-4 right-4 p-2 rounded-lg bg-[#0e2118] text-[#8da396] hover:text-[#f5f3ec] border border-[#1b3b2f] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-2">
              {/* Product Visual */}
              <div className="md:col-span-5">
                <div className="rounded-xl overflow-hidden border border-[#1b3b2f] h-60 bg-[#0c2017]">
                  <img
                    src={activeProductModal.image}
                    alt={activeProductModal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Certifications badges */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {activeProductModal.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#0f2a1e] border border-[#1b3b2f] text-[#c9dad0]"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Product Information */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <span className="text-xs text-[#d4af37] font-semibold uppercase tracking-wider">
                    {activeProductModal.category} · {activeProductModal.volumeOrWeight}
                  </span>
                  <h3 className="font-serif-classic text-2xl font-bold text-[#f5f3ec] mt-1">
                    {activeProductModal.name}
                  </h3>
                  <p className="text-xs text-[#8da396]">
                    {activeProductModal.subtitle}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <span className="text-[#d4af37] font-bold">
                      ★ {activeProductModal.rating}
                    </span>
                    <span className="text-[#688274]">
                      ({activeProductModal.reviewsCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="text-lg font-bold font-serif-classic text-[#f5f3ec]">
                  ${activeProductModal.price.toFixed(2)}
                </div>

                <p className="text-xs text-[#b8c9bf] leading-relaxed">
                  {activeProductModal.detailedDescription}
                </p>

                {/* Botanical Ingredients Table */}
                <div className="space-y-2 pt-2 border-t border-[#1b3b2f]">
                  <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5" />
                    <span>Botanical Actives & Latin Nomenclature:</span>
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    {activeProductModal.botanicalIngredients.map((b, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded bg-[#0a1e15] border border-[#1b3b2f] flex justify-between"
                      >
                        <div>
                          <span className="font-semibold text-[#f5f3ec]">
                            {b.commonName}
                          </span>{' '}
                          <span className="text-[11px] text-[#8da396] italic">
                            ({b.botanicalName})
                          </span>
                        </div>
                        <span className="text-[11px] text-[#d4af37] font-medium">
                          {b.action}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Use */}
                <div className="p-3 rounded-lg bg-[#07150e] border border-[#1b3b2f] text-xs text-[#a6b6ad]">
                  <strong className="text-[#f5f3ec] block mb-0.5">Clinical Dosage:</strong>
                  {activeProductModal.suggestedUse}
                </div>

                {/* Quantity and Modal Add to Cart */}
                <div className="pt-3 border-t border-[#1b3b2f] flex items-center gap-4">
                  <div className="flex items-center border border-[#1b3b2f] rounded-lg bg-[#06120d]">
                    <button
                      onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                      className="p-2 text-[#8da396] hover:text-[#f5f3ec]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-[#f5f3ec]">
                      {modalQuantity}
                    </span>
                    <button
                      onClick={() => setModalQuantity(modalQuantity + 1)}
                      className="p-2 text-[#8da396] hover:text-[#f5f3ec]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleModalAddToCart}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#aa8222] text-black font-bold text-xs tracking-wider uppercase shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-black" />
                    <span>
                      Add to Cart · ${(activeProductModal.price * modalQuantity).toFixed(2)}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
