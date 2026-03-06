import Phaser from 'phaser';

export interface JoystickOutput {
  x: number;
  y: number;
}

const OUTER_COLOR = 0x00ff9d;
const THUMB_COLOR = 0x00ff9d;
const OUTER_ALPHA = 0.25;
const THUMB_ALPHA = 0.5;
const RING_ALPHA = 0.5;
const JOYSTICK_DEPTH = 100;

export class VirtualJoystick {
  private readonly scene: Phaser.Scene;
  private readonly outerRadius: number;
  private readonly thumbRadius: number;

  private readonly outer: Phaser.GameObjects.Graphics;
  private readonly thumb: Phaser.GameObjects.Graphics;

  private active = false;
  private pointerId = -1;
  private baseX = 0;
  private baseY = 0;
  private outputX = 0;
  private outputY = 0;

  // Bound handlers stored for clean removal
  private readonly boundDown: (p: Phaser.Input.Pointer) => void;
  private readonly boundMove: (p: Phaser.Input.Pointer) => void;
  private readonly boundUp: (p: Phaser.Input.Pointer) => void;

  constructor(scene: Phaser.Scene, outerRadius = 60, thumbRadius = 25) {
    this.scene = scene;
    this.outerRadius = outerRadius;
    this.thumbRadius = thumbRadius;

    this.outer = scene.add.graphics();
    this.outer.setScrollFactor(0);
    this.outer.setDepth(JOYSTICK_DEPTH);
    this.outer.setAlpha(0);

    this.thumb = scene.add.graphics();
    this.thumb.setScrollFactor(0);
    this.thumb.setDepth(JOYSTICK_DEPTH + 1);
    this.thumb.setAlpha(0);

    this.boundDown = this.onPointerDown.bind(this);
    this.boundMove = this.onPointerMove.bind(this);
    this.boundUp = this.onPointerUp.bind(this);

    scene.input.on('pointerdown', this.boundDown);
    scene.input.on('pointermove', this.boundMove);
    scene.input.on('pointerup', this.boundUp);
    scene.input.on('pointerupoutside', this.boundUp);
  }

  getOutput(): JoystickOutput {
    return { x: this.outputX, y: this.outputY };
  }

  isActive(): boolean {
    return this.active;
  }

  destroy(): void {
    this.scene.input.off('pointerdown', this.boundDown);
    this.scene.input.off('pointermove', this.boundMove);
    this.scene.input.off('pointerup', this.boundUp);
    this.scene.input.off('pointerupoutside', this.boundUp);
    this.outer.destroy();
    this.thumb.destroy();
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (this.active) return;
    // Only activate for left half of screen
    if (pointer.x > this.scene.scale.width / 2) return;

    this.active = true;
    this.pointerId = pointer.id;
    this.baseX = pointer.x;
    this.baseY = pointer.y;
    this.outputX = 0;
    this.outputY = 0;

    this.outer.setAlpha(1);
    this.thumb.setAlpha(1);
    this.redrawOuter(this.baseX, this.baseY);
    this.redrawThumb(this.baseX, this.baseY);
  }

  private onPointerMove(pointer: Phaser.Input.Pointer): void {
    if (!this.active || pointer.id !== this.pointerId) return;

    const dx = pointer.x - this.baseX;
    const dy = pointer.y - this.baseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = this.outerRadius - this.thumbRadius;
    const clampedDist = Math.min(dist, maxDist);
    const angle = Math.atan2(dy, dx);

    const thumbX = this.baseX + Math.cos(angle) * clampedDist;
    const thumbY = this.baseY + Math.sin(angle) * clampedDist;
    this.redrawThumb(thumbX, thumbY);

    if (dist > 4) {
      const magnitude = Math.min(dist / maxDist, 1);
      this.outputX = (dx / dist) * magnitude;
      this.outputY = (dy / dist) * magnitude;
    } else {
      this.outputX = 0;
      this.outputY = 0;
    }
  }

  private onPointerUp(pointer: Phaser.Input.Pointer): void {
    if (pointer.id !== this.pointerId) return;
    this.active = false;
    this.pointerId = -1;
    this.outputX = 0;
    this.outputY = 0;
    this.outer.setAlpha(0);
    this.thumb.setAlpha(0);
  }

  private redrawOuter(x: number, y: number): void {
    this.outer.clear();
    this.outer.fillStyle(OUTER_COLOR, OUTER_ALPHA);
    this.outer.fillCircle(x, y, this.outerRadius);
    this.outer.lineStyle(2, OUTER_COLOR, RING_ALPHA);
    this.outer.strokeCircle(x, y, this.outerRadius);
  }

  private redrawThumb(x: number, y: number): void {
    this.thumb.clear();
    this.thumb.fillStyle(THUMB_COLOR, THUMB_ALPHA);
    this.thumb.fillCircle(x, y, this.thumbRadius);
  }
}
