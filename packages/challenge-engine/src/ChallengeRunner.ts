import type {
  Challenge,
  TestCase,
  ExecutionResult,
  PythonInterpreter,
  StructureCheck,
} from '@venomous-snake/shared-types';
import { findUnmetChecks, hasPlaceholder } from './StructureChecker';

export type TestFailure =
  | { code: 'timeout' }
  | { code: 'wrong_error'; expected: string; actual: string | null }
  | { code: 'wrong_output'; expected: string; actual: string };

export interface TestResult {
  testCase: TestCase;
  passed: boolean;
  actualOutput?: string;
  error?: string;
  executionTimeMs: number;
  /** Why the test failed, for wording it in the player's language; `error` is the English. */
  failure?: TestFailure;
  /** Set on a result that reports a broken writing rule rather than a test case. */
  structureCheck?: StructureCheck;
}

export interface ChallengeResult {
  challengeId: string;
  allPassed: boolean;
  testResults: TestResult[];
  totalTimeMs: number;
}

/** Upper bound for a single test run; correct beginner programs finish in milliseconds. */
const TEST_TIMEOUT_MS = 5_000;

export class ChallengeRunner {
  constructor(private interpreter: PythonInterpreter) {}

  async runChallenge(challenge: Challenge, studentCode: string): Promise<ChallengeResult> {
    const startTime = performance.now();
    const testResults: TestResult[] = [];

    for (const testCase of challenge.testCases) {
      const result = await this.runTestCase(testCase, studentCode);
      testResults.push(result);
    }

    if (testResults.every((r) => r.passed)) {
      testResults.push(...(await this.runStructureChecks(challenge, studentCode)));
    }

    return {
      challengeId: challenge.id,
      allPassed: testResults.every((r) => r.passed),
      testResults,
      totalTimeMs: performance.now() - startTime,
    };
  }

  /** Reports leftover blanks and broken writing rules as failed results. */
  private async runStructureChecks(challenge: Challenge, code: string): Promise<TestResult[]> {
    const results: TestResult[] = [];
    const report = (id: string, description: string, check?: StructureCheck): void => {
      results.push({
        testCase: { id, description, expectedOutput: '', hidden: false },
        passed: false,
        error: description,
        executionTimeMs: 0,
        ...(check !== undefined ? { structureCheck: check } : {}),
      });
    };
    if (hasPlaceholder(code)) report('placeholder', 'Fill in every ___ blank');
    const checks = challenge.structureChecks ?? [];
    if (checks.length > 0) {
      const unmet = await findUnmetChecks(this.interpreter, code, checks);
      unmet.forEach((check, index) => {
        report(`structure-${String(index)}`, `Required: ${JSON.stringify(check)}`, check);
      });
    }
    return results;
  }

  private async runTestCase(testCase: TestCase, code: string): Promise<TestResult> {
    const startTime = performance.now();

    try {
      const finalCode = this.buildProgram(testCase, code);
      const inputs = testCase.input === undefined ? [] : testCase.input.split('\n');
      const result: ExecutionResult = await this.interpreter.execute(finalCode, {
        inputs,
        interactive: false,
        echoPrompts: false,
        timeoutMs: TEST_TIMEOUT_MS,
      });
      if (result.timedOut === true) {
        return {
          testCase,
          passed: false,
          error: 'Your program ran too long and was stopped. Check for a loop that never ends.',
          failure: { code: 'timeout' },
          executionTimeMs: performance.now() - startTime,
        };
      }
      const executionTimeMs = performance.now() - startTime;

      if (testCase.expectsError !== undefined) {
        const passed = result.error?.type === testCase.expectsError;
        const actualType = result.error?.type ?? null;
        const actualErrorType = actualType ?? 'no error';
        return {
          testCase,
          passed,
          ...(result.error !== undefined ? { actualOutput: result.error.message } : {}),
          ...(passed
            ? {}
            : {
                error: `Expected ${testCase.expectsError} but got ${actualErrorType}`,
                failure: {
                  code: 'wrong_error',
                  expected: testCase.expectsError,
                  actual: actualType,
                },
              }),
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
          : {
              error: `Expected:\n${normalizedExpected}\n\nGot:\n${normalizedActual}`,
              failure: {
                code: 'wrong_output',
                expected: normalizedExpected,
                actual: normalizedActual,
              },
            }),
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

  /** Student code with the test's variable overrides applied and its call appended. */
  private buildProgram(testCase: TestCase, code: string): string {
    const withSetup = this.applySetup(testCase, code);
    return testCase.append ? `${withSetup}\n${testCase.append}\n` : withSetup;
  }

  /** Apply setup overrides by replacing matching variable assignments in the student code */
  private applySetup(testCase: TestCase, code: string): string {
    if (!testCase.setup) return code;

    let result = code;
    for (const setupLine of testCase.setup.split('\n')) {
      const match = setupLine.match(/^(\w+)\s*=/);
      if (match) {
        const pattern = new RegExp(`^${match[1]}\\s*=.*$`, 'm');
        if (pattern.test(result)) {
          result = result.replace(pattern, () => setupLine);
        } else {
          result = `${setupLine}\n${result}`;
        }
      }
    }
    return result;
  }
}
