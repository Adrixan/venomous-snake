import type { Challenge } from '@venomous-snake/shared-types';

export const ch10_08_class_static_methods: Challenge = {
  id: 'ch10_08_class_static_methods',
  titleKey: 'challenges.ch10_08.title',
  descriptionKey: 'challenges.ch10_08.description',
  chapter: 10,
  order: 8,
  difficulty: 'hard',
  scaffoldingLevel: 'open',
  prerequisites: ['ch10_07_encapsulation'],
  xpReward: 240,
  tags: ['oop', 'classmethod', 'staticmethod'],
  scaffoldedCode:
    '# Create a Mission class with:\n# - Class variable _count tracking instances\n# - @classmethod get_count(cls) returning cls._count\n# - @staticmethod validate_name(name) checking it starts with "OP-"\n',
  solutionCode:
    'class Mission:\n    _count = 0\n    \n    def __init__(self, name):\n        self.name = name\n        Mission._count += 1\n    \n    @classmethod\n    def get_count(cls):\n        return cls._count\n    \n    @staticmethod\n    def validate_name(name):\n        return name.startswith("OP-")\n\nprint(Mission.validate_name("OP-007"))\nm1 = Mission("OP-001")\nm2 = Mission("OP-002")\nprint(Mission.get_count())',
  testCases: [
    {
      id: 'tc01',
      description: 'Should use classmethod and staticmethod',
      expectedOutput: 'True\n2',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should track instance count with class variable',
      expectedOutput: 'True\n2',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: '@classmethod receives cls (the class itself). @staticmethod needs no cls or self.' },
    { tier: 2 as const, text: 'Class variables are shared across all instances. Increment with ClassName._count += 1.' },
    { tier: 3 as const, text: 'Solution: @classmethod def get_count(cls): return cls._count, @staticmethod def validate_name(name): return name.startswith("OP-")' },
  ],
  roomId: 'floor_10_room_01',
  terminalId: 'terminal_08',
  preDialogKey: 'dialog.ch10_08.pre',
  postDialogKey: 'dialog.ch10_08.post',
  conceptsIntroduced: ['classmethod', 'staticmethod', 'class_variables'],
  conceptsReinforced: ['class_definition', 'init_constructor'],
};
