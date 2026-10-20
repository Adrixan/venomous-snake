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
  portraitId?: string;
  /** Only visible after these flags are set */
  appearsWhen?: string[];
  /** Disappears after these flags are set */
  disappearsWhen?: string[];
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
  terminals: RoomTerminal[];
}

// ─── Text Adventure: Game State ─────────────────────────────────────────────

/**
 * Interpolation values for a translation key. A parameter whose name ends in
 * `Key` holds another translation key and is translated before interpolation
 * (the value is substituted under the name without the suffix).
 */
export type TextParams = Record<string, string | number>;

/** A single entry in the narrative log */
export interface NarrativeEntry {
  id: string;
  type: 'description' | 'dialog' | 'action' | 'system' | 'cipher' | 'error';
  /** Fallback text, used when no `textKey` is set. */
  text: string;
  /** Translation key (`namespace.path.to.key`), resolved at render time. */
  textKey?: string;
  textParams?: TextParams;
  speaker?: string;
  timestamp: number;
}

/** Available action the player can take */
export interface GameAction {
  id: string;
  type: 'move' | 'examine' | 'talk' | 'hack' | 'look' | 'help';
  /** Fallback label, used when no `labelKey` is set. */
  label: string;
  labelKey?: string;
  labelParams?: TextParams;
  targetId?: string;
  disabled?: boolean;
  disabledReason?: string;
  disabledReasonKey?: string;
  disabledReasonParams?: TextParams;
}

/** Text adventure engine state */
export interface TextAdventureState {
  currentRoomId: string;
  visitedRooms: string[];
  storyFlags: Record<string, boolean | number>;
  narrativeLog: NarrativeEntry[];
}

/** Progression state owned by the game controller. */
export interface ProgressSnapshot {
  challenges: Record<string, ChallengeProgress>;
  /** XP earned in total; never decreases. Level is derived from it. */
  totalXp: number;
  /** XP spent on skills; spendable XP is `totalXp - spentSkillXp`. */
  spentSkillXp: number;
  achievements: string[];
  skills: string[];
  inventory: string[];
  /** Consecutive challenges solved on the first attempt. */
  streak: number;
}

/** Dialog memory: flags set by conversations and the dialogs already finished. */
export interface NarrativeSnapshot {
  flags: Record<string, boolean | string | number>;
  completedDialogs: string[];
}

/** Compatibility view used by the curriculum panels and progression manager. */
export interface CurriculumProgress {
  challenges: Record<string, ChallengeProgress>;
  currentChapter: number;
  totalXp: number;
  completedChallenges: number;
  unlockedFloors: string[];
}

export interface OverlayState {
  terminalOpen: boolean;
  dialogOpen: boolean;
  menuOpen: boolean;
  mapOpen: boolean;
}

/** Zustand read model and its UI actions. */
export interface GameStoreState {
  currentRoomId: string;
  overlay: OverlayState;
  gamePhase: 'menu' | 'playing' | 'paused';
  activePanel: 'none' | 'questlog' | 'map' | 'settings';
  playerName: string;
  playerGender: 'male' | 'female' | 'nonbinary';
  xp: number;
  level: number;
  currentFloor: number;
  visitedRooms: string[];
  storyFlags: Record<string, boolean | number>;
  narrativeLog: NarrativeEntry[];
  availableActions: GameAction[];
  activeChallengeId: string | null;
  currentChallengeId: string | null;
  challengeResult: ChallengeResultState | null;
  completedChallenges: string[];
  unlockedFloors: number[];
  dialogActive: boolean;
  dialogContent: DialogContent | null;
  alertLevel: 0 | 1 | 2 | 3;
  gameCompleted: boolean;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  isMuted: boolean;
  setCurrentRoom: (roomId: string) => void;
  addVisitedRoom: (roomId: string) => void;
  setStoryFlag: (flag: string, value: boolean | number) => void;
  appendNarrative: (entry: NarrativeEntry) => void;
  clearNarrative: () => void;
  setAvailableActions: (actions: GameAction[]) => void;
  openTerminal: (terminalId: string, challengeId?: string) => void;
  closeTerminal: () => void;
  openDialog: (dialogId: string, npcId: string) => void;
  closeDialog: () => void;
  toggleMenu: () => void;
  toggleMap: () => void;
  setGamePhase: (phase: 'menu' | 'playing' | 'paused') => void;
  setActivePanel: (panel: 'none' | 'questlog' | 'map' | 'settings') => void;
  setPlayerName: (name: string) => void;
  setPlayerGender: (gender: 'male' | 'female' | 'nonbinary') => void;
  addXp: (amount: number) => void;
  setLevel: (level: number) => void;
  setCurrentFloor: (floor: number) => void;
  setActiveChallenge: (id: string | null) => void;
  setChallengeResult: (result: ChallengeResultState | null) => void;
  addCompletedChallenge: (id: string) => void;
  unlockFloor: (n: number) => void;
  setDialog: (content: DialogContent) => void;
  clearDialog: () => void;
  resetGameState: () => void;
  setAlertLevel: (level: 0 | 1 | 2 | 3) => void;
  incrementAlertLevel: () => void;
  setGameCompleted: (completed: boolean) => void;
  setMasterVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  toggleMute: () => void;
}

/** The persistent part of the text adventure, restored when a game is loaded. */
export interface EngineSnapshot {
  currentRoomId: string;
  visitedRooms: string[];
  storyFlags: Record<string, boolean | number>;
  completedChallenges: string[];
}

// ─── Event Bus ──────────────────────────────────────────────────────────────

/**
 * Domain events for presentation concerns (audio, cutscenes, toasts, overlays).
 * Game state itself lives in the session and is published to the UI store;
 * listeners must not mutate game state in response to these events.
 */
export type GameEvent =
  // Room/navigation events
  | { type: 'ROOM_ENTER'; payload: { roomId: string; firstVisit: boolean } }
  | { type: 'ROOM_TRANSITION'; payload: { from: string; to: string } }
  | { type: 'FLOOR_ARRIVED'; payload: { floor: number } }
  | { type: 'ACCESS_DENIED'; payload: { objectId: string; message: string } }
  // NPC events
  | { type: 'DIALOG_START'; payload: { npcId: string; dialogId: string } }
  | { type: 'DIALOG_END'; payload: { dialogId: string } }
  // Terminal/challenge events
  | { type: 'TERMINAL_OPEN'; payload: { terminalId: string; challengeId: string } }
  | { type: 'TERMINAL_CLOSE' }
  | { type: 'CHALLENGE_FAILED'; payload: { challengeId: string; attempts: number } }
  | { type: 'CHALLENGE_STARTED'; payload: { challengeId: string; cipherIntro: string } }
  | { type: 'CHALLENGE_RESULT'; payload: ChallengeResultState & { xpEarned: number } }
  | { type: 'CHALLENGE_ABANDONED' }
  | { type: 'XP_CHANGED'; payload: { xp: number; level: number } }
  | { type: 'FLOOR_CHANGE'; payload: { targetFloor: number } }
  | { type: 'DIALOG_TRIGGERED'; payload: DialogContent }
  | { type: 'DIALOG_DISMISSED' }
  | { type: 'CHALLENGE_COMPLETED'; payload: { challengeId: string; xpEarned: number } }
  // Progression events
  | { type: 'LEVEL_UP'; payload: { level: number; titleKey: string } }
  | { type: 'ACHIEVEMENT_UNLOCKED'; payload: { id: string; nameKey?: string } }
  | { type: 'ITEM_ACQUIRED'; payload: { itemId: string; firstTime: boolean } }
  | { type: 'SKILL_UNLOCKED'; payload: { skillId: string } }
  | { type: 'FLOOR_COMPLETE'; payload: { floor: number } }
  | { type: 'FLOOR_UNLOCKED'; payload: { floor: number } }
  | { type: 'ALERT_CHANGED'; payload: { level: number } }
  | { type: 'LOCKDOWN' }
  | { type: 'GAME_COMPLETE' };

// ─── Settings & Inventory ───────────────────────────────────────────────────

export type TextSpeed = 'instant' | 'fast' | 'normal';

/** Per-device player preferences (stored outside save games). */
export interface GameSettings {
  language: string;
  /** 0..1 */
  volumeMaster: number;
  volumeMusic: number;
  volumeSfx: number;
  muted: boolean;
  fullscreen: boolean;
  reducedMotion: boolean;
  textSpeed: TextSpeed;
  keyboardLayout: 'qwerty' | 'qwertz';
  useNativeKeyboard: boolean;
  keyboardSize: 'small' | 'medium' | 'large';
  showDesktopKeyboard: boolean;
}

export interface InventoryItem {
  id: string;
  type: 'tool' | 'keycard' | 'datafile';
  /** Translation key (`namespace.path`). */
  nameKey: string;
  descriptionKey: string;
  iconId: string;
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
  /** True when the run was aborted because it exceeded the time limit. */
  timedOut?: boolean;
}

/** Per-run options for {@link PythonInterpreter.execute}. */
export interface ExecuteOptions {
  /** Lines returned by successive `input()` calls. */
  inputs?: string[];
  /**
   * When `true` and the program asks for input beyond `inputs`, the run pauses and
   * `onInputRequest` fires. When `false` (graded runs) it raises `EOFError`, like a
   * real program reading an empty stdin.
   */
  interactive?: boolean;
  /** Write `input()` prompts (and the typed answer) to stdout, like a real terminal. */
  echoPrompts?: boolean;
  /** Override the default time limit for this run. */
  timeoutMs?: number;
}

export type InterpreterStatus = 'uninitialized' | 'loading' | 'ready' | 'executing' | 'error';

export interface PythonInterpreter {
  initialize(): Promise<void>;
  isReady(): boolean;
  execute(code: string, options?: ExecuteOptions): Promise<ExecutionResult>;
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
  /** Optional setup code prepended before student code (e.g. variable overrides) */
  setup?: string;
  /** Optional code appended after the student code (e.g. a call with different arguments). */
  append?: string;
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
