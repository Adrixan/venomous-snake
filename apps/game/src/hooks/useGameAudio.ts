import { useEffect, useRef, useCallback } from 'react';
import { ProceduralAudio } from '@venomous-snake/audio';
import { EventBus } from '@venomous-snake/engine';
import { useReducedMotion } from '@venomous-snake/ui';
import { useGameStore } from '../store/gameStore';

const FOOTSTEP_THROTTLE_MS = 300;

/**
 * Wires the audio system to EventBus game events.
 * Must be rendered inside a React tree that has access to the game store.
 * Web Audio is initialised on the first user interaction.
 */
export function useGameAudio(): void {
  const masterVolume = useGameStore((s) => s.masterVolume);
  const musicVolume = useGameStore((s) => s.musicVolume);
  const sfxVolume = useGameStore((s) => s.sfxVolume);
  const isMuted = useGameStore((s) => s.isMuted);
  const gamePhase = useGameStore((s) => s.gamePhase);

  const reducedMotion = useReducedMotion();

  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const initializedRef = useRef(false);
  const lastFootstepRef = useRef(0);

  // ---------------------------------------------------------------------------
  // AudioContext accessor — lazy, browser-only
  // ---------------------------------------------------------------------------

  const getCtx = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    if (audioCtxRef.current === null) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  // ---------------------------------------------------------------------------
  // Play a one-shot buffer
  // ---------------------------------------------------------------------------

  const playBuffer = useCallback(
    (buffer: AudioBuffer, categoryVolume: number): void => {
      const ctx = getCtx();
      if (ctx === null || isMuted) return;

      const src = ctx.createBufferSource();
      src.buffer = buffer;

      const gain = ctx.createGain();
      gain.gain.value = masterVolume * categoryVolume;

      src.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    },
    [getCtx, isMuted, masterVolume],
  );

  // ---------------------------------------------------------------------------
  // Ambient looping helpers
  // ---------------------------------------------------------------------------

  const stopAmbient = useCallback((): void => {
    const src = ambientSourceRef.current;
    if (src !== null) {
      try {
        src.stop();
      } catch {
        // already stopped
      }
      src.disconnect();
      ambientSourceRef.current = null;
    }
    const gain = ambientGainRef.current;
    if (gain !== null) {
      gain.disconnect();
      ambientGainRef.current = null;
    }
  }, []);

  const startAmbient = useCallback(
    async (type: 'hum' | 'beat' = 'hum'): Promise<void> => {
      const ctx = getCtx();
      if (ctx === null) return;

      stopAmbient();

      if (isMuted) return;

      const buffer =
        type === 'beat'
          ? await ProceduralAudio.generateCyberpunkBeat()
          : await ProceduralAudio.generateAmbientHum();

      if (buffer === null) return;

      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;

      const gain = ctx.createGain();
      gain.gain.value = masterVolume * musicVolume * 0.55;

      src.connect(gain);
      gain.connect(ctx.destination);
      src.start();

      ambientSourceRef.current = src;
      ambientGainRef.current = gain;
    },
    [getCtx, isMuted, masterVolume, musicVolume, stopAmbient],
  );

  // ---------------------------------------------------------------------------
  // Initialise on first user gesture (Web Audio API requirement)
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const init = async (): Promise<void> => {
      if (initializedRef.current) return;
      initializedRef.current = true;

      const ctx = getCtx();
      if (ctx === null) return;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      await ProceduralAudio.preloadAll();
    };

    const handleGesture = (): void => {
      void init();
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };

    window.addEventListener('click', handleGesture);
    window.addEventListener('keydown', handleGesture);
    window.addEventListener('touchstart', handleGesture);

    return (): void => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
  }, [getCtx]);

  // ---------------------------------------------------------------------------
  // GamePhase → ambient music
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (gamePhase === 'playing') {
      void startAmbient('hum');
    } else if (gamePhase === 'paused') {
      const gain = ambientGainRef.current;
      const ctx = audioCtxRef.current;
      if (gain !== null && ctx !== null) {
        gain.gain.setTargetAtTime(masterVolume * musicVolume * 0.12, ctx.currentTime, 0.2);
      }
    } else {
      stopAmbient();
    }
  }, [gamePhase, startAmbient, stopAmbient, masterVolume, musicVolume]);

  // ---------------------------------------------------------------------------
  // Live volume/mute updates for ambient
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const gain = ambientGainRef.current;
    const ctx = audioCtxRef.current;
    if (gain === null || ctx === null) return;
    const targetVol = isMuted ? 0 : masterVolume * musicVolume * 0.55;
    gain.gain.setTargetAtTime(targetVol, ctx.currentTime, 0.1);
  }, [masterVolume, musicVolume, isMuted]);

  // ---------------------------------------------------------------------------
  // EventBus subscriptions
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const unsub = EventBus.on((event): void => {
      switch (event.type) {
        case 'PLAYER_MOVE': {
          if (reducedMotion) break;
          const now = Date.now();
          if (now - lastFootstepRef.current < FOOTSTEP_THROTTLE_MS) break;
          lastFootstepRef.current = now;
          void ProceduralAudio.generateFootstep().then((buf) => {
            if (buf !== null) playBuffer(buf, sfxVolume);
          });
          break;
        }

        case 'TERMINAL_OPEN': {
          void ProceduralAudio.generateTerminalOpen().then((buf) => {
            if (buf !== null) playBuffer(buf, sfxVolume);
          });
          break;
        }

        case 'TERMINAL_CLOSE': {
          void ProceduralAudio.generateTerminalClose().then((buf) => {
            if (buf !== null) playBuffer(buf, sfxVolume);
          });
          break;
        }

        case 'CHALLENGE_STARTED': {
          void ProceduralAudio.generateCipherGreeting().then((buf) => {
            if (buf !== null) playBuffer(buf, sfxVolume);
          });
          break;
        }

        case 'CHALLENGE_RESULT': {
          if (event.payload.passed) {
            void ProceduralAudio.generateCodeSubmit().then((buf) => {
              if (buf !== null) playBuffer(buf, sfxVolume);
            });
          } else {
            void ProceduralAudio.generateFailure().then((buf) => {
              if (buf !== null) playBuffer(buf, sfxVolume);
            });
          }
          break;
        }

        case 'CHALLENGE_COMPLETED': {
          void ProceduralAudio.generateSuccess().then((buf) => {
            if (buf !== null) playBuffer(buf, sfxVolume);
          });
          break;
        }

        case 'DIALOG_START':
        case 'DIALOG_TRIGGERED': {
          void ProceduralAudio.generateDialogBlip().then((buf) => {
            if (buf !== null) playBuffer(buf, sfxVolume * 0.6);
          });
          break;
        }

        case 'ACHIEVEMENT_UNLOCKED': {
          void ProceduralAudio.generateAchievement().then((buf) => {
            if (buf !== null) playBuffer(buf, sfxVolume);
          });
          break;
        }

        case 'ROOM_TRANSITION':
        case 'SCENE_CHANGE': {
          void ProceduralAudio.generateElevator().then((buf) => {
            if (buf !== null) playBuffer(buf, sfxVolume * 0.8);
          });

          // Switch ambient style depending on destination
          const dest = event.type === 'ROOM_TRANSITION' ? event.payload.to : event.payload.sceneKey;
          const beatFloors = ['server_room', 'boss', 'executive'];
          const nextType = beatFloors.some((f) => dest.toLowerCase().includes(f)) ? 'beat' : 'hum';
          void startAmbient(nextType);
          break;
        }

        default:
          break;
      }
    });

    return unsub;
  }, [playBuffer, sfxVolume, reducedMotion, startAmbient]);

  // ---------------------------------------------------------------------------
  // Cleanup on unmount
  // ---------------------------------------------------------------------------

  useEffect(() => {
    return (): void => {
      stopAmbient();
      const ctx = audioCtxRef.current;
      if (ctx !== null) {
        void ctx.close();
        audioCtxRef.current = null;
      }
    };
  }, [stopAmbient]);
}
