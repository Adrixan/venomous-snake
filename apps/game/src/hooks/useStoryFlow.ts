import { useCallback, useEffect, useRef, useState } from 'react';
import {
  introCutscene,
  getFloorTransitionCutscene,
  bossEncounterCutscene,
  victoryCutscene,
  TutorialManager,
} from '@venomous-snake/narrative';
import type { Cutscene, TutorialStep } from '@venomous-snake/narrative';
import { EventBus } from '@venomous-snake/engine';

/**
 * Tracks how many seconds the current game session has been running.
 */
function usePlayTimer(active: boolean): number {
  const [seconds, setSeconds] = useState(0);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  return seconds;
}

/** Boss challenge ID — the final challenge on floor 12. */
const BOSS_CHALLENGE_ID = 'ch12_10';

export interface UseStoryFlowReturn {
  activeCutscene: Cutscene | null;
  showCredits: boolean;
  activeTutorialStep: TutorialStep | null;
  /** Seconds played during this session */
  playTime: number;
  onCutsceneComplete: () => void;
  onCreditsClose: () => void;
  onTutorialStepComplete: () => void;
  onTutorialSkip: () => void;
  /** Call once when a new game starts to trigger the intro cutscene. */
  triggerNewGame: () => void;
  /** Call when the player moves to a new floor number. */
  triggerFloorTransition: (floor: number) => void;
  /** Whether New Game+ flag is set (keep skills, restart story). */
  isNewGamePlus: boolean;
  /** Call from the CreditsScreen "New Game+" button. */
  onNewGamePlus: () => void;
}

const NEW_GAME_PLUS_KEY = 'venomous_snake_ng_plus';

export function useStoryFlow(completedChallenges: string[]): UseStoryFlowReturn {
  const [activeCutscene, setActiveCutscene] = useState<Cutscene | null>(null);
  const [showCredits, setShowCredits] = useState(false);
  const [activeTutorialStep, setActiveTutorialStep] = useState<TutorialStep | null>(null);
  const [isNewGamePlus, setIsNewGamePlus] = useState(
    () => localStorage.getItem(NEW_GAME_PLUS_KEY) === '1',
  );

  const tutorialManagerRef = useRef<TutorialManager>(new TutorialManager());
  const cutsceneQueueRef = useRef<Cutscene[]>([]);
  const seenFloorTransitionsRef = useRef<Set<number>>(new Set());

  // Track play time while not in cutscene/credits
  const playing = !activeCutscene && !showCredits;
  const playTime = usePlayTimer(playing);

  const showNextQueued = useCallback((): void => {
    const next = cutsceneQueueRef.current.shift();
    if (next) {
      setActiveCutscene(next);
    }
  }, []);

  const enqueueCutscene = useCallback(
    (cutscene: Cutscene): void => {
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
    if (activeTutorialStep) {
      tutorialManagerRef.current.completeStep(activeTutorialStep.id);
    }
    setActiveTutorialStep(null);
  }, [activeTutorialStep]);

  const onTutorialSkip = useCallback((): void => {
    tutorialManagerRef.current.skipTutorial();
    setActiveTutorialStep(null);
  }, []);

  const triggerNewGame = useCallback((): void => {
    tutorialManagerRef.current.reset();
    seenFloorTransitionsRef.current.clear();
    setIsNewGamePlus(false);
    enqueueCutscene(introCutscene);
    // Queue movement tutorial step after intro
    const step = tutorialManagerRef.current.getNextStep('game_start');
    if (step) {
      setActiveTutorialStep(step);
    }
  }, [enqueueCutscene]);

  const triggerFloorTransition = useCallback(
    (floor: number): void => {
      if (seenFloorTransitionsRef.current.has(floor)) return;
      seenFloorTransitionsRef.current.add(floor);
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
      if (challengeId === 'ch12_09' && !completedChallenges.includes(BOSS_CHALLENGE_ID)) {
        enqueueCutscene(bossEncounterCutscene);
        return;
      }

      // Tutorial: first challenge success
      const step = tutorialManagerRef.current.getNextStep('first_success');
      if (step) setActiveTutorialStep(step);
    });
    return unsub;
  }, [completedChallenges, enqueueCutscene]);

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

  const handleNewGamePlus = useCallback((): void => {
    localStorage.setItem(NEW_GAME_PLUS_KEY, '1');
    setIsNewGamePlus(true);
    setShowCredits(false);
  }, []);

  // Expose handleNewGamePlus so credits screen can use it

  return {
    activeCutscene,
    showCredits,
    activeTutorialStep,
    playTime,
    onCutsceneComplete,
    onCreditsClose,
    onTutorialStepComplete,
    onTutorialSkip,
    triggerNewGame,
    triggerFloorTransition,
    isNewGamePlus,
    onNewGamePlus: handleNewGamePlus,
  };
}
