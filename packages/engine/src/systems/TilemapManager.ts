import Phaser from 'phaser';

export interface SpawnPoint {
  type: string;
  /** Object name from the Tiled layer (e.g. NPC display name). */
  name: string;
  x: number;
  y: number;
  properties?: Record<string, unknown>;
}

export class TilemapManager {
  private tilemap: Phaser.Tilemaps.Tilemap | null = null;
  private readonly layers: Map<string, Phaser.Tilemaps.TilemapLayer> = new Map();
  private spawnPoints: SpawnPoint[] = [];

  loadTilemap(scene: Phaser.Scene, key: string, tilesetKey: string): Phaser.Tilemaps.Tilemap {
    this.tilemap = scene.make.tilemap({ key });

    const tileset = this.tilemap.addTilesetImage(tilesetKey, tilesetKey);
    if (!tileset) {
      throw new Error(`Tileset '${tilesetKey}' not found in map '${key}'`);
    }

    // Accept both legacy names (ground, decorations) and new names (floor, furniture, interactive)
    const layerNames = [
      'floor',
      'ground',
      'walls',
      'furniture',
      'interactive',
      'decorations',
      'collision',
    ];
    for (const layerName of layerNames) {
      const layer = this.tilemap.createLayer(layerName, tileset, 0, 0);
      if (layer) {
        this.layers.set(layerName, layer);
      }
    }

    const collisionLayer = this.layers.get('collision');
    if (collisionLayer) {
      this.tilemap.setCollisionByExclusion([-1], true, true, collisionLayer);
    }

    this.parseObjectLayers();
    return this.tilemap;
  }

  private parseObjectLayers(): void {
    if (!this.tilemap) return;

    const objectLayer = this.tilemap.getObjectLayer('objects');
    if (!objectLayer) return;

    const validTypes = new Set(['player_start', 'npc', 'terminal', 'door', 'item']);

    for (const obj of objectLayer.objects) {
      const spawnType = obj.type ?? obj.name ?? '';
      if (!validTypes.has(spawnType)) continue;

      const properties: Record<string, unknown> = {};
      if (obj.properties) {
        const rawProps = obj.properties as Array<{ name: string; value: unknown }>;
        for (const prop of rawProps) {
          properties[prop.name] = prop.value;
        }
      }

      const spawnPoint: SpawnPoint = {
        type: spawnType,
        name: obj.name ?? '',
        x: obj.x ?? 0,
        y: obj.y ?? 0,
      };
      if (Object.keys(properties).length > 0) {
        spawnPoint.properties = properties;
      }
      this.spawnPoints.push(spawnPoint);
    }
  }

  getCollisionLayer(): Phaser.Tilemaps.TilemapLayer | null {
    return this.layers.get('collision') ?? null;
  }

  getSpawnPoints(): SpawnPoint[] {
    return this.spawnPoints;
  }

  destroy(): void {
    this.tilemap?.destroy();
    this.tilemap = null;
    this.layers.clear();
    this.spawnPoints = [];
  }
}
