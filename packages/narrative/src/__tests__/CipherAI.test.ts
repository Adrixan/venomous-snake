import { describe, it, expect } from 'vitest';
import { CipherAI } from '../CipherAI';
import type { CipherContext } from '../CipherAI';

describe('CipherAI', () => {
  it('getLine returns a non-empty string for every context', () => {
    const cipher = new CipherAI();
    const contexts: CipherContext[] = [
      'idle',
      'challenge_start',
      'challenge_hint',
      'challenge_success',
      'challenge_fail',
      'exploration',
      'story',
      'greeting',
    ];

    for (const ctx of contexts) {
      const line = cipher.getLine(ctx);
      expect(line.length, `Expected non-empty string for context '${ctx}'`).toBeGreaterThan(0);
    }
  });

  it('getLine updates the mood to match the context', () => {
    const cipher = new CipherAI();

    cipher.getLine('challenge_success');
    expect(cipher.getMood()).toBe('impressed');

    cipher.getLine('challenge_fail');
    expect(cipher.getMood()).toBe('concerned');
  });

  it('wrapHint prepends a CIPHER personality intro to the raw hint', () => {
    const cipher = new CipherAI();
    const rawHint = 'Check your indentation.';

    const wrapped = cipher.wrapHint(rawHint);

    expect(wrapped).toContain(rawHint);
    expect(wrapped.length).toBeGreaterThan(rawHint.length);
  });

  it('explainError for SyntaxError contains the error type and message', () => {
    const cipher = new CipherAI();

    const explanation = cipher.explainError('SyntaxError', 'expected :');

    expect(explanation).toContain('SyntaxError');
    expect(explanation).toContain('expected :');
  });

  it('explainError for NameError contains the error type and message', () => {
    const cipher = new CipherAI();

    const explanation = cipher.explainError('NameError', "name 'foo' is not defined");

    expect(explanation).toContain('NameError');
    expect(explanation).toContain("name 'foo' is not defined");
  });

  it('explainError for TypeError contains the error type and message', () => {
    const cipher = new CipherAI();

    const explanation = cipher.explainError('TypeError', 'unsupported operand type');

    expect(explanation).toContain('TypeError');
    expect(explanation).toContain('unsupported operand type');
  });

  it('getReaction for first-try no-hints success mentions being impressed', () => {
    const cipher = new CipherAI();

    const reaction = cipher.getReaction(true, 1, 0);

    expect(reaction).toContain('impressed');
  });

  it('getReaction for passing with many hints differs from no-hints reaction', () => {
    const cipher = new CipherAI();

    const noHints = cipher.getReaction(true, 1, 0);
    const manyHints = cipher.getReaction(true, 5, 5);

    expect(noHints).not.toBe(manyHints);
  });

  it('getReaction for failure returns a non-empty string', () => {
    const cipher = new CipherAI();

    const reaction = cipher.getReaction(false, 3, 1);

    expect(reaction.length).toBeGreaterThan(0);
  });

  it('getIdleChatter returns diverse messages across multiple calls', () => {
    const cipher = new CipherAI();
    const seen = new Set<string>();

    // With 12 distinct messages and 20 calls, the chance of all being identical is negligible
    for (let i = 0; i < 20; i++) {
      seen.add(cipher.getIdleChatter());
    }

    expect(seen.size).toBeGreaterThan(1);
  });

  it('setPlayerName is reflected in getReaction output', () => {
    const cipher = new CipherAI();
    cipher.setPlayerName('Viper');

    // First-try, no-hints reaction always interpolates playerName
    const firstTry = cipher.getReaction(true, 1, 0);
    expect(firstTry).toContain('Viper');
  });
});
