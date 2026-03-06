import type { Challenge } from '@venomous-snake/shared-types';

export const ch06_07_dict_methods: Challenge = {
  id: 'ch06_07_dict_methods',
  titleKey: 'challenges.ch06_07.title',
  descriptionKey: 'challenges.ch06_07.description',
  chapter: 6,
  order: 7,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch06_06_dictionaries'],
  xpReward: 175,
  tags: ['dictionary', 'methods', 'get', 'update'],

  scaffoldedCode:
    '# Modify and read a profile using dictionary methods\nprofile = {"name": "Ghost", "status": "active"}\nprofile[___] = 5\nprofile[___] = "compromised"\nprint(profile.get("name"))\nprint(profile.get("clearance"))\nprint(profile.get("status"))',
  editableRegions: [
    { startLine: 3, endLine: 3, placeholder: '"clearance"' },
    { startLine: 4, endLine: 4, placeholder: '"status"' },
  ],
  solutionCode:
    'profile = {"name": "Ghost", "status": "active"}\nprofile["clearance"] = 5\nprofile["status"] = "compromised"\nprint(profile.get("name"))\nprint(profile.get("clearance"))\nprint(profile.get("status"))',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print updated profile values',
      expectedOutput: 'Ghost\n5\ncompromised',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should add and update dictionary entries',
      expectedOutput: 'Ghost\n5\ncompromised',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Add new keys with dict["key"] = value. Update existing keys the same way.',
    },
    {
      tier: 2,
      text: 'profile["clearance"] = 5 adds a new key. profile["status"] = "compromised" updates existing.',
    },
    {
      tier: 3,
      text: 'Solution: profile["clearance"] = 5, profile["status"] = "compromised"',
    },
  ],

  roomId: 'floor_6_room_01',
  terminalId: 'terminal_07',
  preDialogKey: 'dialog.ch06_07.pre',
  postDialogKey: 'dialog.ch06_07.post',

  conceptsIntroduced: ['dict_update', 'dict_get', 'dict_add_key'],
  conceptsReinforced: ['dictionary', 'print'],
};
