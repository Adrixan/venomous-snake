import React from 'react';

export interface MobileSymbolBarProps {
  /** Called when a symbol button is pressed */
  onSymbol: (symbol: string) => void;
  /** Whether to render the bar (defaults to true) */
  visible?: boolean;
}

const SYMBOLS = [
  '(',
  ')',
  '[',
  ']',
  '{',
  '}',
  ':',
  '=',
  '"',
  "'",
  '.',
  ',',
  '#',
  '+',
  '-',
  '*',
  '/',
  '<',
  '>',
  '!',
  '_',
];

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  overflowX: 'auto',
  overflowY: 'hidden',
  background: '#080b10',
  borderTop: '1px solid #1a2a3a',
  flexShrink: 0,
  WebkitOverflowScrolling: 'touch',
  // Hide scrollbar but keep scrollability
  scrollbarWidth: 'none',
};

const buttonStyle: React.CSSProperties = {
  minWidth: '40px',
  height: '44px',
  padding: '0 4px',
  background: 'transparent',
  border: 'none',
  borderRight: '1px solid #1a2a3a',
  color: '#00ff9d',
  fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
  fontSize: '15px',
  cursor: 'pointer',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  touchAction: 'manipulation',
};

/**
 * Row of common Python symbols for mobile keyboards.
 * Sticky at the bottom of the terminal on mobile.
 */
export function MobileSymbolBar({
  onSymbol,
  visible = true,
}: MobileSymbolBarProps): React.JSX.Element | null {
  if (!visible) return null;

  return (
    <div style={containerStyle} role="toolbar" aria-label="Python symbol shortcuts">
      {SYMBOLS.map((sym) => (
        <button
          key={sym}
          style={buttonStyle}
          onPointerDown={(e) => {
            // Use onPointerDown + preventDefault to avoid virtual keyboard interfering
            e.preventDefault();
            onSymbol(sym);
          }}
          aria-label={`Insert ${sym}`}
          tabIndex={-1}
          type="button"
        >
          {sym}
        </button>
      ))}
    </div>
  );
}
