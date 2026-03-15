import React, { useState, useCallback, useRef } from 'react';

export interface CodeKeyboardProps {
  onInput: (text: string) => void;
  onBackspace: () => void;
  visible?: boolean;
  keyboardLayout?: 'qwerty' | 'qwertz';
}

/* ── Layout data ─────────────────────────────────────────────────────── */

const NUMBER_ROW: ReadonlyArray<string> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

const SYMBOL_BAR: ReadonlyArray<string> = [
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
  '_',
  '<',
  '>',
  '!',
  '@',
  '\\',
  '|',
  '%',
  '^',
  '&',
  '~',
];

const QWERTY_ROWS: ReadonlyArray<ReadonlyArray<string>> = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

const QWERTZ_ROWS: ReadonlyArray<ReadonlyArray<string>> = [
  ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['y', 'x', 'c', 'v', 'b', 'n', 'm'],
];

/* ── Shared dimensions ───────────────────────────────────────────────── */

const KEY_W = 'calc(10% - 4px)';
const FONT_FAMILY = '"JetBrains Mono","Fira Code","Cascadia Code",monospace';
const DOUBLE_TAP_MS = 300;

/* ── Styles ──────────────────────────────────────────────────────────── */

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
    fontFamily: FONT_FAMILY,
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
  keyNumber: {
    height: '34px',
    fontSize: '13px',
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
  keyTab: {
    background: '#0d1a24',
    borderColor: '#1a2a3a',
    color: '#00b4d8',
    fontSize: '11px',
    minWidth: '52px',
    letterSpacing: '0.04em',
  },
  keyShift: {
    background: '#0d1a24',
    borderColor: '#1a2a3a',
    color: '#3d4752',
    fontSize: '16px',
    minWidth: 'calc(15% - 4px)',
  },
  keyShiftActive: {
    background: 'rgba(0,255,157,0.12)',
    borderColor: '#00ff9d',
    color: '#00ff9d',
  },
  keyShiftCapsLock: {
    background: 'rgba(0,255,157,0.22)',
    borderColor: '#00ff9d',
    color: '#00ff9d',
    boxShadow: '0 0 6px rgba(0,255,157,0.35)',
  },
  symbolBar: {
    display: 'flex',
    flexDirection: 'row' as const,
    overflowX: 'auto' as const,
    overflowY: 'hidden' as const,
    flexShrink: 0,
    WebkitOverflowScrolling: 'touch' as const,
    scrollbarWidth: 'none' as const,
    gap: '0px',
  },
  symbolKey: {
    minWidth: '40px',
    height: '44px',
    padding: '0 4px',
    background: 'transparent',
    border: 'none',
    borderRight: '1px solid #1a2a3a',
    color: '#00ff9d',
    fontFamily: FONT_FAMILY,
    fontSize: '15px',
    cursor: 'pointer',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
    touchAction: 'manipulation' as const,
  },
} as const;

/* ── Key sub-component ───────────────────────────────────────────────── */

function Key({
  label,
  ariaLabel,
  extraStyle,
  onPress,
}: {
  label: string;
  ariaLabel?: string;
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
      aria-label={ariaLabel ?? label}
    >
      {label}
    </button>
  );
}

/* ── Main component ──────────────────────────────────────────────────── */

/**
 * Full custom on-screen coding keyboard for Android.
 * Bypasses the system IME by using pointer events only.
 *
 * Features:
 * - Always-visible number row and scrollable Python symbol bar
 * - Shift key with single-tap (one-shot) and double-tap (caps lock)
 * - QWERTY / QWERTZ layout support
 */
export function CodeKeyboard({
  onInput,
  onBackspace,
  visible = true,
  keyboardLayout = 'qwerty',
}: CodeKeyboardProps): React.JSX.Element | null {
  const [shiftActive, setShiftActive] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const lastShiftTap = useRef<number>(0);

  const letterRows = keyboardLayout === 'qwertz' ? QWERTZ_ROWS : QWERTY_ROWS;

  /* Handle character input — deactivates one-shot shift after a letter */
  const handleChar = useCallback(
    (ch: string) => {
      const out = shiftActive || capsLock ? ch.toUpperCase() : ch;
      onInput(out);
      // One-shot shift: deactivate after one character (but not caps lock)
      if (shiftActive && !capsLock) {
        setShiftActive(false);
      }
    },
    [onInput, shiftActive, capsLock],
  );

  /* Shift: single-tap toggles one-shot shift, double-tap toggles caps lock */
  const handleShift = useCallback(() => {
    const now = Date.now();
    if (now - lastShiftTap.current < DOUBLE_TAP_MS) {
      // Double-tap: toggle caps lock
      setCapsLock((prev) => {
        const next = !prev;
        setShiftActive(next);
        return next;
      });
    } else if (capsLock) {
      // Single tap while caps lock is on: turn everything off
      setCapsLock(false);
      setShiftActive(false);
    } else {
      // Single tap: toggle one-shot shift
      setShiftActive((prev) => !prev);
    }
    lastShiftTap.current = now;
  }, [capsLock]);

  /* Compute shift key styling */
  const shiftStyle: React.CSSProperties = {
    ...styles.keyShift,
    ...(capsLock ? styles.keyShiftCapsLock : shiftActive ? styles.keyShiftActive : {}),
  };

  if (!visible) return null;

  return (
    <div style={styles.container} role="toolbar" aria-label="Code keyboard">
      {/* Always-visible number row */}
      <div style={styles.row}>
        {NUMBER_ROW.map((n) => (
          <Key key={n} label={n} extraStyle={styles.keyNumber} onPress={() => onInput(n)} />
        ))}
      </div>

      {/* Scrollable Python symbol bar */}
      <div style={styles.symbolBar} role="toolbar" aria-label="Python symbol shortcuts">
        {SYMBOL_BAR.map((sym) => (
          <button
            key={sym}
            type="button"
            tabIndex={-1}
            style={styles.symbolKey}
            onPointerDown={(e: React.PointerEvent) => {
              e.preventDefault();
              onInput(sym);
            }}
            aria-label={`Insert ${sym}`}
          >
            {sym}
          </button>
        ))}
      </div>

      {/* Letter rows */}
      {letterRows.map((row, rowIdx) => (
        <div key={rowIdx} style={styles.row}>
          {/* Shift key on the left of the bottom letter row */}
          {rowIdx === 2 && (
            <Key
              label="⇧"
              ariaLabel={capsLock ? 'Caps lock on' : shiftActive ? 'Shift on' : 'Shift'}
              extraStyle={shiftStyle}
              onPress={handleShift}
            />
          )}
          {row.map((ch) => (
            <Key
              key={ch}
              label={shiftActive || capsLock ? ch.toUpperCase() : ch}
              onPress={() => handleChar(ch)}
            />
          ))}
          {/* Backspace on the right of the bottom letter row */}
          {rowIdx === 2 && (
            <Key
              label="⌫"
              ariaLabel="Backspace"
              extraStyle={styles.keyBackspace}
              onPress={onBackspace}
            />
          )}
        </div>
      ))}

      {/* Bottom action row */}
      <div style={styles.row}>
        <Key
          label="tab"
          ariaLabel="Tab"
          extraStyle={styles.keyTab}
          onPress={() => onInput('    ')}
        />
        <Key
          label="space"
          ariaLabel="Space"
          extraStyle={styles.keySpace}
          onPress={() => onInput(' ')}
        />
        <Key
          label="↵ enter"
          ariaLabel="Enter"
          extraStyle={styles.keyEnter}
          onPress={() => onInput('\n')}
        />
      </div>
    </div>
  );
}
