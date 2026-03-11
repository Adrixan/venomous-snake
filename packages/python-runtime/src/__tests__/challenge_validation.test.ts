import { describe, it, expect } from 'vitest';
import { MiniPythonEvaluator } from '../MiniPythonEvaluator';

// Import all challenges from all chapters
import * as ch01 from '../../../challenges/src/chapter01';
import * as ch02 from '../../../challenges/src/chapter02';
import * as ch03 from '../../../challenges/src/chapter03';
import * as ch04 from '../../../challenges/src/chapter04';
import * as ch05 from '../../../challenges/src/chapter05';
import * as ch06 from '../../../challenges/src/chapter06';
import * as ch07 from '../../../challenges/src/chapter07';
import * as ch08 from '../../../challenges/src/chapter08';
import * as ch09 from '../../../challenges/src/chapter09';
import * as ch10 from '../../../challenges/src/chapter10';
import * as ch11 from '../../../challenges/src/chapter11';
import * as ch12 from '../../../challenges/src/chapter12';

interface Challenge {
  id: string;
  solutionCode: string;
  testCases: Array<{
    id: string;
    expectedOutput: string;
    input?: string;
  }>;
}

const allModules = { ...ch01, ...ch02, ...ch03, ...ch04, ...ch05, ...ch06, ...ch07, ...ch08, ...ch09, ...ch10, ...ch11, ...ch12 };
const challenges = Object.values(allModules) as unknown as Challenge[];

describe('Challenge Validation — all solution codes produce expected output', () => {
  for (const challenge of challenges) {
    if (!challenge.solutionCode || !challenge.testCases) continue;
    for (const tc of challenge.testCases) {
      it(`${challenge.id} / ${tc.id}`, () => {
        const evaluator = new MiniPythonEvaluator();
        if (tc.input) {
          // Queue input line(s) for input() calls
          for (const line of tc.input.split('\n')) {
            evaluator.queueInput(line);
          }
        }
        const result = evaluator.execute(challenge.solutionCode);
        const actual = result.stdout.trim();
        const expected = tc.expectedOutput.trim();
        if (result.error) {
          console.log(`  ERROR: ${result.error.type}: ${result.error.message}`);
        }
        expect(actual).toBe(expected);
      });
    }
  }
});
