import type {
  EngineSnapshot,
  NarrativeSnapshot,
  ProgressSnapshot,
} from '@venomous-snake/shared-types';

export const SAVE_FORMAT_VERSION = 2;

export type PlayerGender = 'male' | 'female' | 'nonbinary';

/** Everything needed to resume a game exactly where it was left. */
export interface SaveData {
  version: typeof SAVE_FORMAT_VERSION;
  savedAt: string;
  playerName: string;
  playerGender: PlayerGender;
  playTimeMs: number;
  engine: EngineSnapshot;
  progress: ProgressSnapshot;
  narrative: NarrativeSnapshot;
  /** 0 (calm) to 3 (lockdown). */
  alertLevel: number;
  gameCompleted: boolean;
  /** Cutscene ids already shown, so they are not replayed after loading. */
  seenCutscenes: string[];
  /** New Game+ cycle; 0 for the first playthrough. */
  newGamePlus: number;
}

export interface SaveSlot {
  id: string;
  name: string;
  data: SaveData;
  createdAt: string;
  updatedAt: string;
  isAutoSave: boolean;
}

/** File format for exported saves. */
export interface SaveBundle {
  format: 'venomous-snake-saves';
  version: typeof SAVE_FORMAT_VERSION;
  exportedAt: string;
  saves: SaveSlot[];
  /** SHA-256 of `JSON.stringify(saves)`; detects truncated or corrupted files. */
  checksum: string;
}
