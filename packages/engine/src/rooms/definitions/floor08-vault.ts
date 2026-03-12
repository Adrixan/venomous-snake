import type { Room } from '@venomous-snake/shared-types';

export const floor08Rooms: Room[] = [
  {
    id: 'vault_entrance',
    floor: 8,
    nameKey: 'rooms.vault_entrance.name',
    descriptionKey: 'rooms.vault_entrance.description',
    firstVisitKey: 'rooms.vault_entrance.firstVisit',
    connections: [
      {
        direction: 'north',
        targetRoomId: 'vault_main',
        descriptionKey: 'rooms.vault_entrance.connections.north',
        locked: true,
        requiredChallenges: [
          'ch09_01_importing_modules',
          'ch09_02_from_import',
          'ch09_03_lambda_functions',
        ],
      },
      {
        direction: 'down',
        targetRoomId: 'manufacturing_warehouse',
        descriptionKey: 'rooms.vault_entrance.connections.down',
        locked: false,
      },
    ],
    npcs: [
      {
        id: 'vault_guard_xavier',
        nameKey: 'npcs.vault_guard_xavier.name',
        descriptionKey: 'npcs.vault_guard_xavier.description',
        dialogId: 'vault_guard_xavier_intro',
      },
    ],
    items: [],
    terminals: [
      {
        id: 'vault_terminal_01',
        challengeId: 'ch09_01_importing_modules',
        nameKey: 'terminals.vault_terminal_01.name',
        descriptionKey: 'terminals.vault_terminal_01.description',
      },
      {
        id: 'vault_terminal_02',
        challengeId: 'ch09_02_from_import',
        nameKey: 'terminals.vault_terminal_02.name',
        descriptionKey: 'terminals.vault_terminal_02.description',
      },
      {
        id: 'vault_terminal_03',
        challengeId: 'ch09_03_lambda_functions',
        nameKey: 'terminals.vault_terminal_03.name',
        descriptionKey: 'terminals.vault_terminal_03.description',
      },
    ],
  },
  {
    id: 'vault_main',
    floor: 8,
    nameKey: 'rooms.vault_main.name',
    descriptionKey: 'rooms.vault_main.description',
    firstVisitKey: 'rooms.vault_main.firstVisit',
    connections: [
      {
        direction: 'south',
        targetRoomId: 'vault_entrance',
        descriptionKey: 'rooms.vault_main.connections.south',
        locked: false,
      },
      {
        direction: 'east',
        targetRoomId: 'vault_deepstore',
        descriptionKey: 'rooms.vault_main.connections.east',
        locked: true,
        requiredChallenges: [
          'ch09_04_map_function',
          'ch09_05_filter_function',
          'ch09_06_list_comprehension_conditionals',
          'ch09_07_dictionary_comprehension',
        ],
      },
    ],
    npcs: [
      {
        id: 'researcher_yuki',
        nameKey: 'npcs.researcher_yuki.name',
        descriptionKey: 'npcs.researcher_yuki.description',
        dialogId: 'researcher_yuki_intro',
      },
    ],
    items: [],
    terminals: [
      {
        id: 'vault_terminal_04',
        challengeId: 'ch09_04_map_function',
        nameKey: 'terminals.vault_terminal_04.name',
        descriptionKey: 'terminals.vault_terminal_04.description',
      },
      {
        id: 'vault_terminal_05',
        challengeId: 'ch09_05_filter_function',
        nameKey: 'terminals.vault_terminal_05.name',
        descriptionKey: 'terminals.vault_terminal_05.description',
      },
      {
        id: 'vault_terminal_06',
        challengeId: 'ch09_06_list_comprehension_conditionals',
        nameKey: 'terminals.vault_terminal_06.name',
        descriptionKey: 'terminals.vault_terminal_06.description',
      },
      {
        id: 'vault_terminal_07',
        challengeId: 'ch09_07_dictionary_comprehension',
        nameKey: 'terminals.vault_terminal_07.name',
        descriptionKey: 'terminals.vault_terminal_07.description',
      },
    ],
  },
  {
    id: 'vault_deepstore',
    floor: 8,
    nameKey: 'rooms.vault_deepstore.name',
    descriptionKey: 'rooms.vault_deepstore.description',
    firstVisitKey: 'rooms.vault_deepstore.firstVisit',
    connections: [
      {
        direction: 'west',
        targetRoomId: 'vault_main',
        descriptionKey: 'rooms.vault_deepstore.connections.west',
        locked: false,
      },
      {
        direction: 'up',
        targetRoomId: 'aicore_antechamber',
        descriptionKey: 'rooms.vault_deepstore.connections.up',
        locked: true,
        requiredChallenges: [
          'ch09_01_importing_modules',
          'ch09_02_from_import',
          'ch09_03_lambda_functions',
          'ch09_04_map_function',
          'ch09_05_filter_function',
          'ch09_06_list_comprehension_conditionals',
          'ch09_07_dictionary_comprehension',
          'ch09_08_string_formatting_advanced',
          'ch09_09_regular_expressions',
          'ch09_10_combining_tools',
        ],
      },
    ],
    npcs: [
      {
        id: 'deep_archivist_zara',
        nameKey: 'npcs.deep_archivist_zara.name',
        descriptionKey: 'npcs.deep_archivist_zara.description',
        dialogId: 'deep_archivist_zara_intro',
      },
    ],
    items: [],
    terminals: [
      {
        id: 'vault_terminal_08',
        challengeId: 'ch09_08_string_formatting_advanced',
        nameKey: 'terminals.vault_terminal_08.name',
        descriptionKey: 'terminals.vault_terminal_08.description',
      },
      {
        id: 'vault_terminal_09',
        challengeId: 'ch09_09_regular_expressions',
        nameKey: 'terminals.vault_terminal_09.name',
        descriptionKey: 'terminals.vault_terminal_09.description',
      },
      {
        id: 'vault_terminal_10',
        challengeId: 'ch09_10_combining_tools',
        nameKey: 'terminals.vault_terminal_10.name',
        descriptionKey: 'terminals.vault_terminal_10.description',
      },
    ],
  },
];
