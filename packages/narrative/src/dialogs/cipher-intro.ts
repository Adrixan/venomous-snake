import type { DialogTree } from '../types';

/** CIPHER's introduction sequence — triggered when the game world first loads. */
export const cipherIntroDialog: DialogTree = {
  id: 'cipher_intro',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'ai_sidekick',
      speakerNameKey: 'npc.cipher.speaker',
      textKey: 'npc.cipher.intro_n1',
      portraitId: 'cipher',
      nextNodeId: 'n2',
    },
    n2: {
      id: 'n2',
      speaker: 'ai_sidekick',
      speakerNameKey: 'npc.cipher.speaker',
      textKey: 'npc.cipher.intro_n2',
      portraitId: 'cipher',
      nextNodeId: 'n3',
    },
    n3: {
      id: 'n3',
      speaker: 'ai_sidekick',
      speakerNameKey: 'npc.cipher.speaker',
      textKey: 'npc.cipher.intro_n3',
      portraitId: 'cipher',
      choices: [
        {
          textKey: 'npc.cipher.intro_n3_choice_ready',
          nextNodeId: 'n5',
          setsFlag: 'cipher_intro_done',
        },
        { textKey: 'npc.cipher.intro_n3_choice_info', nextNodeId: 'n4' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'ai_sidekick',
      speakerNameKey: 'npc.cipher.speaker',
      textKey: 'npc.cipher.intro_n4',
      portraitId: 'cipher',
      nextNodeId: 'n5',
    },
    n5: {
      id: 'n5',
      speaker: 'ai_sidekick',
      speakerNameKey: 'npc.cipher.speaker',
      textKey: 'npc.cipher.intro_n5',
      portraitId: 'cipher',
      setsFlag: 'cipher_intro_done',
    },
  },
};
