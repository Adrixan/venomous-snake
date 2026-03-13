import type { Challenge } from '@venomous-snake/shared-types';

export const ch01_03_math_ops: Challenge = {
  id: 'ch01_03_math_ops',
  titleKey: 'challenges.ch01_03.title',
  descriptionKey: 'challenges.ch01_03.description',
  chapter: 1,
  order: 3,
  difficulty: 'easy',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch01_02_variables'],
  xpReward: 100,
  tags: ['variables', 'arithmetic', 'int', 'float'],

  scaffoldedCode:
    '# Calculate the vault security code\n# Formula: (access_level * 10) + offset\naccess_level = 7\noffset = 3\nsecurity_code = ___\nprint(security_code)',
  editableRegions: [{ startLine: 5, endLine: 5, placeholder: 'access_level * 10 + offset' }],
  solutionCode:
    'access_level = 7\noffset = 3\nsecurity_code = access_level * 10 + offset\nprint(security_code)',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print 73',
      expectedOutput: '73',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Works with different values',
      setup: 'access_level = 5\noffset = 2',
      expectedOutput: '52',
      hidden: true,
    },
    {
      id: 'tc03',
      description: 'Works with other values',
      setup: 'access_level = 3\noffset = 8',
      expectedOutput: '38',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Python supports +, -, *, / for arithmetic. You can use variables in expressions.',
    },
    {
      tier: 2,
      text: 'Multiply access_level by 10, then add offset: access_level * 10 + offset',
    },
    { tier: 3, text: 'Solution: security_code = access_level * 10 + offset' },
  ],

  errorPatterns: [
    {
      errorType: 'SyntaxError',
      pattern: '___',
      hintText:
        'Replace the ___ placeholder with the arithmetic expression. Do not leave the underscores in your code.',
      category: 'placeholder_not_replaced',
    },
  ],

  roomId: 'lobby_terminal_room',
  terminalId: 'terminal_03',
  preDialogKey: 'dialog.ch01_03.pre',
  postDialogKey: 'dialog.ch01_03.post',

  conceptsIntroduced: ['int', 'arithmetic', 'operators'],
  conceptsReinforced: ['variables', 'print'],
};
