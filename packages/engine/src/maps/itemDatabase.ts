/** Item metadata for all collectible items in the game world. */
export interface ItemMeta {
  description: string;
  /** Canonical item type — matches the `itemType` Tiled property. */
  itemType: 'datafile' | 'tool' | 'keycard';
}

/** Lookup table: itemId → ItemMeta. */
const ITEM_DATABASE: Record<string, ItemMeta> = {
  // ── Floor 01 – Server Room ──────────────────────────────────────────────
  python_basics: {
    description:
      "Rattlesnake Corp's internal Python training manual. Contains foundational print() docs and syntax basics.",
    itemType: 'datafile',
  },
  debugger_module: {
    description:
      'A compact debugging chip. Enhances your terminal with step-through error tracing and stack inspection.',
    itemType: 'tool',
  },
  network_topology: {
    description:
      "Internal network map of Rattlesnake Corp's server infrastructure. May reveal hidden access points.",
    itemType: 'datafile',
  },
  server_room_keycard: {
    description: 'Level 2 access card. Grants entry to restricted server room sections.',
    itemType: 'keycard',
  },
  autocomplete_chip: {
    description:
      'Auto-complete firmware upgrade. Suggests syntax completions and closing brackets in the hacking terminal.',
    itemType: 'tool',
  },

  // ── Floor 02 – R&D Laboratory ───────────────────────────────────────────
  experiment_log_alpha: {
    description:
      "Encrypted experiment log from Lab Alpha. Details Rattlesnake Corp's controversial Python-AI hybrid research.",
    itemType: 'datafile',
  },
  syntax_highlighter: {
    description:
      'Syntax highlighting module. Color-codes your code for improved readability and fewer runtime errors.',
    itemType: 'tool',
  },
  lab_access_card: {
    description: 'R&D Laboratory clearance card. Permits entry to the containment research zone.',
    itemType: 'keycard',
  },
  genetic_research_protocol: {
    description:
      'Classified R&D protocol. Outlines the genetic algorithm research Rattlesnake Corp is hiding from regulators.',
    itemType: 'datafile',
  },
  code_formatter_patch: {
    description:
      'Code formatting patch. Automatically re-indents and structures your Python code on submit.',
    itemType: 'tool',
  },

  // ── Floor 03 – Surveillance Hub ─────────────────────────────────────────
  surveillance_protocol_log: {
    description:
      "Surveillance operation logs. Reveals Rattlesnake Corp's monitoring network coverage and known blind spots.",
    itemType: 'datafile',
  },
  surveillance_hub_keycard: {
    description: 'Surveillance hub clearance card. Unlocks restricted monitoring stations.',
    itemType: 'keycard',
  },
  security_protocol_log: {
    description:
      'Internal security protocol document. Maps guard rotation schedules and camera coverage zones.',
    itemType: 'datafile',
  },
  code_obfuscator: {
    description:
      'Code obfuscation utility. Masks your hacking traces so surveillance systems flag fewer anomalies.',
    itemType: 'tool',
  },
  admin_credentials: {
    description:
      'Administrative credentials file. Contains partially-encrypted admin passwords and session tokens.',
    itemType: 'datafile',
  },
};

/** Returns item metadata for a given itemId, or a generic fallback. */
export function getItemMeta(itemId: string): ItemMeta {
  return (
    ITEM_DATABASE[itemId] ?? {
      description: 'Unknown item. Handle with care.',
      itemType: 'datafile',
    }
  );
}
