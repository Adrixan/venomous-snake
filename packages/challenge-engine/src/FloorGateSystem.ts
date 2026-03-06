import { floorConfigs, isFloorComplete, getFloorConfig } from './FloorChallengeMap';

export interface FloorGateResult {
  /** The floor whose challenges were all just completed. */
  completedFloorNumber: number;
  /** The floor that should now be unlocked (null if already at the last floor). */
  nextFloorUnlocked: number | null;
}

/**
 * Pure-logic service that decides whether completing a challenge triggers a
 * floor unlock.  Has no side-effects: callers are responsible for emitting
 * events and updating persistent state.
 */
export class FloorGateSystem {
  /**
   * Call this after a challenge is successfully completed.
   * Returns a FloorGateResult when the floor becomes complete, or null
   * when the floor still has unfinished challenges.
   */
  checkFloorCompletion(
    completedChallengeId: string,
    allCompletedChallenges: string[],
  ): FloorGateResult | null {
    const floorConfig = floorConfigs.find((cfg) => cfg.challengeIds.includes(completedChallengeId));
    if (floorConfig === undefined) return null;

    if (!isFloorComplete(floorConfig.floorNumber, allCompletedChallenges)) return null;

    const nextFloorNumber = floorConfig.floorNumber + 1;
    const nextExists = getFloorConfig(nextFloorNumber) !== undefined;

    return {
      completedFloorNumber: floorConfig.floorNumber,
      nextFloorUnlocked: nextExists ? nextFloorNumber : null,
    };
  }

  /**
   * Returns true when the player has unlocked the given floor.
   * Floor 0 is always unlocked; every other floor requires the previous
   * floor to be complete.
   */
  isFloorUnlocked(floorNumber: number, completedChallenges: string[]): boolean {
    if (floorNumber === 0) return true;
    return isFloorComplete(floorNumber - 1, completedChallenges);
  }
}
