import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { describe, it, expect, beforeAll } from 'vitest';
import { loadPyodide } from 'pyodide';
import { allChallenges } from '@venomous-snake/challenges';
import { InProcessInterpreter } from '@venomous-snake/python-runtime';
import type { PyodideLike } from '@venomous-snake/python-runtime';
import { validateStructure, validateExecution } from '../validate';
import type { Violation } from '../validate';

const require = createRequire(import.meta.url);

const ALLOWLIST_PATH = path.resolve(__dirname, '../../known-violations.json');
const REGENERATE = process.env['UPDATE_KNOWN_VIOLATIONS'] === '1';

/** Rules that must hold for every challenge; the allowlist is a ratchet that only shrinks. */
function keyOf(v: Violation): string {
  return `${v.challengeId}:${v.rule}:${v.detail.split(':')[0] ?? ''}`;
}

function checkAgainstAllowlist(violations: Violation[], scope: string): void {
  const keys = [...new Set(violations.map(keyOf))].sort();
  const stored: Record<string, string[]> = fs.existsSync(ALLOWLIST_PATH)
    ? (JSON.parse(fs.readFileSync(ALLOWLIST_PATH, 'utf8')) as Record<string, string[]>)
    : {};
  if (REGENERATE) {
    stored[scope] = keys;
    fs.writeFileSync(ALLOWLIST_PATH, `${JSON.stringify(stored, null, 2)}\n`);
    return;
  }
  const allowed = new Set(stored[scope] ?? []);
  const unexpected = keys.filter((k) => !allowed.has(k));
  const fixed = [...allowed].filter((k) => !keys.includes(k));
  expect(unexpected, 'new violations').toEqual([]);
  expect(fixed, 'already fixed: remove from known-violations.json').toEqual([]);
}

describe('challenge definitions', () => {
  it('has the expected number of challenges', () => {
    expect(allChallenges.length).toBe(108);
  });

  it('satisfy the structural rules', () => {
    checkAgainstAllowlist(validateStructure(allChallenges), 'structure');
  });
});

describe('challenge execution on real CPython (Pyodide)', () => {
  let interpreter: InProcessInterpreter;

  beforeAll(async () => {
    const dir = path.dirname(require.resolve('pyodide/package.json')) + path.sep;
    const pyodide = (await loadPyodide({ indexURL: dir })) as unknown as PyodideLike;
    interpreter = new InProcessInterpreter(pyodide);
  });

  it('every solution passes all of its tests', async () => {
    const violations = (await validateExecution(allChallenges, interpreter)).filter(
      (v) => v.rule === 'solution-passes',
    );
    expect(violations).toEqual([]);
  });

  it('starter code does not already pass', async () => {
    const violations = (await validateExecution(allChallenges, interpreter)).filter(
      (v) => v.rule === 'scaffold-fails',
    );
    checkAgainstAllowlist(violations, 'scaffold');
  });
});
