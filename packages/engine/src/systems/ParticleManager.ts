import Phaser from 'phaser';

/** Particle texture keys generated once per scene */
const TEX = {
  spark: '__vs_spark',
  dust: '__vs_dust',
  glow: '__vs_glow',
} as const;

/** Generate a small colored dot texture into the scene texture manager. */
function ensureTexture(
  scene: Phaser.Scene,
  key: string,
  size: number,
  color: number,
  alpha = 1,
): void {
  if (scene.textures.exists(key)) return;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const r = (color >> 16) & 0xff;
  const g = (color >> 8) & 0xff;
  const b = color & 0xff;
  const cx = size / 2;
  const cy = size / 2;

  // Radial gradient from opaque center to transparent edge
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx);
  grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  scene.textures.addCanvas(key, canvas);
}

type EmitterHandle = Phaser.GameObjects.Particles.ParticleEmitter;

/**
 * Manages all Phaser particle emitters for visual polish effects.
 * Attach once per scene, then call the factory methods.
 */
export class ParticleManager {
  private scene: Phaser.Scene | null = null;
  private emitters: EmitterHandle[] = [];

  attach(scene: Phaser.Scene): void {
    this.scene = scene;
    ensureTexture(scene, TEX.spark, 8, 0x00ff9d, 1); // green spark
    ensureTexture(scene, TEX.dust, 4, 0x334455, 0.7); // dim dust
    ensureTexture(scene, TEX.glow, 12, 0x00b4d8, 0.9); // cyan glow
  }

  destroy(): void {
    for (const e of this.emitters) {
      e.destroy();
    }
    this.emitters = [];
    this.scene = null;
  }

  // ---------------------------------------------------------------------------
  // Terminal idle sparks — small green/cyan particles near a terminal object
  // ---------------------------------------------------------------------------

  addTerminalSparks(worldX: number, worldY: number): EmitterHandle | null {
    const scene = this.scene;
    if (!scene) return null;

    const emitter = scene.add.particles(worldX, worldY - 8, TEX.spark, {
      speed: { min: 8, max: 30 },
      angle: { min: -110, max: -70 }, // upward arc
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.9, end: 0 },
      lifespan: { min: 400, max: 900 },
      frequency: 220, // ms between emissions
      quantity: 1,
      gravityY: -15,
    });
    emitter.setDepth(50);
    this.emitters.push(emitter);
    return emitter;
  }

  // ---------------------------------------------------------------------------
  // Challenge success burst — called once on successful hack
  // ---------------------------------------------------------------------------

  burstChallengeSuccess(worldX: number, worldY: number): void {
    const scene = this.scene;
    if (!scene) return;

    const emitter = scene.add.particles(worldX, worldY, TEX.spark, {
      speed: { min: 60, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: { min: 500, max: 1200 },
      quantity: 40,
      emitting: false, // fire once
    });
    emitter.setDepth(100);
    emitter.explode(40, worldX, worldY);
    // Auto-cleanup after particles die
    scene.time.delayedCall(1500, () => emitter.destroy());
  }

  // ---------------------------------------------------------------------------
  // Ambient dust — very sparse floating particles scene-wide
  // (attach to camera-space 0,0 with scrollFactor 0)
  // ---------------------------------------------------------------------------

  addAmbientDust(): EmitterHandle | null {
    const scene = this.scene;
    if (!scene) return null;

    const width = scene.cameras.main.width;
    const height = scene.cameras.main.height;

    const emitter = scene.add.particles(0, 0, TEX.dust, {
      x: { min: 0, max: width },
      y: { min: 0, max: height },
      speedX: { min: -6, max: 6 },
      speedY: { min: -10, max: -2 },
      scale: { min: 0.3, max: 0.8 },
      alpha: { start: 0.25, end: 0 },
      lifespan: { min: 2000, max: 5000 },
      frequency: 900, // very sparse
      quantity: 1,
    });
    emitter.setScrollFactor(0);
    emitter.setDepth(5);
    this.emitters.push(emitter);
    return emitter;
  }

  // ---------------------------------------------------------------------------
  // Data flow particles — tiny particles flowing along a cable path
  // ---------------------------------------------------------------------------

  addDataFlow(startX: number, startY: number, endX: number, endY: number): EmitterHandle | null {
    const scene = this.scene;
    if (!scene) return null;

    const dx = endX - startX;
    const dy = endY - startY;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return null;

    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    const emitter = scene.add.particles(startX, startY, TEX.glow, {
      speedX: { min: (dx / len) * 40, max: (dx / len) * 80 },
      speedY: { min: (dy / len) * 40, max: (dy / len) * 80 },
      angle: { min: angle - 5, max: angle + 5 },
      scale: { start: 0.4, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: { min: 400, max: 700 },
      frequency: 180,
      quantity: 1,
    });
    emitter.setDepth(45);
    this.emitters.push(emitter);
    return emitter;
  }

  // ---------------------------------------------------------------------------
  // Neon flicker — occasional brightness flash on a Graphics/Sprite object
  // (pure Phaser tween, no particle emitter needed)
  // ---------------------------------------------------------------------------

  addNeonFlicker(target: Phaser.GameObjects.GameObject & { alpha: number }): void {
    const scene = this.scene;
    if (!scene) return;

    const flickerStep = () => {
      if (!scene.scene.isActive()) return;
      const delay = Phaser.Math.Between(2000, 8000);
      scene.time.delayedCall(delay, () => {
        scene.tweens.add({
          targets: target,
          alpha: { from: target.alpha, to: 0.2 },
          duration: 40,
          yoyo: true,
          repeat: Phaser.Math.Between(1, 3),
          onComplete: flickerStep,
        });
      });
    };
    flickerStep();
  }

  // ---------------------------------------------------------------------------
  // Camera shake on success (delegates to Phaser cameras API)
  // ---------------------------------------------------------------------------

  successShake(intensity = 0.005, duration = 120): void {
    this.scene?.cameras.main.shake(duration, intensity);
  }

  // ---------------------------------------------------------------------------
  // Red vignette flash on failure (camera flash with red tint)
  // ---------------------------------------------------------------------------

  failureFlash(): void {
    const scene = this.scene;
    if (!scene) return;
    scene.cameras.main.flash(200, 180, 0, 0, false);
  }
}
