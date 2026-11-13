import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  MessageCircle,
  CheckCircle,
} from 'lucide-react';
import { CLINIC_PROFILE } from '../data/clinicData';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormError('Please fill out your name, email, and inquiry message.');
      return;
    }
    setFormError(null);
    setIsSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 600);
  };

  return (
    <section id="contact" className="py-14 lg:py-20 bg-[#FAF8F5] text-[#18201B]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8C5A32] block mb-2">
            Direct Reception Desk
          </span>
          <h2 className="font-serif-classic text-3xl sm:text-4xl font-bold text-[#18201B]">
            Connect With {CLINIC_PROFILE.name}
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-[#525C56]">
            {CLINIC_PROFILE.hoursPolicy} · {CLINIC_PROFILE.clinicAddress}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-[#D6CFC3]">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-[#F2EEE7] text-[#18201B]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#525C56] font-semibold uppercase tracking-wider block">
                    Clinic Hotline
                  </span>
                  <a
                    href={`tel:${CLINIC_PROFILE.phone}`}
                    className="font-serif-classic text-lg font-bold text-[#18201B] hover:text-[#8C5A32]"
                  >
                    {CLINIC_PROFILE.formattedPhone}
                  </a>
                  <p className="text-[11px] text-[#525C56] mt-0.5">
                    {CLINIC_PROFILE.hoursPolicy}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#D6CFC3]">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-[#F2EEE7] text-[#18201B]">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#525C56] font-semibold uppercase tracking-wider block">
                    WhatsApp Patient Desk
                  </span>
                  <a
                    href="https://wa.me/93780299299"
                    target="_blank"
                    rel="noreferrer"
                    className="font-serif-classic text-lg font-bold text-[#18201B] hover:text-[#8C5A32]"
                  >
                    {CLINIC_PROFILE.formattedPhone}
                  </a>
                  <p className="text-[11px] text-[#525C56] mt-0.5">
                    Consultations &amp; apothecary dispatch
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#D6CFC3]">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-[#F2EEE7] text-[#18201B]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#525C56] font-semibold uppercase tracking-wider block">
                    Email &amp; Websites
                  </span>
                  <a
                    href={`mailto:${CLINIC_PROFILE.email}`}
                    className="font-serif-classic text-sm font-bold text-[#18201B] hover:text-[#8C5A32] block"
                  >
                    {CLINIC_PROFILE.email} · {CLINIC_PROFILE.secondaryEmail}
                  </a>
                  <p className="text-[11px] text-[#525C56] mt-0.5">
                    {CLINIC_PROFILE.website} · {CLINIC_PROFILE.secondaryWebsite}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#D6CFC3]">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-[#F2EEE7] text-[#18201B]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#525C56] font-semibold uppercase tracking-wider block">
                    Kabul Locations
                  </span>
                  <p className="font-serif-classic text-sm font-bold text-[#18201B]">
                    Clinic: {CLINIC_PROFILE.clinicAddress}
                  </p>
                  <p className="text-[11px] text-[#525C56] mt-0.5">
                    Office: {CLINIC_PROFILE.registeredOffice}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#D6CFC3] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-serif-classic text-2xl font-bold text-[#18201B] mb-1.5">
              Send a Clinical Message
            </h3>
            <p className="text-xs text-[#525C56] mb-6">
              Direct correspondence for outpatient consultations and herbal dispensary questions.
            </p>

            {isSent ? (
              <div className="p-8 rounded-xl bg-[#FAF8F5] border border-[#18201B] text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-emerald-700 mx-auto" />
                <h4 className="font-serif-classic text-xl font-bold text-[#18201B]">
                  Message Received
                </h4>
                <p className="text-xs text-[#525C56] max-w-md mx-auto">
                  Thank you for contacting {CLINIC_PROFILE.name}. Our Kabul reception coordinator will review your note shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSent(false)}
                  className="mt-2 px-5 py-2 rounded-lg bg-[#18201B] text-[#FAF8F5] text-xs font-semibold cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#18201B] block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Nadia Rahmati"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#D6CFC3] text-xs text-[#18201B] focus:outline-none focus:border-[#18201B]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#18201B] block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nadia.rahmati@example.af"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#D6CFC3] text-xs text-[#18201B] focus:outline-none focus:border-[#18201B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#18201B] block mb-1">
                    Phone / WhatsApp (optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+93 7XX XXX XXX"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#D6CFC3] text-xs text-[#18201B] focus:outline-none focus:border-[#18201B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#18201B] block mb-1">
                    Inquiry / Health Context *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about appointments, walk-ins, or herbal remedies..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#D6CFC3] text-xs text-[#18201B] focus:outline-none focus:border-[#18201B] resize-none"
                  />
                </div>

                {formError && (
                  <p className="text-xs text-rose-700 font-medium">{formError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#18201B] hover:bg-[#2C3931] text-[#FAF8F5] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry to Clinic Desk</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
