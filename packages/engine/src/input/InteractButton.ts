import Phaser from 'phaser';

const BUTTON_COLOR = 0x00b4d8;
const BUTTON_ALPHA = 0.8;
const BUTTON_DEPTH = 300;
const MARGIN = 24;

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

    const zoom = scene.cameras.main.zoom || 1;
    this.buttonX = scene.scale.width / zoom - MARGIN - size / 2;
    this.buttonY = scene.scale.height / zoom - MARGIN - size / 2;

    this.bg = scene.add.graphics();
    this.bg.setScrollFactor(0);
    this.bg.setDepth(BUTTON_DEPTH);
    this.bg.setAlpha(0);
    this.drawBackground();

    this.label = scene.add.text(this.buttonX, this.buttonY, 'E', {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#ffffff',
      stroke: '#00b4d8',
      strokeThickness: 4,
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
    const zoom = this.scene.cameras.main.zoom || 1;
    const px = pointer.x / zoom;
    const py = pointer.y / zoom;
    const inX = px >= this.buttonX - half && px <= this.buttonX + half;
    const inY = py >= this.buttonY - half && py <= this.buttonY + half;
    if (inX && inY) {
      this.justPressed = true;
    }
  }

  private drawBackground(): void {
    const half = this.size / 2;
    const x = this.buttonX;
    const y = this.buttonY;
    const cut = 12; // diagonal corner cut for octagonal silhouette

    const pts = [
      { x: x - half + cut, y: y - half },
      { x: x + half - cut, y: y - half },
      { x: x + half, y: y - half + cut },
      { x: x + half, y: y + half - cut },
      { x: x + half - cut, y: y + half },
      { x: x - half + cut, y: y + half },
      { x: x - half, y: y + half - cut },
      { x: x - half, y: y - half + cut },
    ];

    // Dark fill
    this.bg.fillStyle(0x0a0a1a, 0.92);
    this.bg.fillPoints(pts, true);

    // Scanline pattern (very faint)
    this.bg.fillStyle(BUTTON_COLOR, 0.04);
    for (let i = -half; i <= half; i += 5) {
      this.bg.fillRect(x - half, y + i, this.size, 2);
    }

    // Outer faded glow border
    this.bg.lineStyle(5, BUTTON_COLOR, 0.2);
    this.bg.strokePoints(pts, true);

    // Inner bright border
    this.bg.lineStyle(2, BUTTON_COLOR, 0.9);
    this.bg.strokePoints(pts, true);

    // Corner HUD bracket accents (inside each corner)
    const bi = 8; // inset from edge
    const bLen = 9; // bracket arm length
    this.bg.lineStyle(2, BUTTON_COLOR, 0.75);

    // Top-left
    this.bg.beginPath();
    this.bg.moveTo(x - half + bi + bLen, y - half + bi);
    this.bg.lineTo(x - half + bi, y - half + bi);
    this.bg.lineTo(x - half + bi, y - half + bi + bLen);
    this.bg.strokePath();

    // Top-right
    this.bg.beginPath();
    this.bg.moveTo(x + half - bi - bLen, y - half + bi);
    this.bg.lineTo(x + half - bi, y - half + bi);
    this.bg.lineTo(x + half - bi, y - half + bi + bLen);
    this.bg.strokePath();

    // Bottom-right
    this.bg.beginPath();
    this.bg.moveTo(x + half - bi, y + half - bi - bLen);
    this.bg.lineTo(x + half - bi, y + half - bi);
    this.bg.lineTo(x + half - bi - bLen, y + half - bi);
    this.bg.strokePath();

    // Bottom-left
    this.bg.beginPath();
    this.bg.moveTo(x - half + bi + bLen, y + half - bi);
    this.bg.lineTo(x - half + bi, y + half - bi);
    this.bg.lineTo(x - half + bi, y + half - bi - bLen);
    this.bg.strokePath();
  }
}
