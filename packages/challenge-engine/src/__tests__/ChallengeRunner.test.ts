import { describe, it, expect, vi } from 'vitest';
import { ChallengeRunner } from '../ChallengeRunner';
import type { Challenge, PythonInterpreter, ExecutionResult } from '@venomous-snake/shared-types';

function makeInterpreter(result: ExecutionResult): PythonInterpreter {
  return {
    initialize: vi.fn().mockResolvedValue(undefined),
    isReady: vi.fn().mockReturnValue(true),
    execute: vi.fn().mockResolvedValue(result),
    provideInput: vi.fn(),
    onOutput: vi.fn().mockReturnValue(() => undefined),
    onInputRequest: vi.fn().mockReturnValue(() => undefined),
    terminate: vi.fn().mockResolvedValue(undefined),
    getVersion: vi.fn().mockReturnValue('Python 3.12.0 (mock)'),
  };
}

function makeChallenge(partial: Partial<Challenge> = {}): Challenge {
  return {
    id: 'test',
    titleKey: 'test.title',
    descriptionKey: 'test.desc',
    chapter: 1,
    order: 1,
    difficulty: 'beginner',
    scaffoldingLevel: 'guided',
    prerequisites: [],
    xpReward: 50,
    tags: [],
    scaffoldedCode: '',
    solutionCode: 'print("hello")',
    testCases: [],
    hints: [],
    conceptsIntroduced: [],
    conceptsReinforced: [],
    ...partial,
  };
}

describe('ChallengeRunner', () => {
  it('runs a challenge with all tests passing', async () => {
    const result: ExecutionResult = {
      success: true,
      output: [{ type: 'stdout', text: 'hello\n' }],
      executionTimeMs: 50,
    };
    const runner = new ChallengeRunner(makeInterpreter(result));
    const challenge = makeChallenge({
      testCases: [
        { id: 'tc1', description: 'print hello', expectedOutput: 'hello', hidden: false },
      ],
    });

    const res = await runner.runChallenge(challenge, 'print("hello")');

    expect(res.allPassed).toBe(true);
    expect(res.testResults).toHaveLength(1);
    expect(res.testResults[0]!.passed).toBe(true);
  });

  it('fails when actual output does not match expected', async () => {
    const result: ExecutionResult = {
      success: true,
      output: [{ type: 'stdout', text: 'wrong\n' }],
      executionTimeMs: 50,
    };
    const runner = new ChallengeRunner(makeInterpreter(result));
    const challenge = makeChallenge({
      testCases: [
        { id: 'tc1', description: 'print hello', expectedOutput: 'hello', hidden: false },
      ],
    });

    const res = await runner.runChallenge(challenge, 'print("wrong")');

    expect(res.allPassed).toBe(false);
    expect(res.testResults[0]!.passed).toBe(false);
    expect(res.testResults[0]!.error).toBeDefined();
  });

  it('passes when execution produces the expected error type', async () => {
    const result: ExecutionResult = {
      success: false,
      output: [],
      error: { type: 'ZeroDivisionError', message: 'division by zero' },
      executionTimeMs: 50,
    };
    const runner = new ChallengeRunner(makeInterpreter(result));
    const challenge = makeChallenge({
      testCases: [
        {
          id: 'tc1',
          description: 'expects ZeroDivisionError',
          expectedOutput: '',
          hidden: false,
          expectsError: 'ZeroDivisionError',
        },
      ],
    });

    const res = await runner.runChallenge(challenge, '1/0');

    expect(res.allPassed).toBe(true);
    expect(res.testResults[0]!.passed).toBe(true);
  });

  it('fails when execution produces a different error than expected', async () => {
    const result: ExecutionResult = {
      success: false,
      output: [],
      error: { type: 'TypeError', message: 'type error' },
      executionTimeMs: 50,
    };
    const runner = new ChallengeRunner(makeInterpreter(result));
    const challenge = makeChallenge({
      testCases: [
        {
          id: 'tc1',
          description: 'expects ZeroDivisionError',
          expectedOutput: '',
          hidden: false,
          expectsError: 'ZeroDivisionError',
        },
      ],
    });

    const res = await runner.runChallenge(challenge, 'bad_code()');

    expect(res.allPassed).toBe(false);
    expect(res.testResults[0]!.passed).toBe(false);
  });

  it('normalizes whitespace when comparing output', async () => {
    const result: ExecutionResult = {
      success: true,
      output: [{ type: 'stdout', text: '  hello  \n' }],
      executionTimeMs: 50,
    };
    const runner = new ChallengeRunner(makeInterpreter(result));
    const challenge = makeChallenge({
      testCases: [{ id: 'tc1', description: 'trim test', expectedOutput: 'hello', hidden: false }],
    });

    const res = await runner.runChallenge(challenge, 'print("  hello  ")');

    expect(res.testResults[0]!.passed).toBe(true);
  });

  it('handles multiple test cases where some pass and some fail', async () => {
    const passingResult: ExecutionResult = {
      success: true,
      output: [{ type: 'stdout', text: 'hello\n' }],
      executionTimeMs: 50,
    };
    const failingResult: ExecutionResult = {
      success: true,
      output: [{ type: 'stdout', text: 'wrong\n' }],
      executionTimeMs: 50,
    };

    const interpreter: PythonInterpreter = {
      initialize: vi.fn().mockResolvedValue(undefined),
      isReady: vi.fn().mockReturnValue(true),
      execute: vi.fn().mockResolvedValueOnce(passingResult).mockResolvedValueOnce(failingResult),
      provideInput: vi.fn(),
      onOutput: vi.fn().mockReturnValue(() => undefined),
      onInputRequest: vi.fn().mockReturnValue(() => undefined),
      terminate: vi.fn().mockResolvedValue(undefined),
      getVersion: vi.fn().mockReturnValue('Python 3.12.0 (mock)'),
    };

    const runner = new ChallengeRunner(interpreter);
    const challenge = makeChallenge({
      testCases: [
        { id: 'tc1', description: 'should pass', expectedOutput: 'hello', hidden: false },
        { id: 'tc2', description: 'should fail', expectedOutput: 'hello', hidden: false },
      ],
    });

    const res = await runner.runChallenge(challenge, 'code');

    expect(res.allPassed).toBe(false);
    expect(res.testResults[0]!.passed).toBe(true);
    expect(res.testResults[1]!.passed).toBe(false);
  });

  it('splits multi-line test input into separate input() answers', async () => {
    const executed: Array<{ code: string; inputs: string[] | undefined }> = [];
    const interpreter = makeInterpreter({ success: true, output: [], executionTimeMs: 1 });
    (interpreter.execute as ReturnType<typeof vi.fn>).mockImplementation(
      (code: string, options?: { inputs?: string[] }) => {
        executed.push({ code, inputs: options?.inputs });
        return Promise.resolve({ success: true, output: [], executionTimeMs: 1 });
      },
    );
    const runner = new ChallengeRunner(interpreter);
    const challenge = makeChallenge({
      testCases: [
        { id: 'tc1', description: 'x', input: 'snake\nviper', expectedOutput: '', hidden: false },
      ],
    });
    await runner.runChallenge(challenge, 'pass');
    expect(executed[0]?.inputs).toEqual(['snake', 'viper']);
  });

  it('appends the test call after the student code', async () => {
    let program = '';
    const interpreter = makeInterpreter({ success: true, output: [], executionTimeMs: 1 });
    (interpreter.execute as ReturnType<typeof vi.fn>).mockImplementation((code: string) => {
      program = code;
      return Promise.resolve({
        success: true,
        output: [{ type: 'stdout', text: '5\n' }],
        executionTimeMs: 1,
      });
    });
    const runner = new ChallengeRunner(interpreter);
    const challenge = makeChallenge({
      testCases: [
        {
          id: 'tc1',
          description: 'x',
          append: 'print(add(2, 3))',
          expectedOutput: '5',
          hidden: true,
        },
      ],
    });
    const res = await runner.runChallenge(challenge, 'def add(a, b):\n    return a + b');
    expect(program).toContain('print(add(2, 3))');
    expect(program.indexOf('def add')).toBeLessThan(program.indexOf('print(add'));
    expect(res.allPassed).toBe(true);
  });

  it('fails a test with a friendly message when the program times out', async () => {
    const result: ExecutionResult = {
      success: false,
      output: [],
      executionTimeMs: 5000,
      timedOut: true,
      error: { type: 'TimeoutError', message: 'stopped' },
    };
    const runner = new ChallengeRunner(makeInterpreter(result));
    const challenge = makeChallenge({
      testCases: [{ id: 'tc1', description: 'x', expectedOutput: 'a', hidden: false }],
    });
    const res = await runner.runChallenge(challenge, 'while True: pass');
    expect(res.allPassed).toBe(false);
    expect(res.testResults[0]?.error).toMatch(/ran too long/);
  });
});
