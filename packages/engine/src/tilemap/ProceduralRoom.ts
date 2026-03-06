import Phaser from 'phaser';

/** Texture cache key for the shared room tileset. */
export const TILESET_KEY = 'room_tileset';

/**
 * Tile GID constants.
 * GID 0  = empty (no tile)
 * GID 1+ = position (GID - 1) in the tileset image.
 */
export const TILE = {
  EMPTY: 0,
  FLOOR: 1,
  WALL: 2,
  DOOR_N: 3,
  DOOR_S: 4,
  DOOR_E: 5,
  DOOR_W: 6,
} as const;

export type TileValue = (typeof TILE)[keyof typeof TILE];

export interface DoorConfig {
  side: 'north' | 'south' | 'east' | 'west';
  /** Tile index along the wall where the door opening sits. */
  position: number;
  targetRoom: string;
}

export interface ObjectConfig {
  type: 'terminal' | 'npc' | 'item';
  tileX: number;
  tileY: number;
  id: string;
}

export interface RoomConfig {
  name: string;
  /** Room width in tiles. */
  width: number;
  /** Room height in tiles. */
  height: number;
  tileSize: number;
  doors: DoorConfig[];
  objects: ObjectConfig[];
}

export interface InteractiveObjectData {
  id: string;
  type: 'terminal' | 'npc' | 'item' | 'door';
  x: number;
  y: number;
  targetRoom?: string;
}

// ---------------------------------------------------------------------------
// Tileset texture generation
// ---------------------------------------------------------------------------

/**
 * Generates and caches a tileset texture using Phaser Graphics.
 * Layout (each tile is `tileSize` wide):
 *   pos 0 → Floor  (GID 1)
 *   pos 1 → Wall   (GID 2)
 *   pos 2 → Door N (GID 3)
 *   pos 3 → Door S (GID 4)
 *   pos 4 → Door E (GID 5)
 *   pos 5 → Door W (GID 6)
 */
export function createTilesetTexture(scene: Phaser.Scene, tileSize: number): void {
  if (scene.textures.exists(TILESET_KEY)) return;

  const numTiles = 6;
  const gfx = scene.make.graphics({}, false);

  // pos 0 – Floor
  gfx.fillStyle(0x16213e, 1);
  gfx.fillRect(0 * tileSize, 0, tileSize, tileSize);
  gfx.lineStyle(1, 0x1d2d5a, 0.6);
  gfx.strokeRect(0 * tileSize + 0.5, 0.5, tileSize - 1, tileSize - 1);

  // pos 1 – Wall
  gfx.fillStyle(0x1a1a2e, 1);
  gfx.fillRect(1 * tileSize, 0, tileSize, tileSize);
  gfx.lineStyle(2, 0x2a2a4e, 1);
  gfx.strokeRect(1 * tileSize + 1, 1, tileSize - 2, tileSize - 2);
  // Cross-hatch accent
  gfx.lineStyle(1, 0x252545, 0.5);
  gfx.lineBetween(1 * tileSize, 0, 1 * tileSize + tileSize, tileSize);
  gfx.lineBetween(1 * tileSize + tileSize, 0, 1 * tileSize, tileSize);

  // pos 2 – Door North (green tinted)
  gfx.fillStyle(0x1a3a2a, 1);
  gfx.fillRect(2 * tileSize, 0, tileSize, tileSize);
  gfx.lineStyle(2, 0x2d6a4f, 1);
  gfx.strokeRect(2 * tileSize + 1, 1, tileSize - 2, tileSize - 2);

  // pos 3 – Door South
  gfx.fillStyle(0x1a3a2a, 1);
  gfx.fillRect(3 * tileSize, 0, tileSize, tileSize);
  gfx.lineStyle(2, 0x2d6a4f, 1);
  gfx.strokeRect(3 * tileSize + 1, 1, tileSize - 2, tileSize - 2);

  // pos 4 – Door East
  gfx.fillStyle(0x1a3a2a, 1);
  gfx.fillRect(4 * tileSize, 0, tileSize, tileSize);
  gfx.lineStyle(2, 0x2d6a4f, 1);
  gfx.strokeRect(4 * tileSize + 1, 1, tileSize - 2, tileSize - 2);

  // pos 5 – Door West
  gfx.fillStyle(0x1a3a2a, 1);
  gfx.fillRect(5 * tileSize, 0, tileSize, tileSize);
  gfx.lineStyle(2, 0x2d6a4f, 1);
  gfx.strokeRect(5 * tileSize + 1, 1, tileSize - 2, tileSize - 2);

  gfx.generateTexture(TILESET_KEY, numTiles * tileSize, tileSize);
  gfx.destroy();
}

// ---------------------------------------------------------------------------
// Layout generation
// ---------------------------------------------------------------------------

/**
 * Generates a 2-D array of tile GIDs for the given RoomConfig.
 * Row 0 is the top row; row[height-1] is the bottom row.
 */
export function generateRoomLayout(config: RoomConfig): number[][] {
  const { width, height } = config;

  // Initialise every cell to EMPTY
  const data: number[][] = Array.from({ length: height }, () =>
    Array.from<number>({ length: width }).fill(TILE.EMPTY),
  );

  // Floor interior
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const row = data[y];
      if (row !== undefined) row[x] = TILE.FLOOR;
    }
  }

  // Perimeter walls
  for (let x = 0; x < width; x++) {
    const top = data[0];
    const bottom = data[height - 1];
    if (top !== undefined) top[x] = TILE.WALL;
    if (bottom !== undefined) bottom[x] = TILE.WALL;
  }
  for (let y = 1; y < height - 1; y++) {
    const row = data[y];
    if (row !== undefined) {
      row[0] = TILE.WALL;
      row[width - 1] = TILE.WALL;
    }
  }

  // Doors (replace wall tile with appropriate door tile)
  for (const door of config.doors) {
    switch (door.side) {
      case 'north': {
        const row = data[0];
        if (row !== undefined) row[door.position] = TILE.DOOR_N;
        break;
      }
      case 'south': {
        const row = data[height - 1];
        if (row !== undefined) row[door.position] = TILE.DOOR_S;
        break;
      }
      case 'east': {
        const row = data[door.position];
        if (row !== undefined) row[width - 1] = TILE.DOOR_E;
        break;
      }
      case 'west': {
        const row = data[door.position];
        if (row !== undefined) row[0] = TILE.DOOR_W;
        break;
      }
    }
  }

  return data;
}
