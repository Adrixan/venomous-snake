import type { Challenge } from '@venomous-snake/shared-types';
import * as chapter01 from './chapter01';
import * as chapter02 from './chapter02';
import * as chapter03 from './chapter03';
import * as chapter04 from './chapter04';
import * as chapter05 from './chapter05';
import * as chapter06 from './chapter06';
import * as chapter07 from './chapter07';
import * as chapter08 from './chapter08';
import * as chapter09 from './chapter09';
import * as chapter10 from './chapter10';
import * as chapter11 from './chapter11';
import * as chapter12 from './chapter12';

export { chapters } from './chapters';
export {
  FLOORS,
  FINAL_FLOOR_NUMBER,
  BOSS_CHALLENGE_ID,
  floorIdFromNumber,
  floorNumberFromId,
  getFloor,
  getFloorForChallenge,
} from './floors';
export type { FloorDefinition } from './floors';

const chapterModules: Array<Record<string, Challenge>> = [
  chapter01,
  chapter02,
  chapter03,
  chapter04,
  chapter05,
  chapter06,
  chapter07,
  chapter08,
  chapter09,
  chapter10,
  chapter11,
  chapter12,
];

/** Every challenge, ordered by chapter and position. */
export const allChallenges: Challenge[] = chapterModules
  .flatMap((module) => Object.values(module))
  .sort((a, b) => a.chapter - b.chapter || a.order - b.order);

/** All challenges indexed by ID. */
export const challengeMap: Record<string, Challenge> = Object.fromEntries(
  allChallenges.map((challenge) => [challenge.id, challenge]),
);

export const TOTAL_CHALLENGES = allChallenges.length;

/** Get all challenges for a chapter, in order. */
export function getChallengesForChapter(chapterNumber: number): Challenge[] {
  return allChallenges.filter((c) => c.chapter === chapterNumber);
}
