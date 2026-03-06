export { chapters } from './chapters';
export { ch01_01_hello_world, ch01_02_variables, ch01_03_math_ops } from './chapter01';

import { ch01_01_hello_world } from './chapter01/ch01_01_hello_world';
import { ch01_02_variables } from './chapter01/ch01_02_variables';
import { ch01_03_math_ops } from './chapter01/ch01_03_math_ops';
import type { Challenge } from '@venomous-snake/shared-types';

/** All challenges indexed by ID */
export const challengeMap: Record<string, Challenge> = {
  [ch01_01_hello_world.id]: ch01_01_hello_world,
  [ch01_02_variables.id]: ch01_02_variables,
  [ch01_03_math_ops.id]: ch01_03_math_ops,
};

/** Get all challenges for a chapter */
export function getChallengesForChapter(chapterNumber: number): Challenge[] {
  return Object.values(challengeMap)
    .filter((c) => c.chapter === chapterNumber)
    .sort((a, b) => a.order - b.order);
}
