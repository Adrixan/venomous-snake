import type { Challenge } from '@venomous-snake/shared-types';

export const ch01_04_string_types: Challenge = {
  id: 'ch01_04_string_types',
  titleKey: 'challenges.ch01_04.title',
  descriptionKey: 'challenges.ch01_04.description',
  chapter: 1,
  order: 4,
  difficulty: 'beginner',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch01_03_math_ops'],
  xpReward: 75,
  tags: ['type', 'str', 'int'],

  scaffoldedCode:
    '# Investigate the types of your data\n# Replace ___ with appropriate values\ncodename = ___\nclearance = ___\nprint(type(codename))\nprint(type(clearance))',
  editableRegions: [
    { startLine: 3, endLine: 3, placeholder: '"Viper"' },
    { startLine: 4, endLine: 4, placeholder: '5' },
  ],
  solutionCode: 'codename = "Viper"\nclearance = 5\nprint(type(codename))\nprint(type(clearance))',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print the type of a string variable',
      expectedOutput: "<class 'str'>",
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should print the types of both variables',
      expectedOutput: "<class 'str'>\n<class 'int'>",
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'The type() function reveals what kind of data a variable holds.',
    },
    {
      tier: 2,
      text: 'Strings are created with quotes like "Viper". Numbers without quotes like 5.',
    },
    {
      tier: 3,
      text: 'Solution: codename = "Viper" and clearance = 5',
    },
  ],

  roomId: 'lobby_terminal_room',
  terminalId: 'terminal_04',
  preDialogKey: 'dialog.ch01_04.pre',
  postDialogKey: 'dialog.ch01_04.post',

  conceptsIntroduced: ['type', 'str_type', 'int_type'],
  conceptsReinforced: ['variables', 'print'],
};
