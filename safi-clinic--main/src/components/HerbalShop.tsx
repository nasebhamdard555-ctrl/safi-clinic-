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
  Leaf,
  Calendar,
  Share2,
  AlertTriangle,
  PackageX,
} from 'lucide-react';
import {
  HERBAL_PRODUCTS,
  OFFICIAL_PRODUCT_CATEGORIES,
} from '../data/clinicData';
import { HerbalProduct } from '../types/clinic';
import {
  filterProducts,
  classifyInventoryStatus,
  buildSocialShareUrl,
} from '../utils/clinicLogic';
import { useClinicConfig } from '../context/ClinicConfigContext';
import { BotanicalImage } from './BotanicalImage';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

interface HerbalShopProps {
  onAddToCart: (product: HerbalProduct, quantity: number) => void;
  onOpenBooking: () => void;
}

export const HerbalShop: React.FC<HerbalShopProps> = ({
  onAddToCart,
  onOpenBooking,
}) => {
  const { getProductInventory, settings } = useClinicConfig();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [activeProductModal, setActiveProductModal] = useState<HerbalProduct | null>(null);
  const [modalQuantity, setModalQuantity] = useState<number>(1);
  const [addedSuccessId, setAddedSuccessId] = useState<string | null>(null);

  const categories = ['All', ...OFFICIAL_PRODUCT_CATEGORIES];

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = filterProducts(HERBAL_PRODUCTS, selectedCategory, searchQuery);

    if (q) {
      const categoryScoped = filterProducts(HERBAL_PRODUCTS, selectedCategory, '');
      const localizedMatches = categoryScoped.filter((p) => {
        const loc = t.productsMap[p.id];
        if (!loc) return false;
        return (
          loc.name.toLowerCase().includes(q) ||
          loc.subtitle.toLowerCase().includes(q) ||
          loc.shortDescription.toLowerCase().includes(q)
        );
      });
      const seen = new Set(list.map((p) => p.id));
      for (const item of localizedMatches) {
        if (!seen.has(item.id)) {
          list = [...list, item];
        }
      }
    }

    if (sortBy === 'price-low') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [selectedCategory, searchQuery, sortBy, t.productsMap]);

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

  const modalLoc = activeProductModal ? t.productsMap[activeProductModal.id] : undefined;

  return (
    <section id="shop" className="py-10 lg:py-14 bg-[#081610] text-[#F4F0E6]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37] block mb-1.5">
              {t.shop.catalogKicker}
            </span>
            <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6]">
              {t.shop.catalogTitle}
            </h2>
            <p className="mt-1.5 text-sm text-[#A6B8AE] max-w-xl">
              {t.shop.catalogSub}
            </p>
          </div>

          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 min-h-[42px] px-4 py-2.5 rounded-lg bg-[#0C2117] border border-[#1D3B2C] hover:border-[#D4AF37] text-xs font-semibold text-[#F4F0E6] transition-colors cursor-pointer shrink-0 self-start md:self-auto"
          >
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
            <span>{t.shop.adviceBtn}</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="space-y-4 p-4 sm:p-5 rounded-2xl bg-[#0C2117] border border-[#1D3B2C] mb-8">
          {/* Categories Interactive Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#D4AF37] text-[#06110C] shadow-sm'
                    : 'bg-[#06110C] text-[#A6B8AE] hover:text-[#F4F0E6] border border-[#1D3B2C]'
                }`}
              >
                {cat === 'All'
                  ? t.shop.allCategory
                  : t.shop.productCategories[cat] || cat}
              </button>
            ))}
          </div>

          {/* Search Input & Sort Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#173024]">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#8FA699] absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.shop.searchPlaceholder}
                aria-label={t.shop.searchPlaceholder}
                className="w-full min-h-[40px] ps-9 pe-8 py-2 rounded-lg bg-[#06110C] border border-[#1D3B2C] focus:border-[#D4AF37] text-xs text-[#F4F0E6] placeholder-[#6E8478] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8FA699] hover:text-[#F4F0E6] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-xs text-[#A6B8AE] font-medium tabular-nums">
                {filtered.length}{' '}
                {filtered.length === 1
                  ? t.shop.formulationSingular
                  : t.shop.formulationPlural}
              </span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as 'featured' | 'price-low' | 'price-high' | 'rating'
                  )
                }
                aria-label="Sort products"
                className="min-h-[40px] px-3 py-2 rounded-lg bg-[#06110C] border border-[#1D3B2C] text-xs font-medium text-[#F4F0E6] focus:border-[#D4AF37] focus:outline-none cursor-pointer"
              >
                <option value="featured">{t.shop.sortFeatured}</option>
                <option value="rating">{t.shop.sortRating}</option>
                <option value="price-low">{t.shop.sortPriceLow}</option>
                <option value="price-high">{t.shop.sortPriceHigh}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center bg-[#0C2117] rounded-2xl border border-[#1D3B2C]">
            <Leaf className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
            <h3 className="font-serif-classic text-lg font-bold text-[#F4F0E6]">
              {t.shop.emptyTitle}
            </h3>
            <p className="text-xs text-[#A6B8AE] mt-1">{t.shop.emptySub}</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 min-h-[40px] px-4 py-2 rounded-lg bg-[#D4AF37] text-xs font-bold text-[#06110C] hover:bg-[#E2C36B] cursor-pointer"
            >
              {t.shop.showAllBtn}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => {
              const isAdded = addedSuccessId === product.id;
              const liveInv = getProductInventory(product.id);
              const stockCount = liveInv ? liveInv.stockQuantity : product.inStock ? 25 : 0;
              const stockStatus = classifyInventoryStatus(stockCount, settings.lowStockThreshold);
              const isOut = stockStatus === 'Out of Stock';
              const isLow = stockStatus === 'Low Stock';
              const stockLabel = isOut
                ? t.shop.outOfStock
                : isLow
                ? t.shop.lowStock
                : t.shop.inStock;
              const locProd = t.productsMap[product.id];
              const displayName = locProd?.name || product.name;
              const displaySubtitle = locProd?.subtitle || product.subtitle;
              const displayVolume = locProd?.volumeOrWeight || product.volumeOrWeight;
              const displayDesc = locProd?.shortDescription || product.shortDescription;

              return (
                <div
                  key={product.id}
                  className="group rounded-2xl bg-[#0C2117] border border-[#1D3B2C] hover:border-[#D4AF37]/70 transition-all duration-200 flex flex-col overflow-hidden relative"
                >
                  {/* Product Image Box */}
                  <div className="relative h-52 bg-[#06110C] overflow-hidden">
                    <BotanicalImage
                      src={product.image}
                      alt={displayName}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => handleOpenDetailModal(product)}
                      className="absolute bottom-3 end-3 min-h-[34px] px-2.5 py-1.5 rounded-lg bg-[#06110C]/90 border border-[#1D3B2C] text-[#F4F0E6] text-[11px] font-semibold flex items-center gap-1 hover:border-[#D4AF37] cursor-pointer shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{t.shop.inspectBtn}</span>
                    </button>
                  </div>

                  {/* Product Content Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[11px] mb-1.5">
                        <span className="text-[#D4AF37] font-semibold line-clamp-1">
                          {t.shop.productCategories[product.category] || product.category}
                        </span>
                        <span className="text-[#8FA699] shrink-0">{displayVolume}</span>
                      </div>

                      <h3
                        onClick={() => handleOpenDetailModal(product)}
                        className="font-serif-classic font-bold text-base text-[#F4F0E6] group-hover:text-[#D4AF37] transition-colors cursor-pointer line-clamp-1"
                      >
                        {displayName}
                      </h3>
                      <p className="text-[11px] text-[#A6B8AE] line-clamp-1 mt-0.5">
                        {displaySubtitle}
                      </p>

                      <div className="flex items-center gap-1.5 mt-2 text-xs">
                        <div className="flex items-center text-[#D4AF37]">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="ms-1 font-bold text-[#F4F0E6] tabular-nums">
                            {product.rating}
                          </span>
                        </div>
                        <span className="text-[#8FA699] tabular-nums">
                          ({product.reviewsCount})
                        </span>
                      </div>

                      <p className="text-xs text-[#C2D1C8] line-clamp-2 mt-2 leading-relaxed">
                        {displayDesc}
                      </p>
                    </div>

                    {/* Price, Live Stock Status & Add to Cart */}
                    <div className="mt-5 pt-4 border-t border-[#173024] space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="flex items-baseline flex-wrap gap-1.5" dir="ltr">
                            <span className="font-serif-classic text-lg font-bold text-[#D4AF37] tabular-nums">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-[#6E8478] line-through tabular-nums">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-semibold flex items-center gap-1 tabular-nums mt-1 ${
                              isOut
                                ? 'text-rose-400'
                                : isLow
                                ? 'text-amber-300'
                                : 'text-emerald-400'
                            }`}
                          >
                            {isOut ? (
                              <PackageX className="w-3 h-3" />
                            ) : isLow ? (
                              <AlertTriangle className="w-3 h-3" />
                            ) : null}
                            {stockLabel} {liveInv ? `(${stockCount})` : ''}
                          </span>
                        </div>

                        <button
                          onClick={() => handleQuickAdd(product)}
                          disabled={isAdded || isOut}
                          aria-label={`${t.shop.addBtn} ${displayName}`}
                          className={`min-h-[38px] px-3.5 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                            isOut
                              ? 'bg-[#13291E] text-[#6E8478] cursor-not-allowed'
                              : isAdded
                              ? 'bg-emerald-600 text-white cursor-pointer'
                              : 'bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] active:scale-95 cursor-pointer'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>{t.shop.addedBtn}</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4" />
                              <span>{t.shop.addBtn}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Share to Socials */}
                      <div className="flex items-center justify-between text-[10px] text-[#8FA699] pt-2 border-t border-[#173024]">
                        <span className="inline-flex items-center gap-1">
                          <Share2 className="w-3 h-3 text-[#D4AF37]" />
                          {t.shop.shareLabel}
                        </span>
                        <div className="flex items-center gap-2 font-semibold" dir="ltr">
                          <a
                            href={buildSocialShareUrl('whatsapp', displayName, product.price, settings.whatsappNumber, undefined, formatPrice(product.price))}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-emerald-400 transition-colors"
                          >
                            WhatsApp
                          </a>
                          <span>·</span>
                          <a
                            href={buildSocialShareUrl('facebook', displayName, product.price, settings.whatsappNumber, undefined, formatPrice(product.price))}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-[#D4AF37] transition-colors"
                          >
                            Facebook
                          </a>
                          <span>·</span>
                          <a
                            href={buildSocialShareUrl('twitter', displayName, product.price, settings.whatsappNumber, undefined, formatPrice(product.price))}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-[#D4AF37] transition-colors"
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
      </div>

      {/* QUICK VIEW / PRODUCT DETAIL MODAL */}
      {activeProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B1D14] border border-[#1D3B2C] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl text-[#F4F0E6]">
            <button
              onClick={() => setActiveProductModal(null)}
              aria-label="Close product view"
              className="absolute top-4 end-4 min-w-[38px] min-h-[38px] p-2 rounded-lg bg-[#06110C] text-[#A6B8AE] hover:text-[#D4AF37] border border-[#1D3B2C] transition-colors flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-2">
              <div className="md:col-span-5">
                <div className="rounded-xl overflow-hidden border border-[#1D3B2C] h-60 bg-[#06110C]">
                  <BotanicalImage
                    src={activeProductModal.image}
                    alt={modalLoc?.name || activeProductModal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] text-[#A6B8AE]">
                  {activeProductModal.certifications.join(' · ')}
                </div>
              </div>

              <div className="md:col-span-7 space-y-4">
                <div>
                  <span className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
                    {t.shop.productCategories[activeProductModal.category] ||
                      activeProductModal.category}{' '}
                    · {modalLoc?.volumeOrWeight || activeProductModal.volumeOrWeight}
                  </span>
                  <h3 className="font-serif-classic text-2xl font-bold text-[#F4F0E6] mt-1">
                    {modalLoc?.name || activeProductModal.name}
                  </h3>
                  <p className="text-xs text-[#A6B8AE]">
                    {modalLoc?.subtitle || activeProductModal.subtitle}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <span className="text-[#D4AF37] font-bold tabular-nums">
                      ★ {activeProductModal.rating}
                    </span>
                    <span className="text-[#8FA699] tabular-nums">
                      ({activeProductModal.reviewsCount} {t.shop.reviewsWord})
                    </span>
                  </div>
                </div>

                <div
                  className="text-2xl font-bold font-serif-classic text-[#D4AF37] tabular-nums"
                  dir="ltr"
                >
                  {formatPrice(activeProductModal.price)}
                </div>

                <p className="text-xs text-[#C2D1C8] leading-relaxed">
                  {modalLoc?.detailedDescription || activeProductModal.detailedDescription}
                </p>

                <div className="space-y-2 pt-2 border-t border-[#1D3B2C]">
                  <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5" />
                    <span>{t.shop.activeNomenclature}</span>
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    {activeProductModal.botanicalIngredients.map((b, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#06110C] border border-[#1D3B2C] flex justify-between gap-2"
                      >
                        <div>
                          <span className="font-semibold text-[#F4F0E6]">
                            {b.commonName}
                          </span>{' '}
                          <span className="text-[11px] text-[#A6B8AE] italic" dir="ltr">
                            ({b.botanicalName})
                          </span>
                        </div>
                        <span className="text-[11px] text-[#D4AF37] font-medium shrink-0">
                          {b.action}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#06110C] border border-[#1D3B2C] text-xs text-[#C2D1C8]">
                  <strong className="text-[#F4F0E6] block mb-0.5">
                    {t.shop.clinicalDosage}
                  </strong>
                  {modalLoc?.suggestedUse || activeProductModal.suggestedUse}
                </div>

                <div className="pt-3 border-t border-[#1D3B2C] flex items-center gap-4">
                  <div className="flex items-center border border-[#1D3B2C] rounded-lg bg-[#06110C]">
                    <button
                      onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                      aria-label="Decrease quantity"
                      className="min-w-[38px] min-h-[38px] p-2 text-[#A6B8AE] hover:text-[#F4F0E6] flex items-center justify-center cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-[#F4F0E6] tabular-nums">
                      {modalQuantity}
                    </span>
                    <button
                      onClick={() => setModalQuantity(modalQuantity + 1)}
                      aria-label="Increase quantity"
                      className="min-w-[38px] min-h-[38px] p-2 text-[#A6B8AE] hover:text-[#F4F0E6] flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleModalAddToCart}
                    className="flex-1 min-h-[44px] py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span className="tabular-nums">
                      {t.shop.addToCartTotal} ·{' '}
                      <span dir="ltr" className="inline-block">
                        {formatPrice(activeProductModal.price * modalQuantity)}
                      </span>
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
