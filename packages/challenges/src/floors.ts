import { chapters } from './chapters';

/**
 * Canonical floor table. The tower has twelve floors numbered 0 to 11; floor `n`
 * hosts chapter `n + 1`. Every other module (rooms, UI, progression, achievements)
 * derives floor identity from here.
 */
export interface FloorDefinition {
  /** Zero-based floor number as used by the world and the HUD. */
  number: number;
  /** Stable string id: `lobby` for floor 0, otherwise `floor_<n>`. */
  id: string;
  chapterId: number;
  /** Challenge ids that must all be solved to clear the floor. */
  challengeIds: string[];
}

export function floorIdFromNumber(floorNumber: number): string {
  return floorNumber === 0 ? 'lobby' : `floor_${String(floorNumber)}`;
}

export function floorNumberFromId(floorId: string): number | undefined {
  if (floorId === 'lobby') return 0;
  const match = /^floor_(\d+)$/.exec(floorId);
  if (match?.[1] === undefined) return undefined;
  const n = parseInt(match[1], 10);
  return n >= 1 && n < chapters.length ? n : undefined;
}

export const FLOORS: FloorDefinition[] = chapters.map((chapter, index) => ({
  number: index,
  id: floorIdFromNumber(index),
  chapterId: chapter.id,
  challengeIds: [...chapter.challenges],
}));

export const FINAL_FLOOR_NUMBER = FLOORS.length - 1;

/** The challenge that ends the game. */
export const BOSS_CHALLENGE_ID: string = (() => {
  const last = chapters[chapters.length - 1];
  const boss = last?.bossChallenge;
  if (boss === undefined) throw new Error('The final chapter must define a bossChallenge');
  return boss;
})();

export function getFloor(floorNumber: number): FloorDefinition | undefined {
  return FLOORS[floorNumber];
}

export function getFloorForChallenge(challengeId: string): FloorDefinition | undefined {
  return FLOORS.find((floor) => floor.challengeIds.includes(challengeId));
}
