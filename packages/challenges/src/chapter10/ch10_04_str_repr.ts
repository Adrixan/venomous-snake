import type { Challenge } from '@venomous-snake/shared-types';

export const ch10_04_str_repr: Challenge = {
  id: 'ch10_04_str_repr',
  titleKey: 'challenges.ch10_04.title',
  descriptionKey: 'challenges.ch10_04.description',
  chapter: 10,
  order: 4,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch10_03_init_constructor'],
  xpReward: 215,
  tags: ['oop', '__str__', '__repr__', 'dunder'],
  scaffoldedCode:
    'class SecurityBot:\n    def __init__(self, name, level):\n        self.name = name\n        self.level = level\n    \n    def __str__(self):\n        return ___\n    \n    def __repr__(self):\n        return ___\n\nbot = SecurityBot("VANGUARD", 7)\nprint(str(bot))\nprint(repr(bot))',
  solutionCode:
    'class SecurityBot:\n    def __init__(self, name, level):\n        self.name = name\n        self.level = level\n    \n    def __str__(self):\n        return f"SecurityBot: {self.name} (Level {self.level})"\n    \n    def __repr__(self):\n        return f"SecurityBot(\'{self.name}\', {self.level})"\n\nbot = SecurityBot("VANGUARD", 7)\nprint(str(bot))\nprint(repr(bot))',
  testCases: [
    {
      id: 'tc01',
      description: 'Should have str and repr representations',
      expectedOutput: 'SecurityBot: VANGUARD (Level 7)\nSecurityBot(\'VANGUARD\', 7)',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should define __str__ and __repr__',
      expectedOutput: 'SecurityBot: VANGUARD (Level 7)\nSecurityBot(\'VANGUARD\', 7)',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: '__str__ returns a human-readable string. __repr__ returns a developer-friendly string.' },
    { tier: 2 as const, text: '__repr__ should ideally look like a valid constructor call.' },
    { tier: 3 as const, text: 'Solution: __str__ returns f"SecurityBot: {self.name} (Level {self.level})" and __repr__ returns a constructor-style string' },
  ],
  roomId: 'floor_10_room_01',
  terminalId: 'terminal_04',
  preDialogKey: 'dialog.ch10_04.pre',
  postDialogKey: 'dialog.ch10_04.post',
  conceptsIntroduced: ['dunder_str', 'dunder_repr'],
  conceptsReinforced: ['init_constructor', 'fstrings'],
};
