/**
 * RageBait Lab - Audio Synthesizer Engine
 * 100% self-contained procedural Web Audio API synthesizers.
 * No external media dependencies that could break or fail to load.
 */

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.analyser = null;
    this.prefs = window.RBLStorage.getPreferences();
    this.isMuted = !this.prefs.soundEnabled;
    this.volume = this.prefs.volume || 0.7;
    this.isInitialized = false;

    // Listen for storage changes
    window.addEventListener('storage', () => {
      this.syncPreferences();
    });
  }

  initAudioContext() {
    if (this.isInitialized && this.audioCtx) {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('Web Audio API not supported in this browser.');
        return;
      }

      this.audioCtx = new AudioContextClass();
      this.masterGain = this.audioCtx.createGain();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);

      this.updateMasterGain();
      this.isInitialized = true;
    } catch (e) {
      console.warn('AudioContext initialization deferred until user interaction.', e);
    }
  }

  updateMasterGain() {
    if (!this.masterGain || !this.audioCtx) return;
    const effectiveVolume = this.isMuted ? 0 : this.volume;
    this.masterGain.gain.setValueAtTime(effectiveVolume, this.audioCtx.currentTime);
  }

  syncPreferences() {
    this.prefs = window.RBLStorage.getPreferences();
    this.isMuted = !this.prefs.soundEnabled;
    this.volume = this.prefs.volume;
    this.updateMasterGain();
  }

  setMuted(muted) {
    this.isMuted = muted;
    this.prefs.soundEnabled = !muted;
    window.RBLStorage.savePreferences({ soundEnabled: !muted });
    this.updateMasterGain();
    window.dispatchEvent(new CustomEvent('rbl:audioMuteToggled', { detail: { isMuted: this.isMuted } }));
  }

  toggleMute() {
    this.initAudioContext();
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, parseFloat(val)));
    this.prefs.volume = this.volume;
    window.RBLStorage.savePreferences({ volume: this.volume });
    this.updateMasterGain();
  }

  notifySoundPlayed(soundName) {
    window.dispatchEvent(new CustomEvent('rbl:soundPlayed', { detail: { name: soundName } }));
    // Increment soundboard/audio interaction
    window.RBLStorage.updateStats(stats => {
      stats.soundboardPlays = (stats.soundboardPlays || 0) + 1;
      return stats;
    });
  }

  // --- PROCEDURAL SOUND GENERATORS ---

  // 1. Vine Boom: Sub-bass drop + kick + saturation
  playVineBoom() {
    this.initAudioContext();
    if (!this.audioCtx || this.isMuted) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.8);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(60, now + 0.9);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.2);

    this.notifySoundPlayed('vine_boom');
  }

  // 2. Airhorn: 3 chordal square waves with pitch sweep
  playAirhorn() {
    this.initAudioContext();
    if (!this.audioCtx || this.isMuted) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const freqs = [466.16, 554.37, 622.25]; // Bb chord
    const durations = [0.15, 0.15, 0.35];
    let offset = 0;

    durations.forEach(dur => {
      freqs.forEach(f => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now + offset);
        osc.frequency.exponentialRampToValueAtTime(f * 1.03, now + offset + dur);

        gain.gain.setValueAtTime(0.2, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.01, now + offset + dur);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + offset);
        osc.stop(now + offset + dur);
      });
      offset += dur + 0.05;
    });

    this.notifySoundPlayed('airhorn');
  }

  // 3. Sad Trombone: 4 descending sliding notes
  playSadTrombone() {
    this.initAudioContext();
    if (!this.audioCtx || this.isMuted) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const notes = [
      { f: 233.08, d: 0.35 }, // Bb3
      { f: 220.00, d: 0.35 }, // A3
      { f: 207.65, d: 0.35 }, // Ab3
      { f: 196.00, d: 0.85, slideTo: 160 } // G3 -> sliding down
    ];

    let t = now;
    notes.forEach((n, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(n.f, t);
      if (n.slideTo) {
        osc.frequency.linearRampToValueAtTime(n.slideTo, t + n.d);
      }

      // Vibrato
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 6;
      lfoGain.gain.value = 4;
      lfo.connect(osc.frequency);
      lfo.start(t);
      lfo.stop(t + n.d);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + n.d);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + n.d);

      t += n.d + 0.05;
    });

    this.notifySoundPlayed('sad_trombone');
  }

  // 4. Laser Pew: Rapid pitch drop
  playLaser() {
    this.initAudioContext();
    if (!this.audioCtx || this.isMuted) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.22);

    this.notifySoundPlayed('laser_pew');
  }

  // 5. Quack / Squeak: Pitch modulation
  playQuack() {
    this.initAudioContext();
    if (!this.audioCtx || this.isMuted) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(250, now);
    osc.frequency.linearRampToValueAtTime(600, now + 0.07);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.25);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.25);

    this.notifySoundPlayed('quack');
  }

  // 6. Buzzer / Bruh: Abrasive error drone
  playBuzzer() {
    this.initAudioContext();
    if (!this.audioCtx || this.isMuted) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(110, now);
    osc2.frequency.setValueAtTime(116, now); // dissonance

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);

    this.notifySoundPlayed('buzzer');
  }

  // 7. Click / Pop
  playPop() {
    this.initAudioContext();
    if (!this.audioCtx || this.isMuted) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.06);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // 8. Victory Chime: Fast celebratory arpeggio
  playVictory() {
    this.initAudioContext();
    if (!this.audioCtx || this.isMuted) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C - E - G - C

    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + (i * 0.09);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, startTime);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });

    this.notifySoundPlayed('victory');
  }

  // 9. Siren / Panic: Wailing LFO
  playSiren(duration = 2.5) {
    this.initAudioContext();
    if (!this.audioCtx || this.isMuted) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.value = 600;

    lfo.frequency.value = 3; // 3 cycles per second
    lfoGain.gain.value = 250; // swing +- 250Hz

    lfo.connect(osc.frequency);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    lfo.start(now);
    osc.start(now);
    lfo.stop(now + duration);
    osc.stop(now + duration);

    this.notifySoundPlayed('siren');
  }

  // 10. Glitch Static
  playStatic(duration = 0.15) {
    this.initAudioContext();
    if (!this.audioCtx || this.isMuted) return;

    const ctx = this.audioCtx;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
  }
}

// Global audio engine singleton
window.RBLAudio = new SoundEngine();
