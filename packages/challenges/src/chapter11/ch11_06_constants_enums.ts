import type { Challenge } from '@venomous-snake/shared-types';

export const ch11_06_constants_enums: Challenge = {
  id: 'ch11_06_constants_enums',
  titleKey: 'challenges.ch11_06.title',
  descriptionKey: 'challenges.ch11_06.description',
  chapter: 11,
  order: 6,
  difficulty: 'medium',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch11_05_docstrings'],
  xpReward: 240,
  tags: ['enums', 'constants', 'best-practices'],
  scaffoldedCode:
    'from enum import Enum\n\nclass ThreatLevel(Enum):\n    LOW = ___\n    MEDIUM = ___\n    HIGH = ___\n    CRITICAL = ___\n\nMAX_AGENTS = ___\nDEFAULT_FLOOR = ___\n\nprint(ThreatLevel.HIGH.name)\nprint(ThreatLevel.HIGH.value)\nprint(MAX_AGENTS)\nprint(DEFAULT_FLOOR)',
  solutionCode:
    'from enum import Enum\n\nclass ThreatLevel(Enum):\n    LOW = 1\n    MEDIUM = 5\n    HIGH = 8\n    CRITICAL = 10\n\nMAX_AGENTS = 12\nDEFAULT_FLOOR = "lobby"\n\nprint(ThreatLevel.HIGH.name)\nprint(ThreatLevel.HIGH.value)\nprint(MAX_AGENTS)\nprint(DEFAULT_FLOOR)',
  testCases: [
    {
      id: 'tc01',
      description: 'Should use enums and constants',
      expectedOutput: 'HIGH\n8\n12\nlobby',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should define enum values correctly',
      expectedOutput: 'HIGH\n8\n12\nlobby',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Enum members have .name (the string name) and .value (the assigned value).' },
    { tier: 2 as const, text: 'Define enum values: LOW = 1, MEDIUM = 5, HIGH = 8, CRITICAL = 10.' },
    { tier: 3 as const, text: 'Constants are just module-level variables: MAX_AGENTS = 12' },
  ],
  roomId: 'floor_11_room_01',
  terminalId: 'terminal_06',
  preDialogKey: 'dialog.ch11_06.pre',
  postDialogKey: 'dialog.ch11_06.post',
  conceptsIntroduced: ['enums', 'constants_convention'],
  conceptsReinforced: ['class_definition', 'import_module'],
};
