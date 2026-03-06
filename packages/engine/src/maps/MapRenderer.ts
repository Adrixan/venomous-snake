import Phaser from 'phaser';
import type { ProceduralMapConfig, ProceduralRoom } from './LobbyMap';

const COLOR_FLOOR = 0x0d1b2a;
const COLOR_WALL = 0x1a1a2e;
const COLOR_DOOR = 0x00e5ff;

export class MapRenderer {
  private scene: Phaser.Scene;
  private config: ProceduralMapConfig;

  constructor(scene: Phaser.Scene, config: ProceduralMapConfig) {
    this.scene = scene;
    this.config = config;
  }

  /** Renders the full map and returns a wall StaticGroup for collision. */
  render(): Phaser.Physics.Arcade.StaticGroup {
    const wallGroup = this.scene.physics.add.staticGroup();

    for (const room of this.config.rooms) {
      this.renderRoom(room, wallGroup);
    }

    this.renderConnections(wallGroup);

    return wallGroup;
  }

  /** Creates floor tiles and wall borders for a room. */
  private renderRoom(room: ProceduralRoom, wallGroup: Phaser.Physics.Arcade.StaticGroup): void {
    const ts = this.config.tileSize;

    // Floor fill
    for (let row = 0; row < room.height; row++) {
      for (let col = 0; col < room.width; col++) {
        const px = (room.x + col) * ts + ts / 2;
        const py = (room.y + row) * ts + ts / 2;

        const isEdge =
          row === 0 || row === room.height - 1 || col === 0 || col === room.width - 1;

        if (isEdge) {
          const wall = this.scene.add.rectangle(px, py, ts, ts, COLOR_WALL);
          wallGroup.add(wall);
          (wall.body as Phaser.Physics.Arcade.StaticBody).setSize(ts, ts);
        } else {
          this.scene.add.rectangle(px, py, ts, ts, COLOR_FLOOR);
        }
      }
    }
  }

  /** Renders door markers at connection points, removing wall bodies at those locations. */
  private renderConnections(wallGroup: Phaser.Physics.Arcade.StaticGroup): void {
    const ts = this.config.tileSize;

    for (const conn of this.config.connections) {
      const px = conn.door.x * ts + ts / 2;
      const py = conn.door.y * ts + ts / 2;

      // Remove any wall body at the door position
      for (const child of wallGroup.getChildren()) {
        const go = child as Phaser.GameObjects.Rectangle;
        if (Math.abs(go.x - px) < 1 && Math.abs(go.y - py) < 1) {
          wallGroup.remove(child, true, true);
          break;
        }
      }

      // Place a visible door marker
      this.scene.add.rectangle(px, py, ts, ts, COLOR_DOOR).setAlpha(0.6);
    }
  }

  /** Returns interactive spawn positions extracted from all rooms. */
  getInteractiveSpawns(): Array<{
    type: 'terminal' | 'npc' | 'door' | 'item';
    x: number;
    y: number;
    properties: Record<string, string>;
  }> {
    const ts = this.config.tileSize;
    const spawns: Array<{
      type: 'terminal' | 'npc' | 'door' | 'item';
      x: number;
      y: number;
      properties: Record<string, string>;
    }> = [];

    for (const room of this.config.rooms) {
      for (const obj of room.interactives) {
        spawns.push({
          type: obj.type,
          x: obj.x * ts + ts / 2,
          y: obj.y * ts + ts / 2,
          properties: obj.properties,
        });
      }
    }

    return spawns;
  }
}
