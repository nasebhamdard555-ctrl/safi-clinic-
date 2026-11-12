import React, { useState, useEffect } from 'react';
import {
  Calendar,
  ShoppingBag,
  Phone,
  MessageCircle,
  Sparkles,
  X,
  Star,
  Check,
  ShieldCheck,
  Leaf,
  Activity,
  Layers,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { HomePage } from './pages/HomePage';
import { TreatmentsPage } from './pages/TreatmentsPage';
import { BookingPage } from './pages/BookingPage';
import { ShopPage } from './pages/ShopPage';
import { BlogPage } from './pages/BlogPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { Apothecary3DPage } from './pages/Apothecary3DPage';
import { GeminiChatbot } from './components/GeminiChatbot';
import { HerbalProduct, CartItem } from './types/clinic';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { AcousticWellnessPage } from './pages/AcousticWellnessPage';
import { SymptomMatcherPage } from './pages/SymptomMatcherPage';
import { PatientPortalPage } from './pages/PatientPortalPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { PosTriagePage } from './pages/PosTriagePage';
import { CartTotals, calculateCartTotals } from './utils/clinicLogic';

export type PageType =
  | 'home'
  | 'treatments'
  | 'booking'
  | 'shop'
  | 'symptom-checker'
  | 'soundscapes'
  | 'testimonials'
  | '3d-apothecary'
  | 'blog'
  | 'about'
  | 'contact'
  | 'patient-portal'
  | 'admin'
  | 'pos-triage';

export const PAGE_THEMES: Record<
  PageType,
  {
    bg: string;
    textSelection: string;
    accentColor: string;
    name: string;
  }
> = {
  home: {
    bg: 'bg-[#04140b]',
    textSelection: 'selection:bg-[#d4af37]',
    accentColor: '#d4af37',
    name: 'Imperial Forest Emerald',
  },
  treatments: {
    bg: 'bg-[#021a17]',
    textSelection: 'selection:bg-[#2dd4bf]',
    accentColor: '#2dd4bf',
    name: 'Classical Oceanic Jade',
  },
  booking: {
    bg: 'bg-[#05121a]',
    textSelection: 'selection:bg-[#f59e0b]',
    accentColor: '#f59e0b',
    name: 'Midnight Cypress & Topaz',
  },
  shop: {
    bg: 'bg-[#021810]',
    textSelection: 'selection:bg-[#facc15]',
    accentColor: '#facc15',
    name: 'Lustrous Malachite & Crown Gold',
  },
  'symptom-checker': {
    bg: 'bg-[#04171c]',
    textSelection: 'selection:bg-[#06b6d4]',
    accentColor: '#06b6d4',
    name: 'Diagnostic Cyan-Teal',
  },
  soundscapes: {
    bg: 'bg-[#070d18]',
    textSelection: 'selection:bg-[#c084fc]',
    accentColor: '#c084fc',
    name: 'Celestial Indigo-Emerald',
  },
  testimonials: {
    bg: 'bg-[#0a0a0c]',
    textSelection: 'selection:bg-[#fbbf24]',
    accentColor: '#fbbf24',
    name: 'Deep Obsidian Onyx & Gold',
  },
  '3d-apothecary': {
    bg: 'bg-[#050c09]',
    textSelection: 'selection:bg-[#d97706]',
    accentColor: '#d97706',
    name: 'Alchemical Crucible Bronze',
  },
  blog: {
    bg: 'bg-[#0d1609]',
    textSelection: 'selection:bg-[#84cc16]',
    accentColor: '#84cc16',
    name: 'Ancient Earthy Moss & Olive',
  },
  about: {
    bg: 'bg-[#041712]',
    textSelection: 'selection:bg-[#d4af37]',
    accentColor: '#d4af37',
    name: 'Noble Mountain Pine',
  },
  contact: {
    bg: 'bg-[#11160e]',
    textSelection: 'selection:bg-[#f59e0b]',
    accentColor: '#f59e0b',
    name: 'Warm Sunset Courtyard',
  },
  'patient-portal': {
    bg: 'bg-[#050e18]',
    textSelection: 'selection:bg-[#38bdf8]',
    accentColor: '#38bdf8',
    name: 'Imperial Royal Sapphire & Emerald',
  },
  admin: {
    bg: 'bg-[#04110b]',
    textSelection: 'selection:bg-[#d4af37]',
    accentColor: '#d4af37',
    name: 'Executive Clinical Accounting Obsidian',
  },
  'pos-triage': {
    bg: 'bg-[#04140e]',
    textSelection: 'selection:bg-[#22c55e]',
    accentColor: '#22c55e',
    name: 'Dispensary POS & Triage Emerald',
  },
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutTotals, setCheckoutTotals] = useState<CartTotals>(
    calculateCartTotals([])
  );
  const [selectedServiceIdForBooking, setSelectedServiceIdForBooking] = useState<
    string | null
  >(null);
  const [quickViewProduct, setQuickViewProduct] = useState<HerbalProduct | null>(
    null
  );
  const [quickViewQuantity, setQuickViewQuantity] = useState<number>(1);
  const [quickViewAddedNotice, setQuickViewAddedNotice] = useState<boolean>(false);

  // Initialize and synchronize with URL hash
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validPages: PageType[] = [
        'home',
        'treatments',
        'booking',
        'shop',
        'symptom-checker',
        'soundscapes',
        'testimonials',
        '3d-apothecary',
        'blog',
        'about',
        'contact',
        'patient-portal',
        'admin',
        'pos-triage',
      ];
      if (validPages.includes(hash as PageType)) {
        setCurrentPage(hash as PageType);
      }
    };

    handleHashSync();
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  const handleNavigate = (pageId: string, serviceId?: string) => {
    const validPages: PageType[] = [
      'home',
      'treatments',
      'booking',
      'shop',
      'symptom-checker',
      'soundscapes',
      'testimonials',
      '3d-apothecary',
      'blog',
      'about',
      'contact',
      'patient-portal',
      'admin',
      'pos-triage',
    ];

    // normalize legacy or alias ids
    let targetPage: PageType = 'home';
    if (pageId === 'hero' || pageId === 'home') targetPage = 'home';
    else if (pageId === 'services' || pageId === 'treatments') targetPage = 'treatments';
    else if (pageId === 'booking') targetPage = 'booking';
    else if (pageId === 'shop') targetPage = 'shop';
    else if (
      pageId === 'patient-portal' ||
      pageId === 'portal' ||
      pageId === 'history' ||
      pageId === 'health-history' ||
      pageId === 'records' ||
      pageId === 'dashboard'
    )
      targetPage = 'patient-portal';
    else if (
      pageId === 'symptom-checker' ||
      pageId === 'symptoms' ||
      pageId === 'triage' ||
      pageId === 'diagnostics'
    )
      targetPage = 'symptom-checker';
    else if (
      pageId === 'soundscapes' ||
      pageId === 'wellness' ||
      pageId === 'acoustic' ||
      pageId === 'frequency'
    )
      targetPage = 'soundscapes';
    else if (
      pageId === 'testimonials' ||
      pageId === 'reviews' ||
      pageId === 'stories' ||
      pageId === 'cases'
    )
      targetPage = 'testimonials';
    else if (
      pageId === '3d-apothecary' ||
      pageId === 'apothecary' ||
      pageId === '3d'
    )
      targetPage = '3d-apothecary';
    else if (pageId === 'blog' || pageId === 'articles') targetPage = 'blog';
    else if (pageId === 'about' || pageId === 'clinic') targetPage = 'about';
    else if (pageId === 'contact' || pageId === 'location') targetPage = 'contact';
    else if (pageId === 'admin' || pageId === 'accounting' || pageId === 'inventory') targetPage = 'admin';
    else if (pageId === 'pos-triage' || pageId === 'pos' || pageId === 'crm' || pageId === 'qr-triage') targetPage = 'pos-triage';
    else if (validPages.includes(pageId as PageType)) {
      targetPage = pageId as PageType;
    }

    if (serviceId) {
      setSelectedServiceIdForBooking(serviceId);
    }

    setCurrentPage(targetPage);
    window.location.hash = targetPage;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const handleAddToCart = (product: HerbalProduct, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleStartCheckout = (totals: CartTotals) => {
    setCheckoutTotals(totals);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div
      className={`min-h-screen ${PAGE_THEMES[currentPage].bg} text-[#f5f3ec] relative font-sans transition-colors duration-700 ease-in-out ${PAGE_THEMES[currentPage].textSelection} selection:text-black pb-20 sm:pb-0`}
    >
      {/* Navigation Header */}
      <Navbar
        activeSection={currentPage}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBooking={() => handleNavigate('booking')}
      />

      {/* Main Multi-Page Router */}
      <main className="transition-opacity duration-300">
        {currentPage === 'home' && (
          <HomePage
            onOpenBooking={(serviceId) => handleNavigate('booking', serviceId)}
            onNavigateToTreatments={() => handleNavigate('treatments')}
            onNavigateToShop={() => handleNavigate('shop')}
            onNavigateToBlog={() => handleNavigate('blog')}
            onNavigateToAbout={() => handleNavigate('about')}
            onNavigateToContact={() => handleNavigate('contact')}
            onNavigateTo3D={() => handleNavigate('3d-apothecary')}
            onNavigateToSymptoms={() => handleNavigate('symptom-checker')}
            onNavigateToSoundscapes={() => handleNavigate('soundscapes')}
            onNavigateToTestimonials={() => handleNavigate('testimonials')}
            onNavigateToPortal={() => handleNavigate('patient-portal')}
            onAddToCart={handleAddToCart}
            onQuickViewProduct={(prod) => {
              setQuickViewProduct(prod);
              setQuickViewQuantity(1);
            }}
          />
        )}

        {currentPage === 'treatments' && (
          <TreatmentsPage
            onSelectServiceAndBook={(serviceId) => handleNavigate('booking', serviceId)}
            onOpenBooking={() => handleNavigate('booking')}
          />
        )}

        {currentPage === 'booking' && (
          <BookingPage
            initialServiceId={selectedServiceIdForBooking}
            onSelectProduct={() => handleNavigate('shop')}
          />
        )}

        {currentPage === 'shop' && (
          <ShopPage
            onAddToCart={handleAddToCart}
            onOpenBooking={() => handleNavigate('booking')}
          />
        )}

        {currentPage === 'symptom-checker' && (
          <SymptomMatcherPage
            onOpenBooking={(serviceId) => handleNavigate('booking', serviceId)}
            onNavigateToShop={() => handleNavigate('shop')}
            onAddToCart={handleAddToCart}
            onQuickViewProduct={(prod) => {
              setQuickViewProduct(prod);
              setQuickViewQuantity(1);
            }}
          />
        )}

        {currentPage === 'soundscapes' && (
          <AcousticWellnessPage
            onOpenBooking={() => handleNavigate('booking')}
            onNavigateToTreatments={() => handleNavigate('treatments')}
          />
        )}

        {currentPage === 'testimonials' && (
          <TestimonialsPage
            onOpenBooking={(serviceId) => handleNavigate('booking', serviceId)}
            onNavigateToTreatments={() => handleNavigate('treatments')}
          />
        )}

        {currentPage === '3d-apothecary' && (
          <Apothecary3DPage
            onOpenBooking={() => handleNavigate('booking')}
            onNavigateToShop={() => handleNavigate('shop')}
          />
        )}

        {currentPage === 'blog' && (
          <BlogPage
            onSelectShopProduct={() => handleNavigate('shop')}
            onOpenBooking={() => handleNavigate('booking')}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onOpenBooking={() => handleNavigate('booking')}
            onNavigateToTreatments={() => handleNavigate('treatments')}
            onNavigateToContact={() => handleNavigate('contact')}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage onOpenBooking={() => handleNavigate('booking')} />
        )}

        {currentPage === 'patient-portal' && (
          <PatientPortalPage
            onOpenBooking={(serviceId) => handleNavigate('booking', serviceId)}
            onNavigateToShop={() => handleNavigate('shop')}
            onNavigateToContact={() => handleNavigate('contact')}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentPage === 'admin' && (
          <AdminDashboardPage
            onNavigateToPos={() => handleNavigate('pos-triage')}
          />
        )}

        {currentPage === 'pos-triage' && (
          <PosTriagePage
            onNavigateToAdmin={() => handleNavigate('admin')}
          />
        )}
      </main>

      {/* Footer across all pages */}
      <Footer
        onNavigate={handleNavigate}
        onOpenBooking={() => handleNavigate('booking')}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onStartCheckout={handleStartCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        totals={checkoutTotals}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Global Quick View Product Modal */}
      {quickViewProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
        >
          <div className="relative w-full max-w-2xl bg-[#091a13] border border-[#d4af37]/60 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#05110a] border-b border-[#1b3b2f]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                Product Dossier & Formulation
              </span>
              <button
                onClick={() => setQuickViewProduct(null)}
                aria-label="Close product modal"
                className="p-1 rounded-lg bg-[#0e2118] text-[#a6b6ad] hover:text-[#f5f3ec] hover:bg-[#153426] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="aspect-square rounded-xl overflow-hidden border border-[#234b3c] bg-black">
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <span className="px-2.5 py-0.5 rounded bg-[#0e2118] border border-[#234b3c] text-[10px] font-bold text-[#d4af37] uppercase">
                    {quickViewProduct.category}
                  </span>
                  <h3 className="font-serif-classic text-xl font-bold text-[#f5f3ec]">
                    {quickViewProduct.name}
                  </h3>
                  <p className="text-xs text-[#8da396]">{quickViewProduct.subtitle}</p>

                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#d4af37] font-serif-classic">
                      ${quickViewProduct.price.toFixed(2)}
                    </span>
                    {quickViewProduct.originalPrice && (
                      <span className="text-xs text-[#8da396] line-through">
                        ${quickViewProduct.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#a6b6ad] leading-relaxed">
                    {quickViewProduct.shortDescription}
                  </p>

                  <div className="pt-2 flex items-center gap-3">
                    <div className="flex items-center rounded-lg bg-[#05110a] border border-[#234b3c]">
                      <button
                        onClick={() =>
                          setQuickViewQuantity(Math.max(1, quickViewQuantity - 1))
                        }
                        className="px-3 py-1.5 text-xs text-[#a6b6ad] hover:text-white"
                      >
                        -
                      </button>
                      <span className="px-3 py-1.5 text-xs font-bold text-[#d4af37]">
                        {quickViewQuantity}
                      </span>
                      <button
                        onClick={() => setQuickViewQuantity(quickViewQuantity + 1)}
                        className="px-3 py-1.5 text-xs text-[#a6b6ad] hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        handleAddToCart(quickViewProduct, quickViewQuantity);
                        setQuickViewAddedNotice(true);
                        setTimeout(() => {
                          setQuickViewAddedNotice(false);
                          setQuickViewProduct(null);
                        }, 800);
                      }}
                      className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{quickViewAddedNotice ? 'Added to Cart!' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Ingredients & Usage */}
              <div className="space-y-4 pt-4 border-t border-[#1b3b2f]">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] mb-2">
                    Key Botanical Actions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {quickViewProduct.botanicalIngredients.map((b, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#06120d] border border-[#1b3b2f] text-xs space-y-0.5"
                      >
                        <div className="font-semibold text-[#f5f3ec]">{b.commonName}</div>
                        <div className="text-[10px] text-[#8da396] italic">
                          {b.botanicalName}
                        </div>
                        <div className="text-[10px] text-emerald-400">{b.action}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] mb-1">
                    Suggested Usage
                  </h4>
                  <p className="text-xs text-[#a6b6ad] leading-relaxed">
                    {quickViewProduct.suggestedUse}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Quick Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-[#05130b]/95 backdrop-blur-lg border-t border-[#c5a059]/30 px-2 py-2 flex items-center justify-around shadow-2xl">
        <a
          href="tel:+93780299299"
          className="flex flex-col items-center gap-1 text-[10px] text-[#a6b6ad] hover:text-[#d4af37] px-2 py-1"
        >
          <Phone className="w-4 h-4 text-[#d4af37]" />
          <span>Call Desk</span>
        </a>

        <button
          onClick={() => handleNavigate('treatments')}
          className={`flex flex-col items-center gap-1 text-[10px] px-2 py-1 ${
            currentPage === 'treatments' ? 'text-[#d4af37]' : 'text-[#a6b6ad]'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Treatments</span>
        </button>

        <button
          onClick={() => handleNavigate('booking')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs shadow-md"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Visit</span>
        </button>

        <button
          onClick={() => handleNavigate('shop')}
          className={`flex flex-col items-center gap-1 text-[10px] px-2 py-1 ${
            currentPage === 'shop' ? 'text-[#d4af37]' : 'text-[#a6b6ad]'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
          <span>Shop</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 text-[10px] text-[#a6b6ad] hover:text-[#d4af37] px-2 py-1"
        >
          <ShoppingBag className="w-4 h-4 text-emerald-400" />
          <span>Cart</span>
          {totalCartCount > 0 && (
            <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-[#d4af37] text-black text-[9px] font-bold flex items-center justify-center">
              {totalCartCount}
            </span>
          )}
        </button>
      </div>

      {/* Global Clinical AI Chatbot with Search & Maps Grounding */}
      <GeminiChatbot onOpenBooking={() => handleNavigate('booking')} />
    </div>
  );
}
