import type { Challenge } from '@venomous-snake/shared-types';

export const ch11_01_type_hints: Challenge = {
  id: 'ch11_01_type_hints',
  titleKey: 'challenges.ch11_01.title',
  descriptionKey: 'challenges.ch11_01.description',
  chapter: 11,
  order: 1,
  difficulty: 'medium',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch10_10_polymorphism'],
  xpReward: 225,
  tags: ['type-hints', 'annotations', 'typing'],
  scaffoldedCode:
    'def calculate_xp(base: ___, multiplier: ___) -> ___:\n    return int(base * multiplier)\n\ndef get_codename(agent_id: ___) -> ___:\n    return f"AGENT-{agent_id.upper()}"\n\nprint(calculate_xp(100, 1.5))\nprint(get_codename("viper"))',
  editableRegions: [
    { startLine: 1, endLine: 1, placeholder: 'int / float / int' },
    { startLine: 4, endLine: 4, placeholder: 'str / str' },
  ],
  solutionCode:
    'def calculate_xp(base: int, multiplier: float) -> int:\n    return int(base * multiplier)\n\ndef get_codename(agent_id: str) -> str:\n    return f"AGENT-{agent_id.upper()}"\n\nprint(calculate_xp(100, 1.5))\nprint(get_codename("viper"))',
  testCases: [
    {
      id: 'tc01',
      description: 'Should compute XP and codename',
      expectedOutput: '150\nAGENT-VIPER',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use type annotations',
      expectedOutput: '150\nAGENT-VIPER',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Type hints annotate parameters and return types: def func(x: int) -> str:' },
    { tier: 2 as const, text: 'Use int, float, str as type annotations. -> indicates return type.' },
    { tier: 3 as const, text: 'Solution: def calculate_xp(base: int, multiplier: float) -> int:' },
  ],
  roomId: 'floor_11_room_01',
  terminalId: 'terminal_01',
  preDialogKey: 'dialog.ch11_01.pre',
  postDialogKey: 'dialog.ch11_01.post',
  conceptsIntroduced: ['type_hints', 'return_type_annotation'],
  conceptsReinforced: ['function_definition', 'fstrings'],
};
