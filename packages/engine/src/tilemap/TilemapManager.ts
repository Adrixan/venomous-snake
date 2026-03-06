import Phaser from 'phaser';
import {
  createTilesetTexture,
  generateRoomLayout,
  TILESET_KEY,
  TILE,
  type RoomConfig,
  type InteractiveObjectData,
} from './ProceduralRoom';

export type { RoomConfig, InteractiveObjectData, DoorConfig, ObjectConfig } from './ProceduralRoom';

export interface TilemapResult {
  map: Phaser.Tilemaps.Tilemap;
  layers: Map<string, Phaser.Tilemaps.TilemapLayer>;
  collisionLayer: Phaser.Tilemaps.TilemapLayer;
  interactiveObjects: InteractiveObjectData[];
}

export class TilemapManager {
  /**
   * Procedurally generates a test room tilemap for the given RoomConfig.
   * No external asset files are required – the tileset texture is created
   * at runtime using Phaser Graphics.
   */
  static createTestRoom(scene: Phaser.Scene, config: RoomConfig): TilemapResult {
    const { tileSize } = config;

    createTilesetTexture(scene, tileSize);

    const layoutData = generateRoomLayout(config);

    const map = scene.make.tilemap({
      data: layoutData,
      tileWidth: tileSize,
      tileHeight: tileSize,
    });

    const tileset = map.addTilesetImage(TILESET_KEY, TILESET_KEY, tileSize, tileSize, 0, 0);
    if (!tileset) {
      throw new Error(`TilemapManager: failed to create tileset from texture "${TILESET_KEY}"`);
    }

    const groundLayer = map.createLayer(0, tileset, 0, 0);
    if (!groundLayer) {
      throw new Error('TilemapManager: failed to create ground layer');
    }

    // Only wall tiles block movement; doors and floor are passable.
    groundLayer.setCollision([TILE.WALL]);

    const layers = new Map<string, Phaser.Tilemaps.TilemapLayer>();
    layers.set('ground', groundLayer);

    // -----------------------------------------------------------------------
    // Build interactive-object list
    // -----------------------------------------------------------------------
    const interactiveObjects: InteractiveObjectData[] = [];

    for (const obj of config.objects) {
      interactiveObjects.push({
        id: obj.id,
        type: obj.type,
        x: obj.tileX * tileSize + tileSize / 2,
        y: obj.tileY * tileSize + tileSize / 2,
      });
    }

    for (const door of config.doors) {
      let x = 0;
      let y = 0;

      switch (door.side) {
        case 'north':
          x = door.position * tileSize + tileSize / 2;
          y = tileSize / 2;
          break;
        case 'south':
          x = door.position * tileSize + tileSize / 2;
          y = (config.height - 1) * tileSize + tileSize / 2;
          break;
        case 'east':
          x = (config.width - 1) * tileSize + tileSize / 2;
          y = door.position * tileSize + tileSize / 2;
          break;
        case 'west':
          x = tileSize / 2;
          y = door.position * tileSize + tileSize / 2;
          break;
      }

      const doorObj: InteractiveObjectData = {
        id: `door_${door.side}_${door.targetRoom}`,
        type: 'door',
        x,
        y,
        targetRoom: door.targetRoom,
      };
      interactiveObjects.push(doorObj);
    }

    return {
      map,
      layers,
      collisionLayer: groundLayer,
      interactiveObjects,
    };
  }
}
