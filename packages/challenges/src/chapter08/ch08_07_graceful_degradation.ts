import type { Challenge } from '@venomous-snake/shared-types';

export const ch08_07_graceful_degradation: Challenge = {
  id: 'ch08_07_graceful_degradation',
  titleKey: 'challenges.ch08_07.title',
  descriptionKey: 'challenges.ch08_07.description',
  chapter: 8,
  order: 7,
  difficulty: 'medium',
  scaffoldingLevel: 'open',
  prerequisites: ['ch08_06_input_validation_with_errors'],
  xpReward: 195,
  tags: ['error-handling', 'defaults', 'graceful-degradation'],
  scaffoldedCode:
    '# Write get_intel(database, key, default="UNKNOWN") that:\n# - Returns database[key] if key exists\n# - Returns default if key is missing (catch KeyError)\n# Test with a sample database dictionary\n',
  solutionCode:
    'def get_intel(database, key, default="UNKNOWN"):\n    try:\n        if key not in database:\n            raise KeyError(key)\n        return database[key]\n    except KeyError:\n        return default\n\ndb = {"location": "Nexus Tower", "contact": "Ghost"}\nprint(get_intel(db, "location"))\nprint(get_intel(db, "password"))\nprint(get_intel(db, "contact", "NO_CONTACT"))',
  testCases: [
    {
      id: 'tc01',
      description: 'Should return values and defaults correctly',
      expectedOutput: 'Nexus Tower\nUNKNOWN\nGhost',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use default when key is missing',
      expectedOutput: 'Nexus Tower\nUNKNOWN\nGhost',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Use a try/except block to catch KeyError when a key is missing.' },
    { tier: 2 as const, text: 'The default parameter provides a fallback value when the key is not found.' },
    { tier: 3 as const, text: 'Solution: try: return database[key] except KeyError: return default' },
  ],
  roomId: 'floor_8_room_01',
  terminalId: 'terminal_07',
  preDialogKey: 'dialog.ch08_07.pre',
  postDialogKey: 'dialog.ch08_07.post',
  conceptsIntroduced: ['graceful_degradation', 'default_parameters_errorhandling'],
  conceptsReinforced: ['try_except', 'KeyError', 'default_parameters'],
};
