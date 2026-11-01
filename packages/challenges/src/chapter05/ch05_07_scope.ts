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
      description: 'Should still work when the data changes',
      append: "raise_alert('IJHI')",
      expectedOutput:
        'Alert raised to: HIGH\nStatus: ACTIVE\nGlobal level: LOW\nAlert raised to: IJHI\nStatus: ACTIVE\n',
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

  preDialogKey: 'dialog.ch05_07.pre',
  postDialogKey: 'dialog.ch05_07.post',

  conceptsIntroduced: ['local_scope', 'global_scope'],
  conceptsReinforced: ['function_definition', 'variables', 'fstrings'],
};
