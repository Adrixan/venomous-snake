import type { Challenge } from '@venomous-snake/shared-types';

export const ch10_02_methods: Challenge = {
  id: 'ch10_02_methods',
  titleKey: 'challenges.ch10_02.title',
  descriptionKey: 'challenges.ch10_02.description',
  chapter: 10,
  order: 2,
  difficulty: 'medium',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch10_01_simple_class'],
  xpReward: 205,
  tags: ['oop', 'methods', 'self'],
  scaffoldedCode:
    'class SecurityBot:\n    def greet(self):\n        return ___\n    \n    def scan(self, target):\n        return ___\n\nbot = SecurityBot()\nprint(bot.greet())\nprint(bot.scan("intruder"))',
  editableRegions: [
    { startLine: 3, endLine: 3, placeholder: '"HALT. Identify yourself."' },
    { startLine: 6, endLine: 6, placeholder: 'f"Scanning {target}... threat detected."' },
  ],
  solutionCode:
    'class SecurityBot:\n    def greet(self):\n        return "HALT. Identify yourself."\n    \n    def scan(self, target):\n        return f"Scanning {target}... threat detected."\n\nbot = SecurityBot()\nprint(bot.greet())\nprint(bot.scan("intruder"))',
  testCases: [
    {
      id: 'tc01',
      description: 'Should call methods on instance',
      expectedOutput: 'HALT. Identify yourself.\nScanning intruder... threat detected.',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should pass parameters to methods',
      expectedOutput: 'HALT. Identify yourself.\nScanning intruder... threat detected.',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Methods are functions inside a class. The first parameter is always self.' },
    { tier: 2 as const, text: 'Use return to send a value back. Use f-strings for dynamic strings.' },
    { tier: 3 as const, text: 'Solution: return "HALT. Identify yourself." and return f"Scanning {target}... threat detected."' },
  ],
  roomId: 'floor_10_room_01',
  terminalId: 'terminal_02',
  preDialogKey: 'dialog.ch10_02.pre',
  postDialogKey: 'dialog.ch10_02.post',
  conceptsIntroduced: ['instance_methods', 'self_parameter'],
  conceptsReinforced: ['class_definition', 'return_statement', 'fstrings'],
};
