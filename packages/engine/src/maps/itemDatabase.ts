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

  // ── Floor 04 – Data Archives ────────────────────────────────────────────────
  list_comprehension_guide: {
    description: 'Guide to Python list comprehensions and generator expressions.',
    itemType: 'datafile',
  },
  data_archives_keycard: {
    description: 'Level 4 access card with magnetic stripe.',
    itemType: 'keycard',
  },
  json_parser_tool: {
    description: 'Utility for parsing and validating JSON data structures.',
    itemType: 'tool',
  },
  dictionary_reference: {
    description: 'Reference manual for Python dictionaries and hash maps.',
    itemType: 'datafile',
  },

  // ── Floor 05 – Communications Center ───────────────────────────────────────
  file_handler_tool: {
    description: 'Advanced file read/write utility for the hacking terminal.',
    itemType: 'tool',
  },
  comms_encryption_log: {
    description: 'Encrypted communication logs between Rattlesnake executives.',
    itemType: 'datafile',
  },
  comms_center_keycard: {
    description: 'Communications floor access authorization.',
    itemType: 'keycard',
  },
  csv_processor: {
    description: 'Tool for processing comma-separated data files.',
    itemType: 'tool',
  },

  // ── Floor 06 – Executive Wing ───────────────────────────────────────────────
  exception_handler_upgrade: {
    description: 'Upgrade that adds try/except debugging to the terminal.',
    itemType: 'tool',
  },
  executive_memo: {
    description: "Internal memo about Project Venom's true purpose.",
    itemType: 'datafile',
  },
  executive_clearance: {
    description: 'Executive-level clearance badge.',
    itemType: 'keycard',
  },

  // ── Floor 07 – Manufacturing ─────────────────────────────────────────────────
  module_loader: {
    description: 'Import system extension for the hacking terminal.',
    itemType: 'tool',
  },
  manufacturing_blueprint: {
    description: "Blueprints for Rattlesnake's automated assembly line.",
    itemType: 'datafile',
  },
  factory_access_key: {
    description: 'Manufacturing floor override key.',
    itemType: 'keycard',
  },
  pip_installer_patch: {
    description: 'Package manager patch for terminal.',
    itemType: 'tool',
  },

  // ── Floor 08 – Research Vault ────────────────────────────────────────────────
  class_designer_tool: {
    description: 'Object-oriented design assistant for the terminal.',
    itemType: 'tool',
  },
  vault_research_data: {
    description: 'Classified research data on Project Venom.',
    itemType: 'datafile',
  },
  vault_key: {
    description: 'High-security vault access credential.',
    itemType: 'keycard',
  },
  inheritance_manual: {
    description: 'Manual on class inheritance and polymorphism.',
    itemType: 'datafile',
  },

  // ── Floor 09 – AI Core ───────────────────────────────────────────────────────
  neural_network_log: {
    description: "Logs from Rattlesnake's AI training experiments.",
    itemType: 'datafile',
  },
  ai_core_access: {
    description: 'AI Core restricted access token.',
    itemType: 'keycard',
  },
  decorator_pattern_tool: {
    description: 'Advanced Python decorator utility.',
    itemType: 'tool',
  },
  lambda_optimizer: {
    description: 'Lambda function optimization tool.',
    itemType: 'tool',
  },

  // ── Floor 10 – Penthouse ─────────────────────────────────────────────────────
  unit_test_framework: {
    description: 'Testing framework for validating hack scripts.',
    itemType: 'tool',
  },
  penthouse_invite: {
    description: 'Forged invitation to the penthouse level.',
    itemType: 'keycard',
  },
  stakeholder_report: {
    description: "Quarterly report revealing Rattlesnake's true finances.",
    itemType: 'datafile',
  },

  // ── Floor 11 – Rooftop ───────────────────────────────────────────────────────
  vault_data: {
    description: 'Compiled evidence from the vault — the ultimate proof.',
    itemType: 'keycard',
  },
  final_toolkit: {
    description: 'Complete Python toolkit for the final confrontation.',
    itemType: 'tool',
  },
  whistleblower_package: {
    description: 'Pre-packaged evidence ready for public release.',
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
