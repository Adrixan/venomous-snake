import React, { useEffect, useRef } from 'react';
import type { PythonOutput } from '@venomous-snake/python-runtime';

interface OutputPanelProps {
  output: PythonOutput[];
  onClear: () => void;
}

export function OutputPanel({ output, onClear }: OutputPanelProps): React.JSX.Element {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#06060a',
        fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
        fontSize: '13px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 12px',
          backgroundColor: '#0d0d14',
          borderBottom: '1px solid #1a1a2e',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: '#4a4a6a',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Output
        </span>
        <button
          onClick={onClear}
          style={{
            background: 'none',
            border: '1px solid #1a1a2e',
            color: '#4a4a6a',
            cursor: 'pointer',
            fontSize: '11px',
            padding: '2px 8px',
            fontFamily: 'inherit',
          }}
          aria-label="Clear output"
        >
          Clear
        </button>
      </div>
      <div
        role="log"
        aria-live="polite"
        aria-label="Program output"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 12px',
        }}
      >
        {output.length === 0 ? (
          <span style={{ color: '#4a4a6a', fontStyle: 'italic' }}>
            No output yet. Run your code with Ctrl+Enter.
          </span>
        ) : (
          output.map((item, index) => (
            <pre
              key={index}
              style={{
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: item.type === 'stderr' ? '#ff3366' : '#c0ffc0',
                lineHeight: '1.5',
              }}
            >
              {item.text}
            </pre>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
