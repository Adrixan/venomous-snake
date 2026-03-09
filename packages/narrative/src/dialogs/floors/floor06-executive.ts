import type { DialogTree } from '../../types';

/** Secretary Kim — polished corporate gatekeeper, passive-aggressive. */
export const secretaryKimDialog: DialogTree = {
  id: 'dialog_kim',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.kim.speaker',
      textKey: 'npc.kim.n1',
      portraitId: 'kim',
      choices: [
        // Requires executive clearance pass; grayed-out without it
        {
          textKey: 'npc.kim.n1_choice_appointment',
          nextNodeId: 'n2',
          requiresItem: 'executive_clearance',
        },
        { textKey: 'npc.kim.n1_choice_excuse', nextNodeId: 'n3' },
        { textKey: 'npc.kim.n1_choice_direct', nextNodeId: 'n4' },
        // Bluff without clearance — only shown when clearance not already verified
        {
          textKey: 'npc.kim.n1_choice_bluff_pass',
          nextNodeId: 'n_bluff',
          condition: '!kim_appointment_checked',
        },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.kim.speaker',
      textKey: 'npc.kim.n2',
      portraitId: 'kim',
      setsFlag: 'kim_appointment_checked',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.kim.speaker',
      textKey: 'npc.kim.n3',
      portraitId: 'kim',
      choices: [
        { textKey: 'npc.kim.n3_choice_persist', nextNodeId: 'n5' },
        { textKey: 'npc.kim.n3_choice_retreat', nextNodeId: 'n6' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.kim.speaker',
      textKey: 'npc.kim.n4',
      portraitId: 'kim',
    },
    n5: {
      id: 'n5',
      speaker: 'npc',
      speakerNameKey: 'npc.kim.speaker',
      textKey: 'npc.kim.n5',
      portraitId: 'kim',
      setsFlag: 'kim_annoyed',
    },
    n6: {
      id: 'n6',
      speaker: 'npc',
      speakerNameKey: 'npc.kim.speaker',
      textKey: 'npc.kim.n6',
      portraitId: 'kim',
    },
    // Attempting to talk past Kim without clearance
    n_bluff: {
      id: 'n_bluff',
      speaker: 'npc',
      speakerNameKey: 'npc.kim.speaker',
      textKey: 'npc.kim.n_bluff',
      portraitId: 'kim',
      choices: [
        { textKey: 'npc.kim.n_bluff_choice_back_off', nextNodeId: 'n6' },
        {
          textKey: 'npc.kim.n_bluff_choice_insist',
          nextNodeId: 'n_alert',
          setsFlag: 'kim_annoyed',
        },
      ],
    },
    // Kim calls security — floor 6 alert raised
    n_alert: {
      id: 'n_alert',
      speaker: 'npc',
      speakerNameKey: 'npc.kim.speaker',
      textKey: 'npc.kim.n_alert',
      portraitId: 'kim',
      setsFlag: 'raise_alert_floor6',
    },
  },
};

/** Exec Blackwell — suspicious executive, power-hungry. */
export const execBlackwellDialog: DialogTree = {
  id: 'dialog_blackwell',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.blackwell.speaker',
      textKey: 'npc.blackwell.n1',
      portraitId: 'blackwell',
      choices: [
        { textKey: 'npc.blackwell.n1_choice_business', nextNodeId: 'n2' },
        { textKey: 'npc.blackwell.n1_choice_bluff', nextNodeId: 'n3' },
        { textKey: 'npc.blackwell.n1_choice_confront', nextNodeId: 'n4' },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.blackwell.speaker',
      textKey: 'npc.blackwell.n2',
      portraitId: 'blackwell',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.blackwell.speaker',
      textKey: 'npc.blackwell.n3',
      portraitId: 'blackwell',
      choices: [
        {
          textKey: 'npc.blackwell.n3_choice_double_down',
          nextNodeId: 'n_alert',
          setsFlag: 'blackwell_suspicious',
        },
        { textKey: 'npc.blackwell.n3_choice_back_off', nextNodeId: 'n6' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.blackwell.speaker',
      textKey: 'npc.blackwell.n4',
      portraitId: 'blackwell',
      setsFlag: 'blackwell_confronted',
    },
    n5: {
      id: 'n5',
      speaker: 'npc',
      speakerNameKey: 'npc.blackwell.speaker',
      textKey: 'npc.blackwell.n5',
      portraitId: 'blackwell',
      setsFlag: 'blackwell_suspicious',
    },
    n6: {
      id: 'n6',
      speaker: 'npc',
      speakerNameKey: 'npc.blackwell.speaker',
      textKey: 'npc.blackwell.n6',
      portraitId: 'blackwell',
    },
    // Blackwell calls corporate security — floor 6 alert raised
    n_alert: {
      id: 'n_alert',
      speaker: 'npc',
      speakerNameKey: 'npc.blackwell.speaker',
      textKey: 'npc.blackwell.n_alert',
      portraitId: 'blackwell',
      setsFlag: 'raise_alert_floor6',
    },
  },
};
