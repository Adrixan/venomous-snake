import Phaser from 'phaser';
import type { Direction } from '@venomous-snake/shared-types';
import { EventBus } from '../EventBus';
import type { InputManager } from '../input/InputManager';

export class Player extends Phaser.Physics.Arcade.Sprite {
  static readonly TEXTURE_KEY = 'player_placeholder';

  private readonly speed = 160;
  private frozen = false;
  private direction: Direction = 'down';
  private readonly inputManager: InputManager;

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

  constructor(scene: Phaser.Scene, x: number, y: number, inputManager: InputManager) {
    super(scene, x, y, Player.TEXTURE_KEY);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setSize(20, 28);

    this.inputManager = inputManager;
  }

  update(): void {
    if (this.frozen) return;

    const body = this.body as Phaser.Physics.Arcade.Body;
    const movement = this.inputManager.getMovement();

    body.setVelocity(movement.x * this.speed, movement.y * this.speed);

    // Update facing direction; vertical overrides horizontal when moving diagonally
    if (movement.x < -0.1) this.direction = 'left';
    else if (movement.x > 0.1) this.direction = 'right';
    if (movement.y < -0.1) this.direction = 'up';
    else if (movement.y > 0.1) this.direction = 'down';

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
