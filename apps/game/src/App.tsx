import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { PWAInstallPrompt } from './pwa/PWAInstallPrompt';
import { PWAUpdateNotifier } from './pwa/PWAUpdateNotifier';
import { TerminalOverlay } from './components/TerminalOverlay';
import { SaveSlotModal } from './components/SaveSlotModal';
import { useGameStore } from './store/gameStore';
import { GameControllerProvider } from './hooks/useGameController';
import { useSaveSystem } from './hooks/useSaveSystem';
import { useGameAudio } from './hooks/useGameAudio';
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
  FloorMap,
} from '@venomous-snake/ui';
import type { AudioSettingsPanelProps, ToastNotification } from '@venomous-snake/ui';
import { ACHIEVEMENTS } from '@venomous-snake/challenge-engine';
import { chapters, FLOORS, TOTAL_CHALLENGES, floorIdFromNumber } from '@venomous-snake/challenges';
import type { SaveData } from '@venomous-snake/save-system';

import {
  EventBus,
  TextAdventureEngine,
  getRoomDisplayName,
  getFirstRoomOfFloor,
} from '@venomous-snake/engine';
import type { GameAction, NarrativeEntry } from '@venomous-snake/shared-types';
import type { CurriculumProgress } from '@venomous-snake/shared-types';
import type { GameController } from './GameController';
import { useReducedMotion } from '@venomous-snake/ui';

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

type MenuView = 'main' | 'newgame' | 'settings';
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

  // Story flow: cutscenes, credits
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
  }, [gamePhase]); // eslint-disable-line react-hooks/exhaustive-deps

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
        case 'CHALLENGE_COMPLETED': {
          addCompletedChallenge(event.payload.challengeId);
          // Add narrative feedback
          const entry: NarrativeEntry = {
            id: `nar_${Date.now()}`,
            type: 'cipher',
            text: 'Challenge complete! The terminal flickers green. Another system breached.',
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
  }, [openTerminal, addCompletedChallenge, appendNarrative, refreshActions, setGameCompleted]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gamePhase !== 'playing') return;
      if (terminalOpen || saveModalMode !== null) return;

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
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gamePhase, activePanel, terminalOpen, saveModalMode, setGamePhase, setActivePanel]);

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
    },
    [resetGameState, setPlayerName, setPlayerGender, setGamePhase],
  );

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
    (panel: 'questlog' | 'map' | 'settings') => {
      setActivePanel(panel);
    },
    [setActivePanel],
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

  const handlePause = useCallback(() => {
    setGamePhase('paused');
  }, [setGamePhase]);

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
          onTutorial={handleNewGame}
        />
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
                gamePhase === 'playing' && activePanel === 'none' && saveModalMode === null
              }
              narrativeLog={narrativeLog}
              availableActions={availableActions}
              onAction={handleAction}
              onOpenPanel={handleOpenPanel}
              onSave={handleSave}
              onPause={handlePause}
              playerName={playerName}
              xp={xp}
              level={level}
              completedChallenges={completedChallenges.length}
              totalChallenges={TOTAL_CHALLENGES}
            />
          )}

          {/* Terminal overlay for challenges */}
          {terminalOpen && <TerminalOverlay />}

          {/* Victory screen */}
          {gameCompleted && (
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
            <SettingsPanel onBack={handleClosePanel} audioSettings={audioSettings} />
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
