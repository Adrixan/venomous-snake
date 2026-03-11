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
  tags: ['regex', 'loop-filter', 'assignment'],
  scaffoldedCode:
    'logs = [\n    "ERROR 404: Target not found",\n    "INFO: Connection stable",\n    "ERROR 500: System failure",\n    "WARNING: Low signal",\n    "ERROR 403: Access denied",\n]\n\nerrors = []\nfor log in logs:\n    if log.startswith(___):\n        parts = log.split(___)\n        errors.append(___)\n\nprint(errors)\nprint(f"Total errors: {len(errors)}")',
  editableRegions: [
    { startLine: 11, endLine: 13, placeholder: '"ERROR", ":", "ERROR " + code' },
  ],
  solutionCode:
    'logs = [\n    "ERROR 404: Target not found",\n    "INFO: Connection stable",\n    "ERROR 500: System failure",\n    "WARNING: Low signal",\n    "ERROR 403: Access denied",\n]\n\nerrors = []\nfor log in logs:\n    if log.startswith("ERROR"):\n        parts = log.split(":")\n        code = parts[0].split(" ")[1]\n        errors.append("ERROR " + code)\n\nprint(errors)\nprint(f"Total errors: {len(errors)}")',
  testCases: [
    {
      id: 'tc01',
      description: 'Should extract errors using regex and loop',
      expectedOutput: '[\'ERROR 404\', \'ERROR 500\', \'ERROR 403\']\nTotal errors: 3',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use re.search with conditional append',
      expectedOutput: '[\'ERROR 404\', \'ERROR 500\', \'ERROR 403\']\nTotal errors: 3',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Use startswith() to check if a log line begins with "ERROR".' },
    { tier: 2 as const, text: 'Split the line on ":" to get the error prefix, then split on " " to extract the error code.' },
    { tier: 3 as const, text: 'Solution: log.startswith("ERROR"), split(":")[0].split(" ")[1] gets the code, "ERROR " + code.' },
  ],
  roomId: 'floor_12_room_01',
  terminalId: 'terminal_08',
  preDialogKey: 'dialog.ch12_08.pre',
  postDialogKey: 'dialog.ch12_08.post',
  conceptsIntroduced: ['regex_search_loop', 'conditional_append'],
  conceptsReinforced: ['regular_expressions', 'for_loop', 'conditionals'],
};
