import type { Challenge } from '@venomous-snake/shared-types';

export const ch08_02_multiple_except: Challenge = {
  id: 'ch08_02_multiple_except',
  titleKey: 'challenges.ch08_02.title',
  descriptionKey: 'challenges.ch08_02.description',
  chapter: 8,
  order: 2,
  difficulty: 'easy',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch08_01_try_except'],
  xpReward: 165,
  tags: ['error-handling', 'multiple-except'],
  scaffoldedCode:
    'def safe_access(data, key):\n    try:\n        return data[___]\n    except ___:\n        return "KEY_NOT_FOUND"\n    except ___:\n        return "TYPE_ERROR"\n\ninfo = {"agent": "Viper", "level": 8}\nprint(safe_access(info, "agent"))\nprint(safe_access(info, "missing"))',
  solutionCode:
    'def safe_access(data, key):\n    try:\n        return data[key]\n    except KeyError:\n        return "KEY_NOT_FOUND"\n    except TypeError:\n        return "TYPE_ERROR"\n\ninfo = {"agent": "Viper", "level": 8}\nprint(safe_access(info, "agent"))\nprint(safe_access(info, "missing"))',
  testCases: [
    {
      id: 'tc01',
      description: 'Should handle valid key and missing key',
      expectedOutput: 'Viper\nKEY_NOT_FOUND',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should catch KeyError for missing keys',
      expectedOutput: 'Viper\nKEY_NOT_FOUND',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'You can have multiple except blocks to catch different error types.' },
    { tier: 2 as const, text: 'KeyError is raised when accessing a missing dictionary key. TypeError when the type is wrong.' },
    { tier: 3 as const, text: 'Solution: except KeyError: and except TypeError: as separate blocks' },
  ],
  roomId: 'floor_8_room_01',
  terminalId: 'terminal_02',
  preDialogKey: 'dialog.ch08_02.pre',
  postDialogKey: 'dialog.ch08_02.post',
  conceptsIntroduced: ['multiple_except', 'KeyError', 'TypeError'],
  conceptsReinforced: ['try_except', 'dictionary'],
};
