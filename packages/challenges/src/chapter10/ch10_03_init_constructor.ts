import type { Challenge } from '@venomous-snake/shared-types';

export const ch10_03_init_constructor: Challenge = {
  id: 'ch10_03_init_constructor',
  titleKey: 'challenges.ch10_03.title',
  descriptionKey: 'challenges.ch10_03.description',
  chapter: 10,
  order: 3,
  difficulty: 'medium',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch10_02_methods'],
  xpReward: 210,
  tags: ['oop', 'constructor', '__init__'],
  scaffoldedCode:
    'class SecurityBot:\n    def __init__(self, ___, ___):\n        self.name = ___\n        self.threat_level = ___\n    \n    def status(self):\n        return f"{self.name} | Threat Level: {self.threat_level}"\n\nbot1 = SecurityBot("SENTINEL", 5)\nbot2 = SecurityBot("GUARDIAN", 8)\nprint(bot1.status())\nprint(bot2.status())',
  solutionCode:
    'class SecurityBot:\n    def __init__(self, name, threat_level):\n        self.name = name\n        self.threat_level = threat_level\n    \n    def status(self):\n        return f"{self.name} | Threat Level: {self.threat_level}"\n\nbot1 = SecurityBot("SENTINEL", 5)\nbot2 = SecurityBot("GUARDIAN", 8)\nprint(bot1.status())\nprint(bot2.status())',
  testCases: [
    {
      id: 'tc01',
      description: 'Should initialize bots with different values',
      expectedOutput: 'SENTINEL | Threat Level: 5\nGUARDIAN | Threat Level: 8',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use __init__ constructor',
      expectedOutput: 'SENTINEL | Threat Level: 5\nGUARDIAN | Threat Level: 8',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: '__init__ is called automatically when creating an instance. Parameters go after self.' },
    { tier: 2 as const, text: 'Use self.name = name to store the parameter as an instance attribute.' },
    { tier: 3 as const, text: 'Solution: def __init__(self, name, threat_level): self.name = name self.threat_level = threat_level' },
  ],
  roomId: 'floor_10_room_01',
  terminalId: 'terminal_03',
  preDialogKey: 'dialog.ch10_03.pre',
  postDialogKey: 'dialog.ch10_03.post',
  conceptsIntroduced: ['init_constructor', 'instance_attributes'],
  conceptsReinforced: ['class_definition', 'self_parameter', 'fstrings'],
};
