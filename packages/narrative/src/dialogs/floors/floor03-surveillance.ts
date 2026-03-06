import type { DialogTree } from '../../types';

/** Operator Voss — cold and methodical security operator. */
export const operatorVossDialog: DialogTree = {
  id: 'dialog_voss',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.voss.speaker',
      textKey: 'npc.voss.n1',
      portraitId: 'voss',
      choices: [
        { textKey: 'npc.voss.n1_choice_cameras', nextNodeId: 'n2' },
        { textKey: 'npc.voss.n1_choice_blind_spots', nextNodeId: 'n3' },
        { textKey: 'npc.voss.n1_choice_leave', nextNodeId: 'n4' },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.voss.speaker',
      textKey: 'npc.voss.n2',
      portraitId: 'voss',
      setsFlag: 'voss_camera_info',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.voss.speaker',
      textKey: 'npc.voss.n3',
      portraitId: 'voss',
      choices: [
        { textKey: 'npc.voss.n3_choice_deny', nextNodeId: 'n5' },
        { textKey: 'npc.voss.n3_choice_challenge', nextNodeId: 'n6' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.voss.speaker',
      textKey: 'npc.voss.n4',
      portraitId: 'voss',
    },
    n5: {
      id: 'n5',
      speaker: 'npc',
      speakerNameKey: 'npc.voss.speaker',
      textKey: 'npc.voss.n5',
      portraitId: 'voss',
    },
    n6: {
      id: 'n6',
      speaker: 'npc',
      speakerNameKey: 'npc.voss.speaker',
      textKey: 'npc.voss.n6',
      portraitId: 'voss',
      setsFlag: 'voss_impressed',
    },
  },
};

/** Analyst Chen — sharp analyst who secretly doubts the mission. */
export const analystChenDialog: DialogTree = {
  id: 'dialog_chen',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.chen.speaker',
      textKey: 'npc.chen.n1',
      portraitId: 'chen',
      choices: [
        { textKey: 'npc.chen.n1_choice_patterns', nextNodeId: 'n2' },
        { textKey: 'npc.chen.n1_choice_doubts', nextNodeId: 'n3' },
        { textKey: 'npc.chen.n1_choice_mission', nextNodeId: 'n4' },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.chen.speaker',
      textKey: 'npc.chen.n2',
      portraitId: 'chen',
      setsFlag: 'chen_pattern_hint',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.chen.speaker',
      textKey: 'npc.chen.n3',
      portraitId: 'chen',
      choices: [
        { textKey: 'npc.chen.n3_choice_agree', nextNodeId: 'n5' },
        { textKey: 'npc.chen.n3_choice_dismiss', nextNodeId: 'n6' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.chen.speaker',
      textKey: 'npc.chen.n4',
      portraitId: 'chen',
    },
    n5: {
      id: 'n5',
      speaker: 'npc',
      speakerNameKey: 'npc.chen.speaker',
      textKey: 'npc.chen.n5',
      portraitId: 'chen',
      setsFlag: 'chen_ally',
    },
    n6: {
      id: 'n6',
      speaker: 'npc',
      speakerNameKey: 'npc.chen.speaker',
      textKey: 'npc.chen.n6',
      portraitId: 'chen',
    },
  },
};
