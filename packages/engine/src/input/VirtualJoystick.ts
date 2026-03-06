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
const GHOST_ALPHA = 0.15;
const JOYSTICK_DEPTH = 100;

export class VirtualJoystick {
  private readonly scene: Phaser.Scene;
  private readonly outerRadius: number;
  private readonly thumbRadius: number;

  private readonly outer: Phaser.GameObjects.Graphics;
  private readonly thumb: Phaser.GameObjects.Graphics;
  private readonly ghost: Phaser.GameObjects.Graphics;

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

    this.ghost = scene.add.graphics();
    this.ghost.setScrollFactor(0);
    this.ghost.setDepth(JOYSTICK_DEPTH - 1);
    this.drawGhost();

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
    this.ghost.destroy();
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (this.active) return;
    // Activate for left 60% of screen
    if (pointer.x > this.scene.scale.width * 0.6) return;

    const zoom = this.scene.cameras.main.zoom || 1;
    const margin = this.outerRadius + 10;
    const vpWidth = this.scene.scale.width / zoom;
    const vpHeight = this.scene.scale.height / zoom;

    this.active = true;
    this.pointerId = pointer.id;
    this.baseX = Phaser.Math.Clamp(pointer.x / zoom, margin, vpWidth - margin);
    this.baseY = Phaser.Math.Clamp(pointer.y / zoom, margin, vpHeight - margin);
    this.outputX = 0;
    this.outputY = 0;

    this.ghost.setAlpha(0);
    this.outer.setAlpha(1);
    this.thumb.setAlpha(1);
    this.redrawOuter(this.baseX, this.baseY);
    this.redrawThumb(this.baseX, this.baseY);
  }

  private onPointerMove(pointer: Phaser.Input.Pointer): void {
    if (!this.active || pointer.id !== this.pointerId) return;

    const zoom = this.scene.cameras.main.zoom || 1;
    const dx = pointer.x / zoom - this.baseX;
    const dy = pointer.y / zoom - this.baseY;
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
    this.drawGhost();
  }

  private redrawOuter(x: number, y: number): void {
    this.outer.clear();

    // Background fill
    this.outer.fillStyle(OUTER_COLOR, OUTER_ALPHA);
    this.outer.fillCircle(x, y, this.outerRadius);

    // Outer ring border
    this.outer.lineStyle(2, OUTER_COLOR, RING_ALPHA);
    this.outer.strokeCircle(x, y, this.outerRadius);

    // Inner concentric ring (HUD depth)
    this.outer.lineStyle(1, OUTER_COLOR, RING_ALPHA * 0.35);
    this.outer.strokeCircle(x, y, this.outerRadius * 0.55);

    // Tick marks — 12 positions like a compass
    const numTicks = 12;
    for (let i = 0; i < numTicks; i++) {
      const angle = (i / numTicks) * Math.PI * 2;
      const isCardinal = i % 3 === 0;
      const tickLen = isCardinal ? 10 : 5;
      const tickAlpha = isCardinal ? RING_ALPHA : RING_ALPHA * 0.55;
      const tickWidth = isCardinal ? 2 : 1;
      const innerR = this.outerRadius - tickLen;
      this.outer.lineStyle(tickWidth, OUTER_COLOR, tickAlpha);
      this.outer.lineBetween(
        x + Math.cos(angle) * innerR,
        y + Math.sin(angle) * innerR,
        x + Math.cos(angle) * this.outerRadius,
        y + Math.sin(angle) * this.outerRadius,
      );
    }

    // Crosshair through centre
    const crossR = 10;
    this.outer.lineStyle(1, OUTER_COLOR, RING_ALPHA * 0.5);
    this.outer.lineBetween(x - crossR, y, x + crossR, y);
    this.outer.lineBetween(x, y - crossR, x, y + crossR);
  }

  private redrawThumb(x: number, y: number): void {
    this.thumb.clear();

    // Glow circle behind diamond
    this.thumb.fillStyle(THUMB_COLOR, THUMB_ALPHA * 0.4);
    this.thumb.fillCircle(x, y, this.thumbRadius);

    // Diamond shape (two triangles)
    const d = this.thumbRadius * 0.72;
    this.thumb.fillStyle(THUMB_COLOR, THUMB_ALPHA);
    this.thumb.fillTriangle(x, y - d, x + d, y, x - d, y); // upper half
    this.thumb.fillTriangle(x, y + d, x - d, y, x + d, y); // lower half

    // Diamond outline
    this.thumb.lineStyle(2, THUMB_COLOR, 1.0);
    this.thumb.beginPath();
    this.thumb.moveTo(x, y - d);
    this.thumb.lineTo(x + d, y);
    this.thumb.lineTo(x, y + d);
    this.thumb.lineTo(x - d, y);
    this.thumb.closePath();
    this.thumb.strokePath();

    // Centre dot
    this.thumb.fillStyle(0xffffff, 0.9);
    this.thumb.fillCircle(x, y, 3);
  }

  private drawGhost(): void {
    const zoom = this.scene.cameras.main.zoom || 1;
    const vpHeight = this.scene.scale.height / zoom;
    const gx = this.outerRadius + 20;
    const gy = vpHeight - this.outerRadius - 20;
    this.ghost.clear();

    // Main ring
    this.ghost.lineStyle(2, OUTER_COLOR, GHOST_ALPHA);
    this.ghost.strokeCircle(gx, gy, this.outerRadius);

    // Inner ring
    this.ghost.lineStyle(1, OUTER_COLOR, GHOST_ALPHA * 0.5);
    this.ghost.strokeCircle(gx, gy, this.outerRadius * 0.55);

    // Tick marks (ghost — slightly more transparent)
    const numTicks = 12;
    for (let i = 0; i < numTicks; i++) {
      const angle = (i / numTicks) * Math.PI * 2;
      const isCardinal = i % 3 === 0;
      const tickLen = isCardinal ? 8 : 4;
      const tickAlpha = Math.min(isCardinal ? GHOST_ALPHA * 1.4 : GHOST_ALPHA * 0.8, 1);
      const innerR = this.outerRadius - tickLen;
      this.ghost.lineStyle(isCardinal ? 2 : 1, OUTER_COLOR, tickAlpha);
      this.ghost.lineBetween(
        gx + Math.cos(angle) * innerR,
        gy + Math.sin(angle) * innerR,
        gx + Math.cos(angle) * this.outerRadius,
        gy + Math.sin(angle) * this.outerRadius,
      );
    }

    // Corner HUD bracket decorations
    const br = this.outerRadius + 6;
    const bLen = 10;
    this.ghost.lineStyle(2, OUTER_COLOR, Math.min(GHOST_ALPHA * 1.6, 1));

    // Top-left
    this.ghost.beginPath();
    this.ghost.moveTo(gx - br, gy - br + bLen);
    this.ghost.lineTo(gx - br, gy - br);
    this.ghost.lineTo(gx - br + bLen, gy - br);
    this.ghost.strokePath();

    // Top-right
    this.ghost.beginPath();
    this.ghost.moveTo(gx + br - bLen, gy - br);
    this.ghost.lineTo(gx + br, gy - br);
    this.ghost.lineTo(gx + br, gy - br + bLen);
    this.ghost.strokePath();

    // Bottom-right
    this.ghost.beginPath();
    this.ghost.moveTo(gx + br, gy + br - bLen);
    this.ghost.lineTo(gx + br, gy + br);
    this.ghost.lineTo(gx + br - bLen, gy + br);
    this.ghost.strokePath();

    // Bottom-left
    this.ghost.beginPath();
    this.ghost.moveTo(gx - br + bLen, gy + br);
    this.ghost.lineTo(gx - br, gy + br);
    this.ghost.lineTo(gx - br, gy + br - bLen);
    this.ghost.strokePath();

    // Centre crosshair
    const crossR = 8;
    this.ghost.lineStyle(1, OUTER_COLOR, GHOST_ALPHA * 0.8);
    this.ghost.lineBetween(gx - crossR, gy, gx + crossR, gy);
    this.ghost.lineBetween(gx, gy - crossR, gx, gy + crossR);

    this.ghost.setAlpha(1);
  }
}
