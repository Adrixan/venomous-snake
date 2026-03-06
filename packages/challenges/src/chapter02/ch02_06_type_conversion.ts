import type { Challenge } from '@venomous-snake/shared-types';

export const ch02_06_type_conversion: Challenge = {
  id: 'ch02_06_type_conversion',
  titleKey: 'challenges.ch02_06.title',
  descriptionKey: 'challenges.ch02_06.description',
  chapter: 2,
  order: 6,
  difficulty: 'easy',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch02_05_input_basics'],
  xpReward: 125,
  tags: ['type_conversion', 'int', 'str', 'input'],

  scaffoldedCode:
    '# Read a door code from input and double it\ndoor_code_str = input("Enter door code: ")\ndoor_code = ___\ndoubled = ___\nprint(f"Doubled code: {doubled}")',
  editableRegions: [
    { startLine: 3, endLine: 3, placeholder: 'int(door_code_str)' },
    { startLine: 4, endLine: 4, placeholder: 'door_code * 2' },
  ],
  solutionCode:
    'door_code_str = input("Enter door code: ")\ndoor_code = int(door_code_str)\ndoubled = door_code * 2\nprint(f"Doubled code: {doubled}")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should double the door code 42 to 84',
      input: '42',
      expectedOutput: 'Doubled code: 84',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should double the door code 100 to 200',
      input: '100',
      expectedOutput: 'Doubled code: 200',
      hidden: false,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'input() always returns a string. To do math, convert it to a number first.',
    },
    {
      tier: 2,
      text: 'Use int() to convert a string to an integer: int("42") gives 42.',
    },
    {
      tier: 3,
      text: 'Solution: door_code = int(door_code_str) then doubled = door_code * 2',
    },
  ],

  roomId: 'floor_2_room_01',
  terminalId: 'terminal_06',
  preDialogKey: 'dialog.ch02_06.pre',
  postDialogKey: 'dialog.ch02_06.post',

  conceptsIntroduced: ['type_conversion', 'int_conversion'],
  conceptsReinforced: ['input', 'fstrings', 'arithmetic'],
};
