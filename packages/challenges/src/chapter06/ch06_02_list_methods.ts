import type { Challenge } from '@venomous-snake/shared-types';

export const ch06_02_list_methods: Challenge = {
  id: 'ch06_02_list_methods',
  titleKey: 'challenges.ch06_02.title',
  descriptionKey: 'challenges.ch06_02.description',
  chapter: 6,
  order: 2,
  difficulty: 'easy',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch06_01_create_list'],
  xpReward: 150,
  tags: ['list', 'append', 'remove', 'methods'],

  scaffoldedCode:
    '# Modify the inventory using list methods\ninventory = ["keylogger", "port_scanner"]\ninventory.append(___)\ninventory.remove(___)\nprint(inventory)',
  editableRegions: [
    { startLine: 3, endLine: 3, placeholder: '"exploit_kit"' },
    { startLine: 4, endLine: 4, placeholder: '"keylogger"' },
  ],
  solutionCode:
    'inventory = ["keylogger", "port_scanner"]\ninventory.append("exploit_kit")\ninventory.remove("keylogger")\nprint(inventory)',

  testCases: [
    {
      id: 'tc01',
      description: 'Should show updated inventory',
      expectedOutput: "['port_scanner', 'exploit_kit']",
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should append and remove items correctly',
      expectedOutput: "['port_scanner', 'exploit_kit']",
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: '.append() adds an item to the end. .remove() removes the first matching item.',
    },
    {
      tier: 2,
      text: 'inventory.append("exploit_kit") adds it. inventory.remove("keylogger") removes it.',
    },
    {
      tier: 3,
      text: 'Solution: append("exploit_kit") then remove("keylogger")',
    },
  ],

  roomId: 'floor_6_room_01',
  terminalId: 'terminal_02',
  preDialogKey: 'dialog.ch06_02.pre',
  postDialogKey: 'dialog.ch06_02.post',

  conceptsIntroduced: ['list_append', 'list_remove'],
  conceptsReinforced: ['list_creation', 'print'],
};
