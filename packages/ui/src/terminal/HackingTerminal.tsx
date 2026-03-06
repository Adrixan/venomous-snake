import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { PythonInterpreter, PythonOutput, InterpreterStatus } from '@venomous-snake/python-runtime';
import { PyodideInterpreter } from '@venomous-snake/python-runtime';
import { PythonEditor } from './PythonEditor';
import { OutputPanel } from './OutputPanel';

interface HackingTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HackingTerminal({ isOpen, onClose }: HackingTerminalProps): React.JSX.Element | null {
  const [output, setOutput] = useState<PythonOutput[]>([]);
  const [status, setStatus] = useState<InterpreterStatus>('uninitialized');
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);
  const [code, setCode] = useState('# Write your Python code here\nprint("Hello, hacker!")\n');
  const interpreterRef = useRef<PythonInterpreter | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const interpreter = new PyodideInterpreter();
    interpreterRef.current = interpreter;
    setStatus('loading');

    interpreter
      .initialize()
      .then(() => {
        setStatus('ready');
      })
      .catch((err: unknown) => {
        console.error('Failed to initialize interpreter:', err);
        setStatus('error');
      });

    return () => {
      void interpreter.terminate();
      interpreterRef.current = null;
      setStatus('uninitialized');
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleRun = useCallback(async (codeToRun: string) => {
    const interpreter = interpreterRef.current;
    if (!interpreter || !interpreter.isReady()) return;

    setStatus('executing');
    const result = await interpreter.execute(codeToRun);
    setOutput((prev) => [...prev, ...result.output]);
    setExecutionTimeMs(result.executionTimeMs);
    setStatus('ready');
  }, []);

  const handleClear = useCallback(() => {
    setOutput([]);
    setExecutionTimeMs(null);
  }, []);

  const handleChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  const handleRunFromButton = useCallback(() => {
    void handleRun(code);
  }, [handleRun, code]);

  if (!isOpen) return null;

  const statusColor: Record<InterpreterStatus, string> = {
    uninitialized: '#4a4a6a',
    loading: '#ffd700',
    ready: '#00ff9d',
    executing: '#00b4d8',
    error: '#ff3366',
  };

  const statusLabel: Record<InterpreterStatus, string> = {
    uninitialized: 'Offline',
    loading: 'Loading Pyodide...',
    ready: 'Ready',
    executing: 'Executing...',
    error: 'Error',
  };

  const version = interpreterRef.current?.getVersion() ?? 'Python';

  return (
    <div
      role="dialog"
      aria-label="Hacking Terminal"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
      }}
    >
      <div
        style={{
          width: '90vw',
          maxWidth: '1200px',
          height: '80vh',
          backgroundColor: '#0a0a0f',
          border: '1px solid #00ff9d',
          boxShadow: '0 0 40px rgba(0, 255, 157, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            backgroundColor: '#0d0d14',
            borderBottom: '1px solid #1a1a2e',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                color: '#00ff9d',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '14px',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
              }}
            >
              ▶ PYTHON TERMINAL
            </span>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: statusColor[status],
                display: 'inline-block',
                boxShadow: `0 0 6px ${statusColor[status]}`,
              }}
              title={statusLabel[status]}
            />
            <span style={{ color: statusColor[status], fontSize: '12px', fontFamily: 'monospace' }}>
              {statusLabel[status]}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={handleRunFromButton}
              disabled={status !== 'ready'}
              style={{
                background: status === 'ready' ? '#00ff9d20' : 'transparent',
                border: `1px solid ${status === 'ready' ? '#00ff9d' : '#4a4a6a'}`,
                color: status === 'ready' ? '#00ff9d' : '#4a4a6a',
                cursor: status === 'ready' ? 'pointer' : 'not-allowed',
                fontSize: '12px',
                padding: '4px 12px',
                fontFamily: '"JetBrains Mono", monospace',
              }}
              aria-label="Run code (Ctrl+Enter)"
            >
              ▶ RUN
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: '1px solid #ff3366',
                color: '#ff3366',
                cursor: 'pointer',
                fontSize: '12px',
                padding: '4px 12px',
                fontFamily: '"JetBrains Mono", monospace',
              }}
              aria-label="Close terminal (Escape)"
            >
              ✕ CLOSE
            </button>
          </div>
        </div>

        {/* Editor + Output split */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflow: 'hidden', borderRight: '1px solid #1a1a2e' }}>
            <PythonEditor
              initialCode={code}
              onChange={handleChange}
              onRun={(c) => {
                void handleRun(c);
              }}
              readOnly={status === 'executing'}
            />
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <OutputPanel output={output} onClear={handleClear} />
          </div>
        </div>

        {/* Status bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 16px',
            backgroundColor: '#0d0d14',
            borderTop: '1px solid #1a1a2e',
            flexShrink: 0,
            fontSize: '11px',
            fontFamily: '"JetBrains Mono", monospace',
            color: '#4a4a6a',
          }}
        >
          <span>{version}</span>
          {executionTimeMs !== null ? <span>Last run: {executionTimeMs}ms</span> : null}
          <span>Ctrl+Enter to run • Esc to close</span>
        </div>
      </div>
    </div>
  );
}
