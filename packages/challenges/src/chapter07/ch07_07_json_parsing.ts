import type { Challenge } from '@venomous-snake/shared-types';

export const ch07_07_json_parsing: Challenge = {
  id: 'ch07_07_json_parsing',
  titleKey: 'challenges.ch07_07.title',
  descriptionKey: 'challenges.ch07_07.description',
  chapter: 7,
  order: 7,
  difficulty: 'medium',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch07_06_with_statement'],
  xpReward: 165,
  tags: ['json', 'parsing', 'dictionary'],
  scaffoldedCode:
    'import json\njson_str = \'{"agent": "Snake", "level": 7, "active": true}\'\ndata = json.___(json_str)\nprint(data[___])\nprint(data[___])\nprint(data[___])',
  solutionCode:
    'import json\njson_str = \'{"agent": "Snake", "level": 7, "active": true}\'\ndata = json.loads(json_str)\nprint(data["agent"])\nprint(data["level"])\nprint(data["active"])',
  testCases: [
    {
      id: 'tc01',
      description: 'Should parse and print JSON fields',
      expectedOutput: 'Snake\n7\nTrue',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use json.loads to parse JSON string',
      expectedOutput: 'Snake\n7\nTrue',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'json.loads() parses a JSON string into a Python dictionary.' },
    { tier: 2 as const, text: 'Access dictionary values with data["key"]. JSON true becomes Python True.' },
    { tier: 3 as const, text: 'Solution: data = json.loads(json_str), then print(data["agent"]) etc.' },
  ],
  roomId: 'floor_7_room_01',
  terminalId: 'terminal_07',
  preDialogKey: 'dialog.ch07_07.pre',
  postDialogKey: 'dialog.ch07_07.post',
  conceptsIntroduced: ['json_loads', 'json_parsing'],
  conceptsReinforced: ['import', 'dictionary', 'print'],
};
