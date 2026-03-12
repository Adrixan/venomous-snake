import type { Room } from '@venomous-snake/shared-types';

export const floor06Rooms: Room[] = [
  {
    id: 'executive_lobby',
    floor: 6,
    nameKey: 'rooms.executive_lobby.name',
    descriptionKey: 'rooms.executive_lobby.description',
    firstVisitKey: 'rooms.executive_lobby.firstVisit',
    connections: [
      {
        direction: 'north',
        targetRoomId: 'executive_offices',
        descriptionKey: 'rooms.executive_lobby.connections.north',
        locked: true,
        requiredChallenges: [
          'ch07_01_read_file',
          'ch07_02_write_file',
          'ch07_03_file_line_processing',
        ],
      },
      {
        direction: 'down',
        targetRoomId: 'comms_server',
        descriptionKey: 'rooms.executive_lobby.connections.down',
        locked: false,
      },
    ],
    npcs: [
      {
        id: 'exec_secretary_rachel',
        nameKey: 'npcs.exec_secretary_rachel.name',
        descriptionKey: 'npcs.exec_secretary_rachel.description',
        dialogId: 'exec_secretary_rachel_intro',
      },
    ],
    items: [],
    terminals: [
      {
        id: 'exec_terminal_01',
        challengeId: 'ch07_01_read_file',
        nameKey: 'terminals.exec_terminal_01.name',
        descriptionKey: 'terminals.exec_terminal_01.description',
      },
      {
        id: 'exec_terminal_02',
        challengeId: 'ch07_02_write_file',
        nameKey: 'terminals.exec_terminal_02.name',
        descriptionKey: 'terminals.exec_terminal_02.description',
      },
      {
        id: 'exec_terminal_03',
        challengeId: 'ch07_03_file_line_processing',
        nameKey: 'terminals.exec_terminal_03.name',
        descriptionKey: 'terminals.exec_terminal_03.description',
      },
    ],
  },
  {
    id: 'executive_offices',
    floor: 6,
    nameKey: 'rooms.executive_offices.name',
    descriptionKey: 'rooms.executive_offices.description',
    firstVisitKey: 'rooms.executive_offices.firstVisit',
    connections: [
      {
        direction: 'south',
        targetRoomId: 'executive_lobby',
        descriptionKey: 'rooms.executive_offices.connections.south',
        locked: false,
      },
      {
        direction: 'east',
        targetRoomId: 'executive_boardroom',
        descriptionKey: 'rooms.executive_offices.connections.east',
        locked: true,
        requiredChallenges: [
          'ch07_04_csv_parsing',
          'ch07_05_string_split_join',
          'ch07_06_with_statement',
        ],
      },
    ],
    npcs: [
      {
        id: 'cfo_stevens',
        nameKey: 'npcs.cfo_stevens.name',
        descriptionKey: 'npcs.cfo_stevens.description',
        dialogId: 'cfo_stevens_intro',
      },
    ],
    items: [],
    terminals: [
      {
        id: 'exec_terminal_04',
        challengeId: 'ch07_04_csv_parsing',
        nameKey: 'terminals.exec_terminal_04.name',
        descriptionKey: 'terminals.exec_terminal_04.description',
      },
      {
        id: 'exec_terminal_05',
        challengeId: 'ch07_05_string_split_join',
        nameKey: 'terminals.exec_terminal_05.name',
        descriptionKey: 'terminals.exec_terminal_05.description',
      },
      {
        id: 'exec_terminal_06',
        challengeId: 'ch07_06_with_statement',
        nameKey: 'terminals.exec_terminal_06.name',
        descriptionKey: 'terminals.exec_terminal_06.description',
      },
    ],
  },
  {
    id: 'executive_boardroom',
    floor: 6,
    nameKey: 'rooms.executive_boardroom.name',
    descriptionKey: 'rooms.executive_boardroom.description',
    firstVisitKey: 'rooms.executive_boardroom.firstVisit',
    connections: [
      {
        direction: 'west',
        targetRoomId: 'executive_offices',
        descriptionKey: 'rooms.executive_boardroom.connections.west',
        locked: false,
      },
      {
        direction: 'up',
        targetRoomId: 'manufacturing_floor',
        descriptionKey: 'rooms.executive_boardroom.connections.up',
        locked: true,
        requiredChallenges: [
          'ch07_01_read_file',
          'ch07_02_write_file',
          'ch07_03_file_line_processing',
          'ch07_04_csv_parsing',
          'ch07_05_string_split_join',
          'ch07_06_with_statement',
          'ch07_07_json_parsing',
          'ch07_08_data_transformation',
        ],
      },
    ],
    npcs: [
      {
        id: 'board_member_tanaka',
        nameKey: 'npcs.board_member_tanaka.name',
        descriptionKey: 'npcs.board_member_tanaka.description',
        dialogId: 'board_member_tanaka_intro',
      },
    ],
    items: [],
    terminals: [
      {
        id: 'exec_terminal_07',
        challengeId: 'ch07_07_json_parsing',
        nameKey: 'terminals.exec_terminal_07.name',
        descriptionKey: 'terminals.exec_terminal_07.description',
      },
      {
        id: 'exec_terminal_08',
        challengeId: 'ch07_08_data_transformation',
        nameKey: 'terminals.exec_terminal_08.name',
        descriptionKey: 'terminals.exec_terminal_08.description',
      },
    ],
  },
];
