import Phaser from 'phaser';
import { generateTilesetTexture } from '../maps/TilesetGenerator';
import { generateLobbyTilemap, LOBBY_MAP_KEY } from '../maps/TilemapGenerator';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x1a1a2e, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 15, 320, 30);

    const loadingText = this.add.text(width / 2, height / 2 - 40, 'INITIALIZING...', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#00ff9d',
    });
    loadingText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x00ff9d, 1);
      progressBar.fillRect(width / 2 - 155, height / 2 - 10, 310 * value, 20);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });
  }

  create(): void {
    // Generate the lobby tileset texture and register it in Phaser's TextureManager
    generateTilesetTexture(this);

    // Generate the Tiled-format lobby tilemap and add it to the tilemap cache
    if (!this.cache.tilemap.has(LOBBY_MAP_KEY)) {
      const lobbyJson = generateLobbyTilemap();
      this.cache.tilemap.add(LOBBY_MAP_KEY, {
        format: Phaser.Tilemaps.Formats.TILED_JSON,
        data: lobbyJson,
      });
    }

    this.scene.start('GameScene', { roomKey: LOBBY_MAP_KEY });
  }
}
