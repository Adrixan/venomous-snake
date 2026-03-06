import type { Challenge } from '@venomous-snake/shared-types';

export const ch05_08_args: Challenge = {
  id: 'ch05_08_args',
  titleKey: 'challenges.ch05_08.title',
  descriptionKey: 'challenges.ch05_08.description',
  chapter: 5,
  order: 8,
  difficulty: 'medium',
  scaffoldingLevel: 'open',
  prerequisites: ['ch05_03_multiple_parameters'],
  xpReward: 200,
  tags: ['args', 'variadic', 'function'],

  scaffoldedCode: '# Write your solution here\n',

  solutionCode:
    'def log_activities(*activities):\n    for activity in activities:\n        print(f"[LOG] {activity}")\n\nlog_activities("Accessed terminal", "Bypassed firewall", "Extracted data")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should log all three activities',
      expectedOutput: '[LOG] Accessed terminal\n[LOG] Bypassed firewall\n[LOG] Extracted data',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should handle variable number of arguments',
      expectedOutput: '[LOG] Accessed terminal\n[LOG] Bypassed firewall\n[LOG] Extracted data',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: '*args lets a function accept any number of positional arguments as a tuple.',
    },
    {
      tier: 2,
      text: 'def log_activities(*activities): — then loop over activities with a for loop.',
    },
    {
      tier: 3,
      text: 'Solution: def log_activities(*activities): for activity in activities: print(f"[LOG] {activity}")',
    },
  ],

  roomId: 'floor_5_room_01',
  terminalId: 'terminal_08',
  preDialogKey: 'dialog.ch05_08.pre',
  postDialogKey: 'dialog.ch05_08.post',

  conceptsIntroduced: ['args', 'variadic_functions'],
  conceptsReinforced: ['function_definition', 'for_loop', 'fstrings'],
};
