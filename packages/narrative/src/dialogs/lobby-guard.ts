import type { DialogTree } from '../types';

/** Guard at the lobby entrance. Warns about security and blocks unregistered operatives. */
export const lobbyGuardDialog: DialogTree = {
  id: 'dialog_guard',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.guard.speaker',
      textKey: 'npc.guard.n1',
      portraitId: 'guard',
      choices: [
        // Requires id_card in inventory; shown grayed-out when missing
        { textKey: 'npc.guard.n1_choice_show_id', nextNodeId: 'n2', requiresItem: 'id_card' },
        { textKey: 'npc.guard.n1_choice_sneak', nextNodeId: 'n3' },
        { textKey: 'npc.guard.n1_choice_ask', nextNodeId: 'n5' },
        // Bluff option – always visible, leads to alert when player has no id_card
        {
          textKey: 'npc.guard.n1_choice_bluff_claim',
          nextNodeId: 'n_bluff_claim',
          condition: '!guard_cleared',
        },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.guard.speaker',
      textKey: 'npc.guard.n2',
      portraitId: 'guard',
      setsFlag: 'guard_cleared',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.guard.speaker',
      textKey: 'npc.guard.n3',
      portraitId: 'guard',
      choices: [
        { textKey: 'npc.guard.n3_choice_apologize', nextNodeId: 'n4' },
        { textKey: 'npc.guard.n3_choice_bluff', nextNodeId: 'n6' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.guard.speaker',
      textKey: 'npc.guard.n4',
      portraitId: 'guard',
    },
    n5: {
      id: 'n5',
      speaker: 'npc',
      speakerNameKey: 'npc.guard.speaker',
      textKey: 'npc.guard.n5',
      portraitId: 'guard',
    },
    // Maintenance bluff caught — raises lobby alert
    n6: {
      id: 'n6',
      speaker: 'npc',
      speakerNameKey: 'npc.guard.speaker',
      textKey: 'npc.guard.n6',
      portraitId: 'guard',
      setsFlag: 'raise_alert_lobby',
    },
    // "I'm authorized without ID" bluff branch
    n_bluff_claim: {
      id: 'n_bluff_claim',
      speaker: 'npc',
      speakerNameKey: 'npc.guard.speaker',
      textKey: 'npc.guard.n_bluff_claim',
      portraitId: 'guard',
      choices: [
        { textKey: 'npc.guard.n_bluff_choice_back_down', nextNodeId: 'n4' },
        {
          textKey: 'npc.guard.n_bluff_choice_insist',
          nextNodeId: 'n_alert',
          setsFlag: 'guard_suspicious',
        },
      ],
    },
    // Alert raised — guards go to yellow alert
    n_alert: {
      id: 'n_alert',
      speaker: 'npc',
      speakerNameKey: 'npc.guard.speaker',
      textKey: 'npc.guard.n_alert',
      portraitId: 'guard',
      setsFlag: 'raise_alert_lobby',
    },
  },
};
