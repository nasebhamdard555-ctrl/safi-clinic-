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
  CloudRain,
  Music,
  Bell,
  Clock,
  RotateCcw,
  Headphones,
  Leaf,
  Activity,
  Heart,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  calculateBinauralFrequencies,
  formatAcousticTimer,
  getSoundscapeProfile,
} from '../utils/clinicLogic';

export interface FrequencyPreset {
  id: string;
  name: string;
  freq: number;
  description: string;
  benefit: string;
  humoralEffect: string;
  color: string;
}

export const ACOUSTIC_FREQUENCY_PRESETS: FrequencyPreset[] = [
  {
    id: '432hz',
    name: '432 Hz',
    freq: 432,
    description: 'Natural Harmonic Tuning',
    benefit: 'Cellular equilibrium & restorative emotional grounding',
    humoralEffect: 'Balances Dam (Blood) & Safra (Yellow Bile)',
    color: '#d4af37',
  },
  {
    id: '528hz',
    name: '528 Hz',
    freq: 528,
    description: 'Miracle Solfeggio',
    benefit: 'Vitality activation, tissue restoration & Tabiat self-healing',
    humoralEffect: 'Enkindles innate constitutional heat (Hararat Ghareezia)',
    color: '#59ad85',
  },
  {
    id: '639hz',
    name: '639 Hz',
    freq: 639,
    description: 'Humoral Equilibrium',
    benefit: 'Vagal nerve soothing, cardiac serenity & mental tranquility',
    humoralEffect: 'Alleviates anxious melancholia (Sawda)',
    color: '#e2bb38',
  },
  {
    id: '174hz',
    name: '174 Hz',
    freq: 174,
    description: 'Natural Analgesic Tone',
    benefit: 'Soothes chronic musculoskeletal pain & joint stiffness',
    humoralEffect: 'Resolves cold phlegmatic humoral stagnation (Balgham)',
    color: '#8da396',
  },
  {
    id: '852hz',
    name: '852 Hz',
    freq: 852,
    description: 'Clarity & Intuition',
    benefit: 'Dissolves cerebral stagnation and awakens mental focus',
    humoralEffect: 'Purifies subtle cerebral vital spirit (Ruh)',
    color: '#c5a059',
  },
];

export interface SoundscapeLayer {
  id: 'rain' | 'garden' | 'oud' | 'bowl';
  title: string;
  subtitle: string;
  icon: 'rain' | 'garden' | 'oud' | 'bowl';
  active: boolean;
  volume: number; // 0 to 1
  description: string;
}

export const AcousticWellness: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeFrequencyPreset, setActiveFrequencyPreset] = useState<FrequencyPreset>(
    ACOUSTIC_FREQUENCY_PRESETS[0]
  );
  const [customFreq, setCustomFreq] = useState<number>(432);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [masterVolume, setMasterVolume] = useState<number>(0.35);
  const [binauralMode, setBinauralMode] = useState<'off' | 'delta' | 'theta' | 'alpha'>('theta');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState<number>(15);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(15 * 60);

  // Soundscape toggles and independent volumes
  const [soundscapes, setSoundscapes] = useState<SoundscapeLayer[]>([
    {
      id: 'rain',
      title: 'Forest Rain',
      subtitle: 'Gentle raindrops on Afghan pine & cedar needles',
      icon: 'rain',
      active: true,
      volume: 0.4,
      description: 'Cooling pink noise with resonant water droplets.',
    },
    {
      id: 'garden',
      title: 'Herbal Garden',
      subtitle: 'Mountain breeze & aromatic botanical wind chimes',
      icon: 'garden',
      active: true,
      volume: 0.3,
      description: 'Warm atmospheric breeze with subtle resonant harmonics.',
    },
    {
      id: 'oud',
      title: 'Traditional Oud',
      subtitle: 'Classical Maqam Rast acoustic string drone',
      icon: 'oud',
      active: false,
      volume: 0.35,
      description: 'Modal strings evoking ancient Greco-Arab Unani healing halls.',
    },
    {
      id: 'bowl',
      title: 'Singing Bowl & Bell',
      subtitle: 'Golden bronze chime with long harmonic decay',
      icon: 'bowl',
      active: false,
      volume: 0.25,
      description: 'Deep metallic resonance for meditative centering.',
    },
  ]);

  // Audio Context & Nodes References
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Frequency Generator Nodes
  const oscLeftRef = useRef<OscillatorNode | null>(null);
  const oscRightRef = useRef<OscillatorNode | null>(null);
  const freqGainRef = useRef<GainNode | null>(null);

  // Soundscape Nodes
  const rainNoiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);
  const gardenGainRef = useRef<GainNode | null>(null);
  const gardenOsc1Ref = useRef<OscillatorNode | null>(null);
  const gardenOsc2Ref = useRef<OscillatorNode | null>(null);
  const oudIntervalRef = useRef<number | null>(null);
  const oudGainRef = useRef<GainNode | null>(null);
  const bowlIntervalRef = useRef<number | null>(null);
  const bowlGainRef = useRef<GainNode | null>(null);

  // Canvas visualizer reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            stopAllAudio();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, secondsRemaining]);

  // Handle Audio Context Initialization
  const getAudioContext = (): AudioContext => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();

      // Master Analyser for Visualizer
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyserRef.current = analyser;

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(masterVolume, ctx.currentTime);
      masterGain.connect(analyser);
      analyser.connect(ctx.destination);
      masterGainRef.current = masterGain;

      audioCtxRef.current = ctx;
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Start Frequency Generator
  const startFrequencyOscillators = () => {
    const ctx = getAudioContext();
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    // Clean existing
    stopFrequencyOscillators();

    const currentBaseFreq = isCustomMode ? customFreq : activeFrequencyPreset.freq;
    const tuning = calculateBinauralFrequencies(currentBaseFreq, binauralMode === 'off' ? 'theta' : binauralMode);

    const freqGain = ctx.createGain();
    freqGain.gain.setValueAtTime(0.001, ctx.currentTime);
    freqGain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.6);

    if (binauralMode === 'off') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(currentBaseFreq, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(currentBaseFreq * 2.2, ctx.currentTime);

      osc.connect(filter);
      filter.connect(freqGain);
      osc.start();
      oscLeftRef.current = osc;
    } else {
      // Stereo binaural pair
      const merger = ctx.createChannelMerger(2);

      const oscL = ctx.createOscillator();
      oscL.type = 'sine';
      oscL.frequency.setValueAtTime(tuning.leftHz, ctx.currentTime);

      const oscR = ctx.createOscillator();
      oscR.type = 'sine';
      oscR.frequency.setValueAtTime(tuning.rightHz, ctx.currentTime);

      oscL.connect(merger, 0, 0); // left channel
      oscR.connect(merger, 0, 1); // right channel

      merger.connect(freqGain);
      oscL.start();
      oscR.start();

      oscLeftRef.current = oscL;
      oscRightRef.current = oscR;
    }

    freqGain.connect(master);
    freqGainRef.current = freqGain;
  };

  const stopFrequencyOscillators = () => {
    if (oscLeftRef.current) {
      try {
        oscLeftRef.current.stop();
        oscLeftRef.current.disconnect();
      } catch {}
      oscLeftRef.current = null;
    }
    if (oscRightRef.current) {
      try {
        oscRightRef.current.stop();
        oscRightRef.current.disconnect();
      } catch {}
      oscRightRef.current = null;
    }
    if (freqGainRef.current) {
      try {
        freqGainRef.current.disconnect();
      } catch {}
      freqGainRef.current = null;
    }
  };

  // Soundscape 1: Forest Rain Synthesis
  const startRainSoundscape = () => {
    const ctx = getAudioContext();
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    stopRainSoundscape();

    const rainLayer = soundscapes.find((s) => s.id === 'rain');
    if (!rainLayer || !rainLayer.active) return;

    // Pink noise buffer
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
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(0.001, ctx.currentTime);
    rainGain.gain.exponentialRampToValueAtTime(Math.max(0.01, rainLayer.volume * 0.5), ctx.currentTime + 0.8);

    noiseSource.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(master);
    noiseSource.start();

    rainNoiseSourceRef.current = noiseSource;
    rainGainRef.current = rainGain;
  };

  const stopRainSoundscape = () => {
    if (rainNoiseSourceRef.current) {
      try {
        rainNoiseSourceRef.current.stop();
        rainNoiseSourceRef.current.disconnect();
      } catch {}
      rainNoiseSourceRef.current = null;
    }
    if (rainGainRef.current) {
      try {
        rainGainRef.current.disconnect();
      } catch {}
      rainGainRef.current = null;
    }
  };

  // Soundscape 2: Herbal Garden Mountain Breeze
  const startGardenSoundscape = () => {
    const ctx = getAudioContext();
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    stopGardenSoundscape();

    const gardenLayer = soundscapes.find((s) => s.id === 'garden');
    if (!gardenLayer || !gardenLayer.active) return;

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(216, ctx.currentTime); // gentle octave sub-harmonic

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(432.5, ctx.currentTime); // subtle slow beating chorus

    // Slow breath LFO filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    const gardenGain = ctx.createGain();
    gardenGain.gain.setValueAtTime(0.001, ctx.currentTime);
    gardenGain.gain.exponentialRampToValueAtTime(
      Math.max(0.01, gardenLayer.volume * 0.35),
      ctx.currentTime + 0.8
    );

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gardenGain);
    gardenGain.connect(master);

    osc1.start();
    osc2.start();

    gardenOsc1Ref.current = osc1;
    gardenOsc2Ref.current = osc2;
    gardenGainRef.current = gardenGain;
  };

  const stopGardenSoundscape = () => {
    if (gardenOsc1Ref.current) {
      try {
        gardenOsc1Ref.current.stop();
        gardenOsc1Ref.current.disconnect();
      } catch {}
      gardenOsc1Ref.current = null;
    }
    if (gardenOsc2Ref.current) {
      try {
        gardenOsc2Ref.current.stop();
        gardenOsc2Ref.current.disconnect();
      } catch {}
      gardenOsc2Ref.current = null;
    }
    if (gardenGainRef.current) {
      try {
        gardenGainRef.current.disconnect();
      } catch {}
      gardenGainRef.current = null;
    }
  };

  // Soundscape 3: Traditional Oud Modal Pluck Synthesis (Maqam Rast / Bayati in D)
  const startOudSoundscape = () => {
    const ctx = getAudioContext();
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    stopOudSoundscape();

    const oudLayer = soundscapes.find((s) => s.id === 'oud');
    if (!oudLayer || !oudLayer.active) return;

    const oudGain = ctx.createGain();
    oudGain.gain.setValueAtTime(Math.max(0.01, oudLayer.volume * 0.45), ctx.currentTime);
    oudGain.connect(master);
    oudGainRef.current = oudGain;

    // Traditional Maqam Bayati / Rast scale notes: D3 (146.8 Hz), G3 (196.0 Hz), A3 (220.0 Hz), C4 (261.6 Hz), D4 (293.7 Hz)
    const oudScale = [146.83, 196.0, 220.0, 246.9, 293.66, 329.63, 146.83];
    let noteIdx = 0;

    const triggerOudPluck = () => {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') return;
      const currentCtx = audioCtxRef.current;
      const targetFreq = oudScale[noteIdx % oudScale.length];
      noteIdx++;

      // Dual-harmonic Karplus-Strong string synthesis
      const osc = currentCtx.createOscillator();
      const stringGain = currentCtx.createGain();
      const stringFilter = currentCtx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(targetFreq, currentCtx.currentTime);

      // Acoustic wood body dampening
      stringFilter.type = 'lowpass';
      stringFilter.frequency.setValueAtTime(targetFreq * 4, currentCtx.currentTime);
      stringFilter.frequency.exponentialRampToValueAtTime(targetFreq * 0.8, currentCtx.currentTime + 1.8);

      // Fast pluck attack, resonant decay
      stringGain.gain.setValueAtTime(0.001, currentCtx.currentTime);
      stringGain.gain.linearRampToValueAtTime(0.25, currentCtx.currentTime + 0.04);
      stringGain.gain.exponentialRampToValueAtTime(0.001, currentCtx.currentTime + 2.4);

      osc.connect(stringFilter);
      stringFilter.connect(stringGain);
      if (oudGainRef.current) {
        stringGain.connect(oudGainRef.current);
      }

      osc.start();
      osc.stop(currentCtx.currentTime + 2.5);
    };

    // Initial pluck
    triggerOudPluck();

    // Periodic contemplative plucks every 3.2 seconds
    const interval = window.setInterval(() => {
      triggerOudPluck();
    }, 3200);

    oudIntervalRef.current = interval;
  };

  const stopOudSoundscape = () => {
    if (oudIntervalRef.current) {
      clearInterval(oudIntervalRef.current);
      oudIntervalRef.current = null;
    }
    if (oudGainRef.current) {
      try {
        oudGainRef.current.disconnect();
      } catch {}
      oudGainRef.current = null;
    }
  };

  // Soundscape 4: Singing Bowl & Bell Synthesis
  const startBowlSoundscape = () => {
    const ctx = getAudioContext();
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    stopBowlSoundscape();

    const bowlLayer = soundscapes.find((s) => s.id === 'bowl');
    if (!bowlLayer || !bowlLayer.active) return;

    const bowlGain = ctx.createGain();
    bowlGain.gain.setValueAtTime(Math.max(0.01, bowlLayer.volume * 0.3), ctx.currentTime);
    bowlGain.connect(master);
    bowlGainRef.current = bowlGain;

    const triggerBowlStrike = () => {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') return;
      const currentCtx = audioCtxRef.current;

      // 3 inharmonic metallic partials: Fundamental (324 Hz), Minor Third (388 Hz), Fifth (486 Hz)
      const partials = [324, 388, 486, 776];
      partials.forEach((f, idx) => {
        const osc = currentCtx.createOscillator();
        const pGain = currentCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f + (idx === 0 ? 0.8 : 0), currentCtx.currentTime); // subtle binaural beating

        pGain.gain.setValueAtTime(0.001, currentCtx.currentTime);
        pGain.gain.linearRampToValueAtTime(0.18 / (idx + 1), currentCtx.currentTime + 0.08);
        pGain.gain.exponentialRampToValueAtTime(0.0001, currentCtx.currentTime + 5.0);

        osc.connect(pGain);
        if (bowlGainRef.current) {
          pGain.connect(bowlGainRef.current);
        }

        osc.start();
        osc.stop(currentCtx.currentTime + 5.2);
      });
    };

    triggerBowlStrike();

    const interval = window.setInterval(() => {
      triggerBowlStrike();
    }, 7500);

    bowlIntervalRef.current = interval;
  };

  const stopBowlSoundscape = () => {
    if (bowlIntervalRef.current) {
      clearInterval(bowlIntervalRef.current);
      bowlIntervalRef.current = null;
    }
    if (bowlGainRef.current) {
      try {
        bowlGainRef.current.disconnect();
      } catch {}
      bowlGainRef.current = null;
    }
  };

  // Master Play / Stop
  const startAllAudio = () => {
    startFrequencyOscillators();
    startRainSoundscape();
    startGardenSoundscape();
    startOudSoundscape();
    startBowlSoundscape();
    setIsPlaying(true);
    startVisualizer();
  };

  const stopAllAudio = () => {
    stopFrequencyOscillators();
    stopRainSoundscape();
    stopGardenSoundscape();
    stopOudSoundscape();
    stopBowlSoundscape();
    setIsPlaying(false);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  };

  const toggleMasterPlay = () => {
    if (isPlaying) {
      stopAllAudio();
    } else {
      startAllAudio();
    }
  };

  // Toggle individual soundscape layer
  const toggleSoundscapeLayer = (id: 'rain' | 'garden' | 'oud' | 'bowl') => {
    setSoundscapes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  // Adjust soundscape volume
  const setSoundscapeVolume = (id: 'rain' | 'garden' | 'oud' | 'bowl', val: number) => {
    setSoundscapes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, volume: val } : s))
    );
  };

  // Live adjustment of master volume
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(
        masterVolume,
        audioCtxRef.current.currentTime,
        0.05
      );
    }
  }, [masterVolume]);

  // Restart soundscapes when toggled or volumes changed if playing
  useEffect(() => {
    if (isPlaying) {
      const rain = soundscapes.find((s) => s.id === 'rain');
      if (rain?.active && !rainNoiseSourceRef.current) startRainSoundscape();
      else if (!rain?.active && rainNoiseSourceRef.current) stopRainSoundscape();
      else if (rainGainRef.current && rain && audioCtxRef.current) {
        rainGainRef.current.gain.setTargetAtTime(rain.volume * 0.5, audioCtxRef.current.currentTime, 0.05);
      }

      const garden = soundscapes.find((s) => s.id === 'garden');
      if (garden?.active && !gardenOsc1Ref.current) startGardenSoundscape();
      else if (!garden?.active && gardenOsc1Ref.current) stopGardenSoundscape();
      else if (gardenGainRef.current && garden && audioCtxRef.current) {
        gardenGainRef.current.gain.setTargetAtTime(garden.volume * 0.35, audioCtxRef.current.currentTime, 0.05);
      }

      const oud = soundscapes.find((s) => s.id === 'oud');
      if (oud?.active && !oudIntervalRef.current) startOudSoundscape();
      else if (!oud?.active && oudIntervalRef.current) stopOudSoundscape();
      else if (oudGainRef.current && oud && audioCtxRef.current) {
        oudGainRef.current.gain.setTargetAtTime(oud.volume * 0.45, audioCtxRef.current.currentTime, 0.05);
      }

      const bowl = soundscapes.find((s) => s.id === 'bowl');
      if (bowl?.active && !bowlIntervalRef.current) startBowlSoundscape();
      else if (!bowl?.active && bowlIntervalRef.current) stopBowlSoundscape();
      else if (bowlGainRef.current && bowl && audioCtxRef.current) {
        bowlGainRef.current.gain.setTargetAtTime(bowl.volume * 0.3, audioCtxRef.current.currentTime, 0.05);
      }
    }
  }, [soundscapes, isPlaying]);

  // Restart frequency if preset, custom freq, or binaural mode changes
  useEffect(() => {
    if (isPlaying) {
      startFrequencyOscillators();
    }
  }, [activeFrequencyPreset, customFreq, isCustomMode, binauralMode]);

  // HTML5 Canvas Real-Time Spectrum Visualizer
  const startVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#040d08');
      bgGrad.addColorStop(1, '#020604');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;

        // Golden-emerald glowing harmonic gradient
        const grad = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        grad.addColorStop(0, '#d4af37'); // Gold peak
        grad.addColorStop(0.5, '#59ad85'); // Emerald mid
        grad.addColorStop(1, '#0d281a'); // Deep dark green base

        ctx.fillStyle = grad;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);

        x += barWidth;
      }

      // Draw Center Baseline
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 2);
      ctx.lineTo(canvas.width, canvas.height - 2);
      ctx.stroke();
    };

    render();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#081b12] via-[#05140e] to-[#020905] border border-[#d4af37]/50 shadow-2xl overflow-hidden text-[#f5f3ec]">
      {/* Top Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0b2417] via-[#071911] to-[#040e08] border-b border-[#1b3b2f] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold uppercase tracking-widest">
            <Radio className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Acoustic Wellness & Sound Medicine</span>
          </div>

          <h2 className="font-serif-classic text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f5f3ec]">
            Interactive Herbal Frequency & Soundscape Generator
          </h2>

          <p className="text-xs sm:text-sm text-[#a6b6ad] leading-relaxed">
            Experience therapeutic acoustic harmonics rooted in classical Unani-Tibb (<em>Ilaj bil-Mousiqi</em>).
            Synthesize natural solfeggio frequencies and blend organic soundscapes to create a calming clinic atmosphere.
          </p>
        </div>

        {/* Master Play Button & Status */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={toggleMasterPlay}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer ${
              isPlaying
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black hover:brightness-110 active:scale-95'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Clinic Session</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play Acoustic Soundscape</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-3 rounded-2xl bg-[#091b12] border border-[#234b3c] text-[#8da396] hover:text-[#f5f3ec] hover:border-[#d4af37] transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse controls' : 'Expand full controls'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Real-time Spectrum Canvas Visualizer */}
      <div className="relative h-20 bg-black/60 border-b border-[#1b3b2f] overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={80}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-4 text-[10px] uppercase tracking-wider text-[#d4af37] font-mono flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
          <span>
            {isPlaying
              ? `Harmonic Spectrum Live: ${isCustomMode ? customFreq : activeFrequencyPreset.freq} Hz · ${binauralMode.toUpperCase()} Brainwave Mode`
              : 'Web Audio Synthesizer Standby'}
          </span>
        </div>
        <div className="absolute top-2 right-4 text-[11px] font-mono text-[#8da396]">
          Session: <strong className="text-[#f5f3ec]">{formatAcousticTimer(secondsRemaining)}</strong>
        </div>
      </div>

      {/* Main Body */}
      {isExpanded && (
        <div className="p-6 sm:p-8 space-y-8">
          {/* SECTION 1: Solfeggio & Herbal Frequency Generator */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1b3b2f] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <h3 className="font-serif-classic font-bold text-lg text-[#f5f3ec]">
                  1. Herbal Harmonic Frequency Presets
                </h3>
              </div>

              {/* Binaural Entrainment Switcher */}
              <div className="flex items-center gap-1.5 text-xs text-[#8da396]">
                <Headphones className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="text-[11px] font-medium mr-1">Binaural Entrainment:</span>
                {(['off', 'delta', 'theta', 'alpha'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setBinauralMode(mode)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                      binauralMode === mode
                        ? 'bg-[#d4af37] text-black'
                        : 'bg-[#091b12] text-[#8da396] hover:text-[#f5f3ec] border border-[#1b3b2f]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Presets Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {ACOUSTIC_FREQUENCY_PRESETS.map((preset) => {
                const isSelected = !isCustomMode && activeFrequencyPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setIsCustomMode(false);
                      setActiveFrequencyPreset(preset);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-[#0e2a1d] border-[#d4af37] shadow-lg shadow-black/50'
                        : 'bg-[#081810] border-[#1b3b2f] hover:border-[#234b3c] text-[#a6b6ad]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-base text-[#f5f3ec]">
                          {preset.name}
                        </span>
                        {isSelected && isPlaying && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        )}
                      </div>
                      <p className="text-[11px] font-semibold text-[#d4af37] mt-0.5">{preset.description}</p>
                    </div>

                    <div className="space-y-1 text-[10px] text-[#8da396] pt-2 border-t border-[#1b3b2f]/50">
                      <p className="line-clamp-2 leading-tight">{preset.benefit}</p>
                      <p className="text-emerald-400 font-medium italic line-clamp-1">{preset.humoralEffect}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Tuning Slider Toggle */}
            <div className="p-4 rounded-2xl bg-[#06140e] border border-[#1b3b2f] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sliders className="w-4 h-4 text-[#d4af37]" />
                <div>
                  <span className="text-xs font-bold text-[#f5f3ec] block">
                    Custom Frequency Calibration: <span className="font-mono text-[#d4af37]">{customFreq} Hz</span>
                  </span>
                  <span className="text-[11px] text-[#8da396]">
                    Fine-tune the primary healing frequency manually from 100 Hz to 900 Hz.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="100"
                  max="900"
                  step="1"
                  value={customFreq}
                  onChange={(e) => {
                    setCustomFreq(parseInt(e.target.value));
                    setIsCustomMode(true);
                  }}
                  className="w-48 h-1.5 bg-[#0e2118] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
                />
                <button
                  onClick={() => setIsCustomMode(!isCustomMode)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    isCustomMode
                      ? 'bg-[#d4af37] text-black font-bold'
                      : 'bg-[#091b12] text-[#8da396] border border-[#234b3c]'
                  }`}
                >
                  {isCustomMode ? 'Custom Active' : 'Enable'}
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: Interactive Soundscape Atmosphere Layers */}
          <div className="space-y-4">
            <div className="border-b border-[#1b3b2f] pb-3">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-[#d4af37]" />
                <h3 className="font-serif-classic font-bold text-lg text-[#f5f3ec]">
                  2. Natural Clinic Soundscapes (Toggle & Mix)
                </h3>
              </div>
              <p className="text-xs text-[#8da396] mt-1">
                Toggle and blend authentic environmental acoustics with your chosen frequency.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {soundscapes.map((scape) => {
                const profile = getSoundscapeProfile(scape.id);
                return (
                  <div
                    key={scape.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                      scape.active
                        ? 'bg-[#0b2417] border-[#d4af37]/60 shadow-lg'
                        : 'bg-[#06140e] border-[#1b3b2f] opacity-75'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                              scape.active
                                ? 'bg-[#d4af37] text-black font-bold'
                                : 'bg-[#0e2418] text-[#8da396]'
                            }`}
                          >
                            {scape.icon === 'rain' && <CloudRain className="w-4 h-4" />}
                            {scape.icon === 'garden' && <Wind className="w-4 h-4" />}
                            {scape.icon === 'oud' && <Music className="w-4 h-4" />}
                            {scape.icon === 'bowl' && <Bell className="w-4 h-4" />}
                          </div>
                          <div>
                            <h4 className="font-serif-classic font-bold text-sm text-[#f5f3ec]">
                              {scape.title}
                            </h4>
                            <span className="text-[10px] text-[#8da396] block">{profile.element}</span>
                          </div>
                        </div>

                        {/* Toggle switch */}
                        <button
                          onClick={() => toggleSoundscapeLayer(scape.id)}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                            scape.active ? 'bg-[#d4af37]' : 'bg-[#1b3b2f]'
                          }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-black transition-transform ${
                              scape.active ? 'translate-x-5 bg-black' : 'translate-x-0 bg-white/70'
                            }`}
                          />
                        </button>
                      </div>

                      <p className="text-xs text-[#a6b6ad] leading-relaxed line-clamp-2">
                        {scape.subtitle}
                      </p>

                      <p className="text-[10px] text-emerald-400 italic line-clamp-2">
                        {profile.humorEffect}
                      </p>
                    </div>

                    {/* Independent Volume Slider for this soundscape */}
                    <div className="pt-2 border-t border-[#1b3b2f]/60 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#8da396]">Layer Mix</span>
                        <span className="font-mono text-[#d4af37]">{Math.round(scape.volume * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        disabled={!scape.active}
                        value={scape.volume}
                        onChange={(e) => setSoundscapeVolume(scape.id, parseFloat(e.target.value))}
                        className="w-full h-1 bg-[#05110a] rounded-lg appearance-none cursor-pointer accent-[#d4af37] disabled:opacity-40"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: Master Session Mixer & Timer Controls */}
          <div className="p-5 rounded-2xl bg-[#06140e] border border-[#1b3b2f] grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Master Volume */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#f5f3ec] font-semibold flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#d4af37]" />
                  <span>Clinic Master Volume Output</span>
                </span>
                <span className="font-mono text-xs text-[#d4af37] font-bold">{Math.round(masterVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={masterVolume}
                onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-[#0b2417] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
              />
            </div>

            {/* Session Timer Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#f5f3ec] font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#d4af37]" />
                  <span>Therapy Session Duration</span>
                </span>
                <span className="font-mono text-xs text-emerald-400 font-bold">
                  {formatAcousticTimer(secondsRemaining)} remaining
                </span>
              </div>

              <div className="flex items-center gap-2">
                {[5, 10, 15, 30, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      setSessionDurationMinutes(mins);
                      setSecondsRemaining(mins * 60);
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      sessionDurationMinutes === mins
                        ? 'bg-gradient-to-r from-[#d4af37] to-[#aa8222] text-black font-bold'
                        : 'bg-[#091b12] text-[#a6b6ad] hover:text-[#f5f3ec] border border-[#234b3c]'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 4: Classical Unani-Tibb Acoustic Medicine Dossier */}
          <div className="p-4 rounded-xl bg-[#040e08] border border-[#1b3b2f] flex flex-col sm:flex-row items-start gap-3.5 text-xs text-[#8da396]">
            <ShieldCheck className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-[#d4af37] block uppercase tracking-wider text-[11px]">
                Classical Unani Science: Ilaj bil-Mousiqi (Acoustic Pharmacotherapy)
              </span>
              <p className="leading-relaxed">
                In classical Greco-Arab and Persian medicine, physicians including Avicenna (Ibn Sina) and Al-Farabi utilized pure acoustic harmonic modes (<em>Maqamat</em>) in clinical hospital wards (Bimaristans) to modulate the autonomic nervous system, regulate heart rate variability (HRV), and pacify disturbed humors without pharmaceutical side effects.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
