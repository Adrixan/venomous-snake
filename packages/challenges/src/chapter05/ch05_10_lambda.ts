import type { Challenge } from '@venomous-snake/shared-types';

export const ch05_10_lambda: Challenge = {
  id: 'ch05_10_lambda',
  titleKey: 'challenges.ch05_10.title',
  descriptionKey: 'challenges.ch05_10.description',
  chapter: 5,
  order: 10,
  difficulty: 'medium',
  scaffoldingLevel: 'open',
  prerequisites: ['ch05_01_simple_function'],
  xpReward: 200,
  tags: ['lambda', 'sorted', 'function'],

  scaffoldedCode: '# Write your solution here\n',

  solutionCode:
    'guards = [("Ramirez", 3), ("Chen", 5), ("Volkov", 1)]\nsorted_guards = sorted(guards, key=lambda g: g[1])\nfor name, level in sorted_guards:\n    print(f"{name}: Level {level}")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should sort guards by level ascending',
      expectedOutput: 'Volkov: Level 1\nRamirez: Level 3\nChen: Level 5',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use lambda as the sort key',
      expectedOutput: 'Volkov: Level 1\nRamirez: Level 3\nChen: Level 5',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'A lambda is a small anonymous function: lambda x: x[1] returns the second element.',
    },
    {
      tier: 2,
      text: 'sorted(list, key=lambda g: g[1]) sorts by the second element of each tuple.',
    },
    {
      tier: 3,
      text: 'Solution: sorted_guards = sorted(guards, key=lambda g: g[1])',
    },
  ],

  roomId: 'floor_5_room_01',
  terminalId: 'terminal_10',
  preDialogKey: 'dialog.ch05_10.pre',
  postDialogKey: 'dialog.ch05_10.post',

  conceptsIntroduced: ['lambda', 'sorted_with_key', 'anonymous_functions'],
  conceptsReinforced: ['for_loop', 'tuple_unpacking', 'fstrings'],
};
