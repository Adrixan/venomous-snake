import type { Room } from '@venomous-snake/shared-types';

export const floor05Rooms: Room[] = [
  {
    id: 'comms_reception',
    floor: 5,
    nameKey: 'rooms.comms_reception.name',
    descriptionKey: 'rooms.comms_reception.description',
    firstVisitKey: 'rooms.comms_reception.firstVisit',
    connections: [
      {
        direction: 'north',
        targetRoomId: 'comms_center',
        descriptionKey: 'rooms.comms_reception.connections.north',
        locked: false,
      },
      {
        direction: 'down',
        targetRoomId: 'archives_vault',
        descriptionKey: 'rooms.comms_reception.connections.down',
        locked: false,
      },
    ],
    npcs: [
      {
        id: 'radio_operator_oscar',
        nameKey: 'npcs.radio_operator_oscar.name',
        descriptionKey: 'npcs.radio_operator_oscar.description',
        dialogId: 'radio_operator_oscar_intro',
      },
    ],
    items: [],
    terminals: [
      {
        id: 'comms_terminal_01',
        challengeId: 'ch06_01_create_list',
        nameKey: 'terminals.comms_terminal_01.name',
        descriptionKey: 'terminals.comms_terminal_01.description',
      },
      {
        id: 'comms_terminal_02',
        challengeId: 'ch06_02_list_methods',
        nameKey: 'terminals.comms_terminal_02.name',
        descriptionKey: 'terminals.comms_terminal_02.description',
      },
      {
        id: 'comms_terminal_03',
        challengeId: 'ch06_03_list_slicing',
        nameKey: 'terminals.comms_terminal_03.name',
        descriptionKey: 'terminals.comms_terminal_03.description',
      },
    ],
  },
  {
    id: 'comms_center',
    floor: 5,
    nameKey: 'rooms.comms_center.name',
    descriptionKey: 'rooms.comms_center.description',
    firstVisitKey: 'rooms.comms_center.firstVisit',
    connections: [
      {
        direction: 'south',
        targetRoomId: 'comms_reception',
        descriptionKey: 'rooms.comms_center.connections.south',
        locked: false,
      },
      {
        direction: 'east',
        targetRoomId: 'comms_server',
        descriptionKey: 'rooms.comms_center.connections.east',
        locked: false,
      },
    ],
    npcs: [
      {
        id: 'signal_analyst_petra',
        nameKey: 'npcs.signal_analyst_petra.name',
        descriptionKey: 'npcs.signal_analyst_petra.description',
        dialogId: 'signal_analyst_petra_intro',
      },
    ],
    items: [
      {
        id: 'frequency_log',
        nameKey: 'items.frequency_log.name',
        descriptionKey: 'items.frequency_log.description',
        itemType: 'datapad',
      },
    ],
    terminals: [
      {
        id: 'comms_terminal_04',
        challengeId: 'ch06_04_list_comprehension',
        nameKey: 'terminals.comms_terminal_04.name',
        descriptionKey: 'terminals.comms_terminal_04.description',
      },
      {
        id: 'comms_terminal_05',
        challengeId: 'ch06_05_tuples',
        nameKey: 'terminals.comms_terminal_05.name',
        descriptionKey: 'terminals.comms_terminal_05.description',
      },
      {
        id: 'comms_terminal_06',
        challengeId: 'ch06_06_dictionaries',
        nameKey: 'terminals.comms_terminal_06.name',
        descriptionKey: 'terminals.comms_terminal_06.description',
      },
      {
        id: 'comms_terminal_07',
        challengeId: 'ch06_07_dict_methods',
        nameKey: 'terminals.comms_terminal_07.name',
        descriptionKey: 'terminals.comms_terminal_07.description',
      },
    ],
  },
  {
    id: 'comms_server',
    floor: 5,
    nameKey: 'rooms.comms_server.name',
    descriptionKey: 'rooms.comms_server.description',
    firstVisitKey: 'rooms.comms_server.firstVisit',
    connections: [
      {
        direction: 'west',
        targetRoomId: 'comms_center',
        descriptionKey: 'rooms.comms_server.connections.west',
        locked: false,
      },
      {
        direction: 'up',
        targetRoomId: 'executive_lobby',
        descriptionKey: 'rooms.comms_server.connections.up',
        locked: true,
        requiredChallenges: [
          'ch06_01_create_list',
          'ch06_02_list_methods',
          'ch06_03_list_slicing',
          'ch06_04_list_comprehension',
          'ch06_05_tuples',
          'ch06_06_dictionaries',
          'ch06_07_dict_methods',
          'ch06_08_nested_dicts',
          'ch06_09_sets',
          'ch06_10_combining_collections',
        ],
      },
    ],
    npcs: [
      {
        id: 'comms_tech_quinn',
        nameKey: 'npcs.comms_tech_quinn.name',
        descriptionKey: 'npcs.comms_tech_quinn.description',
        dialogId: 'comms_tech_quinn_intro',
      },
    ],
    items: [
      {
        id: 'satellite_codes',
        nameKey: 'items.satellite_codes.name',
        descriptionKey: 'items.satellite_codes.description',
        itemType: 'datapad',
      },
    ],
    terminals: [
      {
        id: 'comms_terminal_08',
        challengeId: 'ch06_08_nested_dicts',
        nameKey: 'terminals.comms_terminal_08.name',
        descriptionKey: 'terminals.comms_terminal_08.description',
      },
      {
        id: 'comms_terminal_09',
        challengeId: 'ch06_09_sets',
        nameKey: 'terminals.comms_terminal_09.name',
        descriptionKey: 'terminals.comms_terminal_09.description',
      },
      {
        id: 'comms_terminal_10',
        challengeId: 'ch06_10_combining_collections',
        nameKey: 'terminals.comms_terminal_10.name',
        descriptionKey: 'terminals.comms_terminal_10.description',
      },
    ],
  },
];
