import { describe, it, expect } from 'vitest';
import { challengeMap } from '@venomous-snake/challenges';
import { SKILL_TREE, SkillTreeManager } from '../SkillTree';
import { HintEngine } from '../HintEngine';
import { XPSystem } from '../XPSystem';
import type { Challenge } from '@venomous-snake/shared-types';

describe('skill data', () => {
  it('requires existing challenges and skills', () => {
    const ids = new Set(SKILL_TREE.map((node) => node.id));
    for (const node of SKILL_TREE) {
      for (const required of node.requiredChallenges) {
        expect(challengeMap[required], `${node.id}: ${required}`).toBeDefined();
      }
      for (const prerequisite of node.prerequisites) {
        expect(ids.has(prerequisite), `${node.id}: ${prerequisite}`).toBe(true);
      }
    }
  });

  it('keeps every skill reachable', () => {
    const everything = Object.keys(challengeMap);
    const manager = new SkillTreeManager();
    for (let round = 0; round <= SKILL_TREE.length; round++) {
      for (const node of manager.getAvailableSkills(everything, Number.MAX_SAFE_INTEGER)) {
        manager.unlock(node.id);
      }
    }
    expect(manager.getUnlockedSkills()).toHaveLength(SKILL_TREE.length);
  });
});

describe('skill effects', () => {
  it('adds the speed bonus to quick solves only', () => {
    const xp = new XPSystem();
    expect(xp.calculateXPReward(100, 2, 1, 30_000, 0.1)).toBeGreaterThan(
      xp.calculateXPReward(100, 2, 1, 30_000),
    );
    expect(xp.calculateXPReward(100, 2, 1, 600_000, 0.1)).toBe(
      xp.calculateXPReward(100, 2, 1, 600_000),
    );
  });

  it('lets hints skip ahead a tier', () => {
    const challenge = {
      id: 'c',
      hints: [
        { tier: 1, text: 'one' },
        { tier: 2, text: 'two' },
        { tier: 3, text: 'three' },
      ],
    } as Challenge;
    const boosted = new HintEngine();
    boosted.setTierBoost(1);
    expect(boosted.getHint(challenge)?.hint).toBe('two');
    expect(boosted.getHint(challenge)?.hint).toBe('three');
    expect(new HintEngine().getHint(challenge)?.hint).toBe('one');
  });
});
