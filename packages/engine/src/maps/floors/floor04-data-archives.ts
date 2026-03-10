/**
 * Floor 4 – Data Archives
 *
 * Document storage with filing cabinets, shelving rows, and reading rooms.
 * Archive stacks (cols 1-20, rows 1-22) with aisles every 4 cols,
 * reading room (cols 21-32, rows 1-22), restricted vault (cols 1-32, rows 23-29),
 * elevator shaft (cols 33-39).
 */

import { LOBBY_GID } from '../TilesetGenerator';
import type { TiledMap, TiledObject, TiledProperty } from '../TilemapGenerator';

export const FLOOR_4_MAP_KEY = 'floor4';
export const FLOOR_4_TILESET_NAME = 'lobby_tiles';

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
      // Archive stacks: dark
      if (x >= 1 && x <= 20 && y >= 1 && y <= 22) {
        setTile(layer, x, y, LOBBY_GID.FLOOR_DARK);
        continue;
      }
      // Reading room: lighter checkerboard
      if (x >= 21 && x <= 32 && y >= 1 && y <= 22) {
        setTile(layer, x, y, (x + y) % 2 === 0 ? LOBBY_GID.FLOOR_LIGHT : LOBBY_GID.FLOOR_DARK);
        continue;
      }
      // Vault: dark
      setTile(layer, x, y, LOBBY_GID.FLOOR_DARK);
    }
  }
  return layer;
}

function buildWallsLayer(): number[] {
  const layer = newGrid();

  // Outer perimeter
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
    if (y !== 5 && y !== 25) setTile(layer, 33, y, LOBBY_GID.WALL);
  }
  setTile(layer, 33, 0, LOBBY_GID.WALL_CORNER);
  setTile(layer, 33, MAP_H - 1, LOBBY_GID.WALL_CORNER);

  // Archive/reading divider (col 20, rows 1-22) — door at row 11
  for (let y = 1; y <= 22; y++) {
    if (y !== 11) setTile(layer, 20, y, LOBBY_GID.WALL);
  }
  setTile(layer, 20, 0, LOBBY_GID.WALL_CORNER);

  // Vault horizontal wall (row 22, cols 1-32) — door at col 16
  for (let x = 1; x <= 32; x++) {
    if (x !== 16) setTile(layer, x, 22, LOBBY_GID.WALL);
  }
  setTile(layer, 0, 22, LOBBY_GID.WALL_CORNER);
  setTile(layer, 20, 22, LOBBY_GID.WALL_CORNER);
  setTile(layer, 33, 22, LOBBY_GID.WALL_CORNER);

  // Neon accents along vault walls
  for (let x = 2; x <= 30; x += 4) {
    setTile(layer, x, 23, LOBBY_GID.NEON_STRIP);
  }

  return layer;
}

function buildFurnitureLayer(): number[] {
  const layer = newGrid();

  // Archive shelving rows (DESK tiles) — 5 rows separated by aisles every 4 cols
  for (let x = 2; x <= 18; x += 4) {
    for (let y = 2; y <= 20; y++) {
      // Aisle gaps at y = 7, 14
      if (y === 7 || y === 14) continue;
      setTile(layer, x, y, LOBBY_GID.DESK);
      setTile(layer, x + 1, y, LOBBY_GID.DESK);
    }
  }

  // Reading room: chairs and desks
  for (let y = 3; y <= 19; y += 4) {
    setTile(layer, 23, y, LOBBY_GID.DESK);
    setTile(layer, 24, y, LOBBY_GID.DESK);
    setTile(layer, 23, y + 1, LOBBY_GID.CHAIR);
    setTile(layer, 24, y + 1, LOBBY_GID.CHAIR);
    setTile(layer, 28, y, LOBBY_GID.DESK);
    setTile(layer, 29, y, LOBBY_GID.DESK);
    setTile(layer, 28, y + 1, LOBBY_GID.CHAIR);
  }

  // Vault: heavy shelving
  for (let x = 3; x <= 29; x += 6) {
    setTile(layer, x, 25, LOBBY_GID.DESK);
    setTile(layer, x + 1, 25, LOBBY_GID.DESK);
    setTile(layer, x, 27, LOBBY_GID.DESK);
    setTile(layer, x + 1, 27, LOBBY_GID.DESK);
  }

  return layer;
}

function buildInteractiveLayer(): number[] {
  const layer = newGrid();

  // 10 terminals: ch06_01 through ch06_10
  setTile(layer, 4, 4, LOBBY_GID.TERMINAL); // ch06_01
  setTile(layer, 12, 4, LOBBY_GID.TERMINAL); // ch06_02
  setTile(layer, 4, 10, LOBBY_GID.TERMINAL); // ch06_03
  setTile(layer, 12, 10, LOBBY_GID.TERMINAL); // ch06_04
  setTile(layer, 4, 18, LOBBY_GID.TERMINAL); // ch06_05
  setTile(layer, 12, 18, LOBBY_GID.TERMINAL); // ch06_06
  setTile(layer, 25, 5, LOBBY_GID.TERMINAL); // ch06_07 reading room
  setTile(layer, 30, 12, LOBBY_GID.TERMINAL); // ch06_08 reading room
  setTile(layer, 8, 25, LOBBY_GID.TERMINAL); // ch06_09 vault
  setTile(layer, 22, 26, LOBBY_GID.TERMINAL); // ch06_10 vault

  // Door tiles
  setTile(layer, 20, 11, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 16, 22, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 33, 5, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 33, 25, LOBBY_GID.DOOR_OPEN);

  // Elevator tiles
  setTile(layer, 36, 5, LOBBY_GID.ELEVATOR);
  setTile(layer, 37, 5, LOBBY_GID.ELEVATOR);
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
    makeObject(nextId++, 'Archivist Huang', 'npc', 10, 7, [
      prop('dialogId', 'dialog_okafor'),
      prop('npcId', 'archivist_huang'),
      prop('behavior', 'idle'),
    ]),
  );
  add(
    makeObject(nextId++, 'Security Drone Alpha', 'npc', 16, 14, [
      prop('dialogId', 'dialog_delta7'),
      prop('npcId', 'security_drone_alpha'),
      prop('behavior', 'patrol'),
    ]),
  );
  add(
    makeObject(nextId++, 'Records Clerk Osei', 'npc', 25, 10, [
      prop('dialogId', 'dialog_jamie'),
      prop('npcId', 'records_clerk_osei'),
      prop('behavior', 'wander'),
    ]),
  );

  // Terminals
  add(
    makeObject(nextId++, 'Archive Terminal A1', 'terminal', 4, 4, [
      prop('challengeId', 'ch06_01_create_list'),
      prop('label', 'Archive Terminal A1'),
      prop('room', 'archive_stacks'),
    ]),
  );
  add(
    makeObject(nextId++, 'Archive Terminal A2', 'terminal', 12, 4, [
      prop('challengeId', 'ch06_02_list_methods'),
      prop('label', 'Archive Terminal A2'),
      prop('room', 'archive_stacks'),
    ]),
  );
  add(
    makeObject(nextId++, 'Archive Terminal B1', 'terminal', 4, 10, [
      prop('challengeId', 'ch06_03_list_slicing'),
      prop('label', 'Archive Terminal B1'),
      prop('room', 'archive_stacks'),
    ]),
  );
  add(
    makeObject(nextId++, 'Archive Terminal B2', 'terminal', 12, 10, [
      prop('challengeId', 'ch06_04_list_comprehension'),
      prop('label', 'Archive Terminal B2'),
      prop('room', 'archive_stacks'),
    ]),
  );
  add(
    makeObject(nextId++, 'Archive Terminal C1', 'terminal', 4, 18, [
      prop('challengeId', 'ch06_05_tuples'),
      prop('label', 'Archive Terminal C1'),
      prop('room', 'archive_stacks'),
    ]),
  );
  add(
    makeObject(nextId++, 'Archive Terminal C2', 'terminal', 12, 18, [
      prop('challengeId', 'ch06_06_dictionaries'),
      prop('label', 'Archive Terminal C2'),
      prop('room', 'archive_stacks'),
    ]),
  );
  add(
    makeObject(nextId++, 'Reading Room Kiosk 1', 'terminal', 25, 5, [
      prop('challengeId', 'ch06_07_dict_methods'),
      prop('label', 'Reading Room Kiosk 1'),
      prop('room', 'reading_room'),
    ]),
  );
  add(
    makeObject(nextId++, 'Reading Room Kiosk 2', 'terminal', 30, 12, [
      prop('challengeId', 'ch06_08_nested_dicts'),
      prop('label', 'Reading Room Kiosk 2'),
      prop('room', 'reading_room'),
    ]),
  );
  add(
    makeObject(nextId++, 'Vault Access Terminal', 'terminal', 8, 25, [
      prop('challengeId', 'ch06_09_sets'),
      prop('label', 'Vault Access Terminal'),
      prop('room', 'restricted_vault'),
    ]),
  );
  add(
    makeObject(nextId++, 'Vault Core Terminal', 'terminal', 22, 26, [
      prop('challengeId', 'ch06_10_combining_collections'),
      prop('label', 'Vault Core Terminal'),
      prop('room', 'restricted_vault'),
    ]),
  );

  // Elevator up (to floor 5)
  add(
    makeObject(nextId++, 'Elevator to Floor 5', 'door', 37, 5, [
      prop('targetFloor', 'floor5'),
      prop('locked', 'true'),
      prop('requiresChallenge', 'ch06_10_combining_collections'),
    ]),
  );
  // Elevator down (to floor 3)
  add(
    makeObject(nextId++, 'Elevator to Floor 3', 'door', 37, 25, [
      prop('targetFloor', 'floor3'),
      prop('locked', 'false'),
    ]),
  );

  // ─── Items ──────────────────────────────────────────────────────────────────
  // Datafile in archive aisle between shelf rows (col 5 is a walkable gap)
  add(
    makeObject(nextId++, 'List Comprehension Guide', 'item', 5, 3, [
      prop('itemType', 'datafile'),
      prop('itemId', 'list_comprehension_guide'),
    ]),
  );
  // Tool on reading-room table, away from desks
  add(
    makeObject(nextId++, 'JSON Parser Tool', 'item', 26, 8, [
      prop('itemType', 'tool'),
      prop('itemId', 'json_parser_tool'),
    ]),
  );
  // Datafile on reading-room desk between desk clusters (row 13 is a gap)
  add(
    makeObject(nextId++, 'Dictionary Reference', 'item', 23, 13, [
      prop('itemType', 'datafile'),
      prop('itemId', 'dictionary_reference'),
    ]),
  );
  // Keycard in vault between heavy shelving groups
  add(
    makeObject(nextId, 'Data Archives Keycard', 'item', 17, 26, [
      prop('itemType', 'keycard'),
      prop('itemId', 'data_archives_keycard'),
    ]),
  );

  return objects;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateFloor4Tilemap(): TiledMap {
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
        name: FLOOR_4_TILESET_NAME,
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
