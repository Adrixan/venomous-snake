import type { Challenge } from '@venomous-snake/shared-types';

export const ch09_03_lambda_functions: Challenge = {
  id: 'ch09_03_lambda_functions',
  titleKey: 'challenges.ch09_03.title',
  descriptionKey: 'challenges.ch09_03.description',
  chapter: 9,
  order: 3,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch09_02_from_import'],
  xpReward: 185,
  tags: ['lambda', 'sorted', 'key-function'],
  scaffoldedCode:
    'agents = [("Viper", 8), ("Snake", 10), ("Ghost", 6), ("Wolf", 9)]\nsorted_agents = sorted(agents, key=___, reverse=___)\nfor name, level in sorted_agents:\n    print(f"{name}: {level}")',
  solutionCode:
    'agents = [("Viper", 8), ("Snake", 10), ("Ghost", 6), ("Wolf", 9)]\nsorted_agents = sorted(agents, key=lambda x: x[1], reverse=True)\nfor name, level in sorted_agents:\n    print(f"{name}: {level}")',
  testCases: [
    {
      id: 'tc01',
      description: 'Should sort agents by level descending',
      expectedOutput: 'Snake: 10\nWolf: 9\nViper: 8\nGhost: 6',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use lambda as sort key',
      expectedOutput: 'Snake: 10\nWolf: 9\nViper: 8\nGhost: 6',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'lambda x: x[1] creates a function that returns the second element of a tuple.' },
    { tier: 2 as const, text: 'sorted() with key= uses the lambda to determine sort order. reverse=True sorts descending.' },
    { tier: 3 as const, text: 'Solution: sorted(agents, key=lambda x: x[1], reverse=True)' },
  ],
  roomId: 'floor_9_room_01',
  terminalId: 'terminal_03',
  preDialogKey: 'dialog.ch09_03.pre',
  postDialogKey: 'dialog.ch09_03.post',
  conceptsIntroduced: ['lambda_sort_key', 'sorted_reverse'],
  conceptsReinforced: ['lambda', 'tuples', 'for_loop'],
};
