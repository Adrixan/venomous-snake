import Phaser from 'phaser';
import type { Direction } from '@venomous-snake/shared-types';

export const PLAYER_TEXTURE_KEY = 'player_placeholder';
const PLAYER_WIDTH = 24;
const PLAYER_HEIGHT = 32;

export class Player extends Phaser.Physics.Arcade.Sprite {
  private readonly speed = 160;
  private currentDirection: Direction = 'down';
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  private wasdKeys:
    | {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
      }
    | undefined;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, PLAYER_TEXTURE_KEY);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);

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

  /** Generate a coloured rectangle placeholder texture (no sprite assets required). */
  static createPlaceholderTexture(scene: Phaser.Scene): void {
    if (scene.textures.exists(PLAYER_TEXTURE_KEY)) return;

    const gfx = scene.make.graphics({}, false);

    // Body fill
    gfx.fillStyle(0x00ff9d, 1);
    gfx.fillRect(0, 0, PLAYER_WIDTH, PLAYER_HEIGHT);

    // Direction indicator triangle (pointing down)
    gfx.fillStyle(0x007a4a, 1);
    gfx.fillTriangle(
      PLAYER_WIDTH / 2,
      PLAYER_HEIGHT - 4,
      PLAYER_WIDTH / 2 - 5,
      PLAYER_HEIGHT - 13,
      PLAYER_WIDTH / 2 + 5,
      PLAYER_HEIGHT - 13,
    );

    gfx.generateTexture(PLAYER_TEXTURE_KEY, PLAYER_WIDTH, PLAYER_HEIGHT);
    gfx.destroy();
  }

  handleInput(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    let vx = 0;
    let vy = 0;

    const left =
      this.cursors?.left.isDown === true || this.wasdKeys?.A.isDown === true;
    const right =
      this.cursors?.right.isDown === true || this.wasdKeys?.D.isDown === true;
    const up =
      this.cursors?.up.isDown === true || this.wasdKeys?.W.isDown === true;
    const down =
      this.cursors?.down.isDown === true || this.wasdKeys?.S.isDown === true;

    if (left) {
      vx = -1;
      this.currentDirection = 'left';
    } else if (right) {
      vx = 1;
      this.currentDirection = 'right';
    }

    if (up) {
      vy = -1;
      this.currentDirection = 'up';
    } else if (down) {
      vy = 1;
      this.currentDirection = 'down';
    }

    // Normalize diagonal movement to avoid faster diagonal speed
    if (vx !== 0 && vy !== 0) {
      const invSqrt2 = 0.7071067811865476;
      vx *= invSqrt2;
      vy *= invSqrt2;
    }

    body.setVelocity(vx * this.speed, vy * this.speed);
  }

  getDirection(): Direction {
    return this.currentDirection;
  }
}
