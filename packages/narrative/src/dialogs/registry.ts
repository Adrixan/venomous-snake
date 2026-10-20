import type { DialogTree } from '../types';
import {
  lobbyGuardDialog,
  drSilvaDialog,
  cipherIntroDialog,
  techKaiDialog,
  sysAdminReevesDialog,
  researcherPatelDialog,
  labBotDialog,
  operatorVossDialog,
  analystChenDialog,
  archivistOkaforDialog,
  internJamieDialog,
  commOfficerDiazDialog,
  hackerEchoDialog,
  secretaryKimDialog,
  execBlackwellDialog,
  engineerKowalskiDialog,
  qaBotDelta7Dialog,
  drVolkovDialog,
  aiFragmentDialog,
  coreGuardianDialog,
  ghostInMachineDialog,
  butlerSterlingDialog,
  rivalAgentNovaDialog,
  venomousSnakeDialog,
} from './index';

/** Every dialog tree in the game. */
export const ALL_DIALOGS: DialogTree[] = [
  lobbyGuardDialog,
  drSilvaDialog,
  cipherIntroDialog,
  techKaiDialog,
  sysAdminReevesDialog,
  researcherPatelDialog,
  labBotDialog,
  operatorVossDialog,
  analystChenDialog,
  archivistOkaforDialog,
  internJamieDialog,
  commOfficerDiazDialog,
  hackerEchoDialog,
  secretaryKimDialog,
  execBlackwellDialog,
  engineerKowalskiDialog,
  qaBotDelta7Dialog,
  drVolkovDialog,
  aiFragmentDialog,
  coreGuardianDialog,
  ghostInMachineDialog,
  butlerSterlingDialog,
  rivalAgentNovaDialog,
  venomousSnakeDialog,
];

const BY_ID = new Map(ALL_DIALOGS.map((tree) => [tree.id, tree]));

export function getDialogTree(id: string): DialogTree | undefined {
  return BY_ID.get(id);
}

export interface NpcInfo {
  dialogId: string;
  /** Translation key (`namespace.path`) of the NPC's display name. */
  nameKey: string;
  portraitId?: string;
}

/** Derives the NPC's display data from the first node of its dialog tree. */
export function getNpcInfo(dialogId: string): NpcInfo {
  const tree = BY_ID.get(dialogId);
  if (tree === undefined) throw new Error(`Unknown dialog tree: ${dialogId}`);
  const start = tree.nodes[tree.startNodeId];
  if (start?.speakerNameKey === undefined) {
    throw new Error(`Dialog ${dialogId} has no speaker name on its start node`);
  }
  return {
    dialogId,
    nameKey: `dialog.${start.speakerNameKey}`,
    ...(start.portraitId !== undefined ? { portraitId: start.portraitId } : {}),
  };
}
