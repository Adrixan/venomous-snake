import Phaser from 'phaser';

/**
 * Phaser-based scene transition effects.
 * Attach to a scene once, then call effect methods as needed.
 */
export class TransitionManager {
  destroy(): void {
    // No-op — all temporary overlays are self-cleaning
  }

  // ---------------------------------------------------------------------------
  // Fade helpers (delegate to Phaser camera where possible)
  // ---------------------------------------------------------------------------

  fadeToBlack(scene: Phaser.Scene, duration = 300): Promise<void> {
    return new Promise<void>((resolve) => {
      const cam = scene.cameras.main;
      cam.fadeOut(duration, 0, 0, 0);
      cam.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => resolve());
    });
  }

  fadeFromBlack(scene: Phaser.Scene, duration = 300): Promise<void> {
    return new Promise<void>((resolve) => {
      const cam = scene.cameras.main;
      cam.fadeIn(duration, 0, 0, 0);
      cam.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => resolve());
    });
  }

  // ---------------------------------------------------------------------------
  // Glitch transition — cyberpunk RGB split + static noise
  // ---------------------------------------------------------------------------

  glitchTransition(scene: Phaser.Scene, duration = 600): Promise<void> {
    return new Promise<void>((resolve) => {
      const cam = scene.cameras.main;
      const width = cam.width;
      const height = cam.height;

      const overlay = scene.add.graphics();
      overlay.setDepth(9999);
      overlay.setScrollFactor(0);

      let elapsed = 0;

      const onUpdate = (_time: number, delta: number) => {
        elapsed += delta;
        const progress = Math.min(elapsed / duration, 1);

        overlay.clear();

        // Phase 1 (0–60%): RGB split blocks + noise
        if (progress < 0.6) {
          const intensity = 1 - progress / 0.6;
          const shift = Math.round(10 * intensity);

          // Red channel ghost
          overlay.fillStyle(0xff0033, 0.12 * intensity);
          overlay.fillRect(shift, 0, width, height);

          // Blue channel ghost
          overlay.fillStyle(0x0033ff, 0.12 * intensity);
          overlay.fillRect(-shift, 0, width, height);

          // Static noise strips
          const strips = Math.floor(8 * intensity);
          for (let i = 0; i < strips; i++) {
            const sy = Math.random() * height;
            const sh = Math.random() * 6 + 2;
            overlay.fillStyle(0x000000, 0.5 + Math.random() * 0.4);
            overlay.fillRect(0, sy, width, sh);
          }
        }

        // Phase 2 (40–100%): fade to black
        if (progress > 0.4) {
          const blackAlpha = (progress - 0.4) / 0.6;
          overlay.fillStyle(0x000000, blackAlpha);
          overlay.fillRect(0, 0, width, height);
        }

        if (progress >= 1) {
          scene.events.off('update', onUpdate);
          overlay.destroy();
          resolve();
        }
      };

      scene.events.on('update', onUpdate);
    });
  }

  // ---------------------------------------------------------------------------
  // Scanline wipe — horizontal scanlines sweep in a given direction
  // ---------------------------------------------------------------------------

  scanlineWipe(
    scene: Phaser.Scene,
    direction: 'left' | 'right' | 'down' | 'up',
    duration = 500,
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      const cam = scene.cameras.main;
      const width = cam.width;
      const height = cam.height;

      const overlay = scene.add.graphics();
      overlay.setDepth(9999);
      overlay.setScrollFactor(0);

      const STRIP = 6; // scanline stripe height
      let elapsed = 0;

      const onUpdate = (_time: number, delta: number) => {
        elapsed += delta;
        const progress = Math.min(elapsed / duration, 1);

        overlay.clear();

        // Solid filled region behind the sweep front
        overlay.fillStyle(0x000000, 1);

        if (direction === 'down') {
          // Even rows swept by front, odd rows lag slightly
          const front = progress * height;
          overlay.fillRect(0, 0, width, front);
          for (let y = front; y < height; y += STRIP * 2) {
            if (y < front + STRIP * 4) {
              overlay.fillStyle(0x00ff9d, 0.06);
              overlay.fillRect(0, y, width, STRIP);
              overlay.fillStyle(0x000000, 1);
            }
          }
        } else if (direction === 'up') {
          const front = (1 - progress) * height;
          overlay.fillRect(0, front, width, height - front);
          for (let y = front - STRIP * 4; y < front; y += STRIP * 2) {
            if (y >= 0) {
              overlay.fillStyle(0x00ff9d, 0.06);
              overlay.fillRect(0, y, width, STRIP);
              overlay.fillStyle(0x000000, 1);
            }
          }
        } else if (direction === 'right') {
          const front = progress * width;
          overlay.fillRect(0, 0, front, height);
        } else {
          // left
          const front = (1 - progress) * width;
          overlay.fillRect(front, 0, width - front, height);
        }

        if (progress >= 1) {
          scene.events.off('update', onUpdate);
          overlay.destroy();
          resolve();
        }
      };

      scene.events.on('update', onUpdate);
    });
  }

  // ---------------------------------------------------------------------------
  // Convenience: full floor-change transition
  // glitch out → callback (load new tilemap) → fade in
  // ---------------------------------------------------------------------------

  async floorTransition(
    scene: Phaser.Scene,
    onSwap: () => void,
    reducedMotion = false,
  ): Promise<void> {
    if (reducedMotion) {
      await this.fadeToBlack(scene, 200);
      onSwap();
      await this.fadeFromBlack(scene, 200);
      return;
    }
    await this.glitchTransition(scene, 500);
    onSwap();
    await this.fadeFromBlack(scene, 400);
  }

  // ---------------------------------------------------------------------------
  // Quick terminal fade (used for overlay open/close in GameScene)
  // ---------------------------------------------------------------------------

  async terminalFade(scene: Phaser.Scene, fadeIn: boolean, duration = 150): Promise<void> {
    if (fadeIn) {
      await this.fadeFromBlack(scene, duration);
    } else {
      await this.fadeToBlack(scene, duration);
    }
  }
}
