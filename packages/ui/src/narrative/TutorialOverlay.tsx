import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { TutorialStep } from '@venomous-snake/narrative';

export interface TutorialOverlayProps {
  step: TutorialStep;
  onComplete: () => void;
  onSkip: () => void;
}

const FONT_FAMILY = "'JetBrains Mono', 'Fira Code', monospace";

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function useSpotlightRect(selector: string | undefined): SpotlightRect | null {
  const [rect, setRect] = useState<SpotlightRect | null>(null);

  useEffect(() => {
    if (!selector) {
      setRect(null);
      return;
    }

    const measure = (): void => {
      const el = document.querySelector(selector);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top - 8, left: r.left - 8, width: r.width + 16, height: r.height + 16 });
      } else {
        setRect(null);
      }
    };

    measure();
    const id = setInterval(measure, 300);
    return () => clearInterval(id);
  }, [selector]);

  return rect;
}

export function TutorialOverlay({
  step,
  onComplete,
  onSkip,
}: TutorialOverlayProps): React.JSX.Element {
  const { t } = useTranslation('story');
  const spotlightRect = useSpotlightRect(step.highlightElement);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onComplete();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onSkip();
      }
    },
    [onComplete, onSkip],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Where to anchor the speech bubble: below spotlight if it exists, else center-bottom
  const bubbleStyle: React.CSSProperties = spotlightRect
    ? {
        position: 'fixed',
        top: spotlightRect.top + spotlightRect.height + 16,
        left: Math.min(Math.max(spotlightRect.left, 16), window.innerWidth - 380),
        width: 360,
      }
    : {
        position: 'fixed',
        bottom: 120,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 360,
      };

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 8000,
        pointerEvents: 'none',
        fontFamily: FONT_FAMILY,
      }}
      aria-live="polite"
      aria-label="Tutorial hint"
    >
      {/* Semi-transparent dark overlay with spotlight cutout */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <defs>
          <mask id="tutorial-spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {spotlightRect && (
              <rect
                x={spotlightRect.left}
                y={spotlightRect.top}
                width={spotlightRect.width}
                height={spotlightRect.height}
                rx={6}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.65)"
          mask="url(#tutorial-spotlight-mask)"
        />
        {/* Spotlight border glow */}
        {spotlightRect && (
          <rect
            x={spotlightRect.left}
            y={spotlightRect.top}
            width={spotlightRect.width}
            height={spotlightRect.height}
            rx={6}
            fill="none"
            stroke="#00e5ff"
            strokeWidth={2}
            style={{ filter: 'drop-shadow(0 0 6px #00e5ff)' }}
          />
        )}
      </svg>

      {/* CIPHER speech bubble */}
      <div
        style={{
          ...bubbleStyle,
          pointerEvents: 'auto',
          background: 'linear-gradient(135deg, #0d1b2a 0%, #0a0a1a 100%)',
          border: '1px solid #00e5ff',
          borderRadius: 8,
          padding: '16px 18px',
          boxShadow: '0 0 24px rgba(0,229,255,0.18)',
        }}
      >
        {/* CIPHER header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(0,229,255,0.12)',
              border: '1.5px solid #00e5ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00e5ff',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.05em',
              flexShrink: 0,
            }}
          >
            AI
          </div>
          <span
            style={{
              color: '#00e5ff',
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '0.08em',
            }}
          >
            CIPHER
          </span>
        </div>

        {/* Dialog text */}
        <p
          style={{
            color: '#d0d0d0',
            fontSize: 13,
            lineHeight: 1.6,
            margin: '0 0 14px',
          }}
        >
          {t(step.cipherDialog)}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={onSkip}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.35)',
              fontSize: 11,
              cursor: 'pointer',
              fontFamily: FONT_FAMILY,
              padding: '4px 0',
              textDecoration: 'underline',
            }}
          >
            {t('tutorial.skipTutorial')}
          </button>

          <button
            onClick={onComplete}
            autoFocus
            style={{
              background: 'rgba(0,229,255,0.12)',
              border: '1px solid #00e5ff',
              color: '#00e5ff',
              fontFamily: FONT_FAMILY,
              fontSize: 12,
              fontWeight: 700,
              padding: '6px 18px',
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            {t('tutorial.gotIt')} ✓
          </button>
        </div>
      </div>
    </div>
  );
}
