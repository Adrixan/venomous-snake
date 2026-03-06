/**
 * TilemapGenerator – produces a Tiled-compatible JSON tilemap for the Lobby
 * floor (Floor 0) of Venomous Snake.
 *
 * Map layout (40 cols × 30 rows, 32 px/tile):
 *
 *   ┌──────────────┬────────────────────┬──────────────┬───────────────┐
 *   │  BREAK ROOM  │     SECURITY       │ SERVER CLOSET│   ELEVATOR    │
 *   │  cols 0-12   │   cols 12-24       │  cols 24-33  │   cols 33-39  │
 *   │  rows 0-12   │   rows 0-12        │  rows 0-12   │   rows 0-29   │
 *   ├──────────────┴────────────────────┴──────────────┤               │
 *   │         MAIN RECEPTION HALL (rows 13-29)         │               │
 *   │                  cols 0-33                       │               │
 *   │  Entrance at cols 19-20, row 29 (south wall)     │               │
 *   └──────────────────────────────────────────────────┴───────────────┘
 */

import { LOBBY_GID } from './TilesetGenerator';

// ─── Public constants ────────────────────────────────────────────────────────

export const LOBBY_MAP_KEY = 'lobby';
export const LOBBY_TILESET_NAME = 'lobby_tiles'; // must match TilesetGenerator key

// ─── Tiled JSON types ─────────────────────────────────────────────────────────

export interface TiledProperty {
  name: string;
  type: 'string' | 'int' | 'bool' | 'float';
  value: string | number | boolean;
}

export interface TiledObject {
  id: number;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  point: boolean;
  properties: TiledProperty[];
}

interface TiledTileLayer {
  id: number;
  name: string;
  type: 'tilelayer';
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  opacity: number;
  data: number[];
}

interface TiledObjectLayer {
  id: number;
  name: string;
  type: 'objectgroup';
  draworder: 'topdown';
  x: number;
  y: number;
  visible: boolean;
  opacity: number;
  objects: TiledObject[];
}

type TiledLayer = TiledTileLayer | TiledObjectLayer;

interface TiledTileset {
  columns: number;
  firstgid: number;
  imageheight: number;
  imagewidth: number;
  margin: number;
  name: string;
  spacing: number;
  tilecount: number;
  tileheight: number;
  tilewidth: number;
}

export interface TiledMap {
  compressionlevel: number;
  height: number;
  infinite: boolean;
  layers: TiledLayer[];
  nextlayerid: number;
  nextobjectid: number;
  orientation: string;
  renderorder: string;
  tiledversion: string;
  tileheight: number;
  tilesets: TiledTileset[];
  tilewidth: number;
  type: string;
  version: string;
  width: number;
}

// ─── Map dimensions ───────────────────────────────────────────────────────────

const MAP_W = 40;
const MAP_H = 30;
const TILE_SIZE = 32;

// ─── Wall / door positions ────────────────────────────────────────────────────

/** Tile columns for the vertical inner walls. */
const COL_BREAK_EAST = 12; // break room east / security west
const COL_SEC_EAST = 24; // security east / server closet west
const COL_ELEVATOR_W = 33; // elevator west wall

/** Row for the horizontal inner wall dividing upper rooms from main hall. */
const ROW_DIVIDER = 12;

/** Door gaps in the divider wall (pass through to enter upper rooms). */
const DOOR_BREAK_COL = 6;
const DOOR_SEC_COL = 18;
const DOOR_SERVER_COL = 29;

/** Door gaps in the elevator west wall. */
const DOOR_ELEV_UPPER_ROW = 6; // upper section: server closet → elevator
const DOOR_ELEV_LOWER_ROW = 20; // lower section: main hall → elevator

/** South wall entrance (two tiles wide). */
const ENTRANCE_COL_A = 19;
const ENTRANCE_COL_B = 20;

// ─── Layer grid helpers ───────────────────────────────────────────────────────

function newGrid(): number[] {
  return new Array(MAP_W * MAP_H).fill(0) as number[];
}

function setTile(layer: number[], x: number, y: number, gid: number): void {
  if (x >= 0 && x < MAP_W && y >= 0 && y < MAP_H) {
    layer[y * MAP_W + x] = gid;
  }
}

function getTile(layer: number[], x: number, y: number): number {
  if (x >= 0 && x < MAP_W && y >= 0 && y < MAP_H) {
    return layer[y * MAP_W + x] ?? 0;
  }
  return 0;
}

// ─── Layer builders ───────────────────────────────────────────────────────────

/** Fills the floor layer with textured tiles, checkerboard, and room-themed variants. */
function buildFloorLayer(): number[] {
  const layer = newGrid();

  for (let y = 1; y < MAP_H - 1; y++) {
    for (let x = 1; x < MAP_W - 1; x++) {
      // Elevator interior: uniform dark metal
      if (x >= COL_ELEVATOR_W + 1 && x < MAP_W - 1) {
        setTile(layer, x, y, LOBBY_GID.FLOOR_DARK);
        continue;
      }
      // Main hall
      if (y > ROW_DIVIDER && x < COL_ELEVATOR_W) {
        // Carpet area near reception desk (executive corner)
        if (x >= 1 && x <= 10 && y >= 18 && y <= 26) {
          setTile(layer, x, y, LOBBY_GID.CARPET);
          continue;
        }
        const gid = (x + y) % 2 === 0 ? LOBBY_GID.FLOOR_DARK : LOBBY_GID.FLOOR_LIGHT;
        setTile(layer, x, y, gid);
        continue;
      }
      // Break room: occasional floor_variant for visual variety
      if (x >= 1 && x < COL_BREAK_EAST && (x + y * 3) % 7 === 0) {
        setTile(layer, x, y, LOBBY_GID.FLOOR_VARIANT);
        continue;
      }
      // All other upper-room interiors: dark metal
      setTile(layer, x, y, LOBBY_GID.FLOOR_DARK);
    }
  }

  // Entrance gap gets floor too (override outer wall row)
  setTile(layer, ENTRANCE_COL_A, MAP_H - 1, LOBBY_GID.FLOOR_DARK);
  setTile(layer, ENTRANCE_COL_B, MAP_H - 1, LOBBY_GID.FLOOR_DARK);

  return layer;
}

/** Builds the walls layer (visual wall tiles, corners, neon accents). */
function buildWallsLayer(): number[] {
  const layer = newGrid();

  function wall(x: number, y: number): void {
    setTile(layer, x, y, LOBBY_GID.WALL);
  }
  function corner(x: number, y: number): void {
    setTile(layer, x, y, LOBBY_GID.WALL_CORNER);
  }
  function neon(x: number, y: number): void {
    setTile(layer, x, y, LOBBY_GID.NEON_STRIP);
  }

  // ── Outer perimeter ──────────────────────────────────────────────────────
  for (let x = 0; x < MAP_W; x++) {
    wall(x, 0);
    if (x !== ENTRANCE_COL_A && x !== ENTRANCE_COL_B) {
      wall(x, MAP_H - 1);
    }
  }
  for (let y = 1; y < MAP_H - 1; y++) {
    wall(0, y);
    wall(MAP_W - 1, y);
  }

  // Outer corners
  corner(0, 0);
  corner(MAP_W - 1, 0);
  corner(0, MAP_H - 1);
  corner(MAP_W - 1, MAP_H - 1);

  // ── Horizontal divider (row 12) ──────────────────────────────────────────
  for (let x = 1; x < COL_ELEVATOR_W; x++) {
    if (x !== DOOR_BREAK_COL && x !== DOOR_SEC_COL && x !== DOOR_SERVER_COL) {
      wall(x, ROW_DIVIDER);
    }
  }
  // Corners where vertical walls meet the divider
  corner(COL_BREAK_EAST, ROW_DIVIDER);
  corner(COL_SEC_EAST, ROW_DIVIDER);

  // ── Vertical inner walls (upper section only) ────────────────────────────
  for (let y = 1; y < ROW_DIVIDER; y++) {
    wall(COL_BREAK_EAST, y);
    wall(COL_SEC_EAST, y);
  }

  // ── Elevator west wall (full height) ────────────────────────────────────
  for (let y = 1; y < MAP_H - 1; y++) {
    if (y !== DOOR_ELEV_UPPER_ROW && y !== DOOR_ELEV_LOWER_ROW) {
      wall(COL_ELEVATOR_W, y);
    }
  }
  corner(COL_ELEVATOR_W, 0);
  corner(COL_ELEVATOR_W, MAP_H - 1);

  // ── Neon accent strips (decoration on inner wall faces) ──────────────────
  // Along divider row (floor-side, row 13)
  for (let x = 2; x < COL_ELEVATOR_W - 1; x += 5) {
    neon(x, ROW_DIVIDER + 1);
  }
  // Along elevator west wall (hall-side, col 32)
  for (let y = ROW_DIVIDER + 2; y < MAP_H - 2; y += 4) {
    neon(COL_ELEVATOR_W - 1, y);
  }

  return layer;
}

/** Builds the furniture layer (desks, chairs, planters, racks, cabinets, screens). */
function buildFurnitureLayer(): number[] {
  const layer = newGrid();

  // ── Main hall: reception desk row ────────────────────────────────────────
  for (let x = 2; x <= 9; x++) {
    setTile(layer, x, 17, LOBBY_GID.RECEPTION_DESK);
  }
  // Chairs near reception desk
  setTile(layer, 11, 17, LOBBY_GID.CHAIR);
  setTile(layer, 11, 21, LOBBY_GID.CHAIR);
  setTile(layer, 4, 22, LOBBY_GID.CHAIR);

  // Planters – corners of the main hall
  setTile(layer, 1, 14, LOBBY_GID.PLANTER);
  setTile(layer, 1, 27, LOBBY_GID.PLANTER);
  setTile(layer, 31, 14, LOBBY_GID.PLANTER);
  setTile(layer, 31, 27, LOBBY_GID.PLANTER);

  // ── Break room: tables ───────────────────────────────────────────────────
  setTile(layer, 4, 4, LOBBY_GID.DESK);
  setTile(layer, 5, 4, LOBBY_GID.DESK);
  setTile(layer, 4, 7, LOBBY_GID.DESK);
  setTile(layer, 5, 7, LOBBY_GID.CHAIR);

  // ── Security: guard desk + filing cabinets ────────────────────────────────
  setTile(layer, 14, 3, LOBBY_GID.DESK);
  setTile(layer, 15, 3, LOBBY_GID.DESK);
  setTile(layer, 20, 9, LOBBY_GID.DESK);
  setTile(layer, 21, 9, LOBBY_GID.CHAIR);
  setTile(layer, 22, 5, LOBBY_GID.FILING_CABINET);
  setTile(layer, 22, 6, LOBBY_GID.FILING_CABINET);
  setTile(layer, 13, 8, LOBBY_GID.FILING_CABINET);

  // Security wall screens (mounted near north wall)
  setTile(layer, 17, 2, LOBBY_GID.WALL_SCREEN);
  setTile(layer, 21, 2, LOBBY_GID.WALL_SCREEN);

  // ── Server closet: server racks + cable management ────────────────────────
  setTile(layer, 26, 2, LOBBY_GID.SERVER_RACK);
  setTile(layer, 27, 2, LOBBY_GID.SERVER_RACK);
  setTile(layer, 28, 2, LOBBY_GID.SERVER_RACK);
  setTile(layer, 26, 9, LOBBY_GID.SERVER_RACK);
  setTile(layer, 27, 9, LOBBY_GID.SERVER_RACK);
  setTile(layer, 29, 5, LOBBY_GID.CABLE);
  setTile(layer, 30, 5, LOBBY_GID.CABLE);

  // Pipe conduit along north wall of server closet (below ceiling)
  for (let x = 25; x <= 32; x++) {
    setTile(layer, x, 1, LOBBY_GID.PIPE_H);
  }

  // Elevator: vent on wall
  setTile(layer, 34, 10, LOBBY_GID.VENT);
  setTile(layer, 38, 10, LOBBY_GID.VENT);

  return layer;
}

/** Builds a decoration layer: floor-level ambiance tiles (grates, stripes, stains, lights). */
function buildDecorationLayer(): number[] {
  const layer = newGrid();

  // ── Floor grates near terminals and server equipment ──────────────────────
  setTile(layer, 8, 3, LOBBY_GID.FLOOR_GRATE); // near break room terminal
  setTile(layer, 25, 3, LOBBY_GID.FLOOR_GRATE); // near server console
  setTile(layer, 28, 4, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 30, 8, LOBBY_GID.FLOOR_GRATE); // near diagnostic panel

  // ── Caution stripes flanking every door passage ───────────────────────────
  // Break room door (col 6, row 12)
  setTile(layer, 5, 13, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 7, 13, LOBBY_GID.CAUTION_STRIPE);
  // Security door (col 18, row 12)
  setTile(layer, 17, 13, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 19, 13, LOBBY_GID.CAUTION_STRIPE);
  // Server closet door (col 29, row 12)
  setTile(layer, 28, 13, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 30, 13, LOBBY_GID.CAUTION_STRIPE);
  // Elevator doorways
  setTile(layer, COL_ELEVATOR_W + 1, DOOR_ELEV_UPPER_ROW, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, COL_ELEVATOR_W + 1, DOOR_ELEV_LOWER_ROW, LOBBY_GID.CAUTION_STRIPE);

  // ── Oil / coolant stains ──────────────────────────────────────────────────
  setTile(layer, 29, 7, LOBBY_GID.OIL_STAIN); // server closet leakage
  setTile(layer, 31, 6, LOBBY_GID.OIL_STAIN);
  setTile(layer, 2, 9, LOBBY_GID.OIL_STAIN); // break room floor

  // ── Ceiling-light reflection pools in main hall ───────────────────────────
  for (let x = 6; x < COL_ELEVATOR_W; x += 8) {
    setTile(layer, x, 16, LOBBY_GID.CEILING_LIGHT);
    setTile(layer, x, 23, LOBBY_GID.CEILING_LIGHT);
  }

  return layer;
}

/** Builds the interactive layer (visual tiles for terminals, doors, elevator). */
function buildInteractiveLayer(): number[] {
  const layer = newGrid();

  // Break room – coffee machine terminal
  setTile(layer, 9, 2, LOBBY_GID.TERMINAL);

  // Security – badge reader + keypad
  setTile(layer, 16, 3, LOBBY_GID.TERMINAL);
  setTile(layer, 22, 9, LOBBY_GID.TERMINAL);

  // Server closet – server console + diagnostic panel
  setTile(layer, 27, 3, LOBBY_GID.TERMINAL);
  setTile(layer, 31, 9, LOBBY_GID.TERMINAL);

  // Elevator – access control (upper) + panel (lower)
  setTile(layer, 35, 3, LOBBY_GID.TERMINAL);
  setTile(layer, 35, 15, LOBBY_GID.TERMINAL);

  // Elevator door object
  setTile(layer, 36, 5, LOBBY_GID.ELEVATOR);
  setTile(layer, 37, 5, LOBBY_GID.ELEVATOR);

  // Door tiles at passage openings (visual cue)
  setTile(layer, DOOR_BREAK_COL, ROW_DIVIDER, LOBBY_GID.DOOR_OPEN);
  setTile(layer, DOOR_SEC_COL, ROW_DIVIDER, LOBBY_GID.DOOR_OPEN);
  setTile(layer, DOOR_SERVER_COL, ROW_DIVIDER, LOBBY_GID.DOOR_OPEN);
  setTile(layer, COL_ELEVATOR_W, DOOR_ELEV_UPPER_ROW, LOBBY_GID.DOOR_OPEN);
  setTile(layer, COL_ELEVATOR_W, DOOR_ELEV_LOWER_ROW, LOBBY_GID.DOOR_OPEN);

  // Entrance door marker
  setTile(layer, ENTRANCE_COL_A, MAP_H - 1, LOBBY_GID.DOOR_OPEN);
  setTile(layer, ENTRANCE_COL_B, MAP_H - 1, LOBBY_GID.DOOR_OPEN);

  return layer;
}

/**
 * Builds the collision layer. Only wall tiles produce blocking bodies;
 * anything else is GID 0 (passable). The TilemapManager uses
 * `setCollisionByExclusion([-1])` which collides every tile that isn't empty.
 */
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

// ─── Object layer ─────────────────────────────────────────────────────────────

function px(col: number): number {
  return col * TILE_SIZE + TILE_SIZE / 2;
}
function py(row: number): number {
  return row * TILE_SIZE + TILE_SIZE / 2;
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

function prop(name: string, value: string): TiledProperty {
  return { name, type: 'string', value };
}

function buildObjectLayer(): TiledObject[] {
  let nextId = 1;
  const objects: TiledObject[] = [];

  function add(obj: TiledObject): void {
    objects.push(obj);
  }

  // ── Spawn points ─────────────────────────────────────────────────────────
  add(makeObject(nextId++, 'player_start', 'player_start', ENTRANCE_COL_A, 26));

  add(
    makeObject(nextId++, 'Guard Torres', 'npc', 17, 6, [
      prop('dialogId', 'guard_torres'),
      prop('npcId', 'guard_torres'),
      prop('behavior', 'idle'),
    ]),
  );

  add(
    makeObject(nextId++, 'Dr. Silva', 'npc', 5, 5, [
      prop('dialogId', 'dr_silva'),
      prop('npcId', 'dr_silva'),
      prop('behavior', 'patrol'),
    ]),
  );

  // ── Terminals ────────────────────────────────────────────────────────────
  add(
    makeObject(nextId++, 'Coffee Machine', 'terminal', 9, 2, [
      prop('challengeId', 'ch01_01_hello_world'),
      prop('label', 'Coffee Machine'),
      prop('room', 'break_room'),
    ]),
  );

  add(
    makeObject(nextId++, 'Badge Reader', 'terminal', 16, 3, [
      prop('challengeId', 'ch01_02_variables'),
      prop('label', 'Badge Reader'),
      prop('room', 'security'),
    ]),
  );

  add(
    makeObject(nextId++, 'Security Keypad', 'terminal', 22, 9, [
      prop('challengeId', 'ch01_03_math_ops'),
      prop('label', 'Security Keypad'),
      prop('room', 'security'),
    ]),
  );

  add(
    makeObject(nextId++, 'Server Console', 'terminal', 27, 3, [
      prop('challengeId', 'ch01_04_string_types'),
      prop('label', 'Server Console'),
      prop('room', 'server_closet'),
    ]),
  );

  add(
    makeObject(nextId++, 'Diagnostic Panel', 'terminal', 31, 9, [
      prop('challengeId', 'ch01_05_float_calc'),
      prop('label', 'Diagnostic Panel'),
      prop('room', 'server_closet'),
    ]),
  );

  add(
    makeObject(nextId++, 'Elevator Panel', 'terminal', 35, 15, [
      prop('challengeId', 'ch01_07_multiline'),
      prop('label', 'Elevator Panel'),
      prop('room', 'elevator'),
    ]),
  );

  add(
    makeObject(nextId++, 'Access Control', 'terminal', 35, 3, [
      prop('challengeId', 'ch01_08_comments'),
      prop('label', 'Access Control'),
      prop('room', 'elevator'),
    ]),
  );

  // ── Elevator door (locked) ────────────────────────────────────────────────
  add(
    makeObject(nextId, 'Elevator to Floor 1', 'door', 37, 5, [
      prop('targetFloor', 'floor1'),
      prop('locked', 'true'),
      prop('requiresChallenge', 'ch01_08_comments'),
    ]),
  );

  return objects;
}

// ─── Main export ──────────────────────────────────────────────────────────────

/** Generates and returns a complete Tiled-format JSON map for the Lobby floor. */
export function generateLobbyTilemap(): TiledMap {
  const floorLayer = buildFloorLayer();
  const decorationLayer = buildDecorationLayer();
  const wallsLayer = buildWallsLayer();
  const furnitureLayer = buildFurnitureLayer();
  const interactiveLayer = buildInteractiveLayer();
  const collisionLayer = buildCollisionLayer(wallsLayer);
  const objectsData = buildObjectLayer();

  let layerId = 1;

  function tileLayer(name: string, data: number[]): TiledTileLayer {
    return {
      id: layerId++,
      name,
      type: 'tilelayer',
      x: 0,
      y: 0,
      width: MAP_W,
      height: MAP_H,
      visible: true,
      opacity: 1,
      data,
    };
  }

  const objectLayer: TiledObjectLayer = {
    id: layerId++,
    name: 'objects',
    type: 'objectgroup',
    draworder: 'topdown',
    x: 0,
    y: 0,
    visible: true,
    opacity: 1,
    objects: objectsData,
  };

  const layers: TiledLayer[] = [
    tileLayer('floor', floorLayer),
    tileLayer('decoration', decorationLayer),
    tileLayer('walls', wallsLayer),
    tileLayer('furniture', furnitureLayer),
    tileLayer('interactive', interactiveLayer),
    tileLayer('collision', collisionLayer),
    objectLayer,
  ];

  const tileset: TiledTileset = {
    columns: 8,
    firstgid: 1,
    imageheight: 256,
    imagewidth: 256,
    margin: 0,
    name: LOBBY_TILESET_NAME,
    spacing: 0,
    tilecount: 64,
    tileheight: TILE_SIZE,
    tilewidth: TILE_SIZE,
  };

  return {
    compressionlevel: -1,
    height: MAP_H,
    infinite: false,
    layers,
    nextlayerid: layerId,
    nextobjectid: objectsData.length + 1,
    orientation: 'orthogonal',
    renderorder: 'right-down',
    tiledversion: '1.10.2',
    tileheight: TILE_SIZE,
    tilesets: [tileset],
    tilewidth: TILE_SIZE,
    type: 'map',
    version: '1.10',
    width: MAP_W,
  };
}
