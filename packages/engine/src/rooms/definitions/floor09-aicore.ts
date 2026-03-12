import type { Room } from '@venomous-snake/shared-types';

export const floor09Rooms: Room[] = [
  {
    id: 'aicore_antechamber',
    floor: 9,
    nameKey: 'rooms.aicore_antechamber.name',
    descriptionKey: 'rooms.aicore_antechamber.description',
    firstVisitKey: 'rooms.aicore_antechamber.firstVisit',
    connections: [
      {
        direction: 'north',
        targetRoomId: 'aicore_main',
        descriptionKey: 'rooms.aicore_antechamber.connections.north',
        locked: false,
      },
      {
        direction: 'down',
        targetRoomId: 'vault_deepstore',
        descriptionKey: 'rooms.aicore_antechamber.connections.down',
        locked: false,
      },
    ],
    npcs: [
      {
        id: 'cooling_tech_adam',
        nameKey: 'npcs.cooling_tech_adam.name',
        descriptionKey: 'npcs.cooling_tech_adam.description',
        dialogId: 'cooling_tech_adam_intro',
      },
    ],
    items: [],
    terminals: [
      {
        id: 'aicore_terminal_01',
        challengeId: 'ch10_01_simple_class',
        nameKey: 'terminals.aicore_terminal_01.name',
        descriptionKey: 'terminals.aicore_terminal_01.description',
      },
      {
        id: 'aicore_terminal_02',
        challengeId: 'ch10_02_methods',
        nameKey: 'terminals.aicore_terminal_02.name',
        descriptionKey: 'terminals.aicore_terminal_02.description',
      },
      {
        id: 'aicore_terminal_03',
        challengeId: 'ch10_03_init_constructor',
        nameKey: 'terminals.aicore_terminal_03.name',
        descriptionKey: 'terminals.aicore_terminal_03.description',
      },
    ],
  },
  {
    id: 'aicore_main',
    floor: 9,
    nameKey: 'rooms.aicore_main.name',
    descriptionKey: 'rooms.aicore_main.description',
    firstVisitKey: 'rooms.aicore_main.firstVisit',
    connections: [
      {
        direction: 'south',
        targetRoomId: 'aicore_antechamber',
        descriptionKey: 'rooms.aicore_main.connections.south',
        locked: false,
      },
      {
        direction: 'east',
        targetRoomId: 'aicore_neural',
        descriptionKey: 'rooms.aicore_main.connections.east',
        locked: false,
      },
    ],
    npcs: [
      {
        id: 'ai_operator_bella',
        nameKey: 'npcs.ai_operator_bella.name',
        descriptionKey: 'npcs.ai_operator_bella.description',
        dialogId: 'ai_operator_bella_intro',
      },
    ],
    items: [
      {
        id: 'neural_schematic',
        nameKey: 'items.neural_schematic.name',
        descriptionKey: 'items.neural_schematic.description',
        itemType: 'datapad',
      },
    ],
    terminals: [
      {
        id: 'aicore_terminal_04',
        challengeId: 'ch10_04_str_repr',
        nameKey: 'terminals.aicore_terminal_04.name',
        descriptionKey: 'terminals.aicore_terminal_04.description',
      },
      {
        id: 'aicore_terminal_05',
        challengeId: 'ch10_05_inheritance',
        nameKey: 'terminals.aicore_terminal_05.name',
        descriptionKey: 'terminals.aicore_terminal_05.description',
      },
      {
        id: 'aicore_terminal_06',
        challengeId: 'ch10_06_method_override',
        nameKey: 'terminals.aicore_terminal_06.name',
        descriptionKey: 'terminals.aicore_terminal_06.description',
      },
      {
        id: 'aicore_terminal_07',
        challengeId: 'ch10_07_encapsulation',
        nameKey: 'terminals.aicore_terminal_07.name',
        descriptionKey: 'terminals.aicore_terminal_07.description',
      },
    ],
  },
  {
    id: 'aicore_neural',
    floor: 9,
    nameKey: 'rooms.aicore_neural.name',
    descriptionKey: 'rooms.aicore_neural.description',
    firstVisitKey: 'rooms.aicore_neural.firstVisit',
    connections: [
      {
        direction: 'west',
        targetRoomId: 'aicore_main',
        descriptionKey: 'rooms.aicore_neural.connections.west',
        locked: false,
      },
      {
        direction: 'up',
        targetRoomId: 'penthouse_elevator',
        descriptionKey: 'rooms.aicore_neural.connections.up',
        locked: true,
        requiredChallenges: [
          'ch10_01_simple_class',
          'ch10_02_methods',
          'ch10_03_init_constructor',
          'ch10_04_str_repr',
          'ch10_05_inheritance',
          'ch10_06_method_override',
          'ch10_07_encapsulation',
          'ch10_08_class_static_methods',
          'ch10_09_composition',
          'ch10_10_polymorphism',
        ],
      },
    ],
    npcs: [
      {
        id: 'neural_engineer_cole',
        nameKey: 'npcs.neural_engineer_cole.name',
        descriptionKey: 'npcs.neural_engineer_cole.description',
        dialogId: 'neural_engineer_cole_intro',
      },
    ],
    items: [
      {
        id: 'aicore_keycard_l10',
        nameKey: 'items.aicore_keycard_l10.name',
        descriptionKey: 'items.aicore_keycard_l10.description',
        itemType: 'keycard',
      },
    ],
    terminals: [
      {
        id: 'aicore_terminal_08',
        challengeId: 'ch10_08_class_static_methods',
        nameKey: 'terminals.aicore_terminal_08.name',
        descriptionKey: 'terminals.aicore_terminal_08.description',
      },
      {
        id: 'aicore_terminal_09',
        challengeId: 'ch10_09_composition',
        nameKey: 'terminals.aicore_terminal_09.name',
        descriptionKey: 'terminals.aicore_terminal_09.description',
      },
      {
        id: 'aicore_terminal_10',
        challengeId: 'ch10_10_polymorphism',
        nameKey: 'terminals.aicore_terminal_10.name',
        descriptionKey: 'terminals.aicore_terminal_10.description',
      },
    ],
  },
];
