import type { Challenge } from '@venomous-snake/shared-types';

export const ch06_06_dictionaries: Challenge = {
  id: 'ch06_06_dictionaries',
  titleKey: 'challenges.ch06_06.title',
  descriptionKey: 'challenges.ch06_06.description',
  chapter: 6,
  order: 6,
  difficulty: 'easy',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch06_01_create_list'],
  xpReward: 150,
  tags: ['dictionary', 'key_value'],

  scaffoldedCode:
    '# Create an employee profile dictionary\nemployee = {\n    "name": ___,\n    "department": ___,\n    "clearance": ___\n}\nprint(employee["name"])\nprint(employee["clearance"])',
  editableRegions: [
    { startLine: 3, endLine: 3, placeholder: '"Aleksa Volkov"' },
    { startLine: 4, endLine: 4, placeholder: '"Infiltration"' },
    { startLine: 5, endLine: 5, placeholder: '4' },
  ],
  solutionCode:
    'employee = {\n    "name": "Aleksa Volkov",\n    "department": "Infiltration",\n    "clearance": 4\n}\nprint(employee["name"])\nprint(employee["clearance"])',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print the employee name',
      expectedOutput: 'Aleksa Volkov\n4',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should access dictionary values by key',
      expectedOutput: 'Aleksa Volkov\n4',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Dictionaries store key-value pairs: {"key": value}. Access values with dict["key"].',
    },
    {
      tier: 2,
      text: 'Fill in the values: "Aleksa Volkov" for name, "Infiltration" for department, 4 for clearance.',
    },
    {
      tier: 3,
      text: 'Solution: "name": "Aleksa Volkov", "department": "Infiltration", "clearance": 4',
    },
  ],

  roomId: 'floor_6_room_01',
  terminalId: 'terminal_06',
  preDialogKey: 'dialog.ch06_06.pre',
  postDialogKey: 'dialog.ch06_06.post',

  conceptsIntroduced: ['dictionary', 'key_value_pairs'],
  conceptsReinforced: ['print', 'strings'],
};
