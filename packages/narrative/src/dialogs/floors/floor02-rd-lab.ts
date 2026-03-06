import type { DialogTree } from '../../types';

/** Researcher Patel — academic scientist, passionate about experiments. */
export const researcherPatelDialog: DialogTree = {
  id: 'dialog_patel',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.patel.speaker',
      textKey: 'npc.patel.n1',
      portraitId: 'patel',
      choices: [
        { textKey: 'npc.patel.n1_choice_experiments', nextNodeId: 'n2' },
        { textKey: 'npc.patel.n1_choice_loops', nextNodeId: 'n3' },
        { textKey: 'npc.patel.n1_choice_danger', nextNodeId: 'n4' },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.patel.speaker',
      textKey: 'npc.patel.n2',
      portraitId: 'patel',
      setsFlag: 'patel_experiment_hint',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.patel.speaker',
      textKey: 'npc.patel.n3',
      portraitId: 'patel',
      choices: [
        { textKey: 'npc.patel.n3_choice_iterate', nextNodeId: 'n5' },
        { textKey: 'npc.patel.n3_choice_shortcut', nextNodeId: 'n6' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.patel.speaker',
      textKey: 'npc.patel.n4',
      portraitId: 'patel',
    },
    n5: {
      id: 'n5',
      speaker: 'npc',
      speakerNameKey: 'npc.patel.speaker',
      textKey: 'npc.patel.n5',
      portraitId: 'patel',
      setsFlag: 'patel_loop_wisdom',
    },
    n6: {
      id: 'n6',
      speaker: 'npc',
      speakerNameKey: 'npc.patel.speaker',
      textKey: 'npc.patel.n6',
      portraitId: 'patel',
    },
  },
};

/** Lab Bot MK-3 — malfunctioning robot with glitchy speech. */
export const labBotDialog: DialogTree = {
  id: 'dialog_labbot',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.labbot.speaker',
      textKey: 'npc.labbot.n1',
      portraitId: 'labbot',
      choices: [
        { textKey: 'npc.labbot.n1_choice_status', nextNodeId: 'n2' },
        { textKey: 'npc.labbot.n1_choice_reboot', nextNodeId: 'n3' },
        { textKey: 'npc.labbot.n1_choice_ignore', nextNodeId: 'n4' },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.labbot.speaker',
      textKey: 'npc.labbot.n2',
      portraitId: 'labbot',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.labbot.speaker',
      textKey: 'npc.labbot.n3',
      portraitId: 'labbot',
      choices: [
        { textKey: 'npc.labbot.n3_choice_help', nextNodeId: 'n5' },
        { textKey: 'npc.labbot.n3_choice_abort', nextNodeId: 'n6' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.labbot.speaker',
      textKey: 'npc.labbot.n4',
      portraitId: 'labbot',
    },
    n5: {
      id: 'n5',
      speaker: 'npc',
      speakerNameKey: 'npc.labbot.speaker',
      textKey: 'npc.labbot.n5',
      portraitId: 'labbot',
      setsFlag: 'labbot_rebooted',
    },
    n6: {
      id: 'n6',
      speaker: 'npc',
      speakerNameKey: 'npc.labbot.speaker',
      textKey: 'npc.labbot.n6',
      portraitId: 'labbot',
    },
  },
};
