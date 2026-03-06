import Phaser from 'phaser';

const BUTTON_COLOR = 0x00b4d8;
const BUTTON_ALPHA = 0.8;
const BUTTON_DEPTH = 100;
const MARGIN = 24;
const CORNER_RADIUS = 12;

export class InteractButton {
  private readonly scene: Phaser.Scene;
  private readonly size: number;
  private readonly buttonX: number;
  private readonly buttonY: number;

  private readonly bg: Phaser.GameObjects.Graphics;
  private readonly label: Phaser.GameObjects.Text;

  private available = false;
  private justPressed = false;

  private readonly boundDown: (p: Phaser.Input.Pointer) => void;

  constructor(scene: Phaser.Scene, size = 64) {
    this.scene = scene;
    this.size = size;

    this.buttonX = scene.scale.width - MARGIN - size / 2;
    this.buttonY = scene.scale.height - MARGIN - size / 2;

    this.bg = scene.add.graphics();
    this.bg.setScrollFactor(0);
    this.bg.setDepth(BUTTON_DEPTH);
    this.bg.setAlpha(0);
    this.drawBackground();

    this.label = scene.add.text(this.buttonX, this.buttonY, 'E', {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#ffffff',
    });
    this.label.setOrigin(0.5, 0.5);
    this.label.setScrollFactor(0);
    this.label.setDepth(BUTTON_DEPTH + 1);
    this.label.setAlpha(0);

    this.boundDown = this.onPointerDown.bind(this);
    scene.input.on('pointerdown', this.boundDown);
  }

  /** Show or hide the button based on whether an interaction target is nearby. */
  setAvailable(available: boolean): void {
    if (available === this.available) return;
    this.available = available;
    const alpha = available ? BUTTON_ALPHA : 0;
    this.bg.setAlpha(alpha);
    this.label.setAlpha(alpha);
  }

  /** Returns true once per press, consuming the press state. */
  consumePress(): boolean {
    if (this.justPressed) {
      this.justPressed = false;
      return true;
    }
    return false;
  }

  destroy(): void {
    this.scene.input.off('pointerdown', this.boundDown);
    this.bg.destroy();
    this.label.destroy();
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (!this.available) return;
    const half = this.size / 2;
    const inX = pointer.x >= this.buttonX - half && pointer.x <= this.buttonX + half;
    const inY = pointer.y >= this.buttonY - half && pointer.y <= this.buttonY + half;
    if (inX && inY) {
      this.justPressed = true;
    }
  }

  private drawBackground(): void {
    const half = this.size / 2;
    this.bg.fillStyle(BUTTON_COLOR, 1);
    this.bg.fillRoundedRect(
      this.buttonX - half,
      this.buttonY - half,
      this.size,
      this.size,
      CORNER_RADIUS,
    );
    this.bg.lineStyle(2, 0xffffff, 0.3);
    this.bg.strokeRoundedRect(
      this.buttonX - half,
      this.buttonY - half,
      this.size,
      this.size,
      CORNER_RADIUS,
    );
  }
}
