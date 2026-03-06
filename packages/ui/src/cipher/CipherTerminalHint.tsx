import React, { useState, useEffect, useRef } from 'react';

interface CipherTerminalHintProps {
  hint: string;
  onDismiss: () => void;
}

export function CipherTerminalHint({
  hint,
  onDismiss,
}: CipherTerminalHintProps): React.JSX.Element {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Trigger slide-in on mount
    timerRef.current = setTimeout(() => setVisible(true), 30);
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  const handleDismiss = (): void => {
    setVisible(false);
    // Let transition finish before calling onDismiss
    timerRef.current = setTimeout(onDismiss, 300);
  };

  return (
    <>
      <style>{`
        @keyframes cipher-hint-slide {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
      <div
        role="note"
        aria-label="CIPHER hint"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          background: '#0d1117',
          border: '1px solid #ffb45488',
          borderLeft: '3px solid #ffb454',
          borderRadius: '4px',
          padding: '10px 12px',
          boxShadow: '0 0 10px #ffb45422',
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Miniature CIPHER face (32×32 SVG) */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 80 80"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        >
          <circle cx="40" cy="40" r="37" fill="#0a0e14" />
          <circle cx="40" cy="40" r="37" fill="none" stroke="#ffb454" strokeWidth="2.5" />
          <rect x="16" y="20" width="48" height="44" rx="6" fill="#0d1117" />
          <rect x="20" y="30" width="16" height="10" rx="2" fill="#ffb454" />
          <rect x="44" y="30" width="16" height="10" rx="2" fill="#ffb454" />
          <path
            d="M 28 56 Q 40 63 52 56"
            stroke="#ffb454"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        {/* Hint content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '9px',
              letterSpacing: '2px',
              color: '#ffb454',
              textTransform: 'uppercase',
              fontWeight: 700,
              marginBottom: '4px',
            }}
          >
            CIPHER · HINT
          </div>
          <p
            style={{
              margin: 0,
              color: '#cdd6f4',
              fontSize: '12px',
              lineHeight: 1.55,
              wordBreak: 'break-word',
            }}
          >
            {hint}
          </p>
        </div>

        {/* Dismiss button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss hint"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ffb45488',
            cursor: 'pointer',
            padding: '0 2px',
            fontSize: '16px',
            lineHeight: 1,
            flexShrink: 0,
            alignSelf: 'flex-start',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#ffb454';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#ffb45488';
          }}
        >
          ×
        </button>
      </div>
    </>
  );
}
