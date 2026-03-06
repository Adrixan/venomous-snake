import { describe, it, expect } from 'vitest';
import { XPSystem } from '../XPSystem';

describe('XPSystem', () => {
  const xp = new XPSystem();

  describe('getLevelForXP', () => {
    it('returns level 1 at 0 XP', () => {
      expect(xp.getLevelForXP(0).level).toBe(1);
    });

    it('returns level 1 just below the threshold for level 2', () => {
      expect(xp.getLevelForXP(99).level).toBe(1);
    });

    it('returns level 2 at exactly 100 XP', () => {
      expect(xp.getLevelForXP(100).level).toBe(2);
    });

    it('returns level 3 at exactly 300 XP', () => {
      expect(xp.getLevelForXP(300).level).toBe(3);
    });

    it('returns level 10 at max XP threshold (5500)', () => {
      expect(xp.getLevelForXP(5500).level).toBe(10);
    });
  });

  describe('getProgressToNextLevel', () => {
    it('calculates progress correctly between two levels', () => {
      // level 2 starts at 100, level 3 at 300 → gap = 200; at xp=150 we are 50 in
      const progress = xp.getProgressToNextLevel(150);
      expect(progress.current).toBe(50);
      expect(progress.needed).toBe(200);
      expect(progress.percentage).toBeCloseTo(25);
    });

    it('returns 100% at max level', () => {
      const progress = xp.getProgressToNextLevel(5500);
      expect(progress.percentage).toBe(100);
    });

    it('returns 0% at the exact start of a level', () => {
      const progress = xp.getProgressToNextLevel(100);
      expect(progress.current).toBe(0);
      expect(progress.percentage).toBe(0);
    });
  });

  describe('calculateXPReward', () => {
    it('applies first-try bonus (+50%)', () => {
      // attempts=1 (first try), hintsUsed=1, slow → multiplier = 1.0 + 0.5 = 1.5
      const reward = xp.calculateXPReward(100, 1, 1, 200_000);
      expect(reward).toBe(150);
    });

    it('applies no-hints bonus (+20%)', () => {
      // attempts=2 (no first-try), hintsUsed=0, slow → multiplier = 1.0 + 0.2 = 1.2
      const reward = xp.calculateXPReward(100, 2, 0, 200_000);
      expect(reward).toBe(120);
    });

    it('applies fast speed bonus (+30%) for under 60s', () => {
      // attempts=2, hints used, fast → multiplier = 1.0 + 0.3 = 1.3
      const reward = xp.calculateXPReward(100, 2, 1, 30_000);
      expect(reward).toBe(130);
    });

    it('applies medium speed bonus (+10%) for 60-120s', () => {
      // attempts=2, hints used, medium → multiplier = 1.0 + 0.1 = 1.1
      const reward = xp.calculateXPReward(100, 2, 1, 90_000);
      expect(reward).toBe(110);
    });

    it('reduces effective bonus with many attempts (no first-try bonus)', () => {
      // many attempts, hints used, slow → multiplier = 1.0
      const reward = xp.calculateXPReward(100, 5, 3, 200_000);
      expect(reward).toBe(100);
    });

    it('stacks all bonuses: first try + no hints + fast speed', () => {
      // attempts=1, hintsUsed=0, fast (<60s) → 1.0 + 0.5 + 0.2 + 0.3 = 2.0
      const reward = xp.calculateXPReward(100, 1, 0, 30_000);
      expect(reward).toBe(200);
    });
  });
});
