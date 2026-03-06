export { EventBus } from './EventBus';
export { GameScene } from './scenes/GameScene';
export { BootScene } from './scenes/BootScene';
export { createGameConfig } from './config';
export type { GameSceneData } from './scenes/GameScene';

// Entities
export { Player } from './entities/Player';
export { InteractiveObject } from './entities/InteractiveObject';
export type { InteractiveObjectType } from './entities/InteractiveObject';

// Systems
export { TilemapManager } from './systems/TilemapManager';
export type { SpawnPoint } from './systems/TilemapManager';
export { CameraSystem } from './systems/CameraSystem';

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
