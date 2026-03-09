import type { DialogTree } from '../../types';

/** Venomous Snake — the final boss. Philosophical villain who speaks in code metaphors. */
export const venomousSnakeDialog: DialogTree = {
  id: 'dialog_snake',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.snake.speaker',
      textKey: 'npc.snake.n1',
      portraitId: 'snake',
      choices: [
        // Full confrontation requires the vault data as leverage
        {
          textKey: 'npc.snake.n1_choice_challenge',
          nextNodeId: 'n2',
          requiresItem: 'vault_data',
        },
        { textKey: 'npc.snake.n1_choice_reason', nextNodeId: 'n3' },
        { textKey: 'npc.snake.n1_choice_defy', nextNodeId: 'n4' },
        // Attempting confrontation unprepared — triggers Snake's countermeasures
        {
          textKey: 'npc.snake.n1_choice_bluff_challenge',
          nextNodeId: 'n_unprepared',
          condition: '!snake_encountered',
        },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.snake.speaker',
      textKey: 'npc.snake.n2',
      portraitId: 'snake',
      nextNodeId: 'n5',
      setsFlag: 'snake_encountered',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.snake.speaker',
      textKey: 'npc.snake.n3',
      portraitId: 'snake',
      choices: [
        { textKey: 'npc.snake.n3_choice_understand', nextNodeId: 'n5' },
        { textKey: 'npc.snake.n3_choice_refuse', nextNodeId: 'n6' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.snake.speaker',
      textKey: 'npc.snake.n4',
      portraitId: 'snake',
      setsFlag: 'snake_encountered',
    },
    n5: {
      id: 'n5',
      speaker: 'npc',
      speakerNameKey: 'npc.snake.speaker',
      textKey: 'npc.snake.n5',
      portraitId: 'snake',
      setsFlag: 'snake_encountered',
    },
    n6: {
      id: 'n6',
      speaker: 'npc',
      speakerNameKey: 'npc.snake.speaker',
      textKey: 'npc.snake.n6',
      portraitId: 'snake',
      setsFlag: 'snake_encountered',
    },
    // Player confronts Snake without evidence — Snake triggers a full lockdown
    n_unprepared: {
      id: 'n_unprepared',
      speaker: 'npc',
      speakerNameKey: 'npc.snake.speaker',
      textKey: 'npc.snake.n_unprepared',
      portraitId: 'snake',
      setsFlag: 'raise_alert_floor11',
    },
  },
};
