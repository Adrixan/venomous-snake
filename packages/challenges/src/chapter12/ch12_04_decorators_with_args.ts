import type { Challenge } from '@venomous-snake/shared-types';

export const ch12_04_decorators_with_args: Challenge = {
  id: 'ch12_04_decorators_with_args',
  titleKey: 'challenges.ch12_04.title',
  descriptionKey: 'challenges.ch12_04.description',
  chapter: 12,
  order: 4,
  difficulty: 'hard',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch12_03_decorators_basics'],
  xpReward: 285,
  tags: ['decorators', 'parameterized', 'closures'],
  scaffoldedCode:
    'def require_clearance(min_level):\n    def decorator(func):\n        def wrapper(agent_level, *args, **kwargs):\n            if agent_level < ___:\n                print(f"ACCESS DENIED: Need level {___}")\n                return None\n            return func(agent_level, *args, **kwargs)\n        return wrapper\n    return decorator\n\n@require_clearance(8)\ndef access_vault(agent_level):\n    return "Vault accessed"\n\nprint(access_vault(10))\nprint(access_vault(5))',
  solutionCode:
    'def require_clearance(min_level):\n    def decorator(func):\n        def wrapper(agent_level, *args, **kwargs):\n            if agent_level < min_level:\n                print(f"ACCESS DENIED: Need level {min_level}")\n                return None\n            return func(agent_level, *args, **kwargs)\n        return wrapper\n    return decorator\n\n@require_clearance(8)\ndef access_vault(agent_level):\n    return "Vault accessed"\n\nprint(access_vault(10))\nprint(access_vault(5))',
  testCases: [
    {
      id: 'tc01',
      description: 'Should enforce clearance levels',
      expectedOutput: 'Vault accessed\nACCESS DENIED: Need level 8\nNone',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use parameterized decorator',
      expectedOutput: 'Vault accessed\nACCESS DENIED: Need level 8\nNone',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'A parameterized decorator is a function that returns a decorator. Three nested functions.' },
    { tier: 2 as const, text: 'min_level is captured from the outer function via closure.' },
    { tier: 3 as const, text: 'Solution: if agent_level < min_level and f"Need level {min_level}"' },
  ],
  roomId: 'floor_12_room_01',
  terminalId: 'terminal_04',
  preDialogKey: 'dialog.ch12_04.pre',
  postDialogKey: 'dialog.ch12_04.post',
  conceptsIntroduced: ['parameterized_decorators', 'triple_nested_closures'],
  conceptsReinforced: ['decorators', 'closures'],
};
