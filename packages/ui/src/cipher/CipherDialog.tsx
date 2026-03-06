import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { CipherMood } from '@venomous-snake/narrative';
import { CipherPortrait } from './CipherPortrait';

interface CipherDialogProps {
  message: string;
  mood: CipherMood;
  /** Auto-dismiss delay in milliseconds. Default 8000. Set to 0 to disable. */
  autoDismissMs?: number;
  onDismiss: () => void;
}

const TYPEWRITER_SPEED_MS = 22;

export function CipherDialog({
  message,
  mood,
  autoDismissMs = 8000,
  onDismiss,
}: CipherDialogProps): React.JSX.Element {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (dismissTimerRef.current !== null) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  }, []);

  const showFullText = useCallback(() => {
    clearTimers();
    setDisplayedText(message);
    setIsComplete(true);
    if (autoDismissMs > 0) {
      dismissTimerRef.current = setTimeout(onDismiss, autoDismissMs);
    }
  }, [message, autoDismissMs, onDismiss, clearTimers]);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    let idx = 0;

    intervalRef.current = setInterval(() => {
      idx += 1;
      setDisplayedText(message.slice(0, idx));
      if (idx >= message.length) {
        clearInterval(intervalRef.current ?? undefined);
        intervalRef.current = null;
        setIsComplete(true);
        if (autoDismissMs > 0) {
          dismissTimerRef.current = setTimeout(onDismiss, autoDismissMs);
        }
      }
    }, TYPEWRITER_SPEED_MS);

    return clearTimers;
  }, [message, autoDismissMs, onDismiss, clearTimers]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="CIPHER message"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        background: '#0d1117ee',
        border: '1px solid #00ff9d55',
        borderRadius: '8px',
        padding: '14px 16px',
        maxWidth: '480px',
        boxShadow: '0 0 16px #00ff9d22',
        position: 'relative',
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      }}
    >
      <CipherPortrait mood={mood} size={64} />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Name tag */}
        <div
          style={{
            fontSize: '10px',
            letterSpacing: '2px',
            color: '#00ff9d',
            textTransform: 'uppercase',
            marginBottom: '6px',
            fontWeight: 700,
          }}
        >
          CIPHER
        </div>

        {/* Dialog text */}
        <p
          style={{
            margin: 0,
            color: '#cdd6f4',
            fontSize: '13px',
            lineHeight: 1.6,
            minHeight: '40px',
            wordBreak: 'break-word',
          }}
        >
          {displayedText}
          {!isComplete && (
            <span
              style={{
                display: 'inline-block',
                width: '2px',
                height: '13px',
                background: '#00ff9d',
                marginLeft: '2px',
                verticalAlign: 'text-bottom',
                animation: 'cipher-cursor-blink 0.7s step-end infinite',
              }}
              aria-hidden="true"
            />
          )}
        </p>

        {/* Action row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
            marginTop: '10px',
          }}
        >
          {!isComplete && (
            <button
              type="button"
              onClick={showFullText}
              style={buttonStyle('#00b4d8')}
              aria-label="Skip typewriter animation"
            >
              Skip
            </button>
          )}
          <button
            type="button"
            onClick={onDismiss}
            style={buttonStyle('#00ff9d')}
            aria-label="Dismiss CIPHER message"
          >
            Dismiss
          </button>
        </div>
      </div>

      {/* Cursor blink keyframe injected once */}
      <style>{`@keyframes cipher-cursor-blink { 50% { opacity: 0; } }`}</style>
    </div>
  );
}

function buttonStyle(color: string): React.CSSProperties {
  return {
    background: 'transparent',
    border: `1px solid ${color}55`,
    color: color,
    borderRadius: '4px',
    padding: '3px 10px',
    fontSize: '11px',
    cursor: 'pointer',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    fontFamily: 'inherit',
    transition: 'background 0.15s',
  };
}
