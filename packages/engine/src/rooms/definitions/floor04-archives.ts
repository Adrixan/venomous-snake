import type { Room } from '@venomous-snake/shared-types';

export const floor04Rooms: Room[] = [
  {
    id: 'archives_entrance',
    floor: 4,
    nameKey: 'rooms.archives_entrance.name',
    descriptionKey: 'rooms.archives_entrance.description',
    firstVisitKey: 'rooms.archives_entrance.firstVisit',
    connections: [
      {
        direction: 'north',
        targetRoomId: 'archives_main',
        descriptionKey: 'rooms.archives_entrance.connections.north',
        locked: true,
        requiredChallenges: [
          'ch05_01_simple_function',
          'ch05_02_function_return',
          'ch05_03_multiple_parameters',
        ],
      },
      {
        direction: 'down',
        targetRoomId: 'surveillance_archive',
        descriptionKey: 'rooms.archives_entrance.connections.down',
        locked: false,
      },
    ],
    npcs: [
      {
        id: 'librarian_luna',
        nameKey: 'npcs.librarian_luna.name',
        descriptionKey: 'npcs.librarian_luna.description',
        dialogId: 'librarian_luna_intro',
      },
    ],
    items: [],
    terminals: [
      {
        id: 'archive_terminal_01',
        challengeId: 'ch05_01_simple_function',
        nameKey: 'terminals.archive_terminal_01.name',
        descriptionKey: 'terminals.archive_terminal_01.description',
      },
      {
        id: 'archive_terminal_02',
        challengeId: 'ch05_02_function_return',
        nameKey: 'terminals.archive_terminal_02.name',
        descriptionKey: 'terminals.archive_terminal_02.description',
      },
      {
        id: 'archive_terminal_03',
        challengeId: 'ch05_03_multiple_parameters',
        nameKey: 'terminals.archive_terminal_03.name',
        descriptionKey: 'terminals.archive_terminal_03.description',
      },
    ],
  },
  {
    id: 'archives_main',
    floor: 4,
    nameKey: 'rooms.archives_main.name',
    descriptionKey: 'rooms.archives_main.description',
    firstVisitKey: 'rooms.archives_main.firstVisit',
    connections: [
      {
        direction: 'south',
        targetRoomId: 'archives_entrance',
        descriptionKey: 'rooms.archives_main.connections.south',
        locked: false,
      },
      {
        direction: 'east',
        targetRoomId: 'archives_vault',
        descriptionKey: 'rooms.archives_main.connections.east',
        locked: true,
        requiredChallenges: [
          'ch05_04_default_parameters',
          'ch05_05_return_multiple',
          'ch05_06_functions_calling_functions',
          'ch05_07_scope',
        ],
      },
    ],
    npcs: [
      {
        id: 'data_curator_miles',
        nameKey: 'npcs.data_curator_miles.name',
        descriptionKey: 'npcs.data_curator_miles.description',
        dialogId: 'data_curator_miles_intro',
      },
    ],
    items: [],
    terminals: [
      {
        id: 'archive_terminal_04',
        challengeId: 'ch05_04_default_parameters',
        nameKey: 'terminals.archive_terminal_04.name',
        descriptionKey: 'terminals.archive_terminal_04.description',
      },
      {
        id: 'archive_terminal_05',
        challengeId: 'ch05_05_return_multiple',
        nameKey: 'terminals.archive_terminal_05.name',
        descriptionKey: 'terminals.archive_terminal_05.description',
      },
      {
        id: 'archive_terminal_06',
        challengeId: 'ch05_06_functions_calling_functions',
        nameKey: 'terminals.archive_terminal_06.name',
        descriptionKey: 'terminals.archive_terminal_06.description',
      },
      {
        id: 'archive_terminal_07',
        challengeId: 'ch05_07_scope',
        nameKey: 'terminals.archive_terminal_07.name',
        descriptionKey: 'terminals.archive_terminal_07.description',
      },
    ],
  },
  {
    id: 'archives_vault',
    floor: 4,
    nameKey: 'rooms.archives_vault.name',
    descriptionKey: 'rooms.archives_vault.description',
    firstVisitKey: 'rooms.archives_vault.firstVisit',
    connections: [
      {
        direction: 'west',
        targetRoomId: 'archives_main',
        descriptionKey: 'rooms.archives_vault.connections.west',
        locked: false,
      },
      {
        direction: 'up',
        targetRoomId: 'comms_reception',
        descriptionKey: 'rooms.archives_vault.connections.up',
        locked: true,
        requiredChallenges: [
          'ch05_01_simple_function',
          'ch05_02_function_return',
          'ch05_03_multiple_parameters',
          'ch05_04_default_parameters',
          'ch05_05_return_multiple',
          'ch05_06_functions_calling_functions',
          'ch05_07_scope',
          'ch05_08_args',
          'ch05_09_kwargs',
          'ch05_10_lambda',
        ],
      },
    ],
    npcs: [
      {
        id: 'vault_keeper_nina',
        nameKey: 'npcs.vault_keeper_nina.name',
        descriptionKey: 'npcs.vault_keeper_nina.description',
        dialogId: 'vault_keeper_nina_intro',
      },
    ],
    items: [],
    terminals: [
      {
        id: 'archive_terminal_08',
        challengeId: 'ch05_08_args',
        nameKey: 'terminals.archive_terminal_08.name',
        descriptionKey: 'terminals.archive_terminal_08.description',
      },
      {
        id: 'archive_terminal_09',
        challengeId: 'ch05_09_kwargs',
        nameKey: 'terminals.archive_terminal_09.name',
        descriptionKey: 'terminals.archive_terminal_09.description',
      },
      {
        id: 'archive_terminal_10',
        challengeId: 'ch05_10_lambda',
        nameKey: 'terminals.archive_terminal_10.name',
        descriptionKey: 'terminals.archive_terminal_10.description',
      },
    ],
  },
];
