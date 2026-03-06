import type { Challenge } from '@venomous-snake/shared-types';

export const ch06_10_combining_collections: Challenge = {
  id: 'ch06_10_combining_collections',
  titleKey: 'challenges.ch06_10.title',
  descriptionKey: 'challenges.ch06_10.description',
  chapter: 6,
  order: 10,
  difficulty: 'medium',
  scaffoldingLevel: 'open',
  prerequisites: ['ch06_06_dictionaries'],
  xpReward: 225,
  tags: ['dictionary', 'merge', 'sorted'],

  scaffoldedCode: '# Write your solution here\n',

  solutionCode:
    'source_a = {"Viper": 3, "Ghost": 5}\nsource_b = {"Phantom": 2, "Viper": 4}\nmerged = {**source_a, **source_b}\nfor name, level in sorted(merged.items()):\n    print(f"{name}: {level}")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print merged and sorted operative levels',
      expectedOutput: 'Ghost: 5\nPhantom: 2\nViper: 4',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should merge dicts with second overriding first',
      expectedOutput: 'Ghost: 5\nPhantom: 2\nViper: 4',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Use {**dict1, **dict2} to merge dictionaries. Later values override earlier ones.',
    },
    {
      tier: 2,
      text: 'sorted(dict.items()) sorts by key. Use a for loop to print each name and level.',
    },
    {
      tier: 3,
      text: 'Solution: merged = {**source_a, **source_b}, then for name, level in sorted(merged.items()):',
    },
  ],

  roomId: 'floor_6_room_01',
  terminalId: 'terminal_10',
  preDialogKey: 'dialog.ch06_10.pre',
  postDialogKey: 'dialog.ch06_10.post',

  conceptsIntroduced: ['dict_merge', 'dict_spread', 'sorted_items'],
  conceptsReinforced: ['dictionary', 'for_loop', 'fstrings'],
};
