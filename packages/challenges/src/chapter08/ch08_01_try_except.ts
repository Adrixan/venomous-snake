import type { Challenge } from '@venomous-snake/shared-types';

export const ch08_01_try_except: Challenge = {
  id: 'ch08_01_try_except',
  titleKey: 'challenges.ch08_01.title',
  descriptionKey: 'challenges.ch08_01.description',
  chapter: 8,
  order: 1,
  difficulty: 'easy',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch07_08_data_transformation'],
  xpReward: 160,
  tags: ['error-handling', 'try-except'],
  scaffoldedCode:
    'def parse_code(code_str):\n    ___:\n        return int(code_str)\n    ___ ValueError:\n        return -1\n\nprint(parse_code("42"))\nprint(parse_code("invalid"))',
  editableRegions: [
    { startLine: 2, endLine: 4, placeholder: 'try / except' },
  ],
  solutionCode:
    'def parse_code(code_str):\n    try:\n        return int(code_str)\n    except ValueError:\n        return -1\n\nprint(parse_code("42"))\nprint(parse_code("invalid"))',
  testCases: [
    {
      id: 'tc01',
      description: 'Should handle valid and invalid input',
      expectedOutput: '42\n-1',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should catch ValueError for non-numeric input',
      expectedOutput: '42\n-1',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Use try: to wrap code that might fail, and except to catch specific errors.' },
    { tier: 2 as const, text: 'except ValueError: catches errors when int() receives a non-numeric string.' },
    { tier: 3 as const, text: 'Solution: try: return int(code_str) except ValueError: return -1' },
  ],
  roomId: 'floor_8_room_01',
  terminalId: 'terminal_01',
  preDialogKey: 'dialog.ch08_01.pre',
  postDialogKey: 'dialog.ch08_01.post',
  conceptsIntroduced: ['try_except', 'ValueError'],
  conceptsReinforced: ['function_definition', 'type_conversion'],
};
