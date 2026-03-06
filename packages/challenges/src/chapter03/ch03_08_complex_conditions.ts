import type { Challenge } from '@venomous-snake/shared-types';

export const ch03_08_complex_conditions: Challenge = {
  id: 'ch03_08_complex_conditions',
  titleKey: 'challenges.ch03_08.title',
  descriptionKey: 'challenges.ch03_08.description',
  chapter: 3,
  order: 8,
  difficulty: 'medium',
  scaffoldingLevel: 'open',
  prerequisites: ['ch03_05_logical_operators', 'ch02_08_len_and_string_ops'],
  xpReward: 200,
  tags: ['conditions', 'validation', 'string_methods', 'len'],

  scaffoldedCode: '# Write your solution here\n',

  solutionCode:
    'password = "Snake99"\n\nhas_length = len(password) >= 6\nhas_digit = any(c.isdigit() for c in password)\nhas_letter = any(c.isalpha() for c in password)\n\nif has_length and has_digit and has_letter:\n    print("Password VALID")\nelse:\n    print("Password INVALID")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should validate "Snake99" as a valid password',
      expectedOutput: 'Password VALID',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should check length, digit, and letter requirements',
      expectedOutput: 'Password VALID',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'A valid password needs: at least 6 characters, at least one digit, and at least one letter.',
    },
    {
      tier: 2,
      text: 'Use len() for length, .isdigit() to check for digits, and .isalpha() for letters. The any() function helps check each character.',
    },
    {
      tier: 3,
      text: 'Solution: has_length = len(password) >= 6, has_digit = any(c.isdigit() for c in password), has_letter = any(c.isalpha() for c in password)',
    },
  ],

  roomId: 'floor_3_room_01',
  terminalId: 'terminal_08',
  preDialogKey: 'dialog.ch03_08.pre',
  postDialogKey: 'dialog.ch03_08.post',

  conceptsIntroduced: ['complex_conditions', 'any_function', 'isdigit', 'isalpha'],
  conceptsReinforced: ['logical_and', 'len', 'if_else'],
};
