import type { Challenge } from '@venomous-snake/shared-types';

export const ch06_08_nested_dicts: Challenge = {
  id: 'ch06_08_nested_dicts',
  titleKey: 'challenges.ch06_08.title',
  descriptionKey: 'challenges.ch06_08.description',
  chapter: 6,
  order: 8,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch06_06_dictionaries'],
  xpReward: 200,
  tags: ['dictionary', 'nested', 'access'],

  scaffoldedCode:
    '# Navigate the nested floor plan data\nfloor_plan = {\n    "floor_1": {"name": "Lobby", "secured": True},\n    "floor_2": {"name": "Operations", "secured": False}\n}\nprint(___)\nprint(___)',
  editableRegions: [
    { startLine: 6, endLine: 6, placeholder: 'floor_plan["floor_1"]["name"]' },
    { startLine: 7, endLine: 7, placeholder: 'floor_plan["floor_2"]["secured"]' },
  ],
  solutionCode:
    'floor_plan = {\n    "floor_1": {"name": "Lobby", "secured": True},\n    "floor_2": {"name": "Operations", "secured": False}\n}\nprint(floor_plan["floor_1"]["name"])\nprint(floor_plan["floor_2"]["secured"])',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print Lobby from floor_1',
      expectedOutput: 'Lobby\nFalse',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should access nested dictionary values',
      expectedOutput: 'Lobby\nFalse',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Chain square brackets to access nested dictionaries: dict["outer"]["inner"].',
    },
    {
      tier: 2,
      text: 'floor_plan["floor_1"]["name"] first gets the floor_1 dict, then the "name" key from it.',
    },
    {
      tier: 3,
      text: 'Solution: floor_plan["floor_1"]["name"] and floor_plan["floor_2"]["secured"]',
    },
  ],

  roomId: 'floor_6_room_01',
  terminalId: 'terminal_08',
  preDialogKey: 'dialog.ch06_08.pre',
  postDialogKey: 'dialog.ch06_08.post',

  conceptsIntroduced: ['nested_dictionaries', 'chained_access'],
  conceptsReinforced: ['dictionary', 'print'],
};
