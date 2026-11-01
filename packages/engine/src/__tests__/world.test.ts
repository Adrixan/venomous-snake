import { describe, it, expect } from 'vitest';
import { FLOORS, allChallenges, challengeMap, chapters } from '@venomous-snake/challenges';
import { floorConfigs } from '@venomous-snake/challenge-engine';
import { START_ROOM_ID, allRooms } from '../rooms/world';

const terminals = allRooms.flatMap((room) =>
  room.terminals.map((terminal) => ({ room, challengeId: terminal.challengeId })),
);

describe('world data', () => {
  it('has unique room ids', () => {
    const ids = allRooms.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('places every challenge on exactly one terminal', () => {
    const placed = terminals.map((t) => t.challengeId).sort();
    const expected = allChallenges.map((c) => c.id).sort();
    expect(placed).toEqual(expected);
  });

  it('keeps each chapter on the floor the floor table assigns to it', () => {
    for (const { room, challengeId } of terminals) {
      const floor = FLOORS.find((f) => f.challengeIds.includes(challengeId));
      expect(floor?.number, `${challengeId} in ${room.id}`).toBe(room.floor);
    }
  });

  it('covers every floor with at least one room', () => {
    for (const floor of FLOORS) {
      expect(
        allRooms.some((r) => r.floor === floor.number),
        `floor ${floor.number}`,
      ).toBe(true);
    }
  });

  it('only connects to existing rooms and requires existing challenges', () => {
    const roomIds = new Set(allRooms.map((r) => r.id));
    for (const room of allRooms) {
      for (const connection of room.connections) {
        expect(
          roomIds.has(connection.targetRoomId),
          `${room.id} -> ${connection.targetRoomId}`,
        ).toBe(true);
        for (const required of connection.requiredChallenges ?? []) {
          expect(challengeMap[required], `${room.id} requires ${required}`).toBeDefined();
        }
        if (connection.locked) {
          expect(
            connection.requiredChallenges?.length ?? 0,
            `${room.id} lock has no key`,
          ).toBeGreaterThan(0);
        }
      }
    }
  });

  it('agrees with the chapter list and the floor progression map', () => {
    chapters.forEach((chapter, index) => {
      expect(chapter.floor, `chapter ${chapter.id}`).toBe(FLOORS[index]?.id);
    });
    expect(floorConfigs.map((f) => [f.floorNumber, f.challengeIds])).toEqual(
      FLOORS.map((f) => [f.number, f.challengeIds]),
    );
  });

  it('reaches every room from the start when locks are ignored', () => {
    const byId = new Map(allRooms.map((r) => [r.id, r]));
    const seen = new Set<string>([START_ROOM_ID]);
    const queue = [START_ROOM_ID];
    for (let current = queue.shift(); current !== undefined; current = queue.shift()) {
      for (const c of byId.get(current)?.connections ?? []) {
        if (!seen.has(c.targetRoomId)) {
          seen.add(c.targetRoomId);
          queue.push(c.targetRoomId);
        }
      }
    }
    expect(allRooms.filter((r) => !seen.has(r.id)).map((r) => r.id)).toEqual([]);
  });

  it('can be completed from the start without deadlocks', () => {
    const byId = new Map(allRooms.map((r) => [r.id, r]));
    const done = new Set<string>();
    let progressed = true;
    while (progressed) {
      progressed = false;
      const seen = new Set<string>(['lobby_entrance']);
      const queue = ['lobby_entrance'];
      while (queue.length > 0) {
        const room = byId.get(queue.shift() as string);
        for (const c of room?.connections ?? []) {
          const open = !c.locked || (c.requiredChallenges ?? []).every((id) => done.has(id));
          if (open && !seen.has(c.targetRoomId)) {
            seen.add(c.targetRoomId);
            queue.push(c.targetRoomId);
          }
        }
      }
      for (const id of seen) {
        for (const t of byId.get(id)?.terminals ?? []) {
          if (!done.has(t.challengeId)) {
            done.add(t.challengeId);
            progressed = true;
          }
        }
      }
    }
    expect(done.size).toBe(allChallenges.length);
  });
});
