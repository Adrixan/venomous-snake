import type { Challenge } from '@venomous-snake/shared-types';

export const ch03_03_comparison_operators: Challenge = {
  id: 'ch03_03_comparison_operators',
  titleKey: 'challenges.ch03_03.title',
  descriptionKey: 'challenges.ch03_03.description',
  chapter: 3,
  order: 3,
  difficulty: 'easy',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch03_01_simple_if'],
  xpReward: 125,
  tags: ['comparison', 'operators', 'boolean'],

  scaffoldedCode:
    '# Compare your clearance level against the required level\nmy_level = 3\nrequired_level = 5\nprint(my_level > required_level)\nprint(my_level < required_level)\nprint(___)\nprint(___)',
  editableRegions: [
    { startLine: 6, endLine: 6, placeholder: 'my_level == required_level' },
    { startLine: 7, endLine: 7, placeholder: 'my_level >= required_level' },
  ],
  solutionCode:
    'my_level = 3\nrequired_level = 5\nprint(my_level > required_level)\nprint(my_level < required_level)\nprint(my_level == required_level)\nprint(my_level >= required_level)',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print False for 3 > 5',
      expectedOutput: 'False\nTrue\nFalse\nFalse',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should correctly evaluate all comparison operators',
      expectedOutput: 'False\nTrue\nFalse\nFalse',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Comparison operators: > (greater), < (less), == (equal), >= (greater or equal), <= (less or equal).',
    },
    {
      tier: 2,
      text: '3 == 5 is False. 3 >= 5 is also False because 3 is not greater than or equal to 5.',
    },
    {
      tier: 3,
      text: 'Solution: print(my_level == required_level) and print(my_level >= required_level)',
    },
  ],

  roomId: 'floor_3_room_01',
  terminalId: 'terminal_03',
  preDialogKey: 'dialog.ch03_03.pre',
  postDialogKey: 'dialog.ch03_03.post',

  conceptsIntroduced: ['comparison_operators', 'greater_than', 'less_than', 'equality'],
  conceptsReinforced: ['print', 'variables'],
};
