import type { Challenge, ChallengeProgress, CurriculumProgress, Chapter } from '@venomous-snake/shared-types';

export class ProgressionManager {
  private progress: CurriculumProgress;

  constructor(savedProgress?: CurriculumProgress) {
    this.progress = savedProgress ?? {
      challenges: {},
      currentChapter: 1,
      totalXp: 0,
      completedChallenges: 0,
      unlockedFloors: ['lobby'],
    };
  }

  isUnlocked(challenge: Challenge): boolean {
    return challenge.prerequisites.every((prereqId) => {
      const prereqProgress = this.progress.challenges[prereqId];
      return prereqProgress?.completed === true;
    });
  }

  markCompleted(challenge: Challenge, timeMs: number, hintsUsed: number, code: string): void {
    const existing = this.progress.challenges[challenge.id];
    const attempts = (existing?.attempts ?? 0) + 1;

    const bestTime = existing?.bestTime !== undefined
      ? Math.min(existing.bestTime, timeMs)
      : timeMs;

    this.progress.challenges[challenge.id] = {
      challengeId: challenge.id,
      completed: true,
      bestTime,
      attempts,
      hintsUsed: (existing?.hintsUsed ?? 0) + hintsUsed,
      completedAt: new Date().toISOString(),
      lastCode: code,
    };

    if (existing?.completed !== true) {
      this.progress.totalXp += challenge.xpReward;
      this.progress.completedChallenges += 1;
    }
  }

  recordAttempt(challengeId: string, code: string): void {
    const existing = this.progress.challenges[challengeId];
    this.progress.challenges[challengeId] = {
      challengeId,
      completed: existing?.completed ?? false,
      ...(existing?.bestTime !== undefined ? { bestTime: existing.bestTime } : {}),
      attempts: (existing?.attempts ?? 0) + 1,
      hintsUsed: existing?.hintsUsed ?? 0,
      ...(existing?.completedAt !== undefined ? { completedAt: existing.completedAt } : {}),
      ...(existing?.lastCode !== undefined ? { lastCode: code } : { lastCode: code }),
    };
  }

  getProgress(): CurriculumProgress {
    return { ...this.progress };
  }

  getChallengeProgress(challengeId: string): ChallengeProgress | undefined {
    return this.progress.challenges[challengeId];
  }

  getChapterCompletion(chapter: Chapter): { completed: number; total: number; percentage: number } {
    const total = chapter.challenges.length;
    const completed = chapter.challenges.filter(
      (id) => this.progress.challenges[id]?.completed === true,
    ).length;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  }

  unlockFloor(floorId: string): void {
    if (!this.progress.unlockedFloors.includes(floorId)) {
      this.progress.unlockedFloors.push(floorId);
    }
  }

  toJSON(): CurriculumProgress {
    return structuredClone(this.progress);
  }
}
