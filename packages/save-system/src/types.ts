import type { CurriculumProgress } from '@venomous-snake/shared-types';
import type { NarrativeState } from '@venomous-snake/narrative';

export interface GameSettings {
  language: string;
  volumeMaster: number;
  volumeMusic: number;
  volumeSfx: number;
  fullscreen: boolean;
  reducedMotion: boolean;
}

export interface InventoryItem {
  id: string;
  type: 'tool' | 'keycard' | 'datafile';
  nameKey: string;
  descriptionKey: string;
  iconId: string;
}

export interface SaveData {
  version: string;
  timestamp: string;
  playerName: string;
  playerGender: 'male' | 'female' | 'nonbinary';
  currentFloor: string;
  currentRoom: string;
  playerPosition: { x: number; y: number };
  curriculumProgress: CurriculumProgress;
  narrativeState: NarrativeState;
  inventory: InventoryItem[];
  settings: GameSettings;
  playTimeMs: number;
  xp: number;
  level: number;
}

export interface SaveSlot {
  id: string;
  name: string;
  data: SaveData;
  createdAt: string;
  updatedAt: string;
  isAutoSave: boolean;
}
