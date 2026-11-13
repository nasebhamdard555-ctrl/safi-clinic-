import React, { useState, useEffect } from 'react';
import {
  Calendar,
  ShoppingBag,
  Phone,
  X,
  Activity,
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
import { GeminiChatbot } from './components/GeminiChatbot';
import { HerbalProduct, CartItem } from './types/clinic';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { SymptomMatcherPage } from './pages/SymptomMatcherPage';
import { PatientPortalPage } from './pages/PatientPortalPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { PosTriagePage } from './pages/PosTriagePage';
import { CartTotals, calculateCartTotals } from './utils/clinicLogic';
import { BotanicalImage } from './components/BotanicalImage';

export type PageType =
  | 'home'
  | 'treatments'
  | 'booking'
  | 'shop'
  | 'symptom-checker'
  | 'testimonials'
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
    text: string;
    textSelection: string;
    accentColor: string;
    name: string;
  }
> = {
  home: {
    bg: 'bg-[#F5F2EB]',
    text: 'text-[#141815]',
    textSelection: 'selection:bg-[#8C5A32] selection:text-[#FAF7F2]',
    accentColor: '#8C5A32',
    name: 'Warm Limestone Editorial',
  },
  treatments: {
    bg: 'bg-[#EBF1EC]',
    text: 'text-[#12261A]',
    textSelection: 'selection:bg-[#1F4A32] selection:text-[#F9FBF9]',
    accentColor: '#1F4A32',
    name: 'Soft Sage Mist',
  },
  shop: {
    bg: 'bg-[#F3ECE3]',
    text: 'text-[#211813]',
    textSelection: 'selection:bg-[#9E5334] selection:text-[#FAF6F0]',
    accentColor: '#9E5334',
    name: 'Warm Desert Sand',
  },
  about: {
    bg: 'bg-[#111E17]',
    text: 'text-[#F4F0E6]',
    textSelection: 'selection:bg-[#D4AF7A] selection:text-[#111E17]',
    accentColor: '#D4AF7A',
    name: 'Midnight Botanical',
  },
  booking: {
    bg: 'bg-[#FAF8F5]',
    text: 'text-[#18201B]',
    textSelection: 'selection:bg-[#18201B] selection:text-[#FAF8F5]',
    accentColor: '#18201B',
    name: 'Crisp Alabaster',
  },
  contact: {
    bg: 'bg-[#FAF8F5]',
    text: 'text-[#18201B]',
    textSelection: 'selection:bg-[#18201B] selection:text-[#FAF8F5]',
    accentColor: '#18201B',
    name: 'Crisp Alabaster',
  },
  'symptom-checker': {
    bg: 'bg-[#04171c]',
    text: 'text-[#f5f3ec]',
    textSelection: 'selection:bg-[#06b6d4] selection:text-black',
    accentColor: '#06b6d4',
    name: 'Diagnostic Cyan-Teal',
  },
  testimonials: {
    bg: 'bg-[#0a0a0c]',
    text: 'text-[#f5f3ec]',
    textSelection: 'selection:bg-[#fbbf24] selection:text-black',
    accentColor: '#fbbf24',
    name: 'Deep Obsidian Onyx & Gold',
  },
  blog: {
    bg: 'bg-[#0d1609]',
    text: 'text-[#f5f3ec]',
    textSelection: 'selection:bg-[#84cc16] selection:text-black',
    accentColor: '#84cc16',
    name: 'Earthy Moss Journal',
  },
  'patient-portal': {
    bg: 'bg-[#050e18]',
    text: 'text-[#f0f4f8]',
    textSelection: 'selection:bg-[#38bdf8] selection:text-black',
    accentColor: '#38bdf8',
    name: 'Patient Health Portal',
  },
  admin: {
    bg: 'bg-[#04110b]',
    text: 'text-[#f5f3ec]',
    textSelection: 'selection:bg-[#d4af37] selection:text-black',
    accentColor: '#d4af37',
    name: 'Executive Clinical Accounting',
  },
  'pos-triage': {
    bg: 'bg-[#04140e]',
    text: 'text-[#f5f3ec]',
    textSelection: 'selection:bg-[#22c55e] selection:text-black',
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
        'testimonials',
        'blog',
        'about',
        'contact',
        'patient-portal',
        'admin',
        'pos-triage',
      ];
      if (validPages.includes(hash as PageType)) {
        setCurrentPage(hash as PageType);
      } else if (hash === 'soundscapes' || hash === '3d-apothecary') {
        setCurrentPage('home');
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
      'testimonials',
      'blog',
      'about',
      'contact',
      'patient-portal',
      'admin',
      'pos-triage',
    ];

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
      pageId === 'testimonials' ||
      pageId === 'reviews' ||
      pageId === 'stories' ||
      pageId === 'cases'
    )
      targetPage = 'testimonials';
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
  const theme = PAGE_THEMES[currentPage];

  return (
    <div
      className={`min-h-screen ${theme.bg} ${theme.text} relative font-sans transition-colors duration-500 ease-in-out ${theme.textSelection} pb-20 sm:pb-0`}
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
            onNavigateToSymptoms={() => handleNavigate('symptom-checker')}
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

        {currentPage === 'testimonials' && (
          <TestimonialsPage
            onOpenBooking={(serviceId) => handleNavigate('booking', serviceId)}
            onNavigateToTreatments={() => handleNavigate('treatments')}
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
        >
          <div className="relative w-full max-w-2xl bg-[#FAF6F0] text-[#211813] border border-[#C9BBAE] rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#F3ECE3] border-b border-[#DFD4C7]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9E5334]">
                Formulation Dossier
              </span>
              <button
                onClick={() => setQuickViewProduct(null)}
                aria-label="Close product modal"
                className="p-1.5 rounded-lg bg-[#EAE0D3] text-[#4B3B31] hover:text-[#211813] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="aspect-square rounded-xl overflow-hidden border border-[#DFD4C7] bg-[#EAE0D3]">
                  <BotanicalImage
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-[#EAE0D3] border border-[#D4C5B4] text-[10px] font-bold text-[#9E5334] uppercase">
                    {quickViewProduct.category}
                  </span>
                  <h3 className="font-serif-classic text-xl font-bold text-[#211813]">
                    {quickViewProduct.name}
                  </h3>
                  <p className="text-xs text-[#6B5A50]">{quickViewProduct.subtitle}</p>

                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#9E5334] font-serif-classic">
                      ${quickViewProduct.price.toFixed(2)}
                    </span>
                    {quickViewProduct.originalPrice && (
                      <span className="text-xs text-[#7D6C61] line-through">
                        ${quickViewProduct.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#4B3B31] leading-relaxed">
                    {quickViewProduct.shortDescription}
                  </p>

                  <div className="pt-2 flex items-center gap-3">
                    <div className="flex items-center rounded-lg bg-[#F3ECE3] border border-[#D4C5B4]">
                      <button
                        onClick={() =>
                          setQuickViewQuantity(Math.max(1, quickViewQuantity - 1))
                        }
                        className="px-3 py-1.5 text-xs text-[#4B3B31] hover:text-[#211813] cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 py-1.5 text-xs font-bold text-[#211813]">
                        {quickViewQuantity}
                      </span>
                      <button
                        onClick={() => setQuickViewQuantity(quickViewQuantity + 1)}
                        className="px-3 py-1.5 text-xs text-[#4B3B31] hover:text-[#211813] cursor-pointer"
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
                      className="flex-1 py-2.5 rounded-lg bg-[#9E5334] hover:bg-[#824127] text-[#FAF6F0] font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{quickViewAddedNotice ? 'Added to Cart!' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#DFD4C7]">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#9E5334] mb-2">
                    Key Botanical Actions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {quickViewProduct.botanicalIngredients.map((b, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#F3ECE3] border border-[#DFD4C7] text-xs space-y-0.5"
                      >
                        <div className="font-semibold text-[#211813]">{b.commonName}</div>
                        <div className="text-[10px] text-[#6B5A50] italic">
                          {b.botanicalName}
                        </div>
                        <div className="text-[10px] text-[#2B593F] font-medium">{b.action}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#9E5334] mb-1">
                    Suggested Usage
                  </h4>
                  <p className="text-xs text-[#4B3B31] leading-relaxed">
                    {quickViewProduct.suggestedUse}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Quick Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-[#141815]/95 backdrop-blur-lg border-t border-[#2B332D] px-2 py-2 flex items-center justify-around shadow-2xl text-[#D8DDD9]">
        <a
          href="tel:+93780299299"
          className="flex flex-col items-center gap-1 text-[10px] hover:text-[#D4AF7A] px-2 py-1"
        >
          <Phone className="w-4 h-4 text-[#D4AF7A]" />
          <span>Call Desk</span>
        </a>

        <button
          onClick={() => handleNavigate('treatments')}
          className={`flex flex-col items-center gap-1 text-[10px] px-2 py-1 ${
            currentPage === 'treatments' ? 'text-[#D4AF7A]' : ''
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Treatments</span>
        </button>

        <button
          onClick={() => handleNavigate('booking')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#D4AF7A] text-[#141815] font-bold text-xs"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Visit</span>
        </button>

        <button
          onClick={() => handleNavigate('shop')}
          className={`flex flex-col items-center gap-1 text-[10px] px-2 py-1 ${
            currentPage === 'shop' ? 'text-[#D4AF7A]' : ''
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-[#D4AF7A]" />
          <span>Shop</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 text-[10px] hover:text-[#D4AF7A] px-2 py-1"
        >
          <ShoppingBag className="w-4 h-4 text-emerald-400" />
          <span>Cart</span>
          {totalCartCount > 0 && (
            <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-[#D4AF7A] text-[#141815] text-[9px] font-bold flex items-center justify-center">
              {totalCartCount}
            </span>
          )}
        </button>
      </div>

      {/* Global Clinical AI Chatbot */}
      <GeminiChatbot onOpenBooking={() => handleNavigate('booking')} />
    </div>
  );
}
