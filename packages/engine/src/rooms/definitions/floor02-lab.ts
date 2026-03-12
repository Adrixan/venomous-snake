import type { Room } from '@venomous-snake/shared-types';

export const floor02Rooms: Room[] = [
  {
    id: 'lab_reception',
    floor: 2,
    nameKey: 'rooms.lab_reception.name',
    descriptionKey: 'rooms.lab_reception.description',
    firstVisitKey: 'rooms.lab_reception.firstVisit',
    connections: [
      {
        direction: 'north',
        targetRoomId: 'lab_main',
        descriptionKey: 'rooms.lab_reception.connections.north',
        locked: false,
      },
      {
        direction: 'down',
        targetRoomId: 'server_cage',
        descriptionKey: 'rooms.lab_reception.connections.down',
        locked: false,
      },
    ],
    npcs: [
      {
        id: 'lab_assistant_fiona',
        nameKey: 'npcs.lab_assistant_fiona.name',
        descriptionKey: 'npcs.lab_assistant_fiona.description',
        dialogId: 'lab_assistant_fiona_intro',
      },
    ],
    items: [],
    terminals: [
      {
        id: 'lab_terminal_01',
        challengeId: 'ch03_01_simple_if',
        nameKey: 'terminals.lab_terminal_01.name',
        descriptionKey: 'terminals.lab_terminal_01.description',
      },
      {
        id: 'lab_terminal_02',
        challengeId: 'ch03_02_if_else',
        nameKey: 'terminals.lab_terminal_02.name',
        descriptionKey: 'terminals.lab_terminal_02.description',
      },
      {
        id: 'lab_terminal_03',
        challengeId: 'ch03_03_comparison_operators',
        nameKey: 'terminals.lab_terminal_03.name',
        descriptionKey: 'terminals.lab_terminal_03.description',
      },
    ],
  },
  {
    id: 'lab_main',
    floor: 2,
    nameKey: 'rooms.lab_main.name',
    descriptionKey: 'rooms.lab_main.description',
    firstVisitKey: 'rooms.lab_main.firstVisit',
    connections: [
      {
        direction: 'south',
        targetRoomId: 'lab_reception',
        descriptionKey: 'rooms.lab_main.connections.south',
        locked: false,
      },
      {
        direction: 'east',
        targetRoomId: 'lab_storage',
        descriptionKey: 'rooms.lab_main.connections.east',
        locked: false,
      },
    ],
    npcs: [
      {
        id: 'scientist_grant',
        nameKey: 'npcs.scientist_grant.name',
        descriptionKey: 'npcs.scientist_grant.description',
        dialogId: 'scientist_grant_intro',
      },
    ],
    items: [
      {
        id: 'lab_notebook',
        nameKey: 'items.lab_notebook.name',
        descriptionKey: 'items.lab_notebook.description',
        itemType: 'datapad',
      },
    ],
    terminals: [
      {
        id: 'lab_terminal_04',
        challengeId: 'ch03_04_if_elif_else',
        nameKey: 'terminals.lab_terminal_04.name',
        descriptionKey: 'terminals.lab_terminal_04.description',
      },
      {
        id: 'lab_terminal_05',
        challengeId: 'ch03_05_logical_operators',
        nameKey: 'terminals.lab_terminal_05.name',
        descriptionKey: 'terminals.lab_terminal_05.description',
      },
      {
        id: 'lab_terminal_06',
        challengeId: 'ch03_06_nested_if',
        nameKey: 'terminals.lab_terminal_06.name',
        descriptionKey: 'terminals.lab_terminal_06.description',
      },
    ],
  },
  {
    id: 'lab_storage',
    floor: 2,
    nameKey: 'rooms.lab_storage.name',
    descriptionKey: 'rooms.lab_storage.description',
    firstVisitKey: 'rooms.lab_storage.firstVisit',
    connections: [
      {
        direction: 'west',
        targetRoomId: 'lab_main',
        descriptionKey: 'rooms.lab_storage.connections.west',
        locked: false,
      },
      {
        direction: 'up',
        targetRoomId: 'surveillance_lobby',
        descriptionKey: 'rooms.lab_storage.connections.up',
        locked: true,
        requiredChallenges: [
          'ch03_01_simple_if',
          'ch03_02_if_else',
          'ch03_03_comparison_operators',
          'ch03_04_if_elif_else',
          'ch03_05_logical_operators',
          'ch03_06_nested_if',
          'ch03_07_boolean_variables',
          'ch03_08_complex_conditions',
        ],
      },
    ],
    npcs: [
      {
        id: 'storage_clerk_hana',
        nameKey: 'npcs.storage_clerk_hana.name',
        descriptionKey: 'npcs.storage_clerk_hana.description',
        dialogId: 'storage_clerk_hana_intro',
      },
    ],
    items: [
      {
        id: 'chemical_manifest',
        nameKey: 'items.chemical_manifest.name',
        descriptionKey: 'items.chemical_manifest.description',
        itemType: 'datapad',
      },
    ],
    terminals: [
      {
        id: 'lab_terminal_07',
        challengeId: 'ch03_07_boolean_variables',
        nameKey: 'terminals.lab_terminal_07.name',
        descriptionKey: 'terminals.lab_terminal_07.description',
      },
      {
        id: 'lab_terminal_08',
        challengeId: 'ch03_08_complex_conditions',
        nameKey: 'terminals.lab_terminal_08.name',
        descriptionKey: 'terminals.lab_terminal_08.description',
      },
    ],
  },
];
