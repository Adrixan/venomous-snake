import Phaser from 'phaser';
import { EventBus } from '../EventBus';
import { getItemMeta } from '../maps/itemDatabase';

export type InteractiveObjectType = 'terminal' | 'door' | 'item' | 'npc' | 'elevator';

/** Parses a targetFloor value that may be a number (2) or a string ('floor2'). */
function parseTargetFloor(raw: unknown): number {
  if (typeof raw === 'number') return raw;
  if (typeof raw === 'string') {
    const match = /\d+/.exec(raw);
    if (match) return parseInt(match[0], 10);
  }
  return 0;
}

function getTextureKey(type: InteractiveObjectType): string {
  return `obj_${type}`;
}

// ---------------------------------------------------------------------------
// Cyberpunk noir sprite painters — all draw into a 32×32 coordinate space
// ---------------------------------------------------------------------------

function drawTerminalSprite(gfx: Phaser.GameObjects.Graphics): void {
  // Body
  gfx.fillStyle(0x1a1a2e, 1);
  gfx.fillRect(0, 0, 32, 32);

  // Top mounting rail
  gfx.fillStyle(0x0a0a1a, 1);
  gfx.fillRect(0, 0, 32, 3);

  // Screen backing (dark green)
  gfx.fillStyle(0x001a00, 1);
  gfx.fillRect(3, 4, 26, 17);

  // Scanlines (subtle dark bands every 3 rows)
  gfx.fillStyle(0x000000, 0.3);
  for (let sy = 5; sy < 21; sy += 3) {
    gfx.fillRect(3, sy, 26, 1);
  }

  // Screen data lines (bright green)
  gfx.fillStyle(0x00ff9d, 1);
  gfx.fillRect(5, 6, 18, 1);
  gfx.fillRect(5, 9, 12, 1);
  gfx.fillRect(5, 12, 20, 1);
  gfx.fillRect(5, 15, 8, 1);
  gfx.fillRect(14, 15, 2, 1); // blinking cursor

  // Screen border glow
  gfx.lineStyle(1, 0x00ff9d, 0.65);
  gfx.strokeRect(2, 3, 28, 19);

  // Status LED (glowing green dot, top-right)
  gfx.fillStyle(0x00ff9d, 0.25);
  gfx.fillCircle(28, 2, 3);
  gfx.fillStyle(0x00ff9d, 1);
  gfx.fillCircle(28, 2, 1);

  // Keyboard area
  gfx.fillStyle(0x0f0f20, 1);
  gfx.fillRect(3, 23, 26, 7);

  // Key dots (two staggered rows)
  gfx.fillStyle(0x2d2d44, 1);
  for (let k = 0; k < 6; k++) {
    gfx.fillRect(4 + k * 4, 24, 3, 2);
    gfx.fillRect(5 + k * 4, 27, 3, 2);
  }

  // Side cable port (left)
  gfx.fillStyle(0x0a0a1a, 1);
  gfx.fillRect(0, 12, 3, 7);
  gfx.fillStyle(0x3d4752, 1);
  gfx.fillRect(1, 13, 1, 1);
  gfx.fillRect(1, 15, 1, 1);
  gfx.fillRect(1, 17, 1, 1);
}

function drawDoorSprite(gfx: Phaser.GameObjects.Graphics): void {
  // Frame background
  gfx.fillStyle(0x1a1a2e, 1);
  gfx.fillRect(0, 0, 32, 32);

  // Top header bar with rivets
  gfx.fillStyle(0x0f0f20, 1);
  gfx.fillRect(0, 0, 32, 5);
  gfx.fillStyle(0x4d5762, 1);
  gfx.fillRect(2, 1, 2, 2);
  gfx.fillRect(13, 1, 2, 2);
  gfx.fillRect(17, 1, 2, 2);
  gfx.fillRect(28, 1, 2, 2);

  // Left door panel
  gfx.fillStyle(0x252540, 1);
  gfx.fillRect(1, 5, 14, 24);

  // Right door panel
  gfx.fillRect(17, 5, 14, 24);

  // Panel horizontal detail lines
  gfx.lineStyle(1, 0x3d4752, 0.5);
  for (let py = 8; py < 27; py += 5) {
    gfx.lineBetween(2, py, 14, py);
    gfx.lineBetween(17, py, 29, py);
  }

  // Panel vertical centre lines
  gfx.lineStyle(1, 0x3d4752, 0.35);
  gfx.lineBetween(8, 5, 8, 28);
  gfx.lineBetween(23, 5, 23, 28);

  // Centre seam gap
  gfx.fillStyle(0x0a0a1a, 1);
  gfx.fillRect(15, 5, 2, 24);

  // Cyan glow line in seam
  gfx.fillStyle(0x00b4d8, 0.9);
  gfx.fillRect(15, 5, 1, 24);
  gfx.fillStyle(0x00b4d8, 0.4);
  gfx.fillRect(16, 5, 1, 24);

  // Glow bloom (soft halo)
  gfx.fillStyle(0x00b4d8, 0.12);
  gfx.fillRect(13, 5, 2, 24);
  gfx.fillStyle(0x00b4d8, 0.08);
  gfx.fillRect(17, 5, 2, 24);

  // Status light (above seam, in header)
  gfx.fillStyle(0x00ff9d, 0.25);
  gfx.fillCircle(16, 2, 3);
  gfx.fillStyle(0x00ff9d, 1);
  gfx.fillCircle(16, 2, 1);

  // Floor threshold
  gfx.fillStyle(0x2d2d44, 1);
  gfx.fillRect(0, 29, 32, 3);
  gfx.lineStyle(1, 0x00b4d8, 0.3);
  gfx.lineBetween(0, 30, 32, 30);

  // Neon frame glow
  gfx.lineStyle(1, 0x00b4d8, 0.18);
  gfx.strokeRect(0, 0, 32, 32);
}

function drawItemSprite(gfx: Phaser.GameObjects.Graphics): void {
  // Dark floor background
  gfx.fillStyle(0x0a0a1a, 1);
  gfx.fillRect(0, 0, 32, 32);

  // Outer glow aura
  gfx.fillStyle(0xffb454, 0.07);
  gfx.fillCircle(16, 15, 14);
  gfx.fillStyle(0xffb454, 0.12);
  gfx.fillCircle(16, 15, 10);

  // Circuit board base
  gfx.fillStyle(0x0f1a0f, 1);
  gfx.fillRect(8, 6, 16, 17);

  // Board border
  gfx.lineStyle(1, 0xffb454, 0.9);
  gfx.strokeRect(7, 5, 18, 19);

  // Horizontal circuit traces
  gfx.lineStyle(1, 0xffb454, 0.55);
  gfx.lineBetween(8, 9, 11, 9);
  gfx.lineBetween(21, 9, 24, 9);
  gfx.lineBetween(8, 16, 11, 16);
  gfx.lineBetween(21, 16, 24, 16);

  // Vertical circuit traces
  gfx.lineBetween(11, 5, 11, 9);
  gfx.lineBetween(11, 16, 11, 22);
  gfx.lineBetween(21, 5, 21, 9);
  gfx.lineBetween(21, 16, 21, 22);

  // Trace nodes
  gfx.fillStyle(0xffb454, 1);
  gfx.fillRect(10, 8, 2, 2);
  gfx.fillRect(20, 8, 2, 2);
  gfx.fillRect(10, 15, 2, 2);
  gfx.fillRect(20, 15, 2, 2);

  // Central processor chip
  gfx.fillStyle(0xffb454, 1);
  gfx.fillRect(12, 9, 8, 8);
  gfx.fillStyle(0x050500, 1);
  gfx.fillRect(13, 10, 6, 6);

  // Active chip pins
  gfx.fillStyle(0xffb454, 0.8);
  gfx.fillRect(14, 11, 1, 1);
  gfx.fillRect(17, 11, 1, 1);
  gfx.fillRect(14, 14, 1, 1);
  gfx.fillRect(17, 14, 1, 1);
  gfx.fillStyle(0xffff44, 1);
  gfx.fillRect(15, 12, 2, 2); // active core glow

  // Connector pins (bottom edge)
  gfx.fillStyle(0x909090, 1);
  for (let p = 0; p < 5; p++) {
    gfx.fillRect(9 + p * 3, 25, 2, 4);
  }
  gfx.lineStyle(1, 0xffb454, 0.4);
  gfx.lineBetween(8, 25, 24, 25);

  // Board inner glow overlay
  gfx.fillStyle(0xffb454, 0.1);
  gfx.fillRect(8, 6, 16, 17);
}

function drawNpcSprite(gfx: Phaser.GameObjects.Graphics): void {
  // Background
  gfx.fillStyle(0x0a0a1a, 1);
  gfx.fillRect(0, 0, 32, 32);

  // Torso (dark corp suit)
  gfx.fillStyle(0x1a2035, 1);
  gfx.fillRect(10, 18, 12, 12);

  // Shoulders
  gfx.fillStyle(0x1e2845, 1);
  gfx.fillRect(7, 15, 18, 5);

  // Arms
  gfx.fillStyle(0x1a2035, 1);
  gfx.fillRect(7, 20, 3, 9);
  gfx.fillRect(22, 20, 3, 9);

  // Neck
  gfx.fillStyle(0x2a3248, 1);
  gfx.fillRect(14, 14, 4, 4);

  // Head
  gfx.fillCircle(16, 9, 6);

  // Hair
  gfx.fillStyle(0x141c2a, 1);
  gfx.fillRect(10, 3, 12, 7);

  // Eyes (blue tint — corporate augments)
  gfx.fillStyle(0x00b4d8, 0.85);
  gfx.fillRect(13, 9, 2, 1);
  gfx.fillRect(17, 9, 2, 1);

  // Collar
  gfx.fillStyle(0x2d3455, 1);
  gfx.fillRect(12, 15, 8, 4);

  // Lapels / V opening
  gfx.fillStyle(0x0a0a1a, 1);
  gfx.fillRect(15, 15, 2, 6);
  gfx.fillRect(14, 15, 1, 3);
  gfx.fillRect(17, 15, 1, 3);

  // ID badge glow
  gfx.fillStyle(0xc792ea, 0.3);
  gfx.fillRect(12, 19, 8, 5);

  // ID badge
  gfx.fillStyle(0xc792ea, 1);
  gfx.fillRect(13, 20, 6, 3);
  gfx.fillStyle(0x0a0a1a, 1);
  gfx.fillRect(14, 21, 4, 1);
  gfx.lineStyle(1, 0xc792ea, 0.8);
  gfx.strokeRect(13, 20, 6, 3);
}

function drawElevatorSprite(gfx: Phaser.GameObjects.Graphics): void {
  // Frame
  gfx.fillStyle(0x1a1a2e, 1);
  gfx.fillRect(0, 0, 32, 32);

  // Top bar
  gfx.fillStyle(0x2d2d44, 1);
  gfx.fillRect(0, 0, 32, 5);

  // Left door panel
  gfx.fillStyle(0x3d4752, 1);
  gfx.fillRect(1, 5, 14, 23);

  // Right door panel
  gfx.fillRect(17, 5, 14, 23);

  // Panel top highlight edge
  gfx.fillStyle(0x4d5762, 1);
  gfx.fillRect(1, 5, 14, 1);
  gfx.fillRect(17, 5, 14, 1);

  // Panel horizontal lines
  gfx.lineStyle(1, 0x4d5762, 0.5);
  for (let py = 9; py < 26; py += 5) {
    gfx.lineBetween(2, py, 14, py);
    gfx.lineBetween(17, py, 29, py);
  }

  // Panel vertical centre lines
  gfx.lineStyle(1, 0x4d5762, 0.4);
  gfx.lineBetween(7, 5, 7, 27);
  gfx.lineBetween(24, 5, 24, 27);

  // Centre seam
  gfx.fillStyle(0x0a0a1a, 1);
  gfx.fillRect(15, 5, 2, 23);

  // Magenta seam glow
  gfx.fillStyle(0xc792ea, 0.9);
  gfx.fillRect(15, 5, 1, 23);
  gfx.fillStyle(0xc792ea, 0.4);
  gfx.fillRect(16, 5, 1, 23);

  // Glow bloom
  gfx.fillStyle(0xc792ea, 0.12);
  gfx.fillRect(13, 5, 2, 23);
  gfx.fillStyle(0xc792ea, 0.08);
  gfx.fillRect(17, 5, 2, 23);

  // Up arrow (top frame, left of centre)
  gfx.fillStyle(0x00ff9d, 1);
  gfx.fillTriangle(11, 1, 8, 4, 14, 4);

  // Down arrow (top frame, right of centre)
  gfx.fillStyle(0xc792ea, 0.9);
  gfx.fillTriangle(21, 4, 18, 1, 24, 1);

  // Floor indicator panel (centre top)
  gfx.fillStyle(0x0a0a1a, 1);
  gfx.fillRect(14, 0, 4, 3);
  gfx.fillStyle(0xc792ea, 1);
  gfx.fillRect(15, 0, 2, 2);

  // Bottom ventilation grate
  gfx.fillStyle(0x252535, 1);
  gfx.fillRect(1, 28, 30, 3);
  gfx.lineStyle(1, 0x1a1a2e, 0.9);
  for (let gx = 3; gx < 30; gx += 3) {
    gfx.lineBetween(gx, 29, gx + 2, 29);
  }

  // Metal frame outline
  gfx.lineStyle(1, 0x4d5762, 0.5);
  gfx.strokeRect(0, 0, 32, 32);
}

// ---------------------------------------------------------------------------

export class InteractiveObject extends Phaser.Physics.Arcade.Sprite {
  private readonly objectId: string;
  readonly objectType: InteractiveObjectType;
  private readonly objectProperties: Record<string, unknown>;
  private readonly displayName: string;
  private promptLabel: Phaser.GameObjects.Text | null = null;
  private inRange = false;

  /** Pre-generate cyberpunk procedural textures for all interactive object types. */
  static createPlaceholderTextures(scene: Phaser.Scene): void {
    const types: InteractiveObjectType[] = ['terminal', 'door', 'item', 'npc', 'elevator'];
    for (const type of types) {
      const key = getTextureKey(type);
      if (scene.textures.exists(key)) continue;

      const gfx = scene.make.graphics({}, false);
      switch (type) {
        case 'terminal':
          drawTerminalSprite(gfx);
          break;
        case 'door':
          drawDoorSprite(gfx);
          break;
        case 'item':
          drawItemSprite(gfx);
          break;
        case 'npc':
          drawNpcSprite(gfx);
          break;
        case 'elevator':
          drawElevatorSprite(gfx);
          break;
      }
      gfx.generateTexture(key, 32, 32);
      gfx.destroy();
    }
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: InteractiveObjectType,
    properties?: Record<string, unknown>,
  ) {
    super(scene, x, y, getTextureKey(type));

    this.objectType = type;
    this.objectProperties = properties ?? {};

    const idFromProps = this.objectProperties['id'];
    this.objectId =
      typeof idFromProps === 'string' ? idFromProps : `${type}_${Math.round(x)}_${Math.round(y)}`;

    const nameFromProps = this.objectProperties['name'];
    this.displayName = typeof nameFromProps === 'string' ? nameFromProps : type;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setImmovable(true);
    // Expand interaction zone beyond the visual footprint
    body.setSize(56, 56, true);

    this.promptLabel = scene.add.text(x, y - 28, `< [E] ${this.displayName} >`, {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#00ff9d',
      backgroundColor: '#0a0a1acc',
      padding: { x: 5, y: 3 },
    });
    this.promptLabel.setOrigin(0.5, 1);
    this.promptLabel.setVisible(false);
    this.promptLabel.setDepth(210);
  }

  setPlayerInRange(inRange: boolean): void {
    if (inRange === this.inRange) return;
    this.inRange = inRange;
    if (inRange) {
      this.showPrompt();
    } else {
      this.hidePrompt();
    }
  }

  interact(): void {
    EventBus.emit({
      type: 'PLAYER_INTERACT',
      payload: { objectId: this.objectId, objectType: this.objectType },
    });

    if (this.objectType === 'terminal') {
      const challengeIdProp = this.objectProperties['challengeId'];
      const challengeId = typeof challengeIdProp === 'string' ? challengeIdProp : undefined;
      EventBus.emit({
        type: 'TERMINAL_OPEN',
        payload: {
          terminalId: this.objectId,
          ...(challengeId !== undefined ? { challengeId } : {}),
        },
      });
    } else if (this.objectType === 'npc') {
      EventBus.emit({ type: 'DIALOG_START', payload: { npcId: this.objectId } });
    } else if (this.objectType === 'item') {
      const itemIdProp = this.objectProperties['itemId'];
      const itemId = typeof itemIdProp === 'string' ? itemIdProp : this.objectId;
      const meta = getItemMeta(itemId);
      EventBus.emit({
        type: 'ITEM_PICKUP',
        payload: {
          itemId,
          name: this.displayName,
          description: meta.description,
          itemType: meta.itemType,
        },
      });
      this.destroy();
    } else if (this.objectType === 'door' || this.objectType === 'elevator') {
      const rawFloor = this.objectProperties['targetFloor'];
      const targetFloor = parseTargetFloor(rawFloor);
      EventBus.emit({ type: 'FLOOR_CHANGE', payload: { targetFloor } });
    }
  }

  showPrompt(): void {
    this.promptLabel?.setVisible(true);
    EventBus.emit({
      type: 'INTERACTION_PROMPT',
      payload: { objectId: this.objectId, promptText: `[E] ${this.displayName}` },
    });
  }

  hidePrompt(): void {
    this.promptLabel?.setVisible(false);
    EventBus.emit({ type: 'INTERACTION_PROMPT', payload: null });
  }

  override destroy(fromScene?: boolean): void {
    this.promptLabel?.destroy();
    this.promptLabel = null;
    super.destroy(fromScene);
  }
}
