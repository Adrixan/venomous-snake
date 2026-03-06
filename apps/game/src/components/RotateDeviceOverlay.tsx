import React from 'react';

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  background: '#0a0a0f',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1.5rem',
  fontFamily: "'Courier New', Courier, monospace",
  pointerEvents: 'all',
};

const iconStyle: React.CSSProperties = {
  transform: 'rotate(90deg)',
  color: '#00ff9d',
};

const headingStyle: React.CSSProperties = {
  color: '#00ff9d',
  fontSize: '1.5rem',
  fontWeight: 700,
  margin: 0,
  textShadow: '0 0 12px #00ff9d88',
  letterSpacing: '0.05em',
};

const subtitleStyle: React.CSSProperties = {
  color: '#00ff9d99',
  fontSize: '1rem',
  margin: 0,
  letterSpacing: '0.04em',
};

const css = `
@media (orientation: portrait) and (max-width: 1024px) and (hover: none) {
  .rotate-device-overlay { display: flex !important; }
}
`;

export function RotateDeviceOverlay(): React.JSX.Element {
  return (
    <>
      <style>{css}</style>
      <div className="rotate-device-overlay" style={{ ...overlayStyle, display: 'none' }}>
        <svg
          style={iconStyle}
          width="72"
          height="72"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00ff9d"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Phone body */}
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          {/* Home button dot */}
          <circle cx="12" cy="17" r="1" fill="#00ff9d" stroke="none" />
        </svg>
        <p style={headingStyle}>Please rotate your device</p>
        <p style={subtitleStyle}>This game is best played in landscape mode</p>
      </div>
    </>
  );
}
