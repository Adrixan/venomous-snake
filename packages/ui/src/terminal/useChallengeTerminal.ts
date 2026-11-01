import { useState, useCallback, useMemo, useRef, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ChallengeSessionContext } from './ChallengeSession';
import { failureText, testLabel } from './challengeText';
import { structureLabel } from './structureLabel';
import type {
  Challenge,
  PythonError,
  PythonOutput,
  PythonInterpreter,
} from '@venomous-snake/shared-types';
import { challengeMap } from '@venomous-snake/challenges';
import { ChallengeRunner, HintEngine } from '@venomous-snake/challenge-engine';
import type { ChallengeResult, TestResult } from '@venomous-snake/challenge-engine';
import { getSharedInterpreter, initializeSharedInterpreter } from '@venomous-snake/python-runtime';

export interface SubmitResult {
  passed: boolean;
  output: string;
  error: string | undefined;
  xpEarned?: number;
}

export interface UseChallengeTerminalReturn {
  challenge: Challenge | null;
  outputs: PythonOutput[];
  isRunning: boolean;
  result: SubmitResult | null;
  /** The Python error of the latest free run, for CIPHER to explain. */
  runError: PythonError | null;
  hints: string[];
  challengeResult: ChallengeResult | null;
  submitCode: (code: string) => Promise<void>;
  runCode: (code: string) => Promise<void>;
  resetState: () => void;
  requestHint: () => void;
  interpreter: PythonInterpreter;
}

export function useChallengeTerminal(challengeId: string | null): UseChallengeTerminalReturn {
  const session = useContext(ChallengeSessionContext);
  const { t } = useTranslation('ui');
  const busy = useRef(false);
  const challenge = useMemo<Challenge | null>(
    () => (challengeId !== null ? (challengeMap[challengeId] ?? null) : null),
    [challengeId],
  );

  const [outputs, setOutputs] = useState<PythonOutput[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [runError, setRunError] = useState<PythonError | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  const [challengeResult, setChallengeResult] = useState<ChallengeResult | null>(null);

  const interpreterRef = useRef<PythonInterpreter>(getSharedInterpreter());
  const runnerRef = useRef<ChallengeRunner>(new ChallengeRunner(interpreterRef.current));
  const hintEngineRef = useRef<HintEngine>(new HintEngine());

  useEffect(() => {
    const interpreter = interpreterRef.current;

    // Start async initialization (Pyodide WASM loading)
    initializeSharedInterpreter().catch(() => undefined);

    const unsubOutput = interpreter.onOutput((output) => {
      setOutputs((prev) => [...prev, output]);
    });

    return () => {
      unsubOutput();
    };
  }, []);

  // Reset evaluation state when challenge changes
  useEffect(() => {
    setOutputs([]);
    setResult(null);
    setHints([]);
    setChallengeResult(null);
  }, [challengeId]);

  const ensureReady = useCallback(async (): Promise<void> => {
    await initializeSharedInterpreter();
  }, []);

  const runCode = useCallback(
    async (code: string): Promise<void> => {
      if (busy.current) return;
      busy.current = true;
      setIsRunning(true);
      setOutputs([]);
      try {
        await ensureReady();
        const execResult = await interpreterRef.current.execute(code, {
          interactive: true,
          echoPrompts: true,
          timeoutMessage: (seconds) => t('terminal.failure.time_limit', { seconds }),
        });
        setRunError(execResult.error ?? null);
      } catch (error) {
        console.error('Python run failed', error);
        setOutputs([{ type: 'stderr', text: t('terminal.python_unavailable') }]);
      } finally {
        busy.current = false;
        setIsRunning(false);
      }
    },
    [ensureReady, challenge, t],
  );

  const submitCode = useCallback(
    async (code: string): Promise<void> => {
      if (challenge === null) {
        await runCode(code);
        return;
      }

      if (busy.current) return;
      busy.current = true;
      setIsRunning(true);
      setOutputs([]);
      setResult(null);
      setHints([]);

      try {
        await ensureReady();
        const runner = runnerRef.current;
        const cResult = session
          ? await session.evaluate(code)
          : await runner.runChallenge(challenge, code);
        setChallengeResult(cResult);

        const failure = (tr: TestResult): string | undefined => {
          if (tr.structureCheck !== undefined) return structureLabel(t, tr.structureCheck);
          if (tr.testCase.id === 'placeholder') return t('terminal.structure.blank');
          // Without a failure code the interpreter itself broke; its message is internal.
          if (tr.failure === undefined) return t('terminal.python_unavailable');
          return failureText(t, tr.failure);
        };
        const outputLines = cResult.testResults
          .map((tr) => {
            const mark = tr.passed ? '✓' : '✗';
            return tr.passed
              ? `${mark} ${testLabel(t, challenge.id, tr.testCase)}`
              : `${mark} ${failure(tr) ?? testLabel(t, challenge.id, tr.testCase)}`;
          })
          .join('\n');

        if (cResult.allPassed) {
          setOutputs((prev) => [
            ...prev,
            {
              type: 'stdout' as const,
              text: `${t('terminal.all_passed', { total: cResult.testResults.length })}\n`,
            },
          ]);
          setResult({
            passed: true,
            output: outputLines,
            error: undefined,
            xpEarned: 'xpEarned' in cResult ? Number(cResult.xpEarned) : challenge.xpReward,
          });
        } else {
          const firstFailed = cResult.testResults.find((tr) => !tr.passed);
          const firstError = firstFailed === undefined ? undefined : failure(firstFailed);
          const failCount = cResult.testResults.filter((tr) => !tr.passed).length;

          setOutputs((prev) => [
            ...prev,
            {
              type: 'stderr' as const,
              text: `${t('terminal.some_failed', { failed: failCount })}\n${firstError ?? ''}\n`,
            },
          ]);
          setResult({ passed: false, output: outputLines, error: firstError });
        }
      } catch (error) {
        console.error('Challenge check failed', error);
        const message = t('terminal.python_unavailable');
        setOutputs([{ type: 'stderr', text: message }]);
        setResult({ passed: false, output: '', error: message });
      } finally {
        busy.current = false;
        setIsRunning(false);
      }
    },
    [challenge, runCode, ensureReady, session, t],
  );

  const resetState = useCallback(() => {
    setOutputs([]);
    setRunError(null);
    setResult(null);
    setHints([]);
    setChallengeResult(null);
  }, []);

  return {
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
    requestHint: () => {
      if (!challenge) return;
      const hint = session ? session.requestHint() : hintEngineRef.current.getHint(challenge);
      if (hint) {
        const text = t(hint.key, { defaultValue: hint.hint });
        setHints((previous) => [...previous, text]);
      }
    },
    interpreter: interpreterRef.current,
  };
}
