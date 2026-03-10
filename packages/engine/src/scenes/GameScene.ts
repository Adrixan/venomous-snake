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
import { getFloorTilemap } from '../maps/FloorRegistry';
import { LOBBY_TILESET_KEY } from '../maps/TilesetGenerator';
import { TransitionManager } from '../systems/TransitionManager';
import { ParticleManager } from '../systems/ParticleManager';

export interface GameSceneData {
  roomKey?: string;
}

interface LightSource {
  x: number;
  y: number;
  color: number;
  radius: number;
}

const GRID = 32;
const ROOM_COLS = 25;
const ROOM_ROWS = 19;

export class GameScene extends Phaser.Scene {
  private player: Player | null = null;
  private tilemapManager: TilemapManager | null = null;
  private cameraSystem: CameraSystem | null = null;
  private transitionManager: TransitionManager | null = null;
  private particleManager: ParticleManager | null = null;
  private interactiveObjects: InteractiveObject[] = [];
  private npcs: NPC[] = [];
  private inputManager: InputManager | null = null;
  private walls: Phaser.Physics.Arcade.StaticGroup | null = null;
  private nearestInteractive: InteractiveObject | null = null;
  private nearestNPC: NPC | null = null;
  private unsubscribeEventBus: (() => void) | null = null;
  private roomKey: string | undefined;
  private currentFloor = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  // Phaser calls init() before preload()/create() — including on scene.restart().
  // Storing roomKey here guarantees create() always has it even if Phaser's data
  // forwarding to create() is unreliable across restart cycles.
  init(data: GameSceneData): void {
    this.roomKey = data.roomKey;
    if (data.roomKey) {
      const match = /\d+/.exec(data.roomKey);
      this.currentFloor = match ? parseInt(match[0], 10) : 0;
    }
  }

  preload(): void {
    Player.createPlaceholderTexture(this);
    InteractiveObject.createPlaceholderTextures(this);
    NPC.createPlaceholderTexture(this);
  }

  create(data: GameSceneData): void {
    // Reset camera effects from previous scene lifecycle
    this.cameras.main.resetFX();

    let playerX = Math.floor((ROOM_COLS / 2) * GRID);
    let playerY = Math.floor((ROOM_ROWS / 2) * GRID);

    // Create InputManager before Player (Player depends on it)
    this.inputManager = new InputManager(this);

    // Attempt to load a Tiled map when a room key is provided
    const roomKey = this.roomKey ?? data.roomKey;
    let loadedTilemap: Phaser.Tilemaps.Tilemap | null = null;

    if (roomKey && this.cache.tilemap.has(roomKey)) {
      try {
        this.tilemapManager = new TilemapManager();
        loadedTilemap = this.tilemapManager.loadTilemap(this, roomKey, LOBBY_TILESET_KEY);

        const collisionLayer = this.tilemapManager.getCollisionLayer();
        const spawnPoints = this.tilemapManager.getSpawnPoints();

        const playerStart = spawnPoints.find((sp) => sp.type === 'player_start');
        if (playerStart) {
          playerX = playerStart.x;
          playerY = playerStart.y;
        }

        const validInteractiveTypes: InteractiveObjectType[] = [
          'terminal',
          'door',
          'item',
          'elevator',
        ];
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
            const propsWithName: Record<string, unknown> = {
              name: sp.name,
              ...(sp.properties ?? {}),
            };
            this.interactiveObjects.push(
              new InteractiveObject(this, sp.x, sp.y, sp.type, propsWithName),
            );
          }
        }

        this.player = new Player(this, playerX, playerY, this.inputManager);

        if (collisionLayer) {
          this.physics.add.collider(this.player, collisionLayer);
        }
      } catch (err) {
        console.error('[GameScene] Tilemap load failed for key:', roomKey, err);
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

    // Transition and particle managers
    this.transitionManager = new TransitionManager();
    this.particleManager = new ParticleManager();
    this.particleManager.attach(this);

    // Ambient dust particles (very sparse background effect)
    this.particleManager.addAmbientDust();

    // Terminal spark emitters for each terminal interactive object
    for (const obj of this.interactiveObjects) {
      if (obj.objectType === 'terminal') {
        this.particleManager.addTerminalSparks(obj.x, obj.y);
      }
    }

    // Ambient light pools around interactive objects (world-space glow)
    this.createAmbientLighting([
      ...this.interactiveObjects
        .filter((o) => o.objectType === 'terminal')
        .map((o) => ({ x: o.x, y: o.y, color: 0x00ff41 as number, radius: 48 })),
      ...this.interactiveObjects
        .filter((o) => o.objectType === 'door')
        .map((o) => ({ x: o.x, y: o.y, color: 0x00e5ff as number, radius: 40 })),
    ]);

    // Vignette overlay fixed to the camera (drawn after world content)
    this.createVignetteOverlay();

    this.setupEventBus();

    EventBus.emit({ type: 'SCENE_READY' });
    EventBus.emit({ type: 'SCENE_CHANGE', payload: { sceneKey: 'GameScene' } });

    // Fade in on every scene start (covers both fresh loads and floor transitions)
    this.cameras.main.fadeIn(400, 0, 0, 0);

    // Notify the React layer that the floor transition completed
    EventBus.emit({ type: 'FLOOR_ARRIVED', payload: { floor: this.currentFloor } });

    // Safety net: ensure camera is visible after 1 second regardless of fade state
    this.time.delayedCall(1000, () => {
      if (this.cameras.main.alpha < 1) {
        this.cameras.main.setAlpha(1);
      }
    });
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
    this.transitionManager?.destroy();
    this.transitionManager = null;
    this.particleManager?.destroy();
    this.particleManager = null;
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
        dialogId: 'guard_torres',
        blocksPath: true,
      }),
    );

    // Patrolling NPC — walks left/right near the bottom
    this.npcs.push(
      new NPC(this, (cx - 3) * GRID + GRID / 2, (cy + 3) * GRID + GRID / 2, {
        id: 'scientist_01',
        name: 'Dr. Silva',
        behavior: 'patrol',
        dialogId: 'dr_silva',
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
    // Don't process interactions while the player is frozen (dialog/terminal open)
    if (this.player?.isFrozen()) return;
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
      } else if (event.type === 'ITEM_PICKUP') {
        // Remove destroyed item objects from the tracked list
        this.interactiveObjects = this.interactiveObjects.filter((obj) => obj.active);
      } else if (event.type === 'FLOOR_CHANGE') {
        const { targetFloor } = event.payload;
        const tilemapDef = getFloorTilemap(targetFloor);
        if (tilemapDef === null) {
          // Floor not yet implemented — show message and stay
          const msg = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Floor under construction...',
            { fontFamily: 'monospace', fontSize: '14px', color: '#ffb454' },
          );
          msg.setOrigin(0.5).setScrollFactor(0).setDepth(300);
          this.time.delayedCall(2000, () => msg.destroy());
          return;
        }
        console.log('[GameScene] Floor transition to:', tilemapDef.mapKey);
        this.player?.freeze();
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
          this.scene.restart({ roomKey: tilemapDef.mapKey });
        });
      } else if (event.type === 'CHALLENGE_RESULT') {
        const player = this.player;
        if (event.payload.passed) {
          // Camera shake + particle burst near the player on success
          if (player) {
            this.particleManager?.successShake();
            this.particleManager?.burstChallengeSuccess(player.x, player.y);
          }
        } else {
          // Red vignette flash on failure
          this.particleManager?.failureFlash();
        }
      }
    });
  }

  /** Draws semi-transparent light pools at world positions (depth 3, scrolls with map). */
  private createAmbientLighting(lightSources: LightSource[]): void {
    if (lightSources.length === 0) return;
    const gfx = this.add.graphics();
    gfx.setDepth(3);
    for (const { x, y, color, radius } of lightSources) {
      gfx.fillStyle(color, 0.04);
      gfx.fillCircle(x, y, radius * 1.5);
      gfx.fillStyle(color, 0.07);
      gfx.fillCircle(x, y, radius);
      gfx.fillStyle(color, 0.13);
      gfx.fillCircle(x, y, radius * 0.5);
    }
  }

  /** Creates a camera-fixed vignette texture and overlays it at the top of the stack. */
  private createVignetteOverlay(): void {
    const w = this.scale.width;
    const h = this.scale.height;
    const key = '__vignette__';
    if (!this.textures.exists(key)) {
      const ct = this.textures.createCanvas(key, w, h);
      if (!ct) return;
      const ctx = ct.getContext();
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.sqrt(cx * cx + cy * cy);
      const grad = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius * 1.1);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.65, 'rgba(0,0,0,0.18)');
      grad.addColorStop(1, 'rgba(0,0,0,0.62)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ct.refresh();
    }
    const img = this.add.image(w / 2, h / 2, key);
    img.setScrollFactor(0);
    img.setDepth(200);
  }
}
