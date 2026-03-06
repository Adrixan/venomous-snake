import { describe, it, expect } from 'vitest';
import { HintEngine } from '../HintEngine';
import type { Challenge, PythonError } from '@venomous-snake/shared-types';

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
    solutionCode: '',
    testCases: [],
    hints: [],
    conceptsIntroduced: [],
    conceptsReinforced: [],
    ...partial,
  };
}

describe('HintEngine', () => {
  it('matches SyntaxError missing colon pattern', () => {
    const engine = new HintEngine();
    const challenge = makeChallenge();
    const error: PythonError = { type: 'SyntaxError', message: 'expected :' };

    const result = engine.getHint(challenge, error);

    expect(result).not.toBeNull();
    expect(result!.source).toBe('error_pattern');
    expect(result!.hint).toContain('colon');
  });

  it('matches SyntaxError unclosed string pattern', () => {
    const engine = new HintEngine();
    const challenge = makeChallenge();
    const error: PythonError = { type: 'SyntaxError', message: 'EOL while scanning string' };

    const result = engine.getHint(challenge, error);

    expect(result).not.toBeNull();
    expect(result!.source).toBe('error_pattern');
    expect(result!.hint).toContain('quote');
  });

  it('matches NameError undefined variable pattern', () => {
    const engine = new HintEngine();
    const challenge = makeChallenge();
    const error: PythonError = { type: 'NameError', message: "name 'foo' is not defined" };

    const result = engine.getHint(challenge, error);

    expect(result).not.toBeNull();
    expect(result!.source).toBe('error_pattern');
    expect(result!.tier).toBe(1);
  });

  it('returns tiered hints in progression (tier 1 → 2 → 3)', () => {
    const engine = new HintEngine();
    const challenge = makeChallenge({
      hints: [
        { tier: 1, text: 'First hint' },
        { tier: 2, text: 'Second hint' },
        { tier: 3, text: 'Third hint' },
      ],
    });

    const h1 = engine.getHint(challenge);
    expect(h1!.tier).toBe(1);
    expect(h1!.hint).toBe('First hint');

    const h2 = engine.getHint(challenge);
    expect(h2!.tier).toBe(2);
    expect(h2!.hint).toBe('Second hint');

    const h3 = engine.getHint(challenge);
    expect(h3!.tier).toBe(3);
    expect(h3!.hint).toBe('Third hint');
  });

  it('uses challenge-specific error patterns before common ones', () => {
    const engine = new HintEngine();
    const challenge = makeChallenge({
      errorPatterns: [
        {
          errorType: 'SyntaxError',
          pattern: 'expected :',
          hintText: 'Challenge-specific colon hint',
          category: 'custom',
        },
      ],
    });
    const error: PythonError = { type: 'SyntaxError', message: 'expected :' };

    const result = engine.getHint(challenge, error);

    expect(result!.hint).toBe('Challenge-specific colon hint');
  });

  it('resets hints so tier progression starts over', () => {
    const engine = new HintEngine();
    const challenge = makeChallenge({
      hints: [
        { tier: 1, text: 'First hint' },
        { tier: 2, text: 'Second hint' },
      ],
    });

    engine.getHint(challenge); // consumes tier 1
    engine.getHint(challenge); // consumes tier 2

    engine.resetHints(challenge.id);

    const after = engine.getHint(challenge);
    expect(after!.tier).toBe(1);
    expect(after!.hint).toBe('First hint');
  });

  it('returns generic fallback when no patterns match and no hints remain', () => {
    const engine = new HintEngine();
    const challenge = makeChallenge({ hints: [] });

    const result = engine.getHint(challenge);

    expect(result!.source).toBe('generic');
  });
});
