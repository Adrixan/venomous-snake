import type { Challenge } from '@venomous-snake/shared-types';

export const ch06_01_create_list: Challenge = {
  id: 'ch06_01_create_list',
  titleKey: 'challenges.ch06_01.title',
  descriptionKey: 'challenges.ch06_01.description',
  chapter: 6,
  order: 1,
  difficulty: 'easy',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch05_10_lambda'],
  xpReward: 125,
  tags: ['list', 'indexing'],

  scaffoldedCode:
    '# Create a list of hacking tools and access each one\ntools = [___, ___, ___]\nprint(tools[0])\nprint(tools[1])\nprint(tools[2])',
  editableRegions: [
    { startLine: 2, endLine: 2, placeholder: '"keylogger", "port_scanner", "exploit_kit"' },
  ],
  solutionCode:
    'tools = ["keylogger", "port_scanner", "exploit_kit"]\nprint(tools[0])\nprint(tools[1])\nprint(tools[2])',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print all three tools',
      expectedOutput: 'keylogger\nport_scanner\nexploit_kit',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should access list items by index',
      expectedOutput: 'keylogger\nport_scanner\nexploit_kit',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Lists are created with square brackets: [item1, item2, item3].',
    },
    {
      tier: 2,
      text: 'Fill in the list items as strings: "keylogger", "port_scanner", "exploit_kit".',
    },
    {
      tier: 3,
      text: 'Solution: tools = ["keylogger", "port_scanner", "exploit_kit"]',
    },
  ],

  roomId: 'floor_6_room_01',
  terminalId: 'terminal_01',
  preDialogKey: 'dialog.ch06_01.pre',
  postDialogKey: 'dialog.ch06_01.post',

  conceptsIntroduced: ['list_creation', 'list_indexing'],
  conceptsReinforced: ['print', 'strings'],
};
