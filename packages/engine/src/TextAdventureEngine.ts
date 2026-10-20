import type {
  Room,
  RoomConnection,
  GameAction,
  NarrativeEntry,
  TextAdventureState,
  EngineSnapshot,
  TextParams,
} from '@venomous-snake/shared-types';
import { FLOORS } from '@venomous-snake/challenges';
import { EventBus } from './EventBus';
import { getRoomById, START_ROOM_ID, ALL_CHALLENGE_IDS } from './rooms/world';
import { GAME_INTRO, GAME_VICTORY } from './narrative/intro';
import type { ScriptedLine } from './narrative/intro';

function floorArrivedFlag(floor: number): string {
  return `floor_${String(floor)}_arrived`;
}

/**
 * The text adventure: rooms, movement, terminals and conversations. All player
 * facing text is emitted as translation keys, so the log re-renders correctly
 * when the language changes.
 */
export class TextAdventureEngine {
  private state: TextAdventureState;
  private readonly completed: Set<string>;

  constructor(snapshot?: EngineSnapshot) {
    this.completed = new Set(snapshot?.completedChallenges ?? []);
    const room = snapshot !== undefined && getRoomById(snapshot.currentRoomId) !== undefined;
    this.state = {
      currentRoomId: room && snapshot !== undefined ? snapshot.currentRoomId : START_ROOM_ID,
      visitedRooms: [...(snapshot?.visitedRooms ?? [])],
      storyFlags: { ...(snapshot?.storyFlags ?? {}) },
      narrativeLog: [],
    };
  }

  /** The persistent state, ready to be saved. */
  toSnapshot(): EngineSnapshot {
    return {
      currentRoomId: this.state.currentRoomId,
      visitedRooms: [...this.state.visitedRooms],
      storyFlags: { ...this.state.storyFlags },
      completedChallenges: [...this.completed],
    };
  }

  /** Puts the player into a room and narrates the arrival. */
  enterRoom(roomId: string): void {
    const room = getRoomById(roomId);
    if (room === undefined) return;

    const firstVisit = !this.state.visitedRooms.includes(roomId);
    this.state.currentRoomId = roomId;

    if (firstVisit) {
      this.state.visitedRooms.push(roomId);
    }

    this.announceFloorIfNew(room);

    if (firstVisit) {
      this.say('description', `story.rooms.${roomId}.first_visit`);
      for (const npc of room.npcs) {
        this.say('system', 'story.engine.npc_here', { nameKey: npc.nameKey });
      }
    } else {
      this.say('description', `story.rooms.${roomId}.revisit`);
    }
    this.say('description', `story.rooms.${roomId}.description`);

    const remaining = this.remainingTerminals(room);
    if (remaining > 0) {
      this.say('cipher', 'story.engine.terminals_active', { count: remaining });
    } else if (room.terminals.length > 0) {
      this.say('cipher', 'story.engine.all_compromised');
    }

    EventBus.emit({ type: 'ROOM_ENTER', payload: { roomId, firstVisit } });
  }

  getAvailableActions(): GameAction[] {
    const room = this.getCurrentRoom();
    if (room === undefined) return [];

    const actions: GameAction[] = [
      { id: `look_${room.id}`, type: 'look', label: 'Look around', labelKey: 'story.actions.look' },
    ];

    for (const npc of room.npcs) {
      actions.push({
        id: `talk_${npc.id}`,
        type: 'talk',
        label: npc.id,
        labelKey: 'story.actions.talk',
        labelParams: { nameKey: npc.nameKey },
        targetId: npc.id,
      });
    }

    for (const terminal of room.terminals) {
      if (this.completed.has(terminal.challengeId)) continue;
      actions.push({
        id: `hack_${terminal.id}`,
        type: 'hack',
        label: terminal.challengeId,
        labelKey: 'story.actions.hack',
        labelParams: { targetKey: terminal.nameKey },
        targetId: terminal.id,
      });
    }

    for (const connection of room.connections) {
      const target = getRoomById(connection.targetRoomId);
      const action: GameAction = {
        id: `move_${connection.targetRoomId}`,
        type: 'move',
        label: connection.targetRoomId,
        labelKey: 'story.actions.move',
        labelParams: {
          directionKey: `story.direction.${connection.direction}`,
          roomKey: target?.nameKey ?? connection.targetRoomId,
        },
        targetId: connection.targetRoomId,
      };
      if (!this.isConnectionUnlocked(connection)) {
        const missing = (connection.requiredChallenges ?? []).filter(
          (id) => !this.completed.has(id),
        );
        action.disabled = true;
        action.disabledReason = 'Locked';
        action.disabledReasonKey = 'story.actions.locked';
        if (missing.length > 0) action.disabledReasonParams = { count: missing.length };
      }
      actions.push(action);
    }

    return actions;
  }

  syncCompletedChallenges(challenges: string[]): void {
    for (const id of challenges) this.completed.add(id);
  }

  executeAction(action: GameAction): void {
    const room = this.getCurrentRoom();
    if (room === undefined || action.disabled === true) return;

    switch (action.type) {
      case 'look': {
        this.say('description', `story.rooms.${room.id}.description`);
        const remaining = this.remainingTerminals(room);
        if (remaining > 0) {
          this.say('cipher', 'story.engine.terminals_still', { count: remaining });
        } else if (room.terminals.length > 0) {
          this.say('cipher', 'story.engine.all_compromised_short');
        }
        break;
      }

      case 'move': {
        const connection = room.connections.find((c) => c.targetRoomId === action.targetId);
        if (connection === undefined) break;
        if (!this.isConnectionUnlocked(connection)) {
          this.say('system', 'story.engine.access_denied');
          EventBus.emit({
            type: 'ACCESS_DENIED',
            payload: { objectId: connection.targetRoomId, message: 'Connection locked' },
          });
          break;
        }
        EventBus.emit({
          type: 'ROOM_TRANSITION',
          payload: { from: this.state.currentRoomId, to: connection.targetRoomId },
        });
        this.enterRoom(connection.targetRoomId);
        break;
      }

      case 'hack': {
        const terminal = room.terminals.find((t) => t.id === action.targetId);
        if (terminal === undefined || this.completed.has(terminal.challengeId)) break;
        this.say('action', 'story.engine.approach_terminal');
        EventBus.emit({
          type: 'TERMINAL_OPEN',
          payload: { terminalId: terminal.id, challengeId: terminal.challengeId },
        });
        break;
      }

      case 'talk': {
        const npc = room.npcs.find((n) => n.id === action.targetId);
        if (npc === undefined) break;
        EventBus.emit({ type: 'DIALOG_START', payload: { npcId: npc.id, dialogId: npc.dialogId } });
        break;
      }

      default:
        break;
    }
  }

  /**
   * Records a solved challenge and narrates the consequences for the room and the
   * floor. Progression events are emitted by the game controller, not here.
   */
  completeChallenge(challengeId: string): void {
    if (this.completed.has(challengeId)) return;
    this.completed.add(challengeId);

    const room = this.getCurrentRoom();
    if (room === undefined) return;
    if (!room.terminals.some((t) => t.challengeId === challengeId)) return;

    const remaining = this.remainingTerminals(room);
    if (remaining > 0) {
      this.say('cipher', 'story.engine.terminals_left', { count: remaining });
      return;
    }
    this.say('cipher', 'story.engine.all_compromised_open');

    if (this.isFloorComplete(room.floor)) {
      this.say('cipher', `story.floors.${String(room.floor)}.completion`);
    }
  }

  isFloorComplete(floor: number): boolean {
    const definition = FLOORS[floor];
    return (
      definition !== undefined && definition.challengeIds.every((id) => this.completed.has(id))
    );
  }

  getCompletedChallenges(): string[] {
    return [...this.completed];
  }

  getCurrentRoom(): Room | undefined {
    return getRoomById(this.state.currentRoomId);
  }

  getState(): TextAdventureState {
    return this.state;
  }

  /** Narrative entries produced since the last call; the engine keeps no history. */
  drainNarrative(): NarrativeEntry[] {
    const entries = this.state.narrativeLog;
    this.state.narrativeLog = [];
    return entries;
  }

  isConnectionUnlocked(connection: RoomConnection): boolean {
    if (!connection.locked) return true;
    const required = connection.requiredChallenges ?? [];
    return required.length > 0 && required.every((id) => this.completed.has(id));
  }

  isGameComplete(): boolean {
    return ALL_CHALLENGE_IDS.every((id) => this.completed.has(id));
  }

  /** Narrative lines for the start of a new game. */
  static getGameIntro(): ScriptedLine[] {
    return GAME_INTRO;
  }

  static getGameVictory(): ScriptedLine[] {
    return GAME_VICTORY;
  }

  /** Appends a keyed entry to the narrative log. */
  say(type: NarrativeEntry['type'], key: string, params?: TextParams): void {
    const entry: NarrativeEntry = {
      id: `nar_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type,
      text: key,
      textKey: key,
      timestamp: Date.now(),
      ...(type === 'cipher' ? { speaker: 'CIPHER' } : {}),
      ...(params !== undefined ? { textParams: params } : {}),
    };
    this.state.narrativeLog.push(entry);
  }

  private announceFloorIfNew(room: Room): void {
    const flag = floorArrivedFlag(room.floor);
    if (this.state.storyFlags[flag] === true) return;
    this.state.storyFlags[flag] = true;
    this.say('cipher', `story.floors.${String(room.floor)}.arrival`);
    this.say('cipher', `story.floors.${String(room.floor)}.briefing`);
    EventBus.emit({ type: 'FLOOR_ARRIVED', payload: { floor: room.floor } });
  }

  private remainingTerminals(room: Room): number {
    return room.terminals.filter((t) => !this.completed.has(t.challengeId)).length;
  }
}
