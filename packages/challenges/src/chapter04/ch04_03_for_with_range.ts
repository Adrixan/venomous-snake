import type { Challenge } from '@venomous-snake/shared-types';

export const ch04_03_for_with_range: Challenge = {
  id: 'ch04_03_for_with_range',
  titleKey: 'challenges.ch04_03.title',
  descriptionKey: 'challenges.ch04_03.description',
  chapter: 4,
  order: 3,
  difficulty: 'easy',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch04_02_range_basics'],
  xpReward: 125,
  tags: ['for', 'range', 'start_stop'],

  scaffoldedCode:
    '# Print the guard rotation schedule for hours 1 through 5\nfor hour in ___:\n    print(f"Hour {hour}: Guard on patrol")',
  editableRegions: [{ startLine: 2, endLine: 2, placeholder: 'range(1, 6)' }],
  solutionCode: 'for hour in range(1, 6):\n    print(f"Hour {hour}: Guard on patrol")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print patrol schedule for hours 1-5',
      expectedOutput:
        'Hour 1: Guard on patrol\nHour 2: Guard on patrol\nHour 3: Guard on patrol\nHour 4: Guard on patrol\nHour 5: Guard on patrol',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should start at 1 and end at 5 using range(1, 6)',
      expectedOutput:
        'Hour 1: Guard on patrol\nHour 2: Guard on patrol\nHour 3: Guard on patrol\nHour 4: Guard on patrol\nHour 5: Guard on patrol',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'range(start, stop) generates numbers from start up to (but not including) stop.',
    },
    {
      tier: 2,
      text: 'To get 1, 2, 3, 4, 5 you need range(1, 6) — the stop value is exclusive.',
    },
    {
      tier: 3,
      text: 'Solution: for hour in range(1, 6): print(f"Hour {hour}: Guard on patrol")',
    },
  ],

  roomId: 'floor_4_room_01',
  terminalId: 'terminal_03',
  preDialogKey: 'dialog.ch04_03.pre',
  postDialogKey: 'dialog.ch04_03.post',

  conceptsIntroduced: ['range_start_stop'],
  conceptsReinforced: ['for_loop', 'range', 'fstrings'],
};
