/**
 * Floor 3 – Surveillance Hub
 *
 * Security center with monitor walls, control consoles, camera rooms.
 * Main control room (cols 5-27, rows 5-24), camera bay upper (cols 1-32, rows 1-4),
 * interrogation rooms lower-left (cols 1-12, rows 25-29), command office upper-right
 * (cols 28-32, rows 1-14), elevator shaft (cols 33-39).
 */

import { LOBBY_GID } from '../TilesetGenerator';
import type { TiledMap, TiledObject, TiledProperty } from '../TilemapGenerator';

export const FLOOR_3_MAP_KEY = 'floor3';
export const FLOOR_3_TILESET_NAME = 'lobby_tiles';

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
      // Camera bay: dark
      if (y >= 1 && y <= 4 && x <= 32) {
        setTile(layer, x, y, LOBBY_GID.FLOOR_DARK);
        continue;
      }
      // Main control room: checkerboard
      if (x >= 5 && x <= 27 && y >= 5 && y <= 24) {
        setTile(layer, x, y, (x + y) % 2 === 0 ? LOBBY_GID.FLOOR_DARK : LOBBY_GID.FLOOR_LIGHT);
        continue;
      }
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

  // Camera bay bottom wall (row 4, cols 1-32) — door at col 16
  for (let x = 1; x <= 32; x++) {
    if (x !== 16) setTile(layer, x, 4, LOBBY_GID.WALL);
  }

  // Command office walls (col 27, rows 1-14 and row 14, cols 28-32) — door at row 8
  for (let y = 1; y <= 14; y++) {
    if (y !== 8) setTile(layer, 27, y, LOBBY_GID.WALL);
  }
  for (let x = 28; x <= 32; x++) {
    if (x !== 30) setTile(layer, x, 14, LOBBY_GID.WALL);
  }
  setTile(layer, 27, 0, LOBBY_GID.WALL_CORNER);
  setTile(layer, 27, 14, LOBBY_GID.WALL_CORNER);
  setTile(layer, 32, 14, LOBBY_GID.WALL_CORNER);

  // Interrogation rooms walls (row 24 from cols 1-12, col 12 rows 25-29) — door at col 6 (row 24), row 27 (col 12)
  for (let x = 1; x <= 12; x++) {
    if (x !== 6) setTile(layer, x, 24, LOBBY_GID.WALL);
  }
  for (let y = 25; y < MAP_H - 1; y++) {
    if (y !== 27) setTile(layer, 12, y, LOBBY_GID.WALL);
  }
  setTile(layer, 0, 24, LOBBY_GID.WALL_CORNER);
  setTile(layer, 12, 24, LOBBY_GID.WALL_CORNER);
  setTile(layer, 12, MAP_H - 1, LOBBY_GID.WALL_CORNER);

  // Neon accent strips along walls every 4 tiles
  for (let x = 2; x <= 30; x += 4) {
    setTile(layer, x, 5, LOBBY_GID.NEON_STRIP);
  }
  for (let y = 6; y <= 23; y += 4) {
    setTile(layer, 4, y, LOBBY_GID.NEON_STRIP);
  }

  return layer;
}

function buildFurnitureLayer(): number[] {
  const layer = newGrid();

  // Main control room: dense monitoring station clusters
  for (let y = 7; y <= 21; y += 7) {
    for (let x = 7; x <= 23; x += 8) {
      setTile(layer, x, y, LOBBY_GID.DESK);
      setTile(layer, x + 1, y, LOBBY_GID.DESK);
      setTile(layer, x + 2, y, LOBBY_GID.DESK);
      setTile(layer, x, y + 1, LOBBY_GID.CHAIR);
      setTile(layer, x + 1, y + 1, LOBBY_GID.CHAIR);
      setTile(layer, x + 2, y + 1, LOBBY_GID.CHAIR);
    }
  }
  // Wall-screen bank along south wall of control room (row 23 face)
  for (let x = 6; x <= 26; x += 2) {
    setTile(layer, x, 23, LOBBY_GID.WALL_SCREEN);
  }
  // Filing cabinets in control room corners
  setTile(layer, 5, 6, LOBBY_GID.FILING_CABINET);
  setTile(layer, 5, 7, LOBBY_GID.FILING_CABINET);
  setTile(layer, 5, 14, LOBBY_GID.FILING_CABINET);
  setTile(layer, 5, 21, LOBBY_GID.FILING_CABINET);
  setTile(layer, 26, 8, LOBBY_GID.FILING_CABINET);
  setTile(layer, 26, 15, LOBBY_GID.FILING_CABINET);
  setTile(layer, 26, 22, LOBBY_GID.FILING_CABINET);
  // Planters in control room
  setTile(layer, 6, 24, LOBBY_GID.PLANTER);
  setTile(layer, 25, 24, LOBBY_GID.PLANTER);
  // Pipe conduit along south wall of control room
  for (let x = 5; x <= 26; x++) {
    setTile(layer, x, 24, LOBBY_GID.PIPE_H);
  }

  // Command office: desk + extra furniture
  setTile(layer, 29, 3, LOBBY_GID.DESK);
  setTile(layer, 30, 3, LOBBY_GID.DESK);
  setTile(layer, 31, 3, LOBBY_GID.DESK);
  setTile(layer, 29, 4, LOBBY_GID.CHAIR);
  setTile(layer, 31, 4, LOBBY_GID.CHAIR);
  setTile(layer, 29, 9, LOBBY_GID.DESK);
  setTile(layer, 30, 9, LOBBY_GID.DESK);
  setTile(layer, 30, 10, LOBBY_GID.CHAIR);
  setTile(layer, 31, 8, LOBBY_GID.FILING_CABINET);
  setTile(layer, 31, 9, LOBBY_GID.FILING_CABINET);
  setTile(layer, 31, 10, LOBBY_GID.FILING_CABINET);
  // Wall screen in command office
  setTile(layer, 28, 2, LOBBY_GID.WALL_SCREEN);
  setTile(layer, 30, 2, LOBBY_GID.WALL_SCREEN);
  setTile(layer, 32, 2, LOBBY_GID.WALL_SCREEN);

  // Camera bay: equipment row (monitoring consoles facing south)
  for (let x = 2; x <= 30; x += 4) {
    setTile(layer, x, 2, LOBBY_GID.DESK);
    setTile(layer, x + 1, 2, LOBBY_GID.DESK);
    setTile(layer, x, 3, LOBBY_GID.CHAIR);
  }
  // Server rack in camera bay corners
  setTile(layer, 1, 2, LOBBY_GID.SERVER_RACK);
  setTile(layer, 31, 2, LOBBY_GID.SERVER_RACK);
  setTile(layer, 32, 2, LOBBY_GID.SERVER_RACK);
  // Cable runs in camera bay
  for (let x = 1; x <= 32; x += 3) {
    setTile(layer, x, 1, LOBBY_GID.CABLE);
  }

  // Interrogation room: table + chairs
  setTile(layer, 4, 26, LOBBY_GID.DESK);
  setTile(layer, 5, 26, LOBBY_GID.DESK);
  setTile(layer, 4, 27, LOBBY_GID.CHAIR);
  setTile(layer, 6, 27, LOBBY_GID.CHAIR);
  setTile(layer, 4, 28, LOBBY_GID.CHAIR);
  setTile(layer, 6, 28, LOBBY_GID.CHAIR);
  setTile(layer, 8, 26, LOBBY_GID.FILING_CABINET);
  setTile(layer, 8, 27, LOBBY_GID.FILING_CABINET);
  setTile(layer, 10, 26, LOBBY_GID.WALL_SCREEN);
  setTile(layer, 10, 28, LOBBY_GID.WALL_SCREEN);

  return layer;
}

function buildDecorationLayer(): number[] {
  const layer = newGrid();

  // ── Camera bay: floor grates + neon strips + ceiling lights ──────────────
  for (let x = 3; x <= 30; x += 4) {
    setTile(layer, x, 1, LOBBY_GID.FLOOR_GRATE);
  }
  setTile(layer, 8, 3, LOBBY_GID.NEON_STRIP);
  setTile(layer, 16, 3, LOBBY_GID.NEON_STRIP);
  setTile(layer, 24, 3, LOBBY_GID.NEON_STRIP);
  setTile(layer, 10, 1, LOBBY_GID.CEILING_LIGHT);
  setTile(layer, 22, 1, LOBBY_GID.CEILING_LIGHT);

  // ── Control room: ceiling light grid + floor grates ──────────────────────
  for (let x = 8; x <= 24; x += 8) {
    setTile(layer, x, 9, LOBBY_GID.CEILING_LIGHT);
    setTile(layer, x, 16, LOBBY_GID.CEILING_LIGHT);
    setTile(layer, x, 22, LOBBY_GID.CEILING_LIGHT);
  }
  setTile(layer, 7, 10, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 15, 10, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 23, 10, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 7, 17, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 15, 17, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 23, 17, LOBBY_GID.FLOOR_GRATE);
  // Neon floor accents along control room walls
  for (let y = 6; y <= 22; y += 4) {
    setTile(layer, 6, y, LOBBY_GID.NEON_STRIP);
    setTile(layer, 25, y, LOBBY_GID.NEON_STRIP);
  }

  // ── Command office: ceiling lights + carpet ───────────────────────────────
  setTile(layer, 30, 5, LOBBY_GID.CEILING_LIGHT);
  setTile(layer, 30, 12, LOBBY_GID.CEILING_LIGHT);
  setTile(layer, 29, 7, LOBBY_GID.CARPET);
  setTile(layer, 30, 7, LOBBY_GID.CARPET);
  setTile(layer, 31, 7, LOBBY_GID.CARPET);

  // ── Interrogation room: caution stripes + oil stain ──────────────────────
  setTile(layer, 3, 25, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 11, 25, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 7, 28, LOBBY_GID.OIL_STAIN);
  setTile(layer, 5, 25, LOBBY_GID.CEILING_LIGHT);

  // ── Caution stripes at all door thresholds ────────────────────────────────
  setTile(layer, 15, 4, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 17, 4, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 26, 8, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 29, 14, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 31, 14, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 5, 24, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 7, 24, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 11, 27, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 13, 27, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 32, 5, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 32, 25, LOBBY_GID.CAUTION_STRIPE);

  // ── Elevator: floor grate + ceiling light ────────────────────────────────
  setTile(layer, 36, 5, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 36, 20, LOBBY_GID.CEILING_LIGHT);

  return layer;
}

function buildInteractiveLayer(): number[] {
  const layer = newGrid();

  // 10 terminals — monitor wall effect and consoles
  setTile(layer, 8, 6, LOBBY_GID.TERMINAL); // ch05_01
  setTile(layer, 12, 6, LOBBY_GID.TERMINAL); // ch05_02
  setTile(layer, 16, 6, LOBBY_GID.TERMINAL); // ch05_03
  setTile(layer, 20, 6, LOBBY_GID.TERMINAL); // ch05_04
  setTile(layer, 24, 6, LOBBY_GID.TERMINAL); // ch05_05 (monitor wall row)
  setTile(layer, 10, 14, LOBBY_GID.TERMINAL); // ch05_06
  setTile(layer, 18, 14, LOBBY_GID.TERMINAL); // ch05_07
  setTile(layer, 10, 22, LOBBY_GID.TERMINAL); // ch05_08
  setTile(layer, 29, 6, LOBBY_GID.TERMINAL); // ch05_09 command office
  setTile(layer, 6, 26, LOBBY_GID.TERMINAL); // ch05_10 interrogation

  // Door tiles
  setTile(layer, 16, 4, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 27, 8, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 30, 14, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 6, 24, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 12, 27, LOBBY_GID.DOOR_OPEN);
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
    makeObject(nextId++, 'Chief Surveillance Kwan', 'npc', 29, 5, [
      prop('dialogId', 'chief_kwan'),
      prop('npcId', 'chief_kwan'),
      prop('behavior', 'idle'),
    ]),
  );
  add(
    makeObject(nextId++, 'Operator Diaz', 'npc', 14, 10, [
      prop('dialogId', 'operator_diaz'),
      prop('npcId', 'operator_diaz'),
      prop('behavior', 'patrol'),
    ]),
  );
  add(
    makeObject(nextId++, 'Analysis Bot', 'npc', 6, 2, [
      prop('dialogId', 'analysis_bot'),
      prop('npcId', 'analysis_bot'),
      prop('behavior', 'wander'),
    ]),
  );

  // Terminals
  add(
    makeObject(nextId++, 'Monitor Wall Panel 1', 'terminal', 8, 6, [
      prop('challengeId', 'ch05_01_simple_function'),
      prop('label', 'Monitor Wall Panel 1'),
      prop('room', 'control_room'),
    ]),
  );
  add(
    makeObject(nextId++, 'Monitor Wall Panel 2', 'terminal', 12, 6, [
      prop('challengeId', 'ch05_02_function_return'),
      prop('label', 'Monitor Wall Panel 2'),
      prop('room', 'control_room'),
    ]),
  );
  add(
    makeObject(nextId++, 'Monitor Wall Panel 3', 'terminal', 16, 6, [
      prop('challengeId', 'ch05_03_multiple_parameters'),
      prop('label', 'Monitor Wall Panel 3'),
      prop('room', 'control_room'),
    ]),
  );
  add(
    makeObject(nextId++, 'Monitor Wall Panel 4', 'terminal', 20, 6, [
      prop('challengeId', 'ch05_04_default_parameters'),
      prop('label', 'Monitor Wall Panel 4'),
      prop('room', 'control_room'),
    ]),
  );
  add(
    makeObject(nextId++, 'Monitor Wall Panel 5', 'terminal', 24, 6, [
      prop('challengeId', 'ch05_05_return_multiple'),
      prop('label', 'Monitor Wall Panel 5'),
      prop('room', 'control_room'),
    ]),
  );
  add(
    makeObject(nextId++, 'Control Console 1', 'terminal', 10, 14, [
      prop('challengeId', 'ch05_06_functions_calling_functions'),
      prop('label', 'Control Console 1'),
      prop('room', 'control_room'),
    ]),
  );
  add(
    makeObject(nextId++, 'Control Console 2', 'terminal', 18, 14, [
      prop('challengeId', 'ch05_07_scope'),
      prop('label', 'Control Console 2'),
      prop('room', 'control_room'),
    ]),
  );
  add(
    makeObject(nextId++, 'Control Console 3', 'terminal', 10, 22, [
      prop('challengeId', 'ch05_08_args'),
      prop('label', 'Control Console 3'),
      prop('room', 'control_room'),
    ]),
  );
  add(
    makeObject(nextId++, 'Command Terminal', 'terminal', 29, 6, [
      prop('challengeId', 'ch05_09_kwargs'),
      prop('label', 'Command Terminal'),
      prop('room', 'command_office'),
    ]),
  );
  add(
    makeObject(nextId++, 'Interrogation Terminal', 'terminal', 6, 26, [
      prop('challengeId', 'ch05_10_lambda'),
      prop('label', 'Interrogation Terminal'),
      prop('room', 'interrogation'),
    ]),
  );

  // Elevator up (to floor 4)
  add(
    makeObject(nextId++, 'Elevator to Floor 4', 'door', 37, 5, [
      prop('targetFloor', 'floor4'),
      prop('locked', 'true'),
      prop('requiresChallenge', 'ch05_10_lambda'),
    ]),
  );
  // Elevator down (to floor 2)
  add(
    makeObject(nextId++, 'Elevator to Floor 2', 'door', 37, 25, [
      prop('targetFloor', 'floor2'),
      prop('locked', 'false'),
    ]),
  );

  // ─── Items ──────────────────────────────────────────────────────────────────
  // Datafile in command office on the supervisor's desk
  add(
    makeObject(nextId++, 'Surveillance Protocol Log', 'item', 29, 4, [
      prop('itemType', 'datafile'),
      prop('itemId', 'surveillance_protocol_log'),
    ]),
  );
  // Keycard locked in command office drawer — grants deeper access
  add(
    makeObject(nextId++, 'Surveillance Hub Keycard', 'item', 30, 11, [
      prop('itemType', 'keycard'),
      prop('itemId', 'surveillance_hub_keycard'),
    ]),
  );
  // Datafile in main control room near Control Console 1
  add(
    makeObject(nextId++, 'Security Protocol Log', 'item', 10, 13, [
      prop('itemType', 'datafile'),
      prop('itemId', 'security_protocol_log'),
    ]),
  );
  // Tool in control room — obfuscation utility found at a monitoring station
  add(
    makeObject(nextId++, 'Code Obfuscator Tool', 'item', 18, 13, [
      prop('itemType', 'tool'),
      prop('itemId', 'code_obfuscator'),
    ]),
  );
  // Datafile in interrogation room — admin credentials cached on terminal
  add(
    makeObject(nextId, 'Admin Credentials File', 'item', 5, 27, [
      prop('itemType', 'datafile'),
      prop('itemId', 'admin_credentials'),
    ]),
  );

  return objects;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateFloor3Tilemap(): TiledMap {
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
        name: FLOOR_3_TILESET_NAME,
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
