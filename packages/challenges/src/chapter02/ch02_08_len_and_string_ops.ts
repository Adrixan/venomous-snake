import type { Challenge } from '@venomous-snake/shared-types';

export const ch02_08_len_and_string_ops: Challenge = {
  id: 'ch02_08_len_and_string_ops',
  titleKey: 'challenges.ch02_08.title',
  descriptionKey: 'challenges.ch02_08.description',
  chapter: 2,
  order: 8,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch02_04_fstrings_basics'],
  xpReward: 150,
  tags: ['len', 'strings', 'if_else', 'validation'],

  scaffoldedCode:
    '# Check if the password meets the minimum length requirement\npassword = "Rattlesnake99"\nlength = ___\nprint(f"Password length: {length}")\nif length >= 8:\n    print("Length check: PASSED")\nelse:\n    print("Length check: FAILED")',
  editableRegions: [{ startLine: 3, endLine: 3, placeholder: 'len(password)' }],
  solutionCode:
    'password = "Rattlesnake99"\nlength = len(password)\nprint(f"Password length: {length}")\nif length >= 8:\n    print("Length check: PASSED")\nelse:\n    print("Length check: FAILED")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should report password length of 13',
      expectedOutput: 'Password length: 13\nLength check: PASSED',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should pass the length check for a long password',
      expectedOutput: 'Password length: 13\nLength check: PASSED',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'The len() function returns the number of characters in a string.',
    },
    {
      tier: 2,
      text: 'Use len(password) to get the length, then compare with >= 8.',
    },
    {
      tier: 3,
      text: 'Solution: length = len(password). The if/else is already written for you.',
    },
  ],

  roomId: 'floor_2_room_01',
  terminalId: 'terminal_08',
  preDialogKey: 'dialog.ch02_08.pre',
  postDialogKey: 'dialog.ch02_08.post',

  conceptsIntroduced: ['len', 'string_length'],
  conceptsReinforced: ['fstrings', 'variables', 'print'],
};
