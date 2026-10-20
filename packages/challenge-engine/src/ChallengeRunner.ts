import type {
  Challenge,
  TestCase,
  ExecutionResult,
  PythonInterpreter,
} from '@venomous-snake/shared-types';

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
          executionTimeMs: performance.now() - startTime,
        };
      }
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
