import type { DialogTree } from '../../types';

/** Archivist Okafor — dignified librarian/archivist type. */
export const archivistOkaforDialog: DialogTree = {
  id: 'dialog_okafor',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.okafor.speaker',
      textKey: 'npc.okafor.n1',
      portraitId: 'okafor',
      choices: [
        { textKey: 'npc.okafor.n1_choice_search', nextNodeId: 'n2' },
        { textKey: 'npc.okafor.n1_choice_structure', nextNodeId: 'n3' },
        { textKey: 'npc.okafor.n1_choice_restricted', nextNodeId: 'n4' },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.okafor.speaker',
      textKey: 'npc.okafor.n2',
      portraitId: 'okafor',
      setsFlag: 'okafor_archive_hint',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.okafor.speaker',
      textKey: 'npc.okafor.n3',
      portraitId: 'okafor',
      choices: [
        { textKey: 'npc.okafor.n3_choice_keys', nextNodeId: 'n5' },
        { textKey: 'npc.okafor.n3_choice_values', nextNodeId: 'n6' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.okafor.speaker',
      textKey: 'npc.okafor.n4',
      portraitId: 'okafor',
    },
    n5: {
      id: 'n5',
      speaker: 'npc',
      speakerNameKey: 'npc.okafor.speaker',
      textKey: 'npc.okafor.n5',
      portraitId: 'okafor',
    },
    n6: {
      id: 'n6',
      speaker: 'npc',
      speakerNameKey: 'npc.okafor.speaker',
      textKey: 'npc.okafor.n6',
      portraitId: 'okafor',
    },
  },
};

/** Intern Jamie — nervous intern hiding secrets. */
export const internJamieDialog: DialogTree = {
  id: 'dialog_jamie',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.jamie.speaker',
      textKey: 'npc.jamie.n1',
      portraitId: 'jamie',
      choices: [
        { textKey: 'npc.jamie.n1_choice_whats_wrong', nextNodeId: 'n2' },
        { textKey: 'npc.jamie.n1_choice_records', nextNodeId: 'n3' },
        { textKey: 'npc.jamie.n1_choice_ignore', nextNodeId: 'n4' },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.jamie.speaker',
      textKey: 'npc.jamie.n2',
      portraitId: 'jamie',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.jamie.speaker',
      textKey: 'npc.jamie.n3',
      portraitId: 'jamie',
      choices: [
        { textKey: 'npc.jamie.n3_choice_promise', nextNodeId: 'n5' },
        { textKey: 'npc.jamie.n3_choice_report', nextNodeId: 'n6' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.jamie.speaker',
      textKey: 'npc.jamie.n4',
      portraitId: 'jamie',
    },
    n5: {
      id: 'n5',
      speaker: 'npc',
      speakerNameKey: 'npc.jamie.speaker',
      textKey: 'npc.jamie.n5',
      portraitId: 'jamie',
      setsFlag: 'jamie_secret_shared',
    },
    n6: {
      id: 'n6',
      speaker: 'npc',
      speakerNameKey: 'npc.jamie.speaker',
      textKey: 'npc.jamie.n6',
      portraitId: 'jamie',
    },
  },
};
