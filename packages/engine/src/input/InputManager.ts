import Phaser from 'phaser';
import { VirtualJoystick } from './VirtualJoystick';
import { InteractButton } from './InteractButton';

export type InputMode = 'keyboard' | 'touch';

export interface MovementVector {
  x: number;
  y: number;
}

interface WASDKeys {
  W: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
}

const INV_SQRT2 = 0.7071067811865476;

export class InputManager {
  private readonly scene: Phaser.Scene;
  private mode: InputMode;

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private wasdKeys: WASDKeys | null = null;
  private interactKey: Phaser.Input.Keyboard.Key | null = null;

  private joystick: VirtualJoystick | null = null;
  private interactButton: InteractButton | null = null;

  private readonly boundKeyDown: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    // Detect initial mode based on touch capability
    this.mode = scene.sys.game.device.input.touch ? 'touch' : 'keyboard';

    // Always register keyboard — used on desktop and for tablet+keyboard fallback
    const kb = scene.input.keyboard;
    if (kb) {
      this.cursors = kb.createCursorKeys();
      this.wasdKeys = {
        W: kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
      this.interactKey = kb.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    this.boundKeyDown = this.onAnyKeyDown.bind(this);

    if (this.mode === 'touch') {
      this.joystick = new VirtualJoystick(scene);
      this.interactButton = new InteractButton(scene);
      // Auto-switch to keyboard when a physical key is pressed
      scene.input.keyboard?.on('keydown', this.boundKeyDown);
    }
  }

  getMode(): InputMode {
    return this.mode;
  }

  /**
   * Returns a normalized movement vector { x, y } in the range [-1, 1].
   * Keyboard input takes priority over touch when both are active.
   */
  getMovement(): MovementVector {
    if (this.cursors && this.wasdKeys) {
      const left = this.cursors.left.isDown || this.wasdKeys.A.isDown;
      const right = this.cursors.right.isDown || this.wasdKeys.D.isDown;
      const up = this.cursors.up.isDown || this.wasdKeys.W.isDown;
      const down = this.cursors.down.isDown || this.wasdKeys.S.isDown;

      let vx = left ? -1 : right ? 1 : 0;
      let vy = up ? -1 : down ? 1 : 0;

      if (vx !== 0 && vy !== 0) {
        vx *= INV_SQRT2;
        vy *= INV_SQRT2;
      }

      if (vx !== 0 || vy !== 0) {
        return { x: vx, y: vy };
      }
    }

    if (this.joystick?.isActive()) {
      return this.joystick.getOutput();
    }

    return { x: 0, y: 0 };
  }

  /** Returns true for exactly one frame when the interact action is triggered. */
  isInteracting(): boolean {
    if (this.interactKey && Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      return true;
    }
    return this.interactButton?.consumePress() ?? false;
  }

  /** Show/hide the mobile interact button based on proximity to an interactable. */
  setInteractAvailable(available: boolean): void {
    this.interactButton?.setAvailable(available);
  }

  destroy(): void {
    if (this.mode === 'touch') {
      this.scene.input.keyboard?.off('keydown', this.boundKeyDown);
    }
    this.joystick?.destroy();
    this.joystick = null;
    this.interactButton?.destroy();
    this.interactButton = null;
  }

  private onAnyKeyDown(): void {
    if (this.mode !== 'touch') return;

    // Switch to keyboard mode — hide touch controls
    this.mode = 'keyboard';
    this.scene.input.keyboard?.off('keydown', this.boundKeyDown);

    this.joystick?.destroy();
    this.joystick = null;
    this.interactButton?.destroy();
    this.interactButton = null;

    this.scene.events.emit('input-mode-changed', 'keyboard');
  }
}
