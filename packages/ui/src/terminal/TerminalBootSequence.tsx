import React, { useEffect, useState, useRef } from 'react';

const BOOT_LINES = [
  '> CIPHER_OS v3.14.159',
  '> Initializing Python runtime...',
  '> Connecting to Rattlesnake Corp network...',
  '> Access granted. Terminal ready.',
  '> _',
] as const;

/** Session flag — skip boot animation on subsequent terminal opens */
let _bootShown = false;

export interface TerminalBootSequenceProps {
  /** Called once the boot animation finishes */
  onComplete: () => void;
  /** Line delay in ms. Default 260 */
  lineDelay?: number;
  /** Force replay even if already shown this session */
  forceReplay?: boolean;
}

/**
 * Displays a brief CRT boot animation when the terminal first opens.
 * Subsequent opens (same session) skip directly to `onComplete`.
 */
export function TerminalBootSequence({
  onComplete,
  lineDelay = 260,
  forceReplay = false,
}: TerminalBootSequenceProps): React.JSX.Element | null {
  const [visibleCount, setVisibleCount] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Skip on subsequent opens unless forced
    if (_bootShown && !forceReplay) {
      onCompleteRef.current();
      return;
    }

    _bootShown = true;
    let count = 0;
    const totalLines = BOOT_LINES.length;

    const advance = () => {
      count += 1;
      setVisibleCount(count);
      if (count >= totalLines) {
        // Slight pause after final line before handing off
        setTimeout(() => onCompleteRef.current(), 220);
      } else {
        setTimeout(advance, lineDelay);
      }
    };

    const startTimer = setTimeout(advance, lineDelay * 0.5);
    return () => clearTimeout(startTimer);
  }, [lineDelay, forceReplay]);

  // If already shown and not forcing replay, render nothing (onComplete fires via effect)
  if (_bootShown && !forceReplay && visibleCount === 0) return null;

  return (
    <>
      <style>{BOOT_STYLES}</style>
      <div className="boot-seq-root" role="status" aria-label="Terminal boot sequence">
        {/* CRT scanline overlay */}
        <div className="boot-seq-scanlines" aria-hidden="true" />

        <div className="boot-seq-lines">
          {BOOT_LINES.slice(0, visibleCount).map((line, i) => (
            <p key={i} className="boot-seq-line">
              {line === '> _' ? (
                <>
                  {'> '}
                  <span className="boot-seq-cursor" />
                </>
              ) : (
                line
              )}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}

const BOOT_STYLES = `
.boot-seq-root {
  position: absolute;
  inset: 0;
  background: #060a0e;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  overflow: hidden;
}

.boot-seq-scanlines {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 2px,
    rgba(0, 255, 157, 0.015) 2px,
    rgba(0, 255, 157, 0.015) 4px
  );
  z-index: 1;
}

.boot-seq-lines {
  position: relative;
  z-index: 2;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 14px;
  color: #00ff9d;
  text-shadow: 0 0 8px rgba(0, 255, 157, 0.6);
  line-height: 1.8;
  width: 400px;
  max-width: 90%;
}

.boot-seq-line {
  margin: 0;
  padding: 0;
  animation: boot-line-fade 0.15s ease-in;
}

@keyframes boot-line-fade {
  from { opacity: 0; transform: translateX(-4px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* Blinking cursor */
.boot-seq-cursor {
  display: inline-block;
  width: 9px;
  height: 14px;
  background: #00ff9d;
  vertical-align: text-bottom;
  box-shadow: 0 0 6px rgba(0, 255, 157, 0.8);
  animation: boot-cursor-blink 0.8s step-start infinite;
}

@keyframes boot-cursor-blink {
  50% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .boot-seq-line { animation: none; }
  .boot-seq-cursor { animation: none; }
}
`;
