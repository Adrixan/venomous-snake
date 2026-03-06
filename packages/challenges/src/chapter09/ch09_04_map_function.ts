import type { Challenge } from '@venomous-snake/shared-types';

export const ch09_04_map_function: Challenge = {
  id: 'ch09_04_map_function',
  titleKey: 'challenges.ch09_04.title',
  descriptionKey: 'challenges.ch09_04.description',
  chapter: 9,
  order: 4,
  difficulty: 'medium',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch09_03_lambda_functions'],
  xpReward: 185,
  tags: ['map', 'lambda', 'transformation'],
  scaffoldedCode:
    'codes = [1, 2, 3, 4, 5]\nencrypted = list(map(___, codes))\nprint(encrypted)',
  editableRegions: [
    { startLine: 2, endLine: 2, placeholder: 'lambda x: x * 7 + 3' },
  ],
  solutionCode:
    'codes = [1, 2, 3, 4, 5]\nencrypted = list(map(lambda x: x * 7 + 3, codes))\nprint(encrypted)',
  testCases: [
    {
      id: 'tc01',
      description: 'Should transform codes using map',
      expectedOutput: '[10, 17, 24, 31, 38]',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should apply lambda to each element',
      expectedOutput: '[10, 17, 24, 31, 38]',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'map(function, iterable) applies the function to each element.' },
    { tier: 2 as const, text: 'Use lambda x: x * 7 + 3 as the transformation function.' },
    { tier: 3 as const, text: 'Solution: list(map(lambda x: x * 7 + 3, codes))' },
  ],
  roomId: 'floor_9_room_01',
  terminalId: 'terminal_04',
  preDialogKey: 'dialog.ch09_04.pre',
  postDialogKey: 'dialog.ch09_04.post',
  conceptsIntroduced: ['map_function'],
  conceptsReinforced: ['lambda', 'lists'],
};
