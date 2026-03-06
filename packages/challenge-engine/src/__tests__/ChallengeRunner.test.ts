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
      testCases: [{ id: 'tc1', description: 'print hello', expectedOutput: 'hello', hidden: false }],
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
      testCases: [{ id: 'tc1', description: 'print hello', expectedOutput: 'hello', hidden: false }],
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
});
