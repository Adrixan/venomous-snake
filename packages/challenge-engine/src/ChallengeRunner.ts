import type { Challenge, TestCase, ExecutionResult, PythonInterpreter } from '@venomous-snake/shared-types';

export interface TestResult {
  testCase: TestCase;
  passed: boolean;
  actualOutput?: string;
  error?: string;
  executionTimeMs: number;
}

export interface ChallengeResult {
  challengeId: string;
  allPassed: boolean;
  testResults: TestResult[];
  totalTimeMs: number;
}

export class ChallengeRunner {
  constructor(private interpreter: PythonInterpreter) {}

  async runChallenge(challenge: Challenge, studentCode: string): Promise<ChallengeResult> {
    const startTime = performance.now();
    const testResults: TestResult[] = [];

    for (const testCase of challenge.testCases) {
      const result = await this.runTestCase(testCase, studentCode);
      testResults.push(result);
    }

    return {
      challengeId: challenge.id,
      allPassed: testResults.every((r) => r.passed),
      testResults,
      totalTimeMs: performance.now() - startTime,
    };
  }

  private async runTestCase(testCase: TestCase, code: string): Promise<TestResult> {
    const startTime = performance.now();

    try {
      if (testCase.input !== undefined) {
        this.interpreter.provideInput(testCase.input);
      }

      const result: ExecutionResult = await this.interpreter.execute(code);
      const executionTimeMs = performance.now() - startTime;

      if (testCase.expectsError !== undefined) {
        const passed = result.error?.type === testCase.expectsError;
        const actualErrorType = result.error?.type ?? 'no error';
        return {
          testCase,
          passed,
          ...(result.error !== undefined ? { actualOutput: result.error.message } : {}),
          ...(passed
            ? {}
            : { error: `Expected ${testCase.expectsError} but got ${actualErrorType}` }),
          executionTimeMs,
        };
      }

      const actualOutput = result.output
        .filter((o) => o.type === 'stdout')
        .map((o) => o.text)
        .join('');

      const normalizedActual = actualOutput.trim();
      const normalizedExpected = testCase.expectedOutput.trim();
      const passed = normalizedActual === normalizedExpected;

      return {
        testCase,
        passed,
        actualOutput: normalizedActual,
        ...(passed
          ? {}
          : { error: `Expected:\n${normalizedExpected}\n\nGot:\n${normalizedActual}` }),
        executionTimeMs,
      };
    } catch (err) {
      return {
        testCase,
        passed: false,
        error: err instanceof Error ? err.message : String(err),
        executionTimeMs: performance.now() - startTime,
      };
    }
  }
}
