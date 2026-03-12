import type { Room } from '@venomous-snake/shared-types';

export class GameWorld {
  private rooms: Map<string, Room> = new Map();

  registerRoom(room: Room): void {
    this.rooms.set(room.id, room);
  }

  getRoom(id: string): Room | undefined {
    return this.rooms.get(id);
  }

  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  getRoomsForFloor(floor: number): Room[] {
    return this.getAllRooms().filter((r) => r.floor === floor);
  }

  getStartingRoomId(): string {
    return 'lobby_entrance';
  }
}
