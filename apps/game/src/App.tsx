import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { PWAInstallPrompt } from './pwa/PWAInstallPrompt';
import { PWAUpdateNotifier } from './pwa/PWAUpdateNotifier';
import { TerminalOverlay } from './components/TerminalOverlay';
import { SaveSlotModal } from './components/SaveSlotModal';
import { useGameStore } from './store/gameStore';
import { GameControllerProvider } from './hooks/useGameController';
import { useSaveSystem } from './hooks/useSaveSystem';
import { useGameAudio } from './hooks/useGameAudio';
import { useStoryFlow } from './hooks/useStoryFlow';
import { getSharedInterpreter, initializeSharedInterpreter } from '@venomous-snake/python-runtime';
import {
  MainMenu,
  NewGameFlow,
  SettingsPanel,
  PauseMenu,
  CRTEffect,
  AchievementToast,
  StoryTerminal,
  VictoryScreen,
  QuestLog,
  CipherDialog,
  CreditsScreen,
  CutscenePlayer,
  FloorAnnouncementOverlay,
  FloorProgressBar,
  FocusTrap,
  InventoryPanel,
  ItemPickupToast,
  LoadingScreen,
  LocaleSwitcher,
  SkillTreePanel,
  TutorialOverlay,
  TutorMode,
  useAnnounce,
  useCipher,
  FloorMap,
} from '@venomous-snake/ui';
import type {
  AudioSettingsPanelProps,
  ItemPickupNotification,
  ToastNotification,
} from '@venomous-snake/ui';
import { i18n } from '@venomous-snake/i18n';
import { ACHIEVEMENTS, SKILL_TREE, SkillTreeManager } from '@venomous-snake/challenge-engine';
import { chapters, FLOORS, TOTAL_CHALLENGES, floorIdFromNumber } from '@venomous-snake/challenges';
import type { SaveData } from '@venomous-snake/save-system';

import {
  EventBus,
  ITEMS,
  TextAdventureEngine,
  getItemsGrantedBy,
  getRoomDisplayName,
  getFirstRoomOfFloor,
} from '@venomous-snake/engine';
import type { ActivePanel, GameAction, NarrativeEntry } from '@venomous-snake/shared-types';
import type { CurriculumProgress } from '@venomous-snake/shared-types';
import type { GameController } from './GameController';
import { DialogOverlay, useDialog, useReducedMotion } from '@venomous-snake/ui';

const FLOOR_NUM_TO_ID: Record<number, string> = Object.fromEntries(
  FLOORS.map((floor) => [floor.number, floor.id]),
);

const FLOOR_ID_TO_NUM: Record<string, number> = Object.fromEntries(
  Object.entries(FLOOR_NUM_TO_ID).map(([num, id]) => [id, Number(num)]),
);

function toCurriculumProgress(data: SaveData): CurriculumProgress {
  const completed = Object.values(data.progress.challenges).filter((p) => p.completed).length;
  const completedIds = new Set(data.engine.completedChallenges);
  let unlockedMax = 0;
  for (const floor of FLOORS) {
    if (floor.challengeIds.every((id) => completedIds.has(id))) unlockedMax = floor.number + 1;
    else break;
  }
  const currentChapter =
    FLOORS.find((floor) => floor.challengeIds.some((id) => !completedIds.has(id)))?.chapterId ??
    FLOORS[FLOORS.length - 1]?.chapterId ??
    1;
  return {
    challenges: data.progress.challenges,
    currentChapter,
    totalXp: data.progress.totalXp,
    completedChallenges: completed,
    unlockedFloors: Array.from({ length: Math.min(unlockedMax + 1, FLOORS.length) }, (_, n) =>
      floorIdFromNumber(n),
    ),
  };
}

type MenuView = 'main' | 'newgame' | 'settings' | 'tutor';
type SaveModalMode = 'save' | 'load' | null;

export function App(): React.JSX.Element {
  const gamePhase = useGameStore((state) => state.gamePhase);
  const setGamePhase = useGameStore((state) => state.setGamePhase);
  const resetGameState = useGameStore((state) => state.resetGameState);
  const activePanel = useGameStore((state) => state.activePanel);
  const setActivePanel = useGameStore((state) => state.setActivePanel);
  const setPlayerName = useGameStore((state) => state.setPlayerName);
  const setPlayerGender = useGameStore((state) => state.setPlayerGender);
  const setCurrentFloor = useGameStore((state) => state.setCurrentFloor);
  const currentFloor = useGameStore((state) => state.currentFloor);
  const unlockedFloors = useGameStore((state) => state.unlockedFloors);
  const reducedMotion = useReducedMotion();
  const terminalOpen = useGameStore((state) => state.overlay.terminalOpen);
  const openTerminal = useGameStore((state) => state.openTerminal);
  const completedChallenges = useGameStore((state) => state.completedChallenges);
  // Items are rewards for solved challenges, so the inventory follows from progress.
  const inventoryItems = useMemo(
    () => ITEMS.filter((item) => completedChallenges.includes(item.grantedBy)),
    [completedChallenges],
  );
  const inventory = useMemo(() => inventoryItems.map((item) => item.id), [inventoryItems]);
  const dialog = useDialog({ inventory });
  const unlockedSkills = useGameStore((state) => state.unlockedSkills);
  const spentSkillXp = useGameStore((state) => state.spentSkillXp);
  const xp = useGameStore((state) => state.xp);
  const level = useGameStore((state) => state.level);
  const playerName = useGameStore((state) => state.playerName);
  const setCurrentRoom = useGameStore((state) => state.setCurrentRoom);
  const addVisitedRoom = useGameStore((state) => state.addVisitedRoom);
  const appendNarrative = useGameStore((state) => state.appendNarrative);
  const narrativeLog = useGameStore((state) => state.narrativeLog);
  const availableActions = useGameStore((state) => state.availableActions);
  const setAvailableActions = useGameStore((state) => state.setAvailableActions);
  const addCompletedChallenge = useGameStore((state) => state.addCompletedChallenge);
  const gameCompleted = useGameStore((state) => state.gameCompleted);
  const setGameCompleted = useGameStore((state) => state.setGameCompleted);

  // Audio store
  const masterVolume = useGameStore((s) => s.masterVolume);
  const musicVolume = useGameStore((s) => s.musicVolume);
  const sfxVolume = useGameStore((s) => s.sfxVolume);
  const isMuted = useGameStore((s) => s.isMuted);
  const setMasterVolume = useGameStore((s) => s.setMasterVolume);
  const setMusicVolume = useGameStore((s) => s.setMusicVolume);
  const setSfxVolume = useGameStore((s) => s.setSfxVolume);
  const toggleMute = useGameStore((s) => s.toggleMute);

  // Wire audio to game events
  useGameAudio();

  const audioSettings: AudioSettingsPanelProps = {
    masterVolume,
    musicVolume,
    sfxVolume,
    isMuted,
    onMasterVolume: setMasterVolume,
    onMusicVolume: setMusicVolume,
    onSfxVolume: setSfxVolume,
    onToggleMute: toggleMute,
  };

  const [menuView, setMenuView] = useState<MenuView>('main');
  const [hasSaveData, setHasSaveData] = useState(false);
  const [saveModalMode, setSaveModalMode] = useState<SaveModalMode>(null);
  const [savedProgress, setSavedProgress] = useState<CurriculumProgress | undefined>(undefined);
  const [sessionKey, setSessionKey] = useState(0);

  // Achievement notifications
  const [achievementNotifications, setAchievementNotifications] = useState<ToastNotification[]>([]);

  // Text adventure engine
  const engineRef = useRef<TextAdventureEngine | null>(null);
  /** Tracks how many engine narrative entries have been synced to the store. */
  const engineNarrativeSyncIndex = useRef(0);

  // Shared Python interpreter (Pyodide) — singleton
  const interpreterRef = useRef(getSharedInterpreter());

  // Start Pyodide loading early
  useEffect(() => {
    initializeSharedInterpreter().catch(() => undefined);
  }, []);

  // Ref exposed to GameControllerProvider
  const controllerRef = useRef<GameController | null>(null);
  const saveSystem = useSaveSystem(controllerRef);

  // Story flow: cutscenes, credits, tutorial
  const storyFlow = useStoryFlow(gamePhase === 'playing');
  const { activeCutscene, activeTutorialStep, showCredits, onCreditsClose, triggerNewGame } =
    storyFlow;
  const storyOverlayOpen = dialog.isOpen || activeCutscene !== null || showCredits;
  const announce = useAnnounce();
  const {
    cipher,
    currentMessage: cipherMessage,
    currentMood: cipherMood,
    dismissDialog: dismissCipher,
    showDialog: showCipherLine,
  } = useCipher();
  useEffect(() => {
    cipher.setPlayerName(playerName);
  }, [cipher, playerName]);
  const [itemNotifications, setItemNotifications] = useState<ItemPickupNotification[]>([]);
  const [announcedFloor, setAnnouncedFloor] = useState<number | null>(null);
  const [pythonLoading, setPythonLoading] = useState(false);

  useEffect(() => {
    const interpreter = interpreterRef.current;
    setPythonLoading(interpreter.getStatus() === 'loading');
    return interpreter.onStatusChange((status) => setPythonLoading(status === 'loading'));
  }, []);

  // Greet each floor the player reaches for the first time.
  const lastFloor = useRef(currentFloor);
  useEffect(() => {
    if (gamePhase === 'playing' && currentFloor > lastFloor.current) {
      setAnnouncedFloor(currentFloor);
      announce(i18n.t(`story:floors.${String(currentFloor)}.name`));
    }
    lastFloor.current = currentFloor;
  }, [currentFloor, gamePhase, announce]);

  // Refresh "has save data" flag
  const refreshHasSaveData = useCallback((): void => {
    void saveSystem
      .listSaves()
      .then((slots) => setHasSaveData(slots.length > 0))
      .catch((error: unknown) => {
        setHasSaveData(false);
        console.error('Unable to check saved games', error);
      });
  }, [saveSystem]);

  useEffect(() => {
    refreshHasSaveData();
  }, [refreshHasSaveData]);

  // Initialize the text adventure engine when entering playing phase
  useEffect(() => {
    if (gamePhase === 'playing' && engineRef.current === null) {
      const session = useGameStore.getState();
      engineRef.current = new TextAdventureEngine({
        currentRoomId: session.currentRoomId,
        visitedRooms: session.visitedRooms,
        storyFlags: session.storyFlags,
        completedChallenges: session.completedChallenges,
      });

      // Show game intro on new game (no completed challenges = fresh start)
      if (completedChallenges.length === 0) {
        const introLines = TextAdventureEngine.getGameIntro();
        for (const line of introLines) {
          const entry: NarrativeEntry = {
            id: `intro_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            type: line.type,
            text: line.key,
            textKey: line.key,
            timestamp: Date.now(),
          };
          if (line.type === 'cipher') {
            entry.speaker = 'CIPHER';
          }
          appendNarrative(entry);
        }
      }

      // Sync completed challenges from store
      engineRef.current.syncCompletedChallenges(completedChallenges);
      engineRef.current.enterRoom(engineRef.current.getState().currentRoomId);
      // Sync initial state to store
      const state = engineRef.current.getState();
      setCurrentRoom(state.currentRoomId);
      for (const entry of state.narrativeLog) {
        appendNarrative(entry);
      }
      engineNarrativeSyncIndex.current = state.narrativeLog.length;
      const room = engineRef.current.getCurrentRoom();
      if (room) {
        addVisitedRoom(room.id);
        setCurrentFloor(room.floor);
      }
      refreshActions();
    }
  }, [gamePhase, sessionKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Refresh available actions whenever relevant state changes
  const refreshActions = useCallback(() => {
    if (!engineRef.current) return;
    const actions = engineRef.current.getAvailableActions();
    setAvailableActions(actions);
  }, [setAvailableActions]);

  useEffect(() => {
    refreshActions();
  }, [refreshActions]);

  // Handle player action from StoryTerminal
  const handleAction = useCallback(
    (action: GameAction) => {
      if (!engineRef.current) return;
      // Safety: ignore disabled actions even if UI didn't prevent the click
      if (action.disabled) return;
      engineRef.current.executeAction(action);

      // Sync narrative log
      const state = engineRef.current.getState();
      for (let i = engineNarrativeSyncIndex.current; i < state.narrativeLog.length; i++) {
        const entry = state.narrativeLog[i];
        if (entry) appendNarrative(entry);
      }
      engineNarrativeSyncIndex.current = state.narrativeLog.length;

      // If room changed, update store
      const room = engineRef.current.getCurrentRoom();
      if (room && room.id !== useGameStore.getState().currentRoomId) {
        setCurrentRoom(room.id);
        addVisitedRoom(room.id);
        setCurrentFloor(room.floor);
      }

      refreshActions();
    },
    [appendNarrative, setCurrentRoom, addVisitedRoom, setCurrentFloor, refreshActions],
  );

  // Listen for EventBus events
  useEffect(() => {
    const unsub = EventBus.on((event) => {
      switch (event.type) {
        case 'TERMINAL_OPEN': {
          const { terminalId, challengeId } = event.payload;
          openTerminal(terminalId, challengeId);
          break;
        }
        case 'ACHIEVEMENT_UNLOCKED': {
          const { id } = event.payload;
          const achievement = ACHIEVEMENTS.find((a) => a.id === id);
          if (achievement === undefined) return;
          const notification: ToastNotification = {
            id: `achievement_${id}_${Date.now()}`,
            achievement,
          };
          setAchievementNotifications((prev) => [...prev, notification]);
          break;
        }
        case 'FLOOR_UNLOCKED':
          showCipherLine('story');
          break;
        case 'CHALLENGE_COMPLETED': {
          addCompletedChallenge(event.payload.challengeId);
          for (const item of getItemsGrantedBy(event.payload.challengeId)) {
            EventBus.emit({ type: 'ITEM_ACQUIRED', payload: { itemId: item.id, firstTime: true } });
            const name = i18n.t(item.nameKey.replace('.', ':'));
            announce(name);
            setItemNotifications((previous) => [
              ...previous,
              {
                id: `item_${item.id}`,
                itemId: item.id,
                name,
                description: i18n.t(item.descriptionKey.replace('.', ':')),
                itemType: item.type,
                isFirstPickup: true,
              },
            ]);
          }
          // Add narrative feedback
          const entry: NarrativeEntry = {
            id: `nar_${Date.now()}`,
            type: 'cipher',
            text: cipher.getLine('challenge_success'),
            speaker: 'CIPHER',
            timestamp: Date.now(),
          };
          appendNarrative(entry);
          // Wire engine: track completion, check floor progression, add narrative
          if (engineRef.current) {
            engineRef.current.completeChallenge(event.payload.challengeId);
            // Sync any new narrative entries from the engine (e.g. floor unlock messages)
            const engineState = engineRef.current.getState();
            for (
              let i = engineNarrativeSyncIndex.current;
              i < engineState.narrativeLog.length;
              i++
            ) {
              const narEntry = engineState.narrativeLog[i];
              if (narEntry) appendNarrative(narEntry);
            }
            engineNarrativeSyncIndex.current = engineState.narrativeLog.length;
          }
          // Refresh actions synchronously — store already updated above
          refreshActions();
          // Check if all challenges are complete
          if (engineRef.current?.isGameComplete()) {
            setGameCompleted(true);
          }
          break;
        }
      }
    });
    return unsub;
  }, [
    openTerminal,
    addCompletedChallenge,
    appendNarrative,
    refreshActions,
    setGameCompleted,
    announce,
    cipher,
    showCipherLine,
  ]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gamePhase !== 'playing') return;
      if (terminalOpen || saveModalMode !== null || storyOverlayOpen) return;
      if (activeTutorialStep !== null) return;

      switch (e.key) {
        case 'Escape':
          if (activePanel !== 'none') {
            setActivePanel('none');
          } else {
            setGamePhase('paused');
          }
          break;
        case 'q':
        case 'Q':
          setActivePanel(activePanel === 'questlog' ? 'none' : 'questlog');
          break;
        case 'm':
        case 'M':
          setActivePanel(activePanel === 'map' ? 'none' : 'map');
          break;
        case 'i':
        case 'I':
          setActivePanel(activePanel === 'inventory' ? 'none' : 'inventory');
          break;
        case 'k':
        case 'K':
          setActivePanel(activePanel === 'skills' ? 'none' : 'skills');
          break;
      }
    };
    // Capture: a panel's own Escape handler must not close it before this one has seen it,
    // or the same key press would go on to open the pause menu.
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [
    gamePhase,
    activePanel,
    terminalOpen,
    saveModalMode,
    storyOverlayOpen,
    activeTutorialStep,
    setGamePhase,
    setActivePanel,
  ]);

  const handleNewGame = useCallback(() => {
    setMenuView('newgame');
  }, []);

  const handleContinue = useCallback(() => {
    void saveSystem
      .listSaves()
      .then((slots) => {
        const autoSaves = slots
          .filter((s) => s.isAutoSave)
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
        const latest = autoSaves[0];
        if (latest !== undefined) {
          void saveSystem.load(latest.id).then((data) => {
            if (data !== undefined) {
              setSavedProgress(toCurriculumProgress(data));
              setSessionKey((k) => k + 1);
            }
            setGamePhase('playing');
          });
        } else {
          setGamePhase('playing');
        }
      })
      .catch((error: unknown) => {
        console.error('Unable to load the latest autosave', error);
        setHasSaveData(false);
      });
  }, [saveSystem, setGamePhase]);

  const handleLoadGame = useCallback(() => {
    setSaveModalMode('load');
  }, []);

  const handleMenuSettings = useCallback(() => {
    setMenuView('settings');
  }, []);

  const handleSettingsBack = useCallback(() => {
    if (gamePhase === 'menu') {
      setMenuView('main');
    } else {
      setActivePanel('none');
    }
  }, [gamePhase, setActivePanel]);

  const handleStartGame = useCallback(
    (name: string, gender: 'male' | 'female' | 'nonbinary') => {
      resetGameState();
      setSavedProgress(undefined);
      setSessionKey((k) => k + 1);
      engineRef.current = null;
      controllerRef.current = null;
      engineNarrativeSyncIndex.current = 0;
      setPlayerName(name);
      setPlayerGender(gender);
      setGamePhase('playing');
      triggerNewGame();
    },
    [resetGameState, setPlayerName, setPlayerGender, setGamePhase, triggerNewGame],
  );

  const handleNewGamePlus = useCallback(() => {
    const state = useGameStore.getState();
    const { xp, level, playerName: name, playerGender: gender } = state;
    onCreditsClose();
    resetGameState();
    state.restoreProgress({
      unlockedSkills: state.unlockedSkills,
      spentSkillXp: state.spentSkillXp,
      unlockedAchievements: state.unlockedAchievements,
      seenCutscenes: [],
      playTimeMs: state.playTimeMs,
      newGamePlus: state.newGamePlus + 1,
    });
    state.addXp(xp);
    state.setLevel(level);
    setGameCompleted(false);
    setSavedProgress({
      challenges: {},
      currentChapter: 1,
      totalXp: xp,
      completedChallenges: 0,
      unlockedFloors: [floorIdFromNumber(0)],
    });
    setSessionKey((k) => k + 1);
    engineRef.current = null;
    controllerRef.current = null;
    engineNarrativeSyncIndex.current = 0;
    setPlayerName(name);
    setPlayerGender(gender);
    setGamePhase('playing');
  }, [
    onCreditsClose,
    resetGameState,
    setGameCompleted,
    setPlayerName,
    setPlayerGender,
    setGamePhase,
  ]);

  const handleTutorMode = useCallback(() => {
    setMenuView('tutor');
  }, []);

  const handleUnlockSkill = useCallback((skillId: string) => {
    const state = useGameStore.getState();
    const node = SKILL_TREE.find((candidate) => candidate.id === skillId);
    const manager = new SkillTreeManager(state.unlockedSkills);
    const available = state.xp - state.spentSkillXp;
    if (node === undefined || !manager.canUnlock(skillId, state.completedChallenges, available)) {
      return;
    }
    state.unlockSkill(skillId, node.xpCost);
  }, []);

  const handleDismissItem = useCallback((id: string) => {
    setItemNotifications((previous) => previous.filter((n) => n.id !== id));
  }, []);

  const handleNewGameBack = useCallback(() => {
    setMenuView('main');
  }, []);

  const handleResume = useCallback(() => {
    setGamePhase('playing');
  }, [setGamePhase]);

  const handleQuitToMenu = useCallback(() => {
    setGamePhase('menu');
    setMenuView('main');
    setActivePanel('none');
    setSaveModalMode(null);
    engineRef.current = null;
  }, [setGamePhase, setActivePanel]);

  const handleCreditsToMenu = useCallback(() => {
    onCreditsClose();
    setGameCompleted(false);
    handleQuitToMenu();
  }, [onCreditsClose, setGameCompleted, handleQuitToMenu]);

  const handlePauseSave = useCallback(() => {
    setSaveModalMode('save');
  }, []);

  const handlePauseLoad = useCallback(() => {
    setSaveModalMode('load');
  }, []);

  const handlePauseSettings = useCallback(() => {
    setActivePanel('settings');
    setGamePhase('playing');
  }, [setActivePanel, setGamePhase]);

  const handleClosePanel = useCallback(() => {
    setActivePanel('none');
  }, [setActivePanel]);

  const handleDismissAchievement = useCallback((id: string) => {
    setAchievementNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handleOpenPanel = useCallback(
    (panel: Exclude<ActivePanel, 'none'>) => {
      setActivePanel(panel);
    },
    [setActivePanel],
  );

  const availableSkills = useMemo(
    () =>
      new SkillTreeManager(unlockedSkills)
        .getAvailableSkills(completedChallenges, xp - spentSkillXp)
        .map((node) => node.id),
    [unlockedSkills, completedChallenges, xp, spentSkillXp],
  );

  // Derived floor IDs for FloorMap
  const currentFloorId = FLOOR_NUM_TO_ID[currentFloor] ?? 'lobby';
  const unlockedFloorIds = useMemo(
    () => unlockedFloors.map((n) => FLOOR_NUM_TO_ID[n]).filter((id): id is string => id != null),
    [unlockedFloors],
  );

  const handleFloorSelect = useCallback(
    (floorId: string) => {
      const floorNum = FLOOR_ID_TO_NUM[floorId];
      if (floorNum == null) return;
      const firstRoomId = getFirstRoomOfFloor(floorNum)?.id;
      if (!firstRoomId || !engineRef.current || !unlockedFloors.includes(floorNum)) return;
      setCurrentFloor(floorNum);
      engineRef.current.enterRoom(firstRoomId);
      const state = engineRef.current.getState();
      setCurrentRoom(state.currentRoomId);
      for (let i = engineNarrativeSyncIndex.current; i < state.narrativeLog.length; i++) {
        const entry = state.narrativeLog[i];
        if (entry) appendNarrative(entry);
      }
      engineNarrativeSyncIndex.current = state.narrativeLog.length;
      const room = engineRef.current.getCurrentRoom();
      if (room) addVisitedRoom(room.id);
      refreshActions();
      setActivePanel('none');
    },
    [
      setCurrentFloor,
      setCurrentRoom,
      appendNarrative,
      addVisitedRoom,
      refreshActions,
      setActivePanel,
    ],
  );

  // Build CurriculumProgress for QuestLog
  const curriculumProgressForQuestLog = useMemo((): CurriculumProgress => {
    if (savedProgress) return savedProgress;
    return {
      challenges: Object.fromEntries(
        completedChallenges.map((id) => [
          id,
          { challengeId: id, completed: true, attempts: 1, hintsUsed: 0 },
        ]),
      ),
      currentChapter: Math.max(1, currentFloor),
      totalXp: xp,
      completedChallenges: completedChallenges.length,
      unlockedFloors: unlockedFloorIds,
    };
  }, [savedProgress, completedChallenges, currentFloor, xp, unlockedFloorIds]);

  const handleSave = useCallback(() => {
    setSaveModalMode('save');
  }, []);

  // Save modal callbacks
  const handleModalSave = useCallback(
    async (slotId: string | undefined): Promise<void> => {
      await saveSystem.save(slotId);
      refreshHasSaveData();
    },
    [saveSystem, refreshHasSaveData],
  );

  const handleModalLoad = useCallback(
    (slotId: string): void => {
      void saveSystem.load(slotId).then((data) => {
        setSaveModalMode(null);
        if (data !== undefined) {
          setSavedProgress(toCurriculumProgress(data));
          setSessionKey((k) => k + 1);
          controllerRef.current = null;
          engineRef.current = null;
        }
        setGamePhase('playing');
      });
    },
    [saveSystem, setGamePhase],
  );

  const handleModalDelete = useCallback(
    async (slotId: string): Promise<void> => {
      await saveSystem.deleteSave(slotId);
      refreshHasSaveData();
    },
    [saveSystem, refreshHasSaveData],
  );

  const handleModalClose = useCallback(() => {
    setSaveModalMode(null);
    if (gamePhase === 'menu') return;
    setGamePhase('paused');
  }, [gamePhase, setGamePhase]);

  // Get current room info for StoryTerminal
  const currentRoom = engineRef.current?.getCurrentRoom();
  const roomInfo = currentRoom
    ? {
        id: currentRoom.id,
        nameKey: getRoomDisplayName(currentRoom.id),
        floor: currentRoom.floor,
      }
    : null;

  // Menu phase
  if (gamePhase === 'menu') {
    if (menuView === 'newgame') {
      return (
        <>
          <NewGameFlow onStart={handleStartGame} onBack={handleNewGameBack} />
          <PWAUpdateNotifier />
          <PWAInstallPrompt />
        </>
      );
    }
    if (menuView === 'tutor') {
      return <TutorMode onBack={handleNewGameBack} />;
    }
    if (menuView === 'settings') {
      return (
        <>
          <SettingsPanel onBack={handleSettingsBack} audioSettings={audioSettings} />
          <PWAUpdateNotifier />
          <PWAInstallPrompt />
        </>
      );
    }
    return (
      <>
        <MainMenu
          hasSaveData={hasSaveData}
          onNewGame={handleNewGame}
          onContinue={handleContinue}
          onLoadGame={handleLoadGame}
          onSettings={handleMenuSettings}
          onTutorial={handleTutorMode}
        />
        <div style={{ position: 'fixed', right: '16px', bottom: '16px', zIndex: 10 }}>
          <LocaleSwitcher />
        </div>
        {saveModalMode === 'load' && (
          <SaveSlotModal
            mode="load"
            onClose={handleModalClose}
            onSave={handleModalSave}
            onLoad={handleModalLoad}
            onDelete={handleModalDelete}
            listSaves={saveSystem.listSaves}
          />
        )}
        <PWAUpdateNotifier />
        <PWAInstallPrompt />
      </>
    );
  }

  // Playing / Paused phase
  return (
    <GameControllerProvider
      key={sessionKey}
      interpreter={interpreterRef.current}
      savedProgress={savedProgress}
      controllerRef={controllerRef}
    >
      <CRTEffect enabled={!reducedMotion}>
        <div
          style={{
            background: '#0a0a0f',
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Main game view — the StoryTerminal */}
          {!terminalOpen && !gameCompleted && (
            <StoryTerminal
              currentRoom={roomInfo}
              inputEnabled={
                gamePhase === 'playing' &&
                activePanel === 'none' &&
                saveModalMode === null &&
                !storyOverlayOpen &&
                activeTutorialStep === null
              }
              narrativeLog={narrativeLog}
              availableActions={availableActions}
              onAction={handleAction}
              onOpenPanel={handleOpenPanel}
              progressBar={
                <FloorProgressBar
                  floorId={currentFloorId}
                  completedChallenges={completedChallenges}
                  reducedMotion={reducedMotion}
                />
              }
              onSave={handleSave}
              playerName={playerName}
              xp={xp}
              level={level}
              completedChallenges={completedChallenges.length}
              totalChallenges={TOTAL_CHALLENGES}
            />
          )}

          <DialogOverlay {...dialog} />

          {activeCutscene !== null && (
            <CutscenePlayer cutscene={activeCutscene} onComplete={storyFlow.onCutsceneComplete} />
          )}

          {activeTutorialStep !== null && activeCutscene === null && !dialog.isOpen && (
            <TutorialOverlay
              step={activeTutorialStep}
              onComplete={storyFlow.onTutorialStepComplete}
              onSkip={storyFlow.onTutorialSkip}
            />
          )}

          {announcedFloor !== null && activeCutscene === null && (
            <FloorAnnouncementOverlay
              floorNumber={announcedFloor}
              floorName={i18n.t(`story:floors.${String(announcedFloor)}.name`)}
              subtitle={i18n.t(
                (chapters[announcedFloor]?.titleKey ?? '').replace('chapters.', 'chapters:'),
              )}
              isVisible
              onDismiss={() => setAnnouncedFloor(null)}
            />
          )}

          {terminalOpen && pythonLoading && (
            <LoadingScreen statusText={i18n.t('ui:terminal.loading_python')} />
          )}

          {cipherMessage !== null && activeCutscene === null && (
            <div style={{ position: 'fixed', left: '16px', bottom: '96px', zIndex: 60 }}>
              <CipherDialog message={cipherMessage} mood={cipherMood} onDismiss={dismissCipher} />
            </div>
          )}

          {showCredits && (
            <CreditsScreen
              stats={{
                challengesCompleted: completedChallenges.length,
                totalXp: xp,
                timePlayed: Math.round(useGameStore.getState().playTimeMs / 1000),
                achievementsUnlocked: useGameStore.getState().unlockedAchievements.length,
                floorsCleared: unlockedFloors.length,
              }}
              pythonVersion={interpreterRef.current.getVersion()}
              onNewGamePlus={handleNewGamePlus}
              onReturnToMenu={handleCreditsToMenu}
            />
          )}

          {/* Terminal overlay for challenges */}
          {terminalOpen && <TerminalOverlay />}

          {/* Victory screen */}
          {gameCompleted && activeCutscene === null && !showCredits && (
            <VictoryScreen
              totalChallenges={TOTAL_CHALLENGES}
              completedChallenges={completedChallenges.length}
              totalXp={xp}
              level={level}
              playerName={playerName}
              onContinue={() => setGameCompleted(false)}
              onReturnToTitle={handleQuitToMenu}
            />
          )}

          {/* Notifications */}
          {itemNotifications.length > 0 && (
            <ItemPickupToast notifications={itemNotifications} onDismiss={handleDismissItem} />
          )}
          {achievementNotifications.length > 0 && (
            <AchievementToast
              notifications={achievementNotifications}
              onDismiss={handleDismissAchievement}
            />
          )}

          {/* Pause menu */}
          {gamePhase === 'paused' && (
            <PauseMenu
              onResume={handleResume}
              onSaveGame={handlePauseSave}
              onLoadGame={handlePauseLoad}
              onSettings={handlePauseSettings}
              onQuitToMenu={handleQuitToMenu}
            />
          )}

          {/* Save/Load modal */}
          {saveModalMode !== null && (
            <SaveSlotModal
              mode={saveModalMode}
              onClose={handleModalClose}
              onSave={handleModalSave}
              onLoad={handleModalLoad}
              onDelete={handleModalDelete}
              listSaves={saveSystem.listSaves}
            />
          )}

          {/* Settings panel */}
          {activePanel === 'settings' && gamePhase === 'playing' && (
            <SettingsPanel
              onBack={handleClosePanel}
              audioSettings={audioSettings}
              onRestartTutorial={() => {
                handleClosePanel();
                storyFlow.restartTutorial();
              }}
            />
          )}

          {activePanel === 'inventory' && gamePhase === 'playing' && (
            <FocusTrap active>
              <InventoryPanel isOpen onClose={handleClosePanel} items={inventoryItems} />
            </FocusTrap>
          )}

          {activePanel === 'skills' && gamePhase === 'playing' && (
            <FocusTrap active>
              <SkillTreePanel
                isOpen
                onClose={handleClosePanel}
                unlockedSkills={unlockedSkills}
                availableSkills={availableSkills}
                xp={xp - spentSkillXp}
                onUnlock={handleUnlockSkill}
              />
            </FocusTrap>
          )}

          {/* Quest log panel */}
          {activePanel === 'questlog' && gamePhase === 'playing' && (
            <QuestLog
              isOpen={activePanel === 'questlog'}
              onClose={handleClosePanel}
              curriculumProgress={curriculumProgressForQuestLog}
              chapters={chapters}
              currentFloor={currentFloorId}
            />
          )}

          {/* Floor map panel */}
          {activePanel === 'map' && gamePhase === 'playing' && (
            <FloorMap
              isOpen={activePanel === 'map'}
              onClose={handleClosePanel}
              currentFloor={currentFloorId}
              unlockedFloors={unlockedFloorIds}
              onFloorSelect={handleFloorSelect}
            />
          )}

          <PWAUpdateNotifier />
          <PWAInstallPrompt />
        </div>
      </CRTEffect>
    </GameControllerProvider>
  );
}
