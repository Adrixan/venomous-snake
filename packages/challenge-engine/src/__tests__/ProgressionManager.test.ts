import { describe, it, expect } from 'vitest';
import { ProgressionManager } from '../ProgressionManager';
import type { Challenge, Chapter } from '@venomous-snake/shared-types';

function makeChallenge(partial: Partial<Challenge> = {}): Challenge {
  return {
    id: 'test',
    titleKey: 'test.title',
    descriptionKey: 'test.desc',
    chapter: 1,
    order: 1,
    difficulty: 'beginner',
    scaffoldingLevel: 'guided',
    prerequisites: [],
    xpReward: 50,
    tags: [],
    scaffoldedCode: '',
    solutionCode: '',
    testCases: [],
    hints: [],
    conceptsIntroduced: [],
    conceptsReinforced: [],
    ...partial,
  };
}

function makeChapter(partial: Partial<Chapter> = {}): Chapter {
  return {
    id: 1,
    titleKey: 'ch1',
    descriptionKey: 'ch1.desc',
    floor: 'lobby',
    challenges: [],
    conceptsCovered: [],
    ...partial,
  };
}

describe('ProgressionManager', () => {
  it('isUnlocked returns true when challenge has no prerequisites', () => {
    const mgr = new ProgressionManager();
    const challenge = makeChallenge({ prerequisites: [] });

    expect(mgr.isUnlocked(challenge)).toBe(true);
  });

  it('isUnlocked returns true when all prerequisites are completed', () => {
    const mgr = new ProgressionManager();
    const prereq = makeChallenge({ id: 'prereq', xpReward: 30 });
    mgr.markCompleted(prereq, 1000, 0, 'print("hi")');

    const challenge = makeChallenge({ id: 'main', prerequisites: ['prereq'] });

    expect(mgr.isUnlocked(challenge)).toBe(true);
  });

  it('isUnlocked returns false when prerequisites are not completed', () => {
    const mgr = new ProgressionManager();
    const challenge = makeChallenge({ prerequisites: ['prereq1', 'prereq2'] });

    expect(mgr.isUnlocked(challenge)).toBe(false);
  });

  it('markCompleted adds XP and increments completedChallenges', () => {
    const mgr = new ProgressionManager();
    const challenge = makeChallenge({ id: 'c1', xpReward: 100 });

    mgr.markCompleted(challenge, 1000, 0, 'print("done")');

    const progress = mgr.getProgress();
    expect(progress.totalXp).toBe(100);
    expect(progress.completedChallenges).toBe(1);
    expect(progress.challenges['c1']!.completed).toBe(true);
  });

  it('markCompleted does not double-count XP on second call', () => {
    const mgr = new ProgressionManager();
    const challenge = makeChallenge({ id: 'c1', xpReward: 100 });

    mgr.markCompleted(challenge, 1000, 0, 'first attempt');
    mgr.markCompleted(challenge, 500, 0, 'second attempt');

    const progress = mgr.getProgress();
    expect(progress.totalXp).toBe(100);
    expect(progress.completedChallenges).toBe(1);
  });

  it('recordAttempt increments the attempt counter', () => {
    const mgr = new ProgressionManager();

    mgr.recordAttempt('c1', 'code1');
    mgr.recordAttempt('c1', 'code2');

    const cp = mgr.getChallengeProgress('c1');
    expect(cp?.attempts).toBe(2);
  });

  it('getChapterCompletion returns correct percentage', () => {
    const mgr = new ProgressionManager();
    const c1 = makeChallenge({ id: 'c1', xpReward: 50 });
    mgr.markCompleted(c1, 1000, 0, '');

    const chapter = makeChapter({ challenges: ['c1', 'c2'] });

    const result = mgr.getChapterCompletion(chapter);
    expect(result.completed).toBe(1);
    expect(result.total).toBe(2);
    expect(result.percentage).toBe(50);
  });

  it('getChapterCompletion returns 0% when chapter is empty', () => {
    const mgr = new ProgressionManager();
    const chapter = makeChapter({ challenges: [] });

    const result = mgr.getChapterCompletion(chapter);
    expect(result.percentage).toBe(0);
  });

  it('unlockFloor adds the floor to unlockedFloors', () => {
    const mgr = new ProgressionManager();

    mgr.unlockFloor('floor_2');

    expect(mgr.getProgress().unlockedFloors).toContain('floor_2');
  });

  it('unlockFloor does not duplicate an already-unlocked floor', () => {
    const mgr = new ProgressionManager();

    mgr.unlockFloor('floor_2');
    mgr.unlockFloor('floor_2');

    const floors = mgr.getProgress().unlockedFloors.filter((f) => f === 'floor_2');
    expect(floors).toHaveLength(1);
  });
});
