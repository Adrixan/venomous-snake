import type { Challenge } from '@venomous-snake/shared-types';

export const ch12_01_generators: Challenge = {
  id: 'ch12_01_generators',
  titleKey: 'challenges.ch12_01.title',
  descriptionKey: 'challenges.ch12_01.description',
  chapter: 12,
  order: 1,
  difficulty: 'hard',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch11_08_putting_it_together'],
  xpReward: 250,
  tags: ['generators', 'yield', 'iteration'],
  scaffoldedCode:
    'def signal_generator(start, count):\n    for i in range(count):\n        ___ start + i * 7\n\ngen = signal_generator(100, 5)\nfor signal in gen:\n    print(signal)',
  editableRegions: [
    { startLine: 3, endLine: 3, placeholder: 'yield' },
  ],
  solutionCode:
    'def signal_generator(start, count):\n    for i in range(count):\n        yield start + i * 7\n\ngen = signal_generator(100, 5)\nfor signal in gen:\n    print(signal)',
  testCases: [
    {
      id: 'tc01',
      description: 'Should generate signal sequence',
      expectedOutput: '100\n107\n114\n121\n128',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use yield keyword',
      expectedOutput: '100\n107\n114\n121\n128',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'yield pauses the function and returns a value. The function resumes on next iteration.' },
    { tier: 2 as const, text: 'Replace return with yield to make a function into a generator.' },
    { tier: 3 as const, text: 'Solution: yield start + i * 7' },
  ],
  roomId: 'floor_12_room_01',
  terminalId: 'terminal_01',
  preDialogKey: 'dialog.ch12_01.pre',
  postDialogKey: 'dialog.ch12_01.post',
  conceptsIntroduced: ['generators', 'yield_keyword'],
  conceptsReinforced: ['for_loop', 'range', 'function_definition'],
};
