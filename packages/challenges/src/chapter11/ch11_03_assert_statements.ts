import type { Challenge } from '@venomous-snake/shared-types';

export const ch11_03_assert_statements: Challenge = {
  id: 'ch11_03_assert_statements',
  titleKey: 'challenges.ch11_03.title',
  descriptionKey: 'challenges.ch11_03.description',
  chapter: 11,
  order: 3,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch11_02_dataclasses'],
  xpReward: 240,
  tags: ['assert', 'validation', 'testing'],
  scaffoldedCode:
    'def divide_resources(total: int, units: int) -> float:\n    assert ___, "Unit count must be positive"\n    assert ___, "Total must be non-negative"\n    return total / units\n\nprint(divide_resources(100, 4))\nprint(divide_resources(0, 5))\ntry:\n    divide_resources(100, 0)\nexcept AssertionError as e:\n    print(f"AssertionError: {e}")',
  solutionCode:
    'def divide_resources(total: int, units: int) -> float:\n    assert units > 0, "Unit count must be positive"\n    assert total >= 0, "Total must be non-negative"\n    return total / units\n\nprint(divide_resources(100, 4))\nprint(divide_resources(0, 5))\ntry:\n    divide_resources(100, 0)\nexcept AssertionError as e:\n    print(f"AssertionError: {e}")',
  testCases: [
    {
      id: 'tc01',
      description: 'Should validate and divide',
      expectedOutput: '25.0\n0.0\nAssertionError: Unit count must be positive',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should raise AssertionError for invalid input',
      expectedOutput: '25.0\n0.0\nAssertionError: Unit count must be positive',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'assert condition, "message" raises AssertionError if condition is False.' },
    { tier: 2 as const, text: 'units > 0 checks positive, total >= 0 checks non-negative.' },
    { tier: 3 as const, text: 'Solution: assert units > 0, "Unit count must be positive"' },
  ],
  roomId: 'floor_11_room_01',
  terminalId: 'terminal_03',
  preDialogKey: 'dialog.ch11_03.pre',
  postDialogKey: 'dialog.ch11_03.post',
  conceptsIntroduced: ['assert_statement', 'AssertionError'],
  conceptsReinforced: ['type_hints', 'try_except'],
};
