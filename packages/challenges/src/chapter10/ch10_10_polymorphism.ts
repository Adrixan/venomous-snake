import type { Challenge } from '@venomous-snake/shared-types';

export const ch10_10_polymorphism: Challenge = {
  id: 'ch10_10_polymorphism',
  titleKey: 'challenges.ch10_10.title',
  descriptionKey: 'challenges.ch10_10.description',
  chapter: 10,
  order: 10,
  difficulty: 'hard',
  scaffoldingLevel: 'open',
  prerequisites: ['ch10_09_composition'],
  xpReward: 250,
  tags: ['oop', 'polymorphism', 'duck-typing'],
  scaffoldedCode:
    '# Create DroneBot, GuardBot, TurretBot — each with a patrol() method\n# Write run_patrol(bots) that calls patrol() on each bot\n# Each bot type returns a different message\n',
  solutionCode:
    'class DroneBot:\n    def patrol(self):\n        return "Drone: scanning from above"\n\nclass GuardBot:\n    def patrol(self):\n        return "Guard: checking corridors"\n\nclass TurretBot:\n    def patrol(self):\n        return "Turret: monitoring entry points"\n\ndef run_patrol(bots):\n    for bot in bots:\n        print(bot.patrol())\n\nsquad = [DroneBot(), GuardBot(), TurretBot()]\nrun_patrol(squad)',
  testCases: [
    {
      id: 'tc01',
      description: 'Should call patrol on different bot types',
      expectedOutput: 'Drone: scanning from above\nGuard: checking corridors\nTurret: monitoring entry points',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should demonstrate polymorphism via duck typing',
      expectedOutput: 'Drone: scanning from above\nGuard: checking corridors\nTurret: monitoring entry points',
      hidden: true,
    },
  ],
  hints: [
    { tier: 1 as const, text: 'Polymorphism means different classes share the same method name but have different behavior.' },
    { tier: 2 as const, text: 'Python uses duck typing: if it has patrol(), you can call it. No shared base class needed.' },
    { tier: 3 as const, text: 'Solution: Three classes each with patrol() returning different strings. run_patrol iterates and prints.' },
  ],
  roomId: 'floor_10_room_01',
  terminalId: 'terminal_10',
  preDialogKey: 'dialog.ch10_10.pre',
  postDialogKey: 'dialog.ch10_10.post',
  conceptsIntroduced: ['polymorphism', 'duck_typing', 'interface_pattern'],
  conceptsReinforced: ['class_definition', 'instance_methods', 'for_loop'],
};
