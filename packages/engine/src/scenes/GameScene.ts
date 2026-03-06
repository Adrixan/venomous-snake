import Phaser from 'phaser';
import { EventBus } from '../EventBus';
import { Player } from '../entities/Player';
import { InteractiveObject } from '../entities/InteractiveObject';
import type { InteractiveObjectType } from '../entities/InteractiveObject';
import { NPC } from '../entities/NPC';
import type { NPCBehavior } from '../entities/NPC';
import { InputManager } from '../input/InputManager';
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
  private npcs: NPC[] = [];
  private inputManager: InputManager | null = null;
  private walls: Phaser.Physics.Arcade.StaticGroup | null = null;
  private nearestInteractive: InteractiveObject | null = null;
  private nearestNPC: NPC | null = null;
  private unsubscribeEventBus: (() => void) | null = null;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload(): void {
    Player.createPlaceholderTexture(this);
    InteractiveObject.createPlaceholderTextures(this);
    NPC.createPlaceholderTexture(this);
  }

  create(data: GameSceneData): void {
    let playerX = Math.floor((ROOM_COLS / 2) * GRID);
    let playerY = Math.floor((ROOM_ROWS / 2) * GRID);

    // Create InputManager before Player (Player depends on it)
    this.inputManager = new InputManager(this);

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

        const validInteractiveTypes: InteractiveObjectType[] = ['terminal', 'door', 'item'];
        const isInteractiveType = (t: string): t is InteractiveObjectType =>
          (validInteractiveTypes as string[]).includes(t);
        const validNPCBehaviors = new Set<string>(['idle', 'patrol', 'wander', 'guard']);
        const isNPCBehavior = (s: unknown): s is NPCBehavior =>
          typeof s === 'string' && validNPCBehaviors.has(s);

        // Spawn entities from tilemap object layer
        for (const sp of spawnPoints) {
          if (sp.type === 'npc') {
            const props = sp.properties ?? {};
            const rawBehavior = props['behavior'];
            const behavior: NPCBehavior = isNPCBehavior(rawBehavior) ? rawBehavior : 'idle';
            const npcId =
              typeof props['npcId'] === 'string' ? props['npcId'] : sp.name || `npc_${sp.x}`;
            const rawDialog = props['dialogId'];
            const dialogId = typeof rawDialog === 'string' ? rawDialog : undefined;
            const npcName = sp.name || npcId;
            const npcConfig =
              dialogId !== undefined
                ? { id: npcId, name: npcName, behavior, dialogId }
                : { id: npcId, name: npcName, behavior };
            this.npcs.push(new NPC(this, sp.x, sp.y, npcConfig));
            continue;
          }

          if (isInteractiveType(sp.type)) {
            this.interactiveObjects.push(
              new InteractiveObject(this, sp.x, sp.y, sp.type, sp.properties),
            );
          }
        }

        this.player = new Player(this, playerX, playerY, this.inputManager);

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
      this.player = new Player(this, playerX, playerY, this.inputManager);
      this.physics.add.collider(this.player, this.walls);
      this.spawnTestInteractives();
      this.spawnTestNPCs();
    }

    // Camera — player is guaranteed non-null here (created in both branches above)
    const player = this.player;
    if (player) {
      this.cameraSystem = new CameraSystem();
      this.cameraSystem.setup(this, player, loadedTilemap ?? undefined);
    }

    this.setupEventBus();

    EventBus.emit({ type: 'SCENE_READY' });
    EventBus.emit({ type: 'SCENE_CHANGE', payload: { sceneKey: 'GameScene' } });
  }

  update(_time: number, delta: number): void {
    this.player?.update();
    this.updateInteractiveObjects();
    this.updateNPCs(delta);
    this.inputManager?.setInteractAvailable(
      this.nearestInteractive !== null || this.nearestNPC !== null,
    );
    this.checkInteractKey();
  }

  shutdown(): void {
    this.unsubscribeEventBus?.();
    this.unsubscribeEventBus = null;
    this.tilemapManager?.destroy();
    this.tilemapManager = null;
    this.inputManager?.destroy();
    this.inputManager = null;
    this.interactiveObjects = [];
    this.nearestInteractive = null;
    for (const npc of this.npcs) {
      npc.destroy();
    }
    this.npcs = [];
    this.nearestNPC = null;
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
      ['door', cx, cy + 4],
      ['item', cx + 3, cy + 3],
    ];

    for (const [type, col, row] of spawns) {
      const obj = new InteractiveObject(this, col * GRID + GRID / 2, row * GRID + GRID / 2, type);
      this.interactiveObjects.push(obj);
    }
  }

  private spawnTestNPCs(): void {
    const cx = Math.floor(ROOM_COLS / 2);
    const cy = Math.floor(ROOM_ROWS / 2);

    // Idle NPC — stands near the top-right
    this.npcs.push(
      new NPC(this, (cx + 3) * GRID + GRID / 2, (cy - 3) * GRID + GRID / 2, {
        id: 'guard_01',
        name: 'Guard',
        behavior: 'idle',
        dialogId: 'dialog_guard',
        blocksPath: true,
      }),
    );

    // Patrolling NPC — walks left/right near the bottom
    this.npcs.push(
      new NPC(this, (cx - 3) * GRID + GRID / 2, (cy + 3) * GRID + GRID / 2, {
        id: 'scientist_01',
        name: 'Dr. Silva',
        behavior: 'patrol',
        dialogId: 'dialog_scientist',
        patrolPath: [
          { x: (cx - 5) * GRID + GRID / 2, y: (cy + 3) * GRID + GRID / 2 },
          { x: (cx - 1) * GRID + GRID / 2, y: (cy + 3) * GRID + GRID / 2 },
        ],
        tint: 0x90e0ef,
      }),
    );
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

  private updateNPCs(delta: number): void {
    if (!this.player) return;
    const player = this.player;

    this.nearestNPC = null;

    for (const npc of this.npcs) {
      npc.update(delta, player.x, player.y);
      if (npc.isPlayerInRange() && this.nearestNPC === null) {
        this.nearestNPC = npc;
      }
    }
  }

  private checkInteractKey(): void {
    if (!this.inputManager?.isInteracting()) return;

    if (this.nearestInteractive) {
      this.nearestInteractive.interact();
    } else if (this.nearestNPC) {
      this.nearestNPC.interact();
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
