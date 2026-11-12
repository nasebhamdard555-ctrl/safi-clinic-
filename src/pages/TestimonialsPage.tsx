import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles,
  Quote,
  Filter,
  UserCheck,
  Calendar,
  ArrowRight,
  MessageCircle,
  Clock,
  Heart,
  Activity,
  Droplets,
  Share2,
  FileText,
} from 'lucide-react';
import { DETAILED_TESTIMONIALS, PatientTestimonial } from '../components/TestimonialsSection';

interface TestimonialsPageProps {
  onOpenBooking: (serviceId?: string) => void;
  onNavigateToTreatments: () => void;
}

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({
  onOpenBooking,
  onNavigateToTreatments,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [newReview, setNewReview] = useState({
    name: '',
    location: '',
    condition: '',
    doctor: 'Dr. Hakim Safiullah Safi',
    rating: 5,
    story: '',
  });

  const categories = [
    { id: 'all', label: 'All Outcomes' },
    { id: 'digestive', label: 'Digestive & Gut' },
    { id: 'joints', label: 'Joints & Arthritis' },
    { id: 'stress', label: 'Insomnia & Stress' },
    { id: 'skin', label: 'Skin & Eczema' },
    { id: 'vitality', label: 'Fatigue & Vitality' },
  ];

  const filteredList =
    selectedCategory === 'all'
      ? DETAILED_TESTIMONIALS
      : DETAILED_TESTIMONIALS.filter((t) => t.category === selectedCategory);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.story) return;
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setNewReview({
        name: '',
        location: '',
        condition: '',
        doctor: 'Dr. Hakim Safiullah Safi',
        rating: 5,
        story: '',
      });
    }, 2000);
  };

  return (
    <div className="pt-24 lg:pt-32 pb-24 min-h-screen bg-[#0a0a0c] text-[#f5f3ec] relative selection:bg-[#fbbf24] selection:text-black">
      {/* Page Ambient Deep Obsidian & Radiance Gold Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-amber-500/20 via-yellow-900/10 to-transparent blur-[150px] pointer-events-none -z-10" />

      {/* Header Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18160e] border border-[#fbbf24]/50 text-[#fbbf24] text-xs font-semibold uppercase tracking-widest shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Documented Clinical Outcomes & Patient Stories</span>
          </div>

          <h1 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f5f3ec]">
            Patient Recovery Stories &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] via-[#fde68a] to-[#d97706]">
              Clinical Evidence
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#a6b6ad] leading-relaxed">
            Real experiences from patients treated at Safi Natural Care Clinic in Kabul and via our global telehealth service. Every case reflects ethical, non-invasive, evidence-informed herbal medicine.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <div className="p-3.5 rounded-xl bg-[#131418] border border-[#fbbf24]/30 text-center">
              <span className="font-serif-classic text-2xl font-bold text-[#fbbf24]">4.9 / 5.0</span>
              <p className="text-[10px] text-[#a6b6ad] uppercase tracking-wider mt-0.5">Average Satisfaction</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#131418] border border-[#fbbf24]/30 text-center">
              <span className="font-serif-classic text-2xl font-bold text-emerald-400">89.4%</span>
              <p className="text-[10px] text-[#a6b6ad] uppercase tracking-wider mt-0.5">Significant Relief Rate</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#131418] border border-[#fbbf24]/30 text-center">
              <span className="font-serif-classic text-2xl font-bold text-[#f5f3ec]">12,500+</span>
              <p className="text-[10px] text-[#a6b6ad] uppercase tracking-wider mt-0.5">Patients Treated</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#131418] border border-[#fbbf24]/30 text-center">
              <span className="font-serif-classic text-2xl font-bold text-[#fbbf24]">100%</span>
              <p className="text-[10px] text-[#a6b6ad] uppercase tracking-wider mt-0.5">Natural Botanical Rx</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#fbbf24] to-[#d97706] text-black shadow-lg shadow-black/50 font-bold'
                  : 'bg-[#131418] text-[#a6b6ad] hover:text-[#f5f3ec] border border-[#23242a] hover:border-[#fbbf24]/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredList.map((test) => (
            <div
              key={test.id}
              className="p-6 sm:p-7 rounded-2xl bg-[#131418] border border-[#2a2c35] hover:border-[#fbbf24]/60 transition-all shadow-xl flex flex-col justify-between space-y-5 relative overflow-hidden group"
            >
              {/* Gold Top Light */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#fbbf24]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#fbbf24]/20 transition-all" />

              <div className="space-y-4">
                {/* Header Row: Patient & Verified Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif-classic font-bold text-lg text-[#f5f3ec] group-hover:text-[#fbbf24] transition-colors">
                      {test.patientName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[#8da396] mt-0.5">
                      <span>{test.location}</span>
                      {test.age && <span>· Age {test.age}</span>}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-0.5">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]" />
                      ))}
                    </div>
                    {test.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Patient
                      </span>
                    )}
                  </div>
                </div>

                {/* Outcome Metric Callout Box */}
                <div className="p-3.5 rounded-xl bg-[#1a1c22] border border-[#fbbf24]/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-[#fbbf24] font-bold">
                      Clinical Outcome
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded">
                      {test.outcomeMetric}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#f5f3ec]">
                    {test.outcomeHighlight}
                  </p>
                </div>

                {/* Patient Quote */}
                <div className="relative pt-1">
                  <Quote className="w-6 h-6 text-[#fbbf24]/30 absolute -top-1 -left-1" />
                  <p className="text-xs sm:text-sm text-[#c5cfc9] leading-relaxed italic pl-5">
                    "{test.quote}"
                  </p>
                </div>
              </div>

              {/* Protocol Metadata Footer */}
              <div className="pt-4 border-t border-[#23242a] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#8da396]">
                <div>
                  <span className="text-[#a6b6ad] font-semibold">Treated by: </span>
                  <span className="text-[#fbbf24] font-medium">{test.practitioner}</span>
                </div>
                <div>
                  <span className="text-[#a6b6ad]">Duration: </span>
                  <span className="text-[#f5f3ec]">{test.duration}</span>
                  <span className="mx-1.5">·</span>
                  <span>{test.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Share Your Story Form Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-16">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#131418] border border-[#fbbf24]/40 shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#fbbf24] font-bold">
              Patient Community Voice
            </span>
            <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec]">
              Share Your Healing Journey
            </h2>
            <p className="text-xs sm:text-sm text-[#8da396]">
              Has Safi Natural Care Clinic helped restore your health? Your verified testimonial helps other patients seek ethical natural healthcare.
            </p>
          </div>

          {feedbackSubmitted ? (
            <div className="p-6 rounded-2xl bg-[#0f2416] border border-emerald-500/50 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-serif-classic text-xl font-bold text-white">
                Thank You for Sharing Your Experience
              </h3>
              <p className="text-xs text-emerald-200">
                Your testimonial has been submitted to Dr. Safi's clinical editorial board for review and verification.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#c5cfc9] mb-1">
                    Your Full Name / Initials
                  </label>
                  <input
                    type="text"
                    required
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    placeholder="e.g. Ahmad W. or Fatima K."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0c0f] border border-[#2a2c35] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#fbbf24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#c5cfc9] mb-1">
                    City / Country
                  </label>
                  <input
                    type="text"
                    required
                    value={newReview.location}
                    onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                    placeholder="e.g. Kabul, Afghanistan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0c0f] border border-[#2a2c35] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#fbbf24]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#c5cfc9] mb-1">
                    Health Condition Treated
                  </label>
                  <input
                    type="text"
                    required
                    value={newReview.condition}
                    onChange={(e) => setNewReview({ ...newReview, condition: e.target.value })}
                    placeholder="e.g. Gastritis, Knee Pain, Insomnia"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0c0f] border border-[#2a2c35] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#fbbf24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#c5cfc9] mb-1">
                    Attending Practitioner
                  </label>
                  <select
                    value={newReview.doctor}
                    onChange={(e) => setNewReview({ ...newReview, doctor: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0c0f] border border-[#2a2c35] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#fbbf24]"
                  >
                    <option value="Dr. Hakim Safiullah Safi">Dr. Hakim Safiullah Safi (Unani Physician)</option>
                    <option value="Dr. Amina Vance, ND">Dr. Amina Vance, ND (Naturopathic Physician)</option>
                    <option value="Dr. Naseb Hamdard">Dr. Naseb Hamdard (Phytotherapist & Cupping)</option>
                    <option value="Dr. Layla Kazemi">Dr. Layla Kazemi (Clinical Herbal Pharmacognosist)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c5cfc9] mb-1">
                  Your Recovery Story & Outcome
                </label>
                <textarea
                  rows={4}
                  required
                  value={newReview.story}
                  onChange={(e) => setNewReview({ ...newReview, story: e.target.value })}
                  placeholder="Describe your symptoms before treatment, the herbal protocol you used, and how your symptoms improved over time..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0c0f] border border-[#2a2c35] text-xs text-[#f5f3ec] focus:outline-none focus:border-[#fbbf24]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#fbbf24] to-[#d97706] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer shadow-lg"
              >
                Submit Clinical Feedback for Verification
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Bottom CTA to Book */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#181a20] via-[#1f222b] to-[#181a20] border border-[#fbbf24]/50 shadow-2xl text-center space-y-5">
          <h2 className="font-serif-classic text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f5f3ec]">
            Begin Your Personalized Recovery Journey
          </h2>
          <p className="text-xs sm:text-sm text-[#a6b6ad] max-w-xl mx-auto">
            Book an appointment with our experienced clinical team in Kabul or schedule an online video consultation.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenBooking()}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#fbbf24] to-[#d97706] text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 cursor-pointer flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Consultation Now</span>
            </button>
            <button
              onClick={onNavigateToTreatments}
              className="px-6 py-3.5 rounded-xl bg-[#0e1014] border border-[#2a2c35] hover:border-[#fbbf24] text-xs text-[#f5f3ec] font-semibold transition-colors cursor-pointer"
            >
              Explore All Treatments & Pricing →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
