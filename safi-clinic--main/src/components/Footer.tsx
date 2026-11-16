import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Instagram,
  Facebook,
  Twitter,
  MessageCircle,
  Globe,
} from 'lucide-react';
import { useClinicConfig } from '../context/ClinicConfigContext';
import { CLINIC_PROFILE } from '../data/clinicData';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useClinicConfig();
  const { language, t } = useLanguage();
  const cleanWhatsapp = (settings.whatsappNumber || '+93780299299').replace(/[^0-9]/g, '');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 1500);
  };

  return (
    <footer className="bg-[#040B08] text-[#C2D1C8] border-t border-[#173024] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-10">
          {/* Col 1: Brand & Official Epigraph (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0B1D14] border border-[#D4AF37]/70 flex items-center justify-center shrink-0">
                <span className="font-serif-classic font-bold text-lg text-[#D4AF37]">
                  S
                </span>
              </div>
              <div>
                <span className="font-serif-classic font-bold text-sm tracking-wider text-[#F4F0E6] block">
                  {t.brand.clinicName.toUpperCase()}
                </span>
                <span className="text-[11px] text-[#D4AF37] font-semibold tracking-wider block">
                  {t.brand.foundedText} · {t.brand.cityCountry}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B1D14] border border-[#1D3B2C] space-y-1">
              <p className="font-serif-classic text-sm text-[#D4AF37] font-bold" dir="rtl">
                {CLINIC_PROFILE.faithAndHealing.arabic}
              </p>
              <p className="text-[11px] text-[#C2D1C8]">
                {t.brand.epigraphTranslation}
              </p>
            </div>

            <p className="text-xs text-[#A6B8AE] leading-relaxed">
              {t.brand.companyName} — {t.brand.companySubtitle} · {t.brand.founderName}
            </p>

            {/* Social Media */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={settings.instagramUrl || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-lg bg-[#0B1D14] border border-[#1D3B2C] hover:border-[#D4AF37] text-[#C2D1C8] hover:text-[#D4AF37] flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.facebookUrl || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-lg bg-[#0B1D14] border border-[#1D3B2C] hover:border-[#D4AF37] text-[#C2D1C8] hover:text-[#D4AF37] flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${cleanWhatsapp}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-lg bg-[#0B1D14] border border-[#1D3B2C] hover:border-emerald-400 text-[#C2D1C8] hover:text-emerald-400 flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={settings.twitterUrl || 'https://x.com'}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter X"
                className="w-10 h-10 rounded-lg bg-[#0B1D14] border border-[#1D3B2C] hover:border-[#D4AF37] text-[#C2D1C8] hover:text-[#D4AF37] flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif-classic font-bold text-xs text-[#F4F0E6] tracking-wider uppercase">
              {t.footer.pagesHeading}
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { id: 'home', label: t.nav.home },
                { id: 'treatments', label: t.nav.treatments },
                { id: 'shop', label: t.nav.shop },
                { id: 'about', label: t.nav.about },
                { id: 'booking', label: t.nav.booking },
                { id: 'contact', label: t.nav.contact },
                { id: 'patient-portal', label: t.nav.patientPortal },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="text-[#A6B8AE] hover:text-[#D4AF37] transition-colors cursor-pointer text-start"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('pos-triage')}
                  className="text-emerald-400 hover:text-[#F4F0E6] font-medium transition-colors cursor-pointer text-start"
                >
                  {t.nav.posTriage}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-[#D4AF37] hover:text-[#F4F0E6] font-medium transition-colors cursor-pointer text-start"
                >
                  {t.nav.admin}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact & Kabul Locations (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif-classic font-bold text-xs text-[#F4F0E6] tracking-wider uppercase">
              {t.footer.addressesHeading}
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <p className="text-[#F4F0E6] font-medium leading-snug">
                  {t.brand.hoursPolicy}
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[#F4F0E6] font-medium">
                    {t.footer.clinicLabel} {t.brand.clinicAddress}
                  </p>
                  <p className="text-[#A6B8AE] text-[11px]">
                    {t.footer.regOfficeLabel} {t.brand.registeredOffice}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <a
                    href={`tel:${CLINIC_PROFILE.phone}`}
                    dir="ltr"
                    className="inline-block text-[#F4F0E6] font-semibold hover:text-[#D4AF37]"
                  >
                    {CLINIC_PROFILE.formattedPhone}
                  </a>
                  <span className="block text-[11px] text-[#8FA699]">
                    {t.footer.phoneWhatsappLabel}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="space-y-0.5" dir="ltr">
                  <a
                    href={`mailto:${CLINIC_PROFILE.secondaryEmail}`}
                    className="block text-[#F4F0E6] hover:text-[#D4AF37]"
                  >
                    {CLINIC_PROFILE.secondaryEmail}
                  </a>
                  <a
                    href={`mailto:${CLINIC_PROFILE.email}`}
                    className="block text-[#A6B8AE] hover:text-[#D4AF37]"
                  >
                    {CLINIC_PROFILE.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="text-[11px] space-y-0.5" dir="ltr">
                  <a
                    href={`https://${CLINIC_PROFILE.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-[#D4AF37] hover:underline"
                  >
                    {CLINIC_PROFILE.website}
                  </a>
                  <a
                    href={`https://${CLINIC_PROFILE.secondaryWebsite}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-[#A6B8AE] hover:underline"
                  >
                    {CLINIC_PROFILE.secondaryWebsite}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Clinic Updates (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif-classic font-bold text-xs text-[#F4F0E6] tracking-wider uppercase">
              {t.footer.updatesHeading}
            </h4>
            <p className="text-xs text-[#A6B8AE] leading-relaxed">
              {t.footer.updatesSub}
            </p>

            {subscribed ? (
              <div className="p-3 rounded-lg bg-[#0F261B] border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t.footer.subscribedMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={t.footer.emailPlaceholder}
                  aria-label={t.footer.emailPlaceholder}
                  dir={language === 'en' ? 'ltr' : 'rtl'}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B1D14] border border-[#1D3B2C] text-xs text-[#F4F0E6] focus:outline-none focus:border-[#D4AF37] placeholder-[#6E8478]"
                />
                <button
                  type="submit"
                  className="w-full min-h-[40px] py-2 rounded-lg bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.footer.subscribeBtn}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Legal & Clinical Scope Statement */}
        <div className="pt-6 border-t border-[#173024] text-[11px] text-[#8FA699] leading-relaxed space-y-3">
          <p>
            <strong className="text-[#C2D1C8]">{t.footer.scopeSafetyLabel} </strong>
            {t.brand.legalStatement}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[#11241B] text-xs text-[#A6B8AE]">
            <p>
              © {t.brand.clinicName} ({t.brand.companyName}) · {t.brand.cityCountry}
            </p>
            <span>{t.brand.hoursPolicy}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
