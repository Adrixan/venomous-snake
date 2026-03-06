import Phaser from 'phaser';
import { EventBus } from '../EventBus';
import { Player } from '../entities/Player';
import { InteractiveObject } from '../entities/InteractiveObject';
import type { InteractiveObjectType } from '../entities/InteractiveObject';
import { TilemapManager } from '../systems/TilemapManager';
import { CameraSystem } from '../systems/CameraSystem';

export interface GameSceneData {
  roomKey?: string;
}

const GRID = 32;
const ROOM_COLS = 25;
const ROOM_ROWS = 19;

export class GameScene extends Phaser.Scene {
  private player: Player | null = null;
  private tilemapManager: TilemapManager | null = null;
  private cameraSystem: CameraSystem | null = null;
  private interactiveObjects: InteractiveObject[] = [];
  private interactKey: Phaser.Input.Keyboard.Key | null = null;
  private walls: Phaser.Physics.Arcade.StaticGroup | null = null;
  private nearestInteractive: InteractiveObject | null = null;
  private unsubscribeEventBus: (() => void) | null = null;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload(): void {
    Player.createPlaceholderTexture(this);
    InteractiveObject.createPlaceholderTextures(this);
  }

  create(data: GameSceneData): void {
    let playerX = Math.floor((ROOM_COLS / 2) * GRID);
    let playerY = Math.floor((ROOM_ROWS / 2) * GRID);

    // Attempt to load a Tiled map when a room key is provided
    const roomKey = data.roomKey;
    let loadedTilemap: Phaser.Tilemaps.Tilemap | null = null;

    if (roomKey && this.cache.tilemap.has(roomKey)) {
      try {
        this.tilemapManager = new TilemapManager();
        loadedTilemap = this.tilemapManager.loadTilemap(this, roomKey, `${roomKey}_tiles`);

        const collisionLayer = this.tilemapManager.getCollisionLayer();
        const spawnPoints = this.tilemapManager.getSpawnPoints();

        const playerStart = spawnPoints.find((sp) => sp.type === 'player_start');
        if (playerStart) {
          playerX = playerStart.x;
          playerY = playerStart.y;
        }

        // Spawn interactive objects from tilemap
        for (const sp of spawnPoints) {
          const validTypes: InteractiveObjectType[] = ['terminal', 'door', 'item', 'npc'];
          const isInteractive = (t: string): t is InteractiveObjectType =>
            (validTypes as string[]).includes(t);

          if (isInteractive(sp.type)) {
            this.interactiveObjects.push(
              new InteractiveObject(this, sp.x, sp.y, sp.type, sp.properties),
            );
          }
        }

        this.player = new Player(this, playerX, playerY);

        if (collisionLayer) {
          this.physics.add.collider(this.player, collisionLayer);
        }
      } catch (err) {
        console.warn('[GameScene] Tilemap load failed, falling back to test room:', err);
        this.tilemapManager = null;
        loadedTilemap = null;
      }
    }

    // Fall back to procedural test room if no tilemap was loaded
    if (!loadedTilemap) {
      this.walls = this.createTestRoom();
      this.player = new Player(this, playerX, playerY);
      this.physics.add.collider(this.player, this.walls);
      this.spawnTestInteractives();
    }

    // Camera — player is guaranteed non-null here (created in both branches above)
    const player = this.player;
    if (player) {
      this.cameraSystem = new CameraSystem();
      this.cameraSystem.setup(this, player, loadedTilemap ?? undefined);
    }

    // Interaction key
    if (this.input.keyboard) {
      this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    this.setupEventBus();

    EventBus.emit({ type: 'SCENE_READY' });
    EventBus.emit({ type: 'SCENE_CHANGE', payload: { sceneKey: 'GameScene' } });
  }

  update(_time: number, _delta: number): void {
    this.player?.update();
    this.updateInteractiveObjects();
    this.checkInteractKey();
  }

  shutdown(): void {
    this.unsubscribeEventBus?.();
    this.unsubscribeEventBus = null;
    this.tilemapManager?.destroy();
    this.tilemapManager = null;
    this.interactiveObjects = [];
    this.nearestInteractive = null;
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private createTestRoom(): Phaser.Physics.Arcade.StaticGroup {
    this.physics.world.setBounds(0, 0, ROOM_COLS * GRID, ROOM_ROWS * GRID);

    const wallGroup = this.physics.add.staticGroup();

    for (let col = 0; col < ROOM_COLS; col++) {
      for (let row = 0; row < ROOM_ROWS; row++) {
        const isWall = col === 0 || col === ROOM_COLS - 1 || row === 0 || row === ROOM_ROWS - 1;
        const color = isWall ? 0x1a1a2e : 0x0d1b2a;
        const tile = this.add.rectangle(
          col * GRID + GRID / 2,
          row * GRID + GRID / 2,
          GRID - 1,
          GRID - 1,
          color,
        );
        if (isWall) {
          wallGroup.add(tile);
        }
      }
    }

    return wallGroup;
  }

  private spawnTestInteractives(): void {
    const cx = Math.floor(ROOM_COLS / 2);
    const cy = Math.floor(ROOM_ROWS / 2);

    const spawns: Array<[InteractiveObjectType, number, number]> = [
      ['terminal', cx - 3, cy - 3],
      ['npc', cx + 3, cy - 3],
      ['door', cx, cy + 4],
      ['item', cx + 3, cy + 3],
    ];

    for (const [type, col, row] of spawns) {
      const obj = new InteractiveObject(this, col * GRID + GRID / 2, row * GRID + GRID / 2, type);
      this.interactiveObjects.push(obj);
    }
  }

  private updateInteractiveObjects(): void {
    if (!this.player) return;
    const player = this.player;

    this.nearestInteractive = null;

    for (const obj of this.interactiveObjects) {
      const overlaps = this.physics.world.overlap(player, obj);
      obj.setPlayerInRange(overlaps);
      if (overlaps && !this.nearestInteractive) {
        this.nearestInteractive = obj;
      }
    }
  }

  private checkInteractKey(): void {
    if (
      this.interactKey &&
      Phaser.Input.Keyboard.JustDown(this.interactKey) &&
      this.nearestInteractive
    ) {
      this.nearestInteractive.interact();
    }
  }

  private setupEventBus(): void {
    this.unsubscribeEventBus = EventBus.on((event) => {
      if (event.type === 'TERMINAL_OPEN' || event.type === 'DIALOG_START') {
        this.player?.freeze();
      } else if (event.type === 'TERMINAL_CLOSE' || event.type === 'DIALOG_END') {
        this.player?.unfreeze();
      } else if (event.type === 'GAME_PAUSE') {
        this.scene.pause();
      } else if (event.type === 'GAME_RESUME') {
        this.scene.resume();
      }
    });
  }
}
