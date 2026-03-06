import React, { useEffect, useState } from 'react';

export interface LoadingScreenProps {
  /** Progress 0–1. When undefined the bar animates indeterminately. */
  progress?: number;
  /** Status label shown below the bar. */
  statusText?: string;
}

const ASCII_LOGO = `
 ██████╗██╗██████╗ ██╗  ██╗███████╗██████╗
██╔════╝██║██╔══██╗██║  ██║██╔════╝██╔══██╗
██║     ██║██████╔╝███████║█████╗  ██████╔╝
██║     ██║██╔═══╝ ██╔══██║██╔══╝  ██╔══██╗
╚██████╗██║██║     ██║  ██║███████╗██║  ██║
 ╚═════╝╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝`.trim();

const SUBTITLE = 'VENOMOUS SNAKE • RATTLESNAKE CORP SECURITY DIVISION';

/**
 * Cyberpunk loading screen with animated circuit pattern, neon progress bar,
 * and CIPHER ASCII logo. Used for initial game load, floor transitions, and
 * Pyodide initialisation.
 */
export function LoadingScreen({
  progress,
  statusText = 'LOADING...',
}: LoadingScreenProps): React.JSX.Element {
  const [glitchActive, setGlitchActive] = useState(false);
  const [dotCount, setDotCount] = useState(1);

  // Periodic glitch pulse on the title
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      const off = setTimeout(() => setGlitchActive(false), 120);
      return () => clearTimeout(off);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Animated dots for the status text
  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((d) => (d % 3) + 1);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const isIndeterminate = progress === undefined;
  const pct = isIndeterminate ? null : Math.round(Math.max(0, Math.min(1, progress)) * 100);

  return (
    <>
      <style>{LOADING_STYLES}</style>
      <div
        className="ls-root"
        role="progressbar"
        aria-valuenow={pct ?? undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Loading"
      >
        {/* Animated circuit board background */}
        <div className="ls-circuit" aria-hidden="true">
          <CircuitPattern />
        </div>

        {/* Scanlines overlay */}
        <div className="ls-scanlines" aria-hidden="true" />

        <div className="ls-content">
          {/* ASCII logo */}
          <pre className={`ls-logo ${glitchActive ? 'ls-logo-glitch' : ''}`} aria-label="CIPHER">
            {ASCII_LOGO}
          </pre>
          <p className="ls-subtitle">{SUBTITLE}</p>

          {/* Progress bar */}
          <div className="ls-bar-track" aria-hidden="true">
            <div
              className={`ls-bar-fill ${isIndeterminate ? 'ls-bar-indeterminate' : ''}`}
              style={isIndeterminate ? undefined : { width: `${pct ?? 0}%` }}
            />
            <div className="ls-bar-glow" aria-hidden="true" />
          </div>

          {/* Status text */}
          <p className="ls-status">
            {statusText}
            <span className="ls-dots" aria-hidden="true">
              {'.'.repeat(dotCount)}
            </span>
          </p>

          {pct !== null && (
            <p className="ls-pct" aria-live="polite">
              {pct}%
            </p>
          )}
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Circuit board SVG pattern
// ---------------------------------------------------------------------------

function CircuitPattern(): React.JSX.Element {
  return (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.07 }}
      aria-hidden="true"
    >
      <defs>
        <pattern id="circuit" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          {/* Horizontal trace */}
          <line x1="0" y1="40" x2="30" y2="40" stroke="#00ff9d" strokeWidth="1" />
          <line x1="50" y1="40" x2="80" y2="40" stroke="#00ff9d" strokeWidth="1" />
          {/* Vertical trace */}
          <line x1="40" y1="0" x2="40" y2="30" stroke="#00ff9d" strokeWidth="1" />
          <line x1="40" y1="50" x2="40" y2="80" stroke="#00ff9d" strokeWidth="1" />
          {/* Junction dot */}
          <circle cx="40" cy="40" r="3" fill="none" stroke="#00ff9d" strokeWidth="1" />
          {/* Corner connectors */}
          <line x1="0" y1="0" x2="20" y2="0" stroke="#00b4d8" strokeWidth="0.5" />
          <line x1="20" y1="0" x2="20" y2="20" stroke="#00b4d8" strokeWidth="0.5" />
          <line x1="60" y1="60" x2="80" y2="60" stroke="#00b4d8" strokeWidth="0.5" />
          <line x1="60" y1="60" x2="60" y2="80" stroke="#00b4d8" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit)" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const LOADING_STYLES = `
.ls-root {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: #050810;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.ls-circuit {
  position: absolute;
  inset: 0;
}

.ls-scanlines {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 2px,
    rgba(0, 0, 0, 0.04) 2px,
    rgba(0, 0, 0, 0.04) 4px
  );
  z-index: 1;
}

.ls-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 560px;
  max-width: 90vw;
  padding: 24px;
}

/* ASCII logo */
.ls-logo {
  color: #00ff9d;
  font-size: clamp(5px, 1.1vw, 10px);
  line-height: 1.2;
  text-shadow: 0 0 16px rgba(0, 255, 157, 0.5);
  letter-spacing: 0;
  margin: 0;
  white-space: pre;
  transition: color 0.08s ease, text-shadow 0.08s ease;
}

.ls-logo-glitch {
  color: #ff3366;
  text-shadow:
    2px 0 0 rgba(0, 255, 157, 0.7),
    -2px 0 0 rgba(0, 180, 216, 0.7),
    0 0 20px rgba(255, 51, 102, 0.4);
}

.ls-subtitle {
  color: #3d4752;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin: 0;
}

/* Progress bar track */
.ls-bar-track {
  width: 100%;
  height: 8px;
  background: #0d1520;
  border: 1px solid #1a2a3a;
  position: relative;
  overflow: hidden;
}

/* Filled portion */
.ls-bar-fill {
  height: 100%;
  background: #00ff9d;
  box-shadow: 0 0 12px rgba(0, 255, 157, 0.6);
  transition: width 0.25s ease;
  position: relative;
  z-index: 1;
}

/* Indeterminate sliding animation */
.ls-bar-indeterminate {
  width: 35% !important;
  animation: ls-indeterminate 1.4s ease-in-out infinite;
}

@keyframes ls-indeterminate {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}

/* Glow sweep on top of fill */
.ls-bar-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%);
  animation: ls-glow-sweep 2s linear infinite;
  z-index: 2;
}

@keyframes ls-glow-sweep {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}

.ls-status {
  color: #00b4d8;
  font-size: 12px;
  letter-spacing: 0.12em;
  margin: 0;
}

.ls-dots {
  display: inline-block;
  min-width: 18px;
  text-align: left;
}

.ls-pct {
  color: #3d4752;
  font-size: 11px;
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .ls-bar-indeterminate { animation: none; width: 60% !important; }
  .ls-bar-glow          { animation: none; }
  .ls-logo-glitch       { color: #00ff9d; text-shadow: 0 0 16px rgba(0,255,157,0.5); }
}
`;
