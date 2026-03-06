import type { Challenge } from '@venomous-snake/shared-types';

export const ch05_04_default_parameters: Challenge = {
  id: 'ch05_04_default_parameters',
  titleKey: 'challenges.ch05_04.title',
  descriptionKey: 'challenges.ch05_04.description',
  chapter: 5,
  order: 4,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch05_03_multiple_parameters'],
  xpReward: 175,
  tags: ['function', 'default_parameters'],

  scaffoldedCode:
    '# Create an alert function with a default severity level\ndef create_alert(message, level=___):\n    return f"[{level.upper()}] {message}"\n\nprint(create_alert("Intruder detected", "critical"))\nprint(create_alert("Routine check"))',
  editableRegions: [{ startLine: 2, endLine: 2, placeholder: '"low"' }],
  solutionCode:
    'def create_alert(message, level="low"):\n    return f"[{level.upper()}] {message}"\n\nprint(create_alert("Intruder detected", "critical"))\nprint(create_alert("Routine check"))',

  testCases: [
    {
      id: 'tc01',
      description: 'Should use provided level for critical alert',
      expectedOutput: '[CRITICAL] Intruder detected\n[LOW] Routine check',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should default to "low" when no level is given',
      expectedOutput: '[CRITICAL] Intruder detected\n[LOW] Routine check',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Default parameters have a value assigned with = in the function definition.',
    },
    {
      tier: 2,
      text: 'def create_alert(message, level="low"): — if no level is passed, it defaults to "low".',
    },
    {
      tier: 3,
      text: 'Solution: def create_alert(message, level="low"):',
    },
  ],

  roomId: 'floor_5_room_01',
  terminalId: 'terminal_04',
  preDialogKey: 'dialog.ch05_04.pre',
  postDialogKey: 'dialog.ch05_04.post',

  conceptsIntroduced: ['default_parameters'],
  conceptsReinforced: ['function_definition', 'fstrings', 'string_methods'],
};
