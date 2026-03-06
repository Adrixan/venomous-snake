import { describe, it, expect } from 'vitest';
import { AchievementManager } from '../Achievements';

describe('AchievementManager', () => {
  it('unlocks a matching achievement on challenge_complete trigger', () => {
    const mgr = new AchievementManager();

    const unlocked = mgr.check({ type: 'challenge_complete', challengeId: 'ch01_01_hello_world' });

    expect(unlocked.some((a) => a.id === 'first_hack')).toBe(true);
  });

  it('unlocks chapter achievement on chapter_complete trigger', () => {
    const mgr = new AchievementManager();

    const unlocked = mgr.check({ type: 'chapter_complete', chapter: 1 });

    expect(unlocked.some((a) => a.id === 'chapter_1_done')).toBe(true);
  });

  it('unlocks XP milestone achievement on total_xp trigger', () => {
    const mgr = new AchievementManager();

    const unlocked = mgr.check({ type: 'total_xp', amount: 500 });

    expect(unlocked.some((a) => a.id === 'xp_rookie')).toBe(true);
  });

  it('does not include secret achievements in getUnlocked before they are triggered', () => {
    const mgr = new AchievementManager();

    const secretsBeforeTrigger = mgr.getUnlocked().filter((a) => a.secret);
    expect(secretsBeforeTrigger).toHaveLength(0);
  });

  it('includes secret achievements in getUnlocked after they are triggered', () => {
    const mgr = new AchievementManager();

    // 'perfectionist' is secret; triggered by total_challenges >= 10
    mgr.check({ type: 'total_challenges', count: 10 });

    const secretsAfterTrigger = mgr.getUnlocked().filter((a) => a.secret);
    expect(secretsAfterTrigger.length).toBeGreaterThan(0);
  });

  it('getAll always returns all achievements including secret ones', () => {
    const mgr = new AchievementManager();

    const all = mgr.getAll();
    const secrets = all.filter((a) => a.secret);

    expect(secrets.length).toBeGreaterThan(0);
  });

  it('does not re-unlock an already-unlocked achievement', () => {
    const mgr = new AchievementManager();

    const firstCheck = mgr.check({ type: 'challenge_complete', challengeId: 'ch01_01_hello_world' });
    expect(firstCheck.some((a) => a.id === 'first_hack')).toBe(true);

    const secondCheck = mgr.check({ type: 'challenge_complete', challengeId: 'ch01_01_hello_world' });
    expect(secondCheck.some((a) => a.id === 'first_hack')).toBe(false);
  });

  it('isUnlocked returns true only after the achievement has been triggered', () => {
    const mgr = new AchievementManager();

    expect(mgr.isUnlocked('xp_rookie')).toBe(false);
    mgr.check({ type: 'total_xp', amount: 500 });
    expect(mgr.isUnlocked('xp_rookie')).toBe(true);
  });

  it('restores previously-unlocked achievements from constructor argument', () => {
    const mgr = new AchievementManager(['first_hack', 'chapter_1_done']);

    expect(mgr.isUnlocked('first_hack')).toBe(true);
    expect(mgr.isUnlocked('chapter_1_done')).toBe(true);
    expect(mgr.isUnlocked('xp_rookie')).toBe(false);
  });
});
