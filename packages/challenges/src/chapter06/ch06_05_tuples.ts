import type { Challenge } from '@venomous-snake/shared-types';

export const ch06_05_tuples: Challenge = {
  id: 'ch06_05_tuples',
  titleKey: 'challenges.ch06_05.title',
  descriptionKey: 'challenges.ch06_05.description',
  chapter: 6,
  order: 5,
  difficulty: 'easy',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch06_01_create_list'],
  xpReward: 150,
  tags: ['tuple', 'unpacking'],

  scaffoldedCode:
    '# Store coordinates as tuples and unpack them\nserver_room = (14, 27)\nvault = (3, 9)\nprint(f"Server room: {server_room}")\nprint(f"Vault: {vault}")\nx, y = ___\nprint(f"Coordinates: x={x}, y={y}")',
  editableRegions: [{ startLine: 6, endLine: 6, placeholder: 'server_room' }],
  solutionCode:
    'server_room = (14, 27)\nvault = (3, 9)\nprint(f"Server room: {server_room}")\nprint(f"Vault: {vault}")\nx, y = server_room\nprint(f"Coordinates: x={x}, y={y}")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print both coordinate tuples',
      expectedOutput: 'Server room: (14, 27)\nVault: (3, 9)\nCoordinates: x=14, y=27',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should unpack the server_room tuple',
      expectedOutput: 'Server room: (14, 27)\nVault: (3, 9)\nCoordinates: x=14, y=27',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Tuples are created with parentheses: (14, 27). They are like immutable lists.',
    },
    {
      tier: 2,
      text: 'Unpack a tuple: x, y = server_room assigns 14 to x and 27 to y.',
    },
    {
      tier: 3,
      text: 'Solution: x, y = server_room',
    },
  ],

  roomId: 'floor_6_room_01',
  terminalId: 'terminal_05',
  preDialogKey: 'dialog.ch06_05.pre',
  postDialogKey: 'dialog.ch06_05.post',

  conceptsIntroduced: ['tuples', 'tuple_unpacking'],
  conceptsReinforced: ['fstrings', 'variables', 'print'],
};
