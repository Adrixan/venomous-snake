/**
 * Floor 5 – Communications Center
 *
 * Telecom/network floor with antenna arrays, signal boards, and comm booths.
 * Main comms floor (cols 3-25, rows 3-26), signal array upper (cols 3-25, rows 1-2),
 * private comm booths left (cols 1-2), server relay right (cols 26-32, rows 1-29),
 * elevator shaft (cols 33-39).
 */

import { LOBBY_GID } from '../TilesetGenerator';
import type { TiledMap, TiledObject, TiledProperty } from '../TilemapGenerator';

export const FLOOR_5_MAP_KEY = 'floor5';
export const FLOOR_5_TILESET_NAME = 'lobby_tiles';

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
      // Server relay: dark
      if (x >= 26 && x <= 32) {
        setTile(layer, x, y, LOBBY_GID.FLOOR_DARK);
        continue;
      }
      // Main comms and booths: checkerboard
      setTile(layer, x, y, (x + y) % 2 === 0 ? LOBBY_GID.FLOOR_DARK : LOBBY_GID.FLOOR_LIGHT);
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

  // Server relay divider (col 25, rows 1-28) — doors at rows 8 and 20
  for (let y = 1; y < MAP_H - 1; y++) {
    if (y !== 8 && y !== 20) setTile(layer, 25, y, LOBBY_GID.WALL);
  }
  setTile(layer, 25, 0, LOBBY_GID.WALL_CORNER);
  setTile(layer, 25, MAP_H - 1, LOBBY_GID.WALL_CORNER);

  // Private comm booths — horizontal walls every 5 rows (cols 1-2)
  for (const row of [5, 10, 15, 20, 25]) {
    setTile(layer, 1, row, LOBBY_GID.WALL);
    setTile(layer, 2, row, LOBBY_GID.WALL);
  }

  // Signal array bottom wall (row 2, cols 3-24) — open at col 14
  for (let x = 3; x <= 24; x++) {
    if (x !== 14) setTile(layer, x, 2, LOBBY_GID.WALL);
  }

  // Neon strips along signal board area (row 1)
  for (let x = 4; x <= 23; x += 3) {
    setTile(layer, x, 1, LOBBY_GID.NEON_STRIP);
  }
  // Neon along server relay walls
  for (let y = 2; y < MAP_H - 2; y += 4) {
    setTile(layer, 26, y, LOBBY_GID.NEON_STRIP);
  }

  return layer;
}

function buildFurnitureLayer(): number[] {
  const layer = newGrid();

  // Antenna arrays in signal area (VENT tiles, rows 1)
  for (let x = 5; x <= 22; x += 2) {
    setTile(layer, x, 1, LOBBY_GID.VENT);
  }

  // Comm booth desks
  for (let y = 3; y <= 27; y += 5) {
    setTile(layer, 1, y, LOBBY_GID.DESK);
    setTile(layer, 2, y, LOBBY_GID.CHAIR);
  }

  // Main comms floor: workstation clusters
  for (let y = 5; y <= 25; y += 5) {
    for (let x = 6; x <= 22; x += 8) {
      setTile(layer, x, y, LOBBY_GID.DESK);
      setTile(layer, x + 1, y, LOBBY_GID.DESK);
      setTile(layer, x, y + 1, LOBBY_GID.CHAIR);
    }
  }

  // Server relay: VENT and CABLE racks
  for (let y = 2; y <= 27; y += 3) {
    setTile(layer, 27, y, LOBBY_GID.VENT);
    setTile(layer, 28, y, LOBBY_GID.VENT);
    setTile(layer, 30, y, LOBBY_GID.CABLE);
    setTile(layer, 31, y, LOBBY_GID.CABLE);
  }

  return layer;
}

function buildInteractiveLayer(): number[] {
  const layer = newGrid();

  // 8 terminals: ch07_01 through ch07_08
  setTile(layer, 8, 6, LOBBY_GID.TERMINAL); // ch07_01
  setTile(layer, 16, 6, LOBBY_GID.TERMINAL); // ch07_02
  setTile(layer, 8, 14, LOBBY_GID.TERMINAL); // ch07_03
  setTile(layer, 16, 14, LOBBY_GID.TERMINAL); // ch07_04
  setTile(layer, 8, 22, LOBBY_GID.TERMINAL); // ch07_05
  setTile(layer, 16, 22, LOBBY_GID.TERMINAL); // ch07_06
  setTile(layer, 29, 6, LOBBY_GID.TERMINAL); // ch07_07 server relay
  setTile(layer, 29, 18, LOBBY_GID.TERMINAL); // ch07_08 server relay

  // Door tiles
  setTile(layer, 14, 2, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 25, 8, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 25, 20, LOBBY_GID.DOOR_OPEN);
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
    makeObject(nextId++, 'Communications Director Park', 'npc', 12, 10, [
      prop('dialogId', 'dialog_diaz'),
      prop('npcId', 'comm_director_park'),
      prop('behavior', 'idle'),
    ]),
  );
  add(
    makeObject(nextId++, 'Signal Tech Volkov', 'npc', 20, 18, [
      prop('dialogId', 'dialog_volkov'),
      prop('npcId', 'signal_tech_volkov'),
      prop('behavior', 'patrol'),
    ]),
  );
  add(
    makeObject(nextId++, 'Network Engineer Adeyemi', 'npc', 28, 14, [
      prop('dialogId', 'dialog_kowalski'),
      prop('npcId', 'net_eng_adeyemi'),
      prop('behavior', 'wander'),
    ]),
  );

  // Terminals
  add(
    makeObject(nextId++, 'Comm Station 1', 'terminal', 8, 6, [
      prop('challengeId', 'ch07_01_read_file'),
      prop('label', 'Comm Station 1'),
      prop('room', 'main_comms'),
    ]),
  );
  add(
    makeObject(nextId++, 'Comm Station 2', 'terminal', 16, 6, [
      prop('challengeId', 'ch07_02_write_file'),
      prop('label', 'Comm Station 2'),
      prop('room', 'main_comms'),
    ]),
  );
  add(
    makeObject(nextId++, 'Comm Station 3', 'terminal', 8, 14, [
      prop('challengeId', 'ch07_03_file_line_processing'),
      prop('label', 'Comm Station 3'),
      prop('room', 'main_comms'),
    ]),
  );
  add(
    makeObject(nextId++, 'Comm Station 4', 'terminal', 16, 14, [
      prop('challengeId', 'ch07_04_csv_parsing'),
      prop('label', 'Comm Station 4'),
      prop('room', 'main_comms'),
    ]),
  );
  add(
    makeObject(nextId++, 'Comm Station 5', 'terminal', 8, 22, [
      prop('challengeId', 'ch07_05_string_split_join'),
      prop('label', 'Comm Station 5'),
      prop('room', 'main_comms'),
    ]),
  );
  add(
    makeObject(nextId++, 'Comm Station 6', 'terminal', 16, 22, [
      prop('challengeId', 'ch07_06_with_statement'),
      prop('label', 'Comm Station 6'),
      prop('room', 'main_comms'),
    ]),
  );
  add(
    makeObject(nextId++, 'Relay Console 1', 'terminal', 29, 6, [
      prop('challengeId', 'ch07_07_json_parsing'),
      prop('label', 'Relay Console 1'),
      prop('room', 'server_relay'),
    ]),
  );
  add(
    makeObject(nextId++, 'Relay Console 2', 'terminal', 29, 18, [
      prop('challengeId', 'ch07_08_data_transformation'),
      prop('label', 'Relay Console 2'),
      prop('room', 'server_relay'),
    ]),
  );

  // Elevator up (to floor 6)
  add(
    makeObject(nextId++, 'Elevator to Floor 6', 'door', 37, 5, [
      prop('targetFloor', 'floor6'),
      prop('locked', 'true'),
      prop('requiresChallenge', 'ch07_08_data_transformation'),
    ]),
  );
  // Elevator down (to floor 4)
  add(
    makeObject(nextId++, 'Elevator to Floor 4', 'door', 37, 25, [
      prop('targetFloor', 'floor4'),
      prop('locked', 'false'),
    ]),
  );

  // ─── Items ──────────────────────────────────────────────────────────────────
  // Tool near upper comms stations
  add(
    makeObject(nextId++, 'File Handler Tool', 'item', 12, 4, [
      prop('itemType', 'tool'),
      prop('itemId', 'file_handler_tool'),
    ]),
  );
  // Datafile tucked in the lower comms floor corner
  add(
    makeObject(nextId++, 'Comms Encryption Log', 'item', 5, 25, [
      prop('itemType', 'datafile'),
      prop('itemId', 'comms_encryption_log'),
    ]),
  );
  // Tool on open area of main comms floor
  add(
    makeObject(nextId++, 'CSV Processor', 'item', 20, 8, [
      prop('itemType', 'tool'),
      prop('itemId', 'csv_processor'),
    ]),
  );
  // Keycard in the server relay section
  add(
    makeObject(nextId, 'Comms Center Keycard', 'item', 28, 22, [
      prop('itemType', 'keycard'),
      prop('itemId', 'comms_center_keycard'),
    ]),
  );

  return objects;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateFloor5Tilemap(): TiledMap {
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
        name: FLOOR_5_TILESET_NAME,
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
