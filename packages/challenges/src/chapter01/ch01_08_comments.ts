import type { Challenge } from '@venomous-snake/shared-types';

export const ch01_08_comments: Challenge = {
  id: 'ch01_08_comments',
  titleKey: 'challenges.ch01_08.title',
  descriptionKey: 'challenges.ch01_08.description',
  chapter: 1,
  order: 8,
  difficulty: 'beginner',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch01_02_variables'],
  xpReward: 50,
  tags: ['comments', 'documentation'],

  scaffoldedCode:
    '# Add a comment above each line of code explaining what it does\n___\nclearance_level = 5\n___\ndepartment = "Infiltration"\n___\nprint("Clearance:", clearance_level, "| Dept:", department)',
  editableRegions: [
    { startLine: 2, endLine: 2, placeholder: "# Store the operative's clearance level" },
    { startLine: 4, endLine: 4, placeholder: "# Store the operative's department" },
    { startLine: 6, endLine: 6, placeholder: '# Print a status report' },
  ],
  solutionCode:
    '# Store the operative\'s clearance level\nclearance_level = 5\n# Store the operative\'s department\ndepartment = "Infiltration"\n# Print a status report\nprint("Clearance:", clearance_level, "| Dept:", department)',

  testCases: [
    {
      id: 'tc01',
      description: 'Should print the status report',
      expectedOutput: 'Clearance: 5 | Dept: Infiltration',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Comments should not affect output',
      expectedOutput: 'Clearance: 5 | Dept: Infiltration',
      hidden: true,
    },
  ],

  hints: [
    {
      tier: 1,
      text: 'Comments start with # and are ignored by Python. They explain code to humans.',
    },
    {
      tier: 2,
      text: 'Write something like: # Store the clearance level — the comment describes the next line.',
    },
    {
      tier: 3,
      text: 'Any comment starting with # will work. The code output stays the same regardless.',
    },
  ],

  roomId: 'lobby_terminal_room',
  terminalId: 'terminal_08',
  preDialogKey: 'dialog.ch01_08.pre',
  postDialogKey: 'dialog.ch01_08.post',

  conceptsIntroduced: ['comments', 'code_documentation'],
  conceptsReinforced: ['variables', 'print', 'strings'],
};
