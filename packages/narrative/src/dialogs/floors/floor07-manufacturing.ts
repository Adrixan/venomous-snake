import type { DialogTree } from '../../types';

/** Engineer Kowalski — hardworking factory engineer, earthy. */
export const engineerKowalskiDialog: DialogTree = {
  id: 'dialog_kowalski',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.kowalski.speaker',
      textKey: 'npc.kowalski.n1',
      portraitId: 'kowalski',
      choices: [
        { textKey: 'npc.kowalski.n1_choice_factory', nextNodeId: 'n2' },
        { textKey: 'npc.kowalski.n1_choice_modules', nextNodeId: 'n3' },
        { textKey: 'npc.kowalski.n1_choice_shortcut', nextNodeId: 'n4' },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.kowalski.speaker',
      textKey: 'npc.kowalski.n2',
      portraitId: 'kowalski',
      setsFlag: 'kowalski_factory_tour',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.kowalski.speaker',
      textKey: 'npc.kowalski.n3',
      portraitId: 'kowalski',
      choices: [
        { textKey: 'npc.kowalski.n3_choice_imports', nextNodeId: 'n5' },
        { textKey: 'npc.kowalski.n3_choice_custom', nextNodeId: 'n6' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.kowalski.speaker',
      textKey: 'npc.kowalski.n4',
      portraitId: 'kowalski',
    },
    n5: {
      id: 'n5',
      speaker: 'npc',
      speakerNameKey: 'npc.kowalski.speaker',
      textKey: 'npc.kowalski.n5',
      portraitId: 'kowalski',
    },
    n6: {
      id: 'n6',
      speaker: 'npc',
      speakerNameKey: 'npc.kowalski.speaker',
      textKey: 'npc.kowalski.n6',
      portraitId: 'kowalski',
    },
  },
};

/** QA Bot Delta-7 — overly precise QA robot, speaks in specifications. */
export const qaBotDelta7Dialog: DialogTree = {
  id: 'dialog_delta7',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.delta7.speaker',
      textKey: 'npc.delta7.n1',
      portraitId: 'delta7',
      choices: [
        { textKey: 'npc.delta7.n1_choice_inspect', nextNodeId: 'n2' },
        { textKey: 'npc.delta7.n1_choice_bypass', nextNodeId: 'n3' },
        { textKey: 'npc.delta7.n1_choice_specs', nextNodeId: 'n4' },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.delta7.speaker',
      textKey: 'npc.delta7.n2',
      portraitId: 'delta7',
      setsFlag: 'delta7_inspection_passed',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.delta7.speaker',
      textKey: 'npc.delta7.n3',
      portraitId: 'delta7',
      choices: [
        { textKey: 'npc.delta7.n3_choice_comply', nextNodeId: 'n5' },
        { textKey: 'npc.delta7.n3_choice_override', nextNodeId: 'n6' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.delta7.speaker',
      textKey: 'npc.delta7.n4',
      portraitId: 'delta7',
    },
    n5: {
      id: 'n5',
      speaker: 'npc',
      speakerNameKey: 'npc.delta7.speaker',
      textKey: 'npc.delta7.n5',
      portraitId: 'delta7',
    },
    n6: {
      id: 'n6',
      speaker: 'npc',
      speakerNameKey: 'npc.delta7.speaker',
      textKey: 'npc.delta7.n6',
      portraitId: 'delta7',
      setsFlag: 'delta7_override_logged',
    },
  },
};
