// src/components/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Globe, ArrowUpRight } from "lucide-react";
import { CLINIC_INFO } from "../data/clinicData";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#111E17] text-[#F4F0E6] border-t border-[#F4F0E6]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#F4F0E6]/12">
          {/* Col 1: Brand & Multilingual Identity (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#D4AF7A]">
              Est. {CLINIC_INFO.established} · Kabul, Afghanistan
            </span>
            <h3 className="font-editorial text-3xl font-semibold text-white">
              {CLINIC_INFO.name}
            </h3>
            <div className="text-sm text-[#D4AF7A] space-y-0.5" dir="rtl">
              <p>{CLINIC_INFO.pashtoName}</p>
              <p>{CLINIC_INFO.dariName}</p>
            </div>
            <p className="text-xs text-[#F4F0E6]/70 leading-relaxed">
              Outpatient Herbal, Unani, and Naturopathic clinical practice and GMP-partnered apothecary in Kabul.
            </p>
          </div>

          {/* Col 2: Opening Hours Table (Smoky Barbershop Style) (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-mono-code text-xs uppercase tracking-widest text-[#D4AF7A]">
              Clinic Hours
            </h4>
            <div className="text-xs space-y-2 font-mono-code text-[#F4F0E6]/85">
              <div className="flex justify-between py-1 border-b border-[#F4F0E6]/10">
                <span>Sat – Wed</span>
                <span>8:30am – 6:00pm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F4F0E6]/10">
                <span>Thursday</span>
                <span>8:30am – 4:00pm</span>
              </div>
              <div className="flex justify-between py-1 text-[#D4AF7A]">
                <span>Friday</span>
                <span>Closed</span>
              </div>
            </div>
            <p className="text-[11px] text-[#F4F0E6]/60 pt-1">
              Appointments go first, then walk-ins.
            </p>
          </div>

          {/* Col 3: Verified Locations & Direct Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="font-mono-code text-xs uppercase tracking-widest text-[#D4AF7A]">
              Kabul Locations
            </h4>
            <div className="space-y-2 text-[#F4F0E6]/80">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF7A] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Clinic:</strong> {CLINIC_INFO.contact.clinicAddress}
                </span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF7A] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Office:</strong> {CLINIC_INFO.contact.registeredOffice}
                </span>
              </p>
              <p className="flex items-center gap-2 pt-1">
                <Phone className="w-4 h-4 text-[#D4AF7A] shrink-0" />
                <a href="tel:+93780299299" className="hover:underline">
                  {CLINIC_INFO.contact.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF7A] shrink-0" />
                <a href={`mailto:${CLINIC_INFO.contact.primaryEmail}`} className="hover:underline">
                  {CLINIC_INFO.contact.primaryEmail}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#D4AF7A] shrink-0" />
                <span>www.safinaturalcare.af</span>
              </p>
            </div>
          </div>

          {/* Col 4: Quick Navigation & Socials (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h4 className="font-mono-code text-xs uppercase tracking-widest text-[#D4AF7A]">
              Explore
            </h4>
            <ul className="space-y-2 text-[#F4F0E6]/80">
              <li><Link to="/treatments" className="hover:text-white">Treatments</Link></li>
              <li><Link to="/shop" className="hover:text-white">Apothecary Shop</Link></li>
              <li><Link to="/booking" className="hover:text-white">Book Consultation</Link></li>
              <li><Link to="/about" className="hover:text-white">Founder & Profile</Link></li>
              <li>
                <a
                  href={CLINIC_INFO.contact.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[#D4AF7A] hover:underline pt-1"
                >
                  <span>WhatsApp Us</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Essential Legal & Non-Emergency Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] text-[#F4F0E6]/60">
          <p className="max-w-3xl leading-relaxed">
            {CLINIC_INFO.disclaimers.legalStatement} {CLINIC_INFO.disclaimers.emergencyNotice}
          </p>
          <p className="font-mono-code shrink-0">
            © {new Date().getFullYear()} {CLINIC_INFO.companyName}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
