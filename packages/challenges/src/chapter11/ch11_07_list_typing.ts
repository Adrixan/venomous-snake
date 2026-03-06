import type { Challenge } from '@venomous-snake/shared-types';

export const ch11_07_list_typing: Challenge = {
  id: 'ch11_07_list_typing',
  titleKey: 'challenges.ch11_07.title',
  descriptionKey: 'challenges.ch11_07.description',
  chapter: 11,
  order: 7,
  difficulty: 'hard',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch11_06_constants_enums'],
  xpReward: 255,
  tags: ['typing', 'generics', 'optional'],
  scaffoldedCode:
    'from typing import List, Dict, Optional\n\ndef process_agents(agents: ___) -> ___:\n    return {agent: len(agent) for agent in agents}\n\ndef find_agent(agents: ___, name: ___) -> ___:\n    for agent in agents:\n        if agent.lower() == name.lower():\n            return agent\n    return None\n\nteam = ["Snake", "Viper", "Ghost"]\nprint(process_agents(team))\nprint(find_agent(team, "viper"))\nprint(find_agent(team, "wolf"))',
  solutionCode:
    'from typing import List, Dict, Optional\n\ndef process_agents(agents: List[str]) -> Dict[str, int]:\n    return {agent: len(agent) for agent in agents}\n\ndef find_agent(agents: List[str], name: str) -> Optional[str]:\n    for agent in agents:\n        if agent.lower() == name.lower():\n            return agent\n    return None\n\nteam = ["Snake", "Viper", "Ghost"]\nprint(process_agents(team))\nprint(find_agent(team, "viper"))\nprint(find_agent(team, "wolf"))',
  testCases: [
    {
      id: 'tc01',
      description: 'Should process and find agents',
      expectedOutput: '{\'Snake\': 5, \'Viper\': 5, \'Ghost\': 5}\nViper\nNone',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use generic types correctly',
      expectedOutput: '{\'Snake\': 5, \'Viper\': 5, \'Ghost\': 5}\nViper\nNone',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'List[str] is a list of strings. Dict[str, int] is a dict with str keys and int values.' },
    { tier: 2 as const, text: 'Optional[str] means the function can return str or None.' },
    { tier: 3 as const, text: 'Solution: List[str], Dict[str, int], Optional[str]' },
  ],
  roomId: 'floor_11_room_01',
  terminalId: 'terminal_07',
  preDialogKey: 'dialog.ch11_07.pre',
  postDialogKey: 'dialog.ch11_07.post',
  conceptsIntroduced: ['generic_types', 'Optional_type', 'typing_module'],
  conceptsReinforced: ['type_hints', 'dict_comprehension'],
};
