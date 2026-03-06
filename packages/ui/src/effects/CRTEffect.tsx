import React from 'react';

export interface CRTEffectProps {
  /** Children to wrap with the CRT overlay */
  children: React.ReactNode;
  /** Whether the CRT effect is active. Default: true */
  enabled?: boolean;
  /** Whether to show the subtle VHS tracking noise. Default: false */
  trackingNoise?: boolean;
}

/**
 * CSS-only CRT monitor overlay — performance-friendly, GPU-accelerated.
 * Wraps game content with subtle scanlines, screen curvature, and optional
 * VHS tracking noise for a cyberpunk noir atmosphere.
 *
 * All effects are disabled when `enabled` is false, e.g. for accessibility.
 */
export function CRTEffect({
  children,
  enabled = true,
  trackingNoise = false,
}: CRTEffectProps): React.JSX.Element {
  return (
    <>
      <style>{CRT_STYLES}</style>
      <div className={enabled ? 'crt-root' : 'crt-root-plain'}>
        {children}
        {enabled && (
          <>
            {/* Scanline layer */}
            <div className="crt-scanlines" aria-hidden="true" />
            {/* Screen curvature vignette */}
            <div className="crt-vignette" aria-hidden="true" />
            {/* Optional VHS noise */}
            {trackingNoise && <div className="crt-noise" aria-hidden="true" />}
          </>
        )}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Styles injected once as a <style> tag — CSS-only, zero JS per frame
// ---------------------------------------------------------------------------

const CRT_STYLES = `
.crt-root {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* Subtle screen curvature via border-radius on a pseudo-perspective clip */
  border-radius: 4px;
}

.crt-root-plain {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Scanlines — repeating linear gradient, opacity very low for subtlety */
.crt-scanlines {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 9990;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
}

/* Vignette — radial gradient darkens the screen edges */
.crt-vignette {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 9991;
  background: radial-gradient(
    ellipse at 50% 50%,
    transparent 55%,
    rgba(0, 0, 0, 0.35) 100%
  );
}

/* VHS noise — animated grain texture using SVG turbulence filter */
.crt-noise {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 9992;
  opacity: 0.035;
  animation: crt-noise-scroll 0.12s steps(1) infinite;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 200px 200px;
}

@keyframes crt-noise-scroll {
  0%   { background-position: 0 0; }
  10%  { background-position: -5% -10%; }
  20%  { background-position: -15% 5%; }
  30%  { background-position: 7% -20%; }
  40%  { background-position: -5% 25%; }
  50%  { background-position: -15% 10%; }
  60%  { background-position: 15% 0%; }
  70%  { background-position: 0 15%; }
  80%  { background-position: 3% 35%; }
  90%  { background-position: -10% 10%; }
  100% { background-position: 0 0; }
}

/* Respect reduced-motion — disable noise animation */
@media (prefers-reduced-motion: reduce) {
  .crt-noise {
    animation: none;
  }
}
`;
