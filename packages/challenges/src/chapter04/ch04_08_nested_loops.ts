import type { Challenge } from '@venomous-snake/shared-types';

export const ch04_08_nested_loops: Challenge = {
  id: 'ch04_08_nested_loops',
  titleKey: 'challenges.ch04_08.title',
  descriptionKey: 'challenges.ch04_08.description',
  chapter: 4,
  order: 8,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch04_01_simple_for_loop'],
  xpReward: 200,
  tags: ['nested_loops', 'for', 'grid'],

  scaffoldedCode:
    '# Generate all grid coordinates for the floor plan\nrows = ["A", "B", "C"]\ncols = [1, 2, 3]\nfor row in rows:\n    for col in cols:\n        print(f"___")',
  editableRegions: [{ startLine: 6, endLine: 6, placeholder: '{row}{col}' }],
  solutionCode:
    'rows = ["A", "B", "C"]\ncols = [1, 2, 3]\nfor row in rows:\n    for col in cols:\n        print(f"{row}{col}")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print all 9 grid coordinates',
      expectedOutput: 'A1\nA2\nA3\nB1\nB2\nB3\nC1\nC2\nC3',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should iterate rows then columns in nested order',
      expectedOutput: 'A1\nA2\nA3\nB1\nB2\nB3\nC1\nC2\nC3',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'A nested loop is a loop inside another loop. The inner loop runs completely for each outer iteration.',
    },
    {
      tier: 2,
      text: 'Use f"{row}{col}" to combine the current row letter with the current column number.',
    },
    {
      tier: 3,
      text: 'Solution: print(f"{row}{col}") inside the nested for loop.',
    },
  ],

  roomId: 'floor_4_room_01',
  terminalId: 'terminal_08',
  preDialogKey: 'dialog.ch04_08.pre',
  postDialogKey: 'dialog.ch04_08.post',

  conceptsIntroduced: ['nested_loops'],
  conceptsReinforced: ['for_loop', 'fstrings', 'iteration'],
};
