export type TutorialTrigger = 'game_start' | 'first_terminal' | 'first_challenge' | 'first_success';

export interface TutorialStep {
  id: string;
  trigger: TutorialTrigger;
  /** i18n key for CIPHER's dialog line (story namespace) */
  cipherDialog: string;
  /** CSS selector or logical area name to spotlight */
  highlightElement?: string;
  /** What the player needs to do to advance past this step */
  requiredAction?: string;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'movement',
    trigger: 'game_start',
    cipherDialog: 'story:tutorial.step.movement',
    highlightElement: '[data-tutorial="nearest-terminal"]',
    requiredAction: 'move',
  },
  {
    id: 'interaction',
    trigger: 'game_start',
    cipherDialog: 'story:tutorial.step.interaction',
    highlightElement: '[data-tutorial="nearest-terminal"]',
    requiredAction: 'interact',
  },
  {
    id: 'terminal-basics',
    trigger: 'first_terminal',
    cipherDialog: 'story:tutorial.step.terminalBasics',
    highlightElement: '[data-tutorial="code-editor"]',
    requiredAction: 'type_code',
  },
  {
    id: 'code-submit',
    trigger: 'first_terminal',
    cipherDialog: 'story:tutorial.step.codeSubmit',
    highlightElement: '[data-tutorial="run-submit-buttons"]',
    requiredAction: 'submit',
  },
  {
    id: 'first-success',
    trigger: 'first_success',
    cipherDialog: 'story:tutorial.step.firstSuccess',
    highlightElement: '[data-tutorial="xp-bar"]',
  },
];
