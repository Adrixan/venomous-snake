import type {
  ChallengeProgress,
  EngineSnapshot,
  NarrativeSnapshot,
  ProgressSnapshot,
} from '@venomous-snake/shared-types';
import { SAVE_FORMAT_VERSION } from './types';
import type { PlayerGender, SaveData, SaveSlot } from './types';

/** Raised when stored or imported data does not describe a valid save. */
export class InvalidSaveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidSaveError';
  }
}

type Json = Record<string, unknown>;

const MAX_NAME_LENGTH = 40;
const MAX_LIST = 2_000;
const ID_PATTERN = /^[A-Za-z0-9_-]{1,80}$/;

function isObject(value: unknown): value is Json {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function str(value: unknown, field: string, fallback?: string): string {
  if (typeof value === 'string') return value;
  if (fallback !== undefined) return fallback;
  throw new InvalidSaveError(`${field} must be a string`);
}

function num(value: unknown, field: string, fallback?: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (fallback !== undefined) return fallback;
  throw new InvalidSaveError(`${field} must be a number`);
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function idList(value: unknown, field: string): string[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > MAX_LIST) {
    throw new InvalidSaveError(`${field} must be a list`);
  }
  return value.filter((v): v is string => typeof v === 'string' && ID_PATTERN.test(v));
}

function flagRecord(value: unknown): Record<string, boolean | number | string> {
  const out: Record<string, boolean | number | string> = {};
  if (!isObject(value)) return out;
  for (const [key, raw] of Object.entries(value)) {
    if (!ID_PATTERN.test(key.replace(/^!/, ''))) continue;
    const v = isObject(raw) ? raw['value'] : raw;
    if (typeof v === 'boolean' || typeof v === 'number' || typeof v === 'string') out[key] = v;
  }
  return out;
}

function gender(value: unknown): PlayerGender {
  return value === 'male' || value === 'female' ? value : 'nonbinary';
}

function playerName(value: unknown): string {
  return str(value, 'playerName', 'Agent').slice(0, MAX_NAME_LENGTH);
}

function challengeRecord(value: unknown): Record<string, ChallengeProgress> {
  const out: Record<string, ChallengeProgress> = {};
  if (!isObject(value)) return out;
  for (const [id, raw] of Object.entries(value)) {
    if (!ID_PATTERN.test(id) || !isObject(raw)) continue;
    const entry: ChallengeProgress = {
      challengeId: id,
      completed: bool(raw['completed'], false),
      attempts: Math.max(0, Math.floor(num(raw['attempts'], 'attempts', 0))),
      hintsUsed: Math.max(0, Math.floor(num(raw['hintsUsed'], 'hintsUsed', 0))),
    };
    if (typeof raw['bestTime'] === 'number') entry.bestTime = raw['bestTime'];
    if (typeof raw['completedAt'] === 'string') entry.completedAt = raw['completedAt'];
    if (typeof raw['lastCode'] === 'string') entry.lastCode = raw['lastCode'].slice(0, 50_000);
    out[id] = entry;
  }
  return out;
}

function engineSnapshot(value: unknown): EngineSnapshot {
  if (!isObject(value)) throw new InvalidSaveError('engine state missing');
  return {
    currentRoomId: str(value['currentRoomId'], 'engine.currentRoomId', 'lobby_entrance'),
    visitedRooms: idList(value['visitedRooms'], 'engine.visitedRooms'),
    storyFlags: flagRecord(value['storyFlags']) as Record<string, boolean | number>,
    completedChallenges: idList(value['completedChallenges'], 'engine.completedChallenges'),
  };
}

function progressSnapshot(value: unknown): ProgressSnapshot {
  if (!isObject(value)) throw new InvalidSaveError('progress missing');
  return {
    challenges: challengeRecord(value['challenges']),
    totalXp: Math.max(0, num(value['totalXp'], 'progress.totalXp', 0)),
    spentSkillXp: Math.max(0, num(value['spentSkillXp'], 'progress.spentSkillXp', 0)),
    achievements: idList(value['achievements'], 'progress.achievements'),
    skills: idList(value['skills'], 'progress.skills'),
    inventory: idList(value['inventory'], 'progress.inventory'),
    streak: Math.max(0, Math.floor(num(value['streak'], 'progress.streak', 0))),
  };
}

function narrativeSnapshot(value: unknown): NarrativeSnapshot {
  if (!isObject(value)) return { flags: {}, completedDialogs: [] };
  return {
    flags: flagRecord(value['flags']),
    completedDialogs: idList(value['completedDialogs'], 'narrative.completedDialogs'),
  };
}

/** Converts the first save format (version '1.0.0') to the current one. */
function migrateV1(raw: Json): SaveData {
  const curriculum = isObject(raw['curriculumProgress']) ? raw['curriculumProgress'] : {};
  const challenges = challengeRecord(curriculum['challenges']);
  const completed = Object.values(challenges)
    .filter((c) => c.completed)
    .map((c) => c.challengeId);
  const legacyFlags = flagRecord(raw['storyFlags']);
  const storyFlags: Record<string, boolean | number> = {};
  for (const [key, value] of Object.entries(legacyFlags)) {
    const floor = /^floor_(\d{2})_arrived$/.exec(key);
    const name = floor?.[1] !== undefined ? `floor_${String(parseInt(floor[1], 10))}_arrived` : key;
    if (typeof value !== 'string') storyFlags[name] = value;
  }
  const xp = Math.max(0, num(raw['xp'], 'xp', 0));
  return {
    version: SAVE_FORMAT_VERSION,
    savedAt: str(raw['timestamp'], 'timestamp', new Date(0).toISOString()),
    playerName: playerName(raw['playerName']),
    playerGender: gender(raw['playerGender']),
    playTimeMs: Math.max(0, num(raw['playTimeMs'], 'playTimeMs', 0)),
    engine: {
      currentRoomId: str(raw['currentRoom'], 'currentRoom', 'lobby_entrance'),
      visitedRooms: idList(raw['visitedRooms'], 'visitedRooms'),
      storyFlags,
      completedChallenges: completed,
    },
    progress: {
      challenges,
      totalXp: xp,
      spentSkillXp: 0,
      achievements: [],
      skills: [],
      inventory: [],
      streak: 0,
    },
    narrative: narrativeSnapshot(raw['narrativeState']),
    alertLevel: 0,
    gameCompleted: bool(raw['gameCompleted'], false),
    seenCutscenes: completed.length > 0 ? ['intro'] : [],
    newGamePlus: 0,
  };
}

/**
 * Validates untrusted data (IndexedDB or an imported file) and returns a clean
 * SaveData in the current format. Unknown fields are dropped.
 */
export function parseSaveData(raw: unknown): SaveData {
  if (!isObject(raw)) throw new InvalidSaveError('save data must be an object');
  if (raw['version'] === '1.0.0') return migrateV1(raw);
  if (raw['version'] !== SAVE_FORMAT_VERSION) {
    throw new InvalidSaveError(`unsupported save version ${String(raw['version'])}`);
  }
  const alert = Math.floor(num(raw['alertLevel'], 'alertLevel', 0));
  return {
    version: SAVE_FORMAT_VERSION,
    savedAt: str(raw['savedAt'], 'savedAt', new Date(0).toISOString()),
    playerName: playerName(raw['playerName']),
    playerGender: gender(raw['playerGender']),
    playTimeMs: Math.max(0, num(raw['playTimeMs'], 'playTimeMs', 0)),
    engine: engineSnapshot(raw['engine']),
    progress: progressSnapshot(raw['progress']),
    narrative: narrativeSnapshot(raw['narrative']),
    alertLevel: Math.min(3, Math.max(0, alert)),
    gameCompleted: bool(raw['gameCompleted'], false),
    seenCutscenes: idList(raw['seenCutscenes'], 'seenCutscenes'),
    newGamePlus: Math.max(0, Math.floor(num(raw['newGamePlus'], 'newGamePlus', 0))),
  };
}

export function parseSaveSlot(raw: unknown): SaveSlot {
  if (!isObject(raw)) throw new InvalidSaveError('save slot must be an object');
  const id = str(raw['id'], 'id');
  if (!ID_PATTERN.test(id)) throw new InvalidSaveError('invalid save id');
  const now = new Date().toISOString();
  const parsedData = parseSaveData(raw['data']);
  return {
    id,
    name: str(raw['name'], 'name', 'Save').slice(0, 80),
    data: parsedData,
    createdAt: str(raw['createdAt'], 'createdAt', now),
    updatedAt: str(raw['updatedAt'], 'updatedAt', now),
    isAutoSave: bool(raw['isAutoSave'], false),
  };
}
