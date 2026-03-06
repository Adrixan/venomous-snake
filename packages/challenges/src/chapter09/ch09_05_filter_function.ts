import type { Challenge } from '@venomous-snake/shared-types';

export const ch09_05_filter_function: Challenge = {
  id: 'ch09_05_filter_function',
  titleKey: 'challenges.ch09_05.title',
  descriptionKey: 'challenges.ch09_05.description',
  chapter: 9,
  order: 5,
  difficulty: 'medium',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch09_04_map_function'],
  xpReward: 185,
  tags: ['filter', 'lambda', 'selection'],
  scaffoldedCode:
    'signals = [0, 15, 3, 42, 7, 100, 0, 23]\nactive = list(filter(___, signals))\nprint(active)',
  editableRegions: [
    { startLine: 2, endLine: 2, placeholder: 'lambda x: x > 10' },
  ],
  solutionCode:
    'signals = [0, 15, 3, 42, 7, 100, 0, 23]\nactive = list(filter(lambda x: x > 10, signals))\nprint(active)',
  testCases: [
    {
      id: 'tc01',
      description: 'Should filter signals greater than 10',
      expectedOutput: '[15, 42, 100, 23]',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use filter with lambda',
      expectedOutput: '[15, 42, 100, 23]',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'filter(function, iterable) keeps only elements where the function returns True.' },
    { tier: 2 as const, text: 'Use lambda x: x > 10 to keep values greater than 10.' },
    { tier: 3 as const, text: 'Solution: list(filter(lambda x: x > 10, signals))' },
  ],
  roomId: 'floor_9_room_01',
  terminalId: 'terminal_05',
  preDialogKey: 'dialog.ch09_05.pre',
  postDialogKey: 'dialog.ch09_05.post',
  conceptsIntroduced: ['filter_function'],
  conceptsReinforced: ['lambda', 'lists'],
};
