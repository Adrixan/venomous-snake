/**
 * Floor 1 – Server Room
 *
 * IT infrastructure floor: dense server racks, cooling vents, cable runs.
 * Central corridor (cols 18-21), server bays left (cols 1-17 divided at rows 10/20),
 * monitoring area right (cols 22-32), elevator shaft (cols 33-39).
 */

import { LOBBY_GID } from '../TilesetGenerator';
import type { TiledMap, TiledObject, TiledProperty } from '../TilemapGenerator';

export const FLOOR_1_MAP_KEY = 'floor1';
export const FLOOR_1_TILESET_NAME = 'lobby_tiles';

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
      // Elevator interior: uniform dark
      if (x >= 34 && x <= 38) {
        setTile(layer, x, y, LOBBY_GID.FLOOR_DARK);
        continue;
      }
      // Central corridor: checkerboard
      if (x >= 18 && x <= 21) {
        setTile(layer, x, y, (x + y) % 2 === 0 ? LOBBY_GID.FLOOR_DARK : LOBBY_GID.FLOOR_LIGHT);
        continue;
      }
      // Server bays: dark with cable accents
      if (x >= 1 && x <= 17) {
        setTile(layer, x, y, LOBBY_GID.FLOOR_DARK);
        continue;
      }
      // Monitoring area
      setTile(layer, x, y, (x + y) % 2 === 0 ? LOBBY_GID.FLOOR_LIGHT : LOBBY_GID.FLOOR_DARK);
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

  // Corridor west wall (col 17) with doors at rows 5, 15, 25
  for (let y = 1; y < MAP_H - 1; y++) {
    if (y !== 5 && y !== 15 && y !== 25) setTile(layer, 17, y, LOBBY_GID.WALL);
  }
  // Corridor east wall (col 22) with doors at rows 5, 15
  for (let y = 1; y < MAP_H - 1; y++) {
    if (y !== 5 && y !== 15) setTile(layer, 22, y, LOBBY_GID.WALL);
  }

  // Elevator west wall (col 33) with doors at rows 5 and 25
  for (let y = 1; y < MAP_H - 1; y++) {
    if (y !== 5 && y !== 25) setTile(layer, 33, y, LOBBY_GID.WALL);
  }
  setTile(layer, 33, 0, LOBBY_GID.WALL_CORNER);
  setTile(layer, 33, MAP_H - 1, LOBBY_GID.WALL_CORNER);

  // Server bay dividers at rows 10 and 20 (cols 1-16)
  for (let x = 1; x <= 16; x++) {
    if (x !== 8) setTile(layer, x, 10, LOBBY_GID.WALL); // door at col 8
    if (x !== 8) setTile(layer, x, 20, LOBBY_GID.WALL);
  }
  setTile(layer, 0, 10, LOBBY_GID.WALL_CORNER);
  setTile(layer, 17, 10, LOBBY_GID.WALL_CORNER);
  setTile(layer, 0, 20, LOBBY_GID.WALL_CORNER);
  setTile(layer, 17, 20, LOBBY_GID.WALL_CORNER);

  // Neon accents along corridor walls
  for (let y = 2; y < MAP_H - 2; y += 6) {
    setTile(layer, 18, y, LOBBY_GID.NEON_STRIP);
  }

  return layer;
}

function buildFurnitureLayer(): number[] {
  const layer = newGrid();

  // Server bays: dense SERVER_RACK grids (replaces bare VENT tiles)
  const bayRows: [number, number][] = [
    [2, 9],
    [11, 19],
    [21, 28],
  ];
  for (const [startRow, endRow] of bayRows) {
    for (let y = startRow; y <= endRow; y += 2) {
      for (let x = 2; x <= 15; x += 3) {
        setTile(layer, x, y, LOBBY_GID.SERVER_RACK);
        setTile(layer, x + 1, y, LOBBY_GID.SERVER_RACK);
      }
    }
    // Cable management runs between rack rows
    for (let x = 1; x <= 16; x += 2) {
      setTile(layer, x, startRow + 1, LOBBY_GID.CABLE);
      setTile(layer, x, endRow - 1, LOBBY_GID.CABLE);
    }
    // Pipe conduit at top of each bay
    for (let x = 1; x <= 16; x++) {
      setTile(layer, x, startRow, LOBBY_GID.PIPE_H);
    }
  }

  // Monitoring area: desk clusters with wall screens (cols 23-32)
  for (let y = 3; y <= 27; y += 5) {
    setTile(layer, 24, y, LOBBY_GID.DESK);
    setTile(layer, 25, y, LOBBY_GID.DESK);
    setTile(layer, 26, y, LOBBY_GID.CHAIR);
    setTile(layer, 29, y, LOBBY_GID.DESK);
    setTile(layer, 30, y, LOBBY_GID.DESK);
    setTile(layer, 31, y, LOBBY_GID.CHAIR);
    // Wall-screen panel on elevator wall face
    setTile(layer, 32, y, LOBBY_GID.WALL_SCREEN);
    setTile(layer, 32, y + 1, LOBBY_GID.WALL_SCREEN);
  }
  // Filing cabinets between desk rows in monitoring area
  setTile(layer, 23, 6, LOBBY_GID.FILING_CABINET);
  setTile(layer, 23, 11, LOBBY_GID.FILING_CABINET);
  setTile(layer, 23, 16, LOBBY_GID.FILING_CABINET);
  setTile(layer, 23, 21, LOBBY_GID.FILING_CABINET);
  // Extra planter accents
  setTile(layer, 23, 2, LOBBY_GID.PLANTER);
  setTile(layer, 23, 27, LOBBY_GID.PLANTER);

  // Cooling vents in elevator shaft
  setTile(layer, 35, 2, LOBBY_GID.VENT);
  setTile(layer, 37, 2, LOBBY_GID.VENT);
  setTile(layer, 35, 14, LOBBY_GID.VENT);
  setTile(layer, 37, 14, LOBBY_GID.VENT);
  setTile(layer, 35, 28, LOBBY_GID.VENT);
  setTile(layer, 37, 28, LOBBY_GID.VENT);

  return layer;
}

function buildDecorationLayer(): number[] {
  const layer = newGrid();

  // ── Server bays: floor grates under rack rows + oil stains ───────────────
  const bayRows: [number, number][] = [
    [2, 9],
    [11, 19],
    [21, 28],
  ];
  for (const [startRow, endRow] of bayRows) {
    // Floor grates at mid-aisle of each bay
    for (let x = 3; x <= 14; x += 3) {
      setTile(layer, x, startRow + 2, LOBBY_GID.FLOOR_GRATE);
      setTile(layer, x, endRow - 2, LOBBY_GID.FLOOR_GRATE);
    }
    // Oil/coolant stains scattered around racks
    setTile(layer, 4, startRow + 3, LOBBY_GID.OIL_STAIN);
    setTile(layer, 11, startRow + 5, LOBBY_GID.OIL_STAIN);
    // Ceiling lights at bay entrances
    setTile(layer, 19, startRow + 1, LOBBY_GID.CEILING_LIGHT);
    setTile(layer, 19, endRow - 1, LOBBY_GID.CEILING_LIGHT);
  }

  // ── Monitoring area: ceiling lights + caution stripes at doors ───────────
  for (let y = 5; y <= 25; y += 5) {
    setTile(layer, 28, y, LOBBY_GID.CEILING_LIGHT);
  }
  setTile(layer, 24, 4, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 24, 9, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 24, 14, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 24, 19, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 24, 24, LOBBY_GID.FLOOR_GRATE);

  // ── Caution stripes at all corridor doors ─────────────────────────────────
  setTile(layer, 16, 5, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 16, 15, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 16, 25, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 18, 5, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 18, 15, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 7, 10, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 9, 10, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 7, 20, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 9, 20, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 32, 5, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 32, 25, LOBBY_GID.CAUTION_STRIPE);

  // ── Neon strips along corridor walls ──────────────────────────────────────
  for (let y = 2; y <= 28; y += 4) {
    setTile(layer, 18, y, LOBBY_GID.NEON_STRIP);
    setTile(layer, 21, y, LOBBY_GID.NEON_STRIP);
  }

  // ── Elevator: floor grates ────────────────────────────────────────────────
  setTile(layer, 36, 3, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 36, 14, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 36, 27, LOBBY_GID.CEILING_LIGHT);

  return layer;
}

function buildInteractiveLayer(): number[] {
  const layer = newGrid();

  // Terminals in server bays
  setTile(layer, 3, 4, LOBBY_GID.TERMINAL); // ch03_01
  setTile(layer, 10, 4, LOBBY_GID.TERMINAL); // ch03_02
  setTile(layer, 3, 14, LOBBY_GID.TERMINAL); // ch03_03
  setTile(layer, 10, 14, LOBBY_GID.TERMINAL); // ch03_04
  setTile(layer, 3, 24, LOBBY_GID.TERMINAL); // ch03_05
  setTile(layer, 10, 24, LOBBY_GID.TERMINAL); // ch03_06

  // Terminals in monitoring area
  setTile(layer, 27, 8, LOBBY_GID.TERMINAL); // ch03_07
  setTile(layer, 27, 18, LOBBY_GID.TERMINAL); // ch03_08

  // Door tiles
  setTile(layer, 17, 5, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 17, 15, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 17, 25, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 22, 5, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 22, 15, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 8, 10, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 8, 20, LOBBY_GID.DOOR_OPEN);
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

  // Player start
  add(makeObject(nextId++, 'player_start', 'player_start', 35, 25));

  // NPCs
  add(
    makeObject(nextId++, 'Tech Sergeant Morano', 'npc', 19, 15, [
      prop('dialogId', 'dialog_kai'),
      prop('npcId', 'tech_sgt_morano'),
      prop('behavior', 'patrol'),
    ]),
  );
  add(
    makeObject(nextId++, 'Sys Admin Chen', 'npc', 25, 8, [
      prop('dialogId', 'dialog_reeves'),
      prop('npcId', 'sysadmin_chen'),
      prop('behavior', 'idle'),
    ]),
  );
  add(
    makeObject(nextId++, 'Cooling Tech', 'npc', 8, 6, [
      prop('dialogId', 'dialog_labbot'),
      prop('npcId', 'cooling_tech'),
      prop('behavior', 'wander'),
    ]),
  );

  // Terminals
  add(
    makeObject(nextId++, 'Server Console 1', 'terminal', 3, 4, [
      prop('challengeId', 'ch03_01_simple_if'),
      prop('label', 'Server Console 1'),
      prop('room', 'server_bay_1'),
    ]),
  );
  add(
    makeObject(nextId++, 'Server Console 2', 'terminal', 10, 4, [
      prop('challengeId', 'ch03_02_if_else'),
      prop('label', 'Server Console 2'),
      prop('room', 'server_bay_1'),
    ]),
  );
  add(
    makeObject(nextId++, 'Server Console 3', 'terminal', 3, 14, [
      prop('challengeId', 'ch03_03_comparison_operators'),
      prop('label', 'Server Console 3'),
      prop('room', 'server_bay_2'),
    ]),
  );
  add(
    makeObject(nextId++, 'Server Console 4', 'terminal', 10, 14, [
      prop('challengeId', 'ch03_04_if_elif_else'),
      prop('label', 'Server Console 4'),
      prop('room', 'server_bay_2'),
    ]),
  );
  add(
    makeObject(nextId++, 'Server Console 5', 'terminal', 3, 24, [
      prop('challengeId', 'ch03_05_logical_operators'),
      prop('label', 'Server Console 5'),
      prop('room', 'server_bay_3'),
    ]),
  );
  add(
    makeObject(nextId++, 'Server Console 6', 'terminal', 10, 24, [
      prop('challengeId', 'ch03_06_nested_if'),
      prop('label', 'Server Console 6'),
      prop('room', 'server_bay_3'),
    ]),
  );
  add(
    makeObject(nextId++, 'Monitoring Terminal 1', 'terminal', 27, 8, [
      prop('challengeId', 'ch03_07_boolean_variables'),
      prop('label', 'Monitoring Terminal 1'),
      prop('room', 'monitoring'),
    ]),
  );
  add(
    makeObject(nextId++, 'Monitoring Terminal 2', 'terminal', 27, 18, [
      prop('challengeId', 'ch03_08_complex_conditions'),
      prop('label', 'Monitoring Terminal 2'),
      prop('room', 'monitoring'),
    ]),
  );

  // Elevator up (to floor 2)
  add(
    makeObject(nextId++, 'Elevator to Floor 2', 'door', 37, 5, [
      prop('targetFloor', 'floor2'),
      prop('locked', 'true'),
      prop('requiresChallenge', 'ch03_08_complex_conditions'),
    ]),
  );
  // Elevator down (to floor 0)
  add(
    makeObject(nextId++, 'Elevator to Lobby', 'door', 37, 25, [
      prop('targetFloor', 'floor0'),
      prop('locked', 'false'),
    ]),
  );

  // ─── Items ──────────────────────────────────────────────────────────────────
  // Datafile on monitoring desk — Python intro manual left by a sysadmin
  add(
    makeObject(nextId++, 'Python Basics Manual', 'item', 25, 3, [
      prop('itemType', 'datafile'),
      prop('itemId', 'python_basics'),
    ]),
  );
  // Tool inside server bay 1, tucked against the server rack at col 3
  add(
    makeObject(nextId++, 'Debugger Module', 'item', 3, 3, [
      prop('itemType', 'tool'),
      prop('itemId', 'debugger_module'),
    ]),
  );
  // Datafile near monitoring terminal — internal network topology notes
  add(
    makeObject(nextId++, 'Network Topology File', 'item', 10, 13, [
      prop('itemType', 'datafile'),
      prop('itemId', 'network_topology'),
    ]),
  );
  // Keycard in the monitoring supervisor's area (desk row 8)
  add(
    makeObject(nextId++, 'Server Room Keycard', 'item', 29, 8, [
      prop('itemType', 'keycard'),
      prop('itemId', 'server_room_keycard'),
    ]),
  );
  // Tool on monitoring desk — auto-complete utility found after access challenge
  add(
    makeObject(nextId, 'Auto-Complete Chip', 'item', 24, 18, [
      prop('itemType', 'tool'),
      prop('itemId', 'autocomplete_chip'),
    ]),
  );

  return objects;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateFloor1Tilemap(): TiledMap {
  const floorData = buildFloorLayer();
  const decorationData = buildDecorationLayer();
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
      tileLayer('decoration', decorationData),
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
        name: FLOOR_1_TILESET_NAME,
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
