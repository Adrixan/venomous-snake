// @venomous-snake/shared-types
// Shared TypeScript type definitions used across all packages

export type Nullable<T> = T | null;
export type Maybe<T> = T | null | undefined;

export const SHARED_TYPES_VERSION = '0.0.1';

/** Event bus event types for Phaser↔React communication */
export type GameEvent =
  | { type: 'TERMINAL_OPEN'; payload: { terminalId: string } }
  | { type: 'TERMINAL_CLOSE' }
  | { type: 'DIALOG_OPEN'; payload: { dialogId: string; npcId: string } }
  | { type: 'DIALOG_CLOSE' }
  | { type: 'GAME_PAUSE' }
  | { type: 'GAME_RESUME' }
  | { type: 'PLAYER_MOVE'; payload: { x: number; y: number } }
  | { type: 'SCENE_CHANGE'; payload: { sceneKey: string } }
  | { type: 'INTERACTION_PROMPT'; payload: { objectId: string; promptText: string } | null };

/** Player facing direction */
export type Direction = 'up' | 'down' | 'left' | 'right';

/** Player state in the game world */
export interface PlayerState {
  x: number;
  y: number;
  direction: Direction;
  currentRoom: string;
}

/** Game overlay state - which UI panels are open */
export interface OverlayState {
  terminalOpen: boolean;
  dialogOpen: boolean;
  menuOpen: boolean;
  inventoryOpen: boolean;
  mapOpen: boolean;
  skillTreeOpen: boolean;
}

/** Core game store state */
export interface GameStoreState {
  player: PlayerState;
  overlay: OverlayState;
  isPaused: boolean;
  interactionPrompt: { objectId: string; promptText: string } | null;

  // Actions
  setPlayerPosition: (x: number, y: number) => void;
  setPlayerDirection: (direction: Direction) => void;
  setCurrentRoom: (room: string) => void;
  openTerminal: (terminalId: string) => void;
  closeTerminal: () => void;
  openDialog: (dialogId: string, npcId: string) => void;
  closeDialog: () => void;
  toggleMenu: () => void;
  toggleInventory: () => void;
  toggleMap: () => void;
  toggleSkillTree: () => void;
  setPaused: (paused: boolean) => void;
  setInteractionPrompt: (prompt: { objectId: string; promptText: string } | null) => void;
}
