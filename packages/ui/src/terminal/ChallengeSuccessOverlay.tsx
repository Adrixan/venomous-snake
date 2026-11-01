import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './terminal.css';

const FONT = "'JetBrains Mono', 'Fira Code', monospace";

/** `terminal.success.quote_1` to `quote_<n>` in the `ui` namespace. */
const CIPHER_QUOTE_COUNT = 7;

function pickQuoteKey(): string {
  const number = Math.floor(Math.random() * CIPHER_QUOTE_COUNT) + 1;
  return `terminal.success.quote_${String(number)}`;
}

export interface ChallengeSuccessOverlayProps {
  challengeTitle: string;
  xpEarned: number;
  onDismiss: () => void;
  /** Auto-dismiss delay in ms. Default 3000. */
  autoDismissMs?: number;
}

export function ChallengeSuccessOverlay({
  challengeTitle,
  xpEarned,
  onDismiss,
  autoDismissMs = 3000,
}: ChallengeSuccessOverlayProps): React.JSX.Element {
  const { t } = useTranslation('ui');
  const [glitching, setGlitching] = useState(false);
  const [quoteKey] = useState<string>(pickQuoteKey);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const glitchRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Glitch animation loop
    glitchRef.current = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 120);
    }, 600);

    // Auto-dismiss
    if (autoDismissMs > 0) {
      timerRef.current = setTimeout(onDismiss, autoDismissMs);
    }

    return () => {
      if (glitchRef.current !== null) clearInterval(glitchRef.current);
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [autoDismissMs, onDismiss]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('terminal.success.aria')}
      onClick={onDismiss}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.88)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        fontFamily: FONT,
        cursor: 'pointer',
        animation: 'successFlash 0.4s ease-out',
      }}
    >
      {/* Green border flash */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: '2px solid #00ff9d',
          boxShadow: '0 0 40px rgba(0,255,157,0.4), inset 0 0 40px rgba(0,255,157,0.08)',
          pointerEvents: 'none',
        }}
      />

      {/* HACK SUCCESSFUL title */}
      <div
        style={{
          fontSize: 'clamp(20px, 4vw, 32px)',
          fontWeight: 700,
          letterSpacing: '0.15em',
          color: glitching ? '#ff00ff' : '#00ff9d',
          textShadow: glitching ? '2px 0 #ff0066, -2px 0 #00e5ff' : '0 0 20px rgba(0,255,157,0.8)',
          transform: glitching ? 'translate(-2px, 1px)' : 'none',
          transition: 'color 0.05s, text-shadow 0.05s',
          marginBottom: 8,
        }}
      >
        {t('terminal.success.title')}
      </div>

      {/* Separator */}
      <div
        style={{
          width: 200,
          height: 1,
          background: 'linear-gradient(90deg, transparent, #00ff9d, transparent)',
          marginBottom: 20,
        }}
      />

      {/* Challenge name */}
      <div
        style={{
          color: '#00e5ff',
          fontSize: 14,
          letterSpacing: '0.08em',
          marginBottom: 16,
          textAlign: 'center',
          maxWidth: 340,
          padding: '0 16px',
        }}
      >
        {challengeTitle}
      </div>

      {/* XP earned */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 20px',
          border: '1px solid #ffb454',
          background: 'rgba(255,180,84,0.08)',
          color: '#ffb454',
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: '0.05em',
          marginBottom: 24,
          boxShadow: '0 0 12px rgba(255,180,84,0.3)',
        }}
      >
        <span style={{ fontSize: 14 }}>{t('hud.xp')}</span>
        <span>+{xpEarned}</span>
      </div>

      {/* CIPHER quote */}
      <div
        style={{
          maxWidth: 360,
          padding: '12px 16px',
          background: 'rgba(0,180,216,0.06)',
          border: '1px solid rgba(0,180,216,0.25)',
          color: '#b3b1ad',
          fontSize: 12,
          lineHeight: 1.6,
          textAlign: 'center',
          fontStyle: 'italic',
          marginBottom: 20,
        }}
      >
        <span style={{ color: '#00b4d8', fontStyle: 'normal', fontWeight: 700 }}>CIPHER: </span>
        {t(quoteKey)}
      </div>

      {/* Dismiss hint */}
      <div style={{ color: '#3d4752', fontSize: 11, letterSpacing: '0.05em' }}>
        {t('terminal.success.continue')}
      </div>
    </div>
  );
}
