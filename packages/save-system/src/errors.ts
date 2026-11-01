/** Stable identity of a player-facing save failure; the UI words it in the active language. */
export type SaveErrorCode =
  | 'storage_unavailable'
  | 'slot_limit'
  | 'slot_not_found'
  | 'nothing_to_export'
  | 'import_empty'
  | 'file_too_large'
  | 'file_not_json'
  | 'file_damaged'
  | 'file_empty'
  | 'field_string'
  | 'field_number'
  | 'field_list'
  | 'engine_missing'
  | 'progress_missing'
  | 'data_invalid'
  | 'slot_invalid'
  | 'id_invalid'
  | 'unsupported_version';

/** A failure the player can see. `message` stays the English diagnostic text. */
export class SaveSystemError extends Error {
  constructor(
    message: string,
    readonly code: SaveErrorCode,
    readonly params: Record<string, string | number> = {},
  ) {
    super(message);
    this.name = 'SaveSystemError';
  }
}
