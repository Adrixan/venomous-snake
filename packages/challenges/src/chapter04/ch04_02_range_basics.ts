import type { Challenge } from '@venomous-snake/shared-types';

export const ch04_02_range_basics: Challenge = {
  id: 'ch04_02_range_basics',
  titleKey: 'challenges.ch04_02.title',
  descriptionKey: 'challenges.ch04_02.description',
  chapter: 4,
  order: 2,
  difficulty: 'easy',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch04_01_simple_for_loop'],
  xpReward: 100,
  tags: ['for', 'range', 'loop'],

  scaffoldedCode:
    '# Label each security camera using range()\nfor i in ___:\n    print(f"Camera {i}")',
  editableRegions: [{ startLine: 2, endLine: 2, placeholder: 'range(5)' }],
  solutionCode: 'for i in range(5):\n    print(f"Camera {i}")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print Camera 0 through Camera 4',
      expectedOutput: 'Camera 0\nCamera 1\nCamera 2\nCamera 3\nCamera 4',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use range(5) to generate numbers 0-4',
      expectedOutput: 'Camera 0\nCamera 1\nCamera 2\nCamera 3\nCamera 4',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'range(n) generates numbers from 0 up to (but not including) n.',
    },
    {
      tier: 2,
      text: 'range(5) gives you: 0, 1, 2, 3, 4. Use it in a for loop.',
    },
    {
      tier: 3,
      text: 'Solution: for i in range(5): print(f"Camera {i}")',
    },
  ],

  roomId: 'floor_4_room_01',
  terminalId: 'terminal_02',
  preDialogKey: 'dialog.ch04_02.pre',
  postDialogKey: 'dialog.ch04_02.post',

  conceptsIntroduced: ['range', 'counting_loop'],
  conceptsReinforced: ['for_loop', 'fstrings'],
};
