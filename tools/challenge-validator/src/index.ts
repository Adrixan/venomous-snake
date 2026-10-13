// @venomous-snake/challenge-validator
// Validation rules for challenge definitions; executed by the test suite and reusable from tooling.
export { validateStructure, validateExecution } from './validate';
export type { Violation } from './validate';
export const CHALLENGE_VALIDATOR_VERSION = '0.1.0';
