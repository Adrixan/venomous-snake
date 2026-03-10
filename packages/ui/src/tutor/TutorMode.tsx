import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Chapter, Challenge } from '@venomous-snake/shared-types';
import { challengeMap, chapters } from '@venomous-snake/challenges';
import { HackingTerminal } from '../terminal/HackingTerminal';
import { useTutorProgress } from './useTutorProgress';
import './tutor.css';

/** Convert keys like "chapters.ch01.title" to "chapters:ch01.title" for i18next namespace resolution */
function nsKey(key: string): string {
  const dot = key.indexOf('.');
  if (dot === -1) return key;
  return key.substring(0, dot) + ':' + key.substring(dot + 1);
}

export interface TutorModeProps {
  onBack: () => void;
}

export function TutorMode({ onBack }: TutorModeProps): React.JSX.Element {
  const { t } = useTranslation(['ui', 'chapters', 'challenges']);
  const {
    progress,
    isCompleted,
    completeChallenge,
    setCurrentChapter,
    setCurrentChallenge,
    resetProgress,
    completedCount,
  } = useTutorProgress();

  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(
    progress.currentChallengeId,
  );
  const [selectedChapter, setSelectedChapter] = useState<number>(progress.currentChapterId);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const totalChallenges = useMemo(
    () => chapters.reduce((sum, ch) => sum + ch.challenges.length, 0),
    [],
  );

  const isChapterUnlocked = useCallback(
    (chapter: Chapter): boolean => {
      if (chapter.id === 1) return true;
      const prevChapter = chapters.find((c) => c.id === chapter.id - 1);
      if (!prevChapter) return true;
      return prevChapter.challenges.every((cId) => isCompleted(cId));
    },
    [isCompleted],
  );

  const currentChapter = useMemo(
    () => chapters.find((c) => c.id === selectedChapter) ?? chapters[0],
    [selectedChapter],
  );

  const activeChallenge = useMemo<Challenge | null>(
    () => (activeChallengeId !== null ? (challengeMap[activeChallengeId] ?? null) : null),
    [activeChallengeId],
  );

  const handleSelectChapter = useCallback(
    (chapterId: number) => {
      setSelectedChapter(chapterId);
      setCurrentChapter(chapterId);
    },
    [setCurrentChapter],
  );

  const handleSelectChallenge = useCallback(
    (challengeId: string) => {
      setActiveChallengeId(challengeId);
      setCurrentChallenge(challengeId);
    },
    [setCurrentChallenge],
  );

  const handleChallengeSuccess = useCallback(
    (challengeId: string, _xpEarned: number) => {
      completeChallenge(challengeId);
    },
    [completeChallenge],
  );

  const handleCloseTerminal = useCallback(() => {
    setActiveChallengeId(null);
    setCurrentChallenge(null);
  }, [setCurrentChallenge]);

  const handleNextChallenge = useCallback(() => {
    if (!currentChapter || !activeChallengeId) return;

    const currentIdx = currentChapter.challenges.indexOf(activeChallengeId);
    if (currentIdx < currentChapter.challenges.length - 1) {
      const nextId = currentChapter.challenges[currentIdx + 1];
      if (nextId !== undefined) {
        handleSelectChallenge(nextId);
      }
    } else {
      // Move to next chapter's first challenge
      const nextChapter = chapters.find((c) => c.id === currentChapter.id + 1);
      if (nextChapter && isChapterUnlocked(nextChapter)) {
        const firstChallenge = nextChapter.challenges[0];
        if (firstChallenge !== undefined) {
          handleSelectChapter(nextChapter.id);
          handleSelectChallenge(firstChallenge);
        }
      }
    }
  }, [
    currentChapter,
    activeChallengeId,
    handleSelectChallenge,
    handleSelectChapter,
    isChapterUnlocked,
  ]);

  const handleResetProgress = useCallback(() => {
    resetProgress();
    setSelectedChapter(1);
    setActiveChallengeId(null);
    setShowResetConfirm(false);
  }, [resetProgress]);

  // Full-screen terminal when a challenge is active
  if (activeChallenge !== null && activeChallengeId !== null) {
    return (
      <div className="tutor-terminal-wrapper">
        <div className="tutor-terminal-header">
          <button className="tutor-btn tutor-btn-back" onClick={handleCloseTerminal}>
            ← {t('ui:tutorial.back_to_menu', 'Back')}
          </button>
          <span className="tutor-terminal-title">
            CH{String(activeChallenge.chapter).padStart(2, '0')}.
            {String(activeChallenge.order).padStart(2, '0')} — {t(nsKey(activeChallenge.titleKey))}
          </span>
          {isCompleted(activeChallengeId) && (
            <button className="tutor-btn tutor-btn-next" onClick={handleNextChallenge}>
              {t('ui:tutorial.next_challenge', 'Next Challenge')} →
            </button>
          )}
        </div>
        <div className="tutor-terminal-content">
          <HackingTerminal
            key={activeChallengeId}
            challengeId={activeChallengeId}
            onClose={handleCloseTerminal}
            onChallengeSuccess={handleChallengeSuccess}
          />
        </div>
      </div>
    );
  }

  // Challenge browser view
  return (
    <div className="tutor-container">
      {/* Header */}
      <div className="tutor-header">
        <button className="tutor-btn tutor-btn-back" onClick={onBack}>
          ← {t('ui:tutorial.back_to_menu', 'Back to Menu')}
        </button>
        <div className="tutor-header-title">
          <h1>{t('ui:tutorial.title', 'PYTHON TUTORIAL')}</h1>
          <p>{t('ui:tutorial.subtitle', 'Learn Python step by step')}</p>
        </div>
        <div className="tutor-header-progress">
          <span className="tutor-progress-text">
            {t('ui:tutorial.progress', 'Progress')}: {completedCount}/{totalChallenges}
          </span>
          <div className="tutor-progress-bar">
            <div
              className="tutor-progress-fill"
              style={{ width: `${(completedCount / totalChallenges) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="tutor-body">
        {/* Chapter sidebar */}
        <nav className="tutor-sidebar" aria-label="Chapters">
          {chapters.map((chapter) => {
            const unlocked = isChapterUnlocked(chapter);
            const chCompleted = chapter.challenges.filter((cId) => isCompleted(cId)).length;
            const isActive = chapter.id === selectedChapter;

            return (
              <button
                key={chapter.id}
                className={`tutor-chapter-btn ${isActive ? 'active' : ''} ${!unlocked ? 'locked' : ''}`}
                onClick={() => unlocked && handleSelectChapter(chapter.id)}
                disabled={!unlocked}
                aria-current={isActive ? 'true' : undefined}
              >
                <span className="tutor-chapter-num">
                  {unlocked ? String(chapter.id).padStart(2, '0') : '🔒'}
                </span>
                <span className="tutor-chapter-info">
                  <span className="tutor-chapter-name">{t(nsKey(chapter.titleKey))}</span>
                  <span className="tutor-chapter-progress">
                    {chCompleted}/{chapter.challenges.length}
                  </span>
                </span>
                {chCompleted === chapter.challenges.length && unlocked && (
                  <span className="tutor-chapter-check">✓</span>
                )}
              </button>
            );
          })}

          <div className="tutor-sidebar-spacer" />
          <button className="tutor-btn tutor-btn-reset" onClick={() => setShowResetConfirm(true)}>
            {t('ui:tutorial.reset_progress', 'Reset Progress')}
          </button>
        </nav>

        {/* Challenge list */}
        <main className="tutor-challenges">
          {currentChapter && (
            <>
              <div className="tutor-challenges-header">
                <h2>
                  {t('ui:tutorial.chapter', 'Chapter')} {currentChapter.id}:{' '}
                  {t(nsKey(currentChapter.titleKey))}
                </h2>
                <p className="tutor-challenges-desc">{t(nsKey(currentChapter.descriptionKey))}</p>
              </div>

              <div className="tutor-challenge-list">
                {currentChapter.challenges.map((challengeId, index) => {
                  const challenge = challengeMap[challengeId];
                  if (!challenge) return null;
                  const completed = isCompleted(challengeId);
                  const prevCompleted =
                    index === 0 || isCompleted(currentChapter.challenges[index - 1] ?? '');

                  return (
                    <button
                      key={challengeId}
                      className={`tutor-challenge-card ${completed ? 'completed' : ''} ${!prevCompleted ? 'locked' : ''}`}
                      onClick={() => prevCompleted && handleSelectChallenge(challengeId)}
                      disabled={!prevCompleted}
                    >
                      <span className="tutor-challenge-status">
                        {completed ? '✓' : prevCompleted ? '▶' : '○'}
                      </span>
                      <span className="tutor-challenge-info">
                        <span className="tutor-challenge-title">
                          {String(challenge.order).padStart(2, '0')}. {t(nsKey(challenge.titleKey))}
                        </span>
                        <span className="tutor-challenge-meta">
                          {challenge.difficulty} · +{challenge.xpReward} XP
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div className="tutor-modal-backdrop" onClick={() => setShowResetConfirm(false)}>
          <div className="tutor-modal" onClick={(e) => e.stopPropagation()}>
            <p>
              {t(
                'ui:tutorial.reset_confirm',
                'Are you sure? This will clear all tutorial progress.',
              )}
            </p>
            <div className="tutor-modal-actions">
              <button className="tutor-btn" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </button>
              <button className="tutor-btn tutor-btn-danger" onClick={handleResetProgress}>
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
