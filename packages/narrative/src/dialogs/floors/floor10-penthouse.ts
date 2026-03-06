import type { DialogTree } from '../../types';

/** Butler Sterling — old-world elegant butler, devoted to Snake. */
export const butlerSterlingDialog: DialogTree = {
  id: 'dialog_sterling',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.sterling.speaker',
      textKey: 'npc.sterling.n1',
      portraitId: 'sterling',
      choices: [
        { textKey: 'npc.sterling.n1_choice_snake', nextNodeId: 'n2' },
        { textKey: 'npc.sterling.n1_choice_warn', nextNodeId: 'n3' },
        { textKey: 'npc.sterling.n1_choice_pass', nextNodeId: 'n4' },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.sterling.speaker',
      textKey: 'npc.sterling.n2',
      portraitId: 'sterling',
      setsFlag: 'sterling_info_shared',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.sterling.speaker',
      textKey: 'npc.sterling.n3',
      portraitId: 'sterling',
      choices: [
        { textKey: 'npc.sterling.n3_choice_ready', nextNodeId: 'n5' },
        { textKey: 'npc.sterling.n3_choice_reconsider', nextNodeId: 'n6' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.sterling.speaker',
      textKey: 'npc.sterling.n4',
      portraitId: 'sterling',
    },
    n5: {
      id: 'n5',
      speaker: 'npc',
      speakerNameKey: 'npc.sterling.speaker',
      textKey: 'npc.sterling.n5',
      portraitId: 'sterling',
      setsFlag: 'sterling_blessing',
    },
    n6: {
      id: 'n6',
      speaker: 'npc',
      speakerNameKey: 'npc.sterling.speaker',
      textKey: 'npc.sterling.n6',
      portraitId: 'sterling',
    },
  },
};

/** Rival Agent Nova — flashy rival agent, competitive but with grudging respect. */
export const rivalAgentNovaDialog: DialogTree = {
  id: 'dialog_nova',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.nova.speaker',
      textKey: 'npc.nova.n1',
      portraitId: 'nova',
      choices: [
        { textKey: 'npc.nova.n1_choice_compete', nextNodeId: 'n2' },
        { textKey: 'npc.nova.n1_choice_ally', nextNodeId: 'n3' },
        { textKey: 'npc.nova.n1_choice_dismiss', nextNodeId: 'n4' },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.nova.speaker',
      textKey: 'npc.nova.n2',
      portraitId: 'nova',
      setsFlag: 'nova_rival',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.nova.speaker',
      textKey: 'npc.nova.n3',
      portraitId: 'nova',
      choices: [
        { textKey: 'npc.nova.n3_choice_deal', nextNodeId: 'n5' },
        { textKey: 'npc.nova.n3_choice_solo', nextNodeId: 'n6' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.nova.speaker',
      textKey: 'npc.nova.n4',
      portraitId: 'nova',
    },
    n5: {
      id: 'n5',
      speaker: 'npc',
      speakerNameKey: 'npc.nova.speaker',
      textKey: 'npc.nova.n5',
      portraitId: 'nova',
      setsFlag: 'nova_alliance',
    },
    n6: {
      id: 'n6',
      speaker: 'npc',
      speakerNameKey: 'npc.nova.speaker',
      textKey: 'npc.nova.n6',
      portraitId: 'nova',
    },
  },
};
