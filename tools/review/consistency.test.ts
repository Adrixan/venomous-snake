import { it } from 'vitest';
import { allChallenges, chapters } from '@venomous-snake/challenges';
import { allRooms, START_ROOM_ID } from '@venomous-snake/engine';
import { ACHIEVEMENTS, floorConfigs } from '@venomous-snake/challenge-engine';
import type { TestCase } from '@venomous-snake/shared-types';
import { writeReport } from './report';

const isOutputOnly = (t: TestCase): boolean =>
  !t.setup && !t.append && t.input === undefined && !t.expectsError;

it('report', () => {
  const challenges = allChallenges;
  const map = new Map(challenges.map((c) => [c.id, c]));
  const out: string[] = [];
  const total = challenges.length;
  out.push(`challenges exported from index: ${total}`);
  out.push(
    `chapters: ${chapters.length}, chapter challenge refs: ${chapters.reduce((n, c) => n + c.challenges.length, 0)}`,
  );
  for (const ch of chapters) {
    out.push(
      `  chapter ${ch.id} floor=${ch.floor} n=${ch.challenges.length} boss=${ch.bossChallenge}`,
    );
  }

  const termIds = allRooms.flatMap((r) =>
    r.terminals.map((t) => ({ room: r.id, floor: r.floor, cid: t.challengeId })),
  );
  out.push(`rooms: ${allRooms.length}, terminals: ${termIds.length}`);
  out.push(
    `terminal challengeIds not in challenge set: ${JSON.stringify(termIds.filter((t) => !map.has(t.cid)))}`,
  );
  const termSet = new Set(termIds.map((t) => t.cid));
  out.push(
    `challenges unreachable from any terminal: ${JSON.stringify([...map.keys()].filter((id) => !termSet.has(id)))}`,
  );
  const dup = termIds.map((t) => t.cid).filter((id, i, a) => a.indexOf(id) !== i);
  out.push(`challenges on multiple terminals: ${JSON.stringify(dup)}`);

  // Floor mismatch: engine floor vs floorConfigs floor vs chapters.floor.
  const cfgFloor = new Map<string, number>();
  for (const f of floorConfigs) for (const id of f.challengeIds) cfgFloor.set(id, f.floorNumber);
  const chFloor = new Map<string, string>();
  for (const ch of chapters) for (const id of ch.challenges) chFloor.set(id, ch.floor);
  const mism = termIds.filter((t) => cfgFloor.get(t.cid) !== t.floor);
  out.push(
    `terminals where engine floor != FloorChallengeMap floor: ${mism.length}/${termIds.length}`,
  );
  for (const m of mism.slice(0, 40)) {
    out.push(
      `   ${m.cid}: room ${m.room} floor ${m.floor}, floorConfig ${cfgFloor.get(m.cid)}, chapters.floor ${chFloor.get(m.cid)}`,
    );
  }
  const configs = floorConfigs.map(
    (f) => `${f.floorNumber}:${f.challengeIds.length}/${f.requiredCompletions}`,
  );
  out.push(`FloorChallengeMap total ids: ${cfgFloor.size}; configs: ${configs.join(' ')}`);

  const byFloor: Record<number, number> = {};
  for (const t of termIds) byFloor[t.floor] = (byFloor[t.floor] ?? 0) + 1;
  out.push(`engine terminals per floor: ${JSON.stringify(byFloor)}`);

  // Connection validity.
  const roomIds = new Set(allRooms.map((r) => r.id));
  const badConn = allRooms.flatMap((r) =>
    r.connections
      .filter((c) => !roomIds.has(c.targetRoomId))
      .map((c) => `${r.id}->${c.targetRoomId}`),
  );
  out.push(`connections to unknown rooms: ${JSON.stringify(badConn)}`);
  const badReq = allRooms.flatMap((r) =>
    r.connections.flatMap((c) =>
      (c.requiredChallenges ?? []).filter((id) => !map.has(id)).map((id) => `${r.id}:${id}`),
    ),
  );
  out.push(`requiredChallenges unknown: ${JSON.stringify(badReq)}`);

  // Reachability from the start room, ignoring locks.
  const seen = new Set<string>([START_ROOM_ID]);
  const queue = [START_ROOM_ID];
  for (let cur = queue.shift(); cur !== undefined; cur = queue.shift()) {
    const room = allRooms.find((x) => x.id === cur);
    for (const c of room?.connections ?? []) {
      if (!seen.has(c.targetRoomId)) {
        seen.add(c.targetRoomId);
        queue.push(c.targetRoomId);
      }
    }
  }
  const unreachable = allRooms.filter((r) => !seen.has(r.id)).map((r) => r.id);
  out.push(`rooms unreachable from ${START_ROOM_ID}: ${JSON.stringify(unreachable)}`);

  // Locked connections with no requirements are soft-locks.
  const softLocks = allRooms.flatMap((r) =>
    r.connections
      .filter((c) => c.locked && !c.requiredChallenges?.length)
      .map((c) => `${r.id}->${c.targetRoomId}`),
  );
  out.push(`locked connections without requiredChallenges: ${JSON.stringify(softLocks)}`);

  // Test weakness: a hard-coded print passes when every test expects the same output.
  const weak = challenges.filter(
    (c) =>
      c.testCases.length > 1 &&
      c.testCases.every(
        (t) => isOutputOnly(t) && t.expectedOutput === c.testCases[0]?.expectedOutput,
      ),
  );
  out.push(
    `challenges where all test cases are identical (hardcode-print passes): ${weak.length}/${total}`,
  );
  const single = challenges.filter((c) => c.testCases.length === 1);
  out.push(`challenges with a single test case: ${single.length}`);
  const outputOnly = challenges.filter((c) => c.testCases.every(isOutputOnly));
  out.push(
    `challenges with no setup/append/input/expectsError in any test: ${outputOnly.length}/${total}`,
  );

  const prereq = challenges.flatMap((c) =>
    c.prerequisites.filter((p) => !map.has(p)).map((p) => `${c.id}:${p}`),
  );
  out.push(`prereq unknown: ${JSON.stringify(prereq)}`);

  const triggerTypes = [...new Set(ACHIEVEMENTS.map((a) => a.trigger.type))];
  out.push(`achievements: ${ACHIEVEMENTS.length}; triggers: ${JSON.stringify(triggerTypes)}`);
  const badAch = ACHIEVEMENTS.filter(
    (a) => a.trigger.type === 'challenge_complete' && !map.has(a.trigger.challengeId),
  ).map((a) => a.id);
  out.push(`achievements with unknown challenge: ${JSON.stringify(badAch)}`);
  const floorAch = ACHIEVEMENTS.flatMap((a) =>
    a.trigger.type === 'floor_unlock' ? [`${a.id}:${a.trigger.floor}`] : [],
  );
  out.push(`floor_unlock achievement triggers: ${JSON.stringify(floorAch)}`);

  writeReport('consistency.txt', `${out.join('\n')}\n`);
});
