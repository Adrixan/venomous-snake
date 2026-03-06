import Phaser from 'phaser';
import type { Direction } from '@venomous-snake/shared-types';
import { EventBus } from '../EventBus';

interface WASDKeys {
  W: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  static readonly TEXTURE_KEY = 'player_placeholder';

  private readonly speed = 160;
  private frozen = false;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private wasdKeys: WASDKeys | null = null;
  private direction: Direction = 'down';

  /** Generate a placeholder texture (call during scene preload or before first use). */
  static createPlaceholderTexture(scene: Phaser.Scene): void {
    if (scene.textures.exists(Player.TEXTURE_KEY)) return;

    const gfx = scene.make.graphics({}, false);
    gfx.fillStyle(0x00ff9d, 1);
    gfx.fillRect(0, 0, 24, 32);
    // Direction indicator at top
    gfx.fillStyle(0x007a4a, 1);
    gfx.fillRect(8, 0, 8, 6);
    gfx.generateTexture(Player.TEXTURE_KEY, 24, 32);
    gfx.destroy();
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, Player.TEXTURE_KEY);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setSize(20, 28);

    const kb = scene.input.keyboard;
    if (kb) {
      this.cursors = kb.createCursorKeys();
      this.wasdKeys = {
        W: kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
    }
  }

  update(): void {
    if (this.frozen || !this.cursors || !this.wasdKeys) return;

    const body = this.body as Phaser.Physics.Arcade.Body;

    let vx = 0;
    let vy = 0;

    const left = this.cursors.left.isDown || this.wasdKeys.A.isDown;
    const right = this.cursors.right.isDown || this.wasdKeys.D.isDown;
    const up = this.cursors.up.isDown || this.wasdKeys.W.isDown;
    const down = this.cursors.down.isDown || this.wasdKeys.S.isDown;

    if (left) {
      vx = -1;
      this.direction = 'left';
    } else if (right) {
      vx = 1;
      this.direction = 'right';
    }

    if (up) {
      vy = -1;
      this.direction = 'up';
    } else if (down) {
      vy = 1;
      this.direction = 'down';
    }

    // Normalize diagonal movement to avoid faster diagonal speed
    if (vx !== 0 && vy !== 0) {
      const invSqrt2 = 0.7071067811865476;
      vx *= invSqrt2;
      vy *= invSqrt2;
    }

    body.setVelocity(vx * this.speed, vy * this.speed);

    EventBus.emit({
      type: 'PLAYER_MOVE',
      payload: { x: this.x, y: this.y, direction: this.direction },
    });
  }

  freeze(): void {
    this.frozen = true;
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);
  }

  unfreeze(): void {
    this.frozen = false;
  }

  getDirection(): Direction {
    return this.direction;
  }
}
