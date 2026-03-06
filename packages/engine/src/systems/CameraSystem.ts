import Phaser from 'phaser';
import type { Player } from '../entities/Player';

export interface CameraConfig {
  lerpX?: number;
  lerpY?: number;
  deadzoneWidth?: number;
  deadzoneHeight?: number;
}

export class CameraSystem {
  private readonly camera: Phaser.Cameras.Scene2D.Camera;
  private readonly scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.camera = scene.cameras.main;
    this.camera.setBackgroundColor('#0a0a0f');
  }

  followPlayer(player: Player, config?: CameraConfig): void {
    const lerpX = config?.lerpX ?? 0.1;
    const lerpY = config?.lerpY ?? 0.1;

    this.camera.startFollow(player, true, lerpX, lerpY);

    const dw = config?.deadzoneWidth;
    const dh = config?.deadzoneHeight;
    if (dw !== undefined && dh !== undefined) {
      this.camera.setDeadzone(dw, dh);
    }
  }

  setBoundsFromMap(map: Phaser.Tilemaps.Tilemap): void {
    this.camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  /**
   * Fade the current camera to black, then start the named Phaser scene.
   * The returned Promise resolves once the scene transition begins.
   */
  transitionToRoom(targetScene: string): Promise<void> {
    return new Promise((resolve) => {
      this.camera.fadeOut(300, 0, 0, 0);
      this.camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.scene.scene.start(targetScene);
        resolve();
      });
    });
  }
}
