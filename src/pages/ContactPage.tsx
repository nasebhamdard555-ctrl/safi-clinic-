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

interface ContactPageProps {
  onOpenBooking: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenBooking }) => {
  const { settings } = useClinicConfig();
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
      title: 'Phone Desk (Kabul)',
      detail: CLINIC_PROFILE.formattedPhone,
      sub: CLINIC_PROFILE.hoursPolicy,
      href: `tel:${CLINIC_PROFILE.phone}`,
      icon: Phone,
      btnText: 'Call Clinic',
    },
    {
      title: 'WhatsApp Consultation Desk',
      detail: CLINIC_PROFILE.formattedPhone,
      sub: 'Appointments & remedy inquiries',
      href: `https://wa.me/${(settings.whatsappNumber || CLINIC_PROFILE.phone).replace(/[^0-9]/g, '')}`,
      icon: MessageCircle,
      btnText: 'Message on WhatsApp',
    },
    {
      title: 'Clinical Emails',
      detail: CLINIC_PROFILE.email,
      sub: CLINIC_PROFILE.secondaryEmail,
      href: `mailto:${CLINIC_PROFILE.email}`,
      icon: Mail,
      btnText: 'Send Email',
    },
    {
      title: 'Official Websites',
      detail: CLINIC_PROFILE.website,
      sub: CLINIC_PROFILE.secondaryWebsite,
      href: `https://${CLINIC_PROFILE.website}`,
      icon: Globe,
      btnText: 'Open Portal',
    },
  ];

  const socialChannels = [
    { name: 'WhatsApp', url: `https://wa.me/${(settings.whatsappNumber || '93780299299').replace(/[^0-9]/g, '')}`, handle: CLINIC_PROFILE.formattedPhone },
    { name: 'Facebook', url: settings.facebookUrl || 'https://facebook.com', handle: 'Safi Natural Care' },
    { name: 'Instagram', url: settings.instagramUrl || 'https://instagram.com', handle: '@safinaturalcare' },
    { name: 'X (Twitter)', url: settings.twitterUrl || 'https://twitter.com', handle: '@safinaturalcare' },
  ];

  return (
    <div className="pt-24 lg:pt-32 pb-20 min-h-screen bg-[#FAF8F5] text-[#18201B] selection:bg-[#18201B] selection:text-[#FAF8F5]">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8C5A32]">
            {CLINIC_PROFILE.name} · {CLINIC_PROFILE.city}, {CLINIC_PROFILE.country}
          </p>

          <h1 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#18201B]">
            Contact &amp; Kabul Locations
          </h1>

          <p className="text-sm sm:text-base text-[#525C56] leading-relaxed">
            {CLINIC_PROFILE.hoursPolicy}. Reach Dr. Hafizullah Safi’s reception desk for scheduled visits, walk-in coordination, or herbal dispensary pickups.
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
                className="p-6 rounded-2xl bg-white border border-[#D6CFC3] flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-[#F2EEE7] flex items-center justify-center text-[#18201B]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-serif-classic font-bold text-base text-[#18201B]">
                      {c.title}
                    </h2>
                    <p className="text-sm font-bold text-[#8C5A32] mt-1 break-all">{c.detail}</p>
                    <p className="text-xs text-[#525C56] mt-0.5 break-all">{c.sub}</p>
                  </div>
                </div>

                <a
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : '_self'}
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-lg bg-[#18201B] hover:bg-[#2C3931] text-xs font-semibold text-[#FAF8F5] transition-colors flex items-center justify-center"
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
          <div className="lg:col-span-7 p-7 sm:p-10 rounded-3xl bg-white border border-[#D6CFC3] shadow-sm space-y-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#8C5A32] font-semibold">
                Online Inquiry
              </span>
              <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#18201B] mt-1">
                Send a Message to Our Reception Desk
              </h2>
              <p className="text-xs sm:text-sm text-[#525C56] mt-1.5">
                Ask about outpatient scheduling, Unani Mizaj assessments, or herbal preparation availability.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#18201B] text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                <h3 className="font-serif-classic text-xl font-bold text-[#18201B]">
                  Inquiry Received
                </h3>
                <p className="text-xs text-[#525C56] max-w-md mx-auto">
                  Thank you for contacting {CLINIC_PROFILE.name}. Our Kabul reception coordinator will follow up with you shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 rounded-lg bg-[#18201B] text-xs text-[#FAF8F5] font-semibold cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#18201B]">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nadia Rahmati"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#D6CFC3] focus:border-[#18201B] text-xs sm:text-sm text-[#18201B] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#18201B]">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="nadia.rahmati@example.af"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#D6CFC3] focus:border-[#18201B] text-xs sm:text-sm text-[#18201B] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#18201B]">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+93 7XX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#D6CFC3] focus:border-[#18201B] text-xs sm:text-sm text-[#18201B] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#18201B]">Inquiry Type</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#D6CFC3] focus:border-[#18201B] text-xs sm:text-sm text-[#18201B] focus:outline-none"
                    >
                      <option value="general">General Clinical Question</option>
                      <option value="appointment">Appointment Scheduling</option>
                      <option value="dispensary">Herbal Apothecary &amp; Remedies</option>
                      <option value="telehealth">Telehealth Video Review</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#18201B]">Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Outline your question or preferred consultation time..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#D6CFC3] focus:border-[#18201B] text-xs sm:text-sm text-[#18201B] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#18201B] hover:bg-[#2C3931] text-[#FAF8F5] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 space-y-5">
            {/* Dual Kabul Locations */}
            <div className="p-6 rounded-2xl bg-white border border-[#D6CFC3] space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8C5A32] uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Kabul Locations</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#D6CFC3]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5A32] block">
                    Clinic Address
                  </span>
                  <strong className="text-sm text-[#18201B] block mt-0.5 font-serif-classic">
                    {CLINIC_PROFILE.name}
                  </strong>
                  <p className="text-[#525C56] mt-0.5">{CLINIC_PROFILE.clinicAddress}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#D6CFC3]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5A32] block">
                    Registered Office
                  </span>
                  <strong className="text-sm text-[#18201B] block mt-0.5 font-serif-classic">
                    {CLINIC_PROFILE.companyName}
                  </strong>
                  <p className="text-[#525C56] mt-0.5">{CLINIC_PROFILE.registeredOffice}</p>
                </div>
              </div>

              <button
                onClick={onOpenBooking}
                className="w-full py-2.5 rounded-lg bg-[#18201B] hover:bg-[#2C3931] text-[#FAF8F5] font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Outpatient Consultation</span>
              </button>
            </div>

            {/* Hours Policy */}
            <div className="p-6 rounded-2xl bg-white border border-[#D6CFC3] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8C5A32] uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>Clinic Hours &amp; Walk-In Rule</span>
              </div>
              <p className="text-sm font-semibold text-[#18201B]">
                {CLINIC_PROFILE.hoursPolicy}
              </p>
              <p className="text-xs text-[#525C56] leading-relaxed">
                Pre-booked patients receive priority consultation slots; walk-ins are seen in order of arrival between scheduled consultations.
              </p>
            </div>

            {/* Sacred Epigraph */}
            <div className="p-6 rounded-2xl bg-[#18201B] text-[#FAF8F5] space-y-2 text-center">
              <p className="font-serif-classic text-2xl font-bold" dir="rtl">
                {CLINIC_PROFILE.faithAndHealing.arabic}
              </p>
              <p className="text-xs text-[#D4AF7A]" dir="rtl">
                {CLINIC_PROFILE.faithAndHealing.pashto}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Social Links */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-7 rounded-2xl bg-white border border-[#D6CFC3] space-y-5">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#8C5A32] font-semibold">
              Clinic Channels
            </span>
            <h2 className="font-serif-classic text-xl sm:text-2xl font-bold text-[#18201B] mt-1">
              Follow {CLINIC_PROFILE.companyName}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {socialChannels.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-xl bg-[#FAF8F5] border border-[#D6CFC3] hover:border-[#18201B] transition-colors text-center space-y-1"
              >
                <span className="text-xs font-bold text-[#18201B] block">{s.name}</span>
                <span className="text-[11px] text-[#525C56] block truncate">{s.handle}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
