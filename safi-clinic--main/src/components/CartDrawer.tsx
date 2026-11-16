import React, { useState } from 'react';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  CheckCircle,
} from 'lucide-react';
import { CartItem } from '../types/clinic';
import { calculateCartTotals } from '../utils/clinicLogic';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onStartCheckout: (totals: ReturnType<typeof calculateCartTotals>) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onStartCheckout,
}) => {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [promoInput, setPromoInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const totals = calculateCartTotals(items, appliedPromo || undefined);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoInput.trim().toUpperCase();
    if (clean === 'HERBAL10' || clean === 'SAFI20') {
      setAppliedPromo(clean);
      setPromoMessage(`${clean}: ${t.cart.promoSuccess}`);
    } else {
      setPromoMessage(t.cart.promoInvalid);
    }
  };

  const handleCheckoutClick = () => {
    onStartCheckout(totals);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 end-0 max-w-full flex ps-10">
        <div className="w-screen max-w-md bg-[#081810] border-s border-[#1b3b2f] text-[#f5f3ec] shadow-2xl flex flex-col justify-between duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#1b3b2f] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#0d261a] border border-[#234b3c] text-[#d4af37]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-classic font-bold text-lg text-[#f5f3ec]">
                  {t.cart.title}
                </h3>
                <p className="text-xs text-[#8da396]">
                  {items.reduce((acc, i) => acc + i.quantity, 0)} {t.cart.itemsInBasket}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close cart"
              className="p-2 rounded-lg text-[#8da396] hover:text-[#f5f3ec] hover:bg-[#0d261a] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-5 py-3 bg-[#05110a] border-b border-[#1b3b2f] text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-[#d8e2dc]">
                <Truck className="w-3.5 h-3.5 text-[#d4af37]" />
                {totals.subtotal >= 60 ? (
                  <span className="text-emerald-400 font-semibold">
                    {t.cart.freeShippingUnlocked}
                  </span>
                ) : (
                  <span>
                    {t.cart.addMorePrefix}{' '}
                    <strong className="text-[#d4af37]" dir="ltr">
                      {formatPrice(totals.remainingForFreeShipping)}
                    </strong>{' '}
                    {t.cart.addMoreSuffix}
                  </span>
                )}
              </span>
              <span className="text-[11px] text-[#8da396] tabular-nums">
                {totals.freeShippingProgress}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#1b3b2f] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#d4af37] to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${totals.freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#0d261a] border border-[#1b3b2f] flex items-center justify-center mx-auto text-[#688274]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif-classic text-base font-bold text-[#f5f3ec]">
                  {t.cart.emptyTitle}
                </h4>
                <p className="text-xs text-[#8da396] max-w-xs mx-auto">
                  {t.cart.emptySub}
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg bg-[#153a2b] text-[#d4af37] border border-[#d4af37]/40 text-xs font-semibold hover:bg-[#1c4836] transition-colors cursor-pointer"
                >
                  {t.cart.browseBtn}
                </button>
              </div>
            ) : (
              items.map((item) => {
                const locProd = t.productsMap[item.product.id];
                return (
                  <div
                    key={item.product.id}
                    className="p-3.5 rounded-xl bg-[#0a1e14] border border-[#1b3b2f] flex gap-3.5 items-center"
                  >
                    <img
                      src={item.product.image}
                      alt={locProd?.name || item.product.name}
                      className="w-16 h-16 rounded-lg object-cover bg-[#05110a] shrink-0 border border-[#1b3b2f]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif-classic font-bold text-xs sm:text-sm text-[#f5f3ec] truncate">
                        {locProd?.name || item.product.name}
                      </h4>
                      <span className="text-[10px] text-[#8da396] block">
                        {locProd?.volumeOrWeight || item.product.volumeOrWeight}
                      </span>
                      <span className="text-xs font-bold text-[#d4af37] mt-0.5 block tabular-nums" dir="ltr">
                        {formatPrice(item.product.price)}
                      </span>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-[#1b3b2f] rounded bg-[#06120d]">
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.product.id, item.quantity - 1)
                            }
                            aria-label="Decrease quantity"
                            className="px-2 py-0.5 text-[#8da396] hover:text-[#f5f3ec] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-[#f5f3ec] tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.product.id, item.quantity + 1)
                            }
                            aria-label="Increase quantity"
                            className="px-2 py-0.5 text-[#8da396] hover:text-[#f5f3ec] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          aria-label="Remove item"
                          className="text-[#8da396] hover:text-rose-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-end shrink-0" dir="ltr">
                      <span className="text-xs font-bold text-[#f5f3ec] tabular-nums">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#1b3b2f] bg-[#06140e] space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#8da396] absolute start-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder={t.cart.promoPlaceholder}
                    className="w-full ps-8 pe-3 py-2 rounded-lg bg-[#091f15] border border-[#1b3b2f] text-xs text-[#f5f3ec] placeholder-[#4f675a] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-lg bg-[#153a2b] text-xs font-semibold text-[#d4af37] border border-[#2d5e4b] hover:bg-[#1c4836] cursor-pointer"
                >
                  {t.cart.applyBtn}
                </button>
              </form>

              {promoMessage && (
                <p
                  className={`text-[11px] ${
                    appliedPromo ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {promoMessage}
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#a6b6ad] pt-2 border-t border-[#1b3b2f]">
                <div className="flex justify-between">
                  <span>{t.cart.subtotal}</span>
                  <span className="text-[#f5f3ec] font-medium tabular-nums" dir="ltr">
                    {formatPrice(totals.subtotal)}
                  </span>
                </div>

                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>
                      {t.cart.discount} ({totals.discountCodeApplied})
                    </span>
                    <span dir="ltr" className="tabular-nums">-{formatPrice(totals.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{t.cart.shipping}</span>
                  <span className="text-[#f5f3ec] font-medium tabular-nums">
                    {totals.shipping === 0 ? (
                      t.cart.freeLabel
                    ) : (
                      <span dir="ltr">{formatPrice(totals.shipping)}</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>{t.cart.tax}</span>
                  <span className="text-[#f5f3ec] font-medium tabular-nums" dir="ltr">
                    {formatPrice(totals.tax)}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-[#f5f3ec] pt-2 border-t border-[#1b3b2f]">
                  <span>{t.cart.total}</span>
                  <span className="font-serif-classic text-base text-[#d4af37] tabular-nums" dir="ltr">
                    {formatPrice(totals.total)}
                  </span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#aa8222] text-black font-bold text-sm tracking-wide shadow-xl hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.cart.checkoutBtn}</span>
                <ArrowRight className="w-4 h-4 text-black rtl:rotate-180" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#6b8275]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{t.cart.sslNote}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
