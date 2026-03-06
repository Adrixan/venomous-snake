import Phaser from 'phaser';
import { EventBus } from '../EventBus';

export interface InteractiveObjectConfig {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  promptText: string;
  color: number;
  interactionRadius: number;
  /** Optional callback invoked when the player presses E near this object. */
  onInteract?: () => void;
}

export class InteractiveObject extends Phaser.GameObjects.Container {
  private readonly objectId: string;
  private readonly promptText: string;
  private readonly interactionRadius: number;
  private readonly onInteractCb: (() => void) | undefined;
  private eKey: Phaser.Input.Keyboard.Key | undefined;
  private isPlayerNearby = false;

  constructor(scene: Phaser.Scene, config: InteractiveObjectConfig) {
    super(scene, config.x, config.y);

    this.objectId = config.id;
    this.promptText = config.promptText;
    this.interactionRadius = config.interactionRadius;
    this.onInteractCb = config.onInteract;

    // Visual body
    const rect = scene.add.rectangle(0, 0, config.width, config.height, config.color);
    this.add(rect);

    // Label
    const label = scene.add.text(0, -config.height / 2 - 10, this.promptText, {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#ffffff',
    });
    label.setOrigin(0.5, 1);
    label.setVisible(false);
    this.add(label);
    this._promptLabel = label;

    scene.add.existing(this);

    if (scene.input.keyboard) {
      this.eKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }
  }

  /** Cached reference to the prompt text label child. */
  private _promptLabel: Phaser.GameObjects.Text;

  /**
   * Call this every update tick, passing the player's world position.
   * Handles proximity detection and E-key interaction.
   */
  checkProximity(player: { x: number; y: number }): void {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distSq = dx * dx + dy * dy;
    const radiusSq = this.interactionRadius * this.interactionRadius;

    const wasNearby = this.isPlayerNearby;
    this.isPlayerNearby = distSq <= radiusSq;

    if (this.isPlayerNearby !== wasNearby) {
      this._promptLabel.setVisible(this.isPlayerNearby);
      if (this.isPlayerNearby) {
        EventBus.emit({
          type: 'INTERACTION_PROMPT',
          payload: { objectId: this.objectId, promptText: this.promptText },
        });
      } else {
        EventBus.emit({ type: 'INTERACTION_PROMPT', payload: null });
      }
    }

    if (
      this.isPlayerNearby &&
      this.eKey !== undefined &&
      Phaser.Input.Keyboard.JustDown(this.eKey)
    ) {
      this.interact();
    }
  }

  getId(): string {
    return this.objectId;
  }

  private interact(): void {
    if (this.onInteractCb !== undefined) {
      this.onInteractCb();
      return;
    }

    if (this.objectId.startsWith('terminal')) {
      EventBus.emit({ type: 'TERMINAL_OPEN', payload: { terminalId: this.objectId } });
    }
  }
}
