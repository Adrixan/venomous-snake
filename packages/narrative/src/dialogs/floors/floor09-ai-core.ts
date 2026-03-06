import type { DialogTree } from '../../types';

/** Core Guardian — stern AI enforcer, speaks formally. */
export const coreGuardianDialog: DialogTree = {
  id: 'dialog_coreguardian',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.coreguardian.speaker',
      textKey: 'npc.coreguardian.n1',
      portraitId: 'coreguardian',
      choices: [
        { textKey: 'npc.coreguardian.n1_choice_identify', nextNodeId: 'n2' },
        { textKey: 'npc.coreguardian.n1_choice_challenge', nextNodeId: 'n3' },
        { textKey: 'npc.coreguardian.n1_choice_reason', nextNodeId: 'n4' },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.coreguardian.speaker',
      textKey: 'npc.coreguardian.n2',
      portraitId: 'coreguardian',
      setsFlag: 'coreguardian_scanning',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.coreguardian.speaker',
      textKey: 'npc.coreguardian.n3',
      portraitId: 'coreguardian',
      choices: [
        { textKey: 'npc.coreguardian.n3_choice_prove', nextNodeId: 'n5' },
        { textKey: 'npc.coreguardian.n3_choice_retreat', nextNodeId: 'n6' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.coreguardian.speaker',
      textKey: 'npc.coreguardian.n4',
      portraitId: 'coreguardian',
    },
    n5: {
      id: 'n5',
      speaker: 'npc',
      speakerNameKey: 'npc.coreguardian.speaker',
      textKey: 'npc.coreguardian.n5',
      portraitId: 'coreguardian',
      setsFlag: 'coreguardian_test_passed',
    },
    n6: {
      id: 'n6',
      speaker: 'npc',
      speakerNameKey: 'npc.coreguardian.speaker',
      textKey: 'npc.coreguardian.n6',
      portraitId: 'coreguardian',
    },
  },
};

/** Ghost in the Machine — mysterious entity, philosophical, speaks in riddles. */
export const ghostInMachineDialog: DialogTree = {
  id: 'dialog_ghost',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.ghost.speaker',
      textKey: 'npc.ghost.n1',
      portraitId: 'ghost',
      choices: [
        { textKey: 'npc.ghost.n1_choice_who', nextNodeId: 'n2' },
        { textKey: 'npc.ghost.n1_choice_meaning', nextNodeId: 'n3' },
        { textKey: 'npc.ghost.n1_choice_ignore', nextNodeId: 'n4' },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.ghost.speaker',
      textKey: 'npc.ghost.n2',
      portraitId: 'ghost',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.ghost.speaker',
      textKey: 'npc.ghost.n3',
      portraitId: 'ghost',
      choices: [
        { textKey: 'npc.ghost.n3_choice_accept', nextNodeId: 'n5' },
        { textKey: 'npc.ghost.n3_choice_deny', nextNodeId: 'n6' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.ghost.speaker',
      textKey: 'npc.ghost.n4',
      portraitId: 'ghost',
    },
    n5: {
      id: 'n5',
      speaker: 'npc',
      speakerNameKey: 'npc.ghost.speaker',
      textKey: 'npc.ghost.n5',
      portraitId: 'ghost',
      setsFlag: 'ghost_wisdom',
    },
    n6: {
      id: 'n6',
      speaker: 'npc',
      speakerNameKey: 'npc.ghost.speaker',
      textKey: 'npc.ghost.n6',
      portraitId: 'ghost',
    },
  },
};
