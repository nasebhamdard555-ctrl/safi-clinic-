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
import { useLanguage } from './context/LanguageContext';
import { useCurrency } from './context/CurrencyContext';

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
    bg: 'bg-[#06110C]',
    text: 'text-[#F4F0E6]',
    textSelection: 'selection:bg-[#D4AF37] selection:text-[#06110C]',
    accentColor: '#D4AF37',
    name: 'Obsidian Botanical & Gold',
  },
  treatments: {
    bg: 'bg-[#07150F]',
    text: 'text-[#F4F0E6]',
    textSelection: 'selection:bg-[#D4AF37] selection:text-[#07150F]',
    accentColor: '#D4AF37',
    name: 'Deep Forest Emerald',
  },
  shop: {
    bg: 'bg-[#081610]',
    text: 'text-[#F4F0E6]',
    textSelection: 'selection:bg-[#D4AF37] selection:text-[#081610]',
    accentColor: '#D4AF37',
    name: 'Apothecary Pine & Gold',
  },
  about: {
    bg: 'bg-[#08140E]',
    text: 'text-[#F4F0E6]',
    textSelection: 'selection:bg-[#D4AF37] selection:text-[#08140E]',
    accentColor: '#D4AF37',
    name: 'Midnight Botanical',
  },
  booking: {
    bg: 'bg-[#07130D]',
    text: 'text-[#F4F0E6]',
    textSelection: 'selection:bg-[#D4AF37] selection:text-[#07130D]',
    accentColor: '#D4AF37',
    name: 'Obsidian Clinic Desk',
  },
  contact: {
    bg: 'bg-[#07130D]',
    text: 'text-[#F4F0E6]',
    textSelection: 'selection:bg-[#D4AF37] selection:text-[#07130D]',
    accentColor: '#D4AF37',
    name: 'Obsidian Clinic Desk',
  },
  'symptom-checker': {
    bg: 'bg-[#061412]',
    text: 'text-[#F4F0E6]',
    textSelection: 'selection:bg-[#D4AF37] selection:text-[#061412]',
    accentColor: '#D4AF37',
    name: 'Diagnostic Botanical Dark',
  },
  testimonials: {
    bg: 'bg-[#06110C]',
    text: 'text-[#F4F0E6]',
    textSelection: 'selection:bg-[#D4AF37] selection:text-[#06110C]',
    accentColor: '#D4AF37',
    name: 'Obsidian Onyx & Gold',
  },
  blog: {
    bg: 'bg-[#08150D]',
    text: 'text-[#F4F0E6]',
    textSelection: 'selection:bg-[#D4AF37] selection:text-[#08150D]',
    accentColor: '#D4AF37',
    name: 'Forest Monograph Journal',
  },
  'patient-portal': {
    bg: 'bg-[#06120D]',
    text: 'text-[#F4F0E6]',
    textSelection: 'selection:bg-[#D4AF37] selection:text-[#06120D]',
    accentColor: '#D4AF37',
    name: 'Patient Health Portal',
  },
  admin: {
    bg: 'bg-[#04110B]',
    text: 'text-[#F4F0E6]',
    textSelection: 'selection:bg-[#D4AF37] selection:text-[#04110B]',
    accentColor: '#D4AF37',
    name: 'Executive Clinical Accounting',
  },
  'pos-triage': {
    bg: 'bg-[#04140E]',
    text: 'text-[#F4F0E6]',
    textSelection: 'selection:bg-[#D4AF37] selection:text-[#04140E]',
    accentColor: '#D4AF37',
    name: 'Dispensary POS & Triage Emerald',
  },
};

export default function App() {
  const { dir, t } = useLanguage();
  const { formatPrice } = useCurrency();
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

  const quickViewLoc = quickViewProduct ? t.productsMap[quickViewProduct.id] : undefined;

  return (
    <div
      dir={dir}
      className={`min-h-screen ${theme.bg} ${theme.text} relative font-sans transition-colors duration-500 ease-in-out ${theme.textSelection} overflow-x-clip pb-20 sm:pb-0`}
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
        >
          <div className="relative w-full max-w-2xl bg-[#0B1D14] text-[#F4F0E6] border border-[#1D3B2C] rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#06110C] border-b border-[#1D3B2C]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                {t.quickView.dossierTitle}
              </span>
              <button
                onClick={() => setQuickViewProduct(null)}
                aria-label={t.quickView.closeAria}
                className="min-w-[38px] min-h-[38px] p-1.5 rounded-lg bg-[#0B1D14] border border-[#1D3B2C] text-[#A6B8AE] hover:text-[#D4AF37] transition-colors flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="aspect-square rounded-xl overflow-hidden border border-[#1D3B2C] bg-[#06110C]">
                  <BotanicalImage
                    src={quickViewProduct.image}
                    alt={quickViewLoc?.name || quickViewProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                    {t.shop.productCategories[quickViewProduct.category] || quickViewProduct.category}
                  </span>
                  <h3 className="font-serif-classic text-xl font-bold text-[#F4F0E6]">
                    {quickViewLoc?.name || quickViewProduct.name}
                  </h3>
                  <p className="text-xs text-[#A6B8AE]">
                    {quickViewLoc?.subtitle || quickViewProduct.subtitle}
                  </p>

                  <div className="flex items-center gap-2" dir="ltr">
                    <span className="text-2xl font-bold text-[#D4AF37] font-serif-classic tabular-nums">
                      {formatPrice(quickViewProduct.price)}
                    </span>
                    {quickViewProduct.originalPrice && (
                      <span className="text-xs text-[#6E8478] line-through tabular-nums">
                        {formatPrice(quickViewProduct.originalPrice)}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#C2D1C8] leading-relaxed">
                    {quickViewLoc?.shortDescription || quickViewProduct.shortDescription}
                  </p>

                  <div className="pt-2 flex items-center gap-3">
                    <div className="flex items-center rounded-lg bg-[#06110C] border border-[#1D3B2C]">
                      <button
                        onClick={() =>
                          setQuickViewQuantity(Math.max(1, quickViewQuantity - 1))
                        }
                        aria-label="Decrease quantity"
                        className="min-w-[36px] min-h-[36px] px-3 py-1.5 text-xs text-[#A6B8AE] hover:text-[#F4F0E6] cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 py-1.5 text-xs font-bold text-[#F4F0E6] tabular-nums">
                        {quickViewQuantity}
                      </span>
                      <button
                        onClick={() => setQuickViewQuantity(quickViewQuantity + 1)}
                        aria-label="Increase quantity"
                        className="min-w-[36px] min-h-[36px] px-3 py-1.5 text-xs text-[#A6B8AE] hover:text-[#F4F0E6] cursor-pointer"
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
                      className="flex-1 min-h-[40px] py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{quickViewAddedNotice ? t.quickView.addedNotice : t.quickView.addToCart}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#1D3B2C]">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                    {t.quickView.keyActives}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {quickViewProduct.botanicalIngredients.map((b, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#06110C] border border-[#1D3B2C] text-xs space-y-0.5"
                      >
                        <div className="font-semibold text-[#F4F0E6]">{b.commonName}</div>
                        <div className="text-[10px] text-[#A6B8AE] italic" dir="ltr">
                          {b.botanicalName}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-medium">{b.action}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-1">
                    {t.quickView.suggestedUse}
                  </h4>
                  <p className="text-xs text-[#C2D1C8] leading-relaxed">
                    {quickViewLoc?.suggestedUse || quickViewProduct.suggestedUse}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Quick Action Bar (compact height <= 15% mobile viewport) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-[#06110C]/95 backdrop-blur-lg border-t border-[#1D3B2C] px-2 py-1.5 flex items-center justify-around shadow-2xl text-[#C2D1C8]">
        <a
          href="tel:+93780299299"
          className="flex flex-col items-center gap-0.5 text-[10px] hover:text-[#D4AF37] px-2 py-1 min-h-[42px] justify-center"
        >
          <Phone className="w-4 h-4 text-[#D4AF37]" />
          <span>{t.mobileBar.callDesk}</span>
        </a>

        <button
          onClick={() => handleNavigate('treatments')}
          className={`flex flex-col items-center gap-0.5 text-[10px] px-2 py-1 min-h-[42px] justify-center ${
            currentPage === 'treatments' ? 'text-[#D4AF37]' : ''
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{t.mobileBar.treatments}</span>
        </button>

        <button
          onClick={() => handleNavigate('booking')}
          className="flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg bg-[#D4AF37] text-[#06110C] font-bold text-xs whitespace-nowrap"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{t.mobileBar.bookVisit}</span>
        </button>

        <button
          onClick={() => handleNavigate('shop')}
          className={`flex flex-col items-center gap-0.5 text-[10px] px-2 py-1 min-h-[42px] justify-center ${
            currentPage === 'shop' ? 'text-[#D4AF37]' : ''
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
          <span>{t.mobileBar.shop}</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-0.5 text-[10px] hover:text-[#D4AF37] px-2 py-1 min-h-[42px] justify-center"
        >
          <ShoppingBag className="w-4 h-4 text-emerald-400" />
          <span>{t.mobileBar.cart}</span>
          {totalCartCount > 0 && (
            <span className="absolute top-0 end-1 w-4 h-4 rounded-full bg-[#D4AF37] text-[#06110C] text-[9px] font-bold flex items-center justify-center tabular-nums">
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
