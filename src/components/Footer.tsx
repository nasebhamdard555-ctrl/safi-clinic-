import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  Send,
  CheckCircle,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  MessageCircle,
} from 'lucide-react';
import { useClinicConfig } from '../context/ClinicConfigContext';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking }) => {
  const { settings } = useClinicConfig();
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
    <footer className="bg-[#030906] text-[#c9dad0] border-t border-[#1b3b2f] relative overflow-hidden">
      {/* Decorative Gold Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-[#0d281c] via-[#d4af37] to-[#0d281c]" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Col 1: Brand & Legacy (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#153426] to-[#05110a] border border-[#d4af37] flex items-center justify-center shrink-0">
                <span className="font-serif-classic font-bold text-lg text-[#d4af37]">
                  S
                </span>
              </div>
              <div>
                <span className="font-serif-classic font-bold text-base tracking-wider text-[#f5f3ec] block">
                  SAFI NATURAL CARE CLINIC
                </span>
                <span className="text-[10px] text-[#d4af37] font-semibold tracking-widest uppercase block">
                  Herbal · Unani · Naturopathy | Kabul, Afghanistan
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#081810] border border-[#d4af37]/30 text-center sm:text-left space-y-1">
              <p className="font-serif-classic text-sm text-[#d4af37] font-bold" dir="rtl">
                وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ
              </p>
              <p className="text-[11px] text-[#8da396] italic" dir="rtl">
                او کله چې زه ناروغ شم، نو همغه (الله) ما ته شفا راکوي
              </p>
              <p className="text-[10px] text-[#6b8275]">
                "And when I am ill, it is He who cures me" (Ash-Shu'ara 26:80)
              </p>
            </div>

            <p className="text-xs text-[#a6b6ad] leading-relaxed">
              Community-based healthcare facility in Kabul, Afghanistan providing traditional and natural medical care through Herbal Medicine, Unani Medicine, and Naturopathy.
            </p>

            <div className="pt-2">
              <span className="text-[11px] text-[#d4af37] font-bold uppercase tracking-wider block mb-2.5">
                Official Social Media Channels
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={settings.instagramUrl || 'https://instagram.com'}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-lg bg-[#081810] border border-[#1b3b2f] hover:border-[#d4af37] text-[#a6b6ad] hover:text-[#d4af37] flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={settings.facebookUrl || 'https://facebook.com'}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-lg bg-[#081810] border border-[#1b3b2f] hover:border-[#d4af37] text-[#a6b6ad] hover:text-[#d4af37] flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-lg bg-[#081810] border border-[#1b3b2f] hover:border-[#d4af37] text-[#a6b6ad] hover:text-[#d4af37] flex items-center justify-center transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="w-9 h-9 rounded-lg bg-[#081810] border border-[#1b3b2f] hover:border-emerald-400 text-[#a6b6ad] hover:text-emerald-400 flex items-center justify-center transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-lg bg-[#081810] border border-[#1b3b2f] hover:border-[#d4af37] text-[#a6b6ad] hover:text-[#d4af37] flex items-center justify-center transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={settings.twitterUrl || 'https://x.com'}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter X"
                  className="w-9 h-9 rounded-lg bg-[#081810] border border-[#1b3b2f] hover:border-[#d4af37] text-[#a6b6ad] hover:text-[#d4af37] flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif-classic font-bold text-sm text-[#f5f3ec] tracking-wider uppercase">
              Clinic Pages
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-[#a6b6ad] hover:text-[#d4af37] transition-colors cursor-pointer text-left"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('treatments')}
                  className="text-[#a6b6ad] hover:text-[#2dd4bf] transition-colors cursor-pointer text-left"
                >
                  Clinical Treatments
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('booking')}
                  className="text-[#a6b6ad] hover:text-[#f59e0b] transition-colors cursor-pointer text-left"
                >
                  Book Consultation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="text-[#a6b6ad] hover:text-[#facc15] transition-colors cursor-pointer text-left"
                >
                  Herbal Dispensary
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('patient-portal')}
                  className="text-sky-300 hover:text-white font-medium transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>Patient Health History</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('symptom-checker')}
                  className="text-[#a6b6ad] hover:text-[#06b6d4] transition-colors cursor-pointer text-left"
                >
                  Symptom Triage
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('soundscapes')}
                  className="text-[#a6b6ad] hover:text-[#c084fc] transition-colors cursor-pointer text-left"
                >
                  Acoustic Medicine
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('testimonials')}
                  className="text-[#a6b6ad] hover:text-[#fbbf24] transition-colors cursor-pointer text-left"
                >
                  Clinical Outcomes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('3d-apothecary')}
                  className="text-[#a6b6ad] hover:text-[#d97706] transition-colors cursor-pointer text-left"
                >
                  3D Apothecary Lab
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="text-[#a6b6ad] hover:text-[#84cc16] transition-colors cursor-pointer text-left"
                >
                  Remedy Recipes & Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-[#a6b6ad] hover:text-[#d4af37] transition-colors cursor-pointer text-left"
                >
                  About Safi Clinic
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-[#a6b6ad] hover:text-[#f59e0b] transition-colors cursor-pointer text-left"
                >
                  Contact & Location
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-[#d4af37] hover:text-white font-semibold transition-colors cursor-pointer text-left"
                >
                  Admin & Accounting
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pos-triage')}
                  className="text-emerald-400 hover:text-white font-semibold transition-colors cursor-pointer text-left"
                >
                  POS & QR Triage
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact Numbers & Timings (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif-classic font-bold text-sm text-[#f5f3ec] tracking-wider uppercase">
              Clinic Contact & Hours
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#8da396] block text-[11px]">Clinic Phone:</span>
                  <a
                    href="tel:+93780299299"
                    className="text-[#f5f3ec] font-bold hover:text-[#d4af37]"
                  >
                    +93 780 299 299
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#8da396] block text-[11px]">WhatsApp:</span>
                  <a
                    href={`https://wa.me/${cleanWhatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#f5f3ec] font-bold hover:text-emerald-400"
                  >
                    {settings.whatsappNumber || '+93 780 299 299'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#8da396] block text-[11px]">Email:</span>
                  <a
                    href="mailto:info@safihealthcare.com"
                    className="text-[#f5f3ec] hover:text-[#d4af37]"
                  >
                    info@safihealthcare.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#8da396] block text-[11px]">Location:</span>
                  <p className="text-[#f5f3ec] font-medium">Kabul, Afghanistan</p>
                  <a
                    href="https://www.safihealthcare.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#d4af37] hover:underline"
                  >
                    www.safihealthcare.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Herbal Newsletter (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif-classic font-bold text-sm text-[#f5f3ec] tracking-wider uppercase">
              Herbal Wisdom Dispatch
            </h4>
            <p className="text-xs text-[#a6b6ad] leading-relaxed">
              Receive bi-weekly herbal formulation recipes, seasonal wellness advice, and dispensary vouchers directly from Dr. Safi.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-lg bg-[#0e2a1d] border border-emerald-500/50 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thank you! You are subscribed to our botanical letters.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#081810] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37] placeholder-[#4f675a]"
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe to Letters</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Medical & Legal Disclaimer */}
        <div className="pt-8 border-t border-[#1b3b2f]/70 text-[11px] text-[#6b8275] leading-relaxed space-y-3">
          <p>
            <strong className="text-[#a6b6ad]">Legal & Professional Statement: </strong>
            Safi Natural Care Clinic operates in accordance with the Afghanistan's Ministry of Public Health regulations and within the recognized scope of traditional and natural medicine practice. The clinic does not replace conventional medical care but functions as a complementary health service.
          </p>
          <p>
            <strong className="text-[#a6b6ad]">Clinical Safety & Ethics: </strong>
            The clinic emphasizes patient safety, careful case assessment, avoidance of harmful or restricted substances, informed consent, and respect for patient autonomy. No exaggerated claims or guaranteed cures are made.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#112319] text-xs text-[#8da396]">
            <p>© Safi Natural Care Clinic · Kabul, Afghanistan. All Rights Reserved.</p>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="hover:text-[#d4af37] cursor-pointer">Informed Consent</span>
              <span>·</span>
              <span className="hover:text-[#d4af37] cursor-pointer">MoPH Guidelines</span>
              <span>·</span>
              <span className="hover:text-[#d4af37] cursor-pointer">WHO TCIM Alignment</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
