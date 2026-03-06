import type { Challenge } from '@venomous-snake/shared-types';

export const ch07_03_file_line_processing: Challenge = {
  id: 'ch07_03_file_line_processing',
  titleKey: 'challenges.ch07_03.title',
  descriptionKey: 'challenges.ch07_03.description',
  chapter: 7,
  order: 3,
  difficulty: 'easy',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch07_02_write_file'],
  xpReward: 150,
  tags: ['file-io', 'string-processing', 'list-comprehension'],
  scaffoldedCode:
    'import io\nraw = "  Alpha Team  \\n  Bravo Team  \\n\\n  Charlie Team  \\n  "\nf = io.StringIO(raw)\nlines = [___ for line in f.readlines() if ___]\nfor line in lines:\n    print(line)',
  solutionCode:
    'import io\nraw = "  Alpha Team  \\n  Bravo Team  \\n\\n  Charlie Team  \\n  "\nf = io.StringIO(raw)\nlines = [line.strip() for line in f.readlines() if line.strip()]\nfor line in lines:\n    print(line)',
  testCases: [
    {
      id: 'tc01',
      description: 'Should print cleaned lines',
      expectedOutput: 'Alpha Team\nBravo Team\nCharlie Team',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should strip whitespace and filter empty lines',
      expectedOutput: 'Alpha Team\nBravo Team\nCharlie Team',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Use .strip() to remove leading and trailing whitespace from each line.' },
    { tier: 2 as const, text: 'The if condition should filter out lines that are empty after stripping.' },
    { tier: 3 as const, text: 'Solution: [line.strip() for line in f.readlines() if line.strip()]' },
  ],
  roomId: 'floor_7_room_01',
  terminalId: 'terminal_03',
  preDialogKey: 'dialog.ch07_03.pre',
  postDialogKey: 'dialog.ch07_03.post',
  conceptsIntroduced: ['readlines', 'strip', 'line_processing'],
  conceptsReinforced: ['io_stringio', 'list_comprehension', 'for_loop'],
};
