// @venomous-snake/shared-types
// Shared TypeScript type definitions used across all packages

export type Nullable<T> = T | null;
export type Maybe<T> = T | null | undefined;

export const SHARED_TYPES_VERSION = '0.1.0';

// ─── Dialog & Narrative ─────────────────────────────────────────────────────

/** Dialog content shown during NPC/narrative sequences */
export interface DialogContent {
  speaker: string;
  text: string;
  choices?: { text: string; id: string }[];
}

/** Last challenge submission result stored in the game state */
export interface ChallengeResultState {
  passed: boolean;
  output: string;
  error?: string;
}

// ─── Text Adventure: Room System ────────────────────────────────────────────

/** A connection from one room to another */
export interface RoomConnection {
  direction: string;
  targetRoomId: string;
  descriptionKey: string;
  locked: boolean;
  /** Challenge IDs that must be completed to unlock this connection */
  requiredChallenges?: string[];
  /** Item ID required to unlock this connection */
  requiredItem?: string;
}

/** A hackable terminal in a room */
export interface RoomTerminal {
  id: string;
  challengeId: string;
  nameKey: string;
  descriptionKey: string;
}

/** An NPC present in a room */
export interface RoomNPC {
  id: string;
  nameKey: string;
  descriptionKey: string;
  dialogId: string;
  /** Only visible after these flags are set */
  appearsWhen?: string[];
  /** Disappears after these flags are set */
  disappearsWhen?: string[];
}

/** An item that can be picked up in a room */
export interface RoomItem {
  id: string;
  nameKey: string;
  descriptionKey: string;
  itemType: string;
  /** Only visible after these flags are set */
  appearsWhen?: string[];
  /** Already picked up (tracked in state, not definition) */
}

/** A room in the text adventure world */
export interface Room {
  id: string;
  floor: number;
  nameKey: string;
  descriptionKey: string;
  /** Longer atmospheric text shown on first visit */
  firstVisitKey?: string;
  connections: RoomConnection[];
  npcs: RoomNPC[];
  items: RoomItem[];
  terminals: RoomTerminal[];
}

// ─── Text Adventure: Game State ─────────────────────────────────────────────

/** A single entry in the narrative log */
export interface NarrativeEntry {
  id: string;
  type: 'description' | 'dialog' | 'action' | 'system' | 'cipher' | 'error';
  text: string;
  speaker?: string;
  timestamp: number;
}

/** Available action the player can take */
export interface GameAction {
  id: string;
  type:
    | 'move'
    | 'examine'
    | 'talk'
    | 'hack'
    | 'pickup'
    | 'use_item'
    | 'look'
    | 'inventory'
    | 'help';
  label: string;
  targetId?: string;
  disabled?: boolean;
  disabledReason?: string;
}

/** Text adventure engine state */
export interface TextAdventureState {
  currentRoomId: string;
  visitedRooms: string[];
  pickedUpItems: string[];
  storyFlags: Record<string, boolean | number>;
  narrativeLog: NarrativeEntry[];
}

// ─── Event Bus ──────────────────────────────────────────────────────────────

/** Event bus event types for engine↔UI communication */
export type GameEvent =
  // Room/navigation events
  | { type: 'ROOM_ENTER'; payload: { roomId: string; firstVisit: boolean } }
  | { type: 'ROOM_TRANSITION'; payload: { from: string; to: string } }
  // NPC events
  | { type: 'DIALOG_START'; payload: { npcId: string; dialogId?: string } }
  | { type: 'DIALOG_END' }
  | { type: 'DIALOG_TRIGGERED'; payload: DialogContent }
  | { type: 'DIALOG_DISMISSED' }
  // Terminal/challenge events
  | { type: 'TERMINAL_OPEN'; payload: { terminalId: string; challengeId?: string } }
  | { type: 'TERMINAL_CLOSE' }
  | { type: 'CHALLENGE_STARTED'; payload: { challengeId: string; cipherIntro: string } }
  | { type: 'CHALLENGE_RESULT'; payload: ChallengeResultState & { xpEarned: number } }
  | { type: 'CHALLENGE_COMPLETED'; payload: { challengeId: string } }
  | { type: 'CHALLENGE_ABANDONED' }
  // Item events
  | {
      type: 'ITEM_PICKUP';
      payload: { itemId: string; name: string; description: string; itemType: string };
    }
  // Progression events
  | { type: 'XP_CHANGED'; payload: { xp: number; level: number } }
  | { type: 'ACHIEVEMENT_UNLOCKED'; payload: { id: string; nameKey: string } }
  | { type: 'FLOOR_UNLOCKED'; payload: { floor: number } }
  | { type: 'FLOOR_COMPLETE'; payload: { floorNumber: number } }
  | { type: 'FLOOR_CHANGE'; payload: { targetFloor: number } }
  | { type: 'FLOOR_ARRIVED'; payload: { floor: number } }
  // Game state events
  | { type: 'GAME_PAUSE' }
  | { type: 'GAME_RESUME' }
  | { type: 'SCENE_READY' }
  | { type: 'NARRATIVE_APPEND'; payload: NarrativeEntry }
  | { type: 'ACTIONS_UPDATE'; payload: GameAction[] }
  | { type: 'GAME_COMPLETE'; payload: { totalXp: number; totalTime: number } }
  | { type: 'ACCESS_DENIED'; payload: { objectId: string; message: string } };

/** Game overlay state - which UI panels are open */
export interface OverlayState {
  terminalOpen: boolean;
  dialogOpen: boolean;
  menuOpen: boolean;
  inventoryOpen: boolean;
  mapOpen: boolean;
}

/** Core game store state */
export interface GameStoreState {
  currentRoomId: string;
  overlay: OverlayState;

  // UI shell state
  gamePhase: 'menu' | 'playing' | 'paused';
  activePanel: 'none' | 'inventory' | 'questlog' | 'map' | 'settings';
  playerName: string;
  playerGender: 'male' | 'female' | 'nonbinary';
  xp: number;
  level: number;
  currentFloor: number;

  // Text adventure state
  visitedRooms: string[];
  pickedUpItems: string[];
  storyFlags: Record<string, boolean | number>;
  narrativeLog: NarrativeEntry[];
  availableActions: GameAction[];

  // Challenge state
  activeChallengeId: string | null;
  challengeResult: ChallengeResultState | null;
  completedChallenges: string[];
  unlockedFloors: number[];
  dialogActive: boolean;
  dialogContent: DialogContent | null;
  currentChallengeId: string | null;

  // Inventory
  inventory: string[];

  alertLevel: 0 | 1 | 2 | 3;

  // Game completion
  gameCompleted: boolean;

  // Audio settings
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  isMuted: boolean;

  // Actions
  setCurrentRoom: (roomId: string) => void;
  addVisitedRoom: (roomId: string) => void;
  setStoryFlag: (flag: string, value: boolean) => void;
  appendNarrative: (entry: NarrativeEntry) => void;
  clearNarrative: () => void;
  setAvailableActions: (actions: GameAction[]) => void;
  openTerminal: (terminalId: string, challengeId?: string) => void;
  closeTerminal: () => void;
  openDialog: (dialogId: string, npcId: string) => void;
  closeDialog: () => void;
  toggleMenu: () => void;
  toggleInventory: () => void;
  toggleMap: () => void;

  // UI shell actions
  setGamePhase: (phase: 'menu' | 'playing' | 'paused') => void;
  setActivePanel: (panel: 'none' | 'inventory' | 'questlog' | 'map' | 'settings') => void;
  setPlayerName: (name: string) => void;
  setPlayerGender: (gender: 'male' | 'female' | 'nonbinary') => void;
  addXp: (amount: number) => void;
  setLevel: (level: number) => void;
  setCurrentFloor: (floor: number) => void;

  // Challenge actions
  setActiveChallenge: (id: string | null) => void;
  setChallengeResult: (result: ChallengeResultState | null) => void;
  addCompletedChallenge: (id: string) => void;
  addPickedUpItem: (itemId: string) => void;
  unlockFloor: (n: number) => void;
  setDialog: (content: DialogContent) => void;
  clearDialog: () => void;
  resetGameState: () => void;

  // Inventory actions
  addToInventory: (itemId: string) => void;
  removeFromInventory: (itemId: string) => void;

  // Alert / stealth actions
  setAlertLevel: (level: 0 | 1 | 2 | 3) => void;
  incrementAlertLevel: () => void;

  // Game completion actions
  setGameCompleted: (completed: boolean) => void;

  // Audio actions
  setMasterVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  toggleMute: () => void;
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
