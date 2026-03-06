import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { Challenge, Difficulty } from '@venomous-snake/shared-types';
import type { TestResult } from '@venomous-snake/challenge-engine';

export interface ChallengePanelProps {
  challenge: Challenge;
  testResults?: TestResult[];
  attempts: number;
  hintsUsed: number;
  isOpen: boolean;
  onSubmit: () => void;
  onGetHint: () => void;
  onClose: () => void;
}

const FONT_FAMILY = "'JetBrains Mono', 'Fira Code', monospace";

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: '#00ff88',
  easy: '#00e5ff',
  medium: '#ffb454',
  hard: '#ff6644',
  expert: '#ff0066',
};

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export function ChallengePanel({
  challenge,
  testResults,
  attempts,
  hintsUsed,
  isOpen,
  onSubmit,
  onGetHint,
  onClose,
}: ChallengePanelProps): React.JSX.Element {
  const { t } = useTranslation('ui');
  const [startTime] = useState<number>(Date.now);
  const [elapsed, setElapsed] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const id = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 1000);
    return () => clearInterval(id);
  }, [isOpen, startTime]);

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

  const difficultyColor = DIFFICULTY_COLORS[challenge.difficulty];
  const passedCount = testResults?.filter((r) => r.passed).length ?? 0;
  const totalCount = testResults?.length ?? 0;

  // Collapsed mobile bar
  if (isMobile && !isOpen) {
    return (
      <div
        role="complementary"
        aria-label={t('challenge.panel_label', 'Challenge Panel')}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 48,
          background: '#0a0a0f',
          borderTop: '1px solid #00ff88',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          fontFamily: FONT_FAMILY,
          zIndex: 1000,
        }}
      >
        <span style={{ color: '#00ff88', fontSize: 12 }}>{t(challenge.titleKey)}</span>
        <span style={{ color: '#00e5ff', fontSize: 12 }}>{formatTime(elapsed)}</span>
      </div>
    );
  }

  return (
    <div
      role="complementary"
      aria-label={t('challenge.panel_label', 'Challenge Panel')}
      style={{
        position: 'fixed',
        top: 0,
        right: isOpen ? 0 : -400,
        width: isMobile ? '100vw' : 380,
        height: '100vh',
        background: 'linear-gradient(180deg, #0a0a0f 0%, #0d1b2a 100%)',
        borderLeft: '1px solid #00ff88',
        boxShadow: isOpen ? '-4px 0 24px rgba(0,255,136,0.15)' : 'none',
        transition: 'right 0.3s ease',
        fontFamily: FONT_FAMILY,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #1a2a3a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: '#00ff88', fontSize: 16 }}>{t(challenge.titleKey)}</h2>
          <span
            style={{
              display: 'inline-block',
              marginTop: 6,
              padding: '2px 8px',
              fontSize: 11,
              color: difficultyColor,
              border: `1px solid ${difficultyColor}`,
              borderRadius: 3,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {challenge.difficulty}
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label={t('challenge.close', 'Close')}
          style={{
            background: 'transparent',
            border: '1px solid #ff0066',
            color: '#ff0066',
            fontFamily: FONT_FAMILY,
            fontSize: 12,
            padding: '4px 10px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>

      {/* Description */}
      <div style={{ padding: '12px 16px', color: '#b3b1ad', fontSize: 13, lineHeight: 1.5 }}>
        {t(challenge.descriptionKey)}
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          padding: '8px 16px',
          borderTop: '1px solid #1a2a3a',
          borderBottom: '1px solid #1a2a3a',
          fontSize: 12,
        }}
      >
        <div style={{ color: '#00e5ff' }}>
          ⏱ {formatTime(elapsed)}
        </div>
        <div style={{ color: '#ffb454' }}>
          {t('challenge.attempts', 'Attempts')}: {attempts}
        </div>
        <div style={{ color: '#c792ea' }}>
          {t('challenge.hints', 'Hints')}: {hintsUsed}
        </div>
      </div>

      {/* Test results */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        <h3 style={{ margin: '0 0 8px', color: '#00e5ff', fontSize: 13, letterSpacing: '0.05em' }}>
          {t('challenge.tests', 'TESTS')} ({passedCount}/{totalCount})
        </h3>
        {testResults && testResults.length > 0 ? (
          testResults.map((result) => (
            <div
              key={result.testCase.id}
              style={{
                padding: '8px 10px',
                marginBottom: 6,
                background: result.passed ? 'rgba(0,255,136,0.06)' : 'rgba(255,0,102,0.06)',
                borderLeft: `3px solid ${result.passed ? '#00ff88' : '#ff0066'}`,
                fontSize: 12,
                color: '#b3b1ad',
              }}
            >
              <span style={{ color: result.passed ? '#00ff88' : '#ff0066', marginRight: 8 }}>
                {result.passed ? '✓' : '✗'}
              </span>
              {result.testCase.description}
            </div>
          ))
        ) : (
          <div style={{ color: '#3d4752', fontSize: 12, fontStyle: 'italic' }}>
            {t('challenge.no_results', 'No test results yet. Submit your solution to run tests.')}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid #1a2a3a',
          display: 'flex',
          gap: 10,
        }}
      >
        <button
          onClick={onSubmit}
          style={{
            flex: 1,
            padding: '10px 0',
            background: 'rgba(0,255,136,0.1)',
            border: '1px solid #00ff88',
            color: '#00ff88',
            fontFamily: FONT_FAMILY,
            fontSize: 13,
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          {t('challenge.submit', '▶ SUBMIT')}
        </button>
        <button
          onClick={onGetHint}
          title={t('challenge.hint_warning', 'Using hints reduces XP reward')}
          style={{
            flex: 1,
            padding: '10px 0',
            background: 'rgba(255,180,84,0.1)',
            border: '1px solid #ffb454',
            color: '#ffb454',
            fontFamily: FONT_FAMILY,
            fontSize: 13,
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          {t('challenge.get_hint', '💡 HINT')} (T{Math.min(hintsUsed + 1, 3)})
        </button>
      </div>
    </div>
  );
}
