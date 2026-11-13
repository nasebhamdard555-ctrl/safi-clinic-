// src/components/Navbar.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Phone, Menu, X, QrCode, Shield } from "lucide-react";

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount = 0, onOpenCart }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Treatments", path: "/treatments" },
    { label: "Apothecary Shop", path: "/shop" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#F5F2EB]/90 backdrop-blur-md border-b border-[#141815]/12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Wordmark */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#141815] text-[#F5F2EB] flex items-center justify-center font-editorial text-xl font-bold tracking-wider group-hover:bg-[#1F4B33] transition-colors">
            S
          </div>
          <div>
            <span className="font-editorial text-2xl font-bold tracking-tight text-[#141815] block leading-none">
              Safi Natural Care
            </span>
            <span className="font-mono-code text-[10px] uppercase tracking-widest text-[#545E56] block mt-1">
              Herbal · Unani · Naturopathy
            </span>
          </div>
        </Link>

        {/* Center Editorial Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-all duration-200 relative py-1 ${
                isActive(item.path)
                  ? "text-[#141815] font-semibold after:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:bg-[#141815]"
                  : "text-[#545E56] hover:text-[#141815]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions: Staff POS, Cart, Call & Book */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/pos-triage"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-mono-code text-[#545E56] hover:text-[#141815] hover:bg-[#141815]/5 transition"
            title="Front Desk QR Scanner"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>POS</span>
          </Link>

          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-mono-code text-[#545E56] hover:text-[#141815] hover:bg-[#141815]/5 transition"
            title="Accounting & Inventory"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>

          {onOpenCart && (
            <button
              onClick={onOpenCart}
              className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#141815]/15 hover:border-[#141815] text-xs font-mono-code text-[#141815] transition"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Bag ({cartCount})</span>
            </button>
          )}

          <a
            href="tel:+93780299299"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#141815]/15 hover:border-[#141815] text-xs font-mono-code text-[#141815] transition"
          >
            <Phone className="w-3.5 h-3.5 text-[#1F4B33]" />
            <span>+93 780 299 299</span>
          </a>

          <Link
            to="/booking"
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#141815] hover:bg-[#1F4B33] text-[#F5F2EB] text-xs font-mono-code uppercase tracking-wider font-semibold transition"
          >
            Book Visit
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          {onOpenCart && (
            <button
              onClick={onOpenCart}
              className="px-3 py-1.5 rounded-full border border-[#141815]/20 text-xs font-mono-code"
            >
              Bag ({cartCount})
            </button>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-[#141815]"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#F5F2EB] border-b border-[#141815]/15 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-base font-medium text-[#141815] border-b border-[#141815]/10"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 flex flex-wrap gap-2">
            <Link
              to="/booking"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center py-3 rounded-full bg-[#141815] text-[#F5F2EB] text-xs font-mono-code uppercase tracking-wider"
            >
              Book Visit
            </Link>
            <Link
              to="/pos-triage"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-full border border-[#141815]/20 text-xs font-mono-code"
            >
              POS Scanner
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-full border border-[#141815]/20 text-xs font-mono-code"
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
