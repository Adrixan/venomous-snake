import type { InventoryItem } from '@venomous-snake/shared-types';

/** An item the player can find, and the challenge whose solution yields it. */
export interface ItemDefinition extends InventoryItem {
  grantedBy: string;
}

/**
 * Items are rewards: hacking the right terminal prints, unlocks or extracts them.
 * Dialog choices that `requireItem` one of these become available afterwards.
 */
export const ITEMS: ItemDefinition[] = [
  {
    id: 'id_card',
    type: 'keycard',
    nameKey: 'dialog.items.id_card',
    descriptionKey: 'dialog.items.id_card_desc',
    iconId: 'id_card',
    grantedBy: 'ch01_02_variables',
  },
  {
    id: 'executive_clearance',
    type: 'keycard',
    nameKey: 'dialog.items.executive_clearance',
    descriptionKey: 'dialog.items.executive_clearance_desc',
    iconId: 'clearance',
    grantedBy: 'ch06_10_combining_collections',
  },
  {
    id: 'vault_key',
    type: 'tool',
    nameKey: 'dialog.items.vault_key',
    descriptionKey: 'dialog.items.vault_key_desc',
    iconId: 'key',
    grantedBy: 'ch09_10_combining_tools',
  },
  {
    id: 'vault_data',
    type: 'datafile',
    nameKey: 'dialog.items.vault_data',
    descriptionKey: 'dialog.items.vault_data_desc',
    iconId: 'drive',
    grantedBy: 'ch10_10_polymorphism',
  },
  {
    id: 'penthouse_invite',
    type: 'datafile',
    nameKey: 'dialog.items.penthouse_invite',
    descriptionKey: 'dialog.items.penthouse_invite_desc',
    iconId: 'invite',
    grantedBy: 'ch11_08_putting_it_together',
  },
];

export function getItemsGrantedBy(challengeId: string): ItemDefinition[] {
  return ITEMS.filter((item) => item.grantedBy === challengeId);
}

export function getItem(itemId: string): ItemDefinition | undefined {
  return ITEMS.find((item) => item.id === itemId);
}
