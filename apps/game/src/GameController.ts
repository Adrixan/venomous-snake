import type { Challenge, CurriculumProgress, PythonInterpreter } from '@venomous-snake/shared-types';
import {
  ChallengeRunner,
  HintEngine,
  ProgressionManager,
  XPSystem,
  AchievementManager,
  ChallengeTimer,
} from '@venomous-snake/challenge-engine';
import type { TestResult, ChallengeResult, Achievement, LevelThreshold } from '@venomous-snake/challenge-engine';
import { CipherAI, DialogEngine } from '@venomous-snake/narrative';
import { challengeMap } from '@venomous-snake/challenges';

export interface StartChallengeResult {
  challenge: Challenge;
  cipherIntro: string;
}

export interface SubmitResult {
  passed: boolean;
  testResults: TestResult[];
  xpEarned: number;
  newLevel: LevelThreshold | null;
  achievements: Achievement[];
  cipherReaction: string;
}

export interface HintResult {
  hint: string;
  tier: number;
  cipherWrapped: string;
}

export class GameController {
  private challengeRunner: ChallengeRunner;
  private hintEngine: HintEngine;
  private progression: ProgressionManager;
  private xpSystem: XPSystem;
  private achievements: AchievementManager;
  private timer: ChallengeTimer;
  private dialogEngine: DialogEngine;
  private cipher: CipherAI;
  private activeChallenge: Challenge | null = null;

  constructor(interpreter: PythonInterpreter, savedProgress?: CurriculumProgress) {
    this.challengeRunner = new ChallengeRunner(interpreter);
    this.hintEngine = new HintEngine();
    this.progression = new ProgressionManager(savedProgress);
    this.xpSystem = new XPSystem();
    this.achievements = new AchievementManager();
    this.timer = new ChallengeTimer();
    this.dialogEngine = new DialogEngine();
    this.cipher = new CipherAI();
  }

  // ── Challenge flow ──────────────────────────────────────────────────────────

  startChallenge(challengeId: string): StartChallengeResult | null {
    const challenge = challengeMap[challengeId];
    if (challenge === undefined) return null;
    if (!this.progression.isUnlocked(challenge)) return null;

    this.activeChallenge = challenge;
    this.hintEngine.resetHints(challengeId);
    this.timer.start();

    const cipherIntro = this.cipher.getLine('challenge_start');
    return { challenge, cipherIntro };
  }

  async submitCode(code: string): Promise<SubmitResult> {
    if (this.activeChallenge === null) {
      return {
        passed: false,
        testResults: [],
        xpEarned: 0,
        newLevel: null,
        achievements: [],
        cipherReaction: this.cipher.getLine('challenge_fail'),
      };
    }

    const challenge = this.activeChallenge;
    const timeMs = this.timer.stop();

    const progressBefore = this.progression.getChallengeProgress(challenge.id);
    const levelBefore = this.xpSystem.getLevelForXP(this.progression.getProgress().totalXp);

    const result: ChallengeResult = await this.challengeRunner.runChallenge(challenge, code);

    if (result.allPassed) {
      const hintsUsed = this.hintEngine.getHintsUsedCount(challenge.id);
      // attempts = previous attempts + 1 for this successful run
      const attempts = (progressBefore?.attempts ?? 0) + 1;

      const xpEarned = this.xpSystem.calculateXPReward(
        challenge.xpReward,
        attempts,
        hintsUsed,
        timeMs,
      );

      this.progression.markCompleted(challenge, timeMs, hintsUsed, code);

      const progressAfter = this.progression.getProgress();
      const levelAfter = this.xpSystem.getLevelForXP(progressAfter.totalXp);

      const newAchievements: Achievement[] = [
        ...this.achievements.check({ type: 'challenge_complete', challengeId: challenge.id }),
        ...this.achievements.check({ type: 'total_challenges', count: progressAfter.completedChallenges }),
        ...this.achievements.check({ type: 'total_xp', amount: progressAfter.totalXp }),
        ...(attempts === 1
          ? this.achievements.check({ type: 'first_try', challengeId: challenge.id })
          : []),
        ...(hintsUsed === 0
          ? this.achievements.check({ type: 'no_hints', challengeId: challenge.id })
          : []),
        ...this.achievements.check({ type: 'speed_run', challengeId: challenge.id, maxTimeMs: timeMs }),
      ];

      this.activeChallenge = null;

      return {
        passed: true,
        testResults: result.testResults,
        xpEarned,
        newLevel: levelAfter.level > levelBefore.level ? levelAfter : null,
        achievements: newAchievements,
        cipherReaction: this.cipher.getReaction(true, attempts, hintsUsed),
      };
    }

    // Failed attempt — record it but keep challenge active
    this.progression.recordAttempt(challenge.id, code);
    const currentProgress = this.progression.getChallengeProgress(challenge.id);
    const attempts = currentProgress?.attempts ?? 1;

    return {
      passed: false,
      testResults: result.testResults,
      xpEarned: 0,
      newLevel: null,
      achievements: [],
      cipherReaction: this.cipher.getReaction(false, attempts, 0),
    };
  }

  getHint(): HintResult | null {
    if (this.activeChallenge === null) return null;

    const hintResult = this.hintEngine.getHint(this.activeChallenge);
    if (hintResult === null) return null;

    return {
      hint: hintResult.hint,
      tier: hintResult.tier,
      cipherWrapped: this.cipher.wrapHint(hintResult.hint),
    };
  }

  abandonChallenge(): void {
    if (this.activeChallenge !== null) {
      this.timer.stop();
      this.activeChallenge = null;
    }
  }

  // ── State ───────────────────────────────────────────────────────────────────

  getProgress(): CurriculumProgress {
    return this.progression.getProgress();
  }

  getChallengeStatus(challengeId: string): 'locked' | 'available' | 'completed' {
    const challenge = challengeMap[challengeId];
    if (challenge === undefined) return 'locked';

    const cp = this.progression.getChallengeProgress(challengeId);
    if (cp?.completed === true) return 'completed';

    if (!this.progression.isUnlocked(challenge)) return 'locked';

    return 'available';
  }

  getDialogEngine(): DialogEngine {
    return this.dialogEngine;
  }

  // ── Save / Load ─────────────────────────────────────────────────────────────

  serialize(): string {
    return JSON.stringify({
      progress: this.progression.toJSON(),
      achievements: this.achievements.toJSON(),
    });
  }

  static deserialize(data: string, interpreter: PythonInterpreter): GameController {
    const parsed = JSON.parse(data) as {
      progress: CurriculumProgress;
      achievements?: string[];
    };
    const controller = new GameController(interpreter, parsed.progress);
    if (parsed.achievements !== undefined) {
      controller.achievements = new AchievementManager(parsed.achievements);
    }
    return controller;
  }
}
