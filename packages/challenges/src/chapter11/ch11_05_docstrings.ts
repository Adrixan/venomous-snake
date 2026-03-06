import type { Challenge } from '@venomous-snake/shared-types';

export const ch11_05_docstrings: Challenge = {
  id: 'ch11_05_docstrings',
  titleKey: 'challenges.ch11_05.title',
  descriptionKey: 'challenges.ch11_05.description',
  chapter: 11,
  order: 5,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch11_04_writing_simple_tests'],
  xpReward: 240,
  tags: ['docstrings', 'documentation', 'best-practices'],
  scaffoldedCode:
    'def analyze_threat(threat_level: int, location: str) -> str:\n    """\n    ___\n    \n    Args:\n        threat_level: ___\n        location: ___\n    \n    Returns:\n        ___\n    """\n    if threat_level >= 8:\n        return f"CRITICAL: Deploy all units to {location}"\n    elif threat_level >= 5:\n        return f"WARNING: Monitor {location} closely"\n    else:\n        return f"LOW: Log {location} incident"\n\nprint(analyze_threat(9, "Server Room"))\nprint(analyze_threat(4, "Lobby"))',
  solutionCode:
    'def analyze_threat(threat_level: int, location: str) -> str:\n    """\n    Analyze a security threat and return a response protocol.\n    \n    Args:\n        threat_level: Integer from 1-10 indicating threat severity.\n        location: String describing threat location.\n    \n    Returns:\n        A string describing the recommended response protocol.\n    """\n    if threat_level >= 8:\n        return f"CRITICAL: Deploy all units to {location}"\n    elif threat_level >= 5:\n        return f"WARNING: Monitor {location} closely"\n    else:\n        return f"LOW: Log {location} incident"\n\nprint(analyze_threat(9, "Server Room"))\nprint(analyze_threat(4, "Lobby"))',
  testCases: [
    {
      id: 'tc01',
      description: 'Should return correct threat response',
      expectedOutput: 'CRITICAL: Deploy all units to Server Room\nLOW: Log Lobby incident',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should handle different threat levels',
      expectedOutput: 'CRITICAL: Deploy all units to Server Room\nLOW: Log Lobby incident',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Docstrings go right after the function definition, inside triple quotes.' },
    { tier: 2 as const, text: 'The Args section lists parameters. The Returns section describes the return value.' },
    { tier: 3 as const, text: 'Fill in the descriptions based on what the function does.' },
  ],
  roomId: 'floor_11_room_01',
  terminalId: 'terminal_05',
  preDialogKey: 'dialog.ch11_05.pre',
  postDialogKey: 'dialog.ch11_05.post',
  conceptsIntroduced: ['docstrings', 'documentation_conventions'],
  conceptsReinforced: ['type_hints', 'if_elif_else'],
};
