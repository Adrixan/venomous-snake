import type { Challenge } from '@venomous-snake/shared-types';

export const ch09_08_string_formatting_advanced: Challenge = {
  id: 'ch09_08_string_formatting_advanced',
  titleKey: 'challenges.ch09_08.title',
  descriptionKey: 'challenges.ch09_08.description',
  chapter: 9,
  order: 8,
  difficulty: 'hard',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch09_07_dictionary_comprehension'],
  xpReward: 210,
  tags: ['f-strings', 'formatting', 'alignment'],
  scaffoldedCode:
    '# Create a formatted table of agents with aligned columns\nagents = [("Snake", 10, 9850), ("Viper", 8, 7200), ("Ghost", 6, 5100)]\nheader_name = "Name"\nheader_level = "Level"\nheader_xp = "XP"\nprint(___)\nprint(___)\nfor name, level, xp in agents:\n    print(___)',
  editableRegions: [
    { startLine: 6, endLine: 6, placeholder: 'f"{header_name:<10} {header_level:>5} {header_xp:>8}"' },
    { startLine: 7, endLine: 7, placeholder: '"-" * 25' },
    { startLine: 9, endLine: 9, placeholder: 'f"{name:<10} {level:>5} {xp:>8}"' },
  ],
  solutionCode:
    'agents = [("Snake", 10, 9850), ("Viper", 8, 7200), ("Ghost", 6, 5100)]\nheader_name = "Name"\nheader_level = "Level"\nheader_xp = "XP"\nprint(f"{header_name:<10} {header_level:>5} {header_xp:>8}")\nprint("-" * 25)\nfor name, level, xp in agents:\n    print(f"{name:<10} {level:>5} {xp:>8}")',
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
    { tier: 2 as const, text: 'Store header strings in variables, then use format specs: f"{header_name:<10}".' },
    { tier: 3 as const, text: 'Solution: f"{header_name:<10} {header_level:>5} {header_xp:>8}" and f"{name:<10} {level:>5} {xp:>8}"' },
  ],
  roomId: 'floor_9_room_01',
  terminalId: 'terminal_08',
  preDialogKey: 'dialog.ch09_08.pre',
  postDialogKey: 'dialog.ch09_08.post',
  conceptsIntroduced: ['format_specs', 'string_alignment', 'padding'],
  conceptsReinforced: ['fstrings', 'for_loop', 'tuples'],
};
