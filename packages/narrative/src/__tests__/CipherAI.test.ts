import { afterEach, describe, it, expect, vi } from 'vitest';
import { cipherDe as deCipher, cipherEn as enCipher } from '@venomous-snake/i18n';
import { CipherAI, createCipherTranslator } from '../CipherAI';
import type { CipherContext } from '../CipherAI';

const english = { translator: createCipherTranslator(enCipher) };
const CONTEXTS = Object.keys(enCipher.lines) as CipherContext[];

/** Lists every string of a locale resource by its key path. */
function leaves(node: unknown, path = ''): [string, string][] {
  if (typeof node === 'string') return [[path, node]];
  return Object.entries(node as object).flatMap(([key, value]) =>
    leaves(value, path === '' ? key : `${path}.${key}`),
  );
}

const placeholders = (text: string): string[] =>
  [...text.matchAll(/\{\{(\w+)\}\}/g)].map(([, name]) => name ?? '').sort();

/** Makes Math.random select a given entry of a pool of the given size. */
function selectIndex(index: number, size: number): void {
  vi.spyOn(Math, 'random').mockReturnValue(index / size);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('CipherAI', () => {
  it('getLine returns a non-empty string for every context', () => {
    const cipher = new CipherAI(english);
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
    const cipher = new CipherAI(english);

    cipher.getLine('challenge_success');
    expect(cipher.getMood()).toBe('impressed');

    cipher.getLine('challenge_fail');
    expect(cipher.getMood()).toBe('concerned');
  });

  it('wrapHint prepends a CIPHER personality intro to the raw hint', () => {
    const cipher = new CipherAI(english);
    const rawHint = 'Check your indentation.';

    const wrapped = cipher.wrapHint(rawHint);

    expect(wrapped).toContain(rawHint);
    expect(wrapped.length).toBeGreaterThan(rawHint.length);
  });

  it('explainError for SyntaxError contains the error type and message', () => {
    const cipher = new CipherAI(english);

    const explanation = cipher.explainError('SyntaxError', 'expected :');

    expect(explanation).toContain('SyntaxError');
    expect(explanation).toContain('expected :');
  });

  it('explainError for NameError contains the error type and message', () => {
    const cipher = new CipherAI(english);

    const explanation = cipher.explainError('NameError', "name 'foo' is not defined");

    expect(explanation).toContain('NameError');
    expect(explanation).toContain("name 'foo' is not defined");
  });

  it('explainError for TypeError contains the error type and message', () => {
    const cipher = new CipherAI(english);

    const explanation = cipher.explainError('TypeError', 'unsupported operand type');

    expect(explanation).toContain('TypeError');
    expect(explanation).toContain('unsupported operand type');
  });

  it('getReaction for first-try no-hints success mentions being impressed', () => {
    const cipher = new CipherAI(english);

    const reaction = cipher.getReaction(true, 1, 0);

    expect(reaction).toContain('impressed');
  });

  it('getReaction for passing with many hints differs from no-hints reaction', () => {
    const cipher = new CipherAI(english);

    const noHints = cipher.getReaction(true, 1, 0);
    const manyHints = cipher.getReaction(true, 5, 5);

    expect(noHints).not.toBe(manyHints);
  });

  it('getReaction for failure returns a non-empty string', () => {
    const cipher = new CipherAI(english);

    const reaction = cipher.getReaction(false, 3, 1);

    expect(reaction.length).toBeGreaterThan(0);
  });

  it('getIdleChatter returns diverse messages across multiple calls', () => {
    const cipher = new CipherAI(english);
    const seen = new Set<string>();

    // With 12 distinct messages and 20 calls, the chance of all being identical is negligible
    for (let i = 0; i < 20; i++) {
      seen.add(cipher.getIdleChatter());
    }

    expect(seen.size).toBeGreaterThan(1);
  });

  it('setPlayerName is reflected in getReaction output', () => {
    const cipher = new CipherAI(english);
    cipher.setPlayerName('Viper');

    // First-try, no-hints reaction always interpolates playerName
    const firstTry = cipher.getReaction(true, 1, 0);
    expect(firstTry).toContain('Viper');
  });
});

describe('CipherAI localisation', () => {
  it('defaults to English from en/cipher.json', () => {
    const cipher = new CipherAI(english);

    selectIndex(0, enCipher.lines.exploration.length);
    expect(cipher.getLine('exploration')).toBe(enCipher.lines.exploration[0]);
    vi.restoreAllMocks();
    expect(enCipher.idleChatter).toContain(cipher.getIdleChatter());
    expect(enCipher.tips.loops).toContain(cipher.getCodingTip(['loops']));
  });

  it('speaks German through an injected translator', () => {
    const cipher = new CipherAI({ translator: createCipherTranslator(deCipher) });
    cipher.setPlayerName('Viper');

    selectIndex(0, deCipher.lines.exploration.length);
    expect(cipher.getLine('exploration')).toBe(deCipher.lines.exploration[0]);
    vi.restoreAllMocks();
    expect(deCipher.idleChatter).toContain(cipher.getIdleChatter());
    expect(deCipher.tips.lists).toContain(cipher.getCodingTip(['lists']));
    expect(cipher.getReaction(true, 1, 0)).toBe(
      'Erster Versuch, keine Hinweise: Viper, ich bin ehrlich beeindruckt. Der Algorithmus hatte nie eine Chance.',
    );
    expect(cipher.explainError('SyntaxError', 'expected :')).toBe(
      `${deCipher.errors.intro.SyntaxError} Konkret: expected :`,
    );
    expect(cipher.explainError('MemoryError', 'out of memory')).toContain(
      'Da ist ein MemoryError aufgetreten.',
    );
  });

  it('setTranslator switches the language of later lines', () => {
    const cipher = new CipherAI(english);
    cipher.setTranslator(createCipherTranslator(deCipher));

    expect(deCipher.idleChatter).toContain(cipher.getIdleChatter());
  });

  it('shows the key instead of crashing when a line is missing', () => {
    const echoKey = new CipherAI({ translator: (key) => key });
    const nothing = new CipherAI({ translator: () => undefined });

    expect(echoKey.getLine('story')).toBe('lines.story');
    expect(nothing.getLine('story')).toBe('lines.story');
  });

  it('never treats inherited object properties as known error types or concepts', () => {
    const cipher = new CipherAI(english);

    expect(cipher.explainError('constructor', 'boom')).toContain('Encountered a constructor.');
    expect(enCipher.tips.default).toContain(cipher.getCodingTip(['constructor']));
  });

  it('interpolates the player name and attempts into a chosen line', () => {
    const cipher = new CipherAI({ translator: createCipherTranslator(deCipher) });
    cipher.setPlayerName('Viper');

    selectIndex(9, deCipher.lines.challenge_fail.length);
    expect(cipher.getReaction(false, 4, 0)).toBe(
      'Das war Versuch Nummer 4. Laut historischen Daten macht es meistens bei Versuch 4+1 Klick.',
    );

    selectIndex(3, deCipher.lines.challenge_success.length);
    expect(cipher.getReaction(true, 2, 1)).toBe(
      'SYSTEM KOMPROMITTIERT, und zwar im allerbesten Sinn. Gut gemacht, Viper.',
    );
  });

  it('lets caller data override the player name in getLine', () => {
    const cipher = new CipherAI(english);

    selectIndex(2, enCipher.lines.greeting.length);
    expect(cipher.getLine('greeting', { playerName: 'Nova' })).toContain(
      'Welcome to the grid, Nova.',
    );
  });

  it('leaves no placeholder in a line for any random choice, in either language', () => {
    for (const locale of [enCipher, deCipher]) {
      const cipher = new CipherAI({ translator: createCipherTranslator(locale) });

      for (const context of CONTEXTS) {
        const size = enCipher.lines[context].length;
        for (let index = 0; index < size; index++) {
          selectIndex(index, size);
          expect(cipher.getLine(context)).not.toContain('{{');
        }
      }
    }
  });

  it('does not expand placeholder-like text inside values', () => {
    const cipher = new CipherAI(english);

    expect(cipher.explainError('SyntaxError', "f'{{playerName}}'")).toContain("f'{{playerName}}'");
  });

  it('keeps single-brace Python code in tips untouched', () => {
    const cipher = new CipherAI(english);

    selectIndex(1, enCipher.tips.strings.length);
    expect(cipher.getCodingTip(['strings'])).toContain("f'Hello, {name}!'");
  });

  it('has the same keys, pool sizes and placeholders in en and de', () => {
    const en = leaves(enCipher);
    const de = new Map(leaves(deCipher));

    expect([...de.keys()].sort()).toEqual(en.map(([key]) => key).sort());
    for (const [key, text] of en) {
      expect(placeholders(de.get(key) ?? ''), key).toEqual(placeholders(text));
    }
  });
});
