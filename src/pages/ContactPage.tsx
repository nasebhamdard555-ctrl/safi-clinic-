import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Calendar,
  HelpCircle,
  Share2,
} from 'lucide-react';

interface ContactPageProps {
  onOpenBooking: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenBooking }) => {
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
    }, 900);
  };

  const clinicHours = [
    { day: 'Saturday – Wednesday', hours: '8:30 AM – 7:00 PM', status: 'Full Outpatient Consultations, Unani Diagnosis & Herbal Dispensary' },
    { day: 'Thursday', hours: '8:30 AM – 5:00 PM', status: 'Consultations, Regimenal Therapies & Naturopathic Follow-ups' },
    { day: 'Friday', hours: '9:00 AM – 1:00 PM', status: 'Priority Clinical Triage & Urgent Herbal Care' },
  ];

  const contactHotlines = [
    {
      title: 'Main Clinic Desk (Kabul)',
      detail: '+93 780 299 299',
      sub: 'Sat–Thu 8:30 AM – 7:00 PM',
      href: 'tel:+93780299299',
      icon: Phone,
      color: 'text-[#d4af37]',
      btnText: 'Call Clinic Desk',
    },
    {
      title: 'WhatsApp Clinical Support',
      detail: '+93 780 299 299',
      sub: 'Direct messaging & photo assessment',
      href: 'https://wa.me/93780299299',
      icon: MessageCircle,
      color: 'text-emerald-400',
      btnText: 'Chat on WhatsApp',
    },
    {
      title: 'Official Clinic Portal',
      detail: 'www.safihealthcare.com',
      sub: 'Online appointments & clinical resources',
      href: 'https://www.safihealthcare.com',
      icon: Sparkles,
      color: 'text-[#d4af37]',
      btnText: 'Visit Website',
    },
    {
      title: 'Official Inquiries Email',
      detail: 'info@safihealthcare.com',
      sub: 'Medical records & formal correspondence',
      href: 'mailto:info@safihealthcare.com',
      icon: Mail,
      color: 'text-blue-400',
      btnText: 'Send Email',
    },
  ];

  const socialLinks = [
    { name: 'WhatsApp', handle: '+93 780 299 299', url: 'https://wa.me/93780299299' },
    { name: 'Website', handle: 'safihealthcare.com', url: 'https://www.safihealthcare.com' },
    { name: 'Facebook', handle: 'Safi Natural Care Clinic', url: 'https://facebook.com' },
    { name: 'Instagram', handle: '@safihealthcare', url: 'https://instagram.com' },
    { name: 'YouTube', handle: 'Safi Traditional Medicine', url: 'https://youtube.com' },
    { name: 'LinkedIn', handle: 'Safi Healthcare Kabul', url: 'https://linkedin.com' },
  ];

  return (
    <div className="pt-24 lg:pt-32 pb-20 min-h-screen bg-[#11160e] text-[#f5f3ec] relative selection:bg-[#f59e0b] selection:text-black">
      {/* Page Ambient Warm Sunset Courtyard & Saffron Amber Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-amber-500/25 via-emerald-950/20 to-transparent blur-[150px] pointer-events-none -z-10" />

      {/* Header Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a1e15] border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold uppercase tracking-widest shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connect With Our Clinical Team</span>
          </div>

          <h1 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f5f3ec]">
            Contact Safi Herbal Clinic
          </h1>

          <p className="text-sm sm:text-base text-[#a6b6ad] leading-relaxed">
            Reach our reception desk, message our duty clinical herbalist via WhatsApp, or send an inquiry regarding customized botanical formulations.
          </p>
        </div>
      </section>

      {/* Direct Contact Cards */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactHotlines.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#081810] border border-[#234b3c] hover:border-[#d4af37]/60 transition-all flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-xl bg-[#0e2118] border border-[#234b3c] flex items-center justify-center ${c.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif-classic font-bold text-base text-[#f5f3ec]">
                      {c.title}
                    </h3>
                    <p className="text-sm font-bold text-[#d4af37] mt-1">{c.detail}</p>
                    <p className="text-xs text-[#8da396] mt-0.5">{c.sub}</p>
                  </div>
                </div>

                <a
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : '_self'}
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-lg bg-[#0e2118] border border-[#234b3c] hover:border-[#d4af37] text-xs font-semibold text-[#f5f3ec] hover:text-[#d4af37] transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{c.btnText}</span>
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Form & Location Info */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Inquiry Form */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-[#081810] border border-[#234b3c] shadow-2xl space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                Online Inquiry
              </span>
              <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec] mt-1">
                Send a Message to Our Clinical Team
              </h2>
              <p className="text-xs sm:text-sm text-[#8da396] mt-2">
                Have questions about our treatments, herbal formulations, or dietary programs? Our clinical assistants reply within 24 hours.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-6 rounded-2xl bg-[#092215] border border-emerald-500/40 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="font-serif-classic text-xl font-bold text-[#f5f3ec]">
                  Inquiry Received
                </h3>
                <p className="text-xs text-[#a6b6ad] max-w-md mx-auto">
                  Thank you for reaching out to Safi Herbal Clinic. A member of our clinical team has received your message and will contact you via email or phone within 24 business hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 rounded-lg bg-[#0e2118] border border-[#234b3c] text-xs text-[#d4af37] hover:border-[#d4af37] cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#a6b6ad]">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#06120d] border border-[#234b3c] focus:border-[#d4af37] text-xs sm:text-sm text-[#f5f3ec] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#a6b6ad]">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="sarah@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#06120d] border border-[#234b3c] focus:border-[#d4af37] text-xs sm:text-sm text-[#f5f3ec] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#a6b6ad]">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#06120d] border border-[#234b3c] focus:border-[#d4af37] text-xs sm:text-sm text-[#f5f3ec] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#a6b6ad]">Inquiry Type</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#06120d] border border-[#234b3c] focus:border-[#d4af37] text-xs sm:text-sm text-[#f5f3ec] focus:outline-none"
                    >
                      <option value="general">General Clinical Question</option>
                      <option value="appointment">Appointment Inquiry</option>
                      <option value="treatment">Treatment & Hijama Question</option>
                      <option value="dispensary">Herbal Prescription & Refill</option>
                      <option value="telehealth">Virtual Video Consultation</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#a6b6ad]">Message / Health Context *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please outline your symptoms, questions, or current herbal regimen..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#06120d] border border-[#234b3c] focus:border-[#d4af37] text-xs sm:text-sm text-[#f5f3ec] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Submit Clinical Inquiry'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Location & Hours Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            {/* Operating Hours */}
            <div className="p-6 rounded-2xl bg-[#081810] border border-[#234b3c] space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37] uppercase tracking-wider">
                <Clock className="w-4 h-4 text-[#d4af37]" />
                <span>Weekly Clinic Hours</span>
              </div>

              <div className="space-y-3">
                {clinicHours.map((h, i) => (
                  <div key={i} className="pb-3 border-b border-[#1b3b2f] last:border-b-0 last:pb-0 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <strong className="text-[#f5f3ec] font-serif-classic">{h.day}</strong>
                      <span className="text-[#d4af37] font-semibold">{h.hours}</span>
                    </div>
                    <p className="text-[11px] text-[#8da396]">{h.status}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Physical Location */}
            <div className="p-6 rounded-2xl bg-[#081810] border border-[#234b3c] space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37] uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#d4af37]" />
                <span>Clinical Facility Address</span>
              </div>

              <div className="space-y-2 text-xs text-[#a6b6ad] leading-relaxed">
                <strong className="text-sm text-[#f5f3ec] block font-serif-classic">
                  Safi Natural Care Clinic
                </strong>
                <p className="text-[#d8e2dc] font-medium">Outpatient / Community-Based Healthcare Facility</p>
                <p className="text-[#d4af37]">Kabul, Afghanistan</p>
                <p className="text-[11px] text-[#8da396] pt-1">
                  • Operating in accordance with Afghanistan's Ministry of Public Health (MoPH) regulations.
                </p>
                <p className="text-[11px] text-[#8da396]">
                  • Providing safe Herbal Medicine, Unani Medicine, and Naturopathic outpatient clinical care.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenBooking}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-semibold text-xs tracking-wide shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Consultation in Kabul</span>
                </button>
              </div>
            </div>

            {/* Faith & Healing Pillar (Slide 6) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c261b] to-[#06120d] border border-[#d4af37]/50 shadow-xl space-y-3 text-center">
              <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">
                Faith & Healing (Surah Ash-Shu'ara 26:80)
              </span>
              <p className="font-serif-classic text-xl sm:text-2xl text-[#f5f3ec] font-bold tracking-wide" dir="rtl">
                وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ
              </p>
              <p className="text-xs text-[#d8e2dc] italic" dir="rtl">
                او کله چې زه ناروغ شم، نو همغه (الله) ما ته شفا راکوي
              </p>
              <p className="text-[11px] text-[#a6b6ad] pt-1 border-t border-[#1b3b2f]/60">
                "And when I am ill, it is He who cures me"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Network Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="p-8 rounded-2xl bg-[#05110a] border border-[#d4af37]/40 shadow-xl space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              Community & Social Channels
            </span>
            <h2 className="font-serif-classic text-xl sm:text-2xl font-bold text-[#f5f3ec] mt-1">
              Follow Safi Herbal Clinic Online
            </h2>
            <p className="text-xs text-[#8da396] mt-1">
              Join thousands following our daily herbal recipes, clinical case insights, and herbal harvesting updates.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {socialLinks.map((s, idx) => (
              <a
                key={idx}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-xl bg-[#081810] border border-[#234b3c] hover:border-[#d4af37] transition-all text-center space-y-1 group"
              >
                <span className="text-xs font-bold text-[#f5f3ec] group-hover:text-[#d4af37] transition-colors block">
                  {s.name}
                </span>
                <span className="text-[10px] text-[#8da396] block truncate">{s.handle}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
