import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { Cutscene } from '@venomous-snake/narrative';

export interface CutscenePlayerProps {
  cutscene: Cutscene;
  onComplete: () => void;
}

const FONT_FAMILY = "'JetBrains Mono', 'Fira Code', monospace";
const CHAR_DELAY_MS = 30;

const PORTRAIT_COLORS: Record<string, string> = {
  cipher: '#00e5ff',
};

export function CutscenePlayer({ cutscene, onComplete }: CutscenePlayerProps): React.JSX.Element {
  const { t } = useTranslation('dialog');
  const [sceneIndex, setSceneIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const currentScene = cutscene.scenes[sceneIndex];
  const fullText = currentScene ? t(currentScene.textKey) : '';

  // Typewriter effect
  useEffect(() => {
    if (!currentScene) return;
    setDisplayedText('');
    setIsTyping(true);
    let charIndex = 0;

    const id = setInterval(() => {
      charIndex++;
      if (charIndex >= fullText.length) {
        setDisplayedText(fullText);
        setIsTyping(false);
        clearInterval(id);
      } else {
        setDisplayedText(fullText.slice(0, charIndex));
      }
    }, CHAR_DELAY_MS);

    return () => clearInterval(id);
  }, [sceneIndex, fullText, currentScene]);

  // Auto-advance if scene has a duration
  useEffect(() => {
    if (!currentScene?.duration || isTyping) return;
    const id = setTimeout(() => advance(), currentScene.duration);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneIndex, isTyping, currentScene]);

  const advance = useCallback(() => {
    if (isTyping) {
      // Complete the typewriter instantly
      setDisplayedText(fullText);
      setIsTyping(false);
      return;
    }
    if (sceneIndex >= cutscene.scenes.length - 1) {
      onComplete();
    } else {
      setSceneIndex((i) => i + 1);
    }
  }, [isTyping, fullText, sceneIndex, cutscene.scenes.length, onComplete]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        advance();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onComplete();
      }
    },
    [advance, onComplete],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!currentScene) {
    onComplete();
    return <div />;
  }

  const portraitSide = currentScene.portraitSide ?? 'left';
  const portraitColor = currentScene.portraitId
    ? (PORTRAIT_COLORS[currentScene.portraitId] ?? '#00ff88')
    : '#00ff88';
  const speakerName = currentScene.speakerNameKey ? t(currentScene.speakerNameKey) : undefined;

  return (
    <div
      onClick={advance}
      role="dialog"
      aria-label="Cutscene"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'linear-gradient(180deg, #0a0a0f 0%, #0d1b2a 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        fontFamily: FONT_FAMILY,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Skip button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onComplete();
        }}
        aria-label="Skip cutscene"
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.5)',
          fontFamily: FONT_FAMILY,
          fontSize: 12,
          padding: '6px 16px',
          cursor: 'pointer',
          zIndex: 10000,
        }}
      >
        SKIP ⏭
      </button>

      {/* Scene counter */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'rgba(255,255,255,0.25)',
          fontSize: 11,
        }}
      >
        {sceneIndex + 1} / {cutscene.scenes.length}
      </div>

      {/* Dialog area */}
      <div
        style={{
          display: 'flex',
          flexDirection: portraitSide === 'right' ? 'row-reverse' : 'row',
          alignItems: 'flex-end',
          padding: '0 40px 60px',
          gap: 24,
          maxWidth: 900,
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Portrait placeholder */}
        {currentScene.portraitId && (
          <div
            style={{
              width: 100,
              height: 100,
              flexShrink: 0,
              background: `rgba(${portraitColor === '#00e5ff' ? '0,229,255' : '0,255,136'},0.12)`,
              border: `2px solid ${portraitColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: portraitColor,
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {currentScene.portraitId}
          </div>
        )}

        {/* Text box */}
        <div
          style={{
            flex: 1,
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid #1a2a3a',
            padding: '16px 20px',
            minHeight: 100,
          }}
        >
          {speakerName && (
            <div
              style={{
                color: portraitColor,
                fontSize: 13,
                fontWeight: 'bold',
                marginBottom: 8,
                letterSpacing: '0.05em',
              }}
            >
              {speakerName}
            </div>
          )}
          <div
            aria-live="polite"
            style={{
              color: '#d0d0d0',
              fontSize: 15,
              lineHeight: 1.6,
              minHeight: 48,
            }}
          >
            {displayedText}
            {isTyping && (
              <span style={{ color: '#00ff88', animation: 'blink 0.7s step-end infinite' }}>▌</span>
            )}
          </div>
        </div>
      </div>

      {/* Advance hint */}
      <div
        style={{
          textAlign: 'center',
          padding: '0 0 20px',
          color: 'rgba(255,255,255,0.2)',
          fontSize: 11,
        }}
      >
        {isTyping ? 'Click or press Space to skip' : 'Click or press Space to continue'}
      </div>
    </div>
  );
}
