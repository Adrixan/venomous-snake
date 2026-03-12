import type {
  Room,
  RoomConnection,
  GameAction,
  NarrativeEntry,
  TextAdventureState,
} from '@venomous-snake/shared-types';
import { EventBus } from './EventBus';
import { GameWorld } from './rooms/world';
import { allRooms } from './rooms/definitions';
import { roomNarratives, npcDialogs, floorIntros, gameIntro, gameVictory } from './narrative';

const ALL_CHALLENGE_IDS: string[] = allRooms.flatMap((room) =>
  room.terminals.map((t) => t.challengeId),
);

/** Human-readable room names derived from room IDs */
function humanizeRoomId(id: string): string {
  return id
    .replace(
      /^(floor\d+_|lobby_|server_|research_|surveillance_|archives_|comms_|executive_|manufacturing_|network_|ai_core_|rooftop_)/,
      '',
    )
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Build the zero-padded floor key used in floorIntros (e.g. "floor_00"). */
function floorKey(floor: number): string {
  return `floor_${String(floor).padStart(2, '0')}`;
}

export class TextAdventureEngine {
  private world: GameWorld;
  private state: TextAdventureState;
  private completedChallenges: Set<string> = new Set();

  constructor(savedState?: TextAdventureState) {
    this.world = new GameWorld();
    allRooms.forEach((room) => this.world.registerRoom(room));

    if (savedState) {
      this.state = savedState;
    } else {
      this.state = {
        currentRoomId: this.world.getStartingRoomId(),
        visitedRooms: [],
        pickedUpItems: [],
        storyFlags: {},
        narrativeLog: [],
      };
    }
  }

  enterRoom(roomId: string): void {
    const room = this.world.getRoom(roomId);
    if (!room) return;

    const firstVisit = !this.state.visitedRooms.includes(roomId);
    this.state.currentRoomId = roomId;

    const narrative = roomNarratives[roomId];
    const fKey = floorKey(room.floor);

    if (firstVisit) {
      this.state.visitedRooms.push(roomId);

      // Show floor intro on first visit to a floor's first room
      if (!this.state.storyFlags[`${fKey}_arrived`]) {
        this.state.storyFlags[`${fKey}_arrived`] = true;
        const intro = floorIntros[fKey];
        if (intro) {
          this.addNarrative('cipher', intro.arrival, 'CIPHER');
          this.addNarrative('cipher', intro.briefing, 'CIPHER');
        }
      }

      // First visit text
      const firstVisitText = narrative?.firstVisit ?? room.firstVisitKey;
      if (firstVisitText) {
        this.addNarrative('description', firstVisitText);
      }

      // Auto-trigger NPC greeting on first visit
      for (const npc of room.npcs) {
        const dialog = npcDialogs[npc.id];
        if (dialog) {
          this.addNarrative('dialog', dialog.greeting, humanizeRoomId(npc.id));
          if (dialog.lines[0]) {
            this.addNarrative('dialog', dialog.lines[0], humanizeRoomId(npc.id));
          }
          this.state.storyFlags[`npc_${npc.id}_line`] = 1;
        }
      }
    } else {
      // Revisit text
      const revisitText = narrative?.revisit;
      if (revisitText) {
        this.addNarrative('description', revisitText);
      }
    }

    // Room description
    const descText = narrative?.description ?? room.descriptionKey;
    this.addNarrative('description', descText);

    // Guidance: tell the player what to do
    const remaining = room.terminals.filter((t) => !this.completedChallenges.has(t.challengeId));
    if (remaining.length > 0) {
      const count = remaining.length;
      this.addNarrative(
        'cipher',
        `I'm detecting ${String(count)} active terminal${count === 1 ? '' : 's'} in this area. Hack ${count === 1 ? 'it' : 'them all'} to proceed.`,
        'CIPHER',
      );
    } else {
      this.addNarrative(
        'cipher',
        'All terminals in this area are compromised. Move forward when ready.',
        'CIPHER',
      );
    }

    EventBus.emit({ type: 'ROOM_ENTER', payload: { roomId, firstVisit } });
  }

  getAvailableActions(completedChallenges: string[], inventory: string[]): GameAction[] {
    const room = this.getCurrentRoom();
    if (!room) return [];

    const mergedChallenges = [...new Set([...completedChallenges, ...this.completedChallenges])];

    const actions: GameAction[] = [];

    // Look action
    actions.push({
      id: `look_${room.id}`,
      type: 'look',
      label: 'Look around',
    });

    // Hack actions per incomplete terminal (shown before move for clarity)
    for (const terminal of room.terminals) {
      if (mergedChallenges.includes(terminal.challengeId)) continue;

      actions.push({
        id: `hack_${terminal.id}`,
        type: 'hack',
        label: `Hack terminal [${terminal.challengeId}]`,
        targetId: terminal.id,
      });
    }

    // Move actions per connection
    for (const conn of room.connections) {
      const unlocked = this.isConnectionUnlocked(conn, mergedChallenges, inventory);
      const targetName = humanizeRoomId(conn.targetRoomId);
      const moveAction: GameAction = {
        id: `move_${conn.targetRoomId}`,
        type: 'move',
        label: `Go ${conn.direction} → ${targetName}`,
        targetId: conn.targetRoomId,
      };
      if (!unlocked) {
        moveAction.disabled = true;
        moveAction.disabledReason = 'Access locked — complete required challenges first';
      }
      actions.push(moveAction);
    }

    return actions;
  }

  executeAction(action: GameAction, completedChallenges: string[], inventory: string[]): void {
    const room = this.getCurrentRoom();
    if (!room) return;

    const mergedChallenges = [...new Set([...completedChallenges, ...this.completedChallenges])];

    switch (action.type) {
      case 'look': {
        const narrative = roomNarratives[room.id];
        const descText = narrative?.description ?? room.descriptionKey;
        this.addNarrative('description', descText);

        // Also show terminal status
        const remaining = room.terminals.filter(
          (t) =>
            !this.completedChallenges.has(t.challengeId) &&
            !mergedChallenges.includes(t.challengeId),
        );
        if (remaining.length > 0) {
          this.addNarrative(
            'cipher',
            `${String(remaining.length)} terminal${remaining.length === 1 ? '' : 's'} still active in this area.`,
            'CIPHER',
          );
        } else {
          this.addNarrative('cipher', 'All terminals in this area are compromised.', 'CIPHER');
        }
        break;
      }

      case 'move': {
        const conn = room.connections.find((c) => c.targetRoomId === action.targetId);
        if (!conn) break;
        if (!this.isConnectionUnlocked(conn, mergedChallenges, inventory)) {
          this.addNarrative('system', 'Access locked — complete required challenges first.');
          EventBus.emit({
            type: 'ACCESS_DENIED',
            payload: {
              objectId: conn.targetRoomId,
              message: 'Connection locked',
            },
          });
          break;
        }
        EventBus.emit({
          type: 'ROOM_TRANSITION',
          payload: { from: this.state.currentRoomId, to: conn.targetRoomId },
        });
        this.enterRoom(conn.targetRoomId);
        break;
      }

      case 'hack': {
        const terminal = room.terminals.find((t) => t.id === action.targetId);
        if (!terminal) break;
        this.addNarrative('action', 'You approach the terminal and begin the hack sequence...');
        EventBus.emit({
          type: 'TERMINAL_OPEN',
          payload: {
            terminalId: terminal.id,
            challengeId: terminal.challengeId,
          },
        });
        break;
      }

      case 'examine': {
        if (!action.targetId) {
          this.addNarrative('description', room.descriptionKey);
          break;
        }
        const npc = room.npcs.find((n) => n.id === action.targetId);
        if (npc) {
          this.addNarrative('description', npc.descriptionKey);
          break;
        }
        const terminal = room.terminals.find((t) => t.id === action.targetId);
        if (terminal) {
          this.addNarrative('description', terminal.descriptionKey);
          break;
        }
        this.addNarrative('system', 'Nothing notable to examine.');
        break;
      }

      default:
        break;
    }
  }

  /** Seed internal challenge tracking from external state (e.g. store or save). */
  syncCompletedChallenges(challenges: string[]): void {
    for (const id of challenges) {
      this.completedChallenges.add(id);
    }
  }

  /**
   * Mark a challenge as complete. Provides room-level progress feedback,
   * checks floor-level completion, and auto-triggers NPC dialog as
   * appropriate for the story progression.
   */
  completeChallenge(challengeId: string): void {
    if (this.completedChallenges.has(challengeId)) return;
    this.completedChallenges.add(challengeId);

    const room = this.getCurrentRoom();
    if (!room) return;

    // Room-level progress feedback
    const roomChallengeIds = room.terminals.map((t) => t.challengeId);
    const remainingInRoom = roomChallengeIds.filter((id) => !this.completedChallenges.has(id));

    if (remainingInRoom.length > 0) {
      this.addNarrative(
        'cipher',
        `${String(remainingInRoom.length)} terminal${remainingInRoom.length === 1 ? '' : 's'} remaining in this area.`,
        'CIPHER',
      );
      return;
    }

    // All room terminals done — trigger NPC congratulation
    for (const npc of room.npcs) {
      const dialog = npcDialogs[npc.id];
      if (!dialog) continue;
      const flagKey = `npc_${npc.id}_line`;
      const lineIdx = this.state.storyFlags[flagKey] ? Number(this.state.storyFlags[flagKey]) : 1;
      if (dialog.lines[lineIdx]) {
        this.addNarrative('dialog', dialog.lines[lineIdx], humanizeRoomId(npc.id));
      }
      this.state.storyFlags[flagKey] = Math.min(lineIdx + 1, dialog.lines.length);
    }

    this.addNarrative(
      'cipher',
      'All terminals in this area are compromised. The path forward is open.',
      'CIPHER',
    );

    // Floor-level completion check
    const floorRooms = this.world.getRoomsForFloor(room.floor);
    const floorChallengeIds = floorRooms.flatMap((r) => r.terminals.map((t) => t.challengeId));
    if (floorChallengeIds.length === 0) return;

    const allFloorComplete = floorChallengeIds.every((id) => this.completedChallenges.has(id));
    if (allFloorComplete) {
      const nextFloor = room.floor + 1;
      const fKey = floorKey(room.floor);
      const intro = floorIntros[fKey];

      // Auto-trigger NPC postChallenge for all NPCs on this floor
      for (const floorRoom of floorRooms) {
        for (const npc of floorRoom.npcs) {
          const dialog = npcDialogs[npc.id];
          if (dialog?.postChallenge) {
            this.addNarrative('dialog', dialog.postChallenge, humanizeRoomId(npc.id));
          }
        }
      }

      if (intro) {
        this.addNarrative('cipher', intro.completion, 'CIPHER');
      } else {
        this.addNarrative(
          'system',
          `All challenges on floor ${String(room.floor)} complete! Access to floor ${String(nextFloor)} is now unlocked.`,
        );
      }
      EventBus.emit({
        type: 'FLOOR_COMPLETE',
        payload: { floorNumber: room.floor },
      });
      EventBus.emit({
        type: 'FLOOR_UNLOCKED',
        payload: { floor: nextFloor },
      });
    }
  }

  getCompletedChallenges(): string[] {
    return Array.from(this.completedChallenges);
  }

  getCurrentRoom(): Room | undefined {
    return this.world.getRoom(this.state.currentRoomId);
  }

  getState(): TextAdventureState {
    return this.state;
  }

  isConnectionUnlocked(
    connection: RoomConnection,
    completedChallenges: string[],
    inventory: string[],
  ): boolean {
    if (!connection.locked) return true;

    if (connection.requiredChallenges) {
      const allDone = connection.requiredChallenges.every((id) => completedChallenges.includes(id));
      if (!allDone) return false;
    }

    if (connection.requiredItem) {
      if (!inventory.includes(connection.requiredItem)) return false;
    }

    return true;
  }

  getNarrativeLog(): NarrativeEntry[] {
    return this.state.narrativeLog;
  }

  isGameComplete(): boolean {
    return ALL_CHALLENGE_IDS.every((id) => this.completedChallenges.has(id));
  }

  /** Get all challenge IDs for a given floor number */
  getFloorChallengeIds(floor: number): string[] {
    return this.world.getRoomsForFloor(floor).flatMap((r) => r.terminals.map((t) => t.challengeId));
  }

  /** Get the game intro text lines */
  static getGameIntro(): string[] {
    return gameIntro;
  }

  /** Get the game victory text lines */
  static getGameVictory(): string[] {
    return gameVictory;
  }

  private addNarrative(type: NarrativeEntry['type'], text: string, speaker?: string): void {
    const entry: NarrativeEntry = {
      id: `nar_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type,
      text,
      timestamp: Date.now(),
    };
    if (speaker !== undefined) {
      entry.speaker = speaker;
    }
    this.state.narrativeLog.push(entry);
    EventBus.emit({ type: 'NARRATIVE_APPEND', payload: entry });
  }
}
