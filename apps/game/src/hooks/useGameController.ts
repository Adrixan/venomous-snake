import React, { createContext, useContext, useRef, useEffect } from 'react';
import { GameController } from '../GameController';
import { useGameStore } from '../store/gameStore';
import { EventBus } from '@venomous-snake/engine';
import { ACHIEVEMENTS } from '@venomous-snake/challenge-engine';
import type {
  PythonInterpreter,
  CurriculumProgress,
  ChallengeResultState,
} from '@venomous-snake/shared-types';
import type { StartChallengeResult, SubmitResult, HintResult } from '../GameController';

// ── Context ──────────────────────────────────────────────────────────────────

const GameControllerContext = createContext<GameController | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────

export interface GameControllerProviderProps {
  interpreter: PythonInterpreter;
  savedProgress?: CurriculumProgress | undefined;
  /** Optional ref to expose the controller instance to the parent. */
  controllerRef?: React.MutableRefObject<GameController | null>;
  children: React.ReactNode;
}

/**
 * Provides a GameController instance to the React tree and wires its results
 * to the Zustand store via EventBus listeners.
 *
 * Mount this only while the game is actively playing so the controller
 * lifecycle is tightly coupled to the playing session.
 */
export function GameControllerProvider({
  interpreter,
  savedProgress,
  controllerRef,
  children,
}: GameControllerProviderProps): React.JSX.Element {
  const localRef = useRef<GameController | null>(null);
  const hasFirstPickupRef = useRef(false);

  if (localRef.current === null) {
    localRef.current =
      savedProgress !== undefined
        ? new GameController(interpreter, savedProgress)
        : new GameController(interpreter);
  }

  // Expose the controller instance to the parent via the optional ref.
  if (controllerRef !== undefined) {
    controllerRef.current = localRef.current;
  }

  // Wire EventBus → Zustand store
  useEffect(() => {
    const store = useGameStore.getState();

    const unsubscribe = EventBus.on((event) => {
      switch (event.type) {
        case 'CHALLENGE_STARTED':
          store.setActiveChallenge(event.payload.challengeId);
          store.setChallengeResult(null);
          break;

        case 'CHALLENGE_RESULT': {
          const { xpEarned, ...resultState } = event.payload;
          store.setChallengeResult(resultState);
          if (event.payload.passed) {
            store.addXp(xpEarned);
          }
          break;
        }

        case 'CHALLENGE_COMPLETED':
          store.addCompletedChallenge(event.payload.challengeId);
          store.setActiveChallenge(null);
          break;

        case 'CHALLENGE_ABANDONED':
          store.setActiveChallenge(null);
          break;

        case 'XP_CHANGED':
          // Sync absolute XP/level from the progression system
          store.addXp(event.payload.xp - useGameStore.getState().xp);
          store.setLevel(event.payload.level);
          break;

        case 'ACHIEVEMENT_UNLOCKED':
          // Future: surface as toast notification
          console.info('[Achievement unlocked]', event.payload.nameKey);
          break;

        case 'ITEM_PICKUP': {
          if (!hasFirstPickupRef.current) {
            hasFirstPickupRef.current = true;
            EventBus.emit({
              type: 'ACHIEVEMENT_UNLOCKED',
              payload: { id: 'first_pickup', nameKey: 'achievements.first_pickup' },
            });
          }
          break;
        }

        case 'FLOOR_UNLOCKED': {
          store.unlockFloor(event.payload.floor);
          const floorId = `floor_${event.payload.floor}`;
          const floorAchievement = ACHIEVEMENTS.find(
            (a) => a.trigger.type === 'floor_unlock' && a.trigger.floor === floorId,
          );
          if (floorAchievement !== undefined) {
            EventBus.emit({
              type: 'ACHIEVEMENT_UNLOCKED',
              payload: { id: floorAchievement.id, nameKey: floorAchievement.nameKey },
            });
          }
          break;
        }

        case 'FLOOR_CHANGE':
          store.setCurrentFloor(event.payload.targetFloor);
          break;

        case 'DIALOG_TRIGGERED':
          store.setDialog(event.payload);
          break;

        case 'DIALOG_DISMISSED':
          store.clearDialog();
          break;

        default:
          break;
      }
    });

    return unsubscribe;
  }, []);

  return React.createElement(GameControllerContext.Provider, { value: localRef.current }, children);
}

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns the GameController instance provided by the nearest
 * `GameControllerProvider`. Throws if called outside of one.
 */
export function useGameController(): GameController {
  const controller = useContext(GameControllerContext);
  if (controller === null) {
    throw new Error('useGameController must be used within a GameControllerProvider');
  }
  return controller;
}

// ── Wired actions ─────────────────────────────────────────────────────────────

/**
 * Returns controller action wrappers that automatically emit the appropriate
 * EventBus events so the store stays in sync without manual event plumbing in
 * each component.
 */
export function useGameActions(): {
  startChallenge: (id: string) => StartChallengeResult | null;
  submitCode: (code: string) => Promise<SubmitResult>;
  getHint: () => HintResult | null;
  abandonChallenge: () => void;
  changeFloor: (floorNumber: number) => boolean;
} {
  const controller = useGameController();

  function startChallenge(id: string): StartChallengeResult | null {
    const result = controller.startChallenge(id);
    if (result !== null) {
      EventBus.emit({
        type: 'CHALLENGE_STARTED',
        payload: { challengeId: id, cipherIntro: result.cipherIntro },
      });
    }
    return result;
  }

  async function submitCode(code: string): Promise<SubmitResult> {
    const challengeId = useGameStore.getState().activeChallengeId;
    const result = await controller.submitCode(code);

    const firstFailedTest = result.testResults.find((t) => !t.passed);
    const errorText = firstFailedTest?.error;

    const resultState: ChallengeResultState =
      errorText !== undefined
        ? { passed: result.passed, output: buildOutput(result), error: errorText }
        : { passed: result.passed, output: buildOutput(result) };

    EventBus.emit({
      type: 'CHALLENGE_RESULT',
      payload: { ...resultState, xpEarned: result.xpEarned },
    });

    if (result.passed && challengeId !== null) {
      EventBus.emit({ type: 'CHALLENGE_COMPLETED', payload: { challengeId } });

      const newLevel = result.newLevel;
      if (newLevel !== null) {
        const currentXp = useGameStore.getState().xp + result.xpEarned;
        EventBus.emit({ type: 'XP_CHANGED', payload: { xp: currentXp, level: newLevel.level } });
      }

      for (const achievement of result.achievements) {
        EventBus.emit({
          type: 'ACHIEVEMENT_UNLOCKED',
          payload: { id: achievement.id, nameKey: achievement.nameKey },
        });
      }
    }

    return result;
  }

  function getHint(): HintResult | null {
    return controller.getHint();
  }

  function abandonChallenge(): void {
    controller.abandonChallenge();
    EventBus.emit({ type: 'CHALLENGE_ABANDONED' });
  }

  function changeFloor(floorNumber: number): boolean {
    const unlockedFloors = useGameStore.getState().unlockedFloors;
    return controller.changeFloor(floorNumber, unlockedFloors);
  }

  return { startChallenge, submitCode, getHint, abandonChallenge, changeFloor };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildOutput(result: SubmitResult): string {
  return result.testResults
    .map((t) => t.actualOutput ?? t.error ?? '')
    .filter(Boolean)
    .join('\n');
}
