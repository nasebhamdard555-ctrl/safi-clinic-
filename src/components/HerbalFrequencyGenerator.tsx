import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  Sliders,
  Radio,
  Minimize2,
  Maximize2,
  Wind,
} from 'lucide-react';

interface FrequencyPreset {
  id: string;
  name: string;
  freq: number;
  description: string;
  benefit: string;
  color: string;
}

const FREQUENCY_PRESETS: FrequencyPreset[] = [
  {
    id: '432hz',
    name: '432 Hz',
    freq: 432,
    description: 'Natural Harmonic Tuning',
    benefit: 'Deep restorative cellular relaxation & emotional grounding',
    color: '#d4af37',
  },
  {
    id: '528hz',
    name: '528 Hz',
    freq: 528,
    description: 'Miracle Solfeggio',
    benefit: 'Vitality restoration, metabolic balance & Tabiat activation',
    color: '#59ad85',
  },
  {
    id: '639hz',
    name: '639 Hz',
    freq: 639,
    description: 'Humoral Equilibrium',
    benefit: 'Nervine soothing, cardiac serenity & stress alleviation',
    color: '#c5a059',
  },
  {
    id: '174hz',
    name: '174 Hz',
    freq: 174,
    description: 'Natural Analgesic Tone',
    benefit: 'Soothes musculoskeletal tension and joint stiffness',
    color: '#8da396',
  },
];

export const HerbalFrequencyGenerator: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<FrequencyPreset>(FREQUENCY_PRESETS[0]);
  const [volume, setVolume] = useState<number>(0.25);
  const [natureBlend, setNatureBlend] = useState<number>(0.3);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Initialize or resume AudioContext
  const getOrCreateAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const startTone = () => {
    const ctx = getOrCreateAudioContext();

    // Stop existing nodes if any
    stopTone();

    // 1. Primary Pure Harmonic Sine Oscillator
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(activePreset.freq, ctx.currentTime);

    // Warm soft saturation filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(activePreset.freq * 2.5, ctx.currentTime);

    // Smooth gain ramp-up
    oscGain.gain.setValueAtTime(0.001, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(Math.max(0.01, volume * 0.7), ctx.currentTime + 0.8);

    osc.connect(filter);
    filter.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start();

    oscRef.current = osc;
    gainNodeRef.current = oscGain;

    // 2. Synthesize gentle organic botanical pink/rain noise
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(600, ctx.currentTime);
    noiseFilter.Q.setValueAtTime(0.8, ctx.currentTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(
      Math.max(0.005, volume * natureBlend * 0.5),
      ctx.currentTime + 0.8
    );

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start();

    noiseSourceRef.current = noiseSource;
    noiseGainRef.current = noiseGain;

    setIsPlaying(true);
  };

  const stopTone = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {}
      oscRef.current = null;
    }
    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.stop();
        noiseSourceRef.current.disconnect();
      } catch {}
      noiseSourceRef.current = null;
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopTone();
    } else {
      startTone();
    }
  };

  // Adjust volume live
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(
        volume * 0.7,
        audioCtxRef.current.currentTime,
        0.05
      );
    }
    if (noiseGainRef.current && audioCtxRef.current) {
      noiseGainRef.current.gain.setTargetAtTime(
        volume * natureBlend * 0.5,
        audioCtxRef.current.currentTime,
        0.05
      );
    }
  }, [volume, natureBlend]);

  // Adjust frequency when preset changes
  useEffect(() => {
    if (isPlaying) {
      startTone();
    }
  }, [activePreset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTone();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="rounded-2xl bg-[#081810] border border-[#d4af37]/40 shadow-xl overflow-hidden text-[#f5f3ec]">
      {/* Header Bar */}
      <div className="p-4 bg-gradient-to-r from-[#0a1e14] to-[#040e08] border-b border-[#1b3b2f] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-classic font-bold text-sm text-[#f5f3ec]">
                Calming Herbal Frequency Synthesizer
              </h3>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#0e2118] text-[#d4af37] border border-[#234b3c]">
                Web Audio
              </span>
            </div>
            <p className="text-[11px] text-[#8da396]">
              Acoustic restorative frequencies to harmonize the autonomic nervous system
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              isPlaying
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black hover:brightness-110 active:scale-95'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Tone</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Play {activePreset.name}</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg bg-[#0e2118] border border-[#234b3c] text-[#8da396] hover:text-[#f5f3ec] transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse controls' : 'Expand full controls'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Preset Buttons Bar */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#05110a]">
        {FREQUENCY_PRESETS.map((preset) => {
          const isSelected = activePreset.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => setActivePreset(preset)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#0e2a1d] border-[#d4af37] shadow-md shadow-black/40'
                  : 'bg-[#081810] border-[#1b3b2f] hover:border-[#234b3c] text-[#a6b6ad]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-sm text-[#f5f3ec]">
                  {preset.name}
                </span>
                {isSelected && isPlaying && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </div>
              <p className="text-[11px] font-medium text-[#d4af37]">{preset.description}</p>
              <p className="text-[10px] text-[#8da396] line-clamp-1 mt-0.5">{preset.benefit}</p>
            </button>
          );
        })}
      </div>

      {/* Expanded Controls Drawer */}
      {isExpanded && (
        <div className="p-4 sm:p-5 border-t border-[#1b3b2f] bg-[#071710] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Master Volume */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#a6b6ad] flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Master Frequency Volume</span>
                </span>
                <span className="font-mono text-xs text-[#d4af37]">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#0e2118] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
              />
            </div>

            {/* Nature Botanical White Noise Blend */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#a6b6ad] flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Botanical Rain & Breeze Ambience</span>
                </span>
                <span className="font-mono text-xs text-emerald-400">{Math.round(natureBlend * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={natureBlend}
                onChange={(e) => setNatureBlend(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#0e2118] rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#1b3b2f]/60 flex items-center justify-between text-[11px] text-[#8da396]">
            <span>Active Target: {activePreset.benefit}</span>
            <span className="text-[#d4af37]">Recommended session: 10–20 mins</span>
          </div>
        </div>
      )}
    </div>
  );
};
