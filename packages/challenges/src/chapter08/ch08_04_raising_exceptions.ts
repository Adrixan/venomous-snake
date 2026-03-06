import type { Challenge } from '@venomous-snake/shared-types';

export const ch08_04_raising_exceptions: Challenge = {
  id: 'ch08_04_raising_exceptions',
  titleKey: 'challenges.ch08_04.title',
  descriptionKey: 'challenges.ch08_04.description',
  chapter: 8,
  order: 4,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch08_03_try_except_else_finally'],
  xpReward: 180,
  tags: ['error-handling', 'raise'],
  scaffoldedCode:
    'def set_clearance(level):\n    if level < 1 or level > 10:\n        raise ___(f"Clearance level {level} is out of range")\n    return f"Clearance set to level {level}"\n\ntry:\n    print(set_clearance(7))\n    print(set_clearance(15))\nexcept ValueError as e:\n    print(f"Error: {e}")',
  solutionCode:
    'def set_clearance(level):\n    if level < 1 or level > 10:\n        raise ValueError(f"Clearance level {level} is out of range")\n    return f"Clearance set to level {level}"\n\ntry:\n    print(set_clearance(7))\n    print(set_clearance(15))\nexcept ValueError as e:\n    print(f"Error: {e}")',
  testCases: [
    {
      id: 'tc01',
      description: 'Should raise and catch ValueError',
      expectedOutput: 'Clearance set to level 7\nError: Clearance level 15 is out of range',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should validate clearance range',
      expectedOutput: 'Clearance set to level 7\nError: Clearance level 15 is out of range',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Use raise ValueError("message") to raise an error with a custom message.' },
    { tier: 2 as const, text: 'The raise keyword creates an exception that can be caught by a try/except block.' },
    { tier: 3 as const, text: 'Solution: raise ValueError(f"Clearance level {level} is out of range")' },
  ],
  roomId: 'floor_8_room_01',
  terminalId: 'terminal_04',
  preDialogKey: 'dialog.ch08_04.pre',
  postDialogKey: 'dialog.ch08_04.post',
  conceptsIntroduced: ['raise_exception', 'custom_error_message'],
  conceptsReinforced: ['try_except', 'ValueError', 'fstrings'],
};
