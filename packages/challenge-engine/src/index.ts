export { ChallengeRunner } from './ChallengeRunner';
export { findUnmetChecks, hasPlaceholder } from './StructureChecker';
export type { TestFailure, TestResult, ChallengeResult } from './ChallengeRunner';
export { HintEngine, challengeKey } from './HintEngine';
export type { HintResult } from './HintEngine';
export { ProgressionManager } from './ProgressionManager';
export { XPSystem, LEVEL_THRESHOLDS } from './XPSystem';
export type { LevelThreshold } from './XPSystem';
export { SkillTreeManager, SKILL_TREE } from './SkillTree';
export type { SkillNode, SkillCategory } from './SkillTree';
export { AchievementManager, ACHIEVEMENTS } from './Achievements';
export type { Achievement, AchievementTrigger } from './Achievements';
export { ChallengeTimer } from './ChallengeTimer';
export {
  floorConfigs,
  getFloorConfig,
  getChallengesForFloor,
  isFloorComplete,
  getNextUnlockedFloor,
  getFloorProgress,
  getFloorNumberFromId,
  getFloorIdFromNumber,
} from './FloorChallengeMap';
export type { FloorConfig } from './FloorChallengeMap';
export { FloorGateSystem } from './FloorGateSystem';
export type { FloorGateResult } from './FloorGateSystem';
