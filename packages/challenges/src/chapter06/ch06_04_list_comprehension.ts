import type { Challenge } from '@venomous-snake/shared-types';

export const ch06_04_list_comprehension: Challenge = {
  id: 'ch06_04_list_comprehension',
  titleKey: 'challenges.ch06_04.title',
  descriptionKey: 'challenges.ch06_04.description',
  chapter: 6,
  order: 4,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch06_01_create_list'],
  xpReward: 200,
  tags: ['list_comprehension', 'filter', 'dictionary'],

  scaffoldedCode:
    '# Filter active camera IDs using a list comprehension\ncameras = [{"id": 1, "active": True}, {"id": 2, "active": False}, {"id": 3, "active": True}]\nactive_ids = ___\nprint(active_ids)',
  editableRegions: [
    { startLine: 3, endLine: 3, placeholder: '[cam["id"] for cam in cameras if cam["active"]]' },
  ],
  solutionCode:
    'cameras = [{"id": 1, "active": True}, {"id": 2, "active": False}, {"id": 3, "active": True}]\nactive_ids = [cam["id"] for cam in cameras if cam["active"]]\nprint(active_ids)',

  testCases: [
    {
      id: 'tc01',
      description: 'Should filter to active camera IDs [1, 3]',
      expectedOutput: '[1, 3]',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use list comprehension with condition',
      expectedOutput: '[1, 3]',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'List comprehensions create lists in one line: [expression for item in list if condition].',
    },
    {
      tier: 2,
      text: 'Extract the id where active is True: [cam["id"] for cam in cameras if cam["active"]].',
    },
    {
      tier: 3,
      text: 'Solution: active_ids = [cam["id"] for cam in cameras if cam["active"]]',
    },
  ],

  roomId: 'floor_6_room_01',
  terminalId: 'terminal_04',
  preDialogKey: 'dialog.ch06_04.pre',
  postDialogKey: 'dialog.ch06_04.post',

  conceptsIntroduced: ['list_comprehension', 'filtering'],
  conceptsReinforced: ['list_creation', 'for_loop', 'if_statement'],
};
