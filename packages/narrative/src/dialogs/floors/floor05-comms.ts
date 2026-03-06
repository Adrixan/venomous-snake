import type { DialogTree } from '../../types';

/** Comm Officer Diaz — professional comms officer, by-the-book. */
export const commOfficerDiazDialog: DialogTree = {
  id: 'dialog_diaz',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.diaz.speaker',
      textKey: 'npc.diaz.n1',
      portraitId: 'diaz',
      choices: [
        { textKey: 'npc.diaz.n1_choice_protocol', nextNodeId: 'n2' },
        { textKey: 'npc.diaz.n1_choice_channels', nextNodeId: 'n3' },
        { textKey: 'npc.diaz.n1_choice_urgent', nextNodeId: 'n4' },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.diaz.speaker',
      textKey: 'npc.diaz.n2',
      portraitId: 'diaz',
      setsFlag: 'diaz_protocol_explained',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.diaz.speaker',
      textKey: 'npc.diaz.n3',
      portraitId: 'diaz',
      choices: [
        { textKey: 'npc.diaz.n3_choice_encrypted', nextNodeId: 'n5' },
        { textKey: 'npc.diaz.n3_choice_open', nextNodeId: 'n6' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.diaz.speaker',
      textKey: 'npc.diaz.n4',
      portraitId: 'diaz',
    },
    n5: {
      id: 'n5',
      speaker: 'npc',
      speakerNameKey: 'npc.diaz.speaker',
      textKey: 'npc.diaz.n5',
      portraitId: 'diaz',
    },
    n6: {
      id: 'n6',
      speaker: 'npc',
      speakerNameKey: 'npc.diaz.speaker',
      textKey: 'npc.diaz.n6',
      portraitId: 'diaz',
    },
  },
};

/** Hacker Echo — sympathetic insider hacker who wants to help the player. */
export const hackerEchoDialog: DialogTree = {
  id: 'dialog_echo',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      speakerNameKey: 'npc.echo.speaker',
      textKey: 'npc.echo.n1',
      portraitId: 'echo',
      choices: [
        { textKey: 'npc.echo.n1_choice_trust', nextNodeId: 'n2' },
        { textKey: 'npc.echo.n1_choice_suspicious', nextNodeId: 'n3' },
        { textKey: 'npc.echo.n1_choice_info', nextNodeId: 'n4' },
      ],
    },
    n2: {
      id: 'n2',
      speaker: 'npc',
      speakerNameKey: 'npc.echo.speaker',
      textKey: 'npc.echo.n2',
      portraitId: 'echo',
      setsFlag: 'echo_ally',
    },
    n3: {
      id: 'n3',
      speaker: 'npc',
      speakerNameKey: 'npc.echo.speaker',
      textKey: 'npc.echo.n3',
      portraitId: 'echo',
      choices: [
        { textKey: 'npc.echo.n3_choice_accept', nextNodeId: 'n5' },
        { textKey: 'npc.echo.n3_choice_refuse', nextNodeId: 'n6' },
      ],
    },
    n4: {
      id: 'n4',
      speaker: 'npc',
      speakerNameKey: 'npc.echo.speaker',
      textKey: 'npc.echo.n4',
      portraitId: 'echo',
    },
    n5: {
      id: 'n5',
      speaker: 'npc',
      speakerNameKey: 'npc.echo.speaker',
      textKey: 'npc.echo.n5',
      portraitId: 'echo',
      setsFlag: 'echo_data_shared',
    },
    n6: {
      id: 'n6',
      speaker: 'npc',
      speakerNameKey: 'npc.echo.speaker',
      textKey: 'npc.echo.n6',
      portraitId: 'echo',
    },
  },
};
