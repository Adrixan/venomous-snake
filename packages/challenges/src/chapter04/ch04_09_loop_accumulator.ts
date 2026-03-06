import type { Challenge } from '@venomous-snake/shared-types';

export const ch04_09_loop_accumulator: Challenge = {
  id: 'ch04_09_loop_accumulator',
  titleKey: 'challenges.ch04_09.title',
  descriptionKey: 'challenges.ch04_09.description',
  chapter: 4,
  order: 9,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch04_01_simple_for_loop'],
  xpReward: 175,
  tags: ['accumulator', 'for', 'sum'],

  scaffoldedCode:
    '# Sum all badge numbers to get the total\nbadge_numbers = [1042, 2318, 847, 3991, 562]\ntotal = 0\nfor badge in badge_numbers:\n    total += ___\nprint(f"Total: {total}")',
  editableRegions: [{ startLine: 5, endLine: 5, placeholder: 'badge' }],
  solutionCode:
    'badge_numbers = [1042, 2318, 847, 3991, 562]\ntotal = 0\nfor badge in badge_numbers:\n    total += badge\nprint(f"Total: {total}")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should compute the total of all badge numbers',
      expectedOutput: 'Total: 8760',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use accumulator pattern with +=',
      expectedOutput: 'Total: 8760',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'The accumulator pattern: start with total = 0, then add each item with += in the loop.',
    },
    {
      tier: 2,
      text: 'total += badge adds the current badge number to the running total.',
    },
    {
      tier: 3,
      text: 'Solution: total += badge inside the for loop.',
    },
  ],

  roomId: 'floor_4_room_01',
  terminalId: 'terminal_09',
  preDialogKey: 'dialog.ch04_09.pre',
  postDialogKey: 'dialog.ch04_09.post',

  conceptsIntroduced: ['accumulator_pattern', 'augmented_assignment'],
  conceptsReinforced: ['for_loop', 'fstrings'],
};
