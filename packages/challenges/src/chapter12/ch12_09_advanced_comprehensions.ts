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
  tags: ['comprehensions', 'nested', 'advanced'],
  scaffoldedCode:
    '# Flatten a matrix keeping only odd numbers\n# Create floor-room pairs from a nested dictionary\n',
  solutionCode:
    'matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nflat = [x for row in matrix for x in row if x % 2 != 0]\nprint(flat)\n\nfloors = {"lobby": [1, 2], "ops": [3, 4], "intel": [5, 6]}\npairs = [(floor, room) for floor, rooms in floors.items() for room in rooms]\nprint(pairs)',
  testCases: [
    {
      id: 'tc01',
      description: 'Should flatten and create pairs',
      expectedOutput: '[1, 3, 5, 7, 9]\n[(\'lobby\', 1), (\'lobby\', 2), (\'ops\', 3), (\'ops\', 4), (\'intel\', 5), (\'intel\', 6)]',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use nested comprehensions',
      expectedOutput: '[1, 3, 5, 7, 9]\n[(\'lobby\', 1), (\'lobby\', 2), (\'ops\', 3), (\'ops\', 4), (\'intel\', 5), (\'intel\', 6)]',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Nested comprehension: [expr for outer in iterable for inner in outer]' },
    { tier: 2 as const, text: 'For dict iteration: for floor, rooms in floors.items() for room in rooms' },
    { tier: 3 as const, text: 'Solution: [x for row in matrix for x in row if x % 2 != 0] and [(floor, room) for ...]' },
  ],
  roomId: 'floor_12_room_01',
  terminalId: 'terminal_09',
  preDialogKey: 'dialog.ch12_09.pre',
  postDialogKey: 'dialog.ch12_09.post',
  conceptsIntroduced: ['nested_comprehensions', 'matrix_flattening'],
  conceptsReinforced: ['list_comprehension', 'dictionary'],
};
