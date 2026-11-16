import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle,
  CreditCard,
  Building,
  Truck,
  ArrowRight,
  Lock,
  Calendar,
} from 'lucide-react';
import { CartItem } from '../types/clinic';
import { CartTotals, generateOrderRef } from '../utils/clinicLogic';

import { useAuth } from '../context/AuthContext';
import { useClinicConfig } from '../context/ClinicConfigContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totals: CartTotals;
  onOrderCompleted: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  totals,
  onOrderCompleted,
}) => {
  const { user, getIdToken } = useAuth();
  const { refreshInventory } = useClinicConfig();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');

  // Shipping Fields
  const [shippingName, setShippingName] = useState<string>(user?.displayName || '');
  const [shippingEmail, setShippingEmail] = useState<string>(user?.email || '');
  const [shippingAddress, setShippingAddress] = useState<string>('');
  const [shippingCity, setShippingCity] = useState<string>('Kabul');
  const [shippingPostal, setShippingPostal] = useState<string>('');
  const [shippingPhone, setShippingPhone] = useState<string>('');

  // Payment Fields
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvc, setCardCvc] = useState<string>('');

  // Generated Order Details
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');

  if (!isOpen) return null;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingName || !shippingEmail || !shippingAddress || !shippingCity) {
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderRef = generateOrderRef();
    setConfirmedOrderId(orderRef);

    // Save order in Cloud SQL database via backend API
    (async () => {
      try {
        const token = await getIdToken();
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        await fetch('/api/orders', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            referenceNumber: orderRef,
            customerName: shippingName,
            customerEmail: shippingEmail,
            customerPhone: shippingPhone || 'Not provided',
            shippingAddress: shippingAddress,
            city: shippingCity,
            country: 'Afghanistan',
            itemsJson: JSON.stringify(
              items.map((i) => ({
                id: i.product.id,
                name: i.product.name,
                price: i.product.price,
                quantity: i.quantity,
              }))
            ),
            subtotal: Math.round(totals.subtotal),
            total: Math.round(totals.total),
          }),
        });
        await refreshInventory();
      } catch (err) {
        console.warn('Backend order persistence note:', err);
      }
    })();

    setStep(3);
    onOrderCompleted();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#081810] border-2 border-[#c5a059] rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl text-[#f5f3ec]">
        {/* Close Button (disabled in step 3 to encourage clicking Continue Shopping) */}
        {step !== 3 && (
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="absolute top-5 end-5 p-2 rounded-lg bg-[#0e2118] text-[#8da396] hover:text-[#f5f3ec] border border-[#1b3b2f] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* STEP 1: Shipping Address Form */}
        {step === 1 && (
          <div>
            <div className="pb-4 border-b border-[#1b3b2f] mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] font-semibold uppercase tracking-wider mb-1">
                <Truck className="w-3.5 h-3.5" />
                <span>{t.checkout.step1Kicker}</span>
              </div>
              <h3 className="font-serif-classic text-2xl font-bold text-[#f5f3ec]">
                {t.checkout.step1Title}
              </h3>
            </div>

            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-medium text-[#c9dad0] block mb-1">
                    {t.checkout.recipientName}
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    placeholder="Nadia Rahmati"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#06120d] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#c9dad0] block mb-1">
                    {t.checkout.emailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    value={shippingEmail}
                    onChange={(e) => setShippingEmail(e.target.value)}
                    placeholder="nadia.rahmati@example.com"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#06120d] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#c9dad0] block mb-1">
                  {t.checkout.addressLabel}
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Main Airport Road, Charahi Shaheed"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#06120d] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-medium text-[#c9dad0] block mb-1">
                    {t.checkout.cityLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    placeholder="Kabul"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#06120d] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#c9dad0] block mb-1">
                    {t.checkout.postalLabel}
                  </label>
                  <input
                    type="text"
                    value={shippingPostal}
                    onChange={(e) => setShippingPostal(e.target.value)}
                    placeholder="1001"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#06120d] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#c9dad0] block mb-1">
                    {t.checkout.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                    placeholder="+93 780 299 299"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#06120d] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* Order Mini Summary */}
              <div className="p-3.5 rounded-xl bg-[#06120d] border border-[#1b3b2f] flex justify-between items-center text-xs">
                <div>
                  <span className="text-[#8da396]">
                    {t.checkout.orderTotalLabel} ({items.length} {t.checkout.itemsWord}):
                  </span>
                  <span className="font-bold text-[#d4af37] block mt-0.5 tabular-nums" dir="ltr">
                    {formatPrice(totals.total)}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-400 font-medium">
                  {totals.shipping === 0 ? t.checkout.freeShippingApplied : t.checkout.standardShipping}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#aa8222] text-black font-bold text-sm tracking-wide shadow-xl hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.checkout.continuePayment}</span>
                <ArrowRight className="w-4 h-4 text-black rtl:rotate-180" />
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Payment Method */}
        {step === 2 && (
          <div>
            <div className="pb-4 border-b border-[#1b3b2f] mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] font-semibold uppercase tracking-wider mb-1">
                <Lock className="w-3.5 h-3.5" />
                <span>{t.checkout.step2Kicker}</span>
              </div>
              <h3 className="font-serif-classic text-2xl font-bold text-[#f5f3ec]">
                {t.checkout.step2Title}
              </h3>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-5">
              {/* Method Choices */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-xl border text-start text-xs transition-all flex flex-col gap-1.5 cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-[#153a2a] border-[#d4af37] text-[#f5f3ec]'
                      : 'bg-[#06120d] border-[#1b3b2f] text-[#8da396]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#d4af37]" />
                  <span className="font-bold">{t.checkout.cardMethod}</span>
                  <span className="text-[10px] text-[#8da396]">{t.checkout.cardSub}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-xl border text-start text-xs transition-all flex flex-col gap-1.5 cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'bg-[#153a2a] border-[#d4af37] text-[#f5f3ec]'
                      : 'bg-[#06120d] border-[#1b3b2f] text-[#8da396]'
                  }`}
                >
                  <Building className="w-4 h-4 text-[#d4af37]" />
                  <span className="font-bold">{t.checkout.codMethod}</span>
                  <span className="text-[10px] text-[#8da396]">{t.checkout.codSub}</span>
                </button>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-xl bg-[#06120d] border border-[#1b3b2f] space-y-3">
                  <div>
                    <label className="text-xs font-medium text-[#c9dad0] block mb-1">
                      {t.checkout.cardNumber}
                    </label>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      maxLength={19}
                      className="w-full px-3.5 py-2 rounded-lg bg-[#091f15] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-[#c9dad0] block mb-1">
                        {t.checkout.expiryDate}
                      </label>
                      <input
                        type="text"
                        required
                        dir="ltr"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-3.5 py-2 rounded-lg bg-[#091f15] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#c9dad0] block mb-1">
                        {t.checkout.cvcLabel}
                      </label>
                      <input
                        type="password"
                        required
                        dir="ltr"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-3.5 py-2 rounded-lg bg-[#091f15] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 rounded-xl bg-[#06120d] border border-[#1b3b2f] text-xs text-[#a6b6ad]">
                  <p className="font-semibold text-[#f5f3ec]">{t.checkout.codTitle}</p>
                  <p className="mt-1">{t.checkout.codNote}</p>
                </div>
              )}

              {/* Total review */}
              <div className="p-3.5 rounded-xl bg-[#0d2a1d] border border-[#c5a059]/40 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[#a6b6ad]">{t.checkout.totalToPay}</span>
                  <span className="font-serif-classic font-bold text-lg text-[#d4af37] block tabular-nums" dir="ltr">
                    {formatPrice(totals.total)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#f5f3ec]">
                  <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                  <span>{t.checkout.verifiedSafe}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs text-[#8da396] hover:text-[#f5f3ec] cursor-pointer"
                >
                  {t.checkout.backAddress}
                </button>

                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#aa8222] text-black font-bold text-sm shadow-xl hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer"
                >
                  {t.checkout.confirmOrder}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Order Confirmation */}
        {step === 3 && (
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#153a2a] border border-[#d4af37] flex items-center justify-center mx-auto text-[#d4af37]">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs px-3 py-1 rounded-full bg-[#102e21] text-[#d4af37] font-semibold uppercase tracking-wider border border-[#c5a059]/40">
                {t.checkout.orderConfirmedBadge}
              </span>
              <h3 className="font-serif-classic text-2xl font-bold text-[#f5f3ec] mt-2">
                {t.checkout.thankYouTitle}
              </h3>
              <p className="text-xs text-[#8da396] mt-1">
                {t.checkout.thankYouSub}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#06120d] border border-[#1b3b2f] text-start text-xs space-y-2">
              <div className="flex justify-between pb-2 border-b border-[#1b3b2f]">
                <span className="text-[#8da396]">{t.checkout.orderRefLabel}</span>
                <span className="font-mono font-bold text-[#d4af37]" dir="ltr">
                  {confirmedOrderId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8da396]">{t.checkout.recipientSummary}</span>
                <span className="font-medium text-[#f5f3ec]">{shippingName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8da396]">{t.checkout.deliverySummary}</span>
                <span className="font-medium text-[#f5f3ec]">{shippingAddress}, {shippingCity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8da396]">{t.checkout.estDelivery}</span>
                <span className="font-medium text-emerald-400">{t.checkout.estDeliveryVal}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#1b3b2f] font-bold">
                <span className="text-[#f5f3ec]">{t.checkout.totalPaid}</span>
                <span className="text-[#d4af37] font-serif-classic text-sm tabular-nums" dir="ltr">
                  {formatPrice(totals.total)}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-sm shadow-xl hover:brightness-110 transition-all cursor-pointer"
            >
              {t.checkout.continueExploring}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
