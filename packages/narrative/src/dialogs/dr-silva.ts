import type { DialogTree } from '../types';

/** Dr. Silva — patrols the lab wing, hints about the first terminal challenge. */
export const drSilvaDialog: DialogTree = {
  id: 'dr_silva',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.silva.speaker',
      textKey: 'npc.silva.n1',
      portraitId: 'silva',
      choices: [
        { textKey: 'npc.silva.n1_choice_terminal', nextNodeId: 'n2' },
        { textKey: 'npc.silva.n1_choice_project', nextNodeId: 'n3' },
        { textKey: 'npc.silva.n1_choice_hi', nextNodeId: 'n4' },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.silva.speaker',
      textKey: 'npc.silva.n2',
      portraitId: 'silva',
      setsFlag: 'silva_terminal_hint',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.silva.speaker',
      textKey: 'npc.silva.n3',
      portraitId: 'silva',
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.silva.speaker',
      textKey: 'npc.silva.n4',
      portraitId: 'silva',
    },
  },
};
