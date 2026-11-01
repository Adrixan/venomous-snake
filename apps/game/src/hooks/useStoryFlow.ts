import { useCallback, useEffect, useRef, useState } from 'react';
import {
  introCutscene,
  getFloorTransitionCutscene,
  bossEncounterCutscene,
  victoryCutscene,
  TutorialManager,
} from '@venomous-snake/narrative';
import type { Cutscene, TutorialStep } from '@venomous-snake/narrative';
import { BOSS_CHALLENGE_ID, chapters } from '@venomous-snake/challenges';
import { EventBus } from '@venomous-snake/engine';
import { useGameStore } from '../store/gameStore';

const PLAY_TIMER_TICK_MS = 1000;

/** Adds to the saved play time while the player is actually in the game. */
function usePlayTimer(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      useGameStore.getState().addPlayTime(PLAY_TIMER_TICK_MS);
    }, PLAY_TIMER_TICK_MS);
    return () => clearInterval(id);
  }, [active]);
}

/** The challenge before the boss: solving it opens the final confrontation. */
const PRE_BOSS_CHALLENGE_ID = chapters.at(-1)?.challenges.at(-2);

export interface UseStoryFlowReturn {
  activeCutscene: Cutscene | null;
  showCredits: boolean;
  activeTutorialStep: TutorialStep | null;
  onCutsceneComplete: () => void;
  onCreditsClose: () => void;
  onTutorialStepComplete: () => void;
  onTutorialSkip: () => void;
  /** Call once when a new game starts to trigger the intro cutscene. */
  triggerNewGame: () => void;
  /** Call when the player moves to a new floor number. */
  triggerFloorTransition: (floor: number) => void;
  /** Offers the tutorial again from its first step. */
  restartTutorial: () => void;
}

export function useStoryFlow(playing: boolean): UseStoryFlowReturn {
  const [activeCutscene, setActiveCutscene] = useState<Cutscene | null>(null);
  const [showCredits, setShowCredits] = useState(false);
  const [activeTutorialStep, setActiveTutorialStep] = useState<TutorialStep | null>(null);
  const tutorialManagerRef = useRef<TutorialManager>(new TutorialManager());
  const cutsceneQueueRef = useRef<Cutscene[]>([]);

  usePlayTimer(playing && activeCutscene === null && !showCredits);

  const showNextQueued = useCallback((): void => {
    const next = cutsceneQueueRef.current.shift();
    if (next) {
      setActiveCutscene(next);
    }
  }, []);

  const enqueueCutscene = useCallback(
    (cutscene: Cutscene): void => {
      const { seenCutscenes, markCutsceneSeen } = useGameStore.getState();
      if (seenCutscenes.includes(cutscene.id)) return;
      markCutsceneSeen(cutscene.id);
      if (activeCutscene) {
        cutsceneQueueRef.current.push(cutscene);
      } else {
        setActiveCutscene(cutscene);
      }
    },
    [activeCutscene],
  );

  const onCutsceneComplete = useCallback((): void => {
    setActiveCutscene(null);
    showNextQueued();
  }, [showNextQueued]);

  const onCreditsClose = useCallback((): void => {
    setShowCredits(false);
  }, []);

  const onTutorialStepComplete = useCallback((): void => {
    if (activeTutorialStep === null) return;
    const manager = tutorialManagerRef.current;
    manager.completeStep(activeTutorialStep.id);
    setActiveTutorialStep(manager.getNextStep(activeTutorialStep.trigger) ?? null);
  }, [activeTutorialStep]);

  const onTutorialSkip = useCallback((): void => {
    tutorialManagerRef.current.skipTutorial();
    setActiveTutorialStep(null);
  }, []);

  const triggerNewGame = useCallback((): void => {
    tutorialManagerRef.current.reset();
    enqueueCutscene(introCutscene);
    // Queue movement tutorial step after intro
    const step = tutorialManagerRef.current.getNextStep('game_start');
    if (step) {
      setActiveTutorialStep(step);
    }
  }, [enqueueCutscene]);

  const triggerFloorTransition = useCallback(
    (floor: number): void => {
      const cutscene = getFloorTransitionCutscene(floor);
      if (cutscene) enqueueCutscene(cutscene);
    },
    [enqueueCutscene],
  );

  // Listen for FLOOR_UNLOCKED events from the game engine
  useEffect(() => {
    const unsub = EventBus.on((event) => {
      if (event.type === 'FLOOR_UNLOCKED') {
        triggerFloorTransition(event.payload.floor);
      }
    });
    return unsub;
  }, [triggerFloorTransition]);

  // Listen for CHALLENGE_COMPLETED to detect the boss fight and victory
  useEffect(() => {
    const unsub = EventBus.on((event) => {
      if (event.type !== 'CHALLENGE_COMPLETED') return;
      const { challengeId } = event.payload;

      if (challengeId === BOSS_CHALLENGE_ID) {
        // Play the victory cutscene then show credits
        enqueueCutscene(victoryCutscene);
        return;
      }

      // Show "boss encounter" when approaching the final challenge
      // (first time reaching ch12's last challenge)
      if (challengeId === PRE_BOSS_CHALLENGE_ID) {
        enqueueCutscene(bossEncounterCutscene);
        return;
      }

      // Tutorial: first challenge success
      const step = tutorialManagerRef.current.getNextStep('first_success');
      if (step) setActiveTutorialStep(step);
    });
    return unsub;
  }, [enqueueCutscene]);

  // Show credits after the victory cutscene finishes
  const prevCutsceneRef = useRef<Cutscene | null>(null);
  useEffect(() => {
    const prev = prevCutsceneRef.current;
    prevCutsceneRef.current = activeCutscene;
    if (prev?.id === 'victory' && activeCutscene === null) {
      setShowCredits(true);
    }
  }, [activeCutscene]);

  // Tutorial: show terminal-basics when a terminal opens
  useEffect(() => {
    const unsub = EventBus.on((event) => {
      if (event.type !== 'TERMINAL_OPEN') return;
      const step = tutorialManagerRef.current.getNextStep('first_terminal');
      if (step) setActiveTutorialStep(step);
    });
    return unsub;
  }, []);

  const restartTutorial = useCallback((): void => {
    tutorialManagerRef.current.reset();
    setActiveTutorialStep(tutorialManagerRef.current.getNextStep('game_start') ?? null);
  }, []);

  return {
    activeCutscene,
    showCredits,
    activeTutorialStep,
    onCutsceneComplete,
    onCreditsClose,
    onTutorialStepComplete,
    onTutorialSkip,
    triggerNewGame,
    triggerFloorTransition,
    restartTutorial,
  };
}
