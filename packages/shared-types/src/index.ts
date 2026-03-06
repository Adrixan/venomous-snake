// @venomous-snake/shared-types
// Shared TypeScript type definitions used across all packages

export type Nullable<T> = T | null;
export type Maybe<T> = T | null | undefined;

export const SHARED_TYPES_VERSION = '0.0.1';

/** Event bus event types for Phaser↔React communication */
export type GameEvent =
  // Existing events — kept for backwards compatibility
  | { type: 'TERMINAL_OPEN'; payload: { terminalId: string } }
  | { type: 'TERMINAL_CLOSE' }
  | { type: 'DIALOG_OPEN'; payload: { dialogId: string; npcId: string } }
  | { type: 'DIALOG_CLOSE' }
  | { type: 'GAME_PAUSE' }
  | { type: 'GAME_RESUME' }
  | { type: 'PLAYER_MOVE'; payload: { x: number; y: number; direction: Direction } }
  | { type: 'SCENE_CHANGE'; payload: { sceneKey: string } }
  | { type: 'INTERACTION_PROMPT'; payload: { objectId: string; promptText: string } | null }
  // New events
  | { type: 'PLAYER_INTERACT'; payload: { objectId: string; objectType: string } }
  | { type: 'DIALOG_START'; payload: { npcId: string } }
  | { type: 'DIALOG_END' }
  | { type: 'ROOM_TRANSITION'; payload: { from: string; to: string } }
  | { type: 'ITEM_PICKUP'; payload: { itemId: string } }
  | { type: 'SCENE_READY' }
  | { type: 'OVERLAY_CHANGE'; payload: OverlayState };

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

// ─── Python Runtime Interfaces ──────────────────────────────────────────────

export interface PythonOutput {
  type: 'stdout' | 'stderr';
  text: string;
}

export interface PythonError {
  type: string;
  message: string;
  line?: number;
  column?: number;
  traceback?: string;
}

export interface ExecutionResult {
  success: boolean;
  output: PythonOutput[];
  error?: PythonError;
  executionTimeMs: number;
}

export type InterpreterStatus = 'uninitialized' | 'loading' | 'ready' | 'executing' | 'error';

export interface PythonInterpreter {
  initialize(): Promise<void>;
  isReady(): boolean;
  execute(code: string): Promise<ExecutionResult>;
  provideInput(value: string): void;
  onOutput(callback: (output: PythonOutput) => void): () => void;
  onInputRequest(callback: (prompt: string) => void): () => void;
  terminate(): Promise<void>;
  getVersion(): string;
}

// ─── Challenge Schema ────────────────────────────────────────────────────────

/** Scaffolding level for challenge difficulty */
export type ScaffoldingLevel = 'guided' | 'partial' | 'open';

/** Challenge difficulty rating */
export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';

/** Test case for validating student code */
export interface TestCase {
  id: string;
  description: string;
  input?: string;
  expectedOutput: string;
  hidden: boolean;
  expectsError?: string;
}

/** Hint definition with tiers */
export interface ChallengeHint {
  tier: 1 | 2 | 3;
  text: string;
}

/** Error pattern for procedural hint matching */
export interface ErrorPattern {
  errorType: string;
  pattern: string;
  hintText: string;
  category: string;
}

/** Editable region in scaffolded code */
export interface EditableRegion {
  startLine: number;
  endLine: number;
  placeholder?: string;
}

/** Challenge definition - the core data structure */
export interface Challenge {
  id: string;
  titleKey: string;
  descriptionKey: string;
  chapter: number;
  order: number;
  difficulty: Difficulty;
  scaffoldingLevel: ScaffoldingLevel;
  prerequisites: string[];
  xpReward: number;
  tags: string[];

  scaffoldedCode: string;
  editableRegions?: EditableRegion[];
  solutionCode: string;

  testCases: TestCase[];

  hints: ChallengeHint[];
  errorPatterns?: ErrorPattern[];

  roomId?: string;
  terminalId?: string;
  preDialogKey?: string;
  postDialogKey?: string;

  conceptsIntroduced: string[];
  conceptsReinforced: string[];
}

/** Chapter metadata */
export interface Chapter {
  id: number;
  titleKey: string;
  descriptionKey: string;
  floor: string;
  challenges: string[];
  bossChallenge?: string;
  conceptsCovered: string[];
}

/** Player's progress on a single challenge */
export interface ChallengeProgress {
  challengeId: string;
  completed: boolean;
  bestTime?: number;
  attempts: number;
  hintsUsed: number;
  completedAt?: string;
  lastCode?: string;
}

/** Overall curriculum progress */
export interface CurriculumProgress {
  challenges: Record<string, ChallengeProgress>;
  currentChapter: number;
  totalXp: number;
  completedChallenges: number;
  unlockedFloors: string[];
}
