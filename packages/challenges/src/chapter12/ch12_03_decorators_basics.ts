import type { Challenge } from '@venomous-snake/shared-types';

export const ch12_03_decorators_basics: Challenge = {
  id: 'ch12_03_decorators_basics',
  titleKey: 'challenges.ch12_03.title',
  descriptionKey: 'challenges.ch12_03.description',
  chapter: 12,
  order: 3,
  difficulty: 'hard',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch12_02_generator_expressions'],
  xpReward: 275,
  tags: ['decorators', 'closures', 'higher-order-functions'],
  scaffoldedCode:
    'def logged(func):\n    def wrapper(*args, **kwargs):\n        print(f"[LOG] Calling {___}")\n        result = ___(___)\n        print(f"[LOG] {___} complete")\n        return result\n    return wrapper\n\n@logged\ndef hack_firewall(target):\n    return f"Firewall at {target} bypassed"\n\nresult = hack_firewall("192.168.0.1")\nprint(result)',
  solutionCode:
    'import time\n\ndef logged(func):\n    def wrapper(*args, **kwargs):\n        print(f"[LOG] Calling {func.__name__}")\n        result = func(*args, **kwargs)\n        print(f"[LOG] {func.__name__} complete")\n        return result\n    return wrapper\n\n@logged\ndef hack_firewall(target):\n    return f"Firewall at {target} bypassed"\n\nresult = hack_firewall("192.168.0.1")\nprint(result)',
  testCases: [
    {
      id: 'tc01',
      description: 'Should log function calls',
      expectedOutput: '[LOG] Calling hack_firewall\n[LOG] hack_firewall complete\nFirewall at 192.168.0.1 bypassed',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should wrap function with decorator',
      expectedOutput: '[LOG] Calling hack_firewall\n[LOG] hack_firewall complete\nFirewall at 192.168.0.1 bypassed',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'A decorator wraps a function. func.__name__ gives the function name.' },
    { tier: 2 as const, text: 'Call the original function with func(*args, **kwargs) inside wrapper.' },
    { tier: 3 as const, text: 'Solution: func.__name__ for the name, func(*args, **kwargs) to call it' },
  ],
  roomId: 'floor_12_room_01',
  terminalId: 'terminal_03',
  preDialogKey: 'dialog.ch12_03.pre',
  postDialogKey: 'dialog.ch12_03.post',
  conceptsIntroduced: ['decorators', 'closures', 'wrapper_functions'],
  conceptsReinforced: ['function_definition', 'args', 'kwargs'],
};
