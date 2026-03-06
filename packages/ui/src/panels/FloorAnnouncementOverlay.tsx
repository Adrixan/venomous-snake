import React, { useEffect, useState, useRef } from 'react';

const FONT_FAMILY = "'JetBrains Mono', 'Fira Code', monospace";
const DISPLAY_DURATION_MS = 3000;
const GLITCH_INTERVAL_MS = 80;

export interface FloorAnnouncementOverlayProps {
  floorNumber: number;
  floorName: string;
  subtitle: string;
  isVisible: boolean;
  /** Called after the auto-dismiss animation completes. */
  onDismiss: () => void;
}

/** Returns a random subset of characters replaced with glitch symbols. */
function glitchText(text: string, intensity: number): string {
  const glitchChars = '!@#$%^&*░▒▓█▀▄┼╬╪';
  return text
    .split('')
    .map((ch) =>
      Math.random() < intensity && ch !== ' '
        ? (glitchChars[Math.floor(Math.random() * glitchChars.length)] ?? ch)
        : ch,
    )
    .join('');
}

/**
 * Full-screen cyberpunk announcement shown when the player enters a new floor.
 * Auto-dismisses after DISPLAY_DURATION_MS milliseconds.
 */
export function FloorAnnouncementOverlay({
  floorNumber,
  floorName,
  subtitle,
  isVisible,
  onDismiss,
}: FloorAnnouncementOverlayProps): React.JSX.Element | null {
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [opacity, setOpacity] = useState(0);
  const glitchRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const title = `FLOOR ${floorNumber} — ${floorName.toUpperCase()}`;

  useEffect(() => {
    if (!isVisible) {
      setOpacity(0);
      setDisplayedTitle('');
      if (glitchRef.current !== null) {
        clearInterval(glitchRef.current);
        glitchRef.current = null;
      }
      if (dismissRef.current !== null) {
        clearTimeout(dismissRef.current);
        dismissRef.current = null;
      }
      return;
    }

    // Fade in
    setOpacity(1);
    setDisplayedTitle(title);

    let glitchPhase = 0;
    const totalPhases = Math.ceil(DISPLAY_DURATION_MS / GLITCH_INTERVAL_MS);

    glitchRef.current = setInterval(() => {
      glitchPhase++;
      // High intensity at start, fades out to zero over the display duration
      const intensity = Math.max(0, 0.6 - (glitchPhase / totalPhases) * 0.7);
      setDisplayedTitle(glitchText(title, intensity));

      if (glitchPhase >= totalPhases) {
        if (glitchRef.current !== null) {
          clearInterval(glitchRef.current);
          glitchRef.current = null;
        }
        setDisplayedTitle(title);
      }
    }, GLITCH_INTERVAL_MS);

    dismissRef.current = setTimeout(() => {
      setOpacity(0);
      // Allow the CSS fade-out to finish before calling onDismiss
      setTimeout(onDismiss, 500);
    }, DISPLAY_DURATION_MS);

    return () => {
      if (glitchRef.current !== null) clearInterval(glitchRef.current);
      if (dismissRef.current !== null) clearTimeout(dismissRef.current);
    };
  }, [isVisible, title, onDismiss]);

  if (!isVisible && opacity === 0) return null;

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.88)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9000,
    opacity,
    transition: 'opacity 0.5s ease',
    pointerEvents: 'none',
    fontFamily: FONT_FAMILY,
  };

  const scanlineStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background:
      'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,157,0.03) 2px, rgba(0,255,157,0.03) 4px)',
    pointerEvents: 'none',
  };

  const floorNumberStyle: React.CSSProperties = {
    color: '#00ff9d',
    fontSize: 'clamp(11px, 2vw, 14px)',
    letterSpacing: '0.3em',
    opacity: 0.7,
    marginBottom: '12px',
    textShadow: '0 0 20px #00ff9d66',
  };

  const titleStyle: React.CSSProperties = {
    color: '#00ff9d',
    fontSize: 'clamp(22px, 5vw, 42px)',
    fontWeight: 'bold',
    letterSpacing: '0.12em',
    textAlign: 'center',
    textShadow: '0 0 40px #00ff9d, 0 0 80px #00ff9d44',
    whiteSpace: 'pre',
    lineHeight: 1.1,
  };

  const dividerStyle: React.CSSProperties = {
    width: '200px',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #00ff9d, transparent)',
    margin: '20px auto',
  };

  const subtitleStyle: React.CSSProperties = {
    color: '#aaa',
    fontSize: 'clamp(11px, 1.8vw, 14px)',
    letterSpacing: '0.2em',
    textAlign: 'center',
    fontStyle: 'italic',
  };

  return (
    <div style={backdropStyle} role="alert" aria-live="assertive">
      <div style={scanlineStyle} aria-hidden="true" />
      <div style={floorNumberStyle} aria-hidden="true">
        {`[ FLOOR ${floorNumber} ]`}
      </div>
      <div style={titleStyle}>{displayedTitle}</div>
      <div style={dividerStyle} aria-hidden="true" />
      <div style={subtitleStyle}>{subtitle}</div>
    </div>
  );
}
