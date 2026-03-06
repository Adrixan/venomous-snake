import type { Challenge } from '@venomous-snake/shared-types';

export const ch05_03_multiple_parameters: Challenge = {
  id: 'ch05_03_multiple_parameters',
  titleKey: 'challenges.ch05_03.title',
  descriptionKey: 'challenges.ch05_03.description',
  chapter: 5,
  order: 3,
  difficulty: 'easy',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch05_02_function_return'],
  xpReward: 150,
  tags: ['function', 'parameters', 'fstrings'],

  scaffoldedCode:
    '# Format an ID card with name, rank, and department\ndef format_id_card(name, rank, department):\n    return ___\n\nprint(format_id_card("Aleksa", "Operative", "Infiltration"))',
  editableRegions: [
    { startLine: 3, endLine: 3, placeholder: 'f"[{department}] {name} \\u2014 {rank}"' },
  ],
  solutionCode:
    'def format_id_card(name, rank, department):\n    return f"[{department}] {name} \\u2014 {rank}"\n\nprint(format_id_card("Aleksa", "Operative", "Infiltration"))',

  testCases: [
    {
      id: 'tc01',
      description: 'Should format the ID card correctly',
      expectedOutput: '[Infiltration] Aleksa \u2014 Operative',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use all three parameters in the output',
      expectedOutput: '[Infiltration] Aleksa \u2014 Operative',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Functions can accept multiple parameters separated by commas.',
    },
    {
      tier: 2,
      text: 'Use an f-string to combine all three: f"[{department}] {name} \u2014 {rank}".',
    },
    {
      tier: 3,
      text: 'Solution: return f"[{department}] {name} \u2014 {rank}"',
    },
  ],

  roomId: 'floor_5_room_01',
  terminalId: 'terminal_03',
  preDialogKey: 'dialog.ch05_03.pre',
  postDialogKey: 'dialog.ch05_03.post',

  conceptsIntroduced: ['three_parameters', 'formatted_return'],
  conceptsReinforced: ['function_definition', 'fstrings', 'return_statement'],
};
