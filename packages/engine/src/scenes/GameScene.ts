import Phaser from 'phaser';
import { EventBus } from '../EventBus';
import { Player } from '../entities/Player';
import { InteractiveObject } from '../entities/InteractiveObject';
import { TilemapManager } from '../tilemap/TilemapManager';
import { CameraSystem } from '../systems/CameraSystem';
import type { RoomConfig } from '../tilemap/ProceduralRoom';

export interface GameSceneData {
  roomKey?: string;
}

const LOBBY_CONFIG: RoomConfig = {
  name: 'lobby',
  width: 25,
  height: 19,
  tileSize: 32,
  doors: [{ side: 'east', position: 9, targetRoom: 'office' }],
  objects: [
    { type: 'terminal', tileX: 12, tileY: 5, id: 'terminal_lobby_01' },
    { type: 'terminal', tileX: 6, tileY: 8, id: 'terminal_lobby_02' },
  ],
};

export class GameScene extends Phaser.Scene {
  private player: Player | undefined;
  private cameraSystem: CameraSystem | undefined;
  private interactiveObjects: InteractiveObject[] = [];
  private unsubscribeEventBus: (() => void) | undefined;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(_data: GameSceneData): void {
    const { map, collisionLayer, interactiveObjects: objData } =
      TilemapManager.createTestRoom(this, LOBBY_CONFIG);

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Player
    Player.createPlaceholderTexture(this);
    this.player = new Player(this, 5 * 32 + 16, 9 * 32 + 16);
    this.physics.add.collider(this.player, collisionLayer);

    // Camera
    this.cameraSystem = new CameraSystem(this);
    this.cameraSystem.followPlayer(this.player, { lerpX: 0.1, lerpY: 0.1 });
    this.cameraSystem.setBoundsFromMap(map);

    // Interactive objects
    for (const obj of objData) {
      const color =
        obj.type === 'terminal' ? 0x00b4d8 : obj.type === 'door' ? 0x2d6a4f : 0xffaa00;
      const prompt =
        obj.type === 'terminal' ? 'Press [E] to use terminal' : 'Press [E] to enter';

      const onInteract: (() => void) | undefined =
        obj.type === 'door' && obj.targetRoom !== undefined
          ? () => {
              const targetRoom = obj.targetRoom;
              if (targetRoom !== undefined) {
                this.cameraSystem?.transitionToRoom(targetRoom);
              }
            }
          : undefined;

      const interactObj = new InteractiveObject(this, {
        id: obj.id,
        x: obj.x,
        y: obj.y,
        width: 28,
        height: 28,
        promptText: prompt,
        color,
        interactionRadius: 64,
        ...(onInteract !== undefined ? { onInteract } : {}),
      });
      this.interactiveObjects.push(interactObj);
    }

    // EventBus subscriptions – unsubscribe when the scene shuts down
    this.unsubscribeEventBus = EventBus.on((event) => {
      if (event.type === 'GAME_PAUSE') {
        this.scene.pause();
      } else if (event.type === 'GAME_RESUME') {
        this.scene.resume();
      }
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.unsubscribeEventBus?.();
    });

    EventBus.emit({ type: 'SCENE_CHANGE', payload: { sceneKey: 'GameScene' } });
  }

  update(): void {
    if (!this.player) return;

    this.player.handleInput();

    const px = this.player.x;
    const py = this.player.y;

    for (const obj of this.interactiveObjects) {
      obj.checkProximity({ x: px, y: py });
    }

    EventBus.emit({
      type: 'PLAYER_MOVE',
      payload: { x: px, y: py },
    });
  }
}
