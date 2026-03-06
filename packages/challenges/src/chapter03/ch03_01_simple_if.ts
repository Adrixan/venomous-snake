import type { Challenge } from '@venomous-snake/shared-types';

export const ch03_01_simple_if: Challenge = {
  id: 'ch03_01_simple_if',
  titleKey: 'challenges.ch03_01.title',
  descriptionKey: 'challenges.ch03_01.description',
  chapter: 3,
  order: 1,
  difficulty: 'easy',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch02_08_len_and_string_ops'],
  xpReward: 100,
  tags: ['if', 'conditions', 'comparison'],

  scaffoldedCode:
    '# Check if the access code matches the secret code\naccess_code = 1337\nif ___:\n    print("ACCESS GRANTED")',
  editableRegions: [{ startLine: 3, endLine: 3, placeholder: 'access_code == 1337' }],
  solutionCode: 'access_code = 1337\nif access_code == 1337:\n    print("ACCESS GRANTED")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print ACCESS GRANTED when code matches',
      expectedOutput: 'ACCESS GRANTED',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use == for comparison',
      expectedOutput: 'ACCESS GRANTED',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Use == to compare two values. It checks if they are equal.',
    },
    {
      tier: 2,
      text: 'The condition should be: access_code == 1337. Remember: = assigns, == compares.',
    },
    {
      tier: 3,
      text: 'Solution: if access_code == 1337: print("ACCESS GRANTED")',
    },
  ],

  roomId: 'floor_3_room_01',
  terminalId: 'terminal_01',
  preDialogKey: 'dialog.ch03_01.pre',
  postDialogKey: 'dialog.ch03_01.post',

  conceptsIntroduced: ['if_statement', 'equality_operator'],
  conceptsReinforced: ['comparison', 'print'],
};
