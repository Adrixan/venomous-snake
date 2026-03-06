import type { Challenge } from '@venomous-snake/shared-types';

export const ch04_01_simple_for_loop: Challenge = {
  id: 'ch04_01_simple_for_loop',
  titleKey: 'challenges.ch04_01.title',
  descriptionKey: 'challenges.ch04_01.description',
  chapter: 4,
  order: 1,
  difficulty: 'easy',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch03_04_if_elif_else'],
  xpReward: 100,
  tags: ['for', 'loop', 'list'],

  scaffoldedCode:
    '# Print each guard name from the patrol list\nguards = ["Ramirez", "Chen", "Volkov"]\nfor ___ in ___:\n    print(___)',
  editableRegions: [
    { startLine: 3, endLine: 4, placeholder: 'guard in guards:\n    print(guard)' },
  ],
  solutionCode: 'guards = ["Ramirez", "Chen", "Volkov"]\nfor guard in guards:\n    print(guard)',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print all guard names',
      expectedOutput: 'Ramirez\nChen\nVolkov',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should iterate over all list items',
      expectedOutput: 'Ramirez\nChen\nVolkov',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'A for loop visits each item in a list one at a time: for item in list:',
    },
    {
      tier: 2,
      text: 'Use: for guard in guards: then print(guard) inside the loop body.',
    },
    {
      tier: 3,
      text: 'Solution: for guard in guards: print(guard)',
    },
  ],

  roomId: 'floor_4_room_01',
  terminalId: 'terminal_01',
  preDialogKey: 'dialog.ch04_01.pre',
  postDialogKey: 'dialog.ch04_01.post',

  conceptsIntroduced: ['for_loop', 'iteration'],
  conceptsReinforced: ['print', 'variables'],
};
