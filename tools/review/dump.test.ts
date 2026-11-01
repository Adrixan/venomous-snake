import { it } from 'vitest';
import { allChallenges } from '@venomous-snake/challenges';
import { writeReport } from './report';

it('dump', () => {
  const dump = allChallenges.map((c) => ({
    id: c.id,
    xp: c.xpReward,
    scaffoldedCode: c.scaffoldedCode,
    solutionCode: c.solutionCode,
    testCases: c.testCases,
    hints: c.hints,
    difficulty: c.difficulty,
    chapter: c.chapter,
  }));
  writeReport('challenges.json', JSON.stringify(dump));
});
