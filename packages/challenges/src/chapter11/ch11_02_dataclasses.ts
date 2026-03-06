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
  tags: ['dataclasses', 'decorator', 'typing'],
  scaffoldedCode:
    'from dataclasses import dataclass\n\n@dataclass\nclass Agent:\n    name: ___\n    level: ___\n    active: ___ = True\n\na1 = Agent("Snake", 10)\na2 = Agent("Ghost", 6, False)\nprint(a1)\nprint(a2)\nprint(a1.active)',
  solutionCode:
    'from dataclasses import dataclass\n\n@dataclass\nclass Agent:\n    name: str\n    level: int\n    active: bool = True\n\na1 = Agent("Snake", 10)\na2 = Agent("Ghost", 6, False)\nprint(a1)\nprint(a2)\nprint(a1.active)',
  testCases: [
    {
      id: 'tc01',
      description: 'Should create dataclass instances',
      expectedOutput: 'Agent(name=\'Snake\', level=10, active=True)\nAgent(name=\'Ghost\', level=6, active=False)\nTrue',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should auto-generate __init__ and __repr__',
      expectedOutput: 'Agent(name=\'Snake\', level=10, active=True)\nAgent(name=\'Ghost\', level=6, active=False)\nTrue',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: '@dataclass automatically generates __init__, __repr__, and __eq__ methods.' },
    { tier: 2 as const, text: 'Define fields with type annotations: name: str. Default values work like regular defaults.' },
    { tier: 3 as const, text: 'Solution: name: str, level: int, active: bool = True' },
  ],
  roomId: 'floor_11_room_01',
  terminalId: 'terminal_02',
  preDialogKey: 'dialog.ch11_02.pre',
  postDialogKey: 'dialog.ch11_02.post',
  conceptsIntroduced: ['dataclasses', 'dataclass_decorator'],
  conceptsReinforced: ['type_hints', 'class_definition', 'default_parameters'],
};
