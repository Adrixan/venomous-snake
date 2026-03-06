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

// Floors 1–11 – stubs (fall back to procedural rooms) ─────────────────────────
// These are intentionally omitted from the registry so that getFloorTilemap
// returns null and the caller can use the existing procedural generator.
//
// When a floor's dedicated tilemap is ready, add it here:
//
//   import { generateFloor1Tilemap, FLOOR1_MAP_KEY, FLOOR1_TILESET_NAME } from './Floor1TilemapGenerator';
//   registry.set(1, { mapKey: FLOOR1_MAP_KEY, tilesetKey: FLOOR1_TILESET_NAME, generateTilemap: generateFloor1Tilemap });

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
