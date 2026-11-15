import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Globe,
  Send,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { CLINIC_PROFILE } from '../data/clinicData';
import { useClinicConfig } from '../context/ClinicConfigContext';
import { useLanguage } from '../context/LanguageContext';

interface ContactPageProps {
  onOpenBooking: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenBooking }) => {
  const { settings } = useClinicConfig();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: 'general', message: '' });
    }, 600);
  };

  const contactHotlines = [
    {
      title: t.contact.phoneDeskTitle,
      detail: CLINIC_PROFILE.formattedPhone,
      sub: t.brand.hoursPolicy,
      subIsLtr: false,
      href: `tel:${CLINIC_PROFILE.phone}`,
      icon: Phone,
      btnText: t.contact.callClinicBtn,
    },
    {
      title: t.contact.whatsappTitle,
      detail: CLINIC_PROFILE.formattedPhone,
      sub: t.contact.whatsappSub,
      subIsLtr: false,
      href: `https://wa.me/${(settings.whatsappNumber || CLINIC_PROFILE.phone).replace(/[^0-9]/g, '')}`,
      icon: MessageCircle,
      btnText: t.contact.whatsappBtn,
    },
    {
      title: t.contact.emailsTitle,
      detail: CLINIC_PROFILE.email,
      sub: CLINIC_PROFILE.secondaryEmail,
      subIsLtr: true,
      href: `mailto:${CLINIC_PROFILE.email}`,
      icon: Mail,
      btnText: t.contact.sendEmailBtn,
    },
    {
      title: t.contact.websitesTitle,
      detail: CLINIC_PROFILE.website,
      sub: CLINIC_PROFILE.secondaryWebsite,
      subIsLtr: true,
      href: `https://${CLINIC_PROFILE.website}`,
      icon: Globe,
      btnText: t.contact.openPortalBtn,
    },
  ];

  const socialChannels = [
    { name: 'WhatsApp', url: `https://wa.me/${(settings.whatsappNumber || '93780299299').replace(/[^0-9]/g, '')}`, handle: CLINIC_PROFILE.formattedPhone },
    { name: 'Facebook', url: settings.facebookUrl || 'https://facebook.com', handle: 'Safi Natural Care' },
    { name: 'Instagram', url: settings.instagramUrl || 'https://instagram.com', handle: '@safinaturalcare' },
    { name: 'X (Twitter)', url: settings.twitterUrl || 'https://twitter.com', handle: '@safinaturalcare' },
  ];

  return (
    <div className="pt-24 lg:pt-32 pb-20 min-h-screen bg-[#07130D] text-[#F4F0E6] selection:bg-[#D4AF37] selection:text-[#06110C]">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
            {t.brand.clinicName} · {t.brand.cityCountry}
          </p>

          <h1 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F0E6]">
            {t.contact.title}
          </h1>

          <p className="text-sm sm:text-base text-[#C2D1C8] leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>
      </section>

      {/* 4 Direct Contact Cards */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {contactHotlines.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] hover:border-[#D4AF37]/50 transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-[#06110C] border border-[#1D3B2C] flex items-center justify-center text-[#D4AF37]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-serif-classic font-bold text-base text-[#F4F0E6]">
                      {c.title}
                    </h2>
                    <p dir="ltr" className="text-sm font-bold text-[#D4AF37] mt-1 break-all">
                      {c.detail}
                    </p>
                    <p
                      dir={c.subIsLtr ? 'ltr' : undefined}
                      className="text-xs text-[#A6B8AE] mt-0.5 break-all"
                    >
                      {c.sub}
                    </p>
                  </div>
                </div>

                <a
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : '_self'}
                  rel="noreferrer"
                  className="w-full min-h-[42px] py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#E2C36B] text-xs font-bold text-[#06110C] transition-colors flex items-center justify-center"
                >
                  {c.btnText}
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* Form & Dual Kabul Addresses */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 p-6 sm:p-10 rounded-3xl bg-[#0B1D14] border border-[#1D3B2C] space-y-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                {t.contact.inquiryKicker}
              </span>
              <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#F4F0E6] mt-1">
                {t.contact.inquiryTitle}
              </h2>
              <p className="text-xs sm:text-sm text-[#A6B8AE] mt-1.5">
                {t.contact.inquirySub}
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-6 rounded-2xl bg-[#06110C] border border-[#D4AF37]/60 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="font-serif-classic text-xl font-bold text-[#F4F0E6]">
                  {t.contact.receivedTitle}
                </h3>
                <p className="text-xs text-[#C2D1C8] max-w-md mx-auto">
                  {t.contact.receivedBody}
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="min-h-[40px] px-4 py-2 rounded-lg bg-[#D4AF37] text-xs text-[#06110C] font-bold cursor-pointer"
                >
                  {t.contact.sendAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#F4F0E6]">{t.contact.fullName}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nadia Rahmati"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full min-h-[44px] px-4 py-3 rounded-xl bg-[#06110C] border border-[#1D3B2C] focus:border-[#D4AF37] text-xs sm:text-sm text-[#F4F0E6] placeholder:text-[#6E8478] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#F4F0E6]">{t.contact.emailAddress}</label>
                    <input
                      type="email"
                      dir="ltr"
                      required
                      placeholder="nadia.rahmati@example.af"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full min-h-[44px] px-4 py-3 rounded-xl bg-[#06110C] border border-[#1D3B2C] focus:border-[#D4AF37] text-xs sm:text-sm text-[#F4F0E6] placeholder:text-[#6E8478] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#F4F0E6]">{t.contact.phoneNumber}</label>
                    <input
                      type="tel"
                      dir="ltr"
                      placeholder="+93 7XX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full min-h-[44px] px-4 py-3 rounded-xl bg-[#06110C] border border-[#1D3B2C] focus:border-[#D4AF37] text-xs sm:text-sm text-[#F4F0E6] placeholder:text-[#6E8478] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#F4F0E6]">{t.contact.inquiryType}</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full min-h-[44px] px-4 py-3 rounded-xl bg-[#06110C] border border-[#1D3B2C] focus:border-[#D4AF37] text-xs sm:text-sm text-[#F4F0E6] focus:outline-none"
                    >
                      <option value="general">{t.contact.optGeneral}</option>
                      <option value="appointment">{t.contact.optAppointment}</option>
                      <option value="dispensary">{t.contact.optDispensary}</option>
                      <option value="telehealth">{t.contact.optTelehealth}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F4F0E6]">{t.contact.messageLabel}</label>
                  <textarea
                    rows={4}
                    required
                    placeholder={t.contact.messagePlaceholder}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#06110C] border border-[#1D3B2C] focus:border-[#D4AF37] text-xs sm:text-sm text-[#F4F0E6] placeholder:text-[#6E8478] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[46px] py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? t.contact.sendingBtn : t.contact.submitBtn}</span>
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 space-y-5">
            {/* Dual Kabul Locations */}
            <div className="p-6 rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>{t.contact.kabulLocations}</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#06110C] border border-[#1D3B2C]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                    {t.contact.clinicAddrTitle}
                  </span>
                  <strong className="text-sm text-[#F4F0E6] block mt-0.5 font-serif-classic">
                    {t.brand.clinicName}
                  </strong>
                  <p className="text-[#A6B8AE] mt-0.5">{t.brand.clinicAddress}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#06110C] border border-[#1D3B2C]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                    {t.contact.regOfficeTitle}
                  </span>
                  <strong className="text-sm text-[#F4F0E6] block mt-0.5 font-serif-classic">
                    {t.brand.companyName}
                  </strong>
                  <p className="text-[#A6B8AE] mt-0.5">{t.brand.registeredOffice}</p>
                </div>
              </div>

              <button
                onClick={onOpenBooking}
                className="w-full min-h-[42px] py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#E2C36B] text-[#06110C] font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t.contact.bookOutpatientBtn}</span>
              </button>
            </div>

            {/* Hours Policy */}
            <div className="p-6 rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>{t.contact.hoursRuleTitle}</span>
              </div>
              <p className="text-sm font-semibold text-[#F4F0E6]">
                {t.brand.hoursPolicy}
              </p>
              <p className="text-xs text-[#A6B8AE] leading-relaxed">
                {t.contact.hoursRuleDesc}
              </p>
            </div>

            {/* Sacred Epigraph */}
            <div className="p-6 rounded-2xl bg-[#06110C] border border-[#D4AF37]/40 text-[#F4F0E6] space-y-2 text-center">
              <p className="font-serif-classic text-2xl font-bold text-[#F4F0E6]" dir="rtl">
                {CLINIC_PROFILE.faithAndHealing.arabic}
              </p>
              <p className="text-xs text-[#D4AF37]" dir="rtl">
                {CLINIC_PROFILE.faithAndHealing.pashto}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Social Links */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-7 rounded-2xl bg-[#0B1D14] border border-[#1D3B2C] space-y-5">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              {t.contact.channelsKicker}
            </span>
            <h2 className="font-serif-classic text-xl sm:text-2xl font-bold text-[#F4F0E6] mt-1">
              {t.contact.followPrefix} {t.brand.companyName}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {socialChannels.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="min-h-[60px] p-4 rounded-xl bg-[#06110C] border border-[#1D3B2C] hover:border-[#D4AF37] transition-colors text-center space-y-1 flex flex-col justify-center"
              >
                <span className="text-xs font-bold text-[#F4F0E6] block">{s.name}</span>
                <span dir="ltr" className="text-[11px] text-[#A6B8AE] block truncate">{s.handle}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
