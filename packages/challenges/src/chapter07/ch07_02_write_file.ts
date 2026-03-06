import type { Challenge } from '@venomous-snake/shared-types';

export const ch07_02_write_file: Challenge = {
  id: 'ch07_02_write_file',
  titleKey: 'challenges.ch07_02.title',
  descriptionKey: 'challenges.ch07_02.description',
  chapter: 7,
  order: 2,
  difficulty: 'easy',
  scaffoldingLevel: 'guided',
  prerequisites: ['ch07_01_read_file'],
  xpReward: 140,
  tags: ['file-io', 'io-module', 'write'],
  scaffoldedCode:
    'import io\nf = io.StringIO()\nf.write(___)\nf.write(___)\nprint(f.getvalue())',
  editableRegions: [
    { startLine: 3, endLine: 4, placeholder: '"Mission log: Entry 1\\n" / "Infiltrated sector 7\\n"' },
  ],
  solutionCode:
    'import io\nf = io.StringIO()\nf.write("Mission log: Entry 1\\n")\nf.write("Infiltrated sector 7\\n")\nprint(f.getvalue())',
  testCases: [
    {
      id: 'tc01',
      description: 'Should write and read back data',
      expectedOutput: 'Mission log: Entry 1\nInfiltrated sector 7\n',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use f.getvalue() to retrieve written content',
      expectedOutput: 'Mission log: Entry 1\nInfiltrated sector 7\n',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'io.StringIO() creates an empty file-like object you can write to.' },
    { tier: 2 as const, text: 'Use f.write("text") to write strings. f.getvalue() returns all written content.' },
    { tier: 3 as const, text: 'Solution: f.write("Mission log: Entry 1\\n") and f.write("Infiltrated sector 7\\n")' },
  ],
  roomId: 'floor_7_room_01',
  terminalId: 'terminal_02',
  preDialogKey: 'dialog.ch07_02.pre',
  postDialogKey: 'dialog.ch07_02.post',
  conceptsIntroduced: ['file_write', 'getvalue'],
  conceptsReinforced: ['io_stringio', 'print'],
};
