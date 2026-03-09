export type DialogSpeaker = 'player' | 'npc' | 'ai_sidekick' | 'narrator';

export interface DialogChoice {
  textKey: string;
  nextNodeId: string;
  condition?: string;
  setsFlag?: string;
  /** itemId that must be in the player's inventory for this choice to appear. */
  requiresItem?: string;
}

export interface DialogNode {
  id: string;
  speaker: DialogSpeaker;
  speakerNameKey?: string;
  textKey: string;
  portraitId?: string;
  choices?: DialogChoice[];
  nextNodeId?: string;
  condition?: string;
  setsFlag?: string;
  triggerEvent?: string;
}

export interface DialogTree {
  id: string;
  startNodeId: string;
  nodes: Record<string, DialogNode>;
}

/** A dialog choice annotated with inventory-gate availability for UI rendering. */
export interface ChoiceWithState {
  choice: DialogChoice;
  /** `true` when the choice passes all conditions and inventory requirements. */
  available: boolean;
  /**
   * Set when `available` is `false` due to an inventory requirement.
   * Format: `'inventory:<itemId>'` — matches `parseLockItemId()` in DialogOverlay.
   */
  lockReason?: string;
}

export interface NarrativeFlag {
  id: string;
  value: boolean | string | number;
  setAt?: string;
}

export interface NarrativeState {
  flags: Record<string, NarrativeFlag>;
  completedDialogs: string[];
  currentDialog?: string;
  currentNode?: string;
  playerName: string;
  playerGender: 'male' | 'female' | 'nonbinary';
}
