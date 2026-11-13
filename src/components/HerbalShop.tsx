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

  const categories = ['All', ...OFFICIAL_PRODUCT_CATEGORIES];

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
    <section id="shop" className="py-10 lg:py-14 bg-[#F3ECE3] text-[#211813]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9E5334] block mb-1.5">
              9 Clinical Categories
            </span>
            <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#211813]">
              Safi Apothecary Catalog
            </h2>
            <p className="mt-1.5 text-sm text-[#665448] max-w-xl">
              Filter by health category or search any formulation to inspect botanical ingredients, live dispensary stock, and pricing.
            </p>
          </div>

          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FAF6F0] border border-[#D8CBB8] hover:border-[#9E5334] text-xs font-semibold text-[#211813] transition-colors cursor-pointer shrink-0"
          >
            <Calendar className="w-4 h-4 text-[#9E5334]" />
            <span>Need Constitutional Advice?</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="space-y-4 p-4 sm:p-5 rounded-2xl bg-[#FAF6F0] border border-[#E2D7C8] mb-8 shadow-sm">
          {/* Categories Wrapping Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#9E5334] text-[#FAF6F0] shadow-sm'
                    : 'bg-[#F3ECE3] text-[#5C4A3E] hover:text-[#211813] border border-[#E2D7C8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input & Sort Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#EAE0D3]">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#7D6A5C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search formulations (e.g. Hormone Balance, Chill AF, Beauty Drops)..."
                aria-label="Search herbal formulations"
                className="w-full pl-9 pr-8 py-2 rounded-lg bg-white border border-[#D8CBB8] focus:border-[#9E5334] text-xs text-[#211813] placeholder-[#8A7769] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#7D6A5C] hover:text-[#211813]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[#665448] font-medium">
                {filtered.length} {filtered.length === 1 ? 'formulation' : 'formulations'}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-low' | 'price-high' | 'rating')}
                aria-label="Sort products"
                className="px-3 py-2 rounded-lg bg-white border border-[#D8CBB8] text-xs font-medium text-[#211813] focus:border-[#9E5334] focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center bg-[#FAF6F0] rounded-2xl border border-[#E2D7C8]">
            <Leaf className="w-10 h-10 text-[#9E5334] mx-auto mb-3" />
            <h3 className="font-serif-classic text-lg font-bold text-[#211813]">
              No Formulations Match Your Filter
            </h3>
            <p className="text-xs text-[#665448] mt-1">
              Try another wellness category or clear your search term.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#9E5334] text-xs font-semibold text-[#FAF6F0] hover:bg-[#824127] cursor-pointer"
            >
              Show All 9 Categories
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
                  className="group rounded-2xl bg-[#FAF6F0] border border-[#E2D7C8] hover:border-[#9E5334]/70 transition-all duration-200 flex flex-col overflow-hidden shadow-sm hover:shadow-md relative"
                >
                  {/* Product Image Box */}
                  <div className="relative h-52 bg-[#EAE0D3] overflow-hidden">
                    <BotanicalImage
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.isPopular && (
                      <div className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded bg-[#9E5334] text-[#FAF6F0] text-[10px] font-bold uppercase tracking-wider">
                        Signature
                      </div>
                    )}
                    <button
                      onClick={() => handleOpenDetailModal(product)}
                      className="absolute bottom-3 right-3 px-2.5 py-1.5 rounded-lg bg-[#FAF6F0]/95 border border-[#D8CBB8] text-[#211813] text-[11px] font-semibold flex items-center gap-1 hover:border-[#9E5334] cursor-pointer shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#9E5334]" />
                      <span>Inspect</span>
                    </button>
                  </div>

                  {/* Product Content Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[11px] mb-1.5">
                        <span className="text-[#9E5334] font-semibold line-clamp-1">
                          {product.category}
                        </span>
                        <span className="text-[#7D6A5C] shrink-0">{product.volumeOrWeight}</span>
                      </div>

                      <h3
                        onClick={() => handleOpenDetailModal(product)}
                        className="font-serif-classic font-bold text-base text-[#211813] group-hover:text-[#9E5334] transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-[#665448] line-clamp-1 mt-0.5">
                        {product.subtitle}
                      </p>

                      <div className="flex items-center gap-1.5 mt-2 text-xs">
                        <div className="flex items-center text-[#9E5334]">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="ml-1 font-bold text-[#211813]">
                            {product.rating}
                          </span>
                        </div>
                        <span className="text-[#7D6A5C]">
                          ({product.reviewsCount})
                        </span>
                      </div>

                      <p className="text-xs text-[#5C4A3E] line-clamp-2 mt-2 leading-relaxed">
                        {product.shortDescription}
                      </p>
                    </div>

                    {/* Price, Live Stock Status & Add to Cart */}
                    <div className="mt-5 pt-4 border-t border-[#E6DCD0] space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="px-2 py-0.5 rounded bg-[#9E5334] text-[#FAF6F0] font-serif-classic text-sm font-bold tabular-nums">
                              ${product.price.toFixed(2)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-[#8A7769] line-through tabular-nums">
                                ${product.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-semibold flex items-center gap-1 font-mono tabular-nums mt-1.5 ${
                              isOut
                                ? 'text-rose-700'
                                : isLow
                                ? 'text-amber-700'
                                : 'text-emerald-700'
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
                          className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                            isOut
                              ? 'bg-[#E6DCD0] text-[#8A7769] cursor-not-allowed'
                              : isAdded
                              ? 'bg-emerald-700 text-white cursor-pointer'
                              : 'bg-[#9E5334] hover:bg-[#824127] text-[#FAF6F0] active:scale-95 cursor-pointer'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Share to Socials */}
                      <div className="flex items-center justify-between text-[10px] text-[#665448] pt-2 border-t border-[#EAE0D3]">
                        <span className="inline-flex items-center gap-1">
                          <Share2 className="w-3 h-3 text-[#9E5334]" />
                          Share:
                        </span>
                        <div className="flex items-center gap-2 font-semibold">
                          <a
                            href={buildSocialShareUrl('whatsapp', product.name, product.price, settings.whatsappNumber)}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-emerald-700 transition-colors"
                          >
                            WhatsApp
                          </a>
                          <span>·</span>
                          <a
                            href={buildSocialShareUrl('facebook', product.name, product.price, settings.whatsappNumber)}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-[#9E5334] transition-colors"
                          >
                            Facebook
                          </a>
                          <span>·</span>
                          <a
                            href={buildSocialShareUrl('twitter', product.name, product.price, settings.whatsappNumber)}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-[#9E5334] transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211813]/75 backdrop-blur-sm">
          <div className="bg-[#FAF6F0] border border-[#D8CBB8] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl text-[#211813]">
            <button
              onClick={() => setActiveProductModal(null)}
              aria-label="Close product view"
              className="absolute top-4 right-4 p-2 rounded-lg bg-[#F3ECE3] text-[#5C4A3E] hover:text-[#211813] border border-[#E2D7C8] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-2">
              <div className="md:col-span-5">
                <div className="rounded-xl overflow-hidden border border-[#E2D7C8] h-60 bg-[#EAE0D3]">
                  <BotanicalImage
                    src={activeProductModal.image}
                    alt={activeProductModal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {activeProductModal.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#F3ECE3] border border-[#E2D7C8] text-[#5C4A3E] font-medium"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:col-span-7 space-y-4">
                <div>
                  <span className="text-xs text-[#9E5334] font-semibold uppercase tracking-wider">
                    {activeProductModal.category} · {activeProductModal.volumeOrWeight}
                  </span>
                  <h3 className="font-serif-classic text-2xl font-bold text-[#211813] mt-1">
                    {activeProductModal.name}
                  </h3>
                  <p className="text-xs text-[#665448]">
                    {activeProductModal.subtitle}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <span className="text-[#9E5334] font-bold">
                      ★ {activeProductModal.rating}
                    </span>
                    <span className="text-[#7D6A5C]">
                      ({activeProductModal.reviewsCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="inline-block px-3 py-1 rounded bg-[#9E5334] text-[#FAF6F0] text-lg font-bold font-serif-classic tabular-nums">
                  ${activeProductModal.price.toFixed(2)}
                </div>

                <p className="text-xs text-[#5C4A3E] leading-relaxed">
                  {activeProductModal.detailedDescription}
                </p>

                <div className="space-y-2 pt-2 border-t border-[#E2D7C8]">
                  <h4 className="text-xs font-bold text-[#9E5334] uppercase tracking-wider flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5" />
                    <span>Botanical Actives & Nomenclature</span>
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    {activeProductModal.botanicalIngredients.map((b, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded bg-[#F3ECE3] border border-[#E2D7C8] flex justify-between gap-2"
                      >
                        <div>
                          <span className="font-semibold text-[#211813]">
                            {b.commonName}
                          </span>{' '}
                          <span className="text-[11px] text-[#665448] italic">
                            ({b.botanicalName})
                          </span>
                        </div>
                        <span className="text-[11px] text-[#9E5334] font-medium shrink-0">
                          {b.action}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#F3ECE3] border border-[#E2D7C8] text-xs text-[#5C4A3E]">
                  <strong className="text-[#211813] block mb-0.5">Clinical Dosage:</strong>
                  {activeProductModal.suggestedUse}
                </div>

                <div className="pt-3 border-t border-[#E2D7C8] flex items-center gap-4">
                  <div className="flex items-center border border-[#D8CBB8] rounded-lg bg-white">
                    <button
                      onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                      aria-label="Decrease quantity"
                      className="p-2 text-[#5C4A3E] hover:text-[#211813] cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-[#211813] tabular-nums">
                      {modalQuantity}
                    </span>
                    <button
                      onClick={() => setModalQuantity(modalQuantity + 1)}
                      aria-label="Increase quantity"
                      className="p-2 text-[#5C4A3E] hover:text-[#211813] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleModalAddToCart}
                    className="flex-1 py-3 rounded-xl bg-[#9E5334] hover:bg-[#824127] text-[#FAF6F0] font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
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
