export type AchievementTrigger =
  | { type: 'challenge_complete'; challengeId: string }
  | { type: 'chapter_complete'; chapter: number }
  | { type: 'first_try'; challengeId: string }
  | { type: 'no_hints'; challengeId: string }
  | { type: 'speed_run'; challengeId: string; maxTimeMs: number }
  | { type: 'total_challenges'; count: number }
  | { type: 'total_xp'; amount: number }
  | { type: 'streak'; count: number }
  | { type: 'floor_unlock'; floor: string };

export interface Achievement {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  trigger: AchievementTrigger;
  xpReward: number;
  secret: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  // ── Story milestones ──────────────────────────────────────────────────────
  {
    id: 'first_pickup',
    nameKey: 'achievements.first_pickup',
    descriptionKey: 'achievements.first_pickup.desc',
    icon: '📦',
    trigger: { type: 'floor_unlock', floor: '__item_pickup__' },
    xpReward: 15,
    secret: false,
  },
  {
    id: 'first_hack',
    nameKey: 'achievements.first_hack',
    descriptionKey: 'achievements.first_hack.desc',
    icon: '🔓',
    trigger: { type: 'challenge_complete', challengeId: 'ch01_01_hello_world' },
    xpReward: 25,
    secret: false,
  },
  {
    id: 'chapter_1_done',
    nameKey: 'achievements.chapter_1_done',
    descriptionKey: 'achievements.chapter_1_done.desc',
    icon: '⭐',
    trigger: { type: 'chapter_complete', chapter: 1 },
    xpReward: 100,
    secret: false,
  },
  {
    id: 'chapter_2_done',
    nameKey: 'achievements.chapter_2_done',
    descriptionKey: 'achievements.chapter_2_done.desc',
    icon: '🌟',
    trigger: { type: 'chapter_complete', chapter: 2 },
    xpReward: 150,
    secret: false,
  },
  {
    id: 'chapter_3_done',
    nameKey: 'achievements.chapter_3_done',
    descriptionKey: 'achievements.chapter_3_done.desc',
    icon: '💫',
    trigger: { type: 'chapter_complete', chapter: 3 },
    xpReward: 200,
    secret: false,
  },

  // ── Floor unlocks ─────────────────────────────────────────────────────────
  {
    id: 'floor_lobby',
    nameKey: 'achievements.floor_lobby',
    descriptionKey: 'achievements.floor_lobby.desc',
    icon: '🏢',
    trigger: { type: 'floor_unlock', floor: 'lobby' },
    xpReward: 10,
    secret: false,
  },
  {
    id: 'floor_2_unlock',
    nameKey: 'achievements.floor_2_unlock',
    descriptionKey: 'achievements.floor_2_unlock.desc',
    icon: '🔑',
    trigger: { type: 'floor_unlock', floor: 'floor_2' },
    xpReward: 75,
    secret: false,
  },
  {
    id: 'floor_3_unlock',
    nameKey: 'achievements.floor_3_unlock',
    descriptionKey: 'achievements.floor_3_unlock.desc',
    icon: '🗝️',
    trigger: { type: 'floor_unlock', floor: 'floor_3' },
    xpReward: 100,
    secret: false,
  },
  {
    id: 'floor_4_unlock',
    nameKey: 'achievements.floor_4_unlock',
    descriptionKey: 'achievements.floor_4_unlock.desc',
    icon: '🚪',
    trigger: { type: 'floor_unlock', floor: 'floor_4' },
    xpReward: 150,
    secret: false,
  },

  // ── Challenge count milestones ────────────────────────────────────────────
  {
    id: 'five_challenges',
    nameKey: 'achievements.five_challenges',
    descriptionKey: 'achievements.five_challenges.desc',
    icon: '✋',
    trigger: { type: 'total_challenges', count: 5 },
    xpReward: 50,
    secret: false,
  },
  {
    id: 'ten_challenges',
    nameKey: 'achievements.ten_challenges',
    descriptionKey: 'achievements.ten_challenges.desc',
    icon: '🔟',
    trigger: { type: 'total_challenges', count: 10 },
    xpReward: 75,
    secret: false,
  },
  {
    id: 'twenty_challenges',
    nameKey: 'achievements.twenty_challenges',
    descriptionKey: 'achievements.twenty_challenges.desc',
    icon: '📈',
    trigger: { type: 'total_challenges', count: 20 },
    xpReward: 100,
    secret: false,
  },
  {
    id: 'fifty_challenges',
    nameKey: 'achievements.fifty_challenges',
    descriptionKey: 'achievements.fifty_challenges.desc',
    icon: '🏆',
    trigger: { type: 'total_challenges', count: 50 },
    xpReward: 200,
    secret: false,
  },
  {
    id: 'centurion',
    nameKey: 'achievements.centurion',
    descriptionKey: 'achievements.centurion.desc',
    icon: '💯',
    trigger: { type: 'total_challenges', count: 100 },
    xpReward: 500,
    secret: false,
  },

  // ── XP milestones ─────────────────────────────────────────────────────────
  {
    id: 'xp_rookie',
    nameKey: 'achievements.xp_rookie',
    descriptionKey: 'achievements.xp_rookie.desc',
    icon: '🌱',
    trigger: { type: 'total_xp', amount: 500 },
    xpReward: 0,
    secret: false,
  },
  {
    id: 'xp_veteran',
    nameKey: 'achievements.xp_veteran',
    descriptionKey: 'achievements.xp_veteran.desc',
    icon: '⚔️',
    trigger: { type: 'total_xp', amount: 2000 },
    xpReward: 0,
    secret: false,
  },
  {
    id: 'xp_master',
    nameKey: 'achievements.xp_master',
    descriptionKey: 'achievements.xp_master.desc',
    icon: '👑',
    trigger: { type: 'total_xp', amount: 5500 },
    xpReward: 0,
    secret: false,
  },

  // ── Skill / technique achievements ────────────────────────────────────────
  {
    id: 'first_try_hello',
    nameKey: 'achievements.first_try_hello',
    descriptionKey: 'achievements.first_try_hello.desc',
    icon: '🎯',
    trigger: { type: 'first_try', challengeId: 'ch01_01_hello_world' },
    xpReward: 30,
    secret: false,
  },
  {
    id: 'first_try_vars',
    nameKey: 'achievements.first_try_vars',
    descriptionKey: 'achievements.first_try_vars.desc',
    icon: '🎯',
    trigger: { type: 'first_try', challengeId: 'ch01_02_variables' },
    xpReward: 30,
    secret: false,
  },
  {
    id: 'first_try_math',
    nameKey: 'achievements.first_try_math',
    descriptionKey: 'achievements.first_try_math.desc',
    icon: '🧮',
    trigger: { type: 'first_try', challengeId: 'ch01_03_math_ops' },
    xpReward: 30,
    secret: false,
  },
  {
    id: 'no_hints_hello',
    nameKey: 'achievements.no_hints_hello',
    descriptionKey: 'achievements.no_hints_hello.desc',
    icon: '🚫',
    trigger: { type: 'no_hints', challengeId: 'ch01_01_hello_world' },
    xpReward: 20,
    secret: false,
  },
  {
    id: 'no_hints_if',
    nameKey: 'achievements.no_hints_if',
    descriptionKey: 'achievements.no_hints_if.desc',
    icon: '🧩',
    trigger: { type: 'no_hints', challengeId: 'ch03_01_simple_if' },
    xpReward: 40,
    secret: false,
  },

  // ── Speed runs ────────────────────────────────────────────────────────────
  {
    id: 'speed_hello',
    nameKey: 'achievements.speed_hello',
    descriptionKey: 'achievements.speed_hello.desc',
    icon: '⚡',
    trigger: { type: 'speed_run', challengeId: 'ch01_01_hello_world', maxTimeMs: 30_000 },
    xpReward: 50,
    secret: false,
  },
  {
    id: 'speed_vars',
    nameKey: 'achievements.speed_vars',
    descriptionKey: 'achievements.speed_vars.desc',
    icon: '💨',
    trigger: { type: 'speed_run', challengeId: 'ch01_02_variables', maxTimeMs: 60_000 },
    xpReward: 50,
    secret: false,
  },
  {
    id: 'speed_strings',
    nameKey: 'achievements.speed_strings',
    descriptionKey: 'achievements.speed_strings.desc',
    icon: '🏎️',
    trigger: { type: 'speed_run', challengeId: 'ch02_01_string_methods', maxTimeMs: 90_000 },
    xpReward: 60,
    secret: false,
  },

  // ── Streaks ───────────────────────────────────────────────────────────────
  {
    id: 'streak_3',
    nameKey: 'achievements.streak_3',
    descriptionKey: 'achievements.streak_3.desc',
    icon: '🔥',
    trigger: { type: 'streak', count: 3 },
    xpReward: 40,
    secret: false,
  },
  {
    id: 'streak_5',
    nameKey: 'achievements.streak_5',
    descriptionKey: 'achievements.streak_5.desc',
    icon: '🔥',
    trigger: { type: 'streak', count: 5 },
    xpReward: 75,
    secret: false,
  },
  {
    id: 'streak_10',
    nameKey: 'achievements.streak_10',
    descriptionKey: 'achievements.streak_10.desc',
    icon: '🌋',
    trigger: { type: 'streak', count: 10 },
    xpReward: 150,
    secret: false,
  },

  // ── Secret achievements ───────────────────────────────────────────────────
  {
    id: 'perfectionist',
    nameKey: 'achievements.perfectionist',
    descriptionKey: 'achievements.perfectionist.desc',
    icon: '💎',
    trigger: { type: 'total_challenges', count: 10 },
    xpReward: 200,
    secret: true,
  },
  {
    id: 'venomous_title',
    nameKey: 'achievements.venomous_title',
    descriptionKey: 'achievements.venomous_title.desc',
    icon: '🐍',
    trigger: { type: 'total_xp', amount: 5500 },
    xpReward: 250,
    secret: true,
  },
  {
    id: 'no_hints_chapter',
    nameKey: 'achievements.no_hints_chapter',
    descriptionKey: 'achievements.no_hints_chapter.desc',
    icon: '🧠',
    trigger: { type: 'chapter_complete', chapter: 1 },
    xpReward: 150,
    secret: true,
  },
  {
    id: 'elite_streak',
    nameKey: 'achievements.elite_streak',
    descriptionKey: 'achievements.elite_streak.desc',
    icon: '🌟',
    trigger: { type: 'streak', count: 20 },
    xpReward: 300,
    secret: true,
  },
];

export class AchievementManager {
  private unlocked: Set<string>;

  constructor(unlockedAchievements?: string[]) {
    this.unlocked = new Set(unlockedAchievements ?? []);
  }

  /** Checks an event against all achievements; returns newly unlocked ones. */
  check(event: AchievementTrigger): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    for (const achievement of ACHIEVEMENTS) {
      if (this.unlocked.has(achievement.id)) continue;
      if (this.matchesTrigger(achievement.trigger, event)) {
        this.unlocked.add(achievement.id);
        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  }

  private matchesTrigger(trigger: AchievementTrigger, event: AchievementTrigger): boolean {
    switch (trigger.type) {
      case 'challenge_complete':
        return event.type === 'challenge_complete' && trigger.challengeId === event.challengeId;
      case 'chapter_complete':
        return event.type === 'chapter_complete' && trigger.chapter === event.chapter;
      case 'first_try':
        return event.type === 'first_try' && trigger.challengeId === event.challengeId;
      case 'no_hints':
        return event.type === 'no_hints' && trigger.challengeId === event.challengeId;
      case 'speed_run':
        return (
          event.type === 'speed_run' &&
          trigger.challengeId === event.challengeId &&
          event.maxTimeMs <= trigger.maxTimeMs
        );
      case 'total_challenges':
        return event.type === 'total_challenges' && event.count >= trigger.count;
      case 'total_xp':
        return event.type === 'total_xp' && event.amount >= trigger.amount;
      case 'streak':
        return event.type === 'streak' && event.count >= trigger.count;
      case 'floor_unlock':
        return event.type === 'floor_unlock' && trigger.floor === event.floor;
    }
  }

  isUnlocked(achievementId: string): boolean {
    return this.unlocked.has(achievementId);
  }

  getAll(): Achievement[] {
    return [...ACHIEVEMENTS];
  }

  getUnlocked(): Achievement[] {
    return ACHIEVEMENTS.filter((a) => this.unlocked.has(a.id));
  }

  toJSON(): string[] {
    return [...this.unlocked];
  }
}
