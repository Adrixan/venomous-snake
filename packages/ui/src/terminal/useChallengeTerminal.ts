import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { Challenge, PythonOutput } from '@venomous-snake/shared-types';
import { challengeMap } from '@venomous-snake/challenges';
import { ChallengeRunner, HintEngine } from '@venomous-snake/challenge-engine';
import type { ChallengeResult } from '@venomous-snake/challenge-engine';
import { MockInterpreter } from '@venomous-snake/python-runtime';

export interface SubmitResult {
  passed: boolean;
  output: string;
  error: string | undefined;
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
  interpreter: MockInterpreter;
}

export function useChallengeTerminal(challengeId: string | null): UseChallengeTerminalReturn {
  const challenge = useMemo<Challenge | null>(
    () => (challengeId !== null ? (challengeMap[challengeId] ?? null) : null),
    [challengeId],
  );

  const [outputs, setOutputs] = useState<PythonOutput[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  const [challengeResult, setChallengeResult] = useState<ChallengeResult | null>(null);

  const interpreterRef = useRef<MockInterpreter>(new MockInterpreter());
  const runnerRef = useRef<ChallengeRunner>(new ChallengeRunner(interpreterRef.current));
  const hintEngineRef = useRef<HintEngine>(new HintEngine());

  useEffect(() => {
    const interpreter = interpreterRef.current;
    if (!interpreter.isReady()) {
      interpreter.initialize().catch(() => undefined);
    }

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
    const interpreter = interpreterRef.current;
    if (!interpreter.isReady()) {
      await interpreter.initialize();
    }
  }, []);

  const runCode = useCallback(
    async (code: string): Promise<void> => {
      await ensureReady();
      setIsRunning(true);
      setOutputs([]);
      try {
        const execResult = await interpreterRef.current.execute(code);
        if (execResult.error !== undefined) {
          const errText =
            execResult.error.traceback ?? `${execResult.error.type}: ${execResult.error.message}`;
          setOutputs((prev) => [...prev, { type: 'stderr' as const, text: errText }]);
        }
      } finally {
        setIsRunning(false);
      }
    },
    [ensureReady],
  );

  const submitCode = useCallback(
    async (code: string): Promise<void> => {
      if (challenge === null) {
        await runCode(code);
        return;
      }

      await ensureReady();
      setIsRunning(true);
      setOutputs([]);
      setResult(null);
      setHints([]);

      try {
        const runner = runnerRef.current;
        const cResult = await runner.runChallenge(challenge, code);
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
          setResult({ passed: true, output: outputLines, error: undefined });
        } else {
          const firstFailed = cResult.testResults.find((t) => !t.passed);
          const failCount = cResult.testResults.filter((t) => !t.passed).length;

          const hintResult = hintEngineRef.current.getHint(challenge);
          const newHints: string[] = hintResult !== null ? [hintResult.hint] : [];
          setHints(newHints);

          setOutputs((prev) => [
            ...prev,
            {
              type: 'stderr' as const,
              text: `✗ ${failCount} test(s) failed\n${firstFailed?.error ?? ''}\n`,
            },
          ]);
          setResult({ passed: false, output: outputLines, error: firstFailed?.error });
        }
      } finally {
        setIsRunning(false);
      }
    },
    [challenge, runCode, ensureReady],
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
    interpreter: interpreterRef.current,
  };
}
