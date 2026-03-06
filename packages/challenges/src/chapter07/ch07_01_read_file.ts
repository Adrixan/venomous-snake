import type { Challenge } from '@venomous-snake/shared-types';

export const ch07_01_read_file: Challenge = {
  id: 'ch07_01_read_file',
  titleKey: 'challenges.ch07_01.title',
  descriptionKey: 'challenges.ch07_01.description',
  chapter: 7,
  order: 1,
  difficulty: 'easy',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch06_10_combining_collections'],
  xpReward: 140,
  tags: ['file-io', 'io-module'],
  scaffoldedCode:
    'import io\nfile_data = "CLASSIFIED: Operation Cobra\\nTarget: Nexus Tower\\nStatus: Active"\nf = io.StringIO(___)\ncontent = ___\nprint(content)',
  editableRegions: [
    { startLine: 3, endLine: 4, placeholder: 'file_data / f.read()' },
  ],
  solutionCode:
    'import io\nfile_data = "CLASSIFIED: Operation Cobra\\nTarget: Nexus Tower\\nStatus: Active"\nf = io.StringIO(file_data)\ncontent = f.read()\nprint(content)',
  testCases: [
    {
      id: 'tc01',
      description: 'Should print file content',
      expectedOutput: 'CLASSIFIED: Operation Cobra\nTarget: Nexus Tower\nStatus: Active',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use io.StringIO to read data',
      expectedOutput: 'CLASSIFIED: Operation Cobra\nTarget: Nexus Tower\nStatus: Active',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'io.StringIO creates a file-like object from a string. Pass the data variable to it.' },
    { tier: 2 as const, text: 'Use f.read() to read the entire content of the file-like object.' },
    { tier: 3 as const, text: 'Solution: f = io.StringIO(file_data) and content = f.read()' },
  ],
  roomId: 'floor_7_room_01',
  terminalId: 'terminal_01',
  preDialogKey: 'dialog.ch07_01.pre',
  postDialogKey: 'dialog.ch07_01.post',
  conceptsIntroduced: ['io_stringio', 'file_read'],
  conceptsReinforced: ['import', 'print', 'strings'],
};
