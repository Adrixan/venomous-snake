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
  tags: ['constants', 'class_constants', 'best-practices'],
  scaffoldedCode:
    '# Use a class to group related constants (like an enum)\nclass ThreatLevel:\n    LOW = ___\n    MEDIUM = ___\n    HIGH = ___\n    CRITICAL = ___\n\nMAX_AGENTS = ___\nDEFAULT_FLOOR = ___\n\nprint("HIGH")\nprint(ThreatLevel.HIGH)\nprint(MAX_AGENTS)\nprint(DEFAULT_FLOOR)',
  editableRegions: [
    { startLine: 3, endLine: 6, placeholder: '1, 5, 8, 10' },
    { startLine: 8, endLine: 9, placeholder: '12, "lobby"' },
  ],
  solutionCode:
    'class ThreatLevel:\n    LOW = 1\n    MEDIUM = 5\n    HIGH = 8\n    CRITICAL = 10\n\nMAX_AGENTS = 12\nDEFAULT_FLOOR = "lobby"\n\nprint("HIGH")\nprint(ThreatLevel.HIGH)\nprint(MAX_AGENTS)\nprint(DEFAULT_FLOOR)',
  testCases: [
    {
      id: 'tc01',
      description: 'Should use class constants and module constants',
      expectedOutput: 'HIGH\n8\n12\nlobby',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should define constant values correctly',
      expectedOutput: 'HIGH\n8\n12\nlobby',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Group related constants in a class. Access with ClassName.CONSTANT.' },
    { tier: 2 as const, text: 'Define values: LOW = 1, MEDIUM = 5, HIGH = 8, CRITICAL = 10.' },
    { tier: 3 as const, text: 'Constants are UPPERCASE variables: MAX_AGENTS = 12, DEFAULT_FLOOR = "lobby"' },
  ],
  roomId: 'floor_11_room_01',
  terminalId: 'terminal_06',
  preDialogKey: 'dialog.ch11_06.pre',
  postDialogKey: 'dialog.ch11_06.post',
  conceptsIntroduced: ['class_constants', 'constants_convention'],
  conceptsReinforced: ['class_definition', 'print'],
};
