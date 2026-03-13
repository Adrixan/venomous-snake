import React, { useEffect, useState, useRef, useCallback } from 'react';
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
} from '@venomous-snake/ui';
import type { AudioSettingsPanelProps, ToastNotification } from '@venomous-snake/ui';
import { ACHIEVEMENTS } from '@venomous-snake/challenge-engine';

import { EventBus, TextAdventureEngine, getRoomDisplayName } from '@venomous-snake/engine';
import type { GameAction, NarrativeEntry } from '@venomous-snake/shared-types';
import type { CurriculumProgress } from '@venomous-snake/shared-types';
import type { GameController } from './GameController';
import { useReducedMotion } from '@venomous-snake/ui';

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
    void saveSystem.listSaves().then((slots) => {
      setHasSaveData(slots.length > 0);
    });
  }, [saveSystem]);

  useEffect(() => {
    refreshHasSaveData();
  }, [refreshHasSaveData]);

  // Initialize the text adventure engine when entering playing phase
  useEffect(() => {
    if (gamePhase === 'playing' && engineRef.current === null) {
      engineRef.current = new TextAdventureEngine();

      // Show game intro on new game (no completed challenges = fresh start)
      if (completedChallenges.length === 0) {
        const introLines = TextAdventureEngine.getGameIntro();
        for (const line of introLines) {
          const entry: NarrativeEntry = {
            id: `intro_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            type: line.startsWith('[CIPHER]') ? 'cipher' : 'description',
            text: line.startsWith('[CIPHER]') ? line.replace('[CIPHER] ', '') : line,
            timestamp: Date.now(),
          };
          if (line.startsWith('[CIPHER]')) {
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
    const actions = engineRef.current.getAvailableActions(completedChallenges);
    setAvailableActions(actions);
  }, [completedChallenges, setAvailableActions]);

  useEffect(() => {
    refreshActions();
  }, [refreshActions]);

  // Handle player action from StoryTerminal
  const handleAction = useCallback(
    (action: GameAction) => {
      if (!engineRef.current) return;
      // Safety: ignore disabled actions even if UI didn't prevent the click
      if (action.disabled) return;
      engineRef.current.executeAction(action, completedChallenges);

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
    [
      completedChallenges,
      appendNarrative,
      setCurrentRoom,
      addVisitedRoom,
      setCurrentFloor,
      refreshActions,
    ],
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
  }, [openTerminal, addCompletedChallenge, appendNarrative, refreshActions]);

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
    void saveSystem.listSaves().then((slots) => {
      const autoSaves = slots
        .filter((s) => s.isAutoSave)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      const latest = autoSaves[0];
      if (latest !== undefined) {
        void saveSystem.load(latest.id).then((data) => {
          if (data !== undefined) {
            setSavedProgress(data.curriculumProgress);
            setSessionKey((k) => k + 1);
          }
          setGamePhase('playing');
        });
      } else {
        setGamePhase('playing');
      }
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
          setSavedProgress(data.curriculumProgress);
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
              totalChallenges={118}
            />
          )}

          {/* Terminal overlay for challenges */}
          {terminalOpen && <TerminalOverlay />}

          {/* Victory screen */}
          {gameCompleted && (
            <VictoryScreen
              totalChallenges={118}
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

          <PWAUpdateNotifier />
          <PWAInstallPrompt />
        </div>
      </CRTEffect>
    </GameControllerProvider>
  );
}
