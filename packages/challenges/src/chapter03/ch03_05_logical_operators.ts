import type { Challenge } from '@venomous-snake/shared-types';

export const ch03_05_logical_operators: Challenge = {
  id: 'ch03_05_logical_operators',
  titleKey: 'challenges.ch03_05.title',
  descriptionKey: 'challenges.ch03_05.description',
  chapter: 3,
  order: 5,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch03_02_if_else'],
  xpReward: 175,
  tags: ['and', 'or', 'not', 'logical_operators'],

  scaffoldedCode:
    '# Check all security conditions for access\nhas_badge = True\nhas_clearance = True\nis_blacklisted = False\n\nif ___:\n    print("ACCESS GRANTED")\nelse:\n    print("ACCESS DENIED")',
  editableRegions: [
    { startLine: 6, endLine: 6, placeholder: 'has_badge and has_clearance and not is_blacklisted' },
  ],
  solutionCode:
    'has_badge = True\nhas_clearance = True\nis_blacklisted = False\n\nif has_badge and has_clearance and not is_blacklisted:\n    print("ACCESS GRANTED")\nelse:\n    print("ACCESS DENIED")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should grant access when all conditions are met',
      expectedOutput: 'ACCESS GRANTED',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use and/or/not logical operators',
      expectedOutput: 'ACCESS GRANTED',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Logical operators: "and" requires both sides to be True, "or" requires at least one, "not" flips True/False.',
    },
    {
      tier: 2,
      text: 'Combine conditions: has_badge and has_clearance and not is_blacklisted.',
    },
    {
      tier: 3,
      text: 'Solution: if has_badge and has_clearance and not is_blacklisted:',
    },
  ],

  roomId: 'floor_3_room_01',
  terminalId: 'terminal_05',
  preDialogKey: 'dialog.ch03_05.pre',
  postDialogKey: 'dialog.ch03_05.post',

  conceptsIntroduced: ['logical_and', 'logical_or', 'logical_not'],
  conceptsReinforced: ['if_else', 'boolean_conditions'],
};
