import type { Challenge } from '@venomous-snake/shared-types';

export const ch01_05_float_calculations: Challenge = {
  id: 'ch01_05_float_calculations',
  titleKey: 'challenges.ch01_05.title',
  descriptionKey: 'challenges.ch01_05.description',
  chapter: 1,
  order: 5,
  difficulty: 'easy',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch01_04_string_types'],
  xpReward: 100,
  tags: ['float', 'arithmetic', 'conversion'],

  scaffoldedCode:
    '# The server room temperature sensor reads in Celsius\n# Convert it to Fahrenheit: F = (C * 9/5) + 32\ncelsius = 100\nfahrenheit = ___\nprint(fahrenheit)',
  editableRegions: [{ startLine: 4, endLine: 4, placeholder: '(celsius * 9/5) + 32' }],
  solutionCode: 'celsius = 100\nfahrenheit = (celsius * 9/5) + 32\nprint(fahrenheit)',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print 212.0 for celsius = 100',
      expectedOutput: '212.0',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Works with freezing point',
      setup: 'celsius = 0',
      expectedOutput: '32.0',
      hidden: true,
    },
    {
      id: 'tc03',
      description: 'Works with body temperature',
      setup: 'celsius = 37',
      expectedOutput: '98.6',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'The Fahrenheit formula is: (Celsius * 9/5) + 32.',
    },
    {
      tier: 2,
      text: 'Use parentheses to control order of operations: (celsius * 9/5) + 32.',
    },
    {
      tier: 3,
      text: 'Solution: fahrenheit = (celsius * 9/5) + 32',
    },
  ],

  roomId: 'lobby_terminal_room',
  terminalId: 'terminal_05',
  preDialogKey: 'dialog.ch01_05.pre',
  postDialogKey: 'dialog.ch01_05.post',

  conceptsIntroduced: ['float', 'temperature_conversion'],
  conceptsReinforced: ['arithmetic', 'variables', 'print'],
};
