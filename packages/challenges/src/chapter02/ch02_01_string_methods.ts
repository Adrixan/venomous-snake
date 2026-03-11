import type { Challenge } from '@venomous-snake/shared-types';

export const ch02_01_string_methods: Challenge = {
  id: 'ch02_01_string_methods',
  titleKey: 'challenges.ch02_01.title',
  descriptionKey: 'challenges.ch02_01.description',
  chapter: 2,
  order: 1,
  difficulty: 'easy',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch01_06_string_concatenation'],
  xpReward: 100,
  tags: ['strings', 'methods', 'upper', 'lower', 'title'],

  scaffoldedCode:
    '# Transform the codename using string methods\ncodename = "shadow viper"\n# Use .upper(), .lower(), and .title() methods\nprint(___)\nprint(___)\nprint(___)',
  editableRegions: [
    { startLine: 4, endLine: 4, placeholder: 'codename.upper()' },
    { startLine: 5, endLine: 5, placeholder: 'codename.lower()' },
    { startLine: 6, endLine: 6, placeholder: 'codename.title()' },
  ],
  solutionCode:
    'codename = "shadow viper"\nprint(codename.upper())\nprint(codename.lower())\nprint(codename.title())',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print SHADOW VIPER in uppercase',
      expectedOutput: 'SHADOW VIPER\nshadow viper\nShadow Viper',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should print all three transformations',
      expectedOutput: 'SHADOW VIPER\nshadow viper\nShadow Viper',
      hidden: false,
    },
    {
      id: 'tc03',
      description: 'Should use .title() for title case',
      expectedOutput: 'SHADOW VIPER\nshadow viper\nShadow Viper',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'String methods are called with a dot: codename.upper() transforms to uppercase.',
    },
    {
      tier: 2,
      text: '.upper() → ALL CAPS, .lower() → all lowercase, .title() → Title Case.',
    },
    {
      tier: 3,
      text: 'Solution: print(codename.upper()), print(codename.lower()), print(codename.title())',
    },
  ],

  roomId: 'floor_2_room_01',
  terminalId: 'terminal_01',
  preDialogKey: 'dialog.ch02_01.pre',
  postDialogKey: 'dialog.ch02_01.post',

  conceptsIntroduced: ['string_methods', 'upper', 'lower', 'title'],
  conceptsReinforced: ['strings', 'print'],
};
