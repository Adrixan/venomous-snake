import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { CurriculumProgress, Chapter } from '@venomous-snake/shared-types';

export interface QuestLogProps {
  isOpen: boolean;
  onClose: () => void;
  curriculumProgress: CurriculumProgress;
  chapters: Chapter[];
  currentFloor: string;
}

type ChallengeStatus = 'completed' | 'in-progress' | 'locked' | 'available';

const FONT_FAMILY = "'JetBrains Mono', 'Fira Code', monospace";

const statusIcons: Record<ChallengeStatus, { char: string; color: string }> = {
  completed: { char: '✓', color: '#00ff9d' },
  'in-progress': { char: '▶', color: '#00b4d8' },
  locked: { char: '⊘', color: '#666' },
  available: { char: '○', color: '#ffb454' },
};

function getChallengeStatus(
  challengeId: string,
  progress: CurriculumProgress,
  challengeChapter: number,
): ChallengeStatus {
  const challengeProgress = progress.challenges[challengeId];
  if (challengeProgress !== undefined && challengeProgress.completed) return 'completed';
  if (challengeProgress !== undefined && challengeProgress.attempts > 0) return 'in-progress';
  if (challengeChapter > progress.currentChapter) return 'locked';
  return 'available';
}

export function QuestLog({
  isOpen,
  onClose,
  curriculumProgress,
  chapters,
  currentFloor,
}: QuestLogProps): React.JSX.Element {
  const { t } = useTranslation('ui');
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    },
    [isOpen, onClose],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const currentChapter = chapters.find((ch) => ch.id === curriculumProgress.currentChapter);

  // Compute progress for current chapter
  let completedCount = 0;
  let totalCount = 0;
  if (currentChapter) {
    totalCount = currentChapter.challenges.length;
    for (const cId of currentChapter.challenges) {
      const cp = curriculumProgress.challenges[cId];
      if (cp !== undefined && cp.completed) completedCount++;
    }
  }

  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    right: 0,
    top: 0,
    bottom: 0,
    width: '380px',
    maxWidth: '100vw',
    background: '#0d1117',
    borderLeft: '1px solid #00ff9d',
    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s ease',
    zIndex: 300,
    fontFamily: FONT_FAMILY,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #333',
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: '#e0e0e0',
    fontSize: '20px',
    cursor: 'pointer',
    minWidth: '44px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <h2 style={{ color: '#00ff9d', fontSize: '16px', margin: 0 }}>{t('quest_log.title')}</h2>
        <button style={closeButtonStyle} onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>

      <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
        {currentChapter ? (
          <>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ color: '#00b4d8', fontSize: '13px', marginBottom: '4px' }}>
                {t('quest_log.chapter', { num: currentChapter.id })}
              </div>
              <div style={{ color: '#e0e0e0', fontSize: '11px', marginBottom: '4px' }}>
                {t('quest_log.floor', { floor: currentFloor })}
              </div>
              {/* Progress bar */}
              <div style={{ marginTop: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: '#666',
                    marginBottom: '4px',
                  }}
                >
                  <span>{t('quest_log.progress')}</span>
                  <span>
                    {completedCount}/{totalCount} ({progressPercent}%)
                  </span>
                </div>
                <div
                  style={{
                    height: '6px',
                    background: '#1a1a2e',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${String(progressPercent)}%`,
                      background: '#00ff9d',
                      borderRadius: '3px',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Challenge list */}
            {currentChapter.challenges.map((challengeId) => {
              const status = getChallengeStatus(challengeId, curriculumProgress, currentChapter.id);
              const icon = statusIcons[status];
              const isExpanded = expandedChallenge === challengeId;
              const isClickable = status === 'available' || status === 'in-progress';

              const itemStyle: React.CSSProperties = {
                padding: '10px 12px',
                margin: '4px 0',
                background: isExpanded ? '#1a1a2e' : 'transparent',
                border: '1px solid transparent',
                borderColor: isExpanded ? '#333' : 'transparent',
                cursor: isClickable ? 'pointer' : 'default',
                borderRadius: '2px',
              };

              return (
                <div
                  key={challengeId}
                  style={itemStyle}
                  onClick={() => {
                    if (isClickable) {
                      setExpandedChallenge(isExpanded ? null : challengeId);
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: icon.color, fontSize: '14px' }}>{icon.char}</span>
                    <span
                      style={{
                        color: status === 'locked' ? '#666' : '#e0e0e0',
                        fontSize: '13px',
                      }}
                    >
                      {challengeId}
                    </span>
                  </div>
                  {isExpanded && (
                    <div
                      style={{
                        marginTop: '8px',
                        paddingLeft: '22px',
                        color: '#999',
                        fontSize: '11px',
                        lineHeight: '1.5',
                      }}
                    >
                      {t(
                        `quest_log.status_${status.replace('-', '_')}` as 'quest_log.status_locked',
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          <p style={{ color: '#666', fontSize: '13px' }}>{t('quest_log.no_quests')}</p>
        )}
      </div>
    </div>
  );
}
