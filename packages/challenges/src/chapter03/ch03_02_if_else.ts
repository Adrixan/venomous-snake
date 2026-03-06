import type { Challenge } from '@venomous-snake/shared-types';

export const ch03_02_if_else: Challenge = {
  id: 'ch03_02_if_else',
  titleKey: 'challenges.ch03_02.title',
  descriptionKey: 'challenges.ch03_02.description',
  chapter: 3,
  order: 2,
  difficulty: 'easy',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch03_01_simple_if'],
  xpReward: 100,
  tags: ['if', 'else', 'boolean'],

  scaffoldedCode:
    '# Check if the door is locked and print the status\ndoor_locked = True\nif ___:\n    print("Door is LOCKED")\nelse:\n    print("Door is OPEN")',
  editableRegions: [{ startLine: 3, endLine: 3, placeholder: 'door_locked' }],
  solutionCode:
    'door_locked = True\nif door_locked:\n    print("Door is LOCKED")\nelse:\n    print("Door is OPEN")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print "Door is LOCKED" when door_locked is True',
      expectedOutput: 'Door is LOCKED',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should handle the boolean condition correctly',
      expectedOutput: 'Door is LOCKED',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Boolean values True and False can be used directly in if statements.',
    },
    {
      tier: 2,
      text: 'if door_locked: — Python treats True as "yes, do this" and False as "skip to else".',
    },
    {
      tier: 3,
      text: 'Solution: if door_locked: print("Door is LOCKED")',
    },
  ],

  roomId: 'floor_3_room_01',
  terminalId: 'terminal_02',
  preDialogKey: 'dialog.ch03_02.pre',
  postDialogKey: 'dialog.ch03_02.post',

  conceptsIntroduced: ['if_else', 'boolean_conditions'],
  conceptsReinforced: ['if_statement', 'print'],
};
