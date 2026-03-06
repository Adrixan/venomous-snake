import type { Challenge } from '@venomous-snake/shared-types';

export const ch02_04_fstrings_basics: Challenge = {
  id: 'ch02_04_fstrings_basics',
  titleKey: 'challenges.ch02_04.title',
  descriptionKey: 'challenges.ch02_04.description',
  chapter: 2,
  order: 4,
  difficulty: 'easy',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch02_01_string_methods'],
  xpReward: 125,
  tags: ['strings', 'fstrings', 'formatting'],

  scaffoldedCode:
    '# Create an ID card using f-strings\nname = "Aleksa"\nrank = "Field Operative"\nclearance = 4\nid_card = ___\nprint(id_card)',
  editableRegions: [
    {
      startLine: 5,
      endLine: 5,
      placeholder: 'f"OPERATIVE: {name} | RANK: {rank} | CLEARANCE: {clearance}"',
    },
  ],
  solutionCode:
    'name = "Aleksa"\nrank = "Field Operative"\nclearance = 4\nid_card = f"OPERATIVE: {name} | RANK: {rank} | CLEARANCE: {clearance}"\nprint(id_card)',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print the formatted ID card',
      expectedOutput: 'OPERATIVE: Aleksa | RANK: Field Operative | CLEARANCE: 4',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should include all three variables in the output',
      expectedOutput: 'OPERATIVE: Aleksa | RANK: Field Operative | CLEARANCE: 4',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'f-strings let you embed variables directly in a string using {variable_name}.',
    },
    {
      tier: 2,
      text: 'Start the string with f before the quote: f"text {variable} more text".',
    },
    {
      tier: 3,
      text: 'Solution: id_card = f"OPERATIVE: {name} | RANK: {rank} | CLEARANCE: {clearance}"',
    },
  ],

  roomId: 'floor_2_room_01',
  terminalId: 'terminal_04',
  preDialogKey: 'dialog.ch02_04.pre',
  postDialogKey: 'dialog.ch02_04.post',

  conceptsIntroduced: ['fstrings', 'string_interpolation'],
  conceptsReinforced: ['strings', 'variables', 'print'],
};
