import { useState, useCallback, useMemo, useRef, useEffect, useContext } from 'react';
import { ChallengeSessionContext } from './ChallengeSession';
import type { Challenge, PythonOutput, PythonInterpreter } from '@venomous-snake/shared-types';
import { challengeMap } from '@venomous-snake/challenges';
import { ChallengeRunner, HintEngine } from '@venomous-snake/challenge-engine';
import type { ChallengeResult } from '@venomous-snake/challenge-engine';
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
  const busy = useRef(false);
  const challenge = useMemo<Challenge | null>(
    () => (challengeId !== null ? (challengeMap[challengeId] ?? null) : null),
    [challengeId],
  );

  const [outputs, setOutputs] = useState<PythonOutput[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
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
        await interpreterRef.current.execute(code, {
          inputs: challenge?.testCases[0]?.input?.split('\n') ?? [],
        });
      } catch (error) {
        setOutputs([
          { type: 'stderr', text: error instanceof Error ? error.message : String(error) },
        ]);
      } finally {
        busy.current = false;
        setIsRunning(false);
      }
    },
    [ensureReady, challenge],
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

        const outputLines = cResult.testResults
          .map((tr) => {
            const mark = tr.passed ? '✓' : '✗';
            return tr.passed
              ? `${mark} ${tr.testCase.description}`
              : `${mark} ${tr.testCase.description}\n  ${tr.error ?? ''}`;
          })
          .join('\n');

        if (cResult.allPassed) {
          setOutputs((prev) => [
            ...prev,
            {
              type: 'stdout' as const,
              text: `✓ All ${cResult.testResults.length} test(s) passed!\n`,
            },
          ]);
          setResult({
            passed: true,
            output: outputLines,
            error: undefined,
            xpEarned: 'xpEarned' in cResult ? Number(cResult.xpEarned) : challenge.xpReward,
          });
        } else {
          const firstFailed = cResult.testResults.find((t) => !t.passed);
          const failCount = cResult.testResults.filter((t) => !t.passed).length;

          setOutputs((prev) => [
            ...prev,
            {
              type: 'stderr' as const,
              text: `✗ ${failCount} test(s) failed\n${firstFailed?.error ?? ''}\n`,
            },
          ]);
          setResult({ passed: false, output: outputLines, error: firstFailed?.error });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setOutputs([{ type: 'stderr', text: message }]);
        setResult({ passed: false, output: '', error: message });
      } finally {
        busy.current = false;
        setIsRunning(false);
      }
    },
    [challenge, runCode, ensureReady, session],
  );

  const resetState = useCallback(() => {
    setOutputs([]);
    setResult(null);
    setHints([]);
    setChallengeResult(null);
  }, []);

  return {
    challenge,
    outputs,
    isRunning,
    result,
    hints,
    challengeResult,
    submitCode,
    runCode,
    resetState,
    requestHint: () => {
      if (!challenge) return;
      const hint = session ? session.requestHint() : hintEngineRef.current.getHint(challenge)?.hint;
      if (hint) setHints((previous) => [...previous, hint]);
    },
    interpreter: interpreterRef.current,
  };
}
