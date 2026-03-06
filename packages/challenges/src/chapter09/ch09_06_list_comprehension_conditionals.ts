import type { Challenge } from '@venomous-snake/shared-types';

export const ch09_06_list_comprehension_conditionals: Challenge = {
  id: 'ch09_06_list_comprehension_conditionals',
  titleKey: 'challenges.ch09_06.title',
  descriptionKey: 'challenges.ch09_06.description',
  chapter: 9,
  order: 6,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch09_05_filter_function'],
  xpReward: 190,
  tags: ['list-comprehension', 'conditionals', 'filtering'],
  scaffoldedCode:
    'data = range(1, 21)\nresult = [x for x in data if ___]\nprint(result)',
  solutionCode:
    'data = range(1, 21)\nresult = [x for x in data if x % 2 == 0 and x % 3 == 0]\nprint(result)',
  testCases: [
    {
      id: 'tc01',
      description: 'Should find multiples of both 2 and 3',
      expectedOutput: '[6, 12, 18]',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use compound condition in comprehension',
      expectedOutput: '[6, 12, 18]',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Use the modulo operator % to check divisibility. x % 2 == 0 means even.' },
    { tier: 2 as const, text: 'Combine conditions with and: x % 2 == 0 and x % 3 == 0.' },
    { tier: 3 as const, text: 'Solution: [x for x in data if x % 2 == 0 and x % 3 == 0]' },
  ],
  roomId: 'floor_9_room_01',
  terminalId: 'terminal_06',
  preDialogKey: 'dialog.ch09_06.pre',
  postDialogKey: 'dialog.ch09_06.post',
  conceptsIntroduced: ['conditional_comprehension', 'compound_conditions'],
  conceptsReinforced: ['list_comprehension', 'range'],
};
