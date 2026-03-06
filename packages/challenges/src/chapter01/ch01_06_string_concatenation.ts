import type { Challenge } from '@venomous-snake/shared-types';

export const ch01_06_string_concatenation: Challenge = {
  id: 'ch01_06_string_concatenation',
  titleKey: 'challenges.ch01_06.title',
  descriptionKey: 'challenges.ch01_06.description',
  chapter: 1,
  order: 6,
  difficulty: 'easy',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch01_04_string_types'],
  xpReward: 100,
  tags: ['strings', 'concatenation'],

  scaffoldedCode:
    '# Build a full name from separate parts\nfirst_name = "Aleksa"\nlast_name = "Volkov"\nfull_name = ___\nprint(full_name)',
  editableRegions: [{ startLine: 4, endLine: 4, placeholder: 'first_name + " " + last_name' }],
  solutionCode:
    'first_name = "Aleksa"\nlast_name = "Volkov"\nfull_name = first_name + " " + last_name\nprint(full_name)',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print "Aleksa Volkov"',
      expectedOutput: 'Aleksa Volkov',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should concatenate with a space between names',
      expectedOutput: 'Aleksa Volkov',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'The + operator can join strings together. This is called concatenation.',
    },
    {
      tier: 2,
      text: 'Don\'t forget the space! Use + " " + between the names.',
    },
    {
      tier: 3,
      text: 'Solution: full_name = first_name + " " + last_name',
    },
  ],

  roomId: 'lobby_terminal_room',
  terminalId: 'terminal_06',
  preDialogKey: 'dialog.ch01_06.pre',
  postDialogKey: 'dialog.ch01_06.post',

  conceptsIntroduced: ['string_concatenation'],
  conceptsReinforced: ['strings', 'variables', 'print'],
};
