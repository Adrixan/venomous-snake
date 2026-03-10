/**
 * Floor 7 – Manufacturing Floor
 *
 * Production area with assembly lines and QA stations.
 * Main open floor (cols 1-32, rows 1-29), 3 east-west assembly lines
 * at rows 5-7, 13-15, 22-24, QA stations between lines, control room
 * upper-left (cols 1-8, rows 1-4), elevator shaft (cols 33-39).
 */

import { LOBBY_GID } from '../TilesetGenerator';
import type { TiledMap, TiledObject, TiledProperty } from '../TilemapGenerator';

export const FLOOR_7_MAP_KEY = 'floor7';
export const FLOOR_7_TILESET_NAME = 'lobby_tiles';

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
      // Assembly line rows: dark industrial
      if ((y >= 5 && y <= 7) || (y >= 13 && y <= 15) || (y >= 22 && y <= 24)) {
        setTile(layer, x, y, LOBBY_GID.FLOOR_DARK);
        continue;
      }
      // Rest of floor: checkerboard
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

  // Control room walls (cols 1-8, row 4 and col 8, rows 1-4) — door at col 5 (row 4), row 2 (col 8)
  for (let x = 1; x <= 8; x++) {
    if (x !== 5) setTile(layer, x, 4, LOBBY_GID.WALL);
  }
  for (let y = 1; y <= 4; y++) {
    if (y !== 2) setTile(layer, 8, y, LOBBY_GID.WALL);
  }
  setTile(layer, 0, 4, LOBBY_GID.WALL_CORNER);
  setTile(layer, 8, 0, LOBBY_GID.WALL_CORNER);
  setTile(layer, 8, 4, LOBBY_GID.WALL_CORNER);

  // Neon accents on assembly line edges
  for (let x = 2; x <= 30; x += 5) {
    setTile(layer, x, 4, x <= 8 ? LOBBY_GID.WALL : LOBBY_GID.NEON_STRIP);
    setTile(layer, x, 8, LOBBY_GID.NEON_STRIP);
    setTile(layer, x, 12, LOBBY_GID.NEON_STRIP);
    setTile(layer, x, 16, LOBBY_GID.NEON_STRIP);
  }

  return layer;
}

function buildFurnitureLayer(): number[] {
  const layer = newGrid();

  // Assembly lines: dense CABLE + VENT tiles
  const assemblyRows: [number, number][] = [
    [5, 7],
    [13, 15],
    [22, 24],
  ];
  for (const [startRow, endRow] of assemblyRows) {
    for (let x = 2; x <= 31; x++) {
      setTile(layer, x, startRow, LOBBY_GID.CABLE);
      setTile(layer, x, startRow + 1, LOBBY_GID.VENT);
      setTile(layer, x, endRow, LOBBY_GID.CABLE);
    }
  }

  // QA stations between assembly lines (rows 8-9, 16-17)
  for (let x = 4; x <= 28; x += 8) {
    setTile(layer, x, 9, LOBBY_GID.DESK);
    setTile(layer, x + 1, 9, LOBBY_GID.DESK);
    setTile(layer, x, 10, LOBBY_GID.CHAIR);
    setTile(layer, x, 17, LOBBY_GID.DESK);
    setTile(layer, x + 1, 17, LOBBY_GID.DESK);
    setTile(layer, x, 18, LOBBY_GID.CHAIR);
  }

  // Control room: desk + monitoring
  setTile(layer, 2, 2, LOBBY_GID.DESK);
  setTile(layer, 3, 2, LOBBY_GID.DESK);
  setTile(layer, 4, 2, LOBBY_GID.DESK);
  setTile(layer, 5, 2, LOBBY_GID.DESK);
  setTile(layer, 2, 3, LOBBY_GID.CHAIR);
  setTile(layer, 4, 3, LOBBY_GID.CHAIR);

  return layer;
}

function buildInteractiveLayer(): number[] {
  const layer = newGrid();

  // 10 terminals: ch09_01 through ch09_10
  setTile(layer, 3, 2, LOBBY_GID.TERMINAL); // ch09_01 control room
  setTile(layer, 6, 9, LOBBY_GID.TERMINAL); // ch09_02 QA station
  setTile(layer, 14, 9, LOBBY_GID.TERMINAL); // ch09_03 QA station
  setTile(layer, 22, 9, LOBBY_GID.TERMINAL); // ch09_04 QA station
  setTile(layer, 6, 17, LOBBY_GID.TERMINAL); // ch09_05 QA station
  setTile(layer, 14, 17, LOBBY_GID.TERMINAL); // ch09_06 QA station
  setTile(layer, 22, 17, LOBBY_GID.TERMINAL); // ch09_07 QA station
  setTile(layer, 10, 26, LOBBY_GID.TERMINAL); // ch09_08
  setTile(layer, 20, 26, LOBBY_GID.TERMINAL); // ch09_09
  setTile(layer, 30, 26, LOBBY_GID.TERMINAL); // ch09_10

  // Door tiles
  setTile(layer, 5, 4, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 8, 2, LOBBY_GID.DOOR_OPEN);
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
    makeObject(nextId++, 'Floor Manager Vasquez', 'npc', 16, 11, [
      prop('dialogId', 'dialog_kowalski'),
      prop('npcId', 'floor_mgr_vasquez'),
      prop('behavior', 'patrol'),
    ]),
  );
  add(
    makeObject(nextId++, 'Robotic Arm Operator', 'npc', 8, 6, [
      prop('dialogId', 'dialog_labbot'),
      prop('npcId', 'robotic_arm_op'),
      prop('behavior', 'idle'),
    ]),
  );
  add(
    makeObject(nextId++, 'QA Inspector Ito', 'npc', 24, 17, [
      prop('dialogId', 'dialog_delta7'),
      prop('npcId', 'qa_inspector_ito'),
      prop('behavior', 'patrol'),
    ]),
  );

  // Terminals
  add(
    makeObject(nextId++, 'Control Room Console', 'terminal', 3, 2, [
      prop('challengeId', 'ch09_01_importing_modules'),
      prop('label', 'Control Room Console'),
      prop('room', 'control_room'),
    ]),
  );
  add(
    makeObject(nextId++, 'QA Station A1', 'terminal', 6, 9, [
      prop('challengeId', 'ch09_02_from_import'),
      prop('label', 'QA Station A1'),
      prop('room', 'qa_station_a'),
    ]),
  );
  add(
    makeObject(nextId++, 'QA Station A2', 'terminal', 14, 9, [
      prop('challengeId', 'ch09_03_lambda_functions'),
      prop('label', 'QA Station A2'),
      prop('room', 'qa_station_a'),
    ]),
  );
  add(
    makeObject(nextId++, 'QA Station A3', 'terminal', 22, 9, [
      prop('challengeId', 'ch09_04_map_function'),
      prop('label', 'QA Station A3'),
      prop('room', 'qa_station_a'),
    ]),
  );
  add(
    makeObject(nextId++, 'QA Station B1', 'terminal', 6, 17, [
      prop('challengeId', 'ch09_05_filter_function'),
      prop('label', 'QA Station B1'),
      prop('room', 'qa_station_b'),
    ]),
  );
  add(
    makeObject(nextId++, 'QA Station B2', 'terminal', 14, 17, [
      prop('challengeId', 'ch09_06_list_comprehension_conditionals'),
      prop('label', 'QA Station B2'),
      prop('room', 'qa_station_b'),
    ]),
  );
  add(
    makeObject(nextId++, 'QA Station B3', 'terminal', 22, 17, [
      prop('challengeId', 'ch09_07_dictionary_comprehension'),
      prop('label', 'QA Station B3'),
      prop('room', 'qa_station_b'),
    ]),
  );
  add(
    makeObject(nextId++, 'Assembly Terminal 1', 'terminal', 10, 26, [
      prop('challengeId', 'ch09_08_string_formatting_advanced'),
      prop('label', 'Assembly Terminal 1'),
      prop('room', 'main_floor'),
    ]),
  );
  add(
    makeObject(nextId++, 'Assembly Terminal 2', 'terminal', 20, 26, [
      prop('challengeId', 'ch09_09_regular_expressions'),
      prop('label', 'Assembly Terminal 2'),
      prop('room', 'main_floor'),
    ]),
  );
  add(
    makeObject(nextId++, 'Assembly Terminal 3', 'terminal', 30, 26, [
      prop('challengeId', 'ch09_10_combining_tools'),
      prop('label', 'Assembly Terminal 3'),
      prop('room', 'main_floor'),
    ]),
  );

  // Elevator up (to floor 8)
  add(
    makeObject(nextId++, 'Elevator to Floor 8', 'door', 37, 5, [
      prop('targetFloor', 'floor8'),
      prop('locked', 'true'),
      prop('requiresChallenge', 'ch09_10_combining_tools'),
    ]),
  );
  // Elevator down (to floor 6)
  add(
    makeObject(nextId++, 'Elevator to Floor 6', 'door', 37, 25, [
      prop('targetFloor', 'floor6'),
      prop('locked', 'false'),
    ]),
  );

  // ─── Items ──────────────────────────────────────────────────────────────────
  // Tool in the control room area (upper-left)
  add(
    makeObject(nextId++, 'Module Loader', 'item', 6, 3, [
      prop('itemType', 'tool'),
      prop('itemId', 'module_loader'),
    ]),
  );
  // Datafile on the open factory floor between assembly lines
  add(
    makeObject(nextId++, 'Manufacturing Blueprint', 'item', 18, 11, [
      prop('itemType', 'datafile'),
      prop('itemId', 'manufacturing_blueprint'),
    ]),
  );
  // Keycard on the open floor near the east wall
  add(
    makeObject(nextId++, 'Factory Access Key', 'item', 28, 4, [
      prop('itemType', 'keycard'),
      prop('itemId', 'factory_access_key'),
    ]),
  );
  // Tool between assembly lines 2 and 3
  add(
    makeObject(nextId, 'Pip Installer Patch', 'item', 14, 20, [
      prop('itemType', 'tool'),
      prop('itemId', 'pip_installer_patch'),
    ]),
  );

  return objects;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateFloor7Tilemap(): TiledMap {
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
        name: FLOOR_7_TILESET_NAME,
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
