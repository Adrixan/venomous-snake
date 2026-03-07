/**
 * Floor 2 – R&D Laboratory
 *
 * Science/tech lab with containment areas and lab benches.
 * Central lab (cols 2-30), containment zone upper-right (cols 22-32, rows 1-14),
 * prep room lower-left (cols 1-12, rows 16-29), elevator shaft (cols 33-39).
 */

import { LOBBY_GID } from '../TilesetGenerator';
import type { TiledMap, TiledObject, TiledProperty } from '../TilemapGenerator';

export const FLOOR_2_MAP_KEY = 'floor2';
export const FLOOR_2_TILESET_NAME = 'lobby_tiles';

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
      // Containment zone: dark sterile
      if (x >= 22 && x <= 32 && y >= 1 && y <= 14) {
        setTile(layer, x, y, LOBBY_GID.FLOOR_DARK);
        continue;
      }
      // Prep room: light tiles
      if (x >= 1 && x <= 12 && y >= 16 && y <= 28) {
        setTile(layer, x, y, (x + y) % 2 === 0 ? LOBBY_GID.FLOOR_LIGHT : LOBBY_GID.FLOOR_DARK);
        continue;
      }
      // Central lab: checkerboard
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

  // Containment zone walls (cols 22-32, row 14 bottom, col 21 left)
  for (let x = 21; x <= 32; x++) {
    if (x !== 26) setTile(layer, x, 14, LOBBY_GID.WALL); // door at col 26
  }
  for (let y = 1; y <= 14; y++) {
    if (y !== 7) setTile(layer, 21, y, LOBBY_GID.WALL); // door at row 7
  }
  // Biometric frame corners
  setTile(layer, 21, 0, LOBBY_GID.WALL_CORNER);
  setTile(layer, 21, 14, LOBBY_GID.WALL_CORNER);
  setTile(layer, 22, 14, LOBBY_GID.WALL_CORNER);
  setTile(layer, 32, 14, LOBBY_GID.WALL_CORNER);
  // Extra biometric frame accents inside containment
  setTile(layer, 26, 1, LOBBY_GID.WALL_CORNER);
  setTile(layer, 26, 7, LOBBY_GID.WALL_CORNER);

  // Prep room walls (cols 1-12, row 15 top, col 13 right)
  for (let x = 1; x <= 12; x++) {
    if (x !== 6) setTile(layer, x, 15, LOBBY_GID.WALL); // door at col 6
  }
  for (let y = 15; y < MAP_H - 1; y++) {
    if (y !== 22) setTile(layer, 13, y, LOBBY_GID.WALL); // door at row 22
  }
  setTile(layer, 0, 15, LOBBY_GID.WALL_CORNER);
  setTile(layer, 13, 15, LOBBY_GID.WALL_CORNER);
  setTile(layer, 13, MAP_H - 1, LOBBY_GID.WALL_CORNER);

  // Neon accents
  for (let x = 3; x < 20; x += 6) {
    setTile(layer, x, 1, LOBBY_GID.NEON_STRIP);
  }

  return layer;
}

function buildFurnitureLayer(): number[] {
  const layer = newGrid();

  // Central lab: dense bench rows with chairs on both sides
  for (let y = 3; y <= 12; y += 3) {
    for (let x = 3; x <= 18; x += 4) {
      setTile(layer, x, y, LOBBY_GID.DESK);
      setTile(layer, x + 1, y, LOBBY_GID.DESK);
      // Chair on south side of each bench
      setTile(layer, x, y + 1, LOBBY_GID.CHAIR);
      setTile(layer, x + 1, y + 1, LOBBY_GID.CHAIR);
    }
  }
  // Filing cabinets along east wall of lab (col 20)
  setTile(layer, 20, 4, LOBBY_GID.FILING_CABINET);
  setTile(layer, 20, 7, LOBBY_GID.FILING_CABINET);
  setTile(layer, 20, 10, LOBBY_GID.FILING_CABINET);
  // Planters in lab corners
  setTile(layer, 1, 2, LOBBY_GID.PLANTER);
  setTile(layer, 1, 13, LOBBY_GID.PLANTER);
  // Pipe conduit along lab north wall
  for (let x = 1; x <= 20; x++) {
    setTile(layer, x, 1, LOBBY_GID.PIPE_H);
  }

  // Containment zone: specimen containers + wall screens + cable runs
  for (let x = 23; x <= 31; x += 4) {
    setTile(layer, x, 3, LOBBY_GID.PLANTER);
    setTile(layer, x, 8, LOBBY_GID.PLANTER);
    setTile(layer, x, 12, LOBBY_GID.PLANTER);
  }
  // Wall-screen bank on north wall of containment
  setTile(layer, 22, 2, LOBBY_GID.WALL_SCREEN);
  setTile(layer, 24, 2, LOBBY_GID.WALL_SCREEN);
  setTile(layer, 26, 2, LOBBY_GID.WALL_SCREEN);
  setTile(layer, 28, 2, LOBBY_GID.WALL_SCREEN);
  setTile(layer, 30, 2, LOBBY_GID.WALL_SCREEN);
  setTile(layer, 32, 2, LOBBY_GID.WALL_SCREEN);
  // Cable runs along containment floor
  for (let x = 22; x <= 32; x += 2) {
    setTile(layer, x, 13, LOBBY_GID.CABLE);
  }
  // Vents in containment zone
  setTile(layer, 24, 1, LOBBY_GID.VENT);
  setTile(layer, 30, 1, LOBBY_GID.VENT);

  // Prep room: multiple desk clusters + filing cabinets
  setTile(layer, 3, 18, LOBBY_GID.DESK);
  setTile(layer, 4, 18, LOBBY_GID.DESK);
  setTile(layer, 3, 19, LOBBY_GID.CHAIR);
  setTile(layer, 5, 19, LOBBY_GID.CHAIR);
  setTile(layer, 8, 22, LOBBY_GID.DESK);
  setTile(layer, 9, 22, LOBBY_GID.DESK);
  setTile(layer, 8, 23, LOBBY_GID.CHAIR);
  setTile(layer, 10, 23, LOBBY_GID.CHAIR);
  setTile(layer, 3, 26, LOBBY_GID.DESK);
  setTile(layer, 4, 26, LOBBY_GID.DESK);
  setTile(layer, 5, 26, LOBBY_GID.CHAIR);
  setTile(layer, 3, 27, LOBBY_GID.CHAIR);
  setTile(layer, 11, 17, LOBBY_GID.FILING_CABINET);
  setTile(layer, 11, 18, LOBBY_GID.FILING_CABINET);
  setTile(layer, 11, 19, LOBBY_GID.FILING_CABINET);
  setTile(layer, 2, 28, LOBBY_GID.PLANTER);
  setTile(layer, 11, 28, LOBBY_GID.PLANTER);
  // Pipe conduit at ceiling of prep room
  for (let x = 1; x <= 12; x++) {
    setTile(layer, x, 16, LOBBY_GID.PIPE_H);
  }

  return layer;
}

function buildDecorationLayer(): number[] {
  const layer = newGrid();

  // ── Central lab: ceiling light grid + floor grates ────────────────────────
  for (let x = 4; x <= 18; x += 7) {
    setTile(layer, x, 2, LOBBY_GID.CEILING_LIGHT);
    setTile(layer, x, 7, LOBBY_GID.CEILING_LIGHT);
    setTile(layer, x, 12, LOBBY_GID.CEILING_LIGHT);
  }
  setTile(layer, 2, 5, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 2, 10, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 19, 5, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 19, 9, LOBBY_GID.FLOOR_GRATE);

  // ── Containment zone: neon + grates + oil stains ─────────────────────────
  setTile(layer, 23, 4, LOBBY_GID.NEON_STRIP);
  setTile(layer, 27, 4, LOBBY_GID.NEON_STRIP);
  setTile(layer, 31, 4, LOBBY_GID.NEON_STRIP);
  setTile(layer, 23, 9, LOBBY_GID.NEON_STRIP);
  setTile(layer, 27, 9, LOBBY_GID.NEON_STRIP);
  setTile(layer, 31, 9, LOBBY_GID.NEON_STRIP);
  setTile(layer, 25, 6, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 29, 6, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 25, 11, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 29, 11, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 26, 10, LOBBY_GID.OIL_STAIN);
  setTile(layer, 32, 7, LOBBY_GID.OIL_STAIN);
  setTile(layer, 27, 3, LOBBY_GID.CEILING_LIGHT);
  setTile(layer, 27, 12, LOBBY_GID.CEILING_LIGHT);

  // ── Prep room: ceiling lights + grates ───────────────────────────────────
  setTile(layer, 4, 17, LOBBY_GID.CEILING_LIGHT);
  setTile(layer, 9, 17, LOBBY_GID.CEILING_LIGHT);
  setTile(layer, 4, 24, LOBBY_GID.CEILING_LIGHT);
  setTile(layer, 9, 24, LOBBY_GID.CEILING_LIGHT);
  setTile(layer, 6, 20, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 6, 27, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 7, 17, LOBBY_GID.OIL_STAIN);

  // ── Caution stripes at all door passages ──────────────────────────────────
  setTile(layer, 20, 7, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 25, 14, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 27, 14, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 5, 15, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 7, 15, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 12, 21, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 14, 21, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 32, 5, LOBBY_GID.CAUTION_STRIPE);
  setTile(layer, 32, 25, LOBBY_GID.CAUTION_STRIPE);

  // ── Elevator: floor grate + ceiling light ────────────────────────────────
  setTile(layer, 36, 5, LOBBY_GID.FLOOR_GRATE);
  setTile(layer, 36, 20, LOBBY_GID.CEILING_LIGHT);

  return layer;
}

function buildInteractiveLayer(): number[] {
  const layer = newGrid();

  // 10 terminals: ch04_01 through ch04_10
  setTile(layer, 5, 3, LOBBY_GID.TERMINAL); // ch04_01
  setTile(layer, 13, 3, LOBBY_GID.TERMINAL); // ch04_02
  setTile(layer, 5, 6, LOBBY_GID.TERMINAL); // ch04_03
  setTile(layer, 13, 6, LOBBY_GID.TERMINAL); // ch04_04
  setTile(layer, 5, 9, LOBBY_GID.TERMINAL); // ch04_05
  setTile(layer, 13, 9, LOBBY_GID.TERMINAL); // ch04_06
  setTile(layer, 24, 5, LOBBY_GID.TERMINAL); // ch04_07 containment
  setTile(layer, 30, 5, LOBBY_GID.TERMINAL); // ch04_08 containment
  setTile(layer, 5, 20, LOBBY_GID.TERMINAL); // ch04_09 prep room
  setTile(layer, 10, 25, LOBBY_GID.TERMINAL); // ch04_10 prep room

  // Door tiles
  setTile(layer, 21, 7, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 26, 14, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 6, 15, LOBBY_GID.DOOR_OPEN);
  setTile(layer, 13, 22, LOBBY_GID.DOOR_OPEN);
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
    makeObject(nextId++, 'Dr. Nakamura', 'npc', 8, 6, [
      prop('dialogId', 'dr_nakamura'),
      prop('npcId', 'dr_nakamura'),
      prop('behavior', 'idle'),
    ]),
  );
  add(
    makeObject(nextId++, 'Lab Technician Reyes', 'npc', 15, 9, [
      prop('dialogId', 'lab_tech_reyes'),
      prop('npcId', 'lab_tech_reyes'),
      prop('behavior', 'patrol'),
    ]),
  );
  add(
    makeObject(nextId++, 'Security Bot', 'npc', 27, 10, [
      prop('dialogId', 'security_bot'),
      prop('npcId', 'security_bot'),
      prop('behavior', 'guard'),
    ]),
  );

  // Terminals
  add(
    makeObject(nextId++, 'Lab Bench Terminal 1', 'terminal', 5, 3, [
      prop('challengeId', 'ch04_01'),
      prop('label', 'Lab Bench Terminal 1'),
      prop('room', 'central_lab'),
    ]),
  );
  add(
    makeObject(nextId++, 'Lab Bench Terminal 2', 'terminal', 13, 3, [
      prop('challengeId', 'ch04_02'),
      prop('label', 'Lab Bench Terminal 2'),
      prop('room', 'central_lab'),
    ]),
  );
  add(
    makeObject(nextId++, 'Lab Bench Terminal 3', 'terminal', 5, 6, [
      prop('challengeId', 'ch04_03'),
      prop('label', 'Lab Bench Terminal 3'),
      prop('room', 'central_lab'),
    ]),
  );
  add(
    makeObject(nextId++, 'Lab Bench Terminal 4', 'terminal', 13, 6, [
      prop('challengeId', 'ch04_04'),
      prop('label', 'Lab Bench Terminal 4'),
      prop('room', 'central_lab'),
    ]),
  );
  add(
    makeObject(nextId++, 'Lab Bench Terminal 5', 'terminal', 5, 9, [
      prop('challengeId', 'ch04_05'),
      prop('label', 'Lab Bench Terminal 5'),
      prop('room', 'central_lab'),
    ]),
  );
  add(
    makeObject(nextId++, 'Lab Bench Terminal 6', 'terminal', 13, 9, [
      prop('challengeId', 'ch04_06'),
      prop('label', 'Lab Bench Terminal 6'),
      prop('room', 'central_lab'),
    ]),
  );
  add(
    makeObject(nextId++, 'Containment Console 1', 'terminal', 24, 5, [
      prop('challengeId', 'ch04_07'),
      prop('label', 'Containment Console 1'),
      prop('room', 'containment_zone'),
    ]),
  );
  add(
    makeObject(nextId++, 'Containment Console 2', 'terminal', 30, 5, [
      prop('challengeId', 'ch04_08'),
      prop('label', 'Containment Console 2'),
      prop('room', 'containment_zone'),
    ]),
  );
  add(
    makeObject(nextId++, 'Prep Station Terminal', 'terminal', 5, 20, [
      prop('challengeId', 'ch04_09'),
      prop('label', 'Prep Station Terminal'),
      prop('room', 'prep_room'),
    ]),
  );
  add(
    makeObject(nextId++, 'Prep Analysis Console', 'terminal', 10, 25, [
      prop('challengeId', 'ch04_10'),
      prop('label', 'Prep Analysis Console'),
      prop('room', 'prep_room'),
    ]),
  );

  // Elevator up (to floor 3)
  add(
    makeObject(nextId++, 'Elevator to Floor 3', 'door', 37, 5, [
      prop('targetFloor', 'floor3'),
      prop('locked', 'true'),
      prop('requiresChallenge', 'ch04_10'),
    ]),
  );
  // Elevator down (to floor 1)
  add(
    makeObject(nextId++, 'Elevator to Floor 1', 'door', 37, 25, [
      prop('targetFloor', 'floor1'),
      prop('locked', 'false'),
    ]),
  );

  // ─── Items ──────────────────────────────────────────────────────────────────
  // Datafile on first lab bench — experiment notes left by a researcher
  add(
    makeObject(nextId++, 'Experiment Log Alpha', 'item', 5, 4, [
      prop('itemType', 'datafile'),
      prop('itemId', 'experiment_log_alpha'),
    ]),
  );
  // Tool on central lab bench — coding utility recovered from a workstation
  add(
    makeObject(nextId++, 'Syntax Highlighter Upgrade', 'item', 13, 4, [
      prop('itemType', 'tool'),
      prop('itemId', 'syntax_highlighter'),
    ]),
  );
  // Keycard inside containment zone, near the containment console
  add(
    makeObject(nextId++, 'Lab Access Card', 'item', 24, 4, [
      prop('itemType', 'keycard'),
      prop('itemId', 'lab_access_card'),
    ]),
  );
  // Datafile in containment zone — classified genetic research protocol
  add(
    makeObject(nextId++, 'Genetic Research Protocol', 'item', 30, 4, [
      prop('itemType', 'datafile'),
      prop('itemId', 'genetic_research_protocol'),
    ]),
  );
  // Tool in prep room on the analyst's desk
  add(
    makeObject(nextId, 'Code Formatter Patch', 'item', 4, 19, [
      prop('itemType', 'tool'),
      prop('itemId', 'code_formatter_patch'),
    ]),
  );

  return objects;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateFloor2Tilemap(): TiledMap {
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
        name: FLOOR_2_TILESET_NAME,
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
