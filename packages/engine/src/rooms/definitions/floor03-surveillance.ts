import type { Room } from '@venomous-snake/shared-types';

export const floor03Rooms: Room[] = [
  {
    id: 'surveillance_lobby',
    floor: 3,
    nameKey: 'rooms.surveillance_lobby.name',
    descriptionKey: 'rooms.surveillance_lobby.description',
    firstVisitKey: 'rooms.surveillance_lobby.firstVisit',
    connections: [
      {
        direction: 'north',
        targetRoomId: 'surveillance_center',
        descriptionKey: 'rooms.surveillance_lobby.connections.north',
        locked: true,
        requiredChallenges: [
          'ch04_01_simple_for_loop',
          'ch04_02_range_basics',
          'ch04_03_for_with_range',
        ],
      },
      {
        direction: 'down',
        targetRoomId: 'lab_storage',
        descriptionKey: 'rooms.surveillance_lobby.connections.down',
        locked: false,
      },
    ],
    npcs: [
      {
        id: 'security_chief_ivan',
        nameKey: 'npcs.security_chief_ivan.name',
        descriptionKey: 'npcs.security_chief_ivan.description',
        dialogId: 'security_chief_ivan_intro',
      },
    ],
    items: [],
    terminals: [
      {
        id: 'surv_terminal_01',
        challengeId: 'ch04_01_simple_for_loop',
        nameKey: 'terminals.surv_terminal_01.name',
        descriptionKey: 'terminals.surv_terminal_01.description',
      },
      {
        id: 'surv_terminal_02',
        challengeId: 'ch04_02_range_basics',
        nameKey: 'terminals.surv_terminal_02.name',
        descriptionKey: 'terminals.surv_terminal_02.description',
      },
      {
        id: 'surv_terminal_03',
        challengeId: 'ch04_03_for_with_range',
        nameKey: 'terminals.surv_terminal_03.name',
        descriptionKey: 'terminals.surv_terminal_03.description',
      },
    ],
  },
  {
    id: 'surveillance_center',
    floor: 3,
    nameKey: 'rooms.surveillance_center.name',
    descriptionKey: 'rooms.surveillance_center.description',
    firstVisitKey: 'rooms.surveillance_center.firstVisit',
    connections: [
      {
        direction: 'south',
        targetRoomId: 'surveillance_lobby',
        descriptionKey: 'rooms.surveillance_center.connections.south',
        locked: false,
      },
      {
        direction: 'east',
        targetRoomId: 'surveillance_archive',
        descriptionKey: 'rooms.surveillance_center.connections.east',
        locked: true,
        requiredChallenges: [
          'ch04_04_while_basics',
          'ch04_05_while_condition',
          'ch04_06_break_statement',
          'ch04_07_continue_statement',
        ],
      },
    ],
    npcs: [
      {
        id: 'analyst_jade',
        nameKey: 'npcs.analyst_jade.name',
        descriptionKey: 'npcs.analyst_jade.description',
        dialogId: 'analyst_jade_intro',
      },
    ],
    items: [],
    terminals: [
      {
        id: 'surv_terminal_04',
        challengeId: 'ch04_04_while_basics',
        nameKey: 'terminals.surv_terminal_04.name',
        descriptionKey: 'terminals.surv_terminal_04.description',
      },
      {
        id: 'surv_terminal_05',
        challengeId: 'ch04_05_while_condition',
        nameKey: 'terminals.surv_terminal_05.name',
        descriptionKey: 'terminals.surv_terminal_05.description',
      },
      {
        id: 'surv_terminal_06',
        challengeId: 'ch04_06_break_statement',
        nameKey: 'terminals.surv_terminal_06.name',
        descriptionKey: 'terminals.surv_terminal_06.description',
      },
      {
        id: 'surv_terminal_07',
        challengeId: 'ch04_07_continue_statement',
        nameKey: 'terminals.surv_terminal_07.name',
        descriptionKey: 'terminals.surv_terminal_07.description',
      },
    ],
  },
  {
    id: 'surveillance_archive',
    floor: 3,
    nameKey: 'rooms.surveillance_archive.name',
    descriptionKey: 'rooms.surveillance_archive.description',
    firstVisitKey: 'rooms.surveillance_archive.firstVisit',
    connections: [
      {
        direction: 'west',
        targetRoomId: 'surveillance_center',
        descriptionKey: 'rooms.surveillance_archive.connections.west',
        locked: false,
      },
      {
        direction: 'up',
        targetRoomId: 'archives_entrance',
        descriptionKey: 'rooms.surveillance_archive.connections.up',
        locked: true,
        requiredChallenges: [
          'ch04_01_simple_for_loop',
          'ch04_02_range_basics',
          'ch04_03_for_with_range',
          'ch04_04_while_basics',
          'ch04_05_while_condition',
          'ch04_06_break_statement',
          'ch04_07_continue_statement',
          'ch04_08_nested_loops',
          'ch04_09_loop_accumulator',
          'ch04_10_for_enumerate',
        ],
      },
    ],
    npcs: [
      {
        id: 'archivist_kai',
        nameKey: 'npcs.archivist_kai.name',
        descriptionKey: 'npcs.archivist_kai.description',
        dialogId: 'archivist_kai_intro',
      },
    ],
    items: [],
    terminals: [
      {
        id: 'surv_terminal_08',
        challengeId: 'ch04_08_nested_loops',
        nameKey: 'terminals.surv_terminal_08.name',
        descriptionKey: 'terminals.surv_terminal_08.description',
      },
      {
        id: 'surv_terminal_09',
        challengeId: 'ch04_09_loop_accumulator',
        nameKey: 'terminals.surv_terminal_09.name',
        descriptionKey: 'terminals.surv_terminal_09.description',
      },
      {
        id: 'surv_terminal_10',
        challengeId: 'ch04_10_for_enumerate',
        nameKey: 'terminals.surv_terminal_10.name',
        descriptionKey: 'terminals.surv_terminal_10.description',
      },
    ],
  },
];
