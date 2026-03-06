import type { Challenge } from '@venomous-snake/shared-types';

export const ch07_06_with_statement: Challenge = {
  id: 'ch07_06_with_statement',
  titleKey: 'challenges.ch07_06.title',
  descriptionKey: 'challenges.ch07_06.description',
  chapter: 7,
  order: 6,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch07_05_string_split_join'],
  xpReward: 160,
  tags: ['context-manager', 'with-statement', 'io'],
  scaffoldedCode:
    'import io\ndata = "Secure transmission received\\nDecrypting payload..."\nwith io.StringIO(___) as f:\n    for line in f:\n        print(___)',
  solutionCode:
    'import io\ndata = "Secure transmission received\\nDecrypting payload..."\nwith io.StringIO(data) as f:\n    for line in f:\n        print(line.strip())',
  testCases: [
    {
      id: 'tc01',
      description: 'Should print lines using context manager',
      expectedOutput: 'Secure transmission received\nDecrypting payload...',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use with statement for resource management',
      expectedOutput: 'Secure transmission received\nDecrypting payload...',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'The with statement ensures resources are properly managed. Pass the data variable to StringIO.' },
    { tier: 2 as const, text: 'Use line.strip() to remove trailing newline characters from each line.' },
    { tier: 3 as const, text: 'Solution: with io.StringIO(data) as f, then print(line.strip())' },
  ],
  roomId: 'floor_7_room_01',
  terminalId: 'terminal_06',
  preDialogKey: 'dialog.ch07_06.pre',
  postDialogKey: 'dialog.ch07_06.post',
  conceptsIntroduced: ['with_statement', 'context_manager'],
  conceptsReinforced: ['io_stringio', 'for_loop', 'strip'],
};
