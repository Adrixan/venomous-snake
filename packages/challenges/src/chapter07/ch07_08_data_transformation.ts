import type { Challenge } from '@venomous-snake/shared-types';

export const ch07_08_data_transformation: Challenge = {
  id: 'ch07_08_data_transformation',
  titleKey: 'challenges.ch07_08.title',
  descriptionKey: 'challenges.ch07_08.description',
  chapter: 7,
  order: 8,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch07_07_json_parsing'],
  xpReward: 180,
  tags: ['json', 'list-comprehension', 'transformation'],
  scaffoldedCode:
    'import io, json\nraw = \'{"targets": ["nexus", "apex", "core"]}\'\ndata = json.loads(___)\ntargets = data[___]\nresult = [___ for t in targets]\nprint(result)',
  solutionCode:
    'import io, json\nraw = \'{"targets": ["nexus", "apex", "core"]}\'\ndata = json.loads(raw)\ntargets = data["targets"]\nresult = [t.upper() for t in targets]\nprint(result)',
  testCases: [
    {
      id: 'tc01',
      description: 'Should transform targets to uppercase',
      expectedOutput: '[\'NEXUS\', \'APEX\', \'CORE\']',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should parse JSON and use list comprehension',
      expectedOutput: '[\'NEXUS\', \'APEX\', \'CORE\']',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Parse the JSON string first, then access the "targets" key.' },
    { tier: 2 as const, text: 'Use a list comprehension with .upper() to transform each target.' },
    { tier: 3 as const, text: 'Solution: data = json.loads(raw), targets = data["targets"], result = [t.upper() for t in targets]' },
  ],
  roomId: 'floor_7_room_01',
  terminalId: 'terminal_08',
  preDialogKey: 'dialog.ch07_08.pre',
  postDialogKey: 'dialog.ch07_08.post',
  conceptsIntroduced: ['data_transformation', 'json_nested_access'],
  conceptsReinforced: ['json_loads', 'list_comprehension', 'string_methods'],
};
