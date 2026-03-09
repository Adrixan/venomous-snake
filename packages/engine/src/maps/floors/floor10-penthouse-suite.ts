/**
 * Floor 10 – Penthouse Suite
 *
 * Luxury executive floor with opulent office, private elevator, trophy room.
 * Grand foyer (cols 1-32, rows 14-29), private office (cols 1-20, rows 1-13),
 * trophy room (cols 21-32, rows 1-13), elevator shaft (cols 33-39).
 */

import { LOBBY_GID } from '../TilesetGenerator';
import type { TiledMap, TiledObject, TiledProperty } from '../TilemapGenerator';

export const FLOOR_10_MAP_KEY = 'floor10';
export const FLOOR_10_TILESET_NAME = 'lobby_tiles';

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
      // Grand foyer: elegant checkerboard
      if (y >= 14) {
        setTile(layer, x, y, (x + y) % 2 === 0 ? LOBBY_GID.FLOOR_LIGHT : LOBBY_GID.FLOOR_DARK);
        continue;
      }
      // Private office and trophy room: light
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

  // Divider between upper rooms and foyer (row 13, cols 1-32) — door at col 10
  for (let x = 1; x <= 32; x++) {
    if (x !== 10 && x !== 26) setTile(layer, x, 13, LOBBY_GID.WALL); // doors at 10 and 26
  }
  setTile(layer, 0, 13, LOBBY_GID.WALL_CORNER);
  setTile(layer, 33, 13, LOBBY_GID.WALL_CORNER);

  // Office / trophy divider (col 20, rows 1-13) — door at row 7
  for (let y = 1; y <= 13; y++) {
    if (y !== 7) setTile(layer, 20, y, LOBBY_GID.WALL);
  }
  setTile(layer, 20, 0, LOBBY_GID.WALL_CORNER);
  setTile(layer, 20, 13, LOBBY_GID.WALL_CORNER);

  // Neon accents — extremely frequent (every 2 tiles along walls)
  for (let x = 1; x <= 31; x += 2) {
    setTile(layer, x, 14, LOBBY_GID.NEON_STRIP);
  }
  for (let y = 15; y <= 28; y += 2) {
    setTile(layer, 1, y, LOBBY_GID.NEON_STRIP);
    setTile(layer, 32, y, LOBBY_GID.NEON_STRIP);
  }
  for (let x = 2; x <= 18; x += 2) {
    setTile(layer, x, 1, LOBBY_GID.NEON_STRIP);
  }
  for (let x = 22; x <= 31; x += 2) {
    setTile(layer, x, 1, LOBBY_GID.NEON_STRIP);
  }

  return layer;
}

function buildFurnitureLayer(): number[] {
  const layer = newGrid();

  // Private office: grand desk
  setTile(layer, 8, 5, LOBBY_GID.RECEPTION_DESK);
  setTile(layer, 9, 5, LOBBY_GID.RECEPTION_DESK);
  setTile(layer, 10, 5, LOBBY_GID.RECEPTION_DESK);
  setTile(layer, 11, 5, LOBBY_GID.RECEPTION_DESK);
  setTile(layer, 8, 6, LOBBY_GID.DESK);
  setTile(layer, 9, 6, LOBBY_GID.DESK);
  setTile(layer, 10, 6, LOBBY_GID.DESK);
  setTile(layer, 11, 6, LOBBY_GID.DESK);
  setTile(layer, 9, 7, LOBBY_GID.CHAIR);
  setTile(layer, 10, 7, LOBBY_GID.CHAIR);
  // Planters in office
  setTile(layer, 1, 1, LOBBY_GID.PLANTER);
  setTile(layer, 18, 1, LOBBY_GID.PLANTER);
  setTile(layer, 1, 11, LOBBY_GID.PLANTER);
  setTile(layer, 18, 11, LOBBY_GID.PLANTER);

  // Trophy room: display cases (DESK tiles)
  for (let y = 2; y <= 10; y += 4) {
    for (let x = 22; x <= 30; x += 4) {
      setTile(layer, x, y, LOBBY_GID.DESK);
      setTile(layer, x + 1, y, LOBBY_GID.DESK);
    }
  }
  setTile(layer, 22, 1, LOBBY_GID.PLANTER);
  setTile(layer, 31, 1, LOBBY_GID.PLANTER);

  // Grand foyer: luxury plants every 2 tiles
  for (let x = 3; x <= 29; x += 2) {
    setTile(layer, x, 15, LOBBY_GID.PLANTER);
  }
  // Seating clusters
  for (let y = 18; y <= 26; y += 4) {
    setTile(layer, 5, y, LOBBY_GID.CHAIR);
    setTile(layer, 6, y, LOBBY_GID.CHAIR);
    setTile(layer, 12, y, LOBBY_GID.CHAIR);
    setTile(layer, 13, y, LOBBY_GID.CHAIR);
    setTile(layer, 20, y, LOBBY_GID.CHAIR);
    setTile(layer, 21, y, LOBBY_GID.CHAIR);
    setTile(layer, 28, y, LOBBY_GID.CHAIR);
    setTile(layer, 29, y, LOBBY_GID.CHAIR);
  }

  // Grand reception desk in foyer
  for (let x = 10; x <= 18; x++) {
    setTile(layer, x, 20, LOBBY_GID.RECEPTION_DESK);
  }

  return layer;
}

function buildInteractiveLayer(): number[] {
  const layer = newGrid();

  // 9 terminals: ch12_01 through ch12_09
  setTile(layer, 4, 4, LOBBY_GID.TERMINAL); // ch12_01 private office
  setTile(layer, 15, 4, LOBBY_GID.TERMINAL); // ch12_02 private office
  setTile(layer, 4, 10, LOBBY_GID.TERMINAL); // ch12_03 private office
  setTile(layer, 24, 4, LOBBY_GID.TERMINAL); // ch12_04 trophy room
  setTile(layer, 30, 8, LOBBY_GID.TERMINAL); // ch12_05 trophy room
  setTile(layer, 8, 18, LOBBY_GID.TERMINAL); // ch12_06 foyer
  setTile(layer, 16, 24, LOBBY_GID.TERMINAL); // ch12_07 foyer
  setTile(layer, 24, 18, LOBBY_GID.TERMINAL); // ch12_08 foyer
  setTile(layer, 16, 28, LOBBY_GID.TERMINAL); // ch12_09 foyer

  // Door tiles
  setTile(layer, 10, 13, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 26, 13, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 20, 7, LOBBY_GID.DOOR_OPEN);
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
    makeObject(nextId++, 'CEO Shadow "The Snake"', 'npc', 10, 5, [
      prop('dialogId', 'ceo_shadow'),
      prop('npcId', 'ceo_shadow'),
      prop('behavior', 'idle'),
    ]),
  );
  add(
    makeObject(nextId++, 'Head of Security Romero', 'npc', 16, 22, [
      prop('dialogId', 'security_romero'),
      prop('npcId', 'security_romero'),
      prop('behavior', 'guard'),
    ]),
  );
  add(
    makeObject(nextId++, 'Personal Assistant Liang', 'npc', 14, 8, [
      prop('dialogId', 'pa_liang'),
      prop('npcId', 'pa_liang'),
      prop('behavior', 'idle'),
    ]),
  );

  // Terminals
  add(
    makeObject(nextId++, 'CEO Private Terminal 1', 'terminal', 4, 4, [
      prop('challengeId', 'ch12_01'),
      prop('label', 'CEO Private Terminal 1'),
      prop('room', 'private_office'),
    ]),
  );
  add(
    makeObject(nextId++, 'CEO Private Terminal 2', 'terminal', 15, 4, [
      prop('challengeId', 'ch12_02'),
      prop('label', 'CEO Private Terminal 2'),
      prop('room', 'private_office'),
    ]),
  );
  add(
    makeObject(nextId++, 'CEO Private Terminal 3', 'terminal', 4, 10, [
      prop('challengeId', 'ch12_03'),
      prop('label', 'CEO Private Terminal 3'),
      prop('room', 'private_office'),
    ]),
  );
  add(
    makeObject(nextId++, 'Trophy Display Terminal', 'terminal', 24, 4, [
      prop('challengeId', 'ch12_04'),
      prop('label', 'Trophy Display Terminal'),
      prop('room', 'trophy_room'),
    ]),
  );
  add(
    makeObject(nextId++, 'Trophy Archive Console', 'terminal', 30, 8, [
      prop('challengeId', 'ch12_05'),
      prop('label', 'Trophy Archive Console'),
      prop('room', 'trophy_room'),
    ]),
  );
  add(
    makeObject(nextId++, 'Foyer Kiosk West', 'terminal', 8, 18, [
      prop('challengeId', 'ch12_06'),
      prop('label', 'Foyer Kiosk West'),
      prop('room', 'grand_foyer'),
    ]),
  );
  add(
    makeObject(nextId++, 'Foyer Central Console', 'terminal', 16, 24, [
      prop('challengeId', 'ch12_07'),
      prop('label', 'Foyer Central Console'),
      prop('room', 'grand_foyer'),
    ]),
  );
  add(
    makeObject(nextId++, 'Foyer Kiosk East', 'terminal', 24, 18, [
      prop('challengeId', 'ch12_08'),
      prop('label', 'Foyer Kiosk East'),
      prop('room', 'grand_foyer'),
    ]),
  );
  add(
    makeObject(nextId++, 'Penthouse Access Terminal', 'terminal', 16, 28, [
      prop('challengeId', 'ch12_09'),
      prop('label', 'Penthouse Access Terminal'),
      prop('room', 'grand_foyer'),
    ]),
  );

  // Elevator up (to floor 11)
  add(
    makeObject(nextId++, 'Elevator to Floor 11', 'door', 37, 5, [
      prop('targetFloor', 'floor11'),
      prop('locked', 'true'),
      prop('requiresChallenge', 'ch12_09'),
    ]),
  );
  // Elevator down (to floor 9)
  add(
    makeObject(nextId++, 'Elevator to Floor 9', 'door', 37, 25, [
      prop('targetFloor', 'floor9'),
      prop('locked', 'false'),
    ]),
  );

  // ─── Items ──────────────────────────────────────────────────────────────────
  // Tool in the lower private office, away from NPCs
  add(
    makeObject(nextId++, 'Unit Test Framework', 'item', 6, 12, [
      prop('itemType', 'tool'),
      prop('itemId', 'unit_test_framework'),
    ]),
  );
  // Keycard displayed in the trophy room
  add(
    makeObject(nextId++, 'Penthouse Invite', 'item', 28, 7, [
      prop('itemType', 'keycard'),
      prop('itemId', 'penthouse_invite'),
    ]),
  );
  // Datafile on the grand foyer floor
  add(
    makeObject(nextId, 'Stakeholder Report', 'item', 22, 20, [
      prop('itemType', 'datafile'),
      prop('itemId', 'stakeholder_report'),
    ]),
  );

  return objects;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateFloor10Tilemap(): TiledMap {
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
        name: FLOOR_10_TILESET_NAME,
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
