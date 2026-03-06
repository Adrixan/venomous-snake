import Phaser from 'phaser';
import { EventBus } from '../EventBus';

export type NPCBehavior = 'idle' | 'patrol' | 'wander' | 'guard';

export interface NPCConfig {
  id: string;
  name: string;
  behavior: NPCBehavior;
  dialogId?: string;
  patrolPath?: Array<{ x: number; y: number }>;
  patrolSpeed?: number;
  interactionRange?: number;
  blocksPath?: boolean;
  tint?: number;
}

const DEFAULT_INTERACTION_RANGE = 48;
const DEFAULT_PATROL_SPEED = 60;
const DEFAULT_WANDER_RADIUS = 80;
const NPC_WIDTH = 22;
const NPC_HEIGHT = 30;

export class NPC extends Phaser.Physics.Arcade.Sprite {
  static readonly TEXTURE_KEY = 'npc_placeholder';

  private readonly npcId: string;
  private readonly dialogId: string | undefined;
  private readonly behavior: NPCBehavior;
  private readonly patrolPath: Array<{ x: number; y: number }>;
  private readonly patrolSpeed: number;
  private readonly interactionRange: number;

  private nameLabel: Phaser.GameObjects.Text | null = null;
  private speechBubble: Phaser.GameObjects.Text | null = null;
  private frozen = false;
  private inRange = false;

  // Patrol state
  private patrolIndex = 0;
  private patrolDirection = 1;

  // Wander state
  private readonly wanderOriginX: number;
  private readonly wanderOriginY: number;
  private wanderTimer = 0;
  private wanderTargetX = 0;
  private wanderTargetY = 0;
  private isWandering = false;

  static createPlaceholderTexture(scene: Phaser.Scene): void {
    if (scene.textures.exists(NPC.TEXTURE_KEY)) return;
    const gfx = scene.make.graphics({}, false);
    NPC._drawNPCBody(gfx, 0x4488aa);
    gfx.generateTexture(NPC.TEXTURE_KEY, NPC_WIDTH, NPC_HEIGHT);
    gfx.destroy();
  }

  /** Draw a corporate/guard silhouette. `accentColor` tints badge and collar only. */
  private static _drawNPCBody(gfx: Phaser.GameObjects.Graphics, accentColor: number): void {
    // Legs
    gfx.fillStyle(0x1e2030, 1);
    gfx.fillRect(3, 20, 7, 10); // left leg
    gfx.fillRect(12, 20, 7, 10); // right leg
    // Boot toes
    gfx.fillStyle(0x0d0d1a, 1);
    gfx.fillRect(3, 28, 7, 2);
    gfx.fillRect(12, 28, 7, 2);

    // Suit / torso
    gfx.fillStyle(0x1a2035, 1);
    gfx.fillRect(3, 8, 16, 12);
    // Lapel gap (lighter inner strip)
    gfx.fillStyle(0x2d3555, 1);
    gfx.fillRect(9, 9, 4, 10);

    // Head / mask
    gfx.fillStyle(0x2a2a3e, 1);
    gfx.fillRoundedRect(6, 1, 10, 7, 2);
    // Face visor (dark reflective strip)
    gfx.fillStyle(0x3a3a5e, 1);
    gfx.fillRect(6, 3, 10, 3);

    // Accent: collar glow at neckline
    gfx.fillStyle(accentColor, 0.8);
    gfx.fillRect(9, 8, 4, 1);
    // Accent: ID badge on left chest
    gfx.fillStyle(accentColor, 1);
    gfx.fillRect(5, 12, 4, 3);
  }

  constructor(scene: Phaser.Scene, x: number, y: number, config: NPCConfig) {
    // Create per-NPC texture for custom tint before calling super
    const textureKey = config.tint !== undefined ? `npc_${config.id}` : NPC.TEXTURE_KEY;

    if (config.tint !== undefined && !scene.textures.exists(textureKey)) {
      const gfx = scene.make.graphics({}, false);
      NPC._drawNPCBody(gfx, config.tint);
      gfx.generateTexture(textureKey, NPC_WIDTH, NPC_HEIGHT);
      gfx.destroy();
    }

    super(scene, x, y, textureKey);

    this.npcId = config.id;
    this.dialogId = config.dialogId;
    this.behavior = config.behavior;
    this.patrolPath = config.patrolPath ?? [];
    this.patrolSpeed = config.patrolSpeed ?? DEFAULT_PATROL_SPEED;
    this.interactionRange = config.interactionRange ?? DEFAULT_INTERACTION_RANGE;
    this.wanderOriginX = x;
    this.wanderOriginY = y;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    if (config.blocksPath === true) {
      body.setImmovable(true);
    }

    this.nameLabel = scene.add.text(x, y - 22, config.name, {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#ffffff',
      backgroundColor: '#000000bb',
      padding: { x: 3, y: 2 },
    });
    this.nameLabel.setOrigin(0.5, 1);
    this.nameLabel.setDepth(10);

    this.speechBubble = scene.add.text(x, y - 34, '[TALK]', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#c77dff',
      backgroundColor: '#000000bb',
      padding: { x: 3, y: 2 },
    });
    this.speechBubble.setOrigin(0.5, 1);
    this.speechBubble.setDepth(11);
    this.speechBubble.setVisible(false);
  }

  /** Call each frame from GameScene, passing the current player position. */
  update(delta: number, playerX: number, playerY: number): void {
    if (this.frozen) {
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(0, 0);
      this.syncLabels();
      return;
    }

    const dist = Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY);
    const wasInRange = this.inRange;
    this.inRange = dist <= this.interactionRange;

    if (this.inRange !== wasInRange) {
      this.speechBubble?.setVisible(this.inRange && this.dialogId !== undefined);
    }

    switch (this.behavior) {
      case 'idle':
        this.runIdle();
        break;
      case 'patrol':
        this.runPatrol();
        break;
      case 'wander':
        this.runWander(delta);
        break;
      case 'guard':
        this.runGuard();
        break;
    }

    this.syncLabels();
  }

  interact(): void {
    const payload: { npcId: string; dialogId?: string } = { npcId: this.npcId };
    if (this.dialogId !== undefined) {
      payload.dialogId = this.dialogId;
    }
    EventBus.emit({ type: 'DIALOG_START', payload });
  }

  isPlayerInRange(): boolean {
    return this.inRange;
  }

  freeze(): void {
    this.frozen = true;
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
  }

  unfreeze(): void {
    this.frozen = false;
  }

  override destroy(fromScene?: boolean): void {
    this.nameLabel?.destroy();
    this.nameLabel = null;
    this.speechBubble?.destroy();
    this.speechBubble = null;
    super.destroy(fromScene);
  }

  // ---------------------------------------------------------------------------
  // Behavior implementations
  // ---------------------------------------------------------------------------

  private runIdle(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
  }

  private runPatrol(): void {
    if (this.patrolPath.length < 2) {
      this.runIdle();
      return;
    }

    const target = this.patrolPath[this.patrolIndex];
    if (target === undefined) {
      this.runIdle();
      return;
    }

    const dist = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
    const body = this.body as Phaser.Physics.Arcade.Body;

    if (dist < 4) {
      body.setVelocity(0, 0);
      const nextIndex = this.patrolIndex + this.patrolDirection;
      if (nextIndex >= this.patrolPath.length) {
        this.patrolDirection = -1;
        this.patrolIndex = this.patrolPath.length - 2;
      } else if (nextIndex < 0) {
        this.patrolDirection = 1;
        this.patrolIndex = 1;
      } else {
        this.patrolIndex = nextIndex;
      }
    } else {
      const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
      body.setVelocity(Math.cos(angle) * this.patrolSpeed, Math.sin(angle) * this.patrolSpeed);
    }
  }

  private runWander(delta: number): void {
    this.wanderTimer -= delta;

    if (!this.isWandering || this.wanderTimer <= 0) {
      this.pickWanderTarget();
    }

    const dist = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.wanderTargetX,
      this.wanderTargetY,
    );
    const body = this.body as Phaser.Physics.Arcade.Body;

    if (dist < 6) {
      this.isWandering = false;
      body.setVelocity(0, 0);
      this.wanderTimer = 1000 + Math.random() * 2000;
    } else {
      const speed = this.patrolSpeed * 0.6;
      const angle = Phaser.Math.Angle.Between(
        this.x,
        this.y,
        this.wanderTargetX,
        this.wanderTargetY,
      );
      body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    }
  }

  private pickWanderTarget(): void {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * DEFAULT_WANDER_RADIUS;
    this.wanderTargetX = this.wanderOriginX + Math.cos(angle) * radius;
    this.wanderTargetY = this.wanderOriginY + Math.sin(angle) * radius;
    this.isWandering = true;
    this.wanderTimer = 5000;
  }

  private runGuard(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
  }

  private syncLabels(): void {
    this.nameLabel?.setPosition(this.x, this.y - 18);
    this.speechBubble?.setPosition(this.x, this.y - 30);
  }
}
