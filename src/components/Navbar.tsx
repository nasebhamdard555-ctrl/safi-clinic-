import React, { useState, useEffect } from 'react';
import {
  Calendar,
  ShoppingBag,
  Menu,
  X,
  Phone,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  User as UserIcon,
  LogIn,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  const { user, signInWithGoogle, signOut, loading: authLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const primaryNavLinks = [
    { id: 'home', label: 'Home', color: '#d4af37' },
    { id: 'treatments', label: 'Treatments', color: '#2dd4bf' },
    { id: 'booking', label: 'Book Visit', color: '#f59e0b' },
    { id: 'shop', label: 'Dispensary', color: '#facc15' },
    { id: 'patient-portal', label: 'Patient Portal', color: '#38bdf8' },
    { id: 'symptom-checker', label: 'Symptom Triage', color: '#06b6d4' },
  ];

  const secondaryNavLinks = [
    { id: 'admin', label: 'Admin & Accounting', color: '#d4af37', desc: 'Revenue P&L, Inventory & Settings' },
    { id: 'pos-triage', label: 'POS & QR Triage', color: '#22c55e', desc: 'Barcode POS & Patient QR Check-In' },
    { id: 'soundscapes', label: 'Acoustic Soundscapes', color: '#c084fc', desc: 'Herbal frequency wellness audio' },
    { id: 'testimonials', label: 'Clinical Outcomes', color: '#fbbf24', desc: 'Patient verified recoveries' },
    { id: '3d-apothecary', label: '3D Apothecary Lab', color: '#d97706', desc: 'Procedural extraction chamber' },
    { id: 'blog', label: 'Remedy Blog & Guide', color: '#84cc16', desc: 'Ailment & herb formulations' },
    { id: 'about', label: 'About Us & Doctors', color: '#10b981', desc: 'Clinic profile & ethical code' },
    { id: 'contact', label: 'Contact & Location', color: '#f59e0b', desc: 'Kabul desk & WhatsApp triage' },
  ];

  const allNavLinks = [...primaryNavLinks, ...secondaryNavLinks];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      {/* Top Announcement & Quick Contact Bar */}
      <div className="bg-[#040b07] border-b border-[#1b3b2f]/60 text-xs text-[#a6b6ad] px-4 py-2 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-[#d4af37]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="font-medium text-[#f5f3ec]">Safi Natural Care Clinic</span>
              <span className="text-[#688274]">· Herbal Medicine | Unani Medicine | Naturopathy</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#a6b6ad]">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Kabul, Afghanistan</span>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="tel:+93780299299"
              className="flex items-center gap-1.5 text-[#f5f3ec] hover:text-[#d4af37] transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Tel / WhatsApp: +93 780 299 299</span>
            </a>
            <span className="text-[#1b3b2f]">|</span>
            <a
              href="mailto:info@safihealthcare.com"
              className="text-[#a6b6ad] hover:text-[#d4af37] transition-colors"
            >
              info@safihealthcare.com
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`transition-all duration-300 px-4 lg:px-8 ${
          isScrolled
            ? 'bg-[#08150f]/95 backdrop-blur-md py-3.5 shadow-xl shadow-black/40 border-b border-[#c5a059]/25'
            : 'bg-[#06120d]/85 backdrop-blur-sm py-4 border-b border-[#1b3b2f]/50'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] shrink-0"
            aria-label="Safi Natural Care Clinic Home"
          >
            <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-[#122e22] via-[#091a13] to-[#040a07] border border-[#d4af37]/60 flex items-center justify-center shadow-lg group-hover:border-[#d4af37] transition-colors shrink-0">
              <span className="font-serif-classic font-bold text-lg text-[#d4af37] tracking-wider">
                S
              </span>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#d4af37] flex items-center justify-center shadow-sm">
                <Sparkles className="w-2 h-2 text-black" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="font-serif-classic text-sm xl:text-lg font-bold tracking-tight text-[#f5f3ec] group-hover:text-[#d4af37] transition-colors">
                  SAFI NATURAL CARE
                </span>
                <span className="font-serif-editorial text-[11px] tracking-widest text-[#d4af37] uppercase font-semibold">
                  CLINIC
                </span>
              </div>
              <p className="text-[9px] xl:text-[10px] tracking-wider text-[#8da396] uppercase font-medium whitespace-nowrap">
                Herbal · Unani · Naturopathic Practice
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3.5">
            {primaryNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-xs tracking-wide font-medium transition-colors relative py-1 px-1 flex items-center gap-1.5 whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] ${
                  activeSection === link.id
                    ? 'text-white font-bold'
                    : 'text-[#cbd5e1] hover:text-white'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: link.color,
                    boxShadow: activeSection === link.id ? `0 0 6px ${link.color}` : 'none',
                  }}
                />
                <span>{link.label}</span>
                {activeSection === link.id && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: link.color }}
                  />
                )}
              </button>
            ))}

            {/* More Sections Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`text-xs xl:text-sm tracking-wide font-medium transition-colors relative py-1 px-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer focus:outline-none ${
                  secondaryNavLinks.some((l) => l.id === activeSection)
                    ? 'text-[#d4af37] font-bold bg-[#14291f]'
                    : 'text-[#a6b6ad] hover:text-white hover:bg-[#0e2118]'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#091b13]/95 backdrop-blur-xl border border-[#d4af37]/40 shadow-2xl p-2 space-y-1 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#d4af37] font-bold border-b border-[#1b3b2f]/60">
                    Clinic Portals & Archives
                  </div>
                  {secondaryNavLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link.id)}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer ${
                        activeSection === link.id
                          ? 'bg-[#153426] text-white font-semibold'
                          : 'hover:bg-[#0e241a] text-[#c9dad0]'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full mt-1 shrink-0"
                        style={{ backgroundColor: link.color }}
                      />
                      <div>
                        <div className="text-xs font-semibold text-[#f5f3ec]">{link.label}</div>
                        <div className="text-[10px] text-[#8da396]">{link.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs: Cart & Book Consultation */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              aria-label={`Open shopping cart, ${cartCount} items`}
              className="relative p-2.5 rounded-lg bg-[#0e2118] border border-[#234b3c] hover:border-[#d4af37]/60 text-[#f5f3ec] hover:text-[#d4af37] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-[#d4af37] text-black text-xs font-bold flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Google Authentication Trigger */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0e2118] border border-[#234b3c] hover:border-[#d4af37] transition-colors cursor-pointer text-xs"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Patient'}
                      className="w-5 h-5 rounded-full object-cover border border-[#d4af37]"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#d4af37] text-black font-bold flex items-center justify-center text-[10px]">
                      {user.displayName?.[0] || 'U'}
                    </div>
                  )}
                  <span className="hidden md:inline font-medium text-[#f5f3ec] truncate max-w-[100px]">
                    {user.displayName?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8da396]" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#081810] border border-[#d4af37]/40 shadow-2xl p-3 space-y-2 z-50">
                    <div className="pb-2 border-b border-[#1b3b2f]">
                      <p className="text-xs font-bold text-[#f5f3ec] truncate">
                        {user.displayName || 'Patient'}
                      </p>
                      <p className="text-[11px] text-[#8da396] truncate">{user.email}</p>
                      <span className="mt-1 inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">
                        Cloud SQL Connected
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigate('patient-portal');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-sky-300 hover:bg-[#0e2118] hover:text-white transition-colors flex items-center gap-2 cursor-pointer font-semibold"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                      <span>Health History & Protocols</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigate('booking');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-[#d8e2dc] hover:bg-[#0e2118] hover:text-[#d4af37] transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>My Consultations</span>
                    </button>

                    <button
                      onClick={async () => {
                        setUserMenuOpen(false);
                        await signOut();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                disabled={authLoading}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0e2118] border border-[#234b3c] hover:border-[#d4af37] text-xs font-semibold text-[#f5f3ec] hover:text-[#d4af37] transition-colors cursor-pointer whitespace-nowrap"
                title="Sign in with Google to save appointments and medical orders"
              >
                <LogIn className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <span>Sign In</span>
              </button>
            )}

            {/* Book Appointment CTA */}
            <button
              onClick={onOpenBooking}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#a8812c] text-black font-semibold text-xs tracking-wide shadow-lg shadow-black/50 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Calendar className="w-3.5 h-3.5 text-black shrink-0" />
              <span>Book Visit</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2.5 rounded-lg bg-[#0e2118] border border-[#234b3c] text-[#f5f3ec] hover:text-[#d4af37] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 pb-4 border-t border-[#1b3b2f] bg-[#07150e]/95 backdrop-blur-lg rounded-xl px-3 shadow-2xl animate-in fade-in slide-in-from-top-2 max-h-[75vh] overflow-y-auto">
            <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-[#d4af37] font-bold mb-1">
              All Clinic Portals & Pages
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {allNavLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                    activeSection === link.id
                      ? 'bg-[#153124] text-white font-bold border-l-2 border-[#d4af37]'
                      : 'text-[#d8e2dc] hover:bg-[#0e2118]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: link.color }}
                    />
                    <span>{link.label}</span>
                  </div>
                  {activeSection === link.id && (
                    <span className="text-[10px] text-[#d4af37] font-semibold">Current</span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#1b3b2f] flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-semibold text-sm shadow-md"
              >
                <Calendar className="w-4 h-4 text-black" />
                <span>Book Appointment Online</span>
              </button>
              <a
                href="tel:+93780299299"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#0d2117] border border-[#234b3c] text-[#f5f3ec] text-xs font-medium"
              >
                <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Call Clinic: +93 780 299 299</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
