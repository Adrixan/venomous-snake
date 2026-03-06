import type { Challenge } from '@venomous-snake/shared-types';

export const ch04_05_while_condition: Challenge = {
  id: 'ch04_05_while_condition',
  titleKey: 'challenges.ch04_05.title',
  descriptionKey: 'challenges.ch04_05.description',
  chapter: 4,
  order: 5,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch04_04_while_basics', 'ch02_05_input_basics'],
  xpReward: 175,
  tags: ['while', 'input', 'password'],

  scaffoldedCode:
    '# Keep asking for the password until it is correct\ncorrect_password = "viper"\nattempts = 0\npassword = input("Enter password: ")\nwhile ___:\n    attempts += 1\n    print(f"Incorrect. Attempt {attempts}.")\n    password = input("Enter password: ")\nprint("Access granted!")',
  editableRegions: [{ startLine: 5, endLine: 5, placeholder: 'password != correct_password' }],
  solutionCode:
    'correct_password = "viper"\nattempts = 0\npassword = input("Enter password: ")\nwhile password != correct_password:\n    attempts += 1\n    print(f"Incorrect. Attempt {attempts}.")\n    password = input("Enter password: ")\nprint("Access granted!")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should grant access after one wrong attempt',
      input: 'snake\nviper',
      expectedOutput: 'Incorrect. Attempt 1.\nAccess granted!',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should grant access immediately with correct password',
      input: 'viper',
      expectedOutput: 'Access granted!',
      hidden: false,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'The while loop should continue as long as the password is wrong.',
    },
    {
      tier: 2,
      text: 'Use != to check inequality: while password != correct_password.',
    },
    {
      tier: 3,
      text: 'Solution: while password != correct_password:',
    },
  ],

  roomId: 'floor_4_room_01',
  terminalId: 'terminal_05',
  preDialogKey: 'dialog.ch04_05.pre',
  postDialogKey: 'dialog.ch04_05.post',

  conceptsIntroduced: ['while_with_input', 'not_equal'],
  conceptsReinforced: ['while_loop', 'input', 'fstrings'],
};
