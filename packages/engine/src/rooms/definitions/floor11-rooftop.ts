import type { Room } from '@venomous-snake/shared-types';

export const floor11Rooms: Room[] = [
  {
    id: 'rooftop_access',
    floor: 11,
    nameKey: 'rooms.rooftop_access.name',
    descriptionKey: 'rooms.rooftop_access.description',
    firstVisitKey: 'rooms.rooftop_access.firstVisit',
    connections: [
      {
        direction: 'north',
        targetRoomId: 'rooftop_helipad',
        descriptionKey: 'rooms.rooftop_access.connections.north',
        locked: true,
        requiredChallenges: [
          'ch12_01_generators',
          'ch12_02_generator_expressions',
          'ch12_03_decorators_basics',
          'ch12_04_decorators_with_args',
          'ch12_05_context_managers',
        ],
      },
      {
        direction: 'down',
        targetRoomId: 'penthouse_lab',
        descriptionKey: 'rooms.rooftop_access.connections.down',
        locked: false,
      },
    ],
    npcs: [
      {
        id: 'maintenance_worker_frank',
        nameKey: 'npcs.maintenance_worker_frank.name',
        descriptionKey: 'npcs.maintenance_worker_frank.description',
        dialogId: 'maintenance_worker_frank_intro',
      },
    ],
    items: [],
    terminals: [
      {
        id: 'roof_terminal_01',
        challengeId: 'ch12_01_generators',
        nameKey: 'terminals.roof_terminal_01.name',
        descriptionKey: 'terminals.roof_terminal_01.description',
      },
      {
        id: 'roof_terminal_02',
        challengeId: 'ch12_02_generator_expressions',
        nameKey: 'terminals.roof_terminal_02.name',
        descriptionKey: 'terminals.roof_terminal_02.description',
      },
      {
        id: 'roof_terminal_03',
        challengeId: 'ch12_03_decorators_basics',
        nameKey: 'terminals.roof_terminal_03.name',
        descriptionKey: 'terminals.roof_terminal_03.description',
      },
      {
        id: 'roof_terminal_04',
        challengeId: 'ch12_04_decorators_with_args',
        nameKey: 'terminals.roof_terminal_04.name',
        descriptionKey: 'terminals.roof_terminal_04.description',
      },
      {
        id: 'roof_terminal_05',
        challengeId: 'ch12_05_context_managers',
        nameKey: 'terminals.roof_terminal_05.name',
        descriptionKey: 'terminals.roof_terminal_05.description',
      },
    ],
  },
  {
    id: 'rooftop_helipad',
    floor: 11,
    nameKey: 'rooms.rooftop_helipad.name',
    descriptionKey: 'rooms.rooftop_helipad.description',
    firstVisitKey: 'rooms.rooftop_helipad.firstVisit',
    connections: [
      {
        direction: 'south',
        targetRoomId: 'rooftop_access',
        descriptionKey: 'rooms.rooftop_helipad.connections.south',
        locked: false,
      },
    ],
    npcs: [
      {
        id: 'pilot_ghost',
        nameKey: 'npcs.pilot_ghost.name',
        descriptionKey: 'npcs.pilot_ghost.description',
        dialogId: 'pilot_ghost_intro',
      },
    ],
    items: [],
    terminals: [
      {
        id: 'roof_terminal_06',
        challengeId: 'ch12_06_async_basics',
        nameKey: 'terminals.roof_terminal_06.name',
        descriptionKey: 'terminals.roof_terminal_06.description',
      },
      {
        id: 'roof_terminal_07',
        challengeId: 'ch12_07_pattern_matching',
        nameKey: 'terminals.roof_terminal_07.name',
        descriptionKey: 'terminals.roof_terminal_07.description',
      },
      {
        id: 'roof_terminal_08',
        challengeId: 'ch12_08_walrus_operator',
        nameKey: 'terminals.roof_terminal_08.name',
        descriptionKey: 'terminals.roof_terminal_08.description',
      },
      {
        id: 'roof_terminal_09',
        challengeId: 'ch12_09_advanced_comprehensions',
        nameKey: 'terminals.roof_terminal_09.name',
        descriptionKey: 'terminals.roof_terminal_09.description',
      },
      {
        id: 'roof_terminal_10',
        challengeId: 'ch12_10_final_showdown',
        nameKey: 'terminals.roof_terminal_10.name',
        descriptionKey: 'terminals.roof_terminal_10.description',
      },
    ],
  },
];
