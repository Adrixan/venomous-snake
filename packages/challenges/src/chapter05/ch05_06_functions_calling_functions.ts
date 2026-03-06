import type { Challenge } from '@venomous-snake/shared-types';

export const ch05_06_functions_calling_functions: Challenge = {
  id: 'ch05_06_functions_calling_functions',
  titleKey: 'challenges.ch05_06.title',
  descriptionKey: 'challenges.ch05_06.description',
  chapter: 5,
  order: 6,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch05_02_function_return'],
  xpReward: 200,
  tags: ['function', 'composition', 'boolean'],

  scaffoldedCode:
    '# Build a multi-step verification system\ndef check_pin(pin):\n    return pin == 4892\n\ndef check_badge(badge):\n    return badge.startswith("BADGE-")\n\ndef verify_access(pin, badge):\n    if ___ and ___:\n        return "ACCESS GRANTED"\n    return "ACCESS DENIED"\n\nprint(verify_access(4892, "BADGE-X44"))',
  editableRegions: [
    { startLine: 9, endLine: 9, placeholder: 'check_pin(pin) and check_badge(badge)' },
  ],
  solutionCode:
    'def check_pin(pin):\n    return pin == 4892\n\ndef check_badge(badge):\n    return badge.startswith("BADGE-")\n\ndef verify_access(pin, badge):\n    if check_pin(pin) and check_badge(badge):\n        return "ACCESS GRANTED"\n    return "ACCESS DENIED"\n\nprint(verify_access(4892, "BADGE-X44"))',

  testCases: [
    {
      id: 'tc01',
      description: 'Should grant access with correct pin and badge',
      expectedOutput: 'ACCESS GRANTED',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should call helper functions for verification',
      expectedOutput: 'ACCESS GRANTED',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Functions can call other functions. Use the helper functions check_pin and check_badge.',
    },
    {
      tier: 2,
      text: 'Combine both checks: check_pin(pin) and check_badge(badge).',
    },
    {
      tier: 3,
      text: 'Solution: if check_pin(pin) and check_badge(badge):',
    },
  ],

  roomId: 'floor_5_room_01',
  terminalId: 'terminal_06',
  preDialogKey: 'dialog.ch05_06.pre',
  postDialogKey: 'dialog.ch05_06.post',

  conceptsIntroduced: ['function_composition', 'helper_functions'],
  conceptsReinforced: ['function_definition', 'logical_and', 'return_statement'],
};
