export { EventBus } from './EventBus';
export { GameScene } from './scenes/GameScene';
export { BootScene } from './scenes/BootScene';
export { createGameConfig } from './config';
export type { GameSceneData } from './scenes/GameScene';

// Entities
export { Player } from './entities/Player';
export { InteractiveObject } from './entities/InteractiveObject';
export type { InteractiveObjectType } from './entities/InteractiveObject';
export { NPC } from './entities/NPC';
export type { NPCBehavior, NPCConfig } from './entities/NPC';

// Input
export { InputManager } from './input/InputManager';
export { VirtualJoystick } from './input/VirtualJoystick';
export { InteractButton } from './input/InteractButton';
export type { InputMode, MovementVector } from './input/InputManager';
export type { JoystickOutput } from './input/VirtualJoystick';

// Systems
export { TilemapManager } from './systems/TilemapManager';
export type { SpawnPoint } from './systems/TilemapManager';
export { CameraSystem } from './systems/CameraSystem';
export { TransitionManager } from './systems/TransitionManager';
export { ParticleManager } from './systems/ParticleManager';

// Procedural tilemap utilities (exported under distinct name to avoid collision)
export { TilemapManager as ProceduralRoomManager } from './tilemap/TilemapManager';
export type {
  RoomConfig,
  InteractiveObjectData,
  DoorConfig,
  ObjectConfig,
  TilemapResult,
} from './tilemap/TilemapManager';
export {
  generateRoomLayout,
  createTilesetTexture,
  TILESET_KEY,
  TILE,
} from './tilemap/ProceduralRoom';
export type { TileValue } from './tilemap/ProceduralRoom';

// Maps
export {
  LOBBY_MAP,
  MapRenderer,
  generateTilesetTexture,
  LOBBY_TILESET_KEY,
  LOBBY_GID,
  TILE_IDX,
  generateLobbyTilemap,
  LOBBY_MAP_KEY,
  LOBBY_TILESET_NAME,
  getFloorTilemap,
  getRegisteredFloors,
} from './maps';
export type {
  ProceduralMapConfig,
  ProceduralRoom,
  TiledMap,
  TiledObject,
  TiledProperty,
  FloorTilemapDef,
} from './maps';
