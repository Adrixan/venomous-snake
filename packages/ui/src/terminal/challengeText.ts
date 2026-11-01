import type { TFunction } from 'i18next';
import { challengeKey } from '@venomous-snake/challenge-engine';
import { i18n } from '@venomous-snake/i18n';
import type { TestFailure } from '@venomous-snake/challenge-engine';
import type { Challenge, Difficulty, TestCase } from '@venomous-snake/shared-types';

/** A test's description in the active language; English lives in the challenge data. */
export function testLabel(t: TFunction, challengeId: string, testCase: TestCase): string {
  return t(`challenges:${challengeKey({ id: challengeId })}.tests.${testCase.id}`, {
    defaultValue: testCase.description,
  });
}

export function difficultyLabel(t: TFunction, difficulty: Difficulty): string {
  return t(`ui:challenge.difficulty.${difficulty}`);
}

export function failureText(t: TFunction, failure: TestFailure): string {
  switch (failure.code) {
    case 'timeout':
      return t('ui:terminal.failure.timeout');
    case 'wrong_error':
      return t('ui:terminal.failure.wrong_error', {
        expected: failure.expected,
        actual: failure.actual ?? t('ui:terminal.failure.no_error'),
      });
    case 'wrong_output':
      return t('ui:terminal.failure.wrong_output', {
        expected: failure.expected,
        actual: failure.actual,
      });
  }
}

/** Starter code with its comments in the active language; the code itself stays as written. */
export function localizedScaffold(challenge: Challenge): string {
  // Read as raw data: the comments are the keys here, and i18next would split them on `:`.
  const comments: unknown = i18n.getResource(
    i18n.resolvedLanguage ?? 'en',
    'challenges',
    `${challengeKey(challenge)}.comments`,
  );
  if (typeof comments !== 'object' || comments === null) return challenge.scaffoldedCode;
  return Object.entries(comments as Record<string, string>).reduce(
    (code, [original, translated]) => code.split(original).join(translated),
    challenge.scaffoldedCode,
  );
}
