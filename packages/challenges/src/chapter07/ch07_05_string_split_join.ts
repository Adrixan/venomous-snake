import type { Challenge } from '@venomous-snake/shared-types';

export const ch07_05_string_split_join: Challenge = {
  id: 'ch07_05_string_split_join',
  titleKey: 'challenges.ch07_05.title',
  descriptionKey: 'challenges.ch07_05.description',
  chapter: 7,
  order: 5,
  difficulty: 'medium',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch07_04_csv_parsing'],
  xpReward: 155,
  tags: ['string-processing', 'split', 'join'],
  scaffoldedCode:
    'message = "ALPHA:BRAVO:CHARLIE:DELTA"\nparts = message.split(___)\nprint(parts)\nresult = ___.join(parts)\nprint(result)',
  solutionCode:
    'message = "ALPHA:BRAVO:CHARLIE:DELTA"\nparts = message.split(":")\nprint(parts)\nresult = " | ".join(parts)\nprint(result)',
  testCases: [
    {
      id: 'tc01',
      description: 'Should split and rejoin message',
      expectedOutput: '[\'ALPHA\', \'BRAVO\', \'CHARLIE\', \'DELTA\']\nALPHA | BRAVO | CHARLIE | DELTA',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use correct delimiters',
      expectedOutput: '[\'ALPHA\', \'BRAVO\', \'CHARLIE\', \'DELTA\']\nALPHA | BRAVO | CHARLIE | DELTA',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Use .split(":") to split on colons, and " | ".join() to rejoin with pipes.' },
    { tier: 2 as const, text: 'The .join() method is called on the separator string: separator.join(list).' },
    { tier: 3 as const, text: 'Solution: parts = message.split(":") and result = " | ".join(parts)' },
  ],
  roomId: 'floor_7_room_01',
  terminalId: 'terminal_05',
  preDialogKey: 'dialog.ch07_05.pre',
  postDialogKey: 'dialog.ch07_05.post',
  conceptsIntroduced: ['string_join', 'delimiter_processing'],
  conceptsReinforced: ['split_delimiter', 'print'],
};
