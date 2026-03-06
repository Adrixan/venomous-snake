import type { Challenge } from '@venomous-snake/shared-types';

export const ch02_07_string_formatting: Challenge = {
  id: 'ch02_07_string_formatting',
  titleKey: 'challenges.ch02_07.title',
  descriptionKey: 'challenges.ch02_07.description',
  chapter: 2,
  order: 7,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch02_04_fstrings_basics'],
  xpReward: 150,
  tags: ['fstrings', 'formatting', 'strings'],

  scaffoldedCode:
    '# Build a mission status report using f-strings\noperative = "Vex"\nmission = "Operation Blackout"\nstatus = "ACTIVE"\nfloor = 3\nreport = ___\nprint(report)',
  editableRegions: [
    {
      startLine: 6,
      endLine: 6,
      placeholder: 'f"[{status}] {operative} \\u2014 {mission} \\u2014 Floor {floor}"',
    },
  ],
  solutionCode:
    'operative = "Vex"\nmission = "Operation Blackout"\nstatus = "ACTIVE"\nfloor = 3\nreport = f"[{status}] {operative} \\u2014 {mission} \\u2014 Floor {floor}"\nprint(report)',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print the formatted mission report',
      expectedOutput: '[ACTIVE] Vex \u2014 Operation Blackout \u2014 Floor 3',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should include all variables in the report',
      expectedOutput: '[ACTIVE] Vex \u2014 Operation Blackout \u2014 Floor 3',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'f-strings can embed multiple variables: f"{var1} and {var2}".',
    },
    {
      tier: 2,
      text: 'The em dash (\u2014) is a special character. You can use \\u2014 or copy it directly.',
    },
    {
      tier: 3,
      text: 'Solution: report = f"[{status}] {operative} \u2014 {mission} \u2014 Floor {floor}"',
    },
  ],

  roomId: 'floor_2_room_01',
  terminalId: 'terminal_07',
  preDialogKey: 'dialog.ch02_07.pre',
  postDialogKey: 'dialog.ch02_07.post',

  conceptsIntroduced: ['complex_fstrings', 'string_formatting'],
  conceptsReinforced: ['fstrings', 'variables', 'print'],
};
