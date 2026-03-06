import type { Challenge } from '@venomous-snake/shared-types';

export const ch04_10_for_enumerate: Challenge = {
  id: 'ch04_10_for_enumerate',
  titleKey: 'challenges.ch04_10.title',
  descriptionKey: 'challenges.ch04_10.description',
  chapter: 4,
  order: 10,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch04_01_simple_for_loop'],
  xpReward: 175,
  tags: ['enumerate', 'for', 'indexing'],

  scaffoldedCode:
    '# Number each access point starting from 1\naccess_points = ["Main Gate", "Side Door", "Roof Hatch", "Basement"]\nfor i, point in ___:\n    print(f"{i}. {point}")',
  editableRegions: [{ startLine: 3, endLine: 3, placeholder: 'enumerate(access_points, 1)' }],
  solutionCode:
    'access_points = ["Main Gate", "Side Door", "Roof Hatch", "Basement"]\nfor i, point in enumerate(access_points, 1):\n    print(f"{i}. {point}")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should number access points starting from 1',
      expectedOutput: '1. Main Gate\n2. Side Door\n3. Roof Hatch\n4. Basement',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use enumerate with start=1',
      expectedOutput: '1. Main Gate\n2. Side Door\n3. Roof Hatch\n4. Basement',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'enumerate() gives you both the index and the value for each item in a list.',
    },
    {
      tier: 2,
      text: 'enumerate(list, 1) starts counting from 1 instead of 0.',
    },
    {
      tier: 3,
      text: 'Solution: for i, point in enumerate(access_points, 1):',
    },
  ],

  roomId: 'floor_4_room_01',
  terminalId: 'terminal_10',
  preDialogKey: 'dialog.ch04_10.pre',
  postDialogKey: 'dialog.ch04_10.post',

  conceptsIntroduced: ['enumerate', 'tuple_unpacking'],
  conceptsReinforced: ['for_loop', 'fstrings'],
};
