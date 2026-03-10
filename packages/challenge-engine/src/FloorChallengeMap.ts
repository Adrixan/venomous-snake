/** Floor-to-challenge mapping and progression helpers. */

export interface FloorConfig {
  floorNumber: number;
  name: string;
  subtitle: string;
  chapterIds: string[];
  challengeIds: string[];
  requiredCompletions: number;
}

export const floorConfigs: FloorConfig[] = [
  {
    floorNumber: 0,
    name: 'Lobby',
    subtitle: 'The mission begins here…',
    chapterIds: ['1', '2'],
    challengeIds: [
      'ch01_01_hello_world',
      'ch01_02_variables',
      'ch01_03_math_ops',
      'ch01_04_string_types',
      'ch01_05_float_calculations',
      'ch01_06_string_concatenation',
      'ch01_07_multiple_prints',
      'ch01_08_comments',
      'ch02_01_string_methods',
      'ch02_02_string_indexing',
      'ch02_03_string_slicing',
      'ch02_04_fstrings_basics',
      'ch02_05_input_basics',
      'ch02_06_type_conversion',
      'ch02_07_string_formatting',
      'ch02_08_len_and_string_ops',
    ],
    requiredCompletions: 8,
  },
  {
    floorNumber: 1,
    name: 'Server Room',
    subtitle: 'The machines never sleep.',
    chapterIds: ['3'],
    challengeIds: [
      'ch03_01_simple_if',
      'ch03_02_if_else',
      'ch03_03_comparison_operators',
      'ch03_04_if_elif_else',
      'ch03_05_logical_operators',
      'ch03_06_nested_if',
      'ch03_07_boolean_variables',
      'ch03_08_complex_conditions',
    ],
    requiredCompletions: 8,
  },
  {
    floorNumber: 2,
    name: 'R&D Lab',
    subtitle: 'Iterate until it breaks.',
    chapterIds: ['4'],
    challengeIds: [
      'ch04_01_simple_for_loop',
      'ch04_02_range_basics',
      'ch04_03_for_with_range',
      'ch04_04_while_basics',
      'ch04_05_while_condition',
      'ch04_06_break_statement',
      'ch04_07_continue_statement',
      'ch04_08_nested_loops',
      'ch04_09_loop_accumulator',
      'ch04_10_for_enumerate',
    ],
    requiredCompletions: 10,
  },
  {
    floorNumber: 3,
    name: 'Surveillance Hub',
    subtitle: 'All eyes are watching…',
    chapterIds: ['5'],
    challengeIds: [
      'ch05_01_simple_function',
      'ch05_02_function_return',
      'ch05_03_multiple_parameters',
      'ch05_04_default_parameters',
      'ch05_05_return_multiple',
      'ch05_06_functions_calling_functions',
      'ch05_07_scope',
      'ch05_08_args',
      'ch05_09_kwargs',
      'ch05_10_lambda',
    ],
    requiredCompletions: 10,
  },
  {
    floorNumber: 4,
    name: 'Data Archives',
    subtitle: 'Every byte tells a story.',
    chapterIds: ['6'],
    challengeIds: [
      'ch06_01_create_list',
      'ch06_02_list_methods',
      'ch06_03_list_slicing',
      'ch06_04_list_comprehension',
      'ch06_05_tuples',
      'ch06_06_dictionaries',
      'ch06_07_dict_methods',
      'ch06_08_nested_dicts',
      'ch06_09_sets',
      'ch06_10_combining_collections',
    ],
    requiredCompletions: 10,
  },
  {
    floorNumber: 5,
    name: 'Communications',
    subtitle: 'Signal in the noise.',
    chapterIds: ['7'],
    challengeIds: [
      'ch07_01_read_file',
      'ch07_02_write_file',
      'ch07_03_file_line_processing',
      'ch07_04_csv_parsing',
      'ch07_05_string_split_join',
      'ch07_06_with_statement',
      'ch07_07_json_parsing',
      'ch07_08_data_transformation',
    ],
    requiredCompletions: 8,
  },
  {
    floorNumber: 6,
    name: 'Executive Wing',
    subtitle: 'Power has its privileges.',
    chapterIds: ['8'],
    challengeIds: [
      'ch08_01_try_except',
      'ch08_02_multiple_except',
      'ch08_03_try_except_else_finally',
      'ch08_04_raising_exceptions',
      'ch08_05_custom_exception_classes',
      'ch08_06_input_validation_with_errors',
      'ch08_07_graceful_degradation',
      'ch08_08_error_handling_in_loops',
    ],
    requiredCompletions: 8,
  },
  {
    floorNumber: 7,
    name: 'Manufacturing',
    subtitle: 'Build it to destroy it.',
    chapterIds: ['9'],
    challengeIds: [
      'ch09_01_importing_modules',
      'ch09_02_from_import',
      'ch09_03_lambda_functions',
      'ch09_04_map_function',
      'ch09_05_filter_function',
      'ch09_06_list_comprehension_conditionals',
      'ch09_07_dictionary_comprehension',
      'ch09_08_string_formatting_advanced',
      'ch09_09_regular_expressions',
      'ch09_10_combining_tools',
    ],
    requiredCompletions: 10,
  },
  {
    floorNumber: 8,
    name: 'Research Vault',
    subtitle: 'Knowledge locked behind glass.',
    chapterIds: ['10'],
    challengeIds: [
      'ch10_01_simple_class',
      'ch10_02_methods',
      'ch10_03_init_constructor',
      'ch10_04_str_repr',
      'ch10_05_inheritance',
      'ch10_06_method_override',
      'ch10_07_encapsulation',
      'ch10_08_class_static_methods',
      'ch10_09_composition',
      'ch10_10_polymorphism',
    ],
    requiredCompletions: 10,
  },
  {
    floorNumber: 9,
    name: 'AI Core',
    subtitle: 'The system learns from you.',
    chapterIds: ['11'],
    challengeIds: [
      'ch11_01_type_hints',
      'ch11_02_dataclasses',
      'ch11_03_assert_statements',
      'ch11_04_writing_simple_tests',
      'ch11_05_docstrings',
      'ch11_06_constants_enums',
      'ch11_07_list_typing',
      'ch11_08_putting_it_together',
    ],
    requiredCompletions: 8,
  },
  {
    floorNumber: 10,
    name: 'Penthouse',
    subtitle: 'Almost at the top…',
    chapterIds: ['12'],
    challengeIds: [
      'ch12_01_generators',
      'ch12_02_generator_expressions',
      'ch12_03_decorators_basics',
      'ch12_04_decorators_with_args',
      'ch12_05_context_managers',
      'ch12_06_async_basics',
      'ch12_07_pattern_matching',
      'ch12_08_walrus_operator',
      'ch12_09_advanced_comprehensions',
    ],
    requiredCompletions: 9,
  },
  {
    floorNumber: 11,
    name: 'Rooftop',
    subtitle: 'The final showdown awaits.',
    chapterIds: ['12'],
    challengeIds: ['ch12_10_final_showdown'],
    requiredCompletions: 1,
  },
];

/** Returns the FloorConfig for the given floor number, or undefined if not found. */
export function getFloorConfig(floorNumber: number): FloorConfig | undefined {
  return floorConfigs.find((c) => c.floorNumber === floorNumber);
}

/** Returns the list of challenge IDs required on the given floor. */
export function getChallengesForFloor(floorNumber: number): string[] {
  return getFloorConfig(floorNumber)?.challengeIds ?? [];
}

/** Returns true when all required challenges on the floor are completed. */
export function isFloorComplete(floorNumber: number, completedChallenges: string[]): boolean {
  const config = getFloorConfig(floorNumber);
  if (config === undefined) return false;
  const completedSet = new Set(completedChallenges);
  const completedOnFloor = config.challengeIds.filter((id) => completedSet.has(id)).length;
  return completedOnFloor >= config.requiredCompletions;
}

/**
 * Returns the highest consecutive floor number that is unlocked given the
 * provided set of completed challenges. Floor 0 (Lobby) is always unlocked.
 */
export function getNextUnlockedFloor(completedChallenges: string[]): number {
  let maxUnlocked = 0;
  for (const config of floorConfigs) {
    if (config.floorNumber === 0) continue;
    if (isFloorComplete(config.floorNumber - 1, completedChallenges)) {
      maxUnlocked = config.floorNumber;
    } else {
      break;
    }
  }
  return maxUnlocked;
}

/** Returns completion statistics for a floor given completed challenges. */
export function getFloorProgress(
  floorNumber: number,
  completedChallenges: string[],
): { completed: number; total: number; percentage: number } {
  const config = getFloorConfig(floorNumber);
  if (config === undefined) return { completed: 0, total: 0, percentage: 0 };
  const completedSet = new Set(completedChallenges);
  const completed = config.challengeIds.filter((id) => completedSet.has(id)).length;
  const total = config.requiredCompletions;
  return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
}

/** Converts a floor ID string (e.g. 'lobby', 'floor_3') to a floor number. */
export function getFloorNumberFromId(floorId: string): number {
  if (floorId === 'lobby') return 0;
  const match = /^floor_(\d+)$/.exec(floorId);
  if (match !== null && match[1] !== undefined) return parseInt(match[1], 10);
  return 0;
}

/** Converts a floor number to a floor ID string (e.g. 0 → 'lobby', 3 → 'floor_3'). */
export function getFloorIdFromNumber(floorNumber: number): string {
  return floorNumber === 0 ? 'lobby' : `floor_${floorNumber}`;
}
