import type { Challenge } from '@venomous-snake/shared-types';

export const ch10_08_class_static_methods: Challenge = {
  id: 'ch10_08_class_static_methods',
  titleKey: 'challenges.ch10_08.title',
  descriptionKey: 'challenges.ch10_08.description',
  chapter: 10,
  order: 8,
  difficulty: 'hard',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch10_07_encapsulation'],
  xpReward: 240,
  tags: ['oop', 'class_variables', 'utility_functions'],
  scaffoldedCode:
    '# Create a Mission class with a count tracker\n# Use a regular method to access class state\n# Use a standalone function for validation\nclass Mission:\n    _count = 0\n\n    def __init__(self, name):\n        self.name = name\n        Mission._count += 1\n\n    def get_count(self):\n        return ___\n\ndef validate_mission_name(name):\n    return ___\n\nprint(validate_mission_name("OP-007"))\nm1 = Mission("OP-001")\nm2 = Mission("OP-002")\nprint(m1.get_count())',
  editableRegions: [
    { startLine: 11, endLine: 11, placeholder: 'Mission._count' },
    { startLine: 14, endLine: 14, placeholder: 'name.startswith("OP-")' },
  ],
  solutionCode:
    'class Mission:\n    _count = 0\n\n    def __init__(self, name):\n        self.name = name\n        Mission._count += 1\n\n    def get_count(self):\n        return Mission._count\n\ndef validate_mission_name(name):\n    return name.startswith("OP-")\n\nprint(validate_mission_name("OP-007"))\nm1 = Mission("OP-001")\nm2 = Mission("OP-002")\nprint(m1.get_count())',
  testCases: [
    {
      id: 'tc01',
      description: 'Should validate names and track instance count',
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
    { tier: 1 as const, text: 'Class variables are shared across all instances. Access with ClassName._count.' },
    { tier: 2 as const, text: 'A regular method can read class variables via the class name. Standalone functions work like static methods.' },
    { tier: 3 as const, text: 'Solution: return Mission._count in get_count, return name.startswith("OP-") in validate_mission_name' },
  ],
  roomId: 'floor_10_room_01',
  terminalId: 'terminal_08',
  preDialogKey: 'dialog.ch10_08.pre',
  postDialogKey: 'dialog.ch10_08.post',
  conceptsIntroduced: ['class_variables', 'utility_functions'],
  conceptsReinforced: ['class_definition', 'init_constructor'],
};
