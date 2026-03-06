import { TUTORIAL_STEPS } from './tutorial-steps';
import type { TutorialStep, TutorialTrigger } from './tutorial-steps';

const STORAGE_KEY = 'venomous_snake_tutorial';

interface TutorialState {
  completedSteps: string[];
  skipped: boolean;
}

function loadState(): TutorialState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as TutorialState;
  } catch {
    // ignore parse errors
  }
  return { completedSteps: [], skipped: false };
}

function saveState(state: TutorialState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export class TutorialManager {
  private state: TutorialState;

  constructor() {
    this.state = loadState();
  }

  /** True if the tutorial has been fully skipped by the player */
  isSkipped(): boolean {
    return this.state.skipped;
  }

  /** True if a specific step has already been completed */
  isStepCompleted(stepId: string): boolean {
    return this.state.completedSteps.includes(stepId);
  }

  /** True if every step has been completed */
  isFullyCompleted(): boolean {
    return TUTORIAL_STEPS.every((s) => this.isStepCompleted(s.id));
  }

  /** Mark a step as done and persist. */
  completeStep(stepId: string): void {
    if (!this.isStepCompleted(stepId)) {
      this.state = {
        ...this.state,
        completedSteps: [...this.state.completedSteps, stepId],
      };
      saveState(this.state);
    }
  }

  /** Skip the entire tutorial. Persisted so it does not reappear on reload. */
  skipTutorial(): void {
    this.state = { ...this.state, skipped: true };
    saveState(this.state);
  }

  /** Reset tutorial progress (used for New Game or debug). */
  reset(): void {
    this.state = { completedSteps: [], skipped: false };
    saveState(this.state);
  }

  /**
   * Get the next pending step for a given trigger, or `undefined` if none.
   * Returns `undefined` when the tutorial is skipped.
   */
  getNextStep(trigger: TutorialTrigger): TutorialStep | undefined {
    if (this.state.skipped) return undefined;
    return TUTORIAL_STEPS.find((s) => s.trigger === trigger && !this.isStepCompleted(s.id));
  }

  /** All steps that have been completed so far (ordered). */
  getCompletedSteps(): TutorialStep[] {
    return TUTORIAL_STEPS.filter((s) => this.isStepCompleted(s.id));
  }
}
