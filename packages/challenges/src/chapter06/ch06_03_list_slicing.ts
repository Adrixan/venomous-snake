import type { Challenge } from '@venomous-snake/shared-types';

export const ch06_03_list_slicing: Challenge = {
  id: 'ch06_03_list_slicing',
  titleKey: 'challenges.ch06_03.title',
  descriptionKey: 'challenges.ch06_03.description',
  chapter: 6,
  order: 3,
  difficulty: 'easy',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch06_01_create_list'],
  xpReward: 150,
  tags: ['list', 'slicing'],

  scaffoldedCode:
    '# Slice the message log to get specific parts\nmessages = ["msg1", "msg2", "msg3", "msg4", "msg5"]\nrecent = ___\nfirst_two = ___\nprint(recent)\nprint(first_two)',
  editableRegions: [
    { startLine: 3, endLine: 3, placeholder: 'messages[-3:]' },
    { startLine: 4, endLine: 4, placeholder: 'messages[:2]' },
  ],
  solutionCode:
    'messages = ["msg1", "msg2", "msg3", "msg4", "msg5"]\nrecent = messages[-3:]\nfirst_two = messages[:2]\nprint(recent)\nprint(first_two)',

  testCases: [
    {
      id: 'tc01',
      description: 'Should get the last 3 messages',
      expectedOutput: "['msg3', 'msg4', 'msg5']\n['msg1', 'msg2']",
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should get the first 2 messages',
      expectedOutput: "['msg3', 'msg4', 'msg5']\n['msg1', 'msg2']",
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'List slicing works like string slicing: list[start:end]. Negative indices count from the end.',
    },
    {
      tier: 2,
      text: 'messages[-3:] gives the last 3 items. messages[:2] gives the first 2 items.',
    },
    {
      tier: 3,
      text: 'Solution: recent = messages[-3:], first_two = messages[:2]',
    },
  ],

  roomId: 'floor_6_room_01',
  terminalId: 'terminal_03',
  preDialogKey: 'dialog.ch06_03.pre',
  postDialogKey: 'dialog.ch06_03.post',

  conceptsIntroduced: ['list_slicing'],
  conceptsReinforced: ['list_creation', 'string_slicing', 'print'],
};
