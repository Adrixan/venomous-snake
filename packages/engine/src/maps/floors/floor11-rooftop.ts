/**
 * Floor 11 – Rooftop / Final Boss Arena
 *
 * Open roof with helipad center, server nexus in upper corners, boss throne.
 * Sparse walls (just outer perimeter), helipad neon grid at center
 * (cols 12-28, rows 8-22), server nexus corners (cols 1-8/32-38, rows 1-8),
 * elevator shaft (cols 33-39). No elevator up — this is the top.
 */

import { LOBBY_GID } from '../TilesetGenerator';
import type { TiledMap, TiledObject, TiledProperty } from '../TilemapGenerator';

export const FLOOR_11_MAP_KEY = 'floor11';
export const FLOOR_11_TILESET_NAME = 'lobby_tiles';

const MAP_W = 40;
const MAP_H = 30;
const TILE_SIZE = 32;

function newGrid(): number[] {
  return new Array(MAP_W * MAP_H).fill(0) as number[];
}
function setTile(layer: number[], x: number, y: number, gid: number): void {
  if (x >= 0 && x < MAP_W && y >= 0 && y < MAP_H) layer[y * MAP_W + x] = gid;
}
function getTile(layer: number[], x: number, y: number): number {
  if (x >= 0 && x < MAP_W && y >= 0 && y < MAP_H) return layer[y * MAP_W + x] ?? 0;
  return 0;
}
function px(col: number): number {
  return col * TILE_SIZE + TILE_SIZE / 2;
}
function py(row: number): number {
  return row * TILE_SIZE + TILE_SIZE / 2;
}
function prop(name: string, value: string): TiledProperty {
  return { name, type: 'string', value };
}
function makeObject(
  id: number,
  name: string,
  type: string,
  col: number,
  row: number,
  props: TiledProperty[] = [],
): TiledObject {
  return {
    id,
    name,
    type,
    x: px(col),
    y: py(row),
    width: 0,
    height: 0,
    point: true,
    properties: props,
  };
}

// ─── Layer builders ───────────────────────────────────────────────────────────

function buildFloorLayer(): number[] {
  const layer = newGrid();
  for (let y = 1; y < MAP_H - 1; y++) {
    for (let x = 1; x < MAP_W - 1; x++) {
      if (x >= 34 && x <= 38) {
        setTile(layer, x, y, LOBBY_GID.FLOOR_DARK);
        continue;
      }
      // Helipad area: lighter
      if (x >= 12 && x <= 28 && y >= 8 && y <= 22) {
        setTile(layer, x, y, (x + y) % 2 === 0 ? LOBBY_GID.FLOOR_LIGHT : LOBBY_GID.FLOOR_DARK);
        continue;
      }
      // Rest: dark rooftop
      setTile(layer, x, y, LOBBY_GID.FLOOR_DARK);
    }
  }
  return layer;
}

function buildWallsLayer(): number[] {
  const layer = newGrid();

  // Outer perimeter only — open rooftop
  for (let x = 0; x < MAP_W; x++) {
    setTile(layer, x, 0, LOBBY_GID.WALL);
    setTile(layer, x, MAP_H - 1, LOBBY_GID.WALL);
  }
  for (let y = 0; y < MAP_H; y++) {
    setTile(layer, 0, y, LOBBY_GID.WALL);
    setTile(layer, MAP_W - 1, y, LOBBY_GID.WALL);
  }
  setTile(layer, 0, 0, LOBBY_GID.WALL_CORNER);
  setTile(layer, MAP_W - 1, 0, LOBBY_GID.WALL_CORNER);
  setTile(layer, 0, MAP_H - 1, LOBBY_GID.WALL_CORNER);
  setTile(layer, MAP_W - 1, MAP_H - 1, LOBBY_GID.WALL_CORNER);

  // Elevator west wall (col 33)
  for (let y = 1; y < MAP_H - 1; y++) {
    if (y !== 25) setTile(layer, 33, y, LOBBY_GID.WALL); // only elevator down
  }
  setTile(layer, 33, 0, LOBBY_GID.WALL_CORNER);
  setTile(layer, 33, MAP_H - 1, LOBBY_GID.WALL_CORNER);

  return layer;
}

function buildFurnitureLayer(): number[] {
  const layer = newGrid();

  // Helipad neon markings (using NEON_STRIP in furniture layer — non-blocking)
  // Outer ring of helipad
  for (let x = 12; x <= 28; x += 2) {
    setTile(layer, x, 8, LOBBY_GID.NEON_STRIP);
    setTile(layer, x, 22, LOBBY_GID.NEON_STRIP);
  }
  for (let y = 9; y <= 21; y += 2) {
    setTile(layer, 12, y, LOBBY_GID.NEON_STRIP);
    setTile(layer, 28, y, LOBBY_GID.NEON_STRIP);
  }
  // Inner cross pattern
  for (let x = 16; x <= 24; x += 2) {
    setTile(layer, x, 15, LOBBY_GID.NEON_STRIP);
  }
  for (let y = 11; y <= 19; y += 2) {
    setTile(layer, 20, y, LOBBY_GID.NEON_STRIP);
  }

  // Server nexus upper-left corner (cols 1-8, rows 1-8)
  for (let y = 1; y <= 7; y += 2) {
    for (let x = 1; x <= 7; x += 2) {
      setTile(layer, x, y, LOBBY_GID.VENT);
      setTile(layer, x + 1, y, LOBBY_GID.CABLE);
    }
  }

  // Server nexus upper-right corner (cols 32, rows 1-8 — note: col 33+ is elevator)
  for (let y = 1; y <= 7; y += 2) {
    for (let x = 27; x <= 31; x += 2) {
      setTile(layer, x, y, LOBBY_GID.VENT);
      if (x + 1 <= 32) setTile(layer, x + 1, y, LOBBY_GID.CABLE);
    }
  }

  // Boss throne area
  setTile(layer, 19, 5, LOBBY_GID.RECEPTION_DESK);
  setTile(layer, 20, 5, LOBBY_GID.RECEPTION_DESK);
  setTile(layer, 21, 5, LOBBY_GID.RECEPTION_DESK);
  setTile(layer, 20, 6, LOBBY_GID.CHAIR);

  // Scattered planters (sparse rooftop)
  setTile(layer, 5, 15, LOBBY_GID.PLANTER);
  setTile(layer, 5, 25, LOBBY_GID.PLANTER);
  setTile(layer, 30, 15, LOBBY_GID.PLANTER);
  setTile(layer, 30, 25, LOBBY_GID.PLANTER);

  return layer;
}

function buildInteractiveLayer(): number[] {
  const layer = newGrid();

  // 1 boss terminal at center
  setTile(layer, 20, 15, LOBBY_GID.TERMINAL); // ch12_10

  // Elevator door (down only)
  setTile(layer, 33, 25, LOBBY_GID.DOOR_OPEN);

  // Elevator tiles
  setTile(layer, 36, 25, LOBBY_GID.ELEVATOR);
  setTile(layer, 37, 25, LOBBY_GID.ELEVATOR);

  return layer;
}

function buildCollisionLayer(wallsLayer: number[]): number[] {
  const layer = newGrid();
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      const w = getTile(wallsLayer, x, y);
      if (w === LOBBY_GID.WALL || w === LOBBY_GID.WALL_CORNER || w === LOBBY_GID.NEON_STRIP) {
        setTile(layer, x, y, LOBBY_GID.WALL);
      }
    }
  }
  return layer;
}

function buildObjectLayer(): TiledObject[] {
  let nextId = 1;
  const objects: TiledObject[] = [];
  function add(obj: TiledObject): void {
    objects.push(obj);
  }

  add(makeObject(nextId++, 'player_start', 'player_start', 35, 25));

  // NPCs
  add(
    makeObject(nextId++, 'CEO "The Snake" Viper', 'npc', 20, 5, [
      prop('dialogId', 'ceo_viper'),
      prop('npcId', 'ceo_viper'),
      prop('behavior', 'guard'),
    ]),
  );
  add(
    makeObject(nextId++, 'Final Security Override', 'npc', 10, 15, [
      prop('dialogId', 'final_security'),
      prop('npcId', 'final_security'),
      prop('behavior', 'idle'),
    ]),
  );
  add(
    makeObject(nextId++, 'Rogue AI Sentinel', 'npc', 28, 15, [
      prop('dialogId', 'rogue_ai_sentinel'),
      prop('npcId', 'rogue_ai_sentinel'),
      prop('behavior', 'guard'),
    ]),
  );

  // Boss terminal
  add(
    makeObject(nextId++, 'Server Nexus Core', 'terminal', 20, 15, [
      prop('challengeId', 'ch12_10_final_showdown'),
      prop('label', 'Server Nexus Core'),
      prop('room', 'rooftop'),
    ]),
  );

  // Elevator down only (to floor 10) — no elevator up
  add(
    makeObject(nextId++, 'Elevator to Floor 10', 'door', 37, 25, [
      prop('targetFloor', 'floor10'),
      prop('locked', 'false'),
    ]),
  );

  // ─── Items ──────────────────────────────────────────────────────────────────
  // Keycard in the left server nexus corner
  add(
    makeObject(nextId++, 'Vault Data', 'item', 5, 5, [
      prop('itemType', 'keycard'),
      prop('itemId', 'vault_data'),
    ]),
  );
  // Tool on the open rooftop to the left of the helipad
  add(
    makeObject(nextId++, 'Final Toolkit', 'item', 7, 20, [
      prop('itemType', 'tool'),
      prop('itemId', 'final_toolkit'),
    ]),
  );
  // Datafile on the upper rooftop area near the server nexus
  add(
    makeObject(nextId, 'Whistleblower Package', 'item', 9, 3, [
      prop('itemType', 'datafile'),
      prop('itemId', 'whistleblower_package'),
    ]),
  );

  return objects;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateFloor11Tilemap(): TiledMap {
  const floorData = buildFloorLayer();
  const wallsData = buildWallsLayer();
  const furnitureData = buildFurnitureLayer();
  const interactiveData = buildInteractiveLayer();
  const collisionData = buildCollisionLayer(wallsData);
  const objectsData = buildObjectLayer();

  let layerId = 1;
  function tileLayer(name: string, data: number[]) {
    return {
      id: layerId++,
      name,
      type: 'tilelayer' as const,
      x: 0,
      y: 0,
      width: MAP_W,
      height: MAP_H,
      visible: true,
      opacity: 1,
      data,
    };
  }

  const objectLayer = {
    id: layerId++,
    name: 'objects',
    type: 'objectgroup' as const,
    draworder: 'topdown' as const,
    x: 0,
    y: 0,
    visible: true,
    opacity: 1,
    objects: objectsData,
  };

  return {
    compressionlevel: -1,
    height: MAP_H,
    infinite: false,
    layers: [
      tileLayer('floor', floorData),
      tileLayer('walls', wallsData),
      tileLayer('furniture', furnitureData),
      tileLayer('interactive', interactiveData),
      tileLayer('collision', collisionData),
      objectLayer,
    ],
    nextlayerid: layerId,
    nextobjectid: objectsData.length + 1,
    orientation: 'orthogonal',
    renderorder: 'right-down',
    tiledversion: '1.10.2',
    tileheight: TILE_SIZE,
    tilesets: [
      {
        columns: 8,
        firstgid: 1,
        imageheight: 256,
        imagewidth: 256,
        margin: 0,
        name: FLOOR_11_TILESET_NAME,
        spacing: 0,
        tilecount: 64,
        tileheight: TILE_SIZE,
        tilewidth: TILE_SIZE,
      },
    ],
    tilewidth: TILE_SIZE,
    type: 'map',
    version: '1.10',
    width: MAP_W,
  };
}
