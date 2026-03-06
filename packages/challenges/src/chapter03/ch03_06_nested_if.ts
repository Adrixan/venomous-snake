import type { Challenge } from '@venomous-snake/shared-types';

export const ch03_06_nested_if: Challenge = {
  id: 'ch03_06_nested_if',
  titleKey: 'challenges.ch03_06.title',
  descriptionKey: 'challenges.ch03_06.description',
  chapter: 3,
  order: 6,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch03_02_if_else'],
  xpReward: 175,
  tags: ['nested_if', 'conditions', '2fa'],

  scaffoldedCode:
    '# Two-factor authentication: check PIN then fingerprint\npin = 7749\nfingerprint = True\n\nif ___:\n    if ___:\n        print("Identity confirmed. Welcome.")\n    else:\n        print("Fingerprint scan failed.")\nelse:\n    print("Wrong PIN. Access denied.")',
  editableRegions: [
    { startLine: 5, endLine: 5, placeholder: 'pin == 7749' },
    { startLine: 6, endLine: 6, placeholder: 'fingerprint' },
  ],
  solutionCode:
    'pin = 7749\nfingerprint = True\n\nif pin == 7749:\n    if fingerprint:\n        print("Identity confirmed. Welcome.")\n    else:\n        print("Fingerprint scan failed.")\nelse:\n    print("Wrong PIN. Access denied.")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should confirm identity when both PIN and fingerprint match',
      expectedOutput: 'Identity confirmed. Welcome.',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should handle nested conditions correctly',
      expectedOutput: 'Identity confirmed. Welcome.',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Nested if statements let you check a second condition only when the first is True.',
    },
    {
      tier: 2,
      text: 'First check the PIN: if pin == 7749. Then inside, check: if fingerprint.',
    },
    {
      tier: 3,
      text: 'Solution: if pin == 7749: then if fingerprint:',
    },
  ],

  roomId: 'floor_3_room_01',
  terminalId: 'terminal_06',
  preDialogKey: 'dialog.ch03_06.pre',
  postDialogKey: 'dialog.ch03_06.post',

  conceptsIntroduced: ['nested_if', 'two_factor_auth'],
  conceptsReinforced: ['if_else', 'boolean_conditions', 'equality_operator'],
};
