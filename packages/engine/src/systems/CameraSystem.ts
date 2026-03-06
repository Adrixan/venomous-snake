import Phaser from 'phaser';

export class CameraSystem {
  private camera: Phaser.Cameras.Scene2D.Camera | null = null;
  private scene: Phaser.Scene | null = null;

  setup(
    scene: Phaser.Scene,
    target: Phaser.GameObjects.Sprite,
    tilemap?: Phaser.Tilemaps.Tilemap,
  ): void {
    this.scene = scene;
    this.camera = scene.cameras.main;
    this.camera.setBackgroundColor('#0a0a0f');
    this.camera.startFollow(target, true, 0.1, 0.1);
    this.camera.setDeadzone(80, 60);

    if (tilemap) {
      this.camera.setBounds(0, 0, tilemap.widthInPixels, tilemap.heightInPixels);
    } else {
      const bounds = scene.physics.world.bounds;
      this.camera.setBounds(0, 0, bounds.width, bounds.height);
    }
  }

  /**
   * Fade out, call onMidpoint (e.g. swap room), then fade back in.
   * Default total duration is 300ms (150ms each way).
   */
  transition(onMidpoint: () => void, duration = 300): void {
    const camera = this.camera;
    if (!camera) return;

    camera.fadeOut(duration / 2, 0, 0, 0);
    camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      onMidpoint();
      camera.fadeIn(duration / 2, 0, 0, 0);
    });
  }

  shake(duration = 250, intensity = 0.01): void {
    this.camera?.shake(duration, intensity);
  }

  /**
   * Transition to a different Phaser scene by key.
   * Fades out, then starts the target scene.
   */
  transitionToRoom(targetScene: string): void {
    const camera = this.camera;
    const scene = this.scene;
    if (!camera || !scene) return;

    camera.fadeOut(300, 0, 0, 0);
    camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      scene.scene.start(targetScene);
    });
  }
}
