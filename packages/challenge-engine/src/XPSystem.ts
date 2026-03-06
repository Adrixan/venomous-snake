export interface LevelThreshold {
  level: number;
  xpRequired: number;
  title: string;
  titleKey: string;
}

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { level: 1, xpRequired: 0, title: 'Recruit', titleKey: 'levels.1' },
  { level: 2, xpRequired: 100, title: 'Script Kiddie', titleKey: 'levels.2' },
  { level: 3, xpRequired: 300, title: 'Code Monkey', titleKey: 'levels.3' },
  { level: 4, xpRequired: 600, title: 'Junior Hacker', titleKey: 'levels.4' },
  { level: 5, xpRequired: 1000, title: 'Hacker', titleKey: 'levels.5' },
  { level: 6, xpRequired: 1500, title: 'Senior Hacker', titleKey: 'levels.6' },
  { level: 7, xpRequired: 2200, title: 'Elite Coder', titleKey: 'levels.7' },
  { level: 8, xpRequired: 3000, title: 'Cyber Ghost', titleKey: 'levels.8' },
  { level: 9, xpRequired: 4000, title: 'Master Operative', titleKey: 'levels.9' },
  { level: 10, xpRequired: 5500, title: 'Venomous Snake', titleKey: 'levels.10' },
];

/** Bonuses applied on top of base XP */
const BONUS_FIRST_TRY = 0.5;
const BONUS_NO_HINTS = 0.2;
const BONUS_SPEED_FAST = 0.3; // under 60 seconds
const BONUS_SPEED_OK = 0.1; // under 120 seconds

export class XPSystem {
  /** Returns the highest level threshold the player has reached. */
  getLevelForXP(xp: number): LevelThreshold {
    let result: LevelThreshold | undefined;
    for (const threshold of LEVEL_THRESHOLDS) {
      if (xp >= threshold.xpRequired) {
        result = threshold;
      }
    }
    if (result === undefined) {
      // xp < 0 edge-case: return lowest level
      const first = LEVEL_THRESHOLDS[0];
      if (first === undefined) throw new Error('LEVEL_THRESHOLDS must not be empty');
      return first;
    }
    return result;
  }

  /** Returns how far the player is between the current level and the next. */
  getProgressToNextLevel(xp: number): { current: number; needed: number; percentage: number } {
    const current = this.getLevelForXP(xp);
    const currentIndex = LEVEL_THRESHOLDS.indexOf(current);
    const next = LEVEL_THRESHOLDS[currentIndex + 1];

    if (next === undefined) {
      // Already at max level
      return { current: xp - current.xpRequired, needed: 0, percentage: 100 };
    }

    const xpIntoLevel = xp - current.xpRequired;
    const xpNeeded = next.xpRequired - current.xpRequired;
    return {
      current: xpIntoLevel,
      needed: xpNeeded,
      percentage: Math.min(100, Math.max(0, (xpIntoLevel / xpNeeded) * 100)),
    };
  }

  /**
   * Calculates the XP reward for completing a challenge, applying bonuses for
   * first-try completions, hint-free runs, and speed.
   */
  calculateXPReward(baseXP: number, attempts: number, hintsUsed: number, timeMs: number): number {
    let multiplier = 1.0;

    if (attempts === 1) multiplier += BONUS_FIRST_TRY;
    if (hintsUsed === 0) multiplier += BONUS_NO_HINTS;
    if (timeMs < 60_000) multiplier += BONUS_SPEED_FAST;
    else if (timeMs < 120_000) multiplier += BONUS_SPEED_OK;

    return Math.round(baseXP * multiplier);
  }
}
