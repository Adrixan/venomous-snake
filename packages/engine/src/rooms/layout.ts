/**
 * Where everything stands. The world is generated from this table and the
 * canonical floor table in `@venomous-snake/challenges`: terminals are dealt out
 * to a floor's rooms in order, and each room unlocks the next once its own
 * terminals are solved.
 */
export interface RoomLayout {
  /** Unique room id; its texts live under `story.rooms.<id>.*`. */
  id: string;
  /** Dialog tree of the person standing in this room, if any. */
  npc?: string;
}

/** Indexed by floor number. */
export const FLOOR_LAYOUT: RoomLayout[][] = [
  [
    { id: 'lobby_entrance', npc: 'guard_torres' },
    { id: 'lobby_hallway', npc: 'dr_silva' },
    { id: 'lobby_server_closet' },
    { id: 'lobby_break_room' },
    { id: 'lobby_mail_room' },
    { id: 'lobby_stairwell' },
  ],
  [
    { id: 'server_main', npc: 'dialog_kai' },
    { id: 'server_monitoring' },
    { id: 'server_cage', npc: 'dialog_reeves' },
  ],
  [
    { id: 'lab_reception' },
    { id: 'lab_main', npc: 'dialog_patel' },
    { id: 'lab_storage', npc: 'dialog_labbot' },
  ],
  [
    { id: 'surveillance_lobby', npc: 'dialog_voss' },
    { id: 'surveillance_center', npc: 'dialog_chen' },
    { id: 'surveillance_archive' },
  ],
  [
    { id: 'archives_entrance', npc: 'dialog_okafor' },
    { id: 'archives_main', npc: 'dialog_jamie' },
    { id: 'archives_vault' },
  ],
  [
    { id: 'comms_reception', npc: 'dialog_diaz' },
    { id: 'comms_center' },
    { id: 'comms_server', npc: 'dialog_echo' },
  ],
  [
    { id: 'executive_lobby', npc: 'dialog_kim' },
    { id: 'executive_offices', npc: 'dialog_blackwell' },
    { id: 'executive_boardroom' },
  ],
  [
    { id: 'manufacturing_floor', npc: 'dialog_kowalski' },
    { id: 'manufacturing_control', npc: 'dialog_delta7' },
    { id: 'manufacturing_warehouse' },
  ],
  [
    { id: 'vault_entrance' },
    { id: 'vault_main', npc: 'dialog_volkov' },
    { id: 'vault_deepstore', npc: 'dialog_aifragment' },
  ],
  [
    { id: 'aicore_antechamber' },
    { id: 'aicore_main', npc: 'dialog_coreguardian' },
    { id: 'aicore_neural', npc: 'dialog_ghost' },
  ],
  [
    { id: 'penthouse_elevator', npc: 'dialog_sterling' },
    { id: 'penthouse_office' },
    { id: 'penthouse_lab', npc: 'dialog_nova' },
  ],
  [{ id: 'rooftop_access' }, { id: 'rooftop_helipad', npc: 'dialog_snake' }],
];
