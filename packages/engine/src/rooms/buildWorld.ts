import type { Room, RoomConnection } from '@venomous-snake/shared-types';
import { FLOORS, challengeMap } from '@venomous-snake/challenges';
import { getNpcInfo } from '@venomous-snake/narrative';
import { FLOOR_LAYOUT } from './layout';
import type { RoomLayout } from './layout';

const FORWARD: Array<{ out: string; back: string }> = [
  { out: 'north', back: 'south' },
  { out: 'east', back: 'west' },
];

/** Deals `count` items to `rooms` in order; later rooms receive the larger shares. */
function shares(count: number, rooms: number): number[] {
  const result: number[] = [];
  let left = count;
  for (let i = 0; i < rooms; i++) {
    const share = Math.floor(left / (rooms - i));
    result.push(share);
    left -= share;
  }
  return result;
}

interface Placement {
  layout: RoomLayout;
  floor: number;
  challengeIds: string[];
}

function place(): Placement[] {
  const placements: Placement[] = [];
  for (const floor of FLOORS) {
    const layouts = FLOOR_LAYOUT[floor.number];
    if (layouts === undefined || layouts.length === 0) {
      throw new Error(`No rooms laid out for floor ${String(floor.number)}`);
    }
    const counts = shares(floor.challengeIds.length, layouts.length);
    let cursor = 0;
    layouts.forEach((layout, i) => {
      const take = counts[i] ?? 0;
      placements.push({
        layout,
        floor: floor.number,
        challengeIds: floor.challengeIds.slice(cursor, cursor + take),
      });
      cursor += take;
    });
  }
  return placements;
}

function connection(
  direction: string,
  target: string,
  from: string,
  required: string[],
): RoomConnection {
  const locked = required.length > 0;
  return {
    direction,
    targetRoomId: target,
    descriptionKey: `story.rooms.${from}.name`,
    locked,
    ...(locked ? { requiredChallenges: required } : {}),
  };
}

/** Builds the full room graph from the floor table and the layout. */
export function buildWorld(): Room[] {
  const placements = place();
  const rooms: Room[] = placements.map((p, index) => {
    const terminals = p.challengeIds.map((challengeId) => {
      const challenge = challengeMap[challengeId];
      if (challenge === undefined) throw new Error(`Unknown challenge ${challengeId}`);
      return {
        id: `terminal_${challengeId}`,
        challengeId,
        nameKey: challenge.titleKey,
        descriptionKey: challenge.descriptionKey,
      };
    });

    const npcs = p.layout.npc === undefined ? [] : [npcFor(p.layout.npc)];

    const connections: RoomConnection[] = [];
    const next = placements[index + 1];
    const previous = placements[index - 1];
    const nextOnSameFloor = next !== undefined && next.floor === p.floor;
    const previousOnSameFloor = previous !== undefined && previous.floor === p.floor;
    const hop = FORWARD[index % FORWARD.length] ?? { out: 'north', back: 'south' };

    if (previous !== undefined) {
      const backDirection = previousOnSameFloor
        ? (FORWARD[(index - 1) % FORWARD.length]?.back ?? 'south')
        : 'down';
      connections.push(connection(backDirection, previous.layout.id, p.layout.id, []));
    }
    if (next !== undefined) {
      const direction = nextOnSameFloor ? hop.out : 'up';
      // Leaving a room requires its own terminals. Reaching it already required every
      // earlier room of the floor, so the way up needs the whole floor cleared.
      connections.push(connection(direction, next.layout.id, p.layout.id, p.challengeIds));
    }

    return {
      id: p.layout.id,
      floor: p.floor,
      nameKey: `story.rooms.${p.layout.id}.name`,
      descriptionKey: `story.rooms.${p.layout.id}.description`,
      firstVisitKey: `story.rooms.${p.layout.id}.first_visit`,
      connections,
      npcs,
      terminals,
    };
  });
  return rooms;
}

function npcFor(dialogId: string): Room['npcs'][number] {
  const info = getNpcInfo(dialogId);
  return {
    id: dialogId,
    nameKey: info.nameKey,
    descriptionKey: info.nameKey,
    dialogId,
    ...(info.portraitId !== undefined ? { portraitId: info.portraitId } : {}),
  };
}
