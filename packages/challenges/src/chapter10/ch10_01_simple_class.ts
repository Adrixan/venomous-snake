import type { Challenge } from '@venomous-snake/shared-types';

export const ch10_01_simple_class: Challenge = {
  id: 'ch10_01_simple_class',
  titleKey: 'challenges.ch10_01.title',
  descriptionKey: 'challenges.ch10_01.description',
  chapter: 10,
  order: 1,
  difficulty: 'medium',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch09_10_combining_tools'],
  xpReward: 200,
  tags: ['oop', 'class', 'attributes'],
  scaffoldedCode:
    'class SecurityBot:\n    name = ___\n    threat_level = ___\n    active = ___\n\nbot = SecurityBot()\nprint(bot.name)\nprint(bot.threat_level)\nprint(bot.active)',
  editableRegions: [
    { startLine: 2, endLine: 4, placeholder: '"SENTINEL" / 5 / True' },
  ],
  solutionCode:
    'class SecurityBot:\n    name = "SENTINEL"\n    threat_level = 5\n    active = True\n\nbot = SecurityBot()\nprint(bot.name)\nprint(bot.threat_level)\nprint(bot.active)',
  testCases: [
    {
      id: 'tc01',
      description: 'Should create class with attributes',
      expectedOutput: 'SENTINEL\n5\nTrue',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should access class attributes via instance',
      expectedOutput: 'SENTINEL\n5\nTrue',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Class attributes are defined directly in the class body, like variables.' },
    { tier: 2 as const, text: 'Set name = "SENTINEL", threat_level = 5, active = True inside the class.' },
    { tier: 3 as const, text: 'Solution: class SecurityBot: name = "SENTINEL" threat_level = 5 active = True' },
  ],
  roomId: 'floor_10_room_01',
  terminalId: 'terminal_01',
  preDialogKey: 'dialog.ch10_01.pre',
  postDialogKey: 'dialog.ch10_01.post',
  conceptsIntroduced: ['class_definition', 'class_attributes'],
  conceptsReinforced: ['strings', 'boolean', 'print'],
};
