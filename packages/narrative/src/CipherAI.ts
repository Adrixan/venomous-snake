export type CipherMood = 'neutral' | 'excited' | 'concerned' | 'amused' | 'impressed' | 'thinking';

export type CipherContext =
  | 'idle'
  | 'challenge_start'
  | 'challenge_hint'
  | 'challenge_success'
  | 'challenge_fail'
  | 'exploration'
  | 'story'
  | 'greeting';

/**
 * Resolves a key of the `cipher` i18n namespace to its raw value: a string, or
 * an array of strings for a line pool. Placeholders must stay in place because
 * CipherAI fills them in itself. Any other result, or the key echoed back as
 * i18next does for a missing key, counts as missing; i18next itself falls back to English.
 */
export type CipherTranslator = (key: string) => unknown;

export interface CipherAIOptions {
  translator: CipherTranslator;
}

const MOOD_TRANSITIONS: Record<CipherContext, CipherMood> = {
  greeting: 'excited',
  challenge_start: 'thinking',
  challenge_hint: 'thinking',
  challenge_success: 'impressed',
  challenge_fail: 'concerned',
  exploration: 'neutral',
  story: 'thinking',
  idle: 'neutral',
};

const PLACEHOLDER = /\{\{\s*(\w+)\s*\}\}/g;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Builds a translator from a locale resource such as the content of `cipher.json`. */
export function createCipherTranslator(resource: object): CipherTranslator {
  return (key) =>
    key
      .split('.')
      .reduce<unknown>(
        (node, part) => (isRecord(node) && Object.hasOwn(node, part) ? node[part] : undefined),
        resource,
      );
}

function asText(value: unknown, key: string): string | undefined {
  return typeof value === 'string' && value !== key ? value : undefined;
}

function asPool(value: unknown): readonly string[] | undefined {
  const isPool =
    Array.isArray(value) && value.length > 0 && value.every((line) => typeof line === 'string');
  return isPool ? (value as string[]) : undefined;
}

function pickRandom<T>(arr: readonly T[]): T {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx] ?? (arr[0] as T);
}

/** Single pass, so placeholder-like text inside a value is never expanded. */
function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(PLACEHOLDER, (match, name: string) =>
    Object.hasOwn(vars, name) ? (vars[name] ?? match) : match,
  );
}

function canFill(line: string, vars: Record<string, string>): boolean {
  return [...line.matchAll(PLACEHOLDER)].every(([, name]) => Object.hasOwn(vars, name ?? ''));
}

export class CipherAI {
  private mood: CipherMood = 'neutral';
  private playerName = 'Agent';
  private translate: CipherTranslator;

  constructor(options: CipherAIOptions) {
    this.translate = options.translator;
  }

  setTranslator(translator: CipherTranslator): void {
    this.translate = translator;
  }

  setPlayerName(name: string): void {
    this.playerName = name;
  }

  getMood(): CipherMood {
    return this.mood;
  }

  getLine(context: CipherContext, data?: Record<string, string>): string {
    this.mood = MOOD_TRANSITIONS[context];
    return this.pickLine(`lines.${context}`, data);
  }

  wrapHint(rawHint: string): string {
    this.mood = 'thinking';
    return `${this.pickLine('lines.challenge_hint')} ${rawHint}`;
  }

  explainError(errorType: string, errorMessage: string): string {
    this.mood = 'concerned';
    const key = `errors.intro.${errorType}`;
    const intro = this.has(key) ? this.text(key) : this.text('errors.generic', { errorType });
    return this.text('errors.detail', { intro, errorMessage });
  }

  getReaction(passed: boolean, attempts: number, hintsUsed: number): string {
    if (passed) {
      this.mood = hintsUsed === 0 ? 'impressed' : 'excited';
      if (hintsUsed === 0 && attempts === 1) {
        return this.text('reactions.firstTry');
      }
      if (hintsUsed === 0) {
        return this.text('reactions.noHints', { attempts: String(attempts) });
      }
      if (hintsUsed >= 3) {
        return this.text('reactions.manyHints');
      }
      return this.pickLine('lines.challenge_success');
    }

    this.mood = 'concerned';
    return this.pickLine('lines.challenge_fail', { attempts: String(attempts) });
  }

  getIdleChatter(): string {
    this.mood = 'amused';
    return this.pickLine('idleChatter');
  }

  getCodingTip(concepts: string[]): string {
    this.mood = 'neutral';
    const concept = concepts.find((name) => this.has(`tips.${name}`)) ?? 'default';
    return this.pickLine(`tips.${concept}`);
  }

  private withPlayerName(vars?: Record<string, string>): Record<string, string> {
    return { playerName: this.playerName, ...vars };
  }

  private has(key: string): boolean {
    const value = this.translate(key);
    return asText(value, key) !== undefined || asPool(value) !== undefined;
  }

  private text(key: string, vars?: Record<string, string>): string {
    const raw = asText(this.translate(key), key) ?? key;
    return interpolate(raw, this.withPlayerName(vars));
  }

  /** Picks among the lines whose placeholders can all be filled, so none reaches the player. */
  private pickLine(key: string, vars?: Record<string, string>): string {
    const pool = asPool(this.translate(key)) ?? [key];
    const merged = this.withPlayerName(vars);
    const fillable = pool.filter((line) => canFill(line, merged));
    return interpolate(pickRandom(fillable.length > 0 ? fillable : pool), merged);
  }
}
