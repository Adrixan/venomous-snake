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

    if (firstVisit) {
      this.state.visitedRooms.push(roomId);

      // Show floor intro on first visit to a floor's first room
      const floorKey = `floor${String(room.floor)}`;
      if (!this.state.storyFlags[`${floorKey}_arrived`]) {
        this.state.storyFlags[`${floorKey}_arrived`] = true;
        const intro = floorIntros[floorKey];
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

    // Talk actions per NPC
    for (const npc of room.npcs) {
      if (npc.appearsWhen?.some((f) => !this.state.storyFlags[f])) continue;
      if (npc.disappearsWhen?.some((f) => this.state.storyFlags[f])) continue;

      const npcName = npcDialogs[npc.id] ? humanizeRoomId(npc.id) : npc.nameKey;
      actions.push({
        id: `talk_${npc.id}`,
        type: 'talk',
        label: `Talk to ${npcName}`,
        targetId: npc.id,
      });
    }

    // Hack actions per incomplete terminal
    for (const terminal of room.terminals) {
      if (mergedChallenges.includes(terminal.challengeId)) continue;

      actions.push({
        id: `hack_${terminal.id}`,
        type: 'hack',
        label: `Hack terminal [${terminal.challengeId}]`,
        targetId: terminal.id,
      });
    }

    // Pickup actions per available item
    for (const item of room.items) {
      if (this.state.pickedUpItems.includes(item.id)) continue;
      if (item.appearsWhen?.some((f) => !this.state.storyFlags[f])) continue;

      actions.push({
        id: `pickup_${item.id}`,
        type: 'pickup',
        label: `Pick up ${item.nameKey}`,
        targetId: item.id,
      });
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
        break;
      }

      case 'move': {
        const conn = room.connections.find((c) => c.targetRoomId === action.targetId);
        if (!conn) break;
        if (!this.isConnectionUnlocked(conn, mergedChallenges, inventory)) {
          this.addNarrative('system', 'Access locked — complete required challenges first');
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

      case 'talk': {
        const npc = room.npcs.find((n) => n.id === action.targetId);
        if (!npc) break;
        const dialog = npcDialogs[npc.id];
        if (dialog) {
          // Check if floor challenges are done for postChallenge variant
          const floorChallenges = this.getFloorChallengeIds(room.floor);
          const allFloorDone = floorChallenges.every((id) => mergedChallenges.includes(id));
          if (allFloorDone && dialog.postChallenge) {
            this.addNarrative('dialog', dialog.postChallenge, humanizeRoomId(npc.id));
          } else {
            // Cycle through dialog lines
            const flagKey = `npc_${npc.id}_line`;
            const lineIdx = this.state.storyFlags[flagKey]
              ? Number(this.state.storyFlags[flagKey])
              : 0;
            this.addNarrative('dialog', dialog.greeting, humanizeRoomId(npc.id));
            if (dialog.lines[lineIdx]) {
              this.addNarrative('dialog', dialog.lines[lineIdx], humanizeRoomId(npc.id));
            }
            this.state.storyFlags[flagKey] = (lineIdx + 1) % Math.max(dialog.lines.length, 1);
          }
        } else {
          this.addNarrative('dialog', npc.descriptionKey, npc.nameKey);
        }
        EventBus.emit({
          type: 'DIALOG_START',
          payload: { npcId: npc.id, dialogId: npc.dialogId },
        });
        break;
      }

      case 'hack': {
        const terminal = room.terminals.find((t) => t.id === action.targetId);
        if (!terminal) break;
        this.addNarrative('action', `You approach the terminal and begin the hack sequence...`);
        EventBus.emit({
          type: 'TERMINAL_OPEN',
          payload: {
            terminalId: terminal.id,
            challengeId: terminal.challengeId,
          },
        });
        break;
      }

      case 'pickup': {
        const item = room.items.find((i) => i.id === action.targetId);
        if (!item) break;
        if (this.state.pickedUpItems.includes(item.id)) break;
        this.state.pickedUpItems.push(item.id);
        this.addNarrative('action', item.descriptionKey);
        EventBus.emit({
          type: 'ITEM_PICKUP',
          payload: {
            itemId: item.id,
            name: item.nameKey,
            description: item.descriptionKey,
            itemType: item.itemType,
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
        const item = room.items.find((i) => i.id === action.targetId);
        if (item) {
          this.addNarrative('description', item.descriptionKey);
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
   * Mark a challenge as complete. Checks whether all challenges on the
   * current floor are now done and, if so, emits a FLOOR_COMPLETE event
   * and adds a narrative entry about the next floor being unlocked.
   */
  completeChallenge(challengeId: string): void {
    if (this.completedChallenges.has(challengeId)) return;
    this.completedChallenges.add(challengeId);

    const room = this.getCurrentRoom();
    if (!room) return;

    const floorRooms = this.world.getRoomsForFloor(room.floor);
    const floorChallengeIds = floorRooms.flatMap((r) => r.terminals.map((t) => t.challengeId));
    if (floorChallengeIds.length === 0) return;

    const allFloorComplete = floorChallengeIds.every((id) => this.completedChallenges.has(id));
    if (allFloorComplete) {
      const nextFloor = room.floor + 1;
      const floorKey = `floor${String(room.floor)}`;
      const intro = floorIntros[floorKey];
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
