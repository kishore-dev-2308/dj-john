/**
 * DJ John - Web Audio API Synthesis Engine & 16-Step Sequencer
 * Zero external audio files required - 100% synthesized in-browser via mathematical oscillators & noise nodes.
 */

(function () {
  'use strict';

  let audioCtx = null;
  let masterGainNode = null;
  let biquadFilter = null;
  let analyser = null;

  // Sequencer & Tempo State
  let isBeatPlaying = false;
  let sequencerTimer = null;
  let currentStep = 0;
  let tempoBPM = 126;
  let playbackPitch = 1.0;

  /**
   * Initializes the AudioContext upon first user interaction
   */
  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();

      // Master Gain
      masterGainNode = audioCtx.createGain();
      masterGainNode.gain.value = 0.85;

      // Biquad Filter (Lowpass)
      biquadFilter = audioCtx.createBiquadFilter();
      biquadFilter.type = 'lowpass';
      biquadFilter.frequency.value = 8000;

      // FFT Analyser for real-time visualizer
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;

      // Audio Graph: Instruments -> Filter -> Master Gain -> Analyser -> Speakers
      biquadFilter.connect(masterGainNode);
      masterGainNode.connect(analyser);
      analyser.connect(audioCtx.destination);

      const statusEl = document.getElementById('lcdStatusText');
      if (statusEl) statusEl.textContent = 'STATUS: ONLINE';

      const overlay = document.getElementById('visualizerOverlayText');
      if (overlay) overlay.style.display = 'none';

      // Notify visualizer if registered
      if (window.DJVisualizer && typeof window.DJVisualizer.start === 'function') {
        window.DJVisualizer.start(analyser);
      }
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    return audioCtx;
  }

  // 1. 808 Kick Drum (Rapid exponential pitch drop from 150Hz to 0.01Hz)
  function playKick(time = 0) {
    initAudioContext();
    const startTime = time || audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150 * playbackPitch, startTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, startTime + 0.38);

    gain.gain.setValueAtTime(1.0, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.38);

    osc.connect(gain);
    gain.connect(biquadFilter);

    osc.start(startTime);
    osc.stop(startTime + 0.4);
  }

  // 2. Party Snare / Clap (Filtered white noise burst + punchy triangle body)
  function playSnare(time = 0) {
    initAudioContext();
    const startTime = time || audioCtx.currentTime;

    // Synthesized Noise Buffer
    const bufferSize = audioCtx.sampleRate * 0.22;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1400 * playbackPitch;

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.7, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(biquadFilter);

    // Tonal Body Snap
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180 * playbackPitch, startTime);
    osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.1);
    oscGain.gain.setValueAtTime(0.35, startTime);
    oscGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

    osc.connect(oscGain);
    oscGain.connect(biquadFilter);

    osc.start(startTime);
    osc.stop(startTime + 0.12);
    noise.start(startTime);
    noise.stop(startTime + 0.22);
  }

  // 3. Metallic Hi-Hat (High-pass filtered white noise)
  function playHiHat(time = 0) {
    initAudioContext();
    const startTime = time || audioCtx.currentTime;
    const bufferSize = audioCtx.sampleRate * 0.08;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7500 * playbackPitch;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.4, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.07);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(biquadFilter);

    noise.start(startTime);
    noise.stop(startTime + 0.08);
  }

  // 4. Sub Bass Drop (Deep 808 Sub Boom 120Hz down to 32Hz)
  function playSubDrop() {
    initAudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120 * playbackPitch, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(32, audioCtx.currentTime + 1.2);

    gain.gain.setValueAtTime(0.9, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.25);

    osc.connect(gain);
    gain.connect(biquadFilter);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.25);
  }

  // 5. Synth Festival Lead (Sawtooth Minor 7th Chord: C4, Eb4, G4, Bb4)
  function playSynthChord() {
    initAudioContext();
    const freqs = [261.63, 311.13, 392.00, 466.16];
    freqs.forEach((f) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f * playbackPitch, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(biquadFilter);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    });
  }

  // 6. DJ Air Horn (Classic Soundclash Hype Blast)
  function playAirhorn() {
    initAudioContext();
    const hornFrequencies = [466.16, 466.16, 466.16, 466.16, 523.25];
    const durations = [0.10, 0.10, 0.10, 0.10, 0.4];
    let offset = 0;

    hornFrequencies.forEach((freq, idx) => {
      const dur = durations[idx];
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.value = freq * playbackPitch;

      gain.gain.setValueAtTime(0.22, audioCtx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + offset + dur);

      osc.connect(gain);
      gain.connect(biquadFilter);

      osc.start(audioCtx.currentTime + offset);
      osc.stop(audioCtx.currentTime + offset + dur);

      offset += dur + 0.04;
    });
  }

  // 7. Vinyl Scratch Scrub Audio
  function playVinylScratch(rateMultiplier = 1) {
    if (!audioCtx) initAudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    const baseFreq = 240 * Math.max(0.3, Math.min(2.5, rateMultiplier));
    osc.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(baseFreq * 1.5, audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(biquadFilter);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  }

  /**
   * 16-Step Club Sequencer Tick
   */
  function stepTick() {
    const stepInMeasure = currentStep % 16;
    const beatNum = Math.floor(stepInMeasure / 4);

    // Update 4/4 Beat LEDs
    for (let i = 0; i < 4; i++) {
      const led = document.getElementById(`stepLed${i}`);
      if (led) {
        if (i === beatNum) {
          led.className = 'h-2 rounded-full bg-brand-yellow shadow-neon-yellow';
        } else {
          led.className = 'h-2 rounded-full bg-neutral-800 transition-colors duration-100';
        }
      }
    }

    const stepDisplay = document.getElementById('lcdStepDisplay');
    if (stepDisplay) {
      stepDisplay.textContent = `STEP: ${stepInMeasure + 1}/16`;
    }

    // 4-on-the-Floor Kick on steps 0, 4, 8, 12
    if (stepInMeasure % 4 === 0) {
      playKick();
    }

    // Crisp Snare on beats 2 & 4 (steps 4 and 12)
    if (stepInMeasure === 4 || stepInMeasure === 12) {
      playSnare();
    }

    // Offbeat Hi-Hats on every even step
    if (stepInMeasure % 2 === 0) {
      playHiHat();
    }

    // Synth accents on syncopated grooves
    if (stepInMeasure === 0 || stepInMeasure === 6 || stepInMeasure === 10) {
      playSynthChord();
    }

    currentStep++;
  }

  /**
   * Toggles the automated 4/4 club beat groovebox
   */
  function toggleBeatLoop() {
    initAudioContext();
    const btn = document.getElementById('masterBeatBtn');
    const icon = document.getElementById('masterBeatIcon');
    const text = document.getElementById('masterBeatText');
    const statusText = document.getElementById('lcdStatusText');

    if (isBeatPlaying) {
      clearInterval(sequencerTimer);
      isBeatPlaying = false;
      if (icon) icon.className = 'fa-solid fa-play';
      if (text) text.textContent = 'Start Club Beat Loop';
      if (btn) btn.classList.remove('bg-emerald-500');
      if (statusText) statusText.textContent = 'STATUS: PAUSED';
    } else {
      isBeatPlaying = true;
      currentStep = 0;
      const intervalMs = (60 / tempoBPM / 4) * 1000;
      stepTick();
      sequencerTimer = setInterval(stepTick, intervalMs);
      if (icon) icon.className = 'fa-solid fa-pause';
      if (text) text.textContent = 'Pause Club Beat';
      if (statusText) statusText.textContent = 'STATUS: PLAYING BEAT';
    }
  }

  /**
   * Halts all beat loops and resets visual cues
   */
  function stopAllAudio() {
    if (isBeatPlaying) {
      toggleBeatLoop();
    }
    for (let i = 0; i < 4; i++) {
      const led = document.getElementById(`stepLed${i}`);
      if (led) led.className = 'h-2 rounded-full bg-neutral-800';
    }
    const stepDisplay = document.getElementById('lcdStepDisplay');
    if (stepDisplay) stepDisplay.textContent = 'STEP: --';
  }

  // Hardware parameter adjusters
  function setTempo(bpm) {
    tempoBPM = parseInt(bpm, 10);
    if (isBeatPlaying) {
      clearInterval(sequencerTimer);
      const intervalMs = (60 / tempoBPM / 4) * 1000;
      sequencerTimer = setInterval(stepTick, intervalMs);
    }
  }

  function setMasterGain(val) {
    if (masterGainNode) {
      masterGainNode.gain.value = parseFloat(val);
    }
  }

  function setFilterFreq(val) {
    if (biquadFilter) {
      biquadFilter.frequency.value = parseFloat(val);
    }
  }

  function setPitch(val) {
    playbackPitch = parseFloat(val);
  }

  function getAnalyser() {
    return analyser;
  }

  // Export to global window.DJAudio
  window.DJAudio = {
    init: initAudioContext,
    playKick,
    playSnare,
    playHiHat,
    playSubDrop,
    playSynthChord,
    playAirhorn,
    playVinylScratch,
    toggleBeatLoop,
    stopAllAudio,
    setTempo,
    setMasterGain,
    setFilterFreq,
    setPitch,
    getAnalyser,
    getIsPlaying: () => isBeatPlaying
  };
})();
