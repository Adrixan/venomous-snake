import { useState, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'vs-tutor-progress';

export interface TutorProgress {
  completedChallenges: string[];
  currentChapterId: number;
  currentChallengeId: string | null;
}

function loadProgress(): TutorProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        const p = parsed as Record<string, unknown>;
        return {
          completedChallenges: Array.isArray(p['completedChallenges'])
            ? (p['completedChallenges'] as string[])
            : [],
          currentChapterId: typeof p['currentChapterId'] === 'number' ? p['currentChapterId'] : 1,
          currentChallengeId:
            typeof p['currentChallengeId'] === 'string' ? p['currentChallengeId'] : null,
        };
      }
    }
  } catch {
    // ignore
  }
  return { completedChallenges: [], currentChapterId: 1, currentChallengeId: null };
}

function saveProgress(progress: TutorProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // ignore
  }
}

export interface UseTutorProgressReturn {
  progress: TutorProgress;
  isCompleted: (challengeId: string) => boolean;
  completeChallenge: (challengeId: string) => void;
  setCurrentChapter: (chapterId: number) => void;
  setCurrentChallenge: (challengeId: string | null) => void;
  resetProgress: () => void;
  completedCount: number;
}

export function useTutorProgress(): UseTutorProgressReturn {
  const [progress, setProgress] = useState<TutorProgress>(loadProgress);

  const isCompleted = useCallback(
    (challengeId: string): boolean => progress.completedChallenges.includes(challengeId),
    [progress.completedChallenges],
  );

  const completeChallenge = useCallback((challengeId: string): void => {
    setProgress((prev) => {
      if (prev.completedChallenges.includes(challengeId)) return prev;
      const next = {
        ...prev,
        completedChallenges: [...prev.completedChallenges, challengeId],
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const setCurrentChapter = useCallback((chapterId: number): void => {
    setProgress((prev) => {
      const next = { ...prev, currentChapterId: chapterId };
      saveProgress(next);
      return next;
    });
  }, []);

  const setCurrentChallenge = useCallback((challengeId: string | null): void => {
    setProgress((prev) => {
      const next = { ...prev, currentChallengeId: challengeId };
      saveProgress(next);
      return next;
    });
  }, []);

  const resetProgress = useCallback((): void => {
    const initial: TutorProgress = {
      completedChallenges: [],
      currentChapterId: 1,
      currentChallengeId: null,
    };
    saveProgress(initial);
    setProgress(initial);
  }, []);

  const completedCount = useMemo(
    () => progress.completedChallenges.length,
    [progress.completedChallenges],
  );

  return {
    progress,
    isCompleted,
    completeChallenge,
    setCurrentChapter,
    setCurrentChallenge,
    resetProgress,
    completedCount,
  };
}
