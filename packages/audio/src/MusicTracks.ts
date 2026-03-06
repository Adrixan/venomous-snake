import type { AudioTrack } from './AudioManager';

export const MUSIC_TRACKS: AudioTrack[] = [
  { id: 'music_main_menu', category: 'music', src: '/audio/music/main_menu.ogg', loop: true, volume: 0.6, fadeInMs: 2000 },
  { id: 'music_lobby', category: 'music', src: '/audio/music/lobby.ogg', loop: true, volume: 0.5, fadeInMs: 3000 },
  { id: 'music_office', category: 'music', src: '/audio/music/office.ogg', loop: true, volume: 0.4, fadeInMs: 3000 },
  { id: 'music_lab', category: 'music', src: '/audio/music/lab.ogg', loop: true, volume: 0.5, fadeInMs: 2000 },
  { id: 'music_server_room', category: 'music', src: '/audio/music/server_room.ogg', loop: true, volume: 0.5, fadeInMs: 2000 },
  { id: 'music_executive', category: 'music', src: '/audio/music/executive.ogg', loop: true, volume: 0.5, fadeInMs: 3000 },
  { id: 'music_boss', category: 'music', src: '/audio/music/boss.ogg', loop: true, volume: 0.7, fadeInMs: 1000 },
];

export const SFX_TRACKS: AudioTrack[] = [
  { id: 'sfx_menu_click', category: 'ui', src: '/audio/sfx/menu_click.ogg', volume: 0.8 },
  { id: 'sfx_terminal_open', category: 'sfx', src: '/audio/sfx/terminal_open.ogg', volume: 0.7 },
  { id: 'sfx_terminal_close', category: 'sfx', src: '/audio/sfx/terminal_close.ogg', volume: 0.7 },
  { id: 'sfx_code_run', category: 'sfx', src: '/audio/sfx/code_run.ogg', volume: 0.6 },
  { id: 'sfx_code_success', category: 'sfx', src: '/audio/sfx/code_success.ogg', volume: 0.8 },
  { id: 'sfx_code_error', category: 'sfx', src: '/audio/sfx/code_error.ogg', volume: 0.6 },
  { id: 'sfx_door_open', category: 'sfx', src: '/audio/sfx/door_open.ogg', volume: 0.7 },
  { id: 'sfx_item_pickup', category: 'sfx', src: '/audio/sfx/item_pickup.ogg', volume: 0.7 },
  { id: 'sfx_xp_gain', category: 'sfx', src: '/audio/sfx/xp_gain.ogg', volume: 0.5 },
  { id: 'sfx_level_up', category: 'sfx', src: '/audio/sfx/level_up.ogg', volume: 0.9 },
  { id: 'sfx_achievement', category: 'sfx', src: '/audio/sfx/achievement.ogg', volume: 0.9 },
];
