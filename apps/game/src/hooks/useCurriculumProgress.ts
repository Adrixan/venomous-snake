import { useMemo } from 'react';
import { chapters } from '@venomous-snake/challenges';
import type { CurriculumProgress, ChallengeProgress } from '@venomous-snake/shared-types';
import { useGameStore } from '../store/gameStore';

/**
 * Derives a CurriculumProgress object from live game store state.
 * Reactively updates whenever completedChallenges, xp, or currentFloor changes.
 */
export function useCurriculumProgress(): CurriculumProgress {
  const completedChallenges = useGameStore((state) => state.completedChallenges);
  const xp = useGameStore((state) => state.xp);
  const currentFloor = useGameStore((state) => state.currentFloor);

  return useMemo(() => {
    const challengeRecords: Record<string, ChallengeProgress> = {};
    for (const id of completedChallenges) {
      challengeRecords[id] = { challengeId: id, completed: true, attempts: 1, hintsUsed: 0 };
    }

    const currentChapterObj = chapters.find((ch) => ch.floor === currentFloor);
    const currentChapterId = currentChapterObj?.id ?? 1;

    // All chapters up to and including the current one are considered unlocked
    const currentChapterIndex = chapters.findIndex((ch) => ch.floor === currentFloor);
    const unlockedFloors =
      currentChapterIndex >= 0
        ? chapters.slice(0, currentChapterIndex + 1).map((ch) => ch.floor)
        : ['lobby'];

    return {
      challenges: challengeRecords,
      currentChapter: currentChapterId,
      totalXp: xp,
      completedChallenges: completedChallenges.length,
      unlockedFloors,
    };
  }, [completedChallenges, xp, currentFloor]);
}
