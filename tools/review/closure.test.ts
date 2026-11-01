import { it } from 'vitest';
import { allRooms, START_ROOM_ID } from '@venomous-snake/engine';
import { writeReport } from './report';

it('closure', () => {
  const done = new Set<string>();
  const byId = new Map(allRooms.map((r) => [r.id, r]));
  const log: string[] = [];
  let changed = true;
  while (changed) {
    changed = false;
    const seen = new Set<string>([START_ROOM_ID]);
    const queue = [START_ROOM_ID];
    for (let cur = queue.shift(); cur !== undefined; cur = queue.shift()) {
      for (const c of byId.get(cur)?.connections ?? []) {
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
          changed = true;
        }
      }
    }
    log.push(`reachable ${seen.size} rooms, done ${done.size}`);
  }
  const total = allRooms.flatMap((r) => r.terminals).length;
  writeReport('closure.txt', `${log.join('\n')}\ncompletable ${done.size}/${total}\n`);
});
