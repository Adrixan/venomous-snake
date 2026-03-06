import type { Challenge } from '@venomous-snake/shared-types';

export const ch04_06_break_statement: Challenge = {
  id: 'ch04_06_break_statement',
  titleKey: 'challenges.ch04_06.title',
  descriptionKey: 'challenges.ch04_06.description',
  chapter: 4,
  order: 6,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch04_01_simple_for_loop'],
  xpReward: 175,
  tags: ['break', 'for', 'loop_control'],

  scaffoldedCode:
    '# Search for the target in the list and stop when found\ntargets = ["Martinez", "Chen", "TARGET_ALPHA", "Volkov", "Reyes"]\nfor name in targets:\n    if name == "TARGET_ALPHA":\n        print(f"Target found: {name}")\n        ___\n    print(f"Not a match: {name}")',
  editableRegions: [{ startLine: 6, endLine: 6, placeholder: 'break' }],
  solutionCode:
    'targets = ["Martinez", "Chen", "TARGET_ALPHA", "Volkov", "Reyes"]\nfor name in targets:\n    if name == "TARGET_ALPHA":\n        print(f"Target found: {name}")\n        break\n    print(f"Not a match: {name}")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should find TARGET_ALPHA and stop searching',
      expectedOutput: 'Not a match: Martinez\nNot a match: Chen\nTarget found: TARGET_ALPHA',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should not print names after TARGET_ALPHA',
      expectedOutput: 'Not a match: Martinez\nNot a match: Chen\nTarget found: TARGET_ALPHA',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'The break statement immediately exits the loop, skipping all remaining iterations.',
    },
    {
      tier: 2,
      text: 'Place break after printing the target found message to stop the search.',
    },
    {
      tier: 3,
      text: 'Solution: Add break after print(f"Target found: {name}")',
    },
  ],

  roomId: 'floor_4_room_01',
  terminalId: 'terminal_06',
  preDialogKey: 'dialog.ch04_06.pre',
  postDialogKey: 'dialog.ch04_06.post',

  conceptsIntroduced: ['break_statement'],
  conceptsReinforced: ['for_loop', 'if_statement', 'fstrings'],
};
