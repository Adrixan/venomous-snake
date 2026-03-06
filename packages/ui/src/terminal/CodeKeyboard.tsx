import React, { useState, useCallback } from 'react';

export interface CodeKeyboardProps {
  onInput: (text: string) => void;
  onBackspace: () => void;
  visible?: boolean;
}

type Layout = 'letters' | 'numbers' | 'symbols';

const LETTER_ROWS: ReadonlyArray<ReadonlyArray<string>> = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

const NUMBER_ROWS: ReadonlyArray<ReadonlyArray<string>> = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'],
  ['.', ',', '?', '!', "'", '`', '~'],
];

const SYMBOL_ROWS: ReadonlyArray<ReadonlyArray<string>> = [
  ['[', ']', '{', '}', '#', '%', '^', '*', '+', '='],
  ['_', '\\', '|', '~', '<', '>', '€', '£', '¥', '•'],
  ['.', ',', '?', '!', "'", '`', '~'],
];

const KEY_W = 'calc(10% - 4px)';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    background: '#080b10',
    borderTop: '1px solid #1a2a3a',
    padding: '4px 2px',
    gap: '3px',
    flexShrink: 0,
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
  },
  row: {
    display: 'flex',
    flexDirection: 'row' as const,
    justifyContent: 'center',
    gap: '3px',
  },
  key: {
    minWidth: KEY_W,
    height: '40px',
    background: '#0f1720',
    border: '1px solid #1a2a3a',
    borderRadius: '4px',
    color: '#b3b1ad',
    fontFamily: '"JetBrains Mono","Fira Code","Cascadia Code",monospace',
    fontSize: '14px',
    cursor: 'pointer',
    touchAction: 'manipulation' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 2px',
    flexShrink: 0,
    transition: 'background 0.08s, color 0.08s, border-color 0.08s',
  },
  keyActive: {
    background: 'rgba(0,255,157,0.18)',
    borderColor: '#00ff9d',
    color: '#00ff9d',
  },
  keySpecial: {
    background: '#0d1a24',
    color: '#3d4752',
    fontSize: '12px',
    letterSpacing: '0.04em',
  },
  keyBackspace: {
    background: '#0d1a24',
    color: '#ffb454',
    fontSize: '16px',
    minWidth: 'calc(15% - 4px)',
  },
  keyEnter: {
    background: 'rgba(0,255,157,0.08)',
    borderColor: '#00ff9d',
    color: '#00ff9d',
    fontSize: '12px',
    minWidth: '70px',
    letterSpacing: '0.04em',
  },
  keySpace: {
    flex: 1,
    minWidth: 0,
    background: '#0f1720',
    borderColor: '#1a2a3a',
    color: '#3d4752',
    fontSize: '11px',
    letterSpacing: '0.08em',
  },
  keyLayoutSwitch: {
    background: '#0d1a24',
    borderColor: '#1a2a3a',
    color: '#00b4d8',
    fontSize: '11px',
    minWidth: '52px',
    letterSpacing: '0.04em',
  },
} as const;

function Key({
  label,
  extraStyle,
  onPress,
}: {
  label: string;
  extraStyle?: React.CSSProperties;
  onPress: () => void;
}): React.JSX.Element {
  const [active, setActive] = useState(false);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setActive(true);
      onPress();
    },
    [onPress],
  );

  const handlePointerUp = useCallback(() => setActive(false), []);
  const handlePointerLeave = useCallback(() => setActive(false), []);

  return (
    <button
      type="button"
      tabIndex={-1}
      style={{
        ...styles.key,
        ...extraStyle,
        ...(active ? styles.keyActive : {}),
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      aria-label={label}
    >
      {label}
    </button>
  );
}

/**
 * Full custom on-screen coding keyboard for Android.
 * Bypasses the system IME by using pointer events only.
 */
export function CodeKeyboard({
  onInput,
  onBackspace,
  visible = true,
}: CodeKeyboardProps): React.JSX.Element | null {
  const [layout, setLayout] = useState<Layout>('letters');

  if (!visible) return null;

  const rows =
    layout === 'letters' ? LETTER_ROWS : layout === 'numbers' ? NUMBER_ROWS : SYMBOL_ROWS;

  const switchToLetters = () => setLayout('letters');
  const switchToNumbers = () => setLayout('numbers');
  const switchToSymbols = () => setLayout('symbols');

  return (
    <div style={styles.container} role="toolbar" aria-label="Code keyboard">
      {/* Character rows */}
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} style={styles.row}>
          {row.map((ch) => (
            <Key key={ch} label={ch} onPress={() => onInput(ch)} />
          ))}
          {/* Backspace on the last char row */}
          {rowIdx === rows.length - 1 && (
            <Key label="⌫" extraStyle={styles.keyBackspace} onPress={onBackspace} />
          )}
        </div>
      ))}

      {/* Bottom action row */}
      <div style={styles.row}>
        {layout === 'letters' && (
          <>
            <Key label="123" extraStyle={styles.keyLayoutSwitch} onPress={switchToNumbers} />
            <Key label="Sym" extraStyle={styles.keyLayoutSwitch} onPress={switchToSymbols} />
          </>
        )}
        {layout === 'numbers' && (
          <>
            <Key label="abc" extraStyle={styles.keyLayoutSwitch} onPress={switchToLetters} />
            <Key label="Sym" extraStyle={styles.keyLayoutSwitch} onPress={switchToSymbols} />
          </>
        )}
        {layout === 'symbols' && (
          <>
            <Key label="abc" extraStyle={styles.keyLayoutSwitch} onPress={switchToLetters} />
            <Key label="123" extraStyle={styles.keyLayoutSwitch} onPress={switchToNumbers} />
          </>
        )}

        <Key label="tab" extraStyle={styles.keyLayoutSwitch} onPress={() => onInput('    ')} />
        <Key label="space" extraStyle={styles.keySpace} onPress={() => onInput(' ')} />
        <Key label="↵ enter" extraStyle={styles.keyEnter} onPress={() => onInput('\n')} />
      </div>
    </div>
  );
}
