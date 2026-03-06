export type DialogSpeaker = 'player' | 'npc' | 'ai_sidekick' | 'narrator';

export interface DialogChoice {
  textKey: string;
  nextNodeId: string;
  condition?: string;
  setsFlag?: string;
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
