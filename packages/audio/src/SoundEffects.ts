/**
 * All game sound effect IDs as constants.
 * Use these with AudioManager.play() to avoid magic strings.
 */

export const SFX = {
  // UI
  MENU_CLICK: 'sfx_menu_click',
  MENU_HOVER: 'sfx_menu_hover',
  MENU_BACK: 'sfx_menu_back',

  // Terminal
  TERMINAL_OPEN: 'sfx_terminal_open',
  TERMINAL_CLOSE: 'sfx_terminal_close',
  TERMINAL_KEYSTROKE: 'sfx_terminal_key',
  CODE_RUN: 'sfx_code_run',
  CODE_SUCCESS: 'sfx_code_success',
  CODE_ERROR: 'sfx_code_error',

  // Game world
  DOOR_OPEN: 'sfx_door_open',
  DOOR_LOCKED: 'sfx_door_locked',
  FOOTSTEP: 'sfx_footstep',
  NPC_ALERT: 'sfx_npc_alert',

  // Progression
  XP_GAIN: 'sfx_xp_gain',
  LEVEL_UP: 'sfx_level_up',
  ACHIEVEMENT: 'sfx_achievement',
} as const;

export const MUSIC = {
  MAIN_MENU: 'music_main_menu',
  LOBBY: 'music_lobby',
  OFFICE: 'music_office',
  LAB: 'music_lab',
  SERVER_ROOM: 'music_server_room',
  EXECUTIVE: 'music_executive',
  BOSS: 'music_boss',
} as const;

export type SFXKey = (typeof SFX)[keyof typeof SFX];
export type MusicKey = (typeof MUSIC)[keyof typeof MUSIC];
