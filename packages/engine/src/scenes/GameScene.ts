import Phaser from 'phaser';
import { EventBus } from '../EventBus';

export interface GameSceneData {
  roomKey?: string;
}

export class GameScene extends Phaser.Scene {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  private playerSprite: Phaser.GameObjects.Rectangle | undefined;
  private readonly gridSize = 32;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(_data: GameSceneData): void {
    this.createTestRoom();

    this.playerSprite = this.add.rectangle(400, 300, 24, 32, 0x00ff9d);
    this.physics.add.existing(this.playerSprite);

    const body = this.playerSprite.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);

    this.cameras.main.startFollow(this.playerSprite, true, 0.1, 0.1);
    this.cameras.main.setBackgroundColor('#0a0a0f');

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    EventBus.on((event) => {
      if (event.type === 'GAME_PAUSE') {
        this.scene.pause();
      } else if (event.type === 'GAME_RESUME') {
        this.scene.resume();
      }
    });

    EventBus.emit({ type: 'SCENE_CHANGE', payload: { sceneKey: 'GameScene' } });
  }

  update(): void {
    if (!this.playerSprite || !this.cursors) return;

    const body = this.playerSprite.body as Phaser.Physics.Arcade.Body;
    const speed = 160;

    body.setVelocity(0);

    let movingX = false;
    let movingY = false;

    if (this.cursors.left.isDown) {
      body.setVelocityX(-speed);
      movingX = true;
    } else if (this.cursors.right.isDown) {
      body.setVelocityX(speed);
      movingX = true;
    }

    if (this.cursors.up.isDown) {
      body.setVelocityY(-speed);
      movingY = true;
    } else if (this.cursors.down.isDown) {
      body.setVelocityY(speed);
      movingY = true;
    }

    if (movingX && movingY) {
      body.velocity.normalize().scale(speed);
    }

    EventBus.emit({
      type: 'PLAYER_MOVE',
      payload: { x: this.playerSprite.x, y: this.playerSprite.y },
    });
  }

  private createTestRoom(): void {
    const g = this.gridSize;
    const roomWidth = 25;
    const roomHeight = 19;

    this.physics.world.setBounds(0, 0, roomWidth * g, roomHeight * g);

    for (let x = 0; x < roomWidth; x++) {
      for (let y = 0; y < roomHeight; y++) {
        const isWall = x === 0 || x === roomWidth - 1 || y === 0 || y === roomHeight - 1;
        const color = isWall ? 0x1a1a2e : 0x16213e;
        this.add.rectangle(x * g + g / 2, y * g + g / 2, g - 1, g - 1, color);
      }
    }

    const terminal = this.add.rectangle(12 * g + g / 2, 5 * g + g / 2, g, g, 0x00b4d8);
    this.physics.add.existing(terminal, true);

    const terminalZone = this.add.zone(12 * g + g / 2, 5 * g + g / 2, g * 3, g * 3);
    this.physics.add.existing(terminalZone, true);

    this.add.text(12 * g, 4 * g - 8, '[TERMINAL]', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#00b4d8',
    });
  }
}
