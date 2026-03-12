import type { Room } from '@venomous-snake/shared-types';

export const floor01Rooms: Room[] = [
  {
    id: 'server_main',
    floor: 1,
    nameKey: 'rooms.server_main.name',
    descriptionKey: 'rooms.server_main.description',
    firstVisitKey: 'rooms.server_main.firstVisit',
    connections: [
      {
        direction: 'east',
        targetRoomId: 'server_monitoring',
        descriptionKey: 'rooms.server_main.connections.east',
        locked: false,
      },
      {
        direction: 'down',
        targetRoomId: 'lobby_hallway',
        descriptionKey: 'rooms.server_main.connections.down',
        locked: false,
      },
    ],
    npcs: [
      {
        id: 'sysadmin_carlos',
        nameKey: 'npcs.sysadmin_carlos.name',
        descriptionKey: 'npcs.sysadmin_carlos.description',
        dialogId: 'sysadmin_carlos_intro',
      },
    ],
    items: [],
    terminals: [
      {
        id: 'server_terminal_01',
        challengeId: 'ch02_01_string_methods',
        nameKey: 'terminals.server_terminal_01.name',
        descriptionKey: 'terminals.server_terminal_01.description',
      },
      {
        id: 'server_terminal_02',
        challengeId: 'ch02_02_string_indexing',
        nameKey: 'terminals.server_terminal_02.name',
        descriptionKey: 'terminals.server_terminal_02.description',
      },
      {
        id: 'server_terminal_03',
        challengeId: 'ch02_03_string_slicing',
        nameKey: 'terminals.server_terminal_03.name',
        descriptionKey: 'terminals.server_terminal_03.description',
      },
    ],
  },
  {
    id: 'server_monitoring',
    floor: 1,
    nameKey: 'rooms.server_monitoring.name',
    descriptionKey: 'rooms.server_monitoring.description',
    firstVisitKey: 'rooms.server_monitoring.firstVisit',
    connections: [
      {
        direction: 'west',
        targetRoomId: 'server_main',
        descriptionKey: 'rooms.server_monitoring.connections.west',
        locked: false,
      },
      {
        direction: 'north',
        targetRoomId: 'server_cage',
        descriptionKey: 'rooms.server_monitoring.connections.north',
        locked: false,
      },
    ],
    npcs: [
      {
        id: 'monitor_tech_diana',
        nameKey: 'npcs.monitor_tech_diana.name',
        descriptionKey: 'npcs.monitor_tech_diana.description',
        dialogId: 'monitor_tech_diana_intro',
      },
    ],
    items: [
      {
        id: 'server_log_printout',
        nameKey: 'items.server_log_printout.name',
        descriptionKey: 'items.server_log_printout.description',
        itemType: 'datapad',
      },
    ],
    terminals: [
      {
        id: 'server_terminal_04',
        challengeId: 'ch02_04_fstrings_basics',
        nameKey: 'terminals.server_terminal_04.name',
        descriptionKey: 'terminals.server_terminal_04.description',
      },
      {
        id: 'server_terminal_05',
        challengeId: 'ch02_05_input_basics',
        nameKey: 'terminals.server_terminal_05.name',
        descriptionKey: 'terminals.server_terminal_05.description',
      },
      {
        id: 'server_terminal_06',
        challengeId: 'ch02_06_type_conversion',
        nameKey: 'terminals.server_terminal_06.name',
        descriptionKey: 'terminals.server_terminal_06.description',
      },
    ],
  },
  {
    id: 'server_cage',
    floor: 1,
    nameKey: 'rooms.server_cage.name',
    descriptionKey: 'rooms.server_cage.description',
    firstVisitKey: 'rooms.server_cage.firstVisit',
    connections: [
      {
        direction: 'south',
        targetRoomId: 'server_monitoring',
        descriptionKey: 'rooms.server_cage.connections.south',
        locked: false,
      },
      {
        direction: 'up',
        targetRoomId: 'lab_reception',
        descriptionKey: 'rooms.server_cage.connections.up',
        locked: true,
        requiredChallenges: [
          'ch02_01_string_methods',
          'ch02_02_string_indexing',
          'ch02_03_string_slicing',
          'ch02_04_fstrings_basics',
          'ch02_05_input_basics',
          'ch02_06_type_conversion',
          'ch02_07_string_formatting',
          'ch02_08_len_and_string_ops',
        ],
      },
    ],
    npcs: [
      {
        id: 'cage_guard_evan',
        nameKey: 'npcs.cage_guard_evan.name',
        descriptionKey: 'npcs.cage_guard_evan.description',
        dialogId: 'cage_guard_evan_intro',
      },
    ],
    items: [
      {
        id: 'server_keycard_l2',
        nameKey: 'items.server_keycard_l2.name',
        descriptionKey: 'items.server_keycard_l2.description',
        itemType: 'keycard',
      },
    ],
    terminals: [
      {
        id: 'server_terminal_07',
        challengeId: 'ch02_07_string_formatting',
        nameKey: 'terminals.server_terminal_07.name',
        descriptionKey: 'terminals.server_terminal_07.description',
      },
      {
        id: 'server_terminal_08',
        challengeId: 'ch02_08_len_and_string_ops',
        nameKey: 'terminals.server_terminal_08.name',
        descriptionKey: 'terminals.server_terminal_08.description',
      },
    ],
  },
];
