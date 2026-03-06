import type { Challenge } from '@venomous-snake/shared-types';

export const ch10_05_inheritance: Challenge = {
  id: 'ch10_05_inheritance',
  titleKey: 'challenges.ch10_05.title',
  descriptionKey: 'challenges.ch10_05.description',
  chapter: 10,
  order: 5,
  difficulty: 'medium',
  scaffoldingLevel: 'partial',
  prerequisites: ['ch10_04_str_repr'],
  xpReward: 225,
  tags: ['oop', 'inheritance', 'super'],
  scaffoldedCode:
    'class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    \n    def introduce(self):\n        return f"Name: {self.name}, Age: {self.age}"\n\nclass Agent(___):\n    def __init__(self, name, age, codename):\n        ___.__init__(name, age)\n        self.codename = codename\n    \n    def introduce(self):\n        base = ___\n        return f"{base}, Codename: {self.codename}"\n\nagent = Agent("Alex", 30, "VIPER")\nprint(agent.introduce())',
  solutionCode:
    'class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    \n    def introduce(self):\n        return f"Name: {self.name}, Age: {self.age}"\n\nclass Agent(Person):\n    def __init__(self, name, age, codename):\n        super().__init__(name, age)\n        self.codename = codename\n    \n    def introduce(self):\n        base = super().introduce()\n        return f"{base}, Codename: {self.codename}"\n\nagent = Agent("Alex", 30, "VIPER")\nprint(agent.introduce())',
  testCases: [
    {
      id: 'tc01',
      description: 'Should inherit and extend behavior',
      expectedOutput: 'Name: Alex, Age: 30, Codename: VIPER',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should use super() to call parent methods',
      expectedOutput: 'Name: Alex, Age: 30, Codename: VIPER',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'class Agent(Person): makes Agent inherit from Person. super() calls the parent class.' },
    { tier: 2 as const, text: 'super().__init__(name, age) calls Person.__init__. super().introduce() calls Person.introduce.' },
    { tier: 3 as const, text: 'Solution: class Agent(Person):, super().__init__(name, age), base = super().introduce()' },
  ],
  roomId: 'floor_10_room_01',
  terminalId: 'terminal_05',
  preDialogKey: 'dialog.ch10_05.pre',
  postDialogKey: 'dialog.ch10_05.post',
  conceptsIntroduced: ['inheritance', 'super_function', 'method_override'],
  conceptsReinforced: ['class_definition', 'init_constructor'],
};
