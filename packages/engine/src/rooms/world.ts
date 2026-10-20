import type { Room } from '@venomous-snake/shared-types';
import { FLOORS } from '@venomous-snake/challenges';
import { buildWorld } from './buildWorld';

export const allRooms: Room[] = buildWorld();

export const START_ROOM_ID = 'lobby_entrance';

export function getRoomById(id: string): Room | undefined {
  return allRooms.find((room) => room.id === id);
}

export function getRoomDisplayName(id: string): string {
  return getRoomById(id)?.nameKey ?? id;
}

export function getRoomsForFloor(floor: number): Room[] {
  return allRooms.filter((room) => room.floor === floor);
}

/** The room a player arrives in when travelling to a floor. */
export function getFirstRoomOfFloor(floor: number): Room | undefined {
  return getRoomsForFloor(floor)[0];
}

/** Every challenge id placed on a terminal, in world order. */
export const ALL_CHALLENGE_IDS: string[] = allRooms.flatMap((room) =>
  room.terminals.map((terminal) => terminal.challengeId),
);

export const FLOOR_COUNT = FLOORS.length;
