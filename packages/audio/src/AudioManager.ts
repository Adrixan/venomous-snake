import { Howl, Howler } from 'howler';

export type AudioCategory = 'music' | 'sfx' | 'ui' | 'ambient';

export interface AudioTrack {
  id: string;
  category: AudioCategory;
  src: string | string[];
  loop?: boolean;
  volume?: number;
  fadeInMs?: number;
  fadeOutMs?: number;
}

interface CategoryVolumes {
  music: number;
  sfx: number;
  ui: number;
  ambient: number;
}

export class AudioManager {
  private readonly howls = new Map<string, Howl>();
  private readonly tracks = new Map<string, AudioTrack>();

  private readonly volumes: CategoryVolumes = {
    music: 1,
    sfx: 1,
    ui: 1,
    ambient: 1,
  };

  private masterVolume = 1;
  private muted = false;

  private currentMusicId: string | null = null;
  private currentMusicHowl: Howl | null = null;

  constructor() {
    // Initialise Howler global volume
    Howler.volume(this.masterVolume);
  }

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  /**
   * Preload a batch of tracks. Missing audio files are handled gracefully —
   * a warning is logged but the promise still resolves so the game can continue.
   */
  preload(tracks: AudioTrack[]): Promise<void> {
    const promises = tracks.map((track) => {
      return new Promise<void>((resolve) => {
        const src = Array.isArray(track.src) ? track.src : [track.src];

        const howl = new Howl({
          src,
          loop: track.loop ?? false,
          volume: this.computeVolume(track.category, track.volume ?? 1),
          preload: true,
          onload: () => resolve(),
          onloaderror: (_id: number, err: unknown) => {
            console.warn(`[AudioManager] Failed to load "${track.id}":`, err);
            resolve(); // Graceful degradation — don't crash
          },
        });

        this.howls.set(track.id, howl);
        this.tracks.set(track.id, track);
      });
    });

    return Promise.all(promises).then(() => undefined);
  }

  // ---------------------------------------------------------------------------
  // Playback
  // ---------------------------------------------------------------------------

  play(trackId: string): void {
    const howl = this.howls.get(trackId);
    if (!howl) {
      console.warn(`[AudioManager] play — track not found: "${trackId}"`);
      return;
    }
    howl.play();
  }

  stop(trackId: string): void {
    this.howls.get(trackId)?.stop();
  }

  pause(trackId: string): void {
    this.howls.get(trackId)?.pause();
  }

  resume(trackId: string): void {
    // Howler resumes a paused sound via play()
    this.howls.get(trackId)?.play();
  }

  // ---------------------------------------------------------------------------
  // Music — crossfade between tracks
  // ---------------------------------------------------------------------------

  playMusic(trackId: string, fadeMs = 1000): void {
    if (this.currentMusicId === trackId) return;

    const nextHowl = this.howls.get(trackId);
    if (!nextHowl) {
      console.warn(`[AudioManager] playMusic — track not found: "${trackId}"`);
      return;
    }

    // Fade out the current music track
    if (this.currentMusicHowl) {
      const outgoing = this.currentMusicHowl;
      outgoing.fade(outgoing.volume(), 0, fadeMs);
      setTimeout(() => outgoing.stop(), fadeMs);
    }

    const track = this.tracks.get(trackId);
    const targetVol = this.computeVolume('music', track?.volume ?? 1);

    nextHowl.volume(0);
    nextHowl.play();
    nextHowl.fade(0, targetVol, fadeMs);

    this.currentMusicId = trackId;
    this.currentMusicHowl = nextHowl;
  }

  stopMusic(fadeMs = 1000): void {
    if (!this.currentMusicHowl) return;
    const outgoing = this.currentMusicHowl;
    outgoing.fade(outgoing.volume(), 0, fadeMs);
    setTimeout(() => outgoing.stop(), fadeMs);
    this.currentMusicId = null;
    this.currentMusicHowl = null;
  }

  // ---------------------------------------------------------------------------
  // Volume
  // ---------------------------------------------------------------------------

  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    Howler.volume(this.masterVolume);
  }

  getMasterVolume(): number {
    return this.masterVolume;
  }

  setCategoryVolume(category: AudioCategory, volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    this.volumes[category] = clamped;

    // Update all currently loaded howls in this category
    for (const [id, howl] of this.howls) {
      const track = this.tracks.get(id);
      if (track?.category === category) {
        howl.volume(this.computeVolume(category, track.volume ?? 1));
      }
    }
  }

  getCategoryVolume(category: AudioCategory): number {
    return this.volumes[category];
  }

  // ---------------------------------------------------------------------------
  // Mute
  // ---------------------------------------------------------------------------

  mute(): void {
    this.muted = true;
    Howler.mute(true);
  }

  unmute(): void {
    this.muted = false;
    Howler.mute(false);
  }

  isMuted(): boolean {
    return this.muted;
  }

  // ---------------------------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------------------------

  destroy(): void {
    for (const howl of this.howls.values()) {
      howl.unload();
    }
    this.howls.clear();
    this.tracks.clear();
    this.currentMusicId = null;
    this.currentMusicHowl = null;
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /** Effective per-howl volume = category volume × relative track volume. */
  private computeVolume(category: AudioCategory, relativeVolume: number): number {
    return this.volumes[category] * Math.max(0, Math.min(1, relativeVolume));
  }
}
