/**
 * Floor 6 – Executive Wing
 *
 * Corporate offices with boardroom and executive lounge. More opulent.
 * Boardroom center (cols 8-24, rows 6-20), corner offices upper-left (cols 1-7, rows 1-12)
 * and upper-right (cols 25-32, rows 1-12), lower offices (cols 1-32, rows 21-29),
 * elevator shaft (cols 33-39).
 */

import { LOBBY_GID } from '../TilesetGenerator';
import type { TiledMap, TiledObject, TiledProperty } from '../TilemapGenerator';

export const FLOOR_6_MAP_KEY = 'floor6';
export const FLOOR_6_TILESET_NAME = 'lobby_tiles';

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
      // Boardroom: elegant checkerboard
      if (x >= 8 && x <= 24 && y >= 6 && y <= 20) {
        setTile(layer, x, y, (x + y) % 2 === 0 ? LOBBY_GID.FLOOR_LIGHT : LOBBY_GID.FLOOR_DARK);
        continue;
      }
      // Corner offices and lower offices: light floor
      setTile(layer, x, y, LOBBY_GID.FLOOR_LIGHT);
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

  // Upper-left office walls (col 7, rows 1-12 and row 12, cols 1-7) — door at row 6 (col 7), col 4 (row 12)
  for (let y = 1; y <= 12; y++) {
    if (y !== 6) setTile(layer, 7, y, LOBBY_GID.WALL);
  }
  for (let x = 1; x <= 7; x++) {
    if (x !== 4) setTile(layer, x, 12, LOBBY_GID.WALL);
  }
  setTile(layer, 7, 0, LOBBY_GID.WALL_CORNER);
  setTile(layer, 0, 12, LOBBY_GID.WALL_CORNER);
  setTile(layer, 7, 12, LOBBY_GID.WALL_CORNER);

  // Upper-right office walls (col 25, rows 1-12 and row 12, cols 25-32) — door at row 6 (col 25), col 28 (row 12)
  for (let y = 1; y <= 12; y++) {
    if (y !== 6) setTile(layer, 25, y, LOBBY_GID.WALL);
  }
  for (let x = 25; x <= 32; x++) {
    if (x !== 28) setTile(layer, x, 12, LOBBY_GID.WALL);
  }
  setTile(layer, 25, 0, LOBBY_GID.WALL_CORNER);
  setTile(layer, 25, 12, LOBBY_GID.WALL_CORNER);
  setTile(layer, 32, 12, LOBBY_GID.WALL_CORNER);

  // Lower offices divider wall (row 20, cols 1-32) — door at col 16
  for (let x = 1; x <= 32; x++) {
    if (x !== 16) setTile(layer, x, 20, LOBBY_GID.WALL);
  }
  setTile(layer, 0, 20, LOBBY_GID.WALL_CORNER);
  setTile(layer, 33, 20, LOBBY_GID.WALL_CORNER);

  // Lower office internal dividers at cols 10, 20 (rows 21-28)
  for (let y = 21; y < MAP_H - 1; y++) {
    if (y !== 24) setTile(layer, 10, y, LOBBY_GID.WALL); // door at row 24
    if (y !== 24) setTile(layer, 20, y, LOBBY_GID.WALL);
  }

  // Neon accents — more frequent here (prestige)
  for (let x = 9; x <= 23; x += 2) {
    setTile(layer, x, 5, LOBBY_GID.NEON_STRIP);
  }
  for (let x = 9; x <= 23; x += 2) {
    setTile(layer, x, 21, LOBBY_GID.NEON_STRIP);
  }
  for (let y = 7; y <= 19; y += 3) {
    setTile(layer, 8, y, LOBBY_GID.NEON_STRIP);
  }

  return layer;
}

function buildFurnitureLayer(): number[] {
  const layer = newGrid();

  // Boardroom table (RECEPTION_DESK + DESK cluster)
  for (let x = 12; x <= 20; x++) {
    setTile(layer, x, 11, LOBBY_GID.RECEPTION_DESK);
    setTile(layer, x, 12, LOBBY_GID.DESK);
  }
  // Chairs around boardroom table
  for (let x = 12; x <= 20; x += 2) {
    setTile(layer, x, 10, LOBBY_GID.CHAIR);
    setTile(layer, x, 13, LOBBY_GID.CHAIR);
  }
  setTile(layer, 11, 11, LOBBY_GID.CHAIR);
  setTile(layer, 11, 12, LOBBY_GID.CHAIR);
  setTile(layer, 21, 11, LOBBY_GID.CHAIR);
  setTile(layer, 21, 12, LOBBY_GID.CHAIR);

  // Luxury planters in corners
  setTile(layer, 9, 7, LOBBY_GID.PLANTER);
  setTile(layer, 23, 7, LOBBY_GID.PLANTER);
  setTile(layer, 9, 19, LOBBY_GID.PLANTER);
  setTile(layer, 23, 19, LOBBY_GID.PLANTER);
  setTile(layer, 1, 1, LOBBY_GID.PLANTER);
  setTile(layer, 6, 1, LOBBY_GID.PLANTER);
  setTile(layer, 26, 1, LOBBY_GID.PLANTER);
  setTile(layer, 31, 1, LOBBY_GID.PLANTER);

  // Upper-left office: executive desk
  setTile(layer, 3, 5, LOBBY_GID.DESK);
  setTile(layer, 4, 5, LOBBY_GID.DESK);
  setTile(layer, 3, 6, LOBBY_GID.CHAIR);

  // Upper-right office: executive desk
  setTile(layer, 28, 5, LOBBY_GID.DESK);
  setTile(layer, 29, 5, LOBBY_GID.DESK);
  setTile(layer, 28, 6, LOBBY_GID.CHAIR);

  // Lower offices: desk clusters
  for (let baseX = 2; baseX <= 28; baseX += 10) {
    setTile(layer, baseX, 24, LOBBY_GID.DESK);
    setTile(layer, baseX + 1, 24, LOBBY_GID.DESK);
    setTile(layer, baseX, 25, LOBBY_GID.CHAIR);
    setTile(layer, baseX + 4, 27, LOBBY_GID.DESK);
    setTile(layer, baseX + 5, 27, LOBBY_GID.DESK);
    setTile(layer, baseX + 4, 28, LOBBY_GID.CHAIR);
  }

  return layer;
}

function buildInteractiveLayer(): number[] {
  const layer = newGrid();

  // 8 terminals: ch08_01 through ch08_08
  setTile(layer, 3, 3, LOBBY_GID.TERMINAL); // ch08_01 upper-left office
  setTile(layer, 28, 3, LOBBY_GID.TERMINAL); // ch08_02 upper-right office
  setTile(layer, 10, 8, LOBBY_GID.TERMINAL); // ch08_03 boardroom
  setTile(layer, 22, 8, LOBBY_GID.TERMINAL); // ch08_04 boardroom
  setTile(layer, 16, 16, LOBBY_GID.TERMINAL); // ch08_05 boardroom
  setTile(layer, 5, 24, LOBBY_GID.TERMINAL); // ch08_06 lower office
  setTile(layer, 15, 24, LOBBY_GID.TERMINAL); // ch08_07 lower office
  setTile(layer, 25, 24, LOBBY_GID.TERMINAL); // ch08_08 lower office

  // Door tiles
  setTile(layer, 7, 6, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 4, 12, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 25, 6, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 28, 12, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 16, 20, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 10, 24, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 20, 24, LOBBY_GID.DOOR_OPEN);
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
    makeObject(nextId++, 'VP Richards', 'npc', 4, 4, [
      prop('dialogId', 'vp_richards'),
      prop('npcId', 'vp_richards'),
      prop('behavior', 'idle'),
    ]),
  );
  add(
    makeObject(nextId++, 'Executive Assistant Pham', 'npc', 16, 14, [
      prop('dialogId', 'exec_assistant_pham'),
      prop('npcId', 'exec_assistant_pham'),
      prop('behavior', 'patrol'),
    ]),
  );
  add(
    makeObject(nextId++, 'Security Detail Ibarra', 'npc', 30, 22, [
      prop('dialogId', 'security_ibarra'),
      prop('npcId', 'security_ibarra'),
      prop('behavior', 'guard'),
    ]),
  );

  // Terminals
  add(
    makeObject(nextId++, 'Executive Terminal NW', 'terminal', 3, 3, [
      prop('challengeId', 'ch08_01'),
      prop('label', 'Executive Terminal NW'),
      prop('room', 'office_upper_left'),
    ]),
  );
  add(
    makeObject(nextId++, 'Executive Terminal NE', 'terminal', 28, 3, [
      prop('challengeId', 'ch08_02'),
      prop('label', 'Executive Terminal NE'),
      prop('room', 'office_upper_right'),
    ]),
  );
  add(
    makeObject(nextId++, 'Boardroom Console W', 'terminal', 10, 8, [
      prop('challengeId', 'ch08_03'),
      prop('label', 'Boardroom Console W'),
      prop('room', 'boardroom'),
    ]),
  );
  add(
    makeObject(nextId++, 'Boardroom Console E', 'terminal', 22, 8, [
      prop('challengeId', 'ch08_04'),
      prop('label', 'Boardroom Console E'),
      prop('room', 'boardroom'),
    ]),
  );
  add(
    makeObject(nextId++, 'Boardroom Podium', 'terminal', 16, 16, [
      prop('challengeId', 'ch08_05'),
      prop('label', 'Boardroom Podium'),
      prop('room', 'boardroom'),
    ]),
  );
  add(
    makeObject(nextId++, 'Lower Office Terminal 1', 'terminal', 5, 24, [
      prop('challengeId', 'ch08_06'),
      prop('label', 'Lower Office Terminal 1'),
      prop('room', 'lower_offices'),
    ]),
  );
  add(
    makeObject(nextId++, 'Lower Office Terminal 2', 'terminal', 15, 24, [
      prop('challengeId', 'ch08_07'),
      prop('label', 'Lower Office Terminal 2'),
      prop('room', 'lower_offices'),
    ]),
  );
  add(
    makeObject(nextId++, 'Lower Office Terminal 3', 'terminal', 25, 24, [
      prop('challengeId', 'ch08_08'),
      prop('label', 'Lower Office Terminal 3'),
      prop('room', 'lower_offices'),
    ]),
  );

  // Elevator up (to floor 7)
  add(
    makeObject(nextId++, 'Elevator to Floor 7', 'door', 37, 5, [
      prop('targetFloor', 'floor7'),
      prop('locked', 'true'),
      prop('requiresChallenge', 'ch08_08'),
    ]),
  );
  // Elevator down (to floor 5)
  add(
    makeObject(nextId, 'Elevator to Floor 5', 'door', 37, 25, [
      prop('targetFloor', 'floor5'),
      prop('locked', 'false'),
    ]),
  );

  return objects;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateFloor6Tilemap(): TiledMap {
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
        name: FLOOR_6_TILESET_NAME,
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
