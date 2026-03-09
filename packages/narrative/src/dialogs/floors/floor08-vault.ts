import type { DialogTree } from '../../types';

/** Dr. Volkov — brilliant but sinister Russian researcher. */
export const drVolkovDialog: DialogTree = {
  id: 'dialog_volkov',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.volkov.speaker',
      textKey: 'npc.volkov.n1',
      portraitId: 'volkov',
      choices: [
        // Vault inner sanctum requires authorization
        {
          textKey: 'npc.volkov.n1_choice_research',
          nextNodeId: 'n2',
          requiresItem: 'vault_key',
        },
        { textKey: 'npc.volkov.n1_choice_objects', nextNodeId: 'n3' },
        { textKey: 'npc.volkov.n1_choice_leave', nextNodeId: 'n4' },
        // Unauthorized access attempt — shown when vault_key not held
        {
          textKey: 'npc.volkov.n1_choice_demand_access',
          nextNodeId: 'n_bluff',
          condition: '!volkov_research_shared',
        },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.volkov.speaker',
      textKey: 'npc.volkov.n2',
      portraitId: 'volkov',
      setsFlag: 'volkov_research_shared',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.volkov.speaker',
      textKey: 'npc.volkov.n3',
      portraitId: 'volkov',
      choices: [
        { textKey: 'npc.volkov.n3_choice_inheritance', nextNodeId: 'n5' },
        { textKey: 'npc.volkov.n3_choice_reject', nextNodeId: 'n6' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.volkov.speaker',
      textKey: 'npc.volkov.n4',
      portraitId: 'volkov',
    },
    n5: {
      id: 'n5',
      speaker: 'npc',
      speakerNameKey: 'npc.volkov.speaker',
      textKey: 'npc.volkov.n5',
      portraitId: 'volkov',
      setsFlag: 'volkov_oop_lesson',
    },
    n6: {
      id: 'n6',
      speaker: 'npc',
      speakerNameKey: 'npc.volkov.speaker',
      textKey: 'npc.volkov.n6',
      portraitId: 'volkov',
    },
    // Unauthorized vault access attempt
    n_bluff: {
      id: 'n_bluff',
      speaker: 'npc',
      speakerNameKey: 'npc.volkov.speaker',
      textKey: 'npc.volkov.n_bluff',
      portraitId: 'volkov',
      choices: [
        { textKey: 'npc.volkov.n_bluff_choice_back_off', nextNodeId: 'n4' },
        {
          textKey: 'npc.volkov.n_bluff_choice_force',
          nextNodeId: 'n_alert',
        },
      ],
    },
    // Volkov triggers vault lockdown
    n_alert: {
      id: 'n_alert',
      speaker: 'npc',
      speakerNameKey: 'npc.volkov.speaker',
      textKey: 'npc.volkov.n_alert',
      portraitId: 'volkov',
      setsFlag: 'raise_alert_floor8',
    },
  },
};

/** AI Fragment — fragmented AI with incomplete memories, speaks in broken/poetic way. */
export const aiFragmentDialog: DialogTree = {
  id: 'dialog_aifragment',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.aifragment.speaker',
      textKey: 'npc.aifragment.n1',
      portraitId: 'aifragment',
      choices: [
        { textKey: 'npc.aifragment.n1_choice_who', nextNodeId: 'n2' },
        { textKey: 'npc.aifragment.n1_choice_remember', nextNodeId: 'n3' },
        { textKey: 'npc.aifragment.n1_choice_help', nextNodeId: 'n4' },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.aifragment.speaker',
      textKey: 'npc.aifragment.n2',
      portraitId: 'aifragment',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.aifragment.speaker',
      textKey: 'npc.aifragment.n3',
      portraitId: 'aifragment',
      choices: [
        { textKey: 'npc.aifragment.n3_choice_restore', nextNodeId: 'n5' },
        { textKey: 'npc.aifragment.n3_choice_let_go', nextNodeId: 'n6' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.aifragment.speaker',
      textKey: 'npc.aifragment.n4',
      portraitId: 'aifragment',
    },
    n5: {
      id: 'n5',
      speaker: 'npc',
      speakerNameKey: 'npc.aifragment.speaker',
      textKey: 'npc.aifragment.n5',
      portraitId: 'aifragment',
      setsFlag: 'aifragment_restored',
    },
    n6: {
      id: 'n6',
      speaker: 'npc',
      speakerNameKey: 'npc.aifragment.speaker',
      textKey: 'npc.aifragment.n6',
      portraitId: 'aifragment',
    },
  },
};
