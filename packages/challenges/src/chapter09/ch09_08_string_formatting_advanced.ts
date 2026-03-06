import type { Challenge } from '@venomous-snake/shared-types';

export const ch09_08_string_formatting_advanced: Challenge = {
  id: 'ch09_08_string_formatting_advanced',
  titleKey: 'challenges.ch09_08.title',
  descriptionKey: 'challenges.ch09_08.description',
  chapter: 9,
  order: 8,
  difficulty: 'hard',
  scaffoldingLevel: 'open',
  prerequisites: ['ch09_07_dictionary_comprehension'],
  xpReward: 210,
  tags: ['f-strings', 'formatting', 'alignment'],
  scaffoldedCode:
    '# Create a formatted table of agents with aligned columns\n# Use f-string format specs: {value:<width}, {value:>width}\n# agents = [("Snake", 10, 9850), ("Viper", 8, 7200), ("Ghost", 6, 5100)]\n',
  solutionCode:
    'agents = [("Snake", 10, 9850), ("Viper", 8, 7200), ("Ghost", 6, 5100)]\nprint(f"{\'Name\':<10} {\'Level\':>5} {\'XP\':>8}")\nprint("-" * 25)\nfor name, level, xp in agents:\n    print(f"{name:<10} {level:>5} {xp:>8}")',
  testCases: [
    {
      id: 'tc01',
      description: 'Should display formatted table',
      expectedOutput: 'Name       Level       XP\n-------------------------\nSnake         10     9850\nViper          8     7200\nGhost          6     5100',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use alignment format specs',
      expectedOutput: 'Name       Level       XP\n-------------------------\nSnake         10     9850\nViper          8     7200\nGhost          6     5100',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Use :<10 for left-align in 10 chars, :>5 for right-align in 5 chars.' },
    { tier: 2 as const, text: 'f-string format specs go after a colon: f"{value:<width}".' },
    { tier: 3 as const, text: 'Solution: f"{name:<10} {level:>5} {xp:>8}" for each row' },
  ],
  roomId: 'floor_9_room_01',
  terminalId: 'terminal_08',
  preDialogKey: 'dialog.ch09_08.pre',
  postDialogKey: 'dialog.ch09_08.post',
  conceptsIntroduced: ['format_specs', 'string_alignment', 'padding'],
  conceptsReinforced: ['fstrings', 'for_loop', 'tuples'],
};
