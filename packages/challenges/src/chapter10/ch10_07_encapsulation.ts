import type { Challenge } from '@venomous-snake/shared-types';

export const ch10_07_encapsulation: Challenge = {
  id: 'ch10_07_encapsulation',
  titleKey: 'challenges.ch10_07.title',
  descriptionKey: 'challenges.ch10_07.description',
  chapter: 10,
  order: 7,
  difficulty: 'hard',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch10_06_method_override'],
  xpReward: 235,
  tags: ['oop', 'encapsulation', 'private-attributes'],
  scaffoldedCode:
    'class Agent:\n    def __init__(self, name, clearance):\n        self._name = name\n        self.__clearance = clearance\n    \n    def get_clearance(self):\n        return ___\n    \n    def set_clearance(self, level):\n        if 1 <= level <= 10:\n            ___\n    \n    def __str__(self):\n        return f"Agent {self._name}, Clearance: {self.__clearance}"\n\na = Agent("Snake", 5)\nprint(a)\na.set_clearance(9)\nprint(a.get_clearance())',
  solutionCode:
    'class Agent:\n    def __init__(self, name, clearance):\n        self._name = name\n        self.__clearance = clearance\n    \n    def get_clearance(self):\n        return self.__clearance\n    \n    def set_clearance(self, level):\n        if 1 <= level <= 10:\n            self.__clearance = level\n    \n    def __str__(self):\n        return f"Agent {self._name}, Clearance: {self.__clearance}"\n\na = Agent("Snake", 5)\nprint(a)\na.set_clearance(9)\nprint(a.get_clearance())',
  testCases: [
    {
      id: 'tc01',
      description: 'Should use getters and setters',
      expectedOutput: 'Agent Snake, Clearance: 5\n9',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should protect private attributes',
      expectedOutput: 'Agent Snake, Clearance: 5\n9',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'self.__attribute uses name mangling for privacy. Access it via getter/setter methods.' },
    { tier: 2 as const, text: 'get_clearance returns self.__clearance. set_clearance sets self.__clearance = level.' },
    { tier: 3 as const, text: 'Solution: return self.__clearance and self.__clearance = level' },
  ],
  roomId: 'floor_10_room_01',
  terminalId: 'terminal_07',
  preDialogKey: 'dialog.ch10_07.pre',
  postDialogKey: 'dialog.ch10_07.post',
  conceptsIntroduced: ['encapsulation', 'name_mangling', 'getters_setters'],
  conceptsReinforced: ['class_definition', 'init_constructor'],
};
