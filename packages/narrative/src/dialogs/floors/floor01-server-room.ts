import type { DialogTree } from '../../types';

/** Tech Kai — friendly techie in the server room. */
export const techKaiDialog: DialogTree = {
  id: 'dialog_kai',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.kai.speaker',
      textKey: 'npc.kai.n1',
      portraitId: 'kai',
      choices: [
        { textKey: 'npc.kai.n1_choice_systems', nextNodeId: 'n2' },
        { textKey: 'npc.kai.n1_choice_binary', nextNodeId: 'n3' },
        { textKey: 'npc.kai.n1_choice_access', nextNodeId: 'n4' },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.kai.speaker',
      textKey: 'npc.kai.n2',
      portraitId: 'kai',
      setsFlag: 'kai_systems_explained',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.kai.speaker',
      textKey: 'npc.kai.n3',
      portraitId: 'kai',
      choices: [
        { textKey: 'npc.kai.n3_choice_true', nextNodeId: 'n5' },
        { textKey: 'npc.kai.n3_choice_false', nextNodeId: 'n6' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.kai.speaker',
      textKey: 'npc.kai.n4',
      portraitId: 'kai',
    },
    n5: {
      id: 'n5',
      speaker: 'npc',
      speakerNameKey: 'npc.kai.speaker',
      textKey: 'npc.kai.n5',
      portraitId: 'kai',
      setsFlag: 'kai_boolean_hint',
    },
    n6: {
      id: 'n6',
      speaker: 'npc',
      speakerNameKey: 'npc.kai.speaker',
      textKey: 'npc.kai.n6',
      portraitId: 'kai',
    },
  },
};

/** SysAdmin Reeves — gruff sysadmin, paranoid about access. */
export const sysAdminReevesDialog: DialogTree = {
  id: 'dialog_reeves',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.reeves.speaker',
      textKey: 'npc.reeves.n1',
      portraitId: 'reeves',
      choices: [
        { textKey: 'npc.reeves.n1_choice_clearance', nextNodeId: 'n2' },
        { textKey: 'npc.reeves.n1_choice_help', nextNodeId: 'n3' },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.reeves.speaker',
      textKey: 'npc.reeves.n2',
      portraitId: 'reeves',
      nextNodeId: 'n4',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.reeves.speaker',
      textKey: 'npc.reeves.n3',
      portraitId: 'reeves',
      choices: [
        { textKey: 'npc.reeves.n3_choice_insist', nextNodeId: 'n5' },
        { textKey: 'npc.reeves.n3_choice_leave', nextNodeId: 'n6' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.reeves.speaker',
      textKey: 'npc.reeves.n4',
      portraitId: 'reeves',
      setsFlag: 'reeves_access_granted',
    },
    n5: {
      id: 'n5',
      speaker: 'npc',
      speakerNameKey: 'npc.reeves.speaker',
      textKey: 'npc.reeves.n5',
      portraitId: 'reeves',
      setsFlag: 'reeves_suspicious',
    },
    n6: {
      id: 'n6',
      speaker: 'npc',
      speakerNameKey: 'npc.reeves.speaker',
      textKey: 'npc.reeves.n6',
      portraitId: 'reeves',
    },
  },
};
