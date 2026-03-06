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
   * Low-frequency drone — layered saws + sines with per-layer pitch LFO and
   * a slowly sweeping lowpass filter for organic movement.
   * Designed to loop seamlessly (6 s buffer).
   */
  static generateAmbientHum(): Promise<AudioBuffer | null> {
    return ProceduralAudio.render('ambient_hum', 6.0, (ctx) => {
      const dur = 6.0;

      // [type, freq, detuneBase, vol, lfoRate (Hz), lfoDepth (cents)]
      const layers: Array<[OscillatorType, number, number, number, number, number]> = [
        ['sawtooth', 40, -3, 0.09, 0.09, 5],
        ['sine', 55, 0, 0.13, 0.12, 4],
        ['sawtooth', 80, 4, 0.06, 0.07, 6],
        ['sine', 110, -6, 0.04, 0.14, 3],
      ];

      for (const [type, freq, detuneBase, vol, lfoRate, lfoDepth] of layers) {
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.value = freq;
        osc.detune.value = detuneBase;

        // Subtle pitch LFO — adds slow vibrato so the drone breathes
        const pitchLfo = ctx.createOscillator();
        pitchLfo.type = 'sine';
        pitchLfo.frequency.value = lfoRate;

        const pitchDepth = ctx.createGain();
        pitchDepth.gain.value = lfoDepth;

        pitchLfo.connect(pitchDepth);
        pitchDepth.connect(osc.detune);
        pitchLfo.start(0);
        pitchLfo.stop(dur);

        // Slowly sweeping lowpass — filter opens and closes over the loop
        const lpf = ctx.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.setValueAtTime(180, 0);
        lpf.frequency.linearRampToValueAtTime(440, dur * 0.55);
        lpf.frequency.linearRampToValueAtTime(200, dur);
        lpf.Q.value = 1.0;

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

      // Subtle noise under-layer with slowly sweeping filter
      const noiseLen = Math.ceil(SAMPLE_RATE * dur);
      const noiseBuf = ctx.createBuffer(1, noiseLen, SAMPLE_RATE);
      const noiseData = whiteNoise(noiseLen);
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = (noiseData[i] ?? 0) * 0.018;
      }
      noiseBuf.copyToChannel(noiseData, 0);

      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = noiseBuf;

      const noiseLpf = ctx.createBiquadFilter();
      noiseLpf.type = 'lowpass';
      noiseLpf.frequency.setValueAtTime(90, 0);
      noiseLpf.frequency.linearRampToValueAtTime(210, dur * 0.6);
      noiseLpf.frequency.linearRampToValueAtTime(100, dur);

      noiseSrc.connect(noiseLpf);
      noiseLpf.connect(ctx.destination);
      noiseSrc.start(0);
    });
  }

  /**
   * Cyberpunk noir background music — deep sub drone, sawtooth bass line,
   * soft kick, swung hi-hats, atmospheric pad and noise sweep accents.
   *
   * 16-second loopable buffer at 90 BPM (6 bars of 4/4).
   * Structure: bars 1-3 (section A) → bars 4-6 (section B with 8th-note fills).
   * Evokes Blade Runner / Deus Ex atmosphere.
   */
  static generateCyberpunkBeat(): Promise<AudioBuffer | null> {
    const dur = 16.0;
    const beatDur = 60 / 90; // ≈ 0.6667 s — 90 BPM
    const barDur = beatDur * 4; // ≈ 2.6667 s
    const sixteenth = beatDur / 4; // ≈ 0.1667 s
    const numBars = Math.round(dur / barDur); // 6
    const totalSixteenths = Math.round(dur / sixteenth); // 96

    return ProceduralAudio.render('cyberpunk_beat', dur, (ctx) => {
      // ── 1. Sub-bass pad — deep sine drone with slow amplitude modulation ──
      const subOsc = ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.value = 45; // ~A0 — deep sub-bass

      const amLfo = ctx.createOscillator();
      amLfo.type = 'sine';
      amLfo.frequency.value = 0.13; // ~7.7-second breathing cycle

      const amDepth = ctx.createGain();
      amDepth.gain.value = 0.03; // AM depth — gain swings ±0.03

      const subGain = ctx.createGain();
      subGain.gain.value = 0.07; // base gain, LFO adds to this

      amLfo.connect(amDepth);
      amDepth.connect(subGain.gain); // audio-rate amplitude modulation
      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(0);
      subOsc.stop(dur);
      amLfo.start(0);
      amLfo.stop(dur);

      // ── 2. Synthwave sawtooth bass line ────────────────────────────────────
      // Progression: Am → Em → Dm | Am (fills) → Em (fills) → Am (resolve)
      const bd = beatDur;
      const bassPattern: Array<[number, number, number]> = [
        // Bar 1 — Am
        [0 * bd, 55, 0.54],
        [1 * bd, 55, 0.5],
        [2 * bd, 65.41, 0.42],
        [3 * bd, 55, 0.52],
        // Bar 2 — Em
        [4 * bd, 82.41, 0.54],
        [5 * bd, 82.41, 0.5],
        [6 * bd, 98.0, 0.42],
        [7 * bd, 82.41, 0.52],
        // Bar 3 — Dm
        [8 * bd, 73.42, 0.54],
        [9 * bd, 73.42, 0.5],
        [10 * bd, 87.31, 0.42],
        [11 * bd, 73.42, 0.52],
        // Bar 4 — Am with 8th-note fills (section B)
        [12 * bd, 55, 0.52],
        [13 * bd, 65.41, 0.28],
        [13 * bd + bd / 2, 55, 0.28],
        [14 * bd, 73.42, 0.42],
        [15 * bd, 55, 0.52],
        // Bar 5 — Em with 8th-note fills
        [16 * bd, 82.41, 0.52],
        [17 * bd, 82.41, 0.28],
        [17 * bd + bd / 2, 98.0, 0.28],
        [18 * bd, 82.41, 0.42],
        [19 * bd, 82.41, 0.52],
        // Bar 6 — Am resolve
        [20 * bd, 55, 0.58],
        [21 * bd, 55, 0.52],
        [22 * bd, 65.41, 0.42],
        [23 * bd, 55, 0.6],
      ];

      for (const [start, freq, noteDur] of bassPattern) {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;

        const lpf = ctx.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.setValueAtTime(600, start);
        lpf.frequency.exponentialRampToValueAtTime(180, start + noteDur);
        lpf.Q.value = 1.5;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.2, start + 0.012);
        gain.gain.setValueAtTime(0.2, start + noteDur * 0.65);
        gain.gain.exponentialRampToValueAtTime(0.001, start + noteDur);

        osc.connect(lpf);
        lpf.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + noteDur + 0.01);
      }

      // ── 3. Kick drum — beats 1 & 3 every bar, with echo tail ──────────────
      for (let bar = 0; bar < numBars; bar++) {
        for (const beatInBar of [0, 2] as const) {
          const t = (bar * 4 + beatInBar) * beatDur;

          const kick = ctx.createOscillator();
          kick.type = 'sine';
          kick.frequency.setValueAtTime(100, t);
          kick.frequency.exponentialRampToValueAtTime(40, t + 0.14);

          const kickGain = ctx.createGain();
          kickGain.gain.setValueAtTime(0.5, t);
          kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

          kick.connect(kickGain);
          kickGain.connect(ctx.destination);
          kick.start(t);
          kick.stop(t + 0.3);

          // Reverb simulation — low-gain echo copy ~80 ms later
          const tEcho = t + 0.08;
          if (tEcho < dur - 0.02) {
            const kickEcho = ctx.createOscillator();
            kickEcho.type = 'sine';
            kickEcho.frequency.setValueAtTime(75, tEcho);
            kickEcho.frequency.exponentialRampToValueAtTime(35, tEcho + 0.1);

            const echoGain = ctx.createGain();
            echoGain.gain.setValueAtTime(0.13, tEcho);
            echoGain.gain.exponentialRampToValueAtTime(0.001, tEcho + 0.16);

            kickEcho.connect(echoGain);
            echoGain.connect(ctx.destination);
            kickEcho.start(tEcho);
            kickEcho.stop(tEcho + 0.16);
          }
        }
      }

      // ── 4. Hi-hat — every 16th note, velocity variation + swing ───────────
      // 8-step velocity pattern (accent / ghost / open / ghost…)
      const hhVelocities = [0.11, 0.04, 0.08, 0.03, 0.1, 0.04, 0.07, 0.03];
      const swing = 0.018; // delay odd 16ths for a loose, noir swing feel

      for (let s16 = 0; s16 < totalSixteenths; s16++) {
        const vel = hhVelocities[s16 % 8] ?? 0.05;
        const t = s16 * sixteenth + (s16 % 2 === 1 ? swing : 0);
        if (t >= dur - 0.005) continue;

        const hhDur = 0.032;
        const hhLen = Math.ceil(SAMPLE_RATE * hhDur);
        const hhBuf = ctx.createBuffer(1, hhLen, SAMPLE_RATE);
        hhBuf.copyToChannel(whiteNoise(hhLen), 0);

        const hhSrc = ctx.createBufferSource();
        hhSrc.buffer = hhBuf;

        const hhHpf = ctx.createBiquadFilter();
        hhHpf.type = 'highpass';
        hhHpf.frequency.value = 8500;

        const hhGain = ctx.createGain();
        hhGain.gain.setValueAtTime(vel, t);
        hhGain.gain.exponentialRampToValueAtTime(0.001, t + hhDur);

        hhSrc.connect(hhHpf);
        hhHpf.connect(hhGain);
        hhGain.connect(ctx.destination);
        hhSrc.start(t);
      }

      // ── 5. Atmospheric pad — two detuned sawtooths ~2 Hz apart ─────────────
      // Creates a slow chorus/phasing wash that fills the high-mid space.
      for (const oscFreq of [109, 111] as const) {
        const padOsc = ctx.createOscillator();
        padOsc.type = 'sawtooth';
        padOsc.frequency.value = oscFreq;

        const padLpf = ctx.createBiquadFilter();
        padLpf.type = 'lowpass';
        padLpf.frequency.value = 800;
        padLpf.Q.value = 0.8;

        const padGain = ctx.createGain();
        padGain.gain.setValueAtTime(0, 0);
        padGain.gain.linearRampToValueAtTime(0.08, 2.5);
        padGain.gain.setValueAtTime(0.08, dur - 1.5);
        padGain.gain.linearRampToValueAtTime(0, dur);

        padOsc.connect(padLpf);
        padLpf.connect(padGain);
        padGain.connect(ctx.destination);
        padOsc.start(0);
        padOsc.stop(dur);
      }

      // ── 6. Noise sweep accents — every 4 bars (bars 1 and 5) ──────────────
      // Bandpass sweeps from 200 → 2000 Hz over 0.5 s for tension.
      for (const accentT of [0, 4 * barDur] as const) {
        const sweepDur = 0.5;
        const noiseLen = Math.ceil(SAMPLE_RATE * sweepDur);
        const noiseBuf = ctx.createBuffer(1, noiseLen, SAMPLE_RATE);
        noiseBuf.copyToChannel(whiteNoise(noiseLen), 0);

        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = noiseBuf;

        const bpf = ctx.createBiquadFilter();
        bpf.type = 'bandpass';
        bpf.frequency.setValueAtTime(200, accentT);
        bpf.frequency.exponentialRampToValueAtTime(2000, accentT + sweepDur);
        bpf.Q.value = 2.5;

        const sweepGain = ctx.createGain();
        sweepGain.gain.setValueAtTime(0.07, accentT);
        sweepGain.gain.exponentialRampToValueAtTime(0.001, accentT + sweepDur);

        noiseSrc.connect(bpf);
        bpf.connect(sweepGain);
        sweepGain.connect(ctx.destination);
        noiseSrc.start(accentT);
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
