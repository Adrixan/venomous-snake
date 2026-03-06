export { EventBus } from './EventBus';
export { GameScene } from './scenes/GameScene';
export { BootScene } from './scenes/BootScene';
export { createGameConfig } from './config';
export type { GameSceneData } from './scenes/GameScene';

// Entities
export { Player } from './entities/Player';
export { InteractiveObject } from './entities/InteractiveObject';
export type { InteractiveObjectConfig } from './entities/InteractiveObject';

// Tilemap
export { TilemapManager } from './tilemap/TilemapManager';
export type {
  RoomConfig,
  InteractiveObjectData,
  DoorConfig,
  ObjectConfig,
  TilemapResult,
} from './tilemap/TilemapManager';

// Systems
export { CameraSystem } from './systems/CameraSystem';
export type { CameraConfig } from './systems/CameraSystem';
