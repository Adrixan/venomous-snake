import type { Challenge } from '@venomous-snake/shared-types';

export const ch05_07_scope: Challenge = {
  id: 'ch05_07_scope',
  titleKey: 'challenges.ch05_07.title',
  descriptionKey: 'challenges.ch05_07.description',
  chapter: 5,
  order: 7,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch05_01_simple_function'],
  xpReward: 175,
  tags: ['scope', 'local', 'global'],

  scaffoldedCode:
    '# Understand local vs global scope\nalert_level = "LOW"\n\ndef raise_alert(new_level):\n    local_status = "ACTIVE"\n    print(f"Alert raised to: {new_level}")\n    print(f"Status: {local_status}")\n\nraise_alert(___)\nprint(f"Global level: {alert_level}")',
  editableRegions: [{ startLine: 9, endLine: 9, placeholder: '"HIGH"' }],
  solutionCode:
    'alert_level = "LOW"\n\ndef raise_alert(new_level):\n    local_status = "ACTIVE"\n    print(f"Alert raised to: {new_level}")\n    print(f"Status: {local_status}")\n\nraise_alert("HIGH")\nprint(f"Global level: {alert_level}")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print alert raised to HIGH',
      expectedOutput: 'Alert raised to: HIGH\nStatus: ACTIVE\nGlobal level: LOW',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Global alert_level should remain LOW',
      expectedOutput: 'Alert raised to: HIGH\nStatus: ACTIVE\nGlobal level: LOW',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Variables inside a function are local — they only exist inside that function.',
    },
    {
      tier: 2,
      text: 'The global alert_level is not changed by the function. Pass "HIGH" as the argument.',
    },
    {
      tier: 3,
      text: 'Solution: raise_alert("HIGH") — the global alert_level stays "LOW".',
    },
  ],

  roomId: 'floor_5_room_01',
  terminalId: 'terminal_07',
  preDialogKey: 'dialog.ch05_07.pre',
  postDialogKey: 'dialog.ch05_07.post',

  conceptsIntroduced: ['local_scope', 'global_scope'],
  conceptsReinforced: ['function_definition', 'variables', 'fstrings'],
};
