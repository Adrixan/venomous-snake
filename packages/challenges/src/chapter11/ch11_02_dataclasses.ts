import type { Challenge } from '@venomous-snake/shared-types';

export const ch11_02_dataclasses: Challenge = {
  id: 'ch11_02_dataclasses',
  titleKey: 'challenges.ch11_02.title',
  descriptionKey: 'challenges.ch11_02.description',
  chapter: 11,
  order: 2,
  difficulty: 'medium',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch11_01_type_hints'],
  xpReward: 235,
  tags: ['data_containers', 'dunder_methods', 'classes'],
  scaffoldedCode:
    'class Agent:\n    def __init__(self, name, level, active=___):\n        self.name = name\n        self.level = level\n        self.active = active\n\n    def __repr__(self):\n        return ___\n\n    def __eq__(self, other):\n        return ___\n\na1 = Agent("Snake", 10)\na2 = Agent("Ghost", 6, False)\nprint(a1)\nprint(a2)\nprint(a1.active)',
  editableRegions: [
    { startLine: 2, endLine: 2, placeholder: 'True' },
    { startLine: 8, endLine: 8, placeholder: 'f"Agent(name=\'...\', level=..., active=...)"' },
    { startLine: 11, endLine: 11, placeholder: 'self.name == other.name and ...' },
  ],
  solutionCode:
    'class Agent:\n    def __init__(self, name, level, active=True):\n        self.name = name\n        self.level = level\n        self.active = active\n\n    def __repr__(self):\n        return f"Agent(name=\'{self.name}\', level={self.level}, active={self.active})"\n\n    def __eq__(self, other):\n        return self.name == other.name and self.level == other.level and self.active == other.active\n\na1 = Agent("Snake", 10)\na2 = Agent("Ghost", 6, False)\nprint(a1)\nprint(a2)\nprint(a1.active)',
  testCases: [
    {
      id: 'tc01',
      description: 'Should create data container instances with __repr__',
      expectedOutput: 'Agent(name=\'Snake\', level=10, active=True)\nAgent(name=\'Ghost\', level=6, active=False)\nTrue',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should implement __init__, __repr__, and __eq__',
      expectedOutput: 'Agent(name=\'Snake\', level=10, active=True)\nAgent(name=\'Ghost\', level=6, active=False)\nTrue',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Data containers need __init__ (constructor), __repr__ (display), and __eq__ (comparison) methods.' },
    { tier: 2 as const, text: '__repr__ returns a string showing how to recreate the object. __eq__ compares all fields.' },
    { tier: 3 as const, text: 'Solution: __repr__ returns f"Agent(name=\'...\', ...)", __eq__ compares name, level, and active' },
  ],
  roomId: 'floor_11_room_01',
  terminalId: 'terminal_02',
  preDialogKey: 'dialog.ch11_02.pre',
  postDialogKey: 'dialog.ch11_02.post',
  conceptsIntroduced: ['dunder_repr', 'dunder_eq', 'data_containers'],
  conceptsReinforced: ['class_definition', 'init_constructor', 'default_parameters'],
};
