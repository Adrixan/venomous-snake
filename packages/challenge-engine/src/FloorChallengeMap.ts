import { FLOORS, floorIdFromNumber, floorNumberFromId } from '@venomous-snake/challenges';

/** Floor-to-challenge mapping and progression helpers, derived from the canonical floor table. */
export interface FloorConfig {
  floorNumber: number;
  id: string;
  name: string;
  chapterId: number;
  challengeIds: string[];
  /** Number of challenges that must be solved to clear the floor (all of them). */
  requiredCompletions: number;
}

export const floorConfigs: FloorConfig[] = FLOORS.map((floor) => ({
  floorNumber: floor.number,
  id: floor.id,
  name: `story.floors.${String(floor.number)}.name`,
  chapterId: floor.chapterId,
  challengeIds: floor.challengeIds,
  requiredCompletions: floor.challengeIds.length,
}));

/** Returns the FloorConfig for the given floor number, or undefined if not found. */
export function getFloorConfig(floorNumber: number): FloorConfig | undefined {
  return floorConfigs[floorNumber];
}

/** Returns the list of challenge IDs required on the given floor. */
export function getChallengesForFloor(floorNumber: number): string[] {
  return getFloorConfig(floorNumber)?.challengeIds ?? [];
}

/** Returns true when all required challenges on the floor are completed. */
export function isFloorComplete(floorNumber: number, completedChallenges: string[]): boolean {
  const config = getFloorConfig(floorNumber);
  if (config === undefined) return false;
  const completedSet = new Set(completedChallenges);
  const completedOnFloor = config.challengeIds.filter((id) => completedSet.has(id)).length;
  return completedOnFloor >= config.requiredCompletions;
}

/**
 * Returns the highest floor number the player can enter given the completed
 * challenges. Floor 0 is always open; every other floor needs the previous floor
 * cleared.
 */
export function getNextUnlockedFloor(completedChallenges: string[]): number {
  let maxUnlocked = 0;
  for (const config of floorConfigs) {
    if (config.floorNumber === 0) continue;
    if (!isFloorComplete(config.floorNumber - 1, completedChallenges)) break;
    maxUnlocked = config.floorNumber;
  }
  return maxUnlocked;
}

/** Returns completion statistics for a floor given completed challenges. */
export function getFloorProgress(
  floorNumber: number,
  completedChallenges: string[],
): { completed: number; total: number; percentage: number } {
  const config = getFloorConfig(floorNumber);
  if (config === undefined) return { completed: 0, total: 0, percentage: 0 };
  const completedSet = new Set(completedChallenges);
  const completed = config.challengeIds.filter((id) => completedSet.has(id)).length;
  const total = config.requiredCompletions;
  return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
}

/** Converts a floor ID string (e.g. 'lobby', 'floor_3') to a floor number (0 when unknown). */
export function getFloorNumberFromId(floorId: string): number {
  return floorNumberFromId(floorId) ?? 0;
}

/** Converts a floor number to its ID string (0 becomes 'lobby', 3 becomes 'floor_3'). */
export function getFloorIdFromNumber(floorNumber: number): string {
  return floorIdFromNumber(floorNumber);
}
