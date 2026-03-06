import type { Challenge, ErrorPattern, PythonError } from '@venomous-snake/shared-types';

export interface HintResult {
  hint: string;
  tier: 1 | 2 | 3;
  source: 'error_pattern' | 'challenge_hint' | 'generic';
}

/** Common Python error patterns that apply to all challenges */
const COMMON_ERROR_PATTERNS: ErrorPattern[] = [
  {
    errorType: 'SyntaxError',
    pattern: 'expected.*:',
    hintText:
      "Looks like you're missing a colon (:). In Python, statements like if, for, while, def, and class need a colon at the end of the line.",
    category: 'missing_colon',
  },
  {
    errorType: 'SyntaxError',
    pattern: 'unexpected indent',
    hintText:
      'Your indentation is off. In Python, indentation matters! Make sure all lines in the same block have the same indentation level.',
    category: 'indentation',
  },
  {
    errorType: 'NameError',
    pattern: "name '(.+)' is not defined",
    hintText:
      "You're trying to use a variable or function that doesn't exist yet. Check for typos in the name, or make sure you defined it before using it.",
    category: 'undefined_name',
  },
  {
    errorType: 'TypeError',
    pattern: "can only concatenate str.*to str|can't.*str.*int",
    hintText:
      "You're trying to mix text (strings) with numbers. Use str() to convert numbers to text, or int()/float() to convert text to numbers.",
    category: 'type_mismatch',
  },
  {
    errorType: 'IndentationError',
    pattern: '.*',
    hintText:
      "Python uses indentation (spaces at the start of lines) to group code. Make sure you're using consistent indentation — 4 spaces per level is the standard.",
    category: 'indentation',
  },
  {
    errorType: 'SyntaxError',
    pattern: 'EOL while scanning string',
    hintText:
      'You started a string with a quote but forgot to close it. Make sure every opening quote has a matching closing quote.',
    category: 'unclosed_string',
  },
  {
    errorType: 'TypeError',
    pattern: 'missing \\d+ required positional argument',
    hintText:
      "You called a function but didn't pass enough arguments. Check the function definition to see what parameters it needs.",
    category: 'missing_args',
  },
  {
    errorType: 'ValueError',
    pattern: 'invalid literal for int\\(\\)',
    hintText:
      "You're trying to convert something to an integer that isn't a valid number. Make sure the value you're converting is actually a number.",
    category: 'invalid_conversion',
  },
  {
    errorType: 'IndexError',
    pattern: 'list index out of range',
    hintText:
      "You're trying to access a list item that doesn't exist. Remember, Python lists start at index 0. A list with 3 items has indices 0, 1, and 2.",
    category: 'index_out_of_range',
  },
  {
    errorType: 'KeyError',
    pattern: '.*',
    hintText:
      "You're trying to access a dictionary key that doesn't exist. Check if the key is spelled correctly, or use .get() to provide a default value.",
    category: 'key_error',
  },
];

export class HintEngine {
  private hintsUsed = new Map<string, number>();

  getHint(challenge: Challenge, error?: PythonError): HintResult | null {
    const hintsRevealed = this.hintsUsed.get(challenge.id) ?? 0;

    if (error !== undefined) {
      const patternHint = this.matchErrorPattern(error, challenge.errorPatterns);
      if (patternHint !== null) {
        return { hint: patternHint, tier: 1, source: 'error_pattern' };
      }
    }

    const availableHints = challenge.hints
      .filter((h) => h.tier <= Math.min(hintsRevealed + 1, 3))
      .sort((a, b) => a.tier - b.tier);

    const nextHint = availableHints[hintsRevealed];
    if (nextHint !== undefined) {
      this.hintsUsed.set(challenge.id, hintsRevealed + 1);
      return { hint: nextHint.text, tier: nextHint.tier, source: 'challenge_hint' };
    }

    return {
      hint: "Don't give up! Try re-reading the challenge description carefully. Sometimes the answer is hiding in plain sight.",
      tier: 1,
      source: 'generic',
    };
  }

  getHintsUsedCount(challengeId: string): number {
    return this.hintsUsed.get(challengeId) ?? 0;
  }

  resetHints(challengeId: string): void {
    this.hintsUsed.delete(challengeId);
  }

  private matchErrorPattern(error: PythonError, challengePatterns?: ErrorPattern[]): string | null {
    const allPatterns = [...(challengePatterns ?? []), ...COMMON_ERROR_PATTERNS];

    for (const pattern of allPatterns) {
      if (error.type === pattern.errorType) {
        const regex = new RegExp(pattern.pattern, 'i');
        if (regex.test(error.message)) {
          return pattern.hintText;
        }
      }
    }

    return null;
  }
}
