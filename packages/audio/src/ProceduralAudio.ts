/**
 * ProceduralAudio — generates placeholder sounds using the Web Audio API.
 * All buffers are rendered once via OfflineAudioContext and cached.
 * Every public method is browser-safe (guarded by the typeof window check).
 */

const SAMPLE_RATE = 44100;

function createOfflineCtx(durationSeconds: number, channels = 1): OfflineAudioContext {
  return new OfflineAudioContext(channels, Math.ceil(SAMPLE_RATE * durationSeconds), SAMPLE_RATE);
}

/** Fill a Float32Array channel with white noise. */
function whiteNoise(length: number): Float32Array<ArrayBuffer> {
  const data = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return data;
}

export class ProceduralAudio {
  private static readonly cache = new Map<string, AudioBuffer>();

  // ---------------------------------------------------------------------------
  // Core render helper
  // ---------------------------------------------------------------------------

  private static async render(
    key: string,
    durationSeconds: number,
    setup: (ctx: OfflineAudioContext) => void,
    channels = 1,
  ): Promise<AudioBuffer | null> {
    if (typeof window === 'undefined') return null;
    const cached = ProceduralAudio.cache.get(key);
    if (cached !== undefined) return cached;

    const ctx = createOfflineCtx(durationSeconds, channels);
    setup(ctx);
    const buffer = await ctx.startRendering();
    ProceduralAudio.cache.set(key, buffer);
    return buffer;
  }

  // ---------------------------------------------------------------------------
  // SFX generators
  // ---------------------------------------------------------------------------

  /** Short click/tap — white noise burst through HPF. */
  static generateFootstep(): Promise<AudioBuffer | null> {
    return ProceduralAudio.render('footstep', 0.09, (ctx) => {
      const dur = 0.09;
      const len = Math.ceil(SAMPLE_RATE * dur);
      const noiseBuf = ctx.createBuffer(1, len, SAMPLE_RATE);
      noiseBuf.copyToChannel(whiteNoise(len), 0);

      const src = ctx.createBufferSource();
      src.buffer = noiseBuf;

      const hpf = ctx.createBiquadFilter();
      hpf.type = 'highpass';
      hpf.frequency.value = 2800;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35, 0);
      gain.gain.exponentialRampToValueAtTime(0.001, dur);

      src.connect(hpf);
      hpf.connect(gain);
      gain.connect(ctx.destination);
      src.start(0);
    });
  }

  /** Electronic whoosh up — sawtooth sweep from 150 Hz → 1400 Hz. */
  static generateTerminalOpen(): Promise<AudioBuffer | null> {
    return ProceduralAudio.render('terminal_open', 0.42, (ctx) => {
      const dur = 0.42;

      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, 0);
      osc.frequency.exponentialRampToValueAtTime(1400, dur * 0.75);
      osc.detune.value = 7;

      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.setValueAtTime(500, 0);
      lpf.frequency.exponentialRampToValueAtTime(5000, dur * 0.75);
      lpf.Q.value = 4;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, 0);
      gain.gain.linearRampToValueAtTime(0.45, 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, dur);

      osc.connect(lpf);
      lpf.connect(gain);
      gain.connect(ctx.destination);
      osc.start(0);
      osc.stop(dur);
    });
  }

  /** Reverse whoosh — sawtooth sweep from 1400 Hz → 150 Hz. */
  static generateTerminalClose(): Promise<AudioBuffer | null> {
    return ProceduralAudio.render('terminal_close', 0.42, (ctx) => {
      const dur = 0.42;

      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, 0);
      osc.frequency.exponentialRampToValueAtTime(150, dur * 0.75);
      osc.detune.value = -7;

      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.setValueAtTime(5000, 0);
      lpf.frequency.exponentialRampToValueAtTime(300, dur * 0.75);
      lpf.Q.value = 4;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.45, 0);
      gain.gain.exponentialRampToValueAtTime(0.001, dur);

      osc.connect(lpf);
      lpf.connect(gain);
      gain.connect(ctx.destination);
      osc.start(0);
      osc.stop(dur);
    });
  }

  /** Soft click — brief filtered noise. */
  static generateKeypress(): Promise<AudioBuffer | null> {
    return ProceduralAudio.render('keypress', 0.065, (ctx) => {
      const dur = 0.065;
      const len = Math.ceil(SAMPLE_RATE * dur);
      const noiseBuf = ctx.createBuffer(1, len, SAMPLE_RATE);
      noiseBuf.copyToChannel(whiteNoise(len), 0);

      const src = ctx.createBufferSource();
      src.buffer = noiseBuf;

      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.value = 4500;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, 0);
      gain.gain.exponentialRampToValueAtTime(0.001, dur);

      src.connect(lpf);
      lpf.connect(gain);
      gain.connect(ctx.destination);
      src.start(0);
    });
  }

  /** Two-step processing beep — square wave at 440 Hz then 880 Hz. */
  static generateCodeSubmit(): Promise<AudioBuffer | null> {
    return ProceduralAudio.render('code_submit', 0.38, (ctx) => {
      const pairs: Array<[number, number]> = [
        [0, 440],
        [0.13, 880],
      ];

      for (const [start, freq] of pairs) {
        const osc = ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.value = freq;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.2, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.13);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.13);
      }
    });
  }

  /** Ascending chime — C5, E5, G5 with harmonic overtone. */
  static generateSuccess(): Promise<AudioBuffer | null> {
    return ProceduralAudio.render('success', 1.6, (ctx) => {
      const notes: Array<[number, number]> = [
        [0, 523.25],
        [0.38, 659.25],
        [0.76, 783.99],
      ];

      for (const [start, freq] of notes) {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const overtone = ctx.createOscillator();
        overtone.type = 'sine';
        overtone.frequency.value = freq * 2;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.38, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.55);

        const gainOvt = ctx.createGain();
        gainOvt.gain.setValueAtTime(0, start);
        gainOvt.gain.linearRampToValueAtTime(0.1, start + 0.02);
        gainOvt.gain.exponentialRampToValueAtTime(0.001, start + 0.45);

        osc.connect(gain);
        overtone.connect(gainOvt);
        gain.connect(ctx.destination);
        gainOvt.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.55);
        overtone.start(start);
        overtone.stop(start + 0.45);
      }
    });
  }

  /** Descending buzz — sawtooth sweep downward with LPF close. */
  static generateFailure(): Promise<AudioBuffer | null> {
    return ProceduralAudio.render('failure', 0.72, (ctx) => {
      const dur = 0.72;

      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, 0);
      osc.frequency.exponentialRampToValueAtTime(110, dur);
      osc.detune.value = -12;

      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.setValueAtTime(2200, 0);
      lpf.frequency.exponentialRampToValueAtTime(180, dur);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.42, 0);
      gain.gain.exponentialRampToValueAtTime(0.001, dur);

      osc.connect(lpf);
      lpf.connect(gain);
      gain.connect(ctx.destination);
      osc.start(0);
      osc.stop(dur);
    });
  }

  /** Fanfare — 5 ascending notes: C5, E5, G5, B5, C6. */
  static generateAchievement(): Promise<AudioBuffer | null> {
    return ProceduralAudio.render('achievement', 2.6, (ctx) => {
      const notes: Array<[number, number]> = [
        [0, 523.25],
        [0.38, 659.25],
        [0.76, 783.99],
        [1.14, 987.77],
        [1.52, 1046.5],
      ];

      for (const [start, freq] of notes) {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.32, start + 0.02);
        gain.gain.setValueAtTime(0.32, start + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.65);
      }
    });
  }

  /** Mechanical hum + elevator ding at the end. */
  static generateElevator(): Promise<AudioBuffer | null> {
    return ProceduralAudio.render('elevator', 2.1, (ctx) => {
      const dur = 2.1;

      // Low sawtooth hum
      const hum = ctx.createOscillator();
      hum.type = 'sawtooth';
      hum.frequency.value = 60;

      const humLpf = ctx.createBiquadFilter();
      humLpf.type = 'lowpass';
      humLpf.frequency.value = 180;

      const humGain = ctx.createGain();
      humGain.gain.setValueAtTime(0.22, 0);
      humGain.gain.setValueAtTime(0.22, dur - 0.35);
      humGain.gain.exponentialRampToValueAtTime(0.001, dur);

      hum.connect(humLpf);
      humLpf.connect(humGain);
      humGain.connect(ctx.destination);
      hum.start(0);
      hum.stop(dur);

      // Ding near the end
      const dingStart = dur - 0.55;
      const ding = ctx.createOscillator();
      ding.type = 'sine';
      ding.frequency.value = 880;

      const dingGain = ctx.createGain();
      dingGain.gain.setValueAtTime(0, dingStart);
      dingGain.gain.linearRampToValueAtTime(0.55, dingStart + 0.01);
      dingGain.gain.exponentialRampToValueAtTime(0.001, dur);

      ding.connect(dingGain);
      dingGain.connect(ctx.destination);
      ding.start(dingStart);
      ding.stop(dur);
    });
  }

  /** Short blip for typewriter effect. */
  static generateDialogBlip(): Promise<AudioBuffer | null> {
    return ProceduralAudio.render('dialog_blip', 0.055, (ctx) => {
      const dur = 0.055;

      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.value = 920;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, 0);
      gain.gain.exponentialRampToValueAtTime(0.001, dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(0);
      osc.stop(dur);
    });
  }

  /** Electronic chirp — square wave frequency sweep with bandpass. */
  static generateCipherGreeting(): Promise<AudioBuffer | null> {
    return ProceduralAudio.render('cipher_greeting', 0.28, (ctx) => {
      const dur = 0.28;

      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(320, 0);
      osc.frequency.exponentialRampToValueAtTime(1900, dur * 0.55);
      osc.frequency.exponentialRampToValueAtTime(650, dur);

      const bpf = ctx.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.value = 1100;
      bpf.Q.value = 2.5;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, 0);
      gain.gain.linearRampToValueAtTime(0.3, 0.02);
      gain.gain.setValueAtTime(0.3, dur * 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, dur);

      osc.connect(bpf);
      bpf.connect(gain);
      gain.connect(ctx.destination);
      osc.start(0);
      osc.stop(dur);
    });
  }

  // ---------------------------------------------------------------------------
  // Loopable ambient / music generators
  // ---------------------------------------------------------------------------

  /**
   * Low-frequency drone — layered saws + sines with subtle noise.
   * Designed to loop seamlessly (6 s buffer).
   */
  static generateAmbientHum(): Promise<AudioBuffer | null> {
    return ProceduralAudio.render('ambient_hum', 6.0, (ctx) => {
      const dur = 6.0;

      const layers: Array<[OscillatorType, number, number, number]> = [
        ['sawtooth', 40, -3, 0.09],
        ['sine', 55, 0, 0.13],
        ['sawtooth', 80, 4, 0.06],
        ['sine', 110, -6, 0.04],
      ];

      for (const [type, freq, detune, vol] of layers) {
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.value = freq;
        osc.detune.value = detune;

        const lpf = ctx.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.value = 320;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, 0);
        gain.gain.linearRampToValueAtTime(vol, 0.8);
        gain.gain.setValueAtTime(vol, dur - 0.8);
        gain.gain.linearRampToValueAtTime(0, dur);

        osc.connect(lpf);
        lpf.connect(gain);
        gain.connect(ctx.destination);
        osc.start(0);
        osc.stop(dur);
      }

      // Subtle noise under-layer
      const noiseLen = Math.ceil(SAMPLE_RATE * dur);
      const noiseBuf = ctx.createBuffer(1, noiseLen, SAMPLE_RATE);
      const noiseData = whiteNoise(noiseLen);
      // Scale noise down
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = (noiseData[i] ?? 0) * 0.018;
      }
      noiseBuf.copyToChannel(noiseData, 0);

      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = noiseBuf;

      const noiseLpf = ctx.createBiquadFilter();
      noiseLpf.type = 'lowpass';
      noiseLpf.frequency.value = 140;

      noiseSrc.connect(noiseLpf);
      noiseLpf.connect(ctx.destination);
      noiseSrc.start(0);
    });
  }

  /**
   * Simple cyberpunk beat — kick + snare + hi-hat + sawtooth bass line.
   * Designed to loop seamlessly (4 s / 120 BPM buffer).
   */
  static generateCyberpunkBeat(): Promise<AudioBuffer | null> {
    return ProceduralAudio.render('cyberpunk_beat', 4.0, (ctx) => {
      const dur = 4.0;
      const beatDur = 0.5; // 120 BPM
      const numBeats = Math.floor(dur / beatDur);

      for (let beat = 0; beat < numBeats; beat++) {
        const t = beat * beatDur;

        // Kick on even beats
        if (beat % 2 === 0) {
          const kick = ctx.createOscillator();
          kick.type = 'sine';
          kick.frequency.setValueAtTime(155, t);
          kick.frequency.exponentialRampToValueAtTime(38, t + 0.18);

          const kickGain = ctx.createGain();
          kickGain.gain.setValueAtTime(0.85, t);
          kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

          kick.connect(kickGain);
          kickGain.connect(ctx.destination);
          kick.start(t);
          kick.stop(t + 0.32);

          // Punch click
          const clickDur = 0.022;
          const clickLen = Math.ceil(SAMPLE_RATE * clickDur);
          const clickBuf = ctx.createBuffer(1, clickLen, SAMPLE_RATE);
          clickBuf.copyToChannel(whiteNoise(clickLen), 0);
          const clickSrc = ctx.createBufferSource();
          clickSrc.buffer = clickBuf;
          const clickGain = ctx.createGain();
          clickGain.gain.setValueAtTime(0.32, t);
          clickGain.gain.exponentialRampToValueAtTime(0.001, t + clickDur);
          clickSrc.connect(clickGain);
          clickGain.connect(ctx.destination);
          clickSrc.start(t);
        }

        // Snare on odd beats
        if (beat % 2 === 1) {
          const snareDur = 0.12;
          const snareLen = Math.ceil(SAMPLE_RATE * snareDur);
          const snareBuf = ctx.createBuffer(1, snareLen, SAMPLE_RATE);
          snareBuf.copyToChannel(whiteNoise(snareLen), 0);

          const snareSrc = ctx.createBufferSource();
          snareSrc.buffer = snareBuf;

          const snareHpf = ctx.createBiquadFilter();
          snareHpf.type = 'highpass';
          snareHpf.frequency.value = 1100;

          const snareGain = ctx.createGain();
          snareGain.gain.setValueAtTime(0.42, t);
          snareGain.gain.exponentialRampToValueAtTime(0.001, t + snareDur);

          snareSrc.connect(snareHpf);
          snareHpf.connect(snareGain);
          snareGain.connect(ctx.destination);
          snareSrc.start(t);
        }

        // Hi-hat on every 8th note (half-beat)
        const hhT = t + beatDur * 0.5;
        if (hhT < dur - 0.01) {
          const hhDur = 0.042;
          const hhLen = Math.ceil(SAMPLE_RATE * hhDur);
          const hhBuf = ctx.createBuffer(1, hhLen, SAMPLE_RATE);
          hhBuf.copyToChannel(whiteNoise(hhLen), 0);

          const hhSrc = ctx.createBufferSource();
          hhSrc.buffer = hhBuf;

          const hhHpf = ctx.createBiquadFilter();
          hhHpf.type = 'highpass';
          hhHpf.frequency.value = 8500;

          const hhGain = ctx.createGain();
          hhGain.gain.setValueAtTime(0.15, hhT);
          hhGain.gain.exponentialRampToValueAtTime(0.001, hhT + hhDur);

          hhSrc.connect(hhHpf);
          hhHpf.connect(hhGain);
          hhGain.connect(ctx.destination);
          hhSrc.start(hhT);
        }
      }

      // Sawtooth bass arpeggio
      const bassNotes: Array<[number, number]> = [
        [0, 55],
        [0.5, 55],
        [1.0, 82.41],
        [1.5, 55],
        [2.0, 65.41],
        [2.5, 55],
        [3.0, 82.41],
        [3.5, 55],
      ];

      for (const [start, freq] of bassNotes) {
        const noteDur = 0.38;
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;

        const lpf = ctx.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.setValueAtTime(420, start);
        lpf.frequency.exponentialRampToValueAtTime(90, start + noteDur);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.16, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + noteDur);

        osc.connect(lpf);
        lpf.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + noteDur);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Bulk preload
  // ---------------------------------------------------------------------------

  /** Pre-generate every buffer. Should be called after the first user gesture. */
  static async preloadAll(): Promise<void> {
    await Promise.all([
      ProceduralAudio.generateFootstep(),
      ProceduralAudio.generateTerminalOpen(),
      ProceduralAudio.generateTerminalClose(),
      ProceduralAudio.generateKeypress(),
      ProceduralAudio.generateCodeSubmit(),
      ProceduralAudio.generateSuccess(),
      ProceduralAudio.generateFailure(),
      ProceduralAudio.generateAchievement(),
      ProceduralAudio.generateElevator(),
      ProceduralAudio.generateDialogBlip(),
      ProceduralAudio.generateCipherGreeting(),
      ProceduralAudio.generateAmbientHum(),
      ProceduralAudio.generateCyberpunkBeat(),
    ]);
  }
}
