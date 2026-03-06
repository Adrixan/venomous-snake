import type { Challenge } from '@venomous-snake/shared-types';

export const ch09_09_regular_expressions: Challenge = {
  id: 'ch09_09_regular_expressions',
  titleKey: 'challenges.ch09_09.title',
  descriptionKey: 'challenges.ch09_09.description',
  chapter: 9,
  order: 9,
  difficulty: 'hard',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch09_08_string_formatting_advanced'],
  xpReward: 215,
  tags: ['regex', 're-module', 'pattern-matching'],
  scaffoldedCode:
    'import re\nlog = "ERROR: Agent AGT-007 breached at 14:32. Agent AGT-012 escaped at 15:47."\nagent_ids = re.findall(___, log)\nprint(agent_ids)\ntimes = re.findall(___, log)\nprint(times)',
  solutionCode:
    'import re\nlog = "ERROR: Agent AGT-007 breached at 14:32. Agent AGT-012 escaped at 15:47."\nagent_ids = re.findall(r\'AGT-\\d+\', log)\nprint(agent_ids)\ntimes = re.findall(r\'\\d{2}:\\d{2}\', log)\nprint(times)',
  testCases: [
    {
      id: 'tc01',
      description: 'Should extract agent IDs and times',
      expectedOutput: '[\'AGT-007\', \'AGT-012\']\n[\'14:32\', \'15:47\']',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use regex patterns with re.findall',
      expectedOutput: '[\'AGT-007\', \'AGT-012\']\n[\'14:32\', \'15:47\']',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Use r\'AGT-\\d+\' to match AGT- followed by digits. \\d matches any digit.' },
    { tier: 2 as const, text: 're.findall() returns all matches of a pattern in a string.' },
    { tier: 3 as const, text: 'Solution: re.findall(r\'AGT-\\d+\', log) and re.findall(r\'\\d{2}:\\d{2}\', log)' },
  ],
  roomId: 'floor_9_room_01',
  terminalId: 'terminal_09',
  preDialogKey: 'dialog.ch09_09.pre',
  postDialogKey: 'dialog.ch09_09.post',
  conceptsIntroduced: ['regular_expressions', 're_findall', 'regex_patterns'],
  conceptsReinforced: ['import_module', 'strings'],
};
