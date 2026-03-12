import type { Room } from '@venomous-snake/shared-types';

export const floor00Rooms: Room[] = [
  {
    id: 'lobby_entrance',
    floor: 0,
    nameKey: 'rooms.lobby_entrance.name',
    descriptionKey: 'rooms.lobby_entrance.description',
    firstVisitKey: 'rooms.lobby_entrance.firstVisit',
    connections: [
      {
        direction: 'north',
        targetRoomId: 'lobby_hallway',
        descriptionKey: 'rooms.lobby_entrance.connections.north',
        locked: true,
        requiredChallenges: ['ch01_01_hello_world', 'ch01_02_variables', 'ch01_03_math_ops'],
      },
    ],
    npcs: [
      {
        id: 'guard_jenkins',
        nameKey: 'npcs.guard_jenkins.name',
        descriptionKey: 'npcs.guard_jenkins.description',
        dialogId: 'guard_jenkins_intro',
      },
    ],
    terminals: [
      {
        id: 'lobby_terminal_01',
        challengeId: 'ch01_01_hello_world',
        nameKey: 'terminals.lobby_terminal_01.name',
        descriptionKey: 'terminals.lobby_terminal_01.description',
      },
      {
        id: 'lobby_terminal_02',
        challengeId: 'ch01_02_variables',
        nameKey: 'terminals.lobby_terminal_02.name',
        descriptionKey: 'terminals.lobby_terminal_02.description',
      },
      {
        id: 'lobby_terminal_03',
        challengeId: 'ch01_03_math_ops',
        nameKey: 'terminals.lobby_terminal_03.name',
        descriptionKey: 'terminals.lobby_terminal_03.description',
      },
    ],
  },
  {
    id: 'lobby_hallway',
    floor: 0,
    nameKey: 'rooms.lobby_hallway.name',
    descriptionKey: 'rooms.lobby_hallway.description',
    firstVisitKey: 'rooms.lobby_hallway.firstVisit',
    connections: [
      {
        direction: 'south',
        targetRoomId: 'lobby_entrance',
        descriptionKey: 'rooms.lobby_hallway.connections.south',
        locked: false,
      },
      {
        direction: 'east',
        targetRoomId: 'lobby_server_closet',
        descriptionKey: 'rooms.lobby_hallway.connections.east',
        locked: true,
        requiredChallenges: [
          'ch01_04_string_types',
          'ch01_05_float_calculations',
          'ch01_06_string_concatenation',
        ],
      },
      {
        direction: 'up',
        targetRoomId: 'server_main',
        descriptionKey: 'rooms.lobby_hallway.connections.up',
        locked: true,
        requiredChallenges: [
          'ch01_01_hello_world',
          'ch01_02_variables',
          'ch01_03_math_ops',
          'ch01_04_string_types',
          'ch01_05_float_calculations',
          'ch01_06_string_concatenation',
          'ch01_07_multiple_prints',
          'ch01_08_comments',
        ],
      },
    ],
    npcs: [
      {
        id: 'receptionist_alice',
        nameKey: 'npcs.receptionist_alice.name',
        descriptionKey: 'npcs.receptionist_alice.description',
        dialogId: 'receptionist_alice_intro',
      },
    ],
    terminals: [
      {
        id: 'lobby_terminal_04',
        challengeId: 'ch01_04_string_types',
        nameKey: 'terminals.lobby_terminal_04.name',
        descriptionKey: 'terminals.lobby_terminal_04.description',
      },
      {
        id: 'lobby_terminal_05',
        challengeId: 'ch01_05_float_calculations',
        nameKey: 'terminals.lobby_terminal_05.name',
        descriptionKey: 'terminals.lobby_terminal_05.description',
      },
      {
        id: 'lobby_terminal_06',
        challengeId: 'ch01_06_string_concatenation',
        nameKey: 'terminals.lobby_terminal_06.name',
        descriptionKey: 'terminals.lobby_terminal_06.description',
      },
    ],
  },
  {
    id: 'lobby_server_closet',
    floor: 0,
    nameKey: 'rooms.lobby_server_closet.name',
    descriptionKey: 'rooms.lobby_server_closet.description',
    firstVisitKey: 'rooms.lobby_server_closet.firstVisit',
    connections: [
      {
        direction: 'west',
        targetRoomId: 'lobby_hallway',
        descriptionKey: 'rooms.lobby_server_closet.connections.west',
        locked: false,
      },
    ],
    npcs: [
      {
        id: 'techie_bob',
        nameKey: 'npcs.techie_bob.name',
        descriptionKey: 'npcs.techie_bob.description',
        dialogId: 'techie_bob_intro',
      },
    ],
    terminals: [
      {
        id: 'lobby_terminal_07',
        challengeId: 'ch01_07_multiple_prints',
        nameKey: 'terminals.lobby_terminal_07.name',
        descriptionKey: 'terminals.lobby_terminal_07.description',
      },
      {
        id: 'lobby_terminal_08',
        challengeId: 'ch01_08_comments',
        nameKey: 'terminals.lobby_terminal_08.name',
        descriptionKey: 'terminals.lobby_terminal_08.description',
      },
    ],
  },
];
