import type { Room } from '@venomous-snake/shared-types';

export const floor07Rooms: Room[] = [
  {
    id: 'manufacturing_floor',
    floor: 7,
    nameKey: 'rooms.manufacturing_floor.name',
    descriptionKey: 'rooms.manufacturing_floor.description',
    firstVisitKey: 'rooms.manufacturing_floor.firstVisit',
    connections: [
      {
        direction: 'east',
        targetRoomId: 'manufacturing_control',
        descriptionKey: 'rooms.manufacturing_floor.connections.east',
        locked: false,
      },
      {
        direction: 'down',
        targetRoomId: 'executive_boardroom',
        descriptionKey: 'rooms.manufacturing_floor.connections.down',
        locked: false,
      },
    ],
    npcs: [
      {
        id: 'foreman_ulrich',
        nameKey: 'npcs.foreman_ulrich.name',
        descriptionKey: 'npcs.foreman_ulrich.description',
        dialogId: 'foreman_ulrich_intro',
      },
    ],
    items: [],
    terminals: [
      {
        id: 'mfg_terminal_01',
        challengeId: 'ch08_01_try_except',
        nameKey: 'terminals.mfg_terminal_01.name',
        descriptionKey: 'terminals.mfg_terminal_01.description',
      },
      {
        id: 'mfg_terminal_02',
        challengeId: 'ch08_02_multiple_except',
        nameKey: 'terminals.mfg_terminal_02.name',
        descriptionKey: 'terminals.mfg_terminal_02.description',
      },
      {
        id: 'mfg_terminal_03',
        challengeId: 'ch08_03_try_except_else_finally',
        nameKey: 'terminals.mfg_terminal_03.name',
        descriptionKey: 'terminals.mfg_terminal_03.description',
      },
    ],
  },
  {
    id: 'manufacturing_control',
    floor: 7,
    nameKey: 'rooms.manufacturing_control.name',
    descriptionKey: 'rooms.manufacturing_control.description',
    firstVisitKey: 'rooms.manufacturing_control.firstVisit',
    connections: [
      {
        direction: 'west',
        targetRoomId: 'manufacturing_floor',
        descriptionKey: 'rooms.manufacturing_control.connections.west',
        locked: false,
      },
      {
        direction: 'north',
        targetRoomId: 'manufacturing_warehouse',
        descriptionKey: 'rooms.manufacturing_control.connections.north',
        locked: false,
      },
    ],
    npcs: [
      {
        id: 'qa_inspector_vera',
        nameKey: 'npcs.qa_inspector_vera.name',
        descriptionKey: 'npcs.qa_inspector_vera.description',
        dialogId: 'qa_inspector_vera_intro',
      },
    ],
    items: [
      {
        id: 'quality_report',
        nameKey: 'items.quality_report.name',
        descriptionKey: 'items.quality_report.description',
        itemType: 'datapad',
      },
    ],
    terminals: [
      {
        id: 'mfg_terminal_04',
        challengeId: 'ch08_04_raising_exceptions',
        nameKey: 'terminals.mfg_terminal_04.name',
        descriptionKey: 'terminals.mfg_terminal_04.description',
      },
      {
        id: 'mfg_terminal_05',
        challengeId: 'ch08_05_custom_exception_classes',
        nameKey: 'terminals.mfg_terminal_05.name',
        descriptionKey: 'terminals.mfg_terminal_05.description',
      },
      {
        id: 'mfg_terminal_06',
        challengeId: 'ch08_06_input_validation_with_errors',
        nameKey: 'terminals.mfg_terminal_06.name',
        descriptionKey: 'terminals.mfg_terminal_06.description',
      },
    ],
  },
  {
    id: 'manufacturing_warehouse',
    floor: 7,
    nameKey: 'rooms.manufacturing_warehouse.name',
    descriptionKey: 'rooms.manufacturing_warehouse.description',
    firstVisitKey: 'rooms.manufacturing_warehouse.firstVisit',
    connections: [
      {
        direction: 'south',
        targetRoomId: 'manufacturing_control',
        descriptionKey: 'rooms.manufacturing_warehouse.connections.south',
        locked: false,
      },
      {
        direction: 'up',
        targetRoomId: 'vault_entrance',
        descriptionKey: 'rooms.manufacturing_warehouse.connections.up',
        locked: true,
        requiredChallenges: [
          'ch08_01_try_except',
          'ch08_02_multiple_except',
          'ch08_03_try_except_else_finally',
          'ch08_04_raising_exceptions',
          'ch08_05_custom_exception_classes',
          'ch08_06_input_validation_with_errors',
          'ch08_07_graceful_degradation',
          'ch08_08_error_handling_in_loops',
        ],
      },
    ],
    npcs: [
      {
        id: 'warehouse_manager_wendy',
        nameKey: 'npcs.warehouse_manager_wendy.name',
        descriptionKey: 'npcs.warehouse_manager_wendy.description',
        dialogId: 'warehouse_manager_wendy_intro',
      },
    ],
    items: [
      {
        id: 'shipping_manifest',
        nameKey: 'items.shipping_manifest.name',
        descriptionKey: 'items.shipping_manifest.description',
        itemType: 'datapad',
      },
    ],
    terminals: [
      {
        id: 'mfg_terminal_07',
        challengeId: 'ch08_07_graceful_degradation',
        nameKey: 'terminals.mfg_terminal_07.name',
        descriptionKey: 'terminals.mfg_terminal_07.description',
      },
      {
        id: 'mfg_terminal_08',
        challengeId: 'ch08_08_error_handling_in_loops',
        nameKey: 'terminals.mfg_terminal_08.name',
        descriptionKey: 'terminals.mfg_terminal_08.description',
      },
    ],
  },
];
