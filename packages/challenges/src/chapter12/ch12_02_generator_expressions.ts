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
  tags: ['generators', 'yield', 'lazy-evaluation'],
  scaffoldedCode:
    'def even_squares(data):\n    for x in data:\n        if x % 2 == 0:\n            ___ x ** 2\n\ndata = range(1, 11)\nresult = list(even_squares(data))\nprint(result)\n\ndef squares_up_to(n):\n    for x in range(1, n + 1):\n        ___ x ** 2\n\nprint(sum(squares_up_to(5)))',
  editableRegions: [
    { startLine: 4, endLine: 4, placeholder: 'yield' },
    { startLine: 12, endLine: 12, placeholder: 'yield' },
  ],
  solutionCode:
    'def even_squares(data):\n    for x in data:\n        if x % 2 == 0:\n            yield x ** 2\n\ndata = range(1, 11)\nresult = list(even_squares(data))\nprint(result)\n\ndef squares_up_to(n):\n    for x in range(1, n + 1):\n        yield x ** 2\n\nprint(sum(squares_up_to(5)))',
  testCases: [
    {
      id: 'tc01',
      description: 'Should create generator functions with yield',
      expectedOutput: '[4, 16, 36, 64, 100]\n55',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use yield for lazy evaluation',
      expectedOutput: '[4, 16, 36, 64, 100]\n55',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Generator functions use yield instead of return. They produce values one at a time.' },
    { tier: 2 as const, text: 'yield x ** 2 produces the squared value. Use list() to collect all yielded values.' },
    { tier: 3 as const, text: 'Solution: yield x ** 2 in both generator functions' },
  ],
  roomId: 'floor_12_room_01',
  terminalId: 'terminal_02',
  preDialogKey: 'dialog.ch12_02.pre',
  postDialogKey: 'dialog.ch12_02.post',
  conceptsIntroduced: ['generator_functions', 'lazy_evaluation'],
  conceptsReinforced: ['generators', 'list_comprehension', 'yield'],
};
