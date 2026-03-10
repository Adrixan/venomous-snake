/**
 * Floor 8 – Research Vault
 *
 * Classified research with vault doors, biometric locks, and isolated labs.
 * Outer security corridor ring (rows 1-2, 28-29, cols 1-2, col 32),
 * inner vault (cols 3-31, rows 3-27) with 4 isolated lab cells along top
 * (rows 3-12), open lab below (rows 13-27), elevator shaft (cols 33-39).
 */

import { LOBBY_GID } from '../TilesetGenerator';
import type { TiledMap, TiledObject, TiledProperty } from '../TilemapGenerator';

export const FLOOR_8_MAP_KEY = 'floor8';
export const FLOOR_8_TILESET_NAME = 'lobby_tiles';

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
      // Security corridor ring
      if (y <= 2 || y >= 28 || x <= 2 || x >= 32) {
        setTile(layer, x, y, (x + y) % 2 === 0 ? LOBBY_GID.FLOOR_DARK : LOBBY_GID.FLOOR_LIGHT);
        continue;
      }
      // Inner vault: dark
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

  // Inner vault walls — row 2 bottom of top corridor, row 27 top of bottom corridor
  for (let x = 3; x <= 31; x++) {
    if (x !== 16) setTile(layer, x, 2, LOBBY_GID.WALL); // door at col 16
    if (x !== 16) setTile(layer, x, 27, LOBBY_GID.WALL);
  }
  // Left inner wall (col 2) and right inner wall (col 32)
  for (let y = 2; y <= 27; y++) {
    if (y !== 14) setTile(layer, 2, y, LOBBY_GID.WALL); // door at row 14
    if (y !== 14) setTile(layer, 32, y, LOBBY_GID.WALL);
  }

  // Biometric frame corners at vault entrances
  setTile(layer, 2, 2, LOBBY_GID.WALL_CORNER);
  setTile(layer, 32, 2, LOBBY_GID.WALL_CORNER);
  setTile(layer, 2, 27, LOBBY_GID.WALL_CORNER);
  setTile(layer, 32, 27, LOBBY_GID.WALL_CORNER);

  // 4 isolated lab cells along top (rows 3-12)
  // Cell 1: cols 3-10, Cell 2: cols 11-18, Cell 3: cols 19-26, Cell 4: cols 27-31
  const cellBounds: [number, number][] = [
    [3, 10],
    [11, 18],
    [19, 26],
    [27, 31],
  ];
  for (const [i, cell] of cellBounds.entries()) {
    const [cStart, cEnd] = cell;
    // Bottom wall of cell at row 12 (with door)
    const doorCol = cStart + Math.floor((cEnd - cStart) / 2);
    for (let x = cStart; x <= cEnd; x++) {
      if (x !== doorCol) setTile(layer, x, 12, LOBBY_GID.WALL);
    }
    // Right wall divider (except last cell uses col 32 = vault wall)
    if (i < cellBounds.length - 1) {
      for (let y = 3; y <= 12; y++) {
        setTile(layer, cEnd + 1, y, LOBBY_GID.WALL);
      }
      // Biometric frame at cell intersection
      setTile(layer, cEnd + 1, 2, LOBBY_GID.WALL_CORNER);
      setTile(layer, cEnd + 1, 12, LOBBY_GID.WALL_CORNER);
    }
  }

  // Sealed door tiles (DOOR_CLOSED) for lab cells placed in interactive layer

  // Neon strips every 3 tiles in corridors
  for (let x = 1; x <= 31; x += 3) {
    setTile(layer, x, 1, LOBBY_GID.NEON_STRIP);
    setTile(layer, x, 28, LOBBY_GID.NEON_STRIP);
  }
  for (let y = 3; y <= 26; y += 3) {
    setTile(layer, 1, y, LOBBY_GID.NEON_STRIP);
  }

  return layer;
}

function buildFurnitureLayer(): number[] {
  const layer = newGrid();

  // Lab cell equipment
  const cellBounds: [number, number][] = [
    [3, 10],
    [11, 18],
    [19, 26],
    [27, 31],
  ];
  for (const [cStart, cEnd] of cellBounds) {
    // Lab benches and vents
    setTile(layer, cStart + 1, 5, LOBBY_GID.DESK);
    setTile(layer, cStart + 2, 5, LOBBY_GID.DESK);
    setTile(layer, cStart + 1, 6, LOBBY_GID.CHAIR);
    setTile(layer, cEnd - 1, 8, LOBBY_GID.VENT);
    setTile(layer, cEnd - 1, 10, LOBBY_GID.VENT);
    if (cEnd - cStart > 3) {
      setTile(layer, cStart + 1, 9, LOBBY_GID.CABLE);
      setTile(layer, cStart + 2, 9, LOBBY_GID.CABLE);
    }
  }

  // Open lab below: research benches
  for (let y = 15; y <= 25; y += 5) {
    for (let x = 5; x <= 28; x += 6) {
      setTile(layer, x, y, LOBBY_GID.DESK);
      setTile(layer, x + 1, y, LOBBY_GID.DESK);
      setTile(layer, x, y + 1, LOBBY_GID.CHAIR);
    }
  }

  // Security corridor: vents
  setTile(layer, 1, 2, LOBBY_GID.VENT);
  setTile(layer, 31, 2, LOBBY_GID.VENT);
  setTile(layer, 1, 27, LOBBY_GID.VENT);
  setTile(layer, 31, 27, LOBBY_GID.VENT);

  return layer;
}

function buildInteractiveLayer(): number[] {
  const layer = newGrid();

  // Sealed lab doors (DOOR_CLOSED)
  setTile(layer, 6, 12, LOBBY_GID.DOOR_CLOSED);
  setTile(layer, 14, 12, LOBBY_GID.DOOR_CLOSED);
  setTile(layer, 22, 12, LOBBY_GID.DOOR_CLOSED);
  setTile(layer, 29, 12, LOBBY_GID.DOOR_CLOSED);

  // 10 terminals: ch10_01 through ch10_10
  setTile(layer, 5, 5, LOBBY_GID.TERMINAL); // ch10_01 cell 1
  setTile(layer, 13, 5, LOBBY_GID.TERMINAL); // ch10_02 cell 2
  setTile(layer, 21, 5, LOBBY_GID.TERMINAL); // ch10_03 cell 3
  setTile(layer, 29, 5, LOBBY_GID.TERMINAL); // ch10_04 cell 4
  setTile(layer, 8, 16, LOBBY_GID.TERMINAL); // ch10_05 open lab
  setTile(layer, 16, 16, LOBBY_GID.TERMINAL); // ch10_06 open lab
  setTile(layer, 24, 16, LOBBY_GID.TERMINAL); // ch10_07 open lab
  setTile(layer, 8, 22, LOBBY_GID.TERMINAL); // ch10_08 open lab
  setTile(layer, 16, 22, LOBBY_GID.TERMINAL); // ch10_09 open lab
  setTile(layer, 24, 22, LOBBY_GID.TERMINAL); // ch10_10 open lab

  // Vault entrance doors
  setTile(layer, 16, 2, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 2, 14, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 32, 14, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 16, 27, LOBBY_GID.DOOR_OPEN);

  // Elevator doors
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
    makeObject(nextId++, 'Vault Commander Nkosi', 'npc', 16, 1, [
      prop('dialogId', 'dialog_voss'),
      prop('npcId', 'vault_cmdr_nkosi'),
      prop('behavior', 'guard'),
    ]),
  );
  add(
    makeObject(nextId++, 'Lead Researcher Dr. Yamoto', 'npc', 14, 18, [
      prop('dialogId', 'dialog_patel'),
      prop('npcId', 'dr_yamoto'),
      prop('behavior', 'idle'),
    ]),
  );
  add(
    makeObject(nextId++, 'Containment Specialist', 'npc', 6, 8, [
      prop('dialogId', 'dialog_echo'),
      prop('npcId', 'containment_spec'),
      prop('behavior', 'patrol'),
    ]),
  );

  // Terminals
  add(
    makeObject(nextId++, 'Lab Cell Alpha', 'terminal', 5, 5, [
      prop('challengeId', 'ch10_01_simple_class'),
      prop('label', 'Lab Cell Alpha'),
      prop('room', 'cell_1'),
    ]),
  );
  add(
    makeObject(nextId++, 'Lab Cell Beta', 'terminal', 13, 5, [
      prop('challengeId', 'ch10_02_methods'),
      prop('label', 'Lab Cell Beta'),
      prop('room', 'cell_2'),
    ]),
  );
  add(
    makeObject(nextId++, 'Lab Cell Gamma', 'terminal', 21, 5, [
      prop('challengeId', 'ch10_03_init_constructor'),
      prop('label', 'Lab Cell Gamma'),
      prop('room', 'cell_3'),
    ]),
  );
  add(
    makeObject(nextId++, 'Lab Cell Delta', 'terminal', 29, 5, [
      prop('challengeId', 'ch10_04_str_repr'),
      prop('label', 'Lab Cell Delta'),
      prop('room', 'cell_4'),
    ]),
  );
  add(
    makeObject(nextId++, 'Open Lab Console 1', 'terminal', 8, 16, [
      prop('challengeId', 'ch10_05_inheritance'),
      prop('label', 'Open Lab Console 1'),
      prop('room', 'open_lab'),
    ]),
  );
  add(
    makeObject(nextId++, 'Open Lab Console 2', 'terminal', 16, 16, [
      prop('challengeId', 'ch10_06_method_override'),
      prop('label', 'Open Lab Console 2'),
      prop('room', 'open_lab'),
    ]),
  );
  add(
    makeObject(nextId++, 'Open Lab Console 3', 'terminal', 24, 16, [
      prop('challengeId', 'ch10_07_encapsulation'),
      prop('label', 'Open Lab Console 3'),
      prop('room', 'open_lab'),
    ]),
  );
  add(
    makeObject(nextId++, 'Vault Terminal Alpha', 'terminal', 8, 22, [
      prop('challengeId', 'ch10_08_class_static_methods'),
      prop('label', 'Vault Terminal Alpha'),
      prop('room', 'open_lab'),
    ]),
  );
  add(
    makeObject(nextId++, 'Vault Terminal Beta', 'terminal', 16, 22, [
      prop('challengeId', 'ch10_09_composition'),
      prop('label', 'Vault Terminal Beta'),
      prop('room', 'open_lab'),
    ]),
  );
  add(
    makeObject(nextId++, 'Vault Terminal Gamma', 'terminal', 24, 22, [
      prop('challengeId', 'ch10_10_polymorphism'),
      prop('label', 'Vault Terminal Gamma'),
      prop('room', 'open_lab'),
    ]),
  );

  // Elevator up (to floor 9)
  add(
    makeObject(nextId++, 'Elevator to Floor 9', 'door', 37, 5, [
      prop('targetFloor', 'floor9'),
      prop('locked', 'true'),
      prop('requiresChallenge', 'ch10_10_polymorphism'),
    ]),
  );
  // Elevator down (to floor 7)
  add(
    makeObject(nextId++, 'Elevator to Floor 7', 'door', 37, 25, [
      prop('targetFloor', 'floor7'),
      prop('locked', 'false'),
    ]),
  );

  // ─── Items ──────────────────────────────────────────────────────────────────
  // Tool in lab cell area (aisle beside cell Alpha)
  add(
    makeObject(nextId++, 'Class Designer Tool', 'item', 10, 8, [
      prop('itemType', 'tool'),
      prop('itemId', 'class_designer_tool'),
    ]),
  );
  // Datafile on open lab bench
  add(
    makeObject(nextId++, 'Vault Research Data', 'item', 20, 20, [
      prop('itemType', 'datafile'),
      prop('itemId', 'vault_research_data'),
    ]),
  );
  // Keycard near the right corridor wall
  add(
    makeObject(nextId++, 'Vault Key', 'item', 30, 14, [
      prop('itemType', 'keycard'),
      prop('itemId', 'vault_key'),
    ]),
  );
  // Datafile in lower inner vault
  add(
    makeObject(nextId, 'Inheritance Manual', 'item', 28, 25, [
      prop('itemType', 'datafile'),
      prop('itemId', 'inheritance_manual'),
    ]),
  );

  return objects;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateFloor8Tilemap(): TiledMap {
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
        name: FLOOR_8_TILESET_NAME,
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
