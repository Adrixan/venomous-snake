import type { Challenge } from '@venomous-snake/shared-types';

export const ch02_02_string_indexing: Challenge = {
  id: 'ch02_02_string_indexing',
  titleKey: 'challenges.ch02_02.title',
  descriptionKey: 'challenges.ch02_02.description',
  chapter: 2,
  order: 2,
  difficulty: 'easy',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch02_01_string_methods'],
  xpReward: 100,
  tags: ['strings', 'indexing'],

  scaffoldedCode:
    '# Extract specific characters from the access code\naccess_code = "VIPER7"\nfirst = ___\nlast = ___\nthird = ___\nprint(first)\nprint(last)\nprint(third)',
  editableRegions: [
    { startLine: 3, endLine: 3, placeholder: 'access_code[0]' },
    { startLine: 4, endLine: 4, placeholder: 'access_code[-1]' },
    { startLine: 5, endLine: 5, placeholder: 'access_code[2]' },
  ],
  solutionCode:
    'access_code = "VIPER7"\nfirst = access_code[0]\nlast = access_code[-1]\nthird = access_code[2]\nprint(first)\nprint(last)\nprint(third)',

  testCases: [
    {
      id: 'tc01',
      description: 'Should extract the first character V',
      expectedOutput: 'V',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should extract the last character 7',
      expectedOutput: 'V\n7',
      hidden: false,
    },
    {
      id: 'tc03',
      description: 'Should extract all three characters correctly',
      expectedOutput: 'V\n7\nP',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Strings are indexed starting at 0. access_code[0] gives the first character.',
    },
    {
      tier: 2,
      text: 'Use negative indices to count from the end: access_code[-1] gives the last character.',
    },
    {
      tier: 3,
      text: 'Solution: first = access_code[0], last = access_code[-1], third = access_code[2]',
    },
  ],

  roomId: 'floor_2_room_01',
  terminalId: 'terminal_02',
  preDialogKey: 'dialog.ch02_02.pre',
  postDialogKey: 'dialog.ch02_02.post',

  conceptsIntroduced: ['string_indexing', 'negative_indexing'],
  conceptsReinforced: ['strings', 'variables', 'print'],
};
