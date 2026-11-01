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
  tags: ['resource-management', 'try-finally', 'io'],
  scaffoldedCode:
    'data = "Secure transmission received\\nDecrypting payload..."\nlines = data.split("\\n")\ntry:\n    for line in ___:\n        print(___)\nfinally:\n    print("Channel closed")',
  editableRegions: [
    { startLine: 4, endLine: 4, placeholder: 'lines' },
    { startLine: 5, endLine: 5, placeholder: 'line' },
  ],
  solutionCode:
    'data = "Secure transmission received\\nDecrypting payload..."\nlines = data.split("\\n")\ntry:\n    for line in lines:\n        print(line)\nfinally:\n    print("Channel closed")',
  testCases: [
    {
      id: 'tc01',
      description: 'Should print lines and close the channel',
      expectedOutput: 'Secure transmission received\nDecrypting payload...\nChannel closed',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should still work when the data changes',
      setup: "data = 'Tfdvsf usbotnjttjpo sfdfjwfe\\nEfdszqujoh qbzmpbe...'",
      expectedOutput: 'Tfdvsf usbotnjttjpo sfdfjwfe\nEfdszqujoh qbzmpbe...\nChannel closed\n',
      hidden: true,
    },
  ],
  hints: [
    {
      tier: 1 as const,
      text: 'try/finally ensures cleanup code runs even if an error occurs. Put resource usage in try, cleanup in finally.',
    },
    {
      tier: 2 as const,
      text: 'Use split("\\n") to break a string into lines. Loop with for line in lines.',
    },
    {
      tier: 3 as const,
      text: 'Solution: lines = data.split("\\n"), try/finally loop, print "Channel closed" in finally.',
    },
  ],
  preDialogKey: 'dialog.ch07_06.pre',
  postDialogKey: 'dialog.ch07_06.post',
  conceptsIntroduced: ['try_finally', 'resource_management'],
  conceptsReinforced: ['io_stringio', 'for_loop', 'strip'],
};
