/**
 * Floor 9 – AI Core
 *
 * Computer center with mainframe rows, neural network visualizers.
 * Mainframe hall (cols 1-32, rows 3-27), 4 N-S mainframe clusters
 * (cols 2-6, 10-14, 18-22, 26-30), cooling conduits at rows 1-2 and 28-29,
 * central neural hub (cols 13-19, rows 10-20), elevator shaft (cols 33-39).
 */

import { LOBBY_GID } from '../TilesetGenerator';
import type { TiledMap, TiledObject, TiledProperty } from '../TilemapGenerator';

export const FLOOR_9_MAP_KEY = 'floor9';
export const FLOOR_9_TILESET_NAME = 'lobby_tiles';

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
      // Neural hub: lighter floor
      if (x >= 13 && x <= 19 && y >= 10 && y <= 20) {
        setTile(layer, x, y, (x + y) % 2 === 0 ? LOBBY_GID.FLOOR_LIGHT : LOBBY_GID.FLOOR_DARK);
        continue;
      }
      // Cooling conduits: dark
      if (y <= 2 || y >= 28) {
        setTile(layer, x, y, LOBBY_GID.FLOOR_DARK);
        continue;
      }
      // Mainframe hall: dark industrial
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

  // Cooling conduit walls (rows 2 and 28)
  for (let x = 1; x <= 32; x++) {
    if (x !== 8 && x !== 24) setTile(layer, x, 2, LOBBY_GID.WALL); // doors at cols 8, 24
    if (x !== 8 && x !== 24) setTile(layer, x, 27, LOBBY_GID.WALL);
  }

  // Neural hub border walls
  for (let x = 13; x <= 19; x++) {
    setTile(layer, x, 9, LOBBY_GID.WALL);
    setTile(layer, x, 21, LOBBY_GID.WALL);
  }
  for (let y = 10; y <= 20; y++) {
    if (y !== 15) setTile(layer, 12, y, LOBBY_GID.WALL); // door at row 15
    if (y !== 15) setTile(layer, 20, y, LOBBY_GID.WALL);
  }
  // Remove wall where door openings at hub
  setTile(layer, 16, 9, 0); // north entrance
  setTile(layer, 16, 21, 0); // south entrance
  setTile(layer, 12, 9, LOBBY_GID.WALL_CORNER);
  setTile(layer, 20, 9, LOBBY_GID.WALL_CORNER);
  setTile(layer, 12, 21, LOBBY_GID.WALL_CORNER);
  setTile(layer, 20, 21, LOBBY_GID.WALL_CORNER);

  // Neon strips in neural hub — every 2 tiles
  for (let x = 13; x <= 19; x += 2) {
    setTile(layer, x, 10, LOBBY_GID.NEON_STRIP);
    setTile(layer, x, 20, LOBBY_GID.NEON_STRIP);
  }
  for (let y = 11; y <= 19; y += 2) {
    setTile(layer, 13, y, LOBBY_GID.NEON_STRIP);
    setTile(layer, 19, y, LOBBY_GID.NEON_STRIP);
  }

  return layer;
}

function buildFurnitureLayer(): number[] {
  const layer = newGrid();

  // Cooling conduits (VENT tiles at rows 1-2 and 28-29)
  for (let x = 1; x <= 31; x += 2) {
    setTile(layer, x, 1, LOBBY_GID.VENT);
    setTile(layer, x + 1, 1, LOBBY_GID.VENT);
    setTile(layer, x, 28, LOBBY_GID.VENT);
    setTile(layer, x + 1, 28, LOBBY_GID.VENT);
  }

  // Mainframe clusters — 4 N-S columns with VENT tiles
  const clusterCols: [number, number][] = [
    [2, 6],
    [10, 14],
    [18, 22],
    [26, 30],
  ];
  for (const [cStart, cEnd] of clusterCols) {
    // Skip cluster tiles that overlap with neural hub walls
    for (let y = 4; y <= 26; y++) {
      if (y >= 9 && y <= 21 && cStart >= 12 && cEnd <= 20) continue;
      for (let x = cStart; x <= cEnd; x += 2) {
        if (x <= 31) setTile(layer, x, y, LOBBY_GID.VENT);
      }
    }
  }

  // Cable connections between mainframe clusters
  for (let y = 6; y <= 24; y += 6) {
    for (let x = 7; x <= 25; x += 8) {
      setTile(layer, x, y, LOBBY_GID.CABLE);
      setTile(layer, x + 1, y, LOBBY_GID.CABLE);
    }
  }

  // Neural hub interior: desk clusters
  setTile(layer, 15, 13, LOBBY_GID.DESK);
  setTile(layer, 16, 13, LOBBY_GID.DESK);
  setTile(layer, 17, 13, LOBBY_GID.DESK);
  setTile(layer, 15, 14, LOBBY_GID.CHAIR);
  setTile(layer, 17, 14, LOBBY_GID.CHAIR);
  setTile(layer, 15, 17, LOBBY_GID.DESK);
  setTile(layer, 16, 17, LOBBY_GID.DESK);
  setTile(layer, 17, 17, LOBBY_GID.DESK);
  setTile(layer, 16, 18, LOBBY_GID.CHAIR);

  return layer;
}

function buildInteractiveLayer(): number[] {
  const layer = newGrid();

  // 8 terminals: ch11_01 through ch11_08
  setTile(layer, 4, 6, LOBBY_GID.TERMINAL); // ch11_01 cluster 1
  setTile(layer, 12, 6, LOBBY_GID.TERMINAL); // ch11_02 cluster 2
  setTile(layer, 28, 6, LOBBY_GID.TERMINAL); // ch11_03 cluster 4
  setTile(layer, 4, 22, LOBBY_GID.TERMINAL); // ch11_04 cluster 1
  setTile(layer, 28, 22, LOBBY_GID.TERMINAL); // ch11_05 cluster 4
  setTile(layer, 16, 12, LOBBY_GID.TERMINAL); // ch11_06 neural hub
  setTile(layer, 16, 18, LOBBY_GID.TERMINAL); // ch11_07 neural hub
  setTile(layer, 16, 15, LOBBY_GID.TERMINAL); // ch11_08 neural hub center

  // Door tiles
  setTile(layer, 8, 2, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 24, 2, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 8, 27, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 24, 27, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 16, 9, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 16, 21, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 12, 15, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 20, 15, LOBBY_GID.DOOR_OPEN);
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
    makeObject(nextId++, 'AI Systems Director Zhao', 'npc', 16, 14, [
      prop('dialogId', 'ai_director_zhao'),
      prop('npcId', 'ai_director_zhao'),
      prop('behavior', 'idle'),
    ]),
  );
  add(
    makeObject(nextId++, 'Neural Tech Petrov', 'npc', 8, 14, [
      prop('dialogId', 'neural_tech_petrov'),
      prop('npcId', 'neural_tech_petrov'),
      prop('behavior', 'patrol'),
    ]),
  );
  add(
    makeObject(nextId++, 'Security AI Unit', 'npc', 28, 14, [
      prop('dialogId', 'security_ai_unit'),
      prop('npcId', 'security_ai_unit'),
      prop('behavior', 'guard'),
    ]),
  );

  // Terminals
  add(
    makeObject(nextId++, 'Mainframe Node 1', 'terminal', 4, 6, [
      prop('challengeId', 'ch11_01'),
      prop('label', 'Mainframe Node 1'),
      prop('room', 'cluster_1'),
    ]),
  );
  add(
    makeObject(nextId++, 'Mainframe Node 2', 'terminal', 12, 6, [
      prop('challengeId', 'ch11_02'),
      prop('label', 'Mainframe Node 2'),
      prop('room', 'cluster_2'),
    ]),
  );
  add(
    makeObject(nextId++, 'Mainframe Node 3', 'terminal', 28, 6, [
      prop('challengeId', 'ch11_03'),
      prop('label', 'Mainframe Node 3'),
      prop('room', 'cluster_4'),
    ]),
  );
  add(
    makeObject(nextId++, 'Mainframe Node 4', 'terminal', 4, 22, [
      prop('challengeId', 'ch11_04'),
      prop('label', 'Mainframe Node 4'),
      prop('room', 'cluster_1'),
    ]),
  );
  add(
    makeObject(nextId++, 'Mainframe Node 5', 'terminal', 28, 22, [
      prop('challengeId', 'ch11_05'),
      prop('label', 'Mainframe Node 5'),
      prop('room', 'cluster_4'),
    ]),
  );
  add(
    makeObject(nextId++, 'Neural Hub North', 'terminal', 16, 12, [
      prop('challengeId', 'ch11_06'),
      prop('label', 'Neural Hub North'),
      prop('room', 'neural_hub'),
    ]),
  );
  add(
    makeObject(nextId++, 'Neural Hub South', 'terminal', 16, 18, [
      prop('challengeId', 'ch11_07'),
      prop('label', 'Neural Hub South'),
      prop('room', 'neural_hub'),
    ]),
  );
  add(
    makeObject(nextId++, 'Neural Core Access', 'terminal', 16, 15, [
      prop('challengeId', 'ch11_08'),
      prop('label', 'Neural Core Access'),
      prop('room', 'neural_hub'),
    ]),
  );

  // Elevator up (to floor 10)
  add(
    makeObject(nextId++, 'Elevator to Floor 10', 'door', 37, 5, [
      prop('targetFloor', 'floor10'),
      prop('locked', 'true'),
      prop('requiresChallenge', 'ch11_08'),
    ]),
  );
  // Elevator down (to floor 8)
  add(
    makeObject(nextId++, 'Elevator to Floor 8', 'door', 37, 25, [
      prop('targetFloor', 'floor8'),
      prop('locked', 'false'),
    ]),
  );

  // ─── Items ──────────────────────────────────────────────────────────────────
  // Datafile in the aisle between mainframe clusters 1 and 2 (upper hall)
  add(
    makeObject(nextId++, 'Neural Network Log', 'item', 9, 4, [
      prop('itemType', 'datafile'),
      prop('itemId', 'neural_network_log'),
    ]),
  );
  // Keycard near cluster 3, lower hall
  add(
    makeObject(nextId++, 'AI Core Access', 'item', 22, 24, [
      prop('itemType', 'keycard'),
      prop('itemId', 'ai_core_access'),
    ]),
  );
  // Tool in the aisle between clusters 1 and 2 (lower hall)
  add(
    makeObject(nextId++, 'Decorator Pattern Tool', 'item', 9, 22, [
      prop('itemType', 'tool'),
      prop('itemId', 'decorator_pattern_tool'),
    ]),
  );
  // Tool between cluster 3 and the neural hub
  add(
    makeObject(nextId, 'Lambda Optimizer', 'item', 24, 18, [
      prop('itemType', 'tool'),
      prop('itemId', 'lambda_optimizer'),
    ]),
  );

  return objects;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateFloor9Tilemap(): TiledMap {
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
        name: FLOOR_9_TILESET_NAME,
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
