import type { Challenge } from '@venomous-snake/shared-types';

export const ch10_09_composition: Challenge = {
  id: 'ch10_09_composition',
  titleKey: 'challenges.ch10_09.title',
  descriptionKey: 'challenges.ch10_09.description',
  chapter: 10,
  order: 9,
  difficulty: 'hard',
  scaffoldingLevel: 'open',
  prerequisites: ['ch10_08_class_static_methods'],
  xpReward: 245,
  tags: ['oop', 'composition', 'has-a'],
  scaffoldedCode:
    '# Create Floor class with number and name\n# Create Building class that contains Floor objects\n# Building should have add_floor() and list_floors() methods\n',
  solutionCode:
    'class Floor:\n    def __init__(self, number, name):\n        self.number = number\n        self.name = name\n    \n    def __str__(self):\n        return f"Floor {self.number}: {self.name}"\n\nclass Building:\n    def __init__(self, name):\n        self.name = name\n        self.floors = []\n    \n    def add_floor(self, floor):\n        self.floors.append(floor)\n    \n    def list_floors(self):\n        for floor in self.floors:\n            print(floor)\n\nnexus = Building("Nexus Tower")\nnexus.add_floor(Floor(1, "Lobby"))\nnexus.add_floor(Floor(7, "Intel"))\nnexus.add_floor(Floor(12, "Executive"))\nnexus.list_floors()',
  testCases: [
    {
      id: 'tc01',
      description: 'Should display all floors',
      expectedOutput: 'Floor 1: Lobby\nFloor 7: Intel\nFloor 12: Executive',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should compose Building from Floor objects',
      expectedOutput: 'Floor 1: Lobby\nFloor 7: Intel\nFloor 12: Executive',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Composition means one class contains instances of another. Building has a list of Floors.' },
    { tier: 2 as const, text: 'Floor needs __str__ for display. Building uses self.floors = [] and append().' },
    { tier: 3 as const, text: 'Solution: Building.add_floor appends to self.floors. list_floors prints each floor.' },
  ],
  roomId: 'floor_10_room_01',
  terminalId: 'terminal_09',
  preDialogKey: 'dialog.ch10_09.pre',
  postDialogKey: 'dialog.ch10_09.post',
  conceptsIntroduced: ['composition', 'has_a_relationship'],
  conceptsReinforced: ['class_definition', 'dunder_str', 'list_methods'],
};
