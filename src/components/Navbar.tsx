import React, { useState, useEffect } from 'react';
import {
  Calendar,
  ShoppingBag,
  Menu,
  X,
  Phone,
  ShieldCheck,
  LogIn,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES } from '../utils/i18n';
import { useCurrency } from '../context/CurrencyContext';
import { CURRENCIES } from '../utils/currency';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  cartCount,
  onOpenCart,
  onOpenBooking,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const { user, signInWithGoogle, signOut, loading: authLoading } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency, toggleCurrency } = useCurrency();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const primaryNavLinks = [
    { id: 'home', label: t.nav.home },
    { id: 'treatments', label: t.nav.treatments },
    { id: 'shop', label: t.nav.shop },
    { id: 'about', label: t.nav.about },
    { id: 'contact', label: t.nav.contact },
  ];

  const secondaryNavLinks = [
    { id: 'booking', label: t.nav.booking, desc: t.nav.bookingDesc },
    { id: 'patient-portal', label: t.nav.patientPortal, desc: t.nav.patientPortalDesc },
    { id: 'symptom-checker', label: t.nav.symptomChecker, desc: t.nav.symptomCheckerDesc },
    { id: 'testimonials', label: t.nav.testimonials, desc: t.nav.testimonialsDesc },
    { id: 'blog', label: t.nav.blog, desc: t.nav.blogDesc },
    { id: 'pos-triage', label: t.nav.posTriage, desc: t.nav.posTriageDesc },
    { id: 'admin', label: t.nav.admin, desc: t.nav.adminDesc },
  ];

  const allNavLinks = [...primaryNavLinks, ...secondaryNavLinks];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
    setUserMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className="fixed top-8 left-0 right-0 z-40">
      <nav
        className={`transition-all duration-300 px-3 sm:px-6 lg:px-8 border-b ${
          isScrolled
            ? 'bg-[#06110C]/95 backdrop-blur-md py-2.5 border-[#1D3B2C] shadow-xl'
            : 'bg-[#06110C]/90 backdrop-blur-sm py-3 border-[#173024]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3 lg:gap-4">
          {/* Zone 1: Clean Single-Line Brand Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 text-start group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-lg shrink-0 whitespace-nowrap min-w-0"
            aria-label={t.brand.clinicName}
          >
            <div className="w-8 h-8 rounded-lg bg-[#0D2218] border border-[#D4AF37]/60 flex items-center justify-center shrink-0">
              <span className="font-serif-classic font-bold text-sm text-[#D4AF37]">
                S
              </span>
            </div>
            <span className="font-serif-classic text-xs sm:text-base font-bold tracking-wide text-[#F4F0E6] group-hover:text-[#D4AF37] transition-colors whitespace-nowrap">
              <span className="sm:hidden">{t.brand.shortWordmark}</span>
              <span className="hidden sm:inline">{t.brand.fullWordmark}</span>
            </span>
          </button>

          {/* Zone 2: Clean Single-Line Navigation Links */}
          <div className="hidden lg:flex items-center gap-3.5 xl:gap-5">
            {primaryNavLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-xs tracking-wide font-medium transition-colors relative py-1.5 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded ${
                    isActive
                      ? 'text-[#D4AF37] font-semibold'
                      : 'text-[#C2D1C8] hover:text-[#F4F0E6]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-[#D4AF37] rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Clinical Portals Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                aria-expanded={moreMenuOpen}
                className={`text-xs tracking-wide font-medium transition-colors py-1.5 px-2.5 rounded-lg flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                  secondaryNavLinks.some((l) => l.id === activeSection)
                    ? 'text-[#D4AF37] font-semibold bg-[#0F261B]'
                    : 'text-[#C2D1C8] hover:text-[#F4F0E6] hover:bg-[#0C1E15]'
                }`}
              >
                <span>{t.nav.portals}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    moreMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {moreMenuOpen && (
                <div className="absolute end-0 mt-2 w-64 rounded-xl bg-[#0B1D14] border border-[#1D3B2C] shadow-2xl p-2 space-y-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold border-b border-[#1D3B2C]">
                    {t.nav.portalsTitle}
                  </div>
                  {secondaryNavLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link.id)}
                      className={`w-full text-start p-2.5 rounded-lg transition-colors cursor-pointer ${
                        activeSection === link.id
                          ? 'bg-[#132E21] text-white font-semibold'
                          : 'hover:bg-[#10261B] text-[#C2D1C8]'
                      }`}
                    >
                      <div className="text-xs font-semibold text-[#F4F0E6]">{link.label}</div>
                      <div className="text-[11px] text-[#8FA699]">{link.desc}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Zone 3: 1-Click Language Switcher, Cart, Account & Primary Book CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* One-Click Segmented Currency Switcher (USD | AFG) */}
            <div
              role="group"
              aria-label={t.nav.currencyAria}
              dir="ltr"
              className="hidden sm:inline-flex items-center rounded-lg bg-[#0C1E15] border border-[#1D3B2C] p-0.5 shrink-0"
            >
              {CURRENCIES.map((cur) => {
                const isSelected = currency === cur.code;
                return (
                  <button
                    key={cur.code}
                    type="button"
                    data-testid={`currency-btn-${cur.code}`}
                    aria-pressed={isSelected}
                    onClick={() => setCurrency(cur.code)}
                    className={`min-h-[34px] sm:min-h-[36px] px-2 py-1 rounded-md text-[11px] font-bold transition-colors whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-[#D4AF37] text-[#06110C] shadow-sm'
                        : 'text-[#C2D1C8] hover:text-[#F4F0E6] hover:bg-[#10261B]'
                    }`}
                  >
                    {cur.shortLabel}
                  </button>
                );
              })}
            </div>

            {/* Mobile 1-Click Currency Toggle Button */}
            <button
              type="button"
              data-testid="currency-compact-btn"
              aria-label={`${t.nav.currencyAria}: ${currency === 'AFN' ? 'AFG' : 'USD'}`}
              onClick={toggleCurrency}
              dir="ltr"
              className="sm:hidden min-h-[36px] px-2 py-1 rounded-lg bg-[#0C1E15] border border-[#D4AF37]/50 text-[#D4AF37] text-[11px] font-bold whitespace-nowrap shrink-0 cursor-pointer"
            >
              {currency === 'AFN' ? 'AFG' : 'USD'}
            </button>

            {/* One-Click Segmented Language Switcher (EN | پښتو | دری) */}
            <div
              role="group"
              aria-label={t.nav.switcherAria}
              dir="ltr"
              className="inline-flex items-center rounded-lg bg-[#0C1E15] border border-[#1D3B2C] p-0.5 shrink-0"
            >
              {LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    data-testid={`lang-btn-${lang.code}`}
                    aria-pressed={isSelected}
                    onClick={() => setLanguage(lang.code)}
                    className={`min-h-[34px] sm:min-h-[36px] px-1.5 sm:px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-[#D4AF37] text-[#06110C] shadow-sm'
                        : 'text-[#C2D1C8] hover:text-[#F4F0E6] hover:bg-[#10261B]'
                    }`}
                  >
                    {lang.shortLabel}
                  </button>
                );
              })}
            </div>

            <button
              onClick={onOpenCart}
              aria-label={`${t.nav.openCartAria} (${cartCount})`}
              className="relative min-w-[38px] min-h-[38px] sm:min-w-[40px] sm:min-h-[40px] p-2 rounded-lg bg-[#0C1E15] border border-[#1D3B2C] hover:border-[#D4AF37] text-[#F4F0E6] hover:text-[#D4AF37] transition-colors flex items-center justify-center cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -end-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#D4AF37] text-[#06110C] text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 min-h-[40px] px-2.5 py-1.5 rounded-lg bg-[#0C1E15] border border-[#1D3B2C] hover:border-[#D4AF37] transition-colors cursor-pointer text-xs text-[#F4F0E6]"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Patient'}
                      className="w-5 h-5 rounded-full object-cover border border-[#D4AF37]"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#06110C] font-bold flex items-center justify-center text-[10px]">
                      {user.displayName?.[0] || 'U'}
                    </div>
                  )}
                  <span className="hidden md:inline font-medium truncate max-w-[90px]">
                    {user.displayName?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8FA699]" />
                </button>

                {userMenuOpen && (
                  <div className="absolute end-0 mt-2 w-56 rounded-xl bg-[#0B1D14] border border-[#1D3B2C] shadow-2xl p-3 space-y-2 z-50">
                    <div className="pb-2 border-b border-[#1D3B2C]">
                      <p className="text-xs font-bold text-[#F4F0E6] truncate">
                        {user.displayName || 'Patient'}
                      </p>
                      <p className="text-[11px] text-[#8FA699] truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => handleNavClick('patient-portal')}
                      className="w-full text-start px-2.5 py-2 rounded-lg text-xs text-[#D4AF37] hover:bg-[#10261B] transition-colors flex items-center gap-2 cursor-pointer font-semibold"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{t.nav.healthHistory}</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('booking')}
                      className="w-full text-start px-2.5 py-2 rounded-lg text-xs text-[#C2D1C8] hover:bg-[#10261B] transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{t.nav.myConsultations}</span>
                    </button>

                    <button
                      onClick={async () => {
                        setUserMenuOpen(false);
                        await signOut();
                      }}
                      className="w-full text-start px-2.5 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.nav.signOut}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                disabled={authLoading}
                className="hidden sm:inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-lg bg-[#0C1E15] border border-[#1D3B2C] hover:border-[#D4AF37] text-xs font-medium text-[#F4F0E6] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>{t.nav.signIn}</span>
              </button>
            )}

            <button
              onClick={onOpenBooking}
              className="hidden sm:inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-xs tracking-wide transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{t.nav.bookVisit}</span>
            </button>

            {/* Mobile/Tablet Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={t.nav.toggleMenuAria}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] p-2 rounded-lg bg-[#0C1E15] border border-[#1D3B2C] text-[#F4F0E6] hover:text-[#D4AF37] transition-colors flex items-center justify-center cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 pb-4 border-t border-[#1D3B2C] bg-[#091811] rounded-xl px-3 shadow-2xl max-h-[75vh] overflow-y-auto space-y-3">
            {/* Full-Width 1-Click Language Switcher inside Drawer */}
            <div
              role="group"
              aria-label={t.nav.switcherAria}
              dir="ltr"
              className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#06110C] border border-[#1D3B2C]"
            >
              {LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    data-testid={`lang-mobile-btn-${lang.code}`}
                    aria-pressed={isSelected}
                    onClick={() => setLanguage(lang.code)}
                    className={`min-h-[40px] py-2 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#D4AF37] text-[#06110C]'
                        : 'text-[#C2D1C8] hover:text-[#F4F0E6] hover:bg-[#0D2218]'
                    }`}
                  >
                    {lang.shortLabel}
                  </button>
                );
              })}
            </div>

            {/* Full-Width 1-Click Currency Switcher inside Drawer */}
            <div
              role="group"
              aria-label={t.nav.currencyAria}
              dir="ltr"
              className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#06110C] border border-[#1D3B2C]"
            >
              {CURRENCIES.map((cur) => {
                const isSelected = currency === cur.code;
                return (
                  <button
                    key={cur.code}
                    type="button"
                    data-testid={`currency-mobile-btn-${cur.code}`}
                    aria-pressed={isSelected}
                    onClick={() => setCurrency(cur.code)}
                    className={`min-h-[40px] py-2 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#D4AF37] text-[#06110C]'
                        : 'text-[#C2D1C8] hover:text-[#F4F0E6] hover:bg-[#0D2218]'
                    }`}
                  >
                    {cur.shortLabel} ({cur.englishName})
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {allNavLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-start min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    activeSection === link.id
                      ? 'bg-[#132E21] text-[#D4AF37] font-semibold border border-[#D4AF37]/30'
                      : 'text-[#C2D1C8] hover:bg-[#0F241A]'
                  }`}
                >
                  <span>{link.label}</span>
                  {activeSection === link.id && (
                    <span className="text-[10px] text-[#D4AF37]">{t.nav.activeLabel}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#1D3B2C] flex flex-col sm:flex-row gap-2">
              {!user && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signInWithGoogle();
                  }}
                  className="flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-lg bg-[#0C1E15] border border-[#1D3B2C] text-[#F4F0E6] font-semibold text-xs"
                >
                  <LogIn className="w-4 h-4 text-[#D4AF37]" />
                  <span>{t.nav.signIn}</span>
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="flex-1 flex items-center justify-center gap-2 min-h-[44px] py-2.5 px-4 rounded-lg bg-[#D4AF37] text-[#06110C] font-bold text-xs"
              >
                <Calendar className="w-4 h-4" />
                <span>{t.nav.bookAppointment}</span>
              </button>
              <a
                href="tel:+93780299299"
                dir="ltr"
                className="flex items-center justify-center gap-2 min-h-[44px] py-2.5 px-4 rounded-lg bg-[#0C1E15] border border-[#1D3B2C] text-[#F4F0E6] text-xs"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>+93 780 299 299</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
