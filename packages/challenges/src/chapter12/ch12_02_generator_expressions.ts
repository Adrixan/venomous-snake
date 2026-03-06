import type { Challenge } from '@venomous-snake/shared-types';

export const ch12_02_generator_expressions: Challenge = {
  id: 'ch12_02_generator_expressions',
  titleKey: 'challenges.ch12_02.title',
  descriptionKey: 'challenges.ch12_02.description',
  chapter: 12,
  order: 2,
  difficulty: 'hard',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch12_01_generators'],
  xpReward: 260,
  tags: ['generators', 'expressions', 'lazy-evaluation'],
  scaffoldedCode:
    'data = range(1, 11)\ngen = (___ for x in data if ___)\nresult = list(gen)\nprint(result)\nprint(sum(___ for x in range(1, 6)))',
  solutionCode:
    'data = range(1, 11)\ngen = (x ** 2 for x in data if x % 2 == 0)\nresult = list(gen)\nprint(result)\nprint(sum(x ** 2 for x in range(1, 6)))',
  testCases: [
    {
      id: 'tc01',
      description: 'Should create generator expressions',
      expectedOutput: '[4, 16, 36, 64, 100]\n55',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use inline generators',
      expectedOutput: '[4, 16, 36, 64, 100]\n55',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Generator expressions use () instead of []. They evaluate lazily.' },
    { tier: 2 as const, text: '(x ** 2 for x in data if x % 2 == 0) squares even numbers from data.' },
    { tier: 3 as const, text: 'Solution: (x ** 2 for x in data if x % 2 == 0) and sum(x ** 2 for x in range(1, 6))' },
  ],
  roomId: 'floor_12_room_01',
  terminalId: 'terminal_02',
  preDialogKey: 'dialog.ch12_02.pre',
  postDialogKey: 'dialog.ch12_02.post',
  conceptsIntroduced: ['generator_expressions', 'lazy_evaluation'],
  conceptsReinforced: ['generators', 'list_comprehension'],
};
