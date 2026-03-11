import type { Challenge } from '@venomous-snake/shared-types';

export const ch12_09_advanced_comprehensions: Challenge = {
  id: 'ch12_09_advanced_comprehensions',
  titleKey: 'challenges.ch12_09.title',
  descriptionKey: 'challenges.ch12_09.description',
  chapter: 12,
  order: 9,
  difficulty: 'hard',
  scaffoldingLevel: 'open',
  prerequisites: ['ch12_08_walrus_operator'],
  xpReward: 310,
  tags: ['nested-loops', 'flattening', 'pairs'],
  scaffoldedCode:
    '# Flatten a matrix keeping only odd numbers using nested loops\n# Create floor-room pairs from a nested dictionary using nested loops\n',

  solutionCode:
    'matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nflat = []\nfor row in matrix:\n    for x in row:\n        if x % 2 != 0:\n            flat.append(x)\nprint(flat)\n\nfloors = {"lobby": [1, 2], "ops": [3, 4], "intel": [5, 6]}\npairs = []\nfor floor, rooms in floors.items():\n    for room in rooms:\n        pairs.append((floor, room))\nprint(pairs)',

  testCases: [
    {
      id: 'tc01',
      description: 'Should flatten matrix and create pairs',
      expectedOutput: '[1, 3, 5, 7, 9]\n[(\'lobby\', 1), (\'lobby\', 2), (\'ops\', 3), (\'ops\', 4), (\'intel\', 5), (\'intel\', 6)]',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use nested loops for complex iteration',
      expectedOutput: '[1, 3, 5, 7, 9]\n[(\'lobby\', 1), (\'lobby\', 2), (\'ops\', 3), (\'ops\', 4), (\'intel\', 5), (\'intel\', 6)]',
      hidden: true,
    },
  ],

  hints: [
    { tier: 1 as const, text: 'Nested for loops: the outer loop iterates rows, the inner loop iterates elements.' },
    { tier: 2 as const, text: 'For dict iteration: for floor, rooms in floors.items(): then for room in rooms:' },
    { tier: 3 as const, text: 'Solution: nested for loops with append for both flattening and pair creation' },
  ],

  roomId: 'floor_12_room_01',
  terminalId: 'terminal_09',
  preDialogKey: 'dialog.ch12_09.pre',
  postDialogKey: 'dialog.ch12_09.post',

  conceptsIntroduced: ['nested_iteration', 'matrix_flattening'],
  conceptsReinforced: ['for_loop', 'dictionary', 'list_methods'],
};
