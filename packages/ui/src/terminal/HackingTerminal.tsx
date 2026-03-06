import React, { useState, useEffect, useCallback, useRef } from 'react';
import type {
  PythonInterpreter,
  PythonOutput,
  InterpreterStatus,
} from '@venomous-snake/shared-types';
import { TerminalEditor } from './TerminalEditor';
import { OutputPanel } from './OutputPanel';
import './terminal.css';

interface HackingTerminalProps {
  interpreter: PythonInterpreter;
  challengeId?: string;
  initialCode?: string;
  readOnlyRanges?: Array<{ from: number; to: number }>;
  onClose: () => void;
  onSubmit?: (code: string) => void;
}

const statusColors: Record<InterpreterStatus, string> = {
  uninitialized: '#3d4752',
  loading: '#ffb454',
  ready: '#00ff9d',
  executing: '#00b4d8',
  error: '#ff3333',
};

const statusLabels: Record<InterpreterStatus, string> = {
  uninitialized: 'Offline',
  loading: 'Loading...',
  ready: 'Ready',
  executing: 'Executing...',
  error: 'Error',
};

function HackingTerminalInner({
  interpreter,
  initialCode = '# Write your Python code here\n',
  readOnlyRanges,
  onClose,
  onSubmit,
}: HackingTerminalProps): React.JSX.Element {
  const [outputs, setOutputs] = useState<PythonOutput[]>([]);
  const [status, setStatus] = useState<InterpreterStatus>('uninitialized');
  const [inputPrompt, setInputPrompt] = useState<string | undefined>(undefined);
  const cleanupRef = useRef<Array<() => void>>([]);

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    cleanupRef.current = cleanups;

    const unsubOutput = interpreter.onOutput((output) => {
      setOutputs((prev) => [...prev, output]);
    });
    cleanups.push(unsubOutput);

    const unsubInput = interpreter.onInputRequest((prompt) => {
      setInputPrompt(prompt);
    });
    cleanups.push(unsubInput);

    if (!interpreter.isReady()) {
      setStatus('loading');
      interpreter
        .initialize()
        .then(() => {
          setStatus('ready');
        })
        .catch((_err: unknown) => {
          setStatus('error');
        });
    } else {
      setStatus('ready');
    }

    return () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  }, [interpreter]);

  const handleRun = useCallback(
    async (code: string) => {
      if (!interpreter.isReady()) return;

      setStatus('executing');
      try {
        const result = await interpreter.execute(code);
        setOutputs((prev) => [...prev, ...result.output]);
        if (result.error) {
          const errorOutput: PythonOutput = {
            type: 'stderr',
            text: result.error.traceback ?? `${result.error.type}: ${result.error.message}`,
          };
          setOutputs((prev) => [...prev, errorOutput]);
        }
        onSubmit?.(code);
      } finally {
        setStatus('ready');
      }
    },
    [interpreter, onSubmit],
  );

  const handleRunSync = useCallback(
    (code: string) => {
      void handleRun(code);
    },
    [handleRun],
  );

  const handleClear = useCallback(() => {
    setOutputs([]);
  }, []);

  const handleInputSubmit = useCallback(
    (value: string) => {
      interpreter.provideInput(value);
      setInputPrompt(undefined);
    },
    [interpreter],
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  const version = interpreter.getVersion();
  const isDisabled = status !== 'ready';
  const statusColor = statusColors[status];

  return (
    <div className="terminal-container">
      {/* Header */}
      <div className="terminal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="terminal-title">▶ PYTHON TERMINAL</span>
          <span
            className="terminal-status-indicator"
            style={{
              backgroundColor: statusColor,
              boxShadow: `0 0 6px ${statusColor}`,
            }}
            title={statusLabels[status]}
          />
          <span style={{ color: statusColor, fontSize: '12px' }}>{statusLabels[status]}</span>
        </div>
        <div className="terminal-header-actions">
          <button
            className="terminal-btn terminal-btn-close"
            onClick={handleClose}
            aria-label="Close terminal (Escape)"
          >
            ✕ CLOSE
          </button>
        </div>
      </div>

      {/* Main content */}
      {status === 'loading' ? (
        <div className="terminal-loading">
          <div className="terminal-spinner" />
          <span>Initializing Python interpreter...</span>
        </div>
      ) : (
        <div className="terminal-split">
          <div className="terminal-editor-area">
            <TerminalEditor
              initialCode={initialCode}
              onRun={handleRunSync}
              disabled={isDisabled}
              {...(readOnlyRanges ? { readOnlyRanges } : {})}
            />
          </div>
          <OutputPanel
            outputs={outputs}
            onClear={handleClear}
            {...(inputPrompt !== undefined
              ? { inputPrompt, onInputSubmit: handleInputSubmit }
              : {})}
          />
        </div>
      )}

      {/* Status bar */}
      <div className="terminal-status-bar">
        <span>{version}</span>
        <span>Ctrl+Enter to run • Esc to close</span>
      </div>
    </div>
  );
}

export const HackingTerminal = React.memo(HackingTerminalInner);
