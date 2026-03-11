import type { Challenge } from '@venomous-snake/shared-types';

export const ch02_03_string_slicing: Challenge = {
  id: 'ch02_03_string_slicing',
  titleKey: 'challenges.ch02_03.title',
  descriptionKey: 'challenges.ch02_03.description',
  chapter: 2,
  order: 3,
  difficulty: 'easy',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch02_02_string_indexing'],
  xpReward: 125,
  tags: ['strings', 'slicing'],

  scaffoldedCode:
    '# Slice the intercepted message to extract parts\nmessage = "CLASSIFIED_INTEL"\nprefix = ___\nsuffix = ___\nsegment = ___\nprint(prefix)\nprint(suffix)\nprint(segment)',
  editableRegions: [
    { startLine: 3, endLine: 3, placeholder: 'message[:10]' },
    { startLine: 4, endLine: 4, placeholder: 'message[11:]' },
    { startLine: 5, endLine: 5, placeholder: 'message[3:8]' },
  ],
  solutionCode:
    'message = "CLASSIFIED_INTEL"\nprefix = message[:10]\nsuffix = message[11:]\nsegment = message[3:8]\nprint(prefix)\nprint(suffix)\nprint(segment)',

  testCases: [
    {
      id: 'tc01',
      description: 'Should extract the prefix CLASSIFIED',
      expectedOutput: 'CLASSIFIED\nINTEL\nSSIFI',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should extract the suffix INTEL',
      expectedOutput: 'CLASSIFIED\nINTEL\nSSIFI',
      hidden: false,
    },
    {
      id: 'tc03',
      description: 'Should extract all three slices correctly',
      expectedOutput: 'CLASSIFIED\nINTEL\nSSIFI',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'String slicing uses [start:end]. The start is included, the end is excluded.',
    },
    {
      tier: 2,
      text: 'message[:10] gives the first 10 characters. message[11:] gives everything from index 11 onward.',
    },
    {
      tier: 3,
      text: 'Solution: prefix = message[:10], suffix = message[11:], segment = message[3:8]',
    },
  ],

  roomId: 'floor_2_room_01',
  terminalId: 'terminal_03',
  preDialogKey: 'dialog.ch02_03.pre',
  postDialogKey: 'dialog.ch02_03.post',

  conceptsIntroduced: ['string_slicing', 'slice_notation'],
  conceptsReinforced: ['string_indexing', 'strings', 'print'],
};
