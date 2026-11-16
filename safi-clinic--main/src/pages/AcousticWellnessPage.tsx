import React from 'react';
import {
  Sparkles,
  Radio,
  Headphones,
  Music,
  Heart,
  Wind,
  ShieldCheck,
  Calendar,
  Volume2,
  Sliders,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { AcousticWellness } from '../components/AcousticWellness';

interface AcousticWellnessPageProps {
  onOpenBooking: () => void;
  onNavigateToTreatments: () => void;
}

export const AcousticWellnessPage: React.FC<AcousticWellnessPageProps> = ({
  onOpenBooking,
  onNavigateToTreatments,
}) => {
  return (
    <div className="pt-24 lg:pt-32 pb-24 min-h-screen bg-[#070d18] text-[#f5f3ec] relative selection:bg-[#a855f7] selection:text-white">
      {/* Page Ambient Ethereal Indigo-Emerald & Celestial Gold Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-indigo-600/20 via-emerald-800/15 to-transparent blur-[150px] pointer-events-none -z-10" />

      {/* Header Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d162b] border border-[#a855f7]/50 text-[#c084fc] text-xs font-semibold uppercase tracking-widest shadow-md">
            <Radio className="w-3.5 h-3.5 text-[#eab308]" />
            <span>Acoustic Medicine & Frequency Healing Chamber</span>
          </div>

          <h1 className="font-serif-classic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f5f3ec]">
            Ilaj bil-Mousiqi ·{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] via-[#eab308] to-[#2dd4bf]">
              Acoustic Soundscapes
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed">
            Experience therapeutic acoustic entrainment inspired by the classical Greco-Arab and Persian hospitals of Ibn Sina (Avicenna) and Al-Farabi. Calibrate your nervous system with synthesized Solfeggio frequencies and traditional organic soundscapes.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-[#94a3b8]">
            <span className="flex items-center gap-1.5 text-indigo-300">
              <Headphones className="w-4 h-4 text-[#a855f7]" />
              Stereo Headphones Recommended for Binaural Entrainment
            </span>
            <span className="text-[#1e293b]">·</span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-[#2dd4bf]" />
              Pure Web Audio Synthesis · Zero Latency
            </span>
          </div>
        </div>
      </section>

      {/* Main Interactive Frequency & Soundscape Generator */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <AcousticWellness />
      </section>

      {/* Clinical Science Dossier: Ilaj bil-Mousiqi & Vagal Tone */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0b1526] border border-[#334155] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e293b] pb-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#eab308] font-bold">
                Clinical Phytotherapy & Sound Medicine
              </span>
              <h2 className="font-serif-classic text-2xl sm:text-3xl font-bold text-[#f5f3ec] mt-1">
                The Historical Science of Ilaj bil-Mousiqi
              </h2>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-[#1e293b] text-xs text-[#94a3b8] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#2dd4bf]" />
              <span>Historical Clinical Record</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#94a3b8] leading-relaxed">
            <div className="space-y-3 p-5 rounded-2xl bg-[#08101d] border border-[#1e293b]">
              <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Music className="w-5 h-5" />
              </div>
              <h3 className="font-serif-classic font-bold text-sm text-[#f5f3ec]">
                1. Al-Farabi's Maqam Humoral Modulations
              </h3>
              <p>
                In his foundational treatise <em>Kitab al-Musiqa al-Kabir</em>, the polymath Abu Nasr Al-Farabi mapped musical modes (Maqamat) to specific emotional states and autonomic nervous system responses. Modes like Rast instill serenity and joy, while Bayati and Husayni gently dissipate grief and anxiety.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-2xl bg-[#08101d] border border-[#1e293b]">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif-classic font-bold text-sm text-[#f5f3ec]">
                2. Ibn Sina & Hospital Acoustics
              </h3>
              <p>
                In the medieval Bimaristans (teaching hospitals) of Nishapur and Baghdad, water cascades, gentle harps, and tuned reed pipes were placed in patient wards to soothe delirium, lower pulse rate, and enhance the bioavailability of oral herbal decoctions through vagal stimulation.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-2xl bg-[#08101d] border border-[#1e293b]">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Wind className="w-5 h-5" />
              </div>
              <h3 className="font-serif-classic font-bold text-sm text-[#f5f3ec]">
                3. Modern Cortisol & Vagal Tone Research
              </h3>
              <p>
                Contemporary neuroscience confirms that low-frequency acoustic vibrations (such as 432 Hz and theta binaural beats at 6.0 Hz) increase heart rate variability (HRV), decrease serum cortisol by up to 24%, and prime cell membranes for the absorption of botanical adaptogens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Consultation Call to Action */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0d1b30] via-[#122442] to-[#0d1b30] border border-[#3b82f6]/40 shadow-2xl text-center space-y-5">
          <h2 className="font-serif-classic text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f5f3ec]">
            Pair Sound Therapy With Tailored Botanical Medicine
          </h2>
          <p className="text-xs sm:text-sm text-[#94a3b8] max-w-xl mx-auto">
            Book a clinical consultation at Safi Natural Care Clinic in Kabul or through our worldwide telehealth service to receive an individualized herbal regimen.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenBooking()}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#eab308] to-[#ca8a04] text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 cursor-pointer flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Clinical Consultation</span>
            </button>
            <button
              onClick={onNavigateToTreatments}
              className="px-6 py-3.5 rounded-xl bg-[#0b1526] border border-[#334155] hover:border-[#eab308] text-xs text-[#f5f3ec] font-semibold transition-colors cursor-pointer"
            >
              View Unani Treatments & Fees →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
