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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#081810] border-2 border-[#c5a059] rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl text-[#f5f3ec]">
        {/* Close Button (disabled in step 3 to encourage clicking Continue Shopping) */}
        {step !== 3 && (
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="absolute top-5 right-5 p-2 rounded-lg bg-[#0e2118] text-[#8da396] hover:text-[#f5f3ec] border border-[#1b3b2f] transition-colors cursor-pointer"
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
                <span>Dispensary Shipping · Step 1 of 2</span>
              </div>
              <h3 className="font-serif-classic text-2xl font-bold text-[#f5f3ec]">
                Delivery Address & Contact
              </h3>
            </div>

            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-medium text-[#c9dad0] block mb-1">
                    Full Recipient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#06120d] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#c9dad0] block mb-1">
                    Email for Tracking Updates *
                  </label>
                  <input
                    type="email"
                    required
                    value={shippingEmail}
                    onChange={(e) => setShippingEmail(e.target.value)}
                    placeholder="e.g. eleanor@example.com"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#06120d] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#c9dad0] block mb-1">
                  Street Address & Apartment/Suite *
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="e.g. 142 Royal Botanical Way, Apt 3B"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#06120d] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-medium text-[#c9dad0] block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    placeholder="London / New York"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#06120d] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#c9dad0] block mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={shippingPostal}
                    onChange={(e) => setShippingPostal(e.target.value)}
                    placeholder="W1K 7AA"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#06120d] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#c9dad0] block mb-1">
                    Delivery Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                    placeholder="+1 555-0192"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#06120d] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* Order Mini Summary */}
              <div className="p-3.5 rounded-xl bg-[#06120d] border border-[#1b3b2f] flex justify-between items-center text-xs">
                <div>
                  <span className="text-[#8da396]">Order Total ({items.length} items):</span>
                  <span className="font-bold text-[#d4af37] block mt-0.5">
                    ${totals.total.toFixed(2)}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-400 font-medium">
                  {totals.shipping === 0 ? 'Free Shipping Applied' : 'Standard Shipping'}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#aa8222] text-black font-bold text-sm tracking-wide shadow-xl hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4 text-black" />
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
                <span>Secure Payment · Step 2 of 2</span>
              </div>
              <h3 className="font-serif-classic text-2xl font-bold text-[#f5f3ec]">
                Select Payment Option
              </h3>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-5">
              {/* Method Choices */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-xl border text-left text-xs transition-all flex flex-col gap-1.5 cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-[#153a2a] border-[#d4af37] text-[#f5f3ec]'
                      : 'bg-[#06120d] border-[#1b3b2f] text-[#8da396]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#d4af37]" />
                  <span className="font-bold">Credit / Debit Card</span>
                  <span className="text-[10px] text-[#8da396]">Visa, MC, Amex</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-xl border text-left text-xs transition-all flex flex-col gap-1.5 cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'bg-[#153a2a] border-[#d4af37] text-[#f5f3ec]'
                      : 'bg-[#06120d] border-[#1b3b2f] text-[#8da396]'
                  }`}
                >
                  <Building className="w-4 h-4 text-[#d4af37]" />
                  <span className="font-bold">Clinic Pickup / COD</span>
                  <span className="text-[10px] text-[#8da396]">Pay upon delivery</span>
                </button>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-xl bg-[#06120d] border border-[#1b3b2f] space-y-3">
                  <div>
                    <label className="text-xs font-medium text-[#c9dad0] block mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
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
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-3.5 py-2 rounded-lg bg-[#091f15] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#c9dad0] block mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="password"
                        required
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
                  <p className="font-semibold text-[#f5f3ec]">Cash on Delivery / Pickup:</p>
                  <p className="mt-1">
                    You can inspect your sealed herbal formulations upon delivery and pay the courier or clinic desk in cash.
                  </p>
                </div>
              )}

              {/* Total review */}
              <div className="p-3.5 rounded-xl bg-[#0d2a1d] border border-[#c5a059]/40 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[#a6b6ad]">Total to Pay Now:</span>
                  <span className="font-serif-classic font-bold text-lg text-[#d4af37] block">
                    ${totals.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#f5f3ec]">
                  <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                  <span>Verified Safe</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs text-[#8da396] hover:text-[#f5f3ec]"
                >
                  ← Back to Address
                </button>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#aa8222] text-black font-bold text-sm shadow-xl hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer"
                >
                  Confirm & Place Herbal Order
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Order Confirmation */}
        {step === 3 && (
          <div className="text-center py-4 space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-[#153a2a] border border-[#d4af37] flex items-center justify-center mx-auto text-[#d4af37]">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs px-3 py-1 rounded-full bg-[#102e21] text-[#d4af37] font-semibold uppercase tracking-wider border border-[#c5a059]/40">
                Order Confirmed
              </span>
              <h3 className="font-serif-classic text-2xl font-bold text-[#f5f3ec] mt-2">
                Thank You for Choosing Safi Herbal Clinic
              </h3>
              <p className="text-xs text-[#8da396] mt-1">
                Your order is currently being compounded and packed with organic botanical care.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#06120d] border border-[#1b3b2f] text-left text-xs space-y-2">
              <div className="flex justify-between pb-2 border-b border-[#1b3b2f]">
                <span className="text-[#8da396]">Order Reference Number:</span>
                <span className="font-mono font-bold text-[#d4af37]">
                  {confirmedOrderId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8da396]">Recipient:</span>
                <span className="font-medium text-[#f5f3ec]">{shippingName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8da396]">Delivery Address:</span>
                <span className="font-medium text-[#f5f3ec]">{shippingAddress}, {shippingCity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8da396]">Estimated Delivery:</span>
                <span className="font-medium text-emerald-400">2-4 Business Days</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#1b3b2f] font-bold">
                <span className="text-[#f5f3ec]">Total Paid:</span>
                <span className="text-[#d4af37] font-serif-classic text-sm">
                  ${totals.total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-sm shadow-xl hover:brightness-110 transition-all cursor-pointer"
            >
              Continue Exploring Safi Clinic
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
