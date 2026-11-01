import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { difficultyLabel, localizedScaffold, testLabel } from './challengeText';
import { structureLabel } from './structureLabel';
import { CipherTerminalHint } from '../cipher/CipherTerminalHint';
import { useCipher } from '../cipher/useCipher';
import type {
  PythonInterpreter,
  PythonOutput,
  InterpreterStatus,
} from '@venomous-snake/shared-types';
import { TerminalEditor } from './TerminalEditor';
import type { TerminalEditorHandle } from './TerminalEditor';
import { OutputPanel } from './OutputPanel';
import { MobileSymbolBar } from './MobileSymbolBar';
import { CodeKeyboard } from './CodeKeyboard';
import { ChallengeSuccessOverlay } from './ChallengeSuccessOverlay';
import { useChallengeTerminal } from './useChallengeTerminal';
import { useBreakpoint } from '../responsive/useBreakpoint';
import { useIsAndroid } from './useIsAndroid';
import './terminal.css';

interface Objective {
  description: string;
  hidden: boolean;
  status: 'passed' | 'failed' | 'pending';
}

function useKeyboardSettings(): {
  keyboardLayout: 'qwerty' | 'qwertz';
  useNativeKeyboard: boolean;
  keyboardSize: 'small' | 'medium' | 'large';
  showDesktopKeyboard: boolean;
} {
  const [settings, setSettings] = useState<{
    keyboardLayout: 'qwerty' | 'qwertz';
    useNativeKeyboard: boolean;
    keyboardSize: 'small' | 'medium' | 'large';
    showDesktopKeyboard: boolean;
  }>({
    keyboardLayout: 'qwerty',
    useNativeKeyboard: false,
    keyboardSize: 'medium',
    showDesktopKeyboard: false,
  });
  useEffect(() => {
    try {
      const raw = localStorage.getItem('vs-settings');
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        const size = parsed['keyboardSize'];
        setSettings({
          keyboardLayout: parsed['keyboardLayout'] === 'qwertz' ? 'qwertz' : 'qwerty',
          useNativeKeyboard: parsed['useNativeKeyboard'] === true,
          keyboardSize: size === 'small' || size === 'medium' || size === 'large' ? size : 'medium',
          showDesktopKeyboard: parsed['showDesktopKeyboard'] === true,
        });
      }
    } catch {
      /* ignore */
    }
  }, []);
  return settings;
}

/** Convert keys like "challenges.ch01_02.title" to "challenges:ch01_02.title" for i18next namespace resolution */
function nsKey(key: string): string {
  const dot = key.indexOf('.');
  if (dot === -1) return key;
  return key.substring(0, dot) + ':' + key.substring(dot + 1);
}

interface HackingTerminalProps {
  interpreter?: PythonInterpreter;
  challengeId?: string;
  initialCode?: string;
  readOnlyRanges?: Array<{ from: number; to: number }>;
  onClose: () => void;
  onSubmit?: (code: string) => void;
  /** Called when a challenge is successfully completed */
  onChallengeSuccess?: (challengeId: string, xpEarned: number) => void;
}

const statusColors: Record<InterpreterStatus, string> = {
  uninitialized: '#3d4752',
  loading: '#ffb454',
  ready: '#00ff9d',
  executing: '#00b4d8',
  error: '#ff3333',
};

const statusLabelKeys: Record<InterpreterStatus, string> = {
  uninitialized: 'ui:terminal.state.offline',
  loading: 'ui:terminal.state.loading',
  ready: 'ui:terminal.state.ready',
  executing: 'ui:terminal.state.executing',
  error: 'ui:terminal.state.error',
};

// Module-level counter to ensure each free-mode terminal gets a unique key
let _freeEditorSessionId = 0;

// ─── Free-form terminal (existing behaviour) ──────────────────────────────────

interface FreeModeProps {
  interpreter: PythonInterpreter;
  initialCode: string;
  readOnlyRanges?: Array<{ from: number; to: number }>;
  onClose: () => void;
  onSubmit?: (code: string) => void;
}

function FreeModeTerminal({
  interpreter,
  initialCode,
  readOnlyRanges,
  onClose,
  onSubmit,
}: FreeModeProps): React.JSX.Element {
  const { t } = useTranslation('ui');
  const [outputs, setOutputs] = useState<PythonOutput[]>([]);
  const [status, setStatus] = useState<InterpreterStatus>('uninitialized');
  const [inputPrompt, setInputPrompt] = useState<string | undefined>(undefined);
  const editorRef = useRef<TerminalEditorHandle>(null);
  const [editorKey] = useState(() => ++_freeEditorSessionId);
  const breakpoint = useBreakpoint();
  const isAndroid = useIsAndroid();
  const keyboardSettings = useKeyboardSettings();

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    cleanups.push(interpreter.onOutput((output) => setOutputs((prev) => [...prev, output])));
    cleanups.push(interpreter.onInputRequest((prompt) => setInputPrompt(prompt)));

    if (!interpreter.isReady()) {
      setStatus('loading');
      interpreter
        .initialize()
        .then(() => setStatus('ready'))
        .catch(() => setStatus('error'));
    } else {
      setStatus('ready');
    }

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, [interpreter]);

  const handleRun = useCallback(
    async (code: string) => {
      if (!interpreter.isReady()) return;
      setStatus('executing');
      try {
        const result = await interpreter.execute(code, {
          timeoutMessage: (seconds) => t('terminal.failure.time_limit', { seconds }),
        });
        setOutputs((prev) => [...prev, ...result.output]);
        if (result.error !== undefined) {
          const err = result.error;
          setOutputs((prev) => [
            ...prev,
            {
              type: 'stderr' as const,
              text: err.traceback ?? `${err.type}: ${err.message}`,
            },
          ]);
        }
        onSubmit?.(code);
      } finally {
        setStatus('ready');
      }
    },
    [interpreter, onSubmit, t],
  );

  const handleRunSync = useCallback((code: string) => void handleRun(code), [handleRun]);
  const handleClear = useCallback(() => setOutputs([]), []);
  const handleInputSubmit = useCallback(
    (value: string) => {
      interpreter.provideInput(value);
      setInputPrompt(undefined);
    },
    [interpreter],
  );
  const handleClose = useCallback(() => onClose(), [onClose]);
  const handleSymbol = useCallback((sym: string) => editorRef.current?.insertAtCursor(sym), []);
  const handleBackspace = useCallback(() => editorRef.current?.deleteAtCursor(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClose]);

  const isDisabled = status !== 'ready';
  const statusColor = statusColors[status];

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="terminal-title">{t('terminal.python_title')}</span>
          <span
            className="terminal-status-indicator"
            style={{ backgroundColor: statusColor, boxShadow: `0 0 6px ${statusColor}` }}
            title={t(statusLabelKeys[status])}
          />
          <span style={{ color: statusColor, fontSize: '12px' }}>{t(statusLabelKeys[status])}</span>
        </div>
        <div className="terminal-header-actions">
          <button
            className="terminal-btn terminal-btn-close"
            onClick={handleClose}
            aria-label={t('terminal.close_aria')}
          >
            {t('terminal.close_button')}
          </button>
        </div>
      </div>

      {status === 'loading' ? (
        <div className="terminal-loading">
          <div className="terminal-spinner" />
          <span>{t('terminal.initializing')}</span>
        </div>
      ) : (
        <div
          className="terminal-split"
          style={breakpoint === 'mobile' ? { flexDirection: 'column' } : undefined}
        >
          <div className="terminal-editor-area">
            <TerminalEditor
              key={editorKey}
              ref={editorRef}
              initialCode={initialCode}
              onRun={handleRunSync}
              disabled={isDisabled}
              {...(isAndroid && !keyboardSettings.useNativeKeyboard ? { isAndroid: true } : {})}
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

      {(breakpoint === 'mobile' || keyboardSettings.showDesktopKeyboard) &&
        status !== 'loading' &&
        ((isAndroid && !keyboardSettings.useNativeKeyboard) ||
        (breakpoint !== 'mobile' && keyboardSettings.showDesktopKeyboard) ? (
          <CodeKeyboard
            onInput={handleSymbol}
            onBackspace={handleBackspace}
            keyboardLayout={keyboardSettings.keyboardLayout}
            keyboardSize={keyboardSettings.keyboardSize}
          />
        ) : (
          <MobileSymbolBar onSymbol={handleSymbol} />
        ))}

      <div className="terminal-status-bar">
        <span>{interpreter.getVersion()}</span>
        <span>{t('terminal.free_hint')}</span>
      </div>
    </div>
  );
}

// ─── Challenge-mode terminal ──────────────────────────────────────────────────

interface ChallengeModeProps {
  challengeId: string;
  readOnlyRanges?: Array<{ from: number; to: number }>;
  onClose: () => void;
  onSubmit?: (code: string) => void;
  onChallengeSuccess?: (challengeId: string, xpEarned: number) => void;
}

function ChallengeModeTerminal({
  challengeId,
  readOnlyRanges,
  onClose,
  onSubmit,
  onChallengeSuccess,
}: ChallengeModeProps): React.JSX.Element {
  const { t } = useTranslation(['challenges', 'ui']);
  const {
    challenge,
    outputs,
    isRunning,
    result,
    runError,
    hints,
    challengeResult,
    submitCode,
    runCode,
    resetState,
    requestHint,
    interpreter,
  } = useChallengeTerminal(challengeId);

  const [editorKey, setEditorKey] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const editorRef = useRef<TerminalEditorHandle>(null);
  const breakpoint = useBreakpoint();
  const isAndroid = useIsAndroid();
  const keyboardSettings = useKeyboardSettings();
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Force editor remount when challenge changes
  useEffect(() => {
    setEditorKey((k) => k + 1);
  }, [challengeId]);

  // Show success overlay when challenge passes
  useEffect(() => {
    if (result?.passed === true) {
      setShowSuccess(true);
      if (challenge !== null) {
        onChallengeSuccess?.(challenge.id, result.xpEarned ?? challenge.xpReward);
      }
    }
  }, [result, challenge, onChallengeSuccess]);

  const handleRun = useCallback(
    (code: string) => {
      void runCode(code);
    },
    [runCode],
  );

  const handleSubmit = useCallback(
    (code: string) => {
      void submitCode(code);
      onSubmit?.(code);
    },
    [submitCode, onSubmit],
  );

  const handleReset = useCallback(() => {
    resetState();
    setEditorKey((k) => k + 1);
  }, [resetState]);

  const handleSymbol = useCallback((sym: string) => editorRef.current?.insertAtCursor(sym), []);
  const handleBackspace = useCallback(() => editorRef.current?.deleteAtCursor(), []);

  const handleClose = useCallback(() => {
    if (successTimerRef.current !== null) clearTimeout(successTimerRef.current);
    onClose();
  }, [onClose]);

  const handleSuccessDismiss = useCallback(() => {
    setShowSuccess(false);
    handleClose();
  }, [handleClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !showSuccess) handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClose, showSuccess]);

  const status: InterpreterStatus = isRunning
    ? 'executing'
    : interpreter.isReady()
      ? 'ready'
      : 'loading';
  const statusColor = statusColors[status];
  const isDisabled = isRunning;
  const initialCode =
    challenge !== null ? localizedScaffold(challenge) : t('ui:terminal.empty_editor');

  // CIPHER explains what went wrong when a run fails.
  const { currentMessage, dismissDialog, showErrorExplanation } = useCipher();
  useEffect(() => {
    if (runError !== null) showErrorExplanation(runError.type, runError.message);
  }, [runError, showErrorExplanation]);

  // Derive per-test objective status from last challengeResult
  const testResults = challengeResult?.testResults;
  const objectives: Objective[] =
    challenge?.testCases.map((tc, i) => {
      const tr = testResults?.[i];
      const objStatus: Objective['status'] =
        tr !== undefined ? (tr.passed ? 'passed' : 'failed') : 'pending';
      return {
        description: testLabel(t, challenge.id, tc),
        hidden: tc.hidden,
        status: objStatus,
      };
    }) ?? [];
  // Writing rules are visible up front; they are only judged once the output tests pass.
  const testsPassed = challenge?.testCases.every((_, i) => testResults?.[i]?.passed === true);
  for (const check of challenge?.structureChecks ?? []) {
    const unmet = testResults?.some((tr) => tr.structureCheck === check) === true;
    objectives.push({
      description: structureLabel(t, check),
      hidden: false,
      status: unmet ? 'failed' : testsPassed === true ? 'passed' : 'pending',
    });
  }

  return (
    <div className="terminal-container" style={{ position: 'relative' }}>
      {/* Header */}
      <div className="terminal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="terminal-title">
            {challenge !== null
              ? t('ui:terminal.challenge_title', {
                  chapter: challenge.chapter,
                  order: challenge.order,
                })
              : t('ui:terminal.fallback_title')}
          </span>
          <span
            className="terminal-status-indicator"
            style={{ backgroundColor: statusColor, boxShadow: `0 0 6px ${statusColor}` }}
            title={t(statusLabelKeys[status])}
          />
          <span style={{ color: statusColor, fontSize: '12px' }}>{t(statusLabelKeys[status])}</span>
        </div>
        <div className="terminal-header-actions">
          <button
            className="terminal-btn"
            onClick={handleReset}
            disabled={isDisabled}
            aria-label={t('ui:terminal.reset_aria')}
            style={{ fontSize: '12px', color: '#ffb454', borderColor: '#ffb454' }}
          >
            {t('ui:terminal.reset_button')}
          </button>
          <button
            className="terminal-btn terminal-btn-close"
            onClick={handleClose}
            aria-label={t('ui:terminal.close_aria')}
          >
            {t('ui:terminal.close_button')}
          </button>
        </div>
      </div>

      {/* Challenge description & instructions */}
      {challenge !== null && (
        <div className="terminal-challenge-desc">
          <div className="terminal-challenge-desc-title">
            {`${t('ui:terminal.challenge_code', {
              chapter: String(challenge.chapter).padStart(2, '0'),
              order: String(challenge.order).padStart(2, '0'),
            })} • ${t(nsKey(challenge.titleKey))}`}
          </div>
          <div className="terminal-challenge-desc-meta">
            {difficultyLabel(t, challenge.difficulty).toUpperCase()} •{' '}
            {t('ui:challenge.xp_earned', { xp: challenge.xpReward })}
          </div>
          <div className="terminal-challenge-desc-body">{t(nsKey(challenge.descriptionKey))}</div>
        </div>
      )}

      {/* Mission Objectives — persistent checklist derived from test cases */}
      {objectives.length > 0 && (
        <div className="terminal-objectives">
          <div className="terminal-objectives-title">
            {t('ui:terminal.objectives', {
              passed: objectives.filter((o) => !o.hidden && o.status === 'passed').length,
              total: objectives.filter((o) => !o.hidden).length,
            })}
          </div>
          {objectives
            .filter((o) => !o.hidden)
            .map((obj, i) => (
              <div key={i} className={`terminal-objective-item ${obj.status}`}>
                <span className="terminal-objective-check">
                  {obj.status === 'passed' ? '✓' : obj.status === 'failed' ? '✗' : '○'}
                </span>
                <span>{obj.description}</span>
              </div>
            ))}
        </div>
      )}

      {/* Editor + output */}
      <div
        className="terminal-split"
        style={breakpoint === 'mobile' ? { flexDirection: 'column' } : undefined}
      >
        <div className="terminal-editor-area" data-tutorial="code-editor">
          <TerminalEditor
            key={editorKey}
            ref={editorRef}
            initialCode={initialCode}
            onRun={handleRun}
            onSubmit={handleSubmit}
            disabled={isDisabled}
            {...(isAndroid && !keyboardSettings.useNativeKeyboard ? { isAndroid: true } : {})}
            {...(readOnlyRanges ? { readOnlyRanges } : {})}
          />
        </div>
        <OutputPanel outputs={outputs} onClear={resetState} />
      </div>

      {/* Result panel */}
      {result !== null && (
        <div className="terminal-result-panel">
          {result.passed ? (
            <div className="terminal-result-pass">
              <span>{t('ui:terminal.hack_successful')}</span>
            </div>
          ) : (
            <div className="terminal-result-fail">
              <span>{t('ui:terminal.tests_failed')}</span>
            </div>
          )}
        </div>
      )}

      {/* Hints panel */}
      <button
        className="terminal-btn"
        onClick={requestHint}
        disabled={isRunning || result?.passed === true}
      >
        💡 {t('ui:terminal.hint')}
      </button>
      {hints.length > 0 && (
        <div className="terminal-hints-panel">
          <div className="terminal-hints-title">{t('ui:terminal.cipher_hint_title')}</div>
          {hints.map((hint, i) => (
            <div key={i} className="terminal-hint-item">
              {hint}
            </div>
          ))}
        </div>
      )}

      {currentMessage !== null && (
        <CipherTerminalHint hint={currentMessage} onDismiss={dismissDialog} />
      )}

      {/* Mobile symbol bar / on-screen keyboard */}
      {(breakpoint === 'mobile' || keyboardSettings.showDesktopKeyboard) &&
        ((isAndroid && !keyboardSettings.useNativeKeyboard) ||
        (breakpoint !== 'mobile' && keyboardSettings.showDesktopKeyboard) ? (
          <CodeKeyboard
            onInput={handleSymbol}
            onBackspace={handleBackspace}
            keyboardLayout={keyboardSettings.keyboardLayout}
            keyboardSize={keyboardSettings.keyboardSize}
          />
        ) : (
          <MobileSymbolBar onSymbol={handleSymbol} />
        ))}

      {/* Status bar */}
      <div className="terminal-status-bar">
        <span>{interpreter.getVersion()}</span>
        <span>{t('ui:terminal.challenge_hint')}</span>
      </div>

      {/* Success overlay */}
      {showSuccess && challenge !== null && (
        <ChallengeSuccessOverlay
          challengeTitle={t(nsKey(challenge.titleKey))}
          xpEarned={result?.xpEarned ?? challenge.xpReward}
          onDismiss={handleSuccessDismiss}
        />
      )}
    </div>
  );
}

// ─── Public export ─────────────────────────────────────────────────────────────

function HackingTerminalInner(props: HackingTerminalProps): React.JSX.Element {
  const { t } = useTranslation('ui');
  const {
    challengeId,
    interpreter,
    initialCode,
    readOnlyRanges,
    onClose,
    onSubmit,
    onChallengeSuccess,
  } = props;

  if (challengeId !== undefined) {
    return (
      <ChallengeModeTerminal
        challengeId={challengeId}
        onClose={onClose}
        {...(readOnlyRanges ? { readOnlyRanges } : {})}
        {...(onSubmit ? { onSubmit } : {})}
        {...(onChallengeSuccess ? { onChallengeSuccess } : {})}
      />
    );
  }

  // Free-form mode — create a stable internal MockInterpreter if none is passed
  const effectiveInterpreter = interpreter;
  if (effectiveInterpreter === undefined) {
    // This path is for when no interpreter is provided and no challengeId either.
    // Render an empty disabled state — caller should pass an interpreter for free mode.
    return (
      <div className="terminal-container">
        <div className="terminal-loading">
          <span>{t('terminal.no_interpreter')}</span>
        </div>
      </div>
    );
  }

  return (
    <FreeModeTerminal
      interpreter={effectiveInterpreter}
      initialCode={initialCode ?? t('terminal.empty_editor')}
      onClose={onClose}
      {...(readOnlyRanges ? { readOnlyRanges } : {})}
      {...(onSubmit ? { onSubmit } : {})}
    />
  );
}

export const HackingTerminal = React.memo(HackingTerminalInner);
