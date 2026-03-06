export type SkillCategory =
  | 'fundamentals'
  | 'control_flow'
  | 'functions'
  | 'data_structures'
  | 'oop'
  | 'advanced';

export interface SkillNode {
  id: string;
  nameKey: string;
  descriptionKey: string;
  category: SkillCategory;
  icon: string;
  prerequisites: string[];
  requiredChallenges: string[];
  xpCost: number;
  unlockEffect?: string;
}

export const SKILL_TREE: SkillNode[] = [
  // ── Fundamentals ───────────────────────────────────────────────────────────
  {
    id: 'print_master',
    nameKey: 'skills.print_master',
    descriptionKey: 'skills.print_master.desc',
    category: 'fundamentals',
    icon: '🖨️',
    prerequisites: [],
    requiredChallenges: ['ch01_01_hello_world'],
    xpCost: 0,
  },
  {
    id: 'variable_basics',
    nameKey: 'skills.variable_basics',
    descriptionKey: 'skills.variable_basics.desc',
    category: 'fundamentals',
    icon: '📦',
    prerequisites: ['print_master'],
    requiredChallenges: ['ch01_02_variables'],
    xpCost: 0,
  },
  {
    id: 'math_wizard',
    nameKey: 'skills.math_wizard',
    descriptionKey: 'skills.math_wizard.desc',
    category: 'fundamentals',
    icon: '🧮',
    prerequisites: ['variable_basics'],
    requiredChallenges: ['ch01_03_math_ops'],
    xpCost: 50,
  },
  {
    id: 'type_aware',
    nameKey: 'skills.type_aware',
    descriptionKey: 'skills.type_aware.desc',
    category: 'fundamentals',
    icon: '🔤',
    prerequisites: ['variable_basics'],
    requiredChallenges: ['ch01_04_string_types'],
    xpCost: 50,
  },
  {
    id: 'float_handler',
    nameKey: 'skills.float_handler',
    descriptionKey: 'skills.float_handler.desc',
    category: 'fundamentals',
    icon: '🔢',
    prerequisites: ['math_wizard'],
    requiredChallenges: ['ch01_05_float_calculations'],
    xpCost: 75,
  },

  // ── Control Flow ────────────────────────────────────────────────────────────
  {
    id: 'if_master',
    nameKey: 'skills.if_master',
    descriptionKey: 'skills.if_master.desc',
    category: 'control_flow',
    icon: '🔀',
    prerequisites: ['variable_basics'],
    requiredChallenges: ['ch03_01_simple_if'],
    xpCost: 0,
  },
  {
    id: 'comparison_expert',
    nameKey: 'skills.comparison_expert',
    descriptionKey: 'skills.comparison_expert.desc',
    category: 'control_flow',
    icon: '⚖️',
    prerequisites: ['if_master'],
    requiredChallenges: ['ch03_03_comparison_operators'],
    xpCost: 75,
  },
  {
    id: 'logic_guru',
    nameKey: 'skills.logic_guru',
    descriptionKey: 'skills.logic_guru.desc',
    category: 'control_flow',
    icon: '🧠',
    prerequisites: ['comparison_expert'],
    requiredChallenges: ['ch03_05_logical_operators'],
    xpCost: 100,
  },
  {
    id: 'elif_master',
    nameKey: 'skills.elif_master',
    descriptionKey: 'skills.elif_master.desc',
    category: 'control_flow',
    icon: '🌿',
    prerequisites: ['if_master'],
    requiredChallenges: ['ch03_04_if_elif_else'],
    xpCost: 75,
  },
  {
    id: 'nested_logic',
    nameKey: 'skills.nested_logic',
    descriptionKey: 'skills.nested_logic.desc',
    category: 'control_flow',
    icon: '🔁',
    prerequisites: ['elif_master', 'logic_guru'],
    requiredChallenges: ['ch03_06_nested_if'],
    xpCost: 150,
    unlockEffect: 'hint_boost',
  },

  // ── Functions ───────────────────────────────────────────────────────────────
  {
    id: 'def_starter',
    nameKey: 'skills.def_starter',
    descriptionKey: 'skills.def_starter.desc',
    category: 'functions',
    icon: '🛠️',
    prerequisites: ['type_aware'],
    requiredChallenges: ['ch01_06_string_concatenation'],
    xpCost: 100,
  },
  {
    id: 'param_master',
    nameKey: 'skills.param_master',
    descriptionKey: 'skills.param_master.desc',
    category: 'functions',
    icon: '📋',
    prerequisites: ['def_starter'],
    requiredChallenges: ['ch01_07_multiple_prints'],
    xpCost: 100,
  },
  {
    id: 'return_value',
    nameKey: 'skills.return_value',
    descriptionKey: 'skills.return_value.desc',
    category: 'functions',
    icon: '↩️',
    prerequisites: ['param_master'],
    requiredChallenges: ['ch02_06_type_conversion'],
    xpCost: 150,
  },
  {
    id: 'default_params',
    nameKey: 'skills.default_params',
    descriptionKey: 'skills.default_params.desc',
    category: 'functions',
    icon: '🎯',
    prerequisites: ['return_value'],
    requiredChallenges: ['ch02_07_string_formatting'],
    xpCost: 200,
  },
  {
    id: 'recursion_unlocked',
    nameKey: 'skills.recursion_unlocked',
    descriptionKey: 'skills.recursion_unlocked.desc',
    category: 'functions',
    icon: '🌀',
    prerequisites: ['default_params'],
    requiredChallenges: ['ch02_08_len_and_string_ops'],
    xpCost: 300,
    unlockEffect: 'speed_bonus',
  },

  // ── Data Structures ─────────────────────────────────────────────────────────
  {
    id: 'list_basics',
    nameKey: 'skills.list_basics',
    descriptionKey: 'skills.list_basics.desc',
    category: 'data_structures',
    icon: '📝',
    prerequisites: ['variable_basics'],
    requiredChallenges: ['ch02_01_string_methods'],
    xpCost: 75,
  },
  {
    id: 'list_methods',
    nameKey: 'skills.list_methods',
    descriptionKey: 'skills.list_methods.desc',
    category: 'data_structures',
    icon: '🗂️',
    prerequisites: ['list_basics'],
    requiredChallenges: ['ch02_02_string_indexing'],
    xpCost: 100,
  },
  {
    id: 'dict_basics',
    nameKey: 'skills.dict_basics',
    descriptionKey: 'skills.dict_basics.desc',
    category: 'data_structures',
    icon: '📖',
    prerequisites: ['list_methods'],
    requiredChallenges: ['ch02_03_string_slicing'],
    xpCost: 150,
  },
  {
    id: 'tuple_basics',
    nameKey: 'skills.tuple_basics',
    descriptionKey: 'skills.tuple_basics.desc',
    category: 'data_structures',
    icon: '🔒',
    prerequisites: ['list_basics'],
    requiredChallenges: ['ch02_04_fstrings_basics'],
    xpCost: 100,
  },
  {
    id: 'set_basics',
    nameKey: 'skills.set_basics',
    descriptionKey: 'skills.set_basics.desc',
    category: 'data_structures',
    icon: '🎲',
    prerequisites: ['dict_basics', 'tuple_basics'],
    requiredChallenges: ['ch02_05_input_basics'],
    xpCost: 200,
    unlockEffect: 'hint_boost',
  },

  // ── OOP ─────────────────────────────────────────────────────────────────────
  {
    id: 'class_basics',
    nameKey: 'skills.class_basics',
    descriptionKey: 'skills.class_basics.desc',
    category: 'oop',
    icon: '🏗️',
    prerequisites: ['def_starter', 'dict_basics'],
    requiredChallenges: ['ch03_07_boolean_variables'],
    xpCost: 200,
  },
  {
    id: 'constructor_master',
    nameKey: 'skills.constructor_master',
    descriptionKey: 'skills.constructor_master.desc',
    category: 'oop',
    icon: '⚙️',
    prerequisites: ['class_basics'],
    requiredChallenges: ['ch03_08_complex_conditions'],
    xpCost: 200,
  },
  {
    id: 'method_master',
    nameKey: 'skills.method_master',
    descriptionKey: 'skills.method_master.desc',
    category: 'oop',
    icon: '🎪',
    prerequisites: ['constructor_master'],
    requiredChallenges: ['ch03_08_complex_conditions'],
    xpCost: 250,
  },
  {
    id: 'inheritance_basics',
    nameKey: 'skills.inheritance_basics',
    descriptionKey: 'skills.inheritance_basics.desc',
    category: 'oop',
    icon: '🧬',
    prerequisites: ['method_master'],
    requiredChallenges: ['ch03_08_complex_conditions'],
    xpCost: 350,
  },
  {
    id: 'polymorphism',
    nameKey: 'skills.polymorphism',
    descriptionKey: 'skills.polymorphism.desc',
    category: 'oop',
    icon: '🦋',
    prerequisites: ['inheritance_basics'],
    requiredChallenges: ['ch03_08_complex_conditions'],
    xpCost: 500,
    unlockEffect: 'speed_bonus',
  },

  // ── Advanced ─────────────────────────────────────────────────────────────────
  {
    id: 'comprehension_list',
    nameKey: 'skills.comprehension_list',
    descriptionKey: 'skills.comprehension_list.desc',
    category: 'advanced',
    icon: '⚡',
    prerequisites: ['list_methods', 'logic_guru'],
    requiredChallenges: ['ch03_08_complex_conditions'],
    xpCost: 300,
  },
  {
    id: 'lambda_func',
    nameKey: 'skills.lambda_func',
    descriptionKey: 'skills.lambda_func.desc',
    category: 'advanced',
    icon: '🔬',
    prerequisites: ['return_value'],
    requiredChallenges: ['ch03_08_complex_conditions'],
    xpCost: 300,
  },
  {
    id: 'decorator_basics',
    nameKey: 'skills.decorator_basics',
    descriptionKey: 'skills.decorator_basics.desc',
    category: 'advanced',
    icon: '🎨',
    prerequisites: ['lambda_func', 'class_basics'],
    requiredChallenges: ['ch03_08_complex_conditions'],
    xpCost: 500,
    unlockEffect: 'hint_boost',
  },
  {
    id: 'generator_basics',
    nameKey: 'skills.generator_basics',
    descriptionKey: 'skills.generator_basics.desc',
    category: 'advanced',
    icon: '🔋',
    prerequisites: ['comprehension_list'],
    requiredChallenges: ['ch03_08_complex_conditions'],
    xpCost: 400,
  },
  {
    id: 'context_manager',
    nameKey: 'skills.context_manager',
    descriptionKey: 'skills.context_manager.desc',
    category: 'advanced',
    icon: '🛡️',
    prerequisites: ['decorator_basics', 'generator_basics'],
    requiredChallenges: ['ch03_08_complex_conditions'],
    xpCost: 600,
    unlockEffect: 'speed_bonus',
  },
];

export class SkillTreeManager {
  private unlocked: Set<string>;

  constructor(unlockedSkills?: string[]) {
    this.unlocked = new Set(unlockedSkills ?? []);
  }

  isUnlocked(skillId: string): boolean {
    return this.unlocked.has(skillId);
  }

  canUnlock(skillId: string, completedChallenges: string[], xp: number): boolean {
    const node = SKILL_TREE.find((n) => n.id === skillId);
    if (node === undefined) return false;
    if (this.unlocked.has(skillId)) return false;

    const prereqsMet = node.prerequisites.every((prereqId) => this.unlocked.has(prereqId));
    if (!prereqsMet) return false;

    const challengesMet = node.requiredChallenges.every((challengeId) =>
      completedChallenges.includes(challengeId),
    );
    if (!challengesMet) return false;

    return xp >= node.xpCost;
  }

  unlock(skillId: string): void {
    this.unlocked.add(skillId);
  }

  getUnlockedSkills(): string[] {
    return [...this.unlocked];
  }

  getAvailableSkills(completedChallenges: string[], xp: number): SkillNode[] {
    return SKILL_TREE.filter((node) => this.canUnlock(node.id, completedChallenges, xp));
  }

  toJSON(): string[] {
    return [...this.unlocked];
  }
}
