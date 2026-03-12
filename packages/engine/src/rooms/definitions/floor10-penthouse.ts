import type { Room } from '@venomous-snake/shared-types';

export const floor10Rooms: Room[] = [
  {
    id: 'penthouse_elevator',
    floor: 10,
    nameKey: 'rooms.penthouse_elevator.name',
    descriptionKey: 'rooms.penthouse_elevator.description',
    firstVisitKey: 'rooms.penthouse_elevator.firstVisit',
    connections: [
      {
        direction: 'north',
        targetRoomId: 'penthouse_office',
        descriptionKey: 'rooms.penthouse_elevator.connections.north',
        locked: true,
        requiredChallenges: [
          'ch11_01_type_hints',
          'ch11_02_dataclasses',
          'ch11_03_assert_statements',
        ],
      },
      {
        direction: 'down',
        targetRoomId: 'aicore_neural',
        descriptionKey: 'rooms.penthouse_elevator.connections.down',
        locked: false,
      },
    ],
    npcs: [
      {
        id: 'penthouse_butler_davis',
        nameKey: 'npcs.penthouse_butler_davis.name',
        descriptionKey: 'npcs.penthouse_butler_davis.description',
        dialogId: 'penthouse_butler_davis_intro',
      },
    ],
    items: [],
    terminals: [
      {
        id: 'pent_terminal_01',
        challengeId: 'ch11_01_type_hints',
        nameKey: 'terminals.pent_terminal_01.name',
        descriptionKey: 'terminals.pent_terminal_01.description',
      },
      {
        id: 'pent_terminal_02',
        challengeId: 'ch11_02_dataclasses',
        nameKey: 'terminals.pent_terminal_02.name',
        descriptionKey: 'terminals.pent_terminal_02.description',
      },
      {
        id: 'pent_terminal_03',
        challengeId: 'ch11_03_assert_statements',
        nameKey: 'terminals.pent_terminal_03.name',
        descriptionKey: 'terminals.pent_terminal_03.description',
      },
    ],
  },
  {
    id: 'penthouse_office',
    floor: 10,
    nameKey: 'rooms.penthouse_office.name',
    descriptionKey: 'rooms.penthouse_office.description',
    firstVisitKey: 'rooms.penthouse_office.firstVisit',
    connections: [
      {
        direction: 'south',
        targetRoomId: 'penthouse_elevator',
        descriptionKey: 'rooms.penthouse_office.connections.south',
        locked: false,
      },
      {
        direction: 'east',
        targetRoomId: 'penthouse_lab',
        descriptionKey: 'rooms.penthouse_office.connections.east',
        locked: true,
        requiredChallenges: [
          'ch11_04_writing_simple_tests',
          'ch11_05_docstrings',
          'ch11_06_constants_enums',
        ],
      },
    ],
    npcs: [
      {
        id: 'ceo_morgan',
        nameKey: 'npcs.ceo_morgan.name',
        descriptionKey: 'npcs.ceo_morgan.description',
        dialogId: 'ceo_morgan_intro',
      },
    ],
    items: [],
    terminals: [
      {
        id: 'pent_terminal_04',
        challengeId: 'ch11_04_writing_simple_tests',
        nameKey: 'terminals.pent_terminal_04.name',
        descriptionKey: 'terminals.pent_terminal_04.description',
      },
      {
        id: 'pent_terminal_05',
        challengeId: 'ch11_05_docstrings',
        nameKey: 'terminals.pent_terminal_05.name',
        descriptionKey: 'terminals.pent_terminal_05.description',
      },
      {
        id: 'pent_terminal_06',
        challengeId: 'ch11_06_constants_enums',
        nameKey: 'terminals.pent_terminal_06.name',
        descriptionKey: 'terminals.pent_terminal_06.description',
      },
    ],
  },
  {
    id: 'penthouse_lab',
    floor: 10,
    nameKey: 'rooms.penthouse_lab.name',
    descriptionKey: 'rooms.penthouse_lab.description',
    firstVisitKey: 'rooms.penthouse_lab.firstVisit',
    connections: [
      {
        direction: 'west',
        targetRoomId: 'penthouse_office',
        descriptionKey: 'rooms.penthouse_lab.connections.west',
        locked: false,
      },
      {
        direction: 'up',
        targetRoomId: 'rooftop_access',
        descriptionKey: 'rooms.penthouse_lab.connections.up',
        locked: true,
        requiredChallenges: [
          'ch11_01_type_hints',
          'ch11_02_dataclasses',
          'ch11_03_assert_statements',
          'ch11_04_writing_simple_tests',
          'ch11_05_docstrings',
          'ch11_06_constants_enums',
          'ch11_07_list_typing',
          'ch11_08_putting_it_together',
        ],
      },
    ],
    npcs: [
      {
        id: 'lab_ai_echo',
        nameKey: 'npcs.lab_ai_echo.name',
        descriptionKey: 'npcs.lab_ai_echo.description',
        dialogId: 'lab_ai_echo_intro',
      },
    ],
    items: [],
    terminals: [
      {
        id: 'pent_terminal_07',
        challengeId: 'ch11_07_list_typing',
        nameKey: 'terminals.pent_terminal_07.name',
        descriptionKey: 'terminals.pent_terminal_07.description',
      },
      {
        id: 'pent_terminal_08',
        challengeId: 'ch11_08_putting_it_together',
        nameKey: 'terminals.pent_terminal_08.name',
        descriptionKey: 'terminals.pent_terminal_08.description',
      },
    ],
  },
];
