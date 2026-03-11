import type { Challenge } from '@venomous-snake/shared-types';

export const ch11_08_putting_it_together: Challenge = {
  id: 'ch11_08_putting_it_together',
  titleKey: 'challenges.ch11_08.title',
  descriptionKey: 'challenges.ch11_08.description',
  chapter: 11,
  order: 8,
  difficulty: 'hard',
  scaffoldingLevel: 'open',
  prerequisites: ['ch11_07_list_typing'],
  xpReward: 275,
  tags: ['classes', 'filtering', 'comprehensive'],
  scaffoldedCode:
    '# Combine classes, filtering, and string formatting\n# Create a Mission class with name, priority, status\n# Write a filter_missions function and print high-priority active missions\n',

  solutionCode:
    'class Mission:\n    def __init__(self, name, priority, status="active"):\n        self.name = name\n        self.priority = priority\n        self.status = status\n\n    def __repr__(self):\n        return f"Mission({self.name}, priority={self.priority})"\n\ndef filter_missions(missions, min_priority):\n    return [m for m in missions if m.priority >= min_priority]\n\nmissions = [\n    Mission("Operation Cobra", 9),\n    Mission("Shadow Sweep", 4),\n    Mission("Iron Curtain", 7),\n]\nhigh_priority = filter_missions(missions, 7)\nfor m in high_priority:\n    print(f"{m.name}: priority {m.priority}, {m.status}")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should filter and display missions',
      expectedOutput: 'Operation Cobra: priority 9, active\nIron Curtain: priority 7, active',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should combine classes, filtering, and formatting',
      expectedOutput: 'Operation Cobra: priority 9, active\nIron Curtain: priority 7, active',
      hidden: true,
    },
  ],

  hints: [
    { tier: 1 as const, text: 'Create a Mission class with __init__ and __repr__. Use a default parameter for status.' },
    { tier: 2 as const, text: 'filter_missions uses list comprehension: [m for m in missions if m.priority >= min_priority].' },
    { tier: 3 as const, text: 'Solution: Mission class with name/priority/status, filter with comprehension, print with f-strings' },
  ],

  roomId: 'floor_11_room_01',
  terminalId: 'terminal_08',
  preDialogKey: 'dialog.ch11_08.pre',
  postDialogKey: 'dialog.ch11_08.post',

  conceptsIntroduced: ['professional_python', 'module_design'],
  conceptsReinforced: ['class_definition', 'list_comprehension', 'default_parameters'],
};
