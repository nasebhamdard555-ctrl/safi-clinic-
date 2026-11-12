import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle,
  Building,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }
    setIsSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 1000);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#040b07] relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d2319] border border-[#c5a059]/40 text-[#f5e6c8] text-xs font-semibold tracking-wider uppercase mb-3">
            <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Dedicated Patient Care & Inquiries</span>
          </div>
          <h2 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f5f3ec]">
            Connect With Safi Herbal Clinic
          </h2>
          <p className="mt-3 text-base text-[#a6b6ad]">
            Reach our patient coordination desk, emergency herbal triage, or schedule an in-person dispensary visit.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Primary Phone */}
            <div className="p-6 rounded-2xl bg-[#081810] border border-[#1b3b2f] hover:border-[#d4af37]/60 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-[#0e2a1d] border border-[#2d5e4b] text-[#d4af37]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#8da396] font-semibold uppercase tracking-wider block">
                    Kabul Clinic Hotline
                  </span>
                  <a
                    href="tel:+93780299299"
                    className="font-serif-classic text-lg font-bold text-[#f5f3ec] hover:text-[#d4af37] transition-colors"
                  >
                    +93 780 299 299
                  </a>
                  <p className="text-[11px] text-[#6b8275] mt-0.5">
                    Available Sat–Thu: 8:30 AM – 7:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp */}
            <div className="p-6 rounded-2xl bg-[#081810] border border-[#1b3b2f] hover:border-[#d4af37]/60 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-[#0e2a1d] border border-[#2d5e4b] text-emerald-400">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#8da396] font-semibold uppercase tracking-wider block">
                    WhatsApp Patient Channel
                  </span>
                  <a
                    href="https://wa.me/93780299299"
                    target="_blank"
                    rel="noreferrer"
                    className="font-serif-classic text-lg font-bold text-[#f5f3ec] hover:text-emerald-400 transition-colors"
                  >
                    +93 780 299 299
                  </a>
                  <p className="text-[11px] text-[#6b8275] mt-0.5">
                    For prescription refills and swift photo assessments
                  </p>
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div className="p-6 rounded-2xl bg-[#081810] border border-[#1b3b2f] hover:border-[#d4af37]/60 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-[#0e2a1d] border border-[#2d5e4b] text-[#d4af37]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#8da396] font-semibold uppercase tracking-wider block">
                    Clinical Correspondence & Website
                  </span>
                  <a
                    href="mailto:info@safihealthcare.com"
                    className="font-serif-classic text-base font-bold text-[#f5f3ec] hover:text-[#d4af37] transition-colors"
                  >
                    info@safihealthcare.com
                  </a>
                  <p className="text-[11px] text-[#6b8275] mt-0.5">
                    Official Portal: www.safihealthcare.com
                  </p>
                </div>
              </div>
            </div>

            {/* Physical Location */}
            <div className="p-6 rounded-2xl bg-[#081810] border border-[#1b3b2f] hover:border-[#d4af37]/60 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-[#0e2a1d] border border-[#2d5e4b] text-[#d4af37]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#8da396] font-semibold uppercase tracking-wider block">
                    Clinical Practice & Outpatient Facility
                  </span>
                  <p className="font-serif-classic text-sm font-bold text-[#f5f3ec]">
                    Safi Natural Care Clinic, Kabul, Afghanistan
                  </p>
                  <p className="text-[11px] text-[#6b8275] mt-0.5">
                    MoPH Compliant · Herbal Medicine | Unani Medicine | Naturopathy
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Message & Consultation Inquiry Form */}
          <div className="lg:col-span-7 bg-[#081810] border border-[#1b3b2f] rounded-2xl p-6 sm:p-8 shadow-xl">
            <h3 className="font-serif-classic text-2xl font-bold text-[#f5f3ec] mb-2">
              Send a Clinical Message
            </h3>
            <p className="text-xs text-[#8da396] mb-6">
              Have a question regarding specific herbs, treatments, or shipping? Our botanical advisors are here to help.
            </p>

            {isSent ? (
              <div className="p-8 rounded-xl bg-[#092216] border border-[#d4af37] text-center space-y-3 animate-in fade-in">
                <CheckCircle className="w-12 h-12 text-[#d4af37] mx-auto" />
                <h4 className="font-serif-classic text-xl font-bold text-[#f5f3ec]">
                  Message Received Successfully
                </h4>
                <p className="text-xs text-[#c9dad0] max-w-md mx-auto">
                  Thank you for reaching out to Safi Herbal Clinic. A senior clinical coordinator will review your inquiry and contact you shortly.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="mt-3 px-5 py-2 rounded-lg bg-[#153a2b] text-[#d4af37] text-xs font-semibold"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#c9dad0] block mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Arthur Conan"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#06120d] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#c9dad0] block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="arthur@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#06120d] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#c9dad0] block mb-1">
                    Phone / WhatsApp Number (optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2831"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#06120d] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#c9dad0] block mb-1">
                    Your Health Inquiry / Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you would like to ask our herbal clinicians..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#06120d] border border-[#1b3b2f] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#d4af37] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#aa8222] text-black font-bold text-xs uppercase tracking-wider shadow-xl hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-black" />
                  <span>Send Inquiry to Clinical Desk</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
