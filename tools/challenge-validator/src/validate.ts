import type { Challenge, PythonInterpreter } from '@venomous-snake/shared-types';
import { ChallengeRunner } from '@venomous-snake/challenge-engine';

export interface Violation {
  challengeId: string;
  rule: string;
  detail: string;
}

/** Static rules that need no interpreter. */
export function validateStructure(challenges: Challenge[]): Violation[] {
  const violations: Violation[] = [];
  const ids = new Set<string>();
  const known = new Set(challenges.map((c) => c.id));

  for (const c of challenges) {
    const add = (rule: string, detail: string): number =>
      violations.push({ challengeId: c.id, rule, detail });

    if (ids.has(c.id)) add('unique-id', 'duplicate challenge id');
    ids.add(c.id);

    for (const p of c.prerequisites) {
      if (!known.has(p)) add('prerequisite-exists', `unknown prerequisite ${p}`);
    }
    if (c.testCases.length < 2) add('min-tests', 'needs at least two test cases');
    if (c.hints.length < 3) add('hint-tiers', 'needs three hint tiers');

    const testIds = new Set<string>();
    const fingerprints = new Set<string>();
    for (const t of c.testCases) {
      if (testIds.has(t.id)) add('unique-test-id', `duplicate test id ${t.id}`);
      testIds.add(t.id);
      const fp = JSON.stringify([t.input ?? '', t.setup ?? '', t.append ?? '', t.expectedOutput]);
      if (fingerprints.has(fp)) {
        add(
          'distinct-tests',
          `test ${t.id} repeats an earlier test; it cannot verify anything new`,
        );
      }
      fingerprints.add(fp);
    }
  }
  return violations;
}

/** Rules that execute code: the solution must pass and the scaffold must not. */
export async function validateExecution(
  challenges: Challenge[],
  interpreter: PythonInterpreter,
): Promise<Violation[]> {
  const runner = new ChallengeRunner(interpreter);
  const violations: Violation[] = [];

  for (const c of challenges) {
    const solution = await runner.runChallenge(c, c.solutionCode);
    for (const r of solution.testResults) {
      if (!r.passed) {
        violations.push({
          challengeId: c.id,
          rule: 'solution-passes',
          detail: `${r.testCase.id}: ${r.error ?? 'failed'}`.slice(0, 300),
        });
      }
    }
    const scaffold = await runner.runChallenge(c, c.scaffoldedCode);
    if (scaffold.allPassed) {
      violations.push({
        challengeId: c.id,
        rule: 'scaffold-fails',
        detail: 'the unmodified starter code already passes every test',
      });
    }
  }
  return violations;
}
