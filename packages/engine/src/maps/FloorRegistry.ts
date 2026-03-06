/**
 * FloorRegistry – maps game floor numbers to their tilemap generators.
 *
 * Floor 0 = Lobby (fully implemented via TilemapGenerator)
 * Floors 1-11 = stub entries that signal the caller to fall back to procedural
 *               room generation until dedicated tilemaps are built.
 */

import {
  generateLobbyTilemap,
  LOBBY_MAP_KEY,
  LOBBY_TILESET_NAME,
  type TiledMap,
} from './TilemapGenerator';
import {
  generateFloor1Tilemap,
  FLOOR_1_MAP_KEY,
  FLOOR_1_TILESET_NAME,
} from './floors/floor01-server-room';
import {
  generateFloor2Tilemap,
  FLOOR_2_MAP_KEY,
  FLOOR_2_TILESET_NAME,
} from './floors/floor02-rd-laboratory';
import {
  generateFloor3Tilemap,
  FLOOR_3_MAP_KEY,
  FLOOR_3_TILESET_NAME,
} from './floors/floor03-surveillance-hub';
import {
  generateFloor4Tilemap,
  FLOOR_4_MAP_KEY,
  FLOOR_4_TILESET_NAME,
} from './floors/floor04-data-archives';
import {
  generateFloor5Tilemap,
  FLOOR_5_MAP_KEY,
  FLOOR_5_TILESET_NAME,
} from './floors/floor05-communications-center';
import {
  generateFloor6Tilemap,
  FLOOR_6_MAP_KEY,
  FLOOR_6_TILESET_NAME,
} from './floors/floor06-executive-wing';
import {
  generateFloor7Tilemap,
  FLOOR_7_MAP_KEY,
  FLOOR_7_TILESET_NAME,
} from './floors/floor07-manufacturing-floor';
import {
  generateFloor8Tilemap,
  FLOOR_8_MAP_KEY,
  FLOOR_8_TILESET_NAME,
} from './floors/floor08-research-vault';
import {
  generateFloor9Tilemap,
  FLOOR_9_MAP_KEY,
  FLOOR_9_TILESET_NAME,
} from './floors/floor09-ai-core';
import {
  generateFloor10Tilemap,
  FLOOR_10_MAP_KEY,
  FLOOR_10_TILESET_NAME,
} from './floors/floor10-penthouse-suite';
import {
  generateFloor11Tilemap,
  FLOOR_11_MAP_KEY,
  FLOOR_11_TILESET_NAME,
} from './floors/floor11-rooftop';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FloorTilemapDef {
  /** Phaser tilemap cache key (e.g. 'lobby'). */
  mapKey: string;
  /** Phaser texture cache key for the tileset (e.g. 'lobby_tiles'). */
  tilesetKey: string;
  /** Returns a fully-generated Tiled-format JSON object. */
  generateTilemap: () => TiledMap;
}

// ─── Registry ─────────────────────────────────────────────────────────────────

const registry = new Map<number, FloorTilemapDef>();

// Floor 0 – Lobby ─────────────────────────────────────────────────────────────
registry.set(0, {
  mapKey: LOBBY_MAP_KEY,
  tilesetKey: LOBBY_TILESET_NAME,
  generateTilemap: generateLobbyTilemap,
});

// Floor 1 – Server Room ──────────────────────────────────────────────────────
registry.set(1, {
  mapKey: FLOOR_1_MAP_KEY,
  tilesetKey: FLOOR_1_TILESET_NAME,
  generateTilemap: generateFloor1Tilemap,
});

// Floor 2 – R&D Laboratory ───────────────────────────────────────────────────
registry.set(2, {
  mapKey: FLOOR_2_MAP_KEY,
  tilesetKey: FLOOR_2_TILESET_NAME,
  generateTilemap: generateFloor2Tilemap,
});

// Floor 3 – Surveillance Hub ─────────────────────────────────────────────────
registry.set(3, {
  mapKey: FLOOR_3_MAP_KEY,
  tilesetKey: FLOOR_3_TILESET_NAME,
  generateTilemap: generateFloor3Tilemap,
});

// Floor 4 – Data Archives ────────────────────────────────────────────────────
registry.set(4, {
  mapKey: FLOOR_4_MAP_KEY,
  tilesetKey: FLOOR_4_TILESET_NAME,
  generateTilemap: generateFloor4Tilemap,
});

// Floor 5 – Communications Center ────────────────────────────────────────────
registry.set(5, {
  mapKey: FLOOR_5_MAP_KEY,
  tilesetKey: FLOOR_5_TILESET_NAME,
  generateTilemap: generateFloor5Tilemap,
});

// Floor 6 – Executive Wing ───────────────────────────────────────────────────
registry.set(6, {
  mapKey: FLOOR_6_MAP_KEY,
  tilesetKey: FLOOR_6_TILESET_NAME,
  generateTilemap: generateFloor6Tilemap,
});

// Floor 7 – Manufacturing Floor ──────────────────────────────────────────────
registry.set(7, {
  mapKey: FLOOR_7_MAP_KEY,
  tilesetKey: FLOOR_7_TILESET_NAME,
  generateTilemap: generateFloor7Tilemap,
});

// Floor 8 – Research Vault ───────────────────────────────────────────────────
registry.set(8, {
  mapKey: FLOOR_8_MAP_KEY,
  tilesetKey: FLOOR_8_TILESET_NAME,
  generateTilemap: generateFloor8Tilemap,
});

// Floor 9 – AI Core ──────────────────────────────────────────────────────────
registry.set(9, {
  mapKey: FLOOR_9_MAP_KEY,
  tilesetKey: FLOOR_9_TILESET_NAME,
  generateTilemap: generateFloor9Tilemap,
});

// Floor 10 – Penthouse Suite ─────────────────────────────────────────────────
registry.set(10, {
  mapKey: FLOOR_10_MAP_KEY,
  tilesetKey: FLOOR_10_TILESET_NAME,
  generateTilemap: generateFloor10Tilemap,
});

// Floor 11 – Rooftop / Final Boss Arena ──────────────────────────────────────
registry.set(11, {
  mapKey: FLOOR_11_MAP_KEY,
  tilesetKey: FLOOR_11_TILESET_NAME,
  generateTilemap: generateFloor11Tilemap,
});

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns the tilemap definition for the given floor number, or `null` if no
 * dedicated tilemap exists yet (caller should fall back to procedural rooms).
 */
export function getFloorTilemap(floorNumber: number): FloorTilemapDef | null {
  return registry.get(floorNumber) ?? null;
}

/**
 * Returns all registered floor numbers that have dedicated tilemaps.
 */
export function getRegisteredFloors(): number[] {
  return Array.from(registry.keys()).sort((a, b) => a - b);
}
