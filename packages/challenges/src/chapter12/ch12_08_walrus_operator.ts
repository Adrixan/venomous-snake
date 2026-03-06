import type { Challenge } from '@venomous-snake/shared-types';

export const ch12_08_walrus_operator: Challenge = {
  id: 'ch12_08_walrus_operator',
  titleKey: 'challenges.ch12_08.title',
  descriptionKey: 'challenges.ch12_08.description',
  chapter: 12,
  order: 8,
  difficulty: 'hard',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch12_07_pattern_matching'],
  xpReward: 300,
  tags: ['walrus-operator', 'assignment-expression'],
  scaffoldedCode:
    'import re\n\nlogs = [\n    "ERROR 404: Target not found",\n    "INFO: Connection stable",\n    "ERROR 500: System failure",\n    "WARNING: Low signal",\n    "ERROR 403: Access denied",\n]\n\nerrors = [___ for log in logs if (match := re.search(___, log))]\nprint(errors)\nprint(f"Total errors: {len(errors)}")',
  solutionCode:
    'import re\n\nlogs = [\n    "ERROR 404: Target not found",\n    "INFO: Connection stable",\n    "ERROR 500: System failure",\n    "WARNING: Low signal",\n    "ERROR 403: Access denied",\n]\n\nerrors = [match.group() for log in logs if (match := re.search(r\'ERROR \\d+\', log))]\nprint(errors)\nprint(f"Total errors: {len(errors)}")',
  testCases: [
    {
      id: 'tc01',
      description: 'Should extract errors with walrus operator',
      expectedOutput: '[\'ERROR 404\', \'ERROR 500\', \'ERROR 403\']\nTotal errors: 3',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use := in list comprehension',
      expectedOutput: '[\'ERROR 404\', \'ERROR 500\', \'ERROR 403\']\nTotal errors: 3',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: ':= (walrus operator) assigns and returns a value in one expression.' },
    { tier: 2 as const, text: 'if (match := re.search(...)) assigns the match result and checks if it is truthy.' },
    { tier: 3 as const, text: 'Solution: match.group() for the value, r\'ERROR \\d+\' for the pattern' },
  ],
  roomId: 'floor_12_room_01',
  terminalId: 'terminal_08',
  preDialogKey: 'dialog.ch12_08.pre',
  postDialogKey: 'dialog.ch12_08.post',
  conceptsIntroduced: ['walrus_operator', 'assignment_expression'],
  conceptsReinforced: ['regular_expressions', 'list_comprehension'],
};
