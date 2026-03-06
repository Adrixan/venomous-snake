import type { Challenge } from '@venomous-snake/shared-types';

export const ch08_03_try_except_else_finally: Challenge = {
  id: 'ch08_03_try_except_else_finally',
  titleKey: 'challenges.ch08_03.title',
  descriptionKey: 'challenges.ch08_03.description',
  chapter: 8,
  order: 3,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch08_02_multiple_except'],
  xpReward: 175,
  tags: ['error-handling', 'else', 'finally'],
  scaffoldedCode:
    'def decode_signal(code):\n    try:\n        result = int(code) * 2\n    except ___:\n        print("ERROR: Invalid signal")\n    ___:\n        print(f"Signal decoded: {result}")\n    ___:\n        print("Transmission complete")\n\ndecode_signal("21")',
  solutionCode:
    'def decode_signal(code):\n    try:\n        result = int(code) * 2\n    except ValueError:\n        print("ERROR: Invalid signal")\n    else:\n        print(f"Signal decoded: {result}")\n    finally:\n        print("Transmission complete")\n\ndecode_signal("21")',
  testCases: [
    {
      id: 'tc01',
      description: 'Should decode valid signal with else and finally',
      expectedOutput: 'Signal decoded: 42\nTransmission complete',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use try/except/else/finally pattern',
      expectedOutput: 'Signal decoded: 42\nTransmission complete',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'else: runs when no exception occurred. finally: runs no matter what.' },
    { tier: 2 as const, text: 'The full pattern is: try → except → else → finally.' },
    { tier: 3 as const, text: 'Solution: except ValueError:, else:, finally: as three separate blocks' },
  ],
  roomId: 'floor_8_room_01',
  terminalId: 'terminal_03',
  preDialogKey: 'dialog.ch08_03.pre',
  postDialogKey: 'dialog.ch08_03.post',
  conceptsIntroduced: ['else_clause', 'finally_clause'],
  conceptsReinforced: ['try_except', 'ValueError'],
};
