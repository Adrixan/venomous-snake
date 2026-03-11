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
  tags: ['documentation', 'comments', 'best-practices'],
  scaffoldedCode:
    '# Function: analyze_threat\n# ___\n# Args: threat_level (___), location (___)\n# Returns: ___\ndef analyze_threat(threat_level, location):\n    # Analyze a security threat and return a response protocol\n    if threat_level >= 8:\n        return f"CRITICAL: Deploy all units to {location}"\n    elif threat_level >= 5:\n        return f"WARNING: Monitor {location} closely"\n    else:\n        return f"LOW: Log {location} incident"\n\nprint(analyze_threat(9, "Server Room"))\nprint(analyze_threat(4, "Lobby"))',
  editableRegions: [
    { startLine: 2, endLine: 4, placeholder: 'Describe the function, its parameters, and return value' },
  ],
  solutionCode:
    '# Function: analyze_threat\n# Analyzes security threats and returns response protocols\n# Args: threat_level (int 1-10), location (string)\n# Returns: string with recommended response protocol\ndef analyze_threat(threat_level, location):\n    # Analyze a security threat and return a response protocol\n    if threat_level >= 8:\n        return f"CRITICAL: Deploy all units to {location}"\n    elif threat_level >= 5:\n        return f"WARNING: Monitor {location} closely"\n    else:\n        return f"LOW: Log {location} incident"\n\nprint(analyze_threat(9, "Server Room"))\nprint(analyze_threat(4, "Lobby"))',
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
    { tier: 1 as const, text: 'Good documentation describes what a function does, its parameters, and return value.' },
    { tier: 2 as const, text: 'Use comments to document: purpose, args with types, and return type.' },
    { tier: 3 as const, text: 'Fill in descriptions: threat_level is an int (1-10), location is a string, returns a response string.' },
  ],
  roomId: 'floor_11_room_01',
  terminalId: 'terminal_05',
  preDialogKey: 'dialog.ch11_05.pre',
  postDialogKey: 'dialog.ch11_05.post',
  conceptsIntroduced: ['documentation_comments', 'documentation_conventions'],
  conceptsReinforced: ['function_definition', 'if_elif_else'],
};
