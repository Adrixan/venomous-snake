import type { Challenge } from '@venomous-snake/shared-types';

export const ch10_06_method_override: Challenge = {
  id: 'ch10_06_method_override',
  titleKey: 'challenges.ch10_06.title',
  descriptionKey: 'challenges.ch10_06.description',
  chapter: 10,
  order: 6,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch10_05_inheritance'],
  xpReward: 225,
  tags: ['oop', 'override', 'polymorphism'],
  scaffoldedCode:
    'class Bot:\n    def alert(self):\n        return "Alert: Unknown entity detected"\n\nclass EliteBot(Bot):\n    def alert(self):\n        parent_alert = ___\n        return f"{parent_alert} — PRIORITY THREAT"\n\nclass StealthBot(Bot):\n    def alert(self):\n        return ___\n\nbots = [Bot(), EliteBot(), StealthBot()]\nfor bot in bots:\n    print(bot.alert())',
  solutionCode:
    'class Bot:\n    def alert(self):\n        return "Alert: Unknown entity detected"\n\nclass EliteBot(Bot):\n    def alert(self):\n        parent_alert = super().alert()\n        return f"{parent_alert} \\u2014 PRIORITY THREAT"\n\nclass StealthBot(Bot):\n    def alert(self):\n        return "..."\n\nbots = [Bot(), EliteBot(), StealthBot()]\nfor bot in bots:\n    print(bot.alert())',
  testCases: [
    {
      id: 'tc01',
      description: 'Should override alert in subclasses',
      expectedOutput: 'Alert: Unknown entity detected\nAlert: Unknown entity detected — PRIORITY THREAT\n...',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use super() and complete override',
      expectedOutput: 'Alert: Unknown entity detected\nAlert: Unknown entity detected — PRIORITY THREAT\n...',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Override a method by defining the same method name in the subclass.' },
    { tier: 2 as const, text: 'Use super().alert() to call the parent version. StealthBot completely replaces the behavior.' },
    { tier: 3 as const, text: 'Solution: EliteBot uses super().alert() + extra text. StealthBot returns "..."' },
  ],
  roomId: 'floor_10_room_01',
  terminalId: 'terminal_06',
  preDialogKey: 'dialog.ch10_06.pre',
  postDialogKey: 'dialog.ch10_06.post',
  conceptsIntroduced: ['method_overriding', 'polymorphic_behavior'],
  conceptsReinforced: ['inheritance', 'super_function'],
};
