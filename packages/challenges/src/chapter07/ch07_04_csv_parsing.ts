import type { Challenge } from '@venomous-snake/shared-types';

export const ch07_04_csv_parsing: Challenge = {
  id: 'ch07_04_csv_parsing',
  titleKey: 'challenges.ch07_04.title',
  descriptionKey: 'challenges.ch07_04.description',
  chapter: 7,
  order: 4,
  difficulty: 'easy',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch07_03_file_line_processing'],
  xpReward: 145,
  tags: ['string-processing', 'split'],
  scaffoldedCode:
    'csv_data = "snake,viper,cobra,python"\nfields = csv_data.___(___)\nfor field in fields:\n    print(field)',
  editableRegions: [
    { startLine: 2, endLine: 2, placeholder: 'split(",")' },
  ],
  solutionCode:
    'csv_data = "snake,viper,cobra,python"\nfields = csv_data.split(",")\nfor field in fields:\n    print(field)',
  testCases: [
    {
      id: 'tc01',
      description: 'Should split and print each field',
      expectedOutput: 'snake\nviper\ncobra\npython',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use split to parse CSV data',
      expectedOutput: 'snake\nviper\ncobra\npython',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'The .split() method breaks a string into a list using a delimiter.' },
    { tier: 2 as const, text: 'Use .split(",") to split on commas.' },
    { tier: 3 as const, text: 'Solution: fields = csv_data.split(",")' },
  ],
  roomId: 'floor_7_room_01',
  terminalId: 'terminal_04',
  preDialogKey: 'dialog.ch07_04.pre',
  postDialogKey: 'dialog.ch07_04.post',
  conceptsIntroduced: ['csv_parsing', 'split_delimiter'],
  conceptsReinforced: ['string_methods', 'for_loop', 'print'],
};
