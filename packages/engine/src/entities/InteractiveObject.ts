import Phaser from 'phaser';
import { EventBus } from '../EventBus';

export type InteractiveObjectType = 'terminal' | 'door' | 'item' | 'npc' | 'elevator';

function getObjectColor(type: InteractiveObjectType): number {
  switch (type) {
    case 'terminal':
      return 0x00b4d8;
    case 'door':
      return 0xffd60a;
    case 'item':
      return 0xfb8500;
    case 'npc':
      return 0xc77dff;
    case 'elevator':
      return 0x00ff9d;
  }
}

function getTextureKey(type: InteractiveObjectType): string {
  return `obj_${type}`;
}

export class InteractiveObject extends Phaser.Physics.Arcade.Sprite {
  private readonly objectId: string;
  readonly objectType: InteractiveObjectType;
  private readonly objectProperties: Record<string, unknown>;
  private promptLabel: Phaser.GameObjects.Text | null = null;
  private inRange = false;

  /** Pre-generate colored rectangle placeholder textures for all object types. */
  static createPlaceholderTextures(scene: Phaser.Scene): void {
    const types: InteractiveObjectType[] = ['terminal', 'door', 'item', 'npc', 'elevator'];
    for (const type of types) {
      const key = getTextureKey(type);
      if (scene.textures.exists(key)) continue;

      const gfx = scene.make.graphics({}, false);
      gfx.fillStyle(getObjectColor(type), 1);
      gfx.fillRect(0, 0, 32, 32);
      gfx.lineStyle(1, 0xffffff, 0.3);
      gfx.strokeRect(0, 0, 32, 32);
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

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setImmovable(true);
    // Expand interaction zone beyond the visual footprint
    body.setSize(56, 56, true);

    this.promptLabel = scene.add.text(x, y - 28, '[E] interact', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#ffffff',
      backgroundColor: '#000000cc',
      padding: { x: 4, y: 2 },
    });
    this.promptLabel.setOrigin(0.5, 1);
    this.promptLabel.setVisible(false);
    this.promptLabel.setDepth(10);
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
      EventBus.emit({ type: 'ITEM_PICKUP', payload: { itemId: this.objectId } });
      this.destroy();
    } else if (this.objectType === 'elevator') {
      const rawFloor = this.objectProperties['targetFloor'];
      const targetFloor = typeof rawFloor === 'number' ? rawFloor : 0;
      EventBus.emit({ type: 'FLOOR_CHANGE', payload: { targetFloor } });
    }
  }

  showPrompt(): void {
    this.promptLabel?.setVisible(true);
    EventBus.emit({
      type: 'INTERACTION_PROMPT',
      payload: { objectId: this.objectId, promptText: `[E] ${this.objectType}` },
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
