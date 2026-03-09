import React, { useEffect, useState, useRef, useCallback } from 'react';
import { PWAInstallPrompt } from './pwa/PWAInstallPrompt';
import { PWAUpdateNotifier } from './pwa/PWAUpdateNotifier';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { TerminalOverlay } from './components/TerminalOverlay';
import { SaveSlotModal } from './components/SaveSlotModal';
import { useGameStore } from './store/gameStore';
import { GameControllerProvider } from './hooks/useGameController';
import { useSaveSystem } from './hooks/useSaveSystem';
import { useGameAudio } from './hooks/useGameAudio';
import { useStoryFlow } from './hooks/useStoryFlow';
import { useCurriculumProgress } from './hooks/useCurriculumProgress';
import { RotateDeviceOverlay } from './components/RotateDeviceOverlay';
import { MockInterpreter } from '@venomous-snake/python-runtime';
import {
  MainMenu,
  NewGameFlow,
  SettingsPanel,
  PauseMenu,
  QuestLog,
  InventoryPanel,
  FloorMap,
  DialogOverlay,
  useDialog,
  CRTEffect,
  CutscenePlayer,
  TutorialOverlay,
  CreditsScreen,
  ItemPickupToast,
  AchievementToast,
} from '@venomous-snake/ui';
import type {
  AudioSettingsPanelProps,
  ItemPickupNotification,
  ToastNotification,
} from '@venomous-snake/ui';
import { chapters } from '@venomous-snake/challenges';
import { ACHIEVEMENTS } from '@venomous-snake/challenge-engine';

import { EventBus } from '@venomous-snake/engine';
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
  const currentFloor = useGameStore((state) => state.currentFloor);
  const setCurrentFloor = useGameStore((state) => state.setCurrentFloor);
  const reducedMotion = useReducedMotion();
  const terminalOpen = useGameStore((state) => state.overlay.terminalOpen);
  const openTerminal = useGameStore((state) => state.openTerminal);
  const completedChallenges = useGameStore((state) => state.completedChallenges);
  const xp = useGameStore((state) => state.xp);
  const unlockedFloors = useGameStore((state) => state.unlockedFloors);

  // Audio store
  const masterVolume = useGameStore((s) => s.masterVolume);
  const musicVolume = useGameStore((s) => s.musicVolume);
  const sfxVolume = useGameStore((s) => s.sfxVolume);
  const isMuted = useGameStore((s) => s.isMuted);
  const setMasterVolume = useGameStore((s) => s.setMasterVolume);
  const setMusicVolume = useGameStore((s) => s.setMusicVolume);
  const setSfxVolume = useGameStore((s) => s.setSfxVolume);
  const toggleMute = useGameStore((s) => s.toggleMute);

  // Wire audio to game events (always active once the component mounts)
  useGameAudio();

  // Derive curriculum progress from live game store state
  const curriculumProgress = useCurriculumProgress();

  // Request landscape orientation lock (progressive enhancement)
  useEffect(() => {
    void (async () => {
      try {
        const orientation = screen.orientation as ScreenOrientation & {
          lock?: (orientation: string) => Promise<void>;
        };
        await orientation.lock?.('landscape');
      } catch {
        // Silently fail — not all browsers support this
      }
    })();
  }, []);

  // Auto-request fullscreen on first user interaction
  useEffect(() => {
    const requestFs = () => {
      if (!document.fullscreenElement) {
        void document.documentElement.requestFullscreen().catch(() => {
          // Fullscreen may be blocked by browser policy — silently ignore
        });
      }
      document.removeEventListener('pointerdown', requestFs);
    };
    document.addEventListener('pointerdown', requestFs, { once: true });
    return () => document.removeEventListener('pointerdown', requestFs);
  }, []);

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
  // savedProgress and sessionKey allow loading a save into a fresh GameControllerProvider
  const [savedProgress, setSavedProgress] = useState<CurriculumProgress | undefined>(undefined);
  const [sessionKey, setSessionKey] = useState(0);

  // Item pickup notifications
  const [pickupNotifications, setPickupNotifications] = useState<ItemPickupNotification[]>([]);
  const seenItemsRef = useRef<Set<string>>(new Set());

  // Achievement notifications
  const [achievementNotifications, setAchievementNotifications] = useState<ToastNotification[]>([]);

  // Stable interpreter — recreated on new game, persists across paused transitions
  const interpreterRef = useRef<MockInterpreter | null>(null);
  if (interpreterRef.current === null) {
    interpreterRef.current = new MockInterpreter();
  }

  // Ref exposed to GameControllerProvider so useSaveSystem can reach the controller
  const controllerRef = useRef<GameController | null>(null);

  const saveSystem = useSaveSystem(controllerRef);

  // Dialog state driven by EventBus DIALOG_START / DIALOG_END
  const inventory = useGameStore((state) => state.inventory);
  const incrementAlertLevel = useGameStore((state) => state.incrementAlertLevel);
  const dialogState = useDialog({ inventory, onAlertRaised: incrementAlertLevel });

  // Story flow: cutscenes, tutorial, credits
  const storyFlow = useStoryFlow(completedChallenges);

  // Refresh "has save data" flag whenever the modal closes or on mount
  const refreshHasSaveData = useCallback((): void => {
    void saveSystem.listSaves().then((slots) => {
      setHasSaveData(slots.length > 0);
    });
  }, [saveSystem]);

  useEffect(() => {
    refreshHasSaveData();
  }, [refreshHasSaveData]);

  // Escape key for pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'Escape' &&
        gamePhase === 'playing' &&
        activePanel === 'none' &&
        !terminalOpen &&
        saveModalMode === null &&
        !dialogState.isOpen
      ) {
        setGamePhase('paused');
      }
      // T key for dev terminal
      if (
        e.key === 't' &&
        gamePhase === 'playing' &&
        !terminalOpen &&
        activePanel === 'none' &&
        saveModalMode === null
      ) {
        openTerminal('dev-terminal');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    gamePhase,
    activePanel,
    terminalOpen,
    saveModalMode,
    dialogState.isOpen,
    setGamePhase,
    openTerminal,
  ]);

  // Listen for TERMINAL_OPEN events from the Phaser game world
  useEffect(() => {
    const unsub = EventBus.on((event) => {
      if (event.type === 'TERMINAL_OPEN') {
        const { terminalId, challengeId } = event.payload;
        openTerminal(terminalId, challengeId);
      }
    });
    return unsub;
  }, [openTerminal]);

  // Listen for ITEM_PICKUP events and show pickup toast
  useEffect(() => {
    const unsub = EventBus.on((event) => {
      if (event.type === 'ITEM_PICKUP') {
        const { itemId, name, description, itemType } = event.payload;
        const isFirstPickup = !seenItemsRef.current.has(itemId);
        seenItemsRef.current.add(itemId);
        const notification: ItemPickupNotification = {
          id: `pickup_${itemId}_${Date.now()}`,
          itemId,
          name,
          description,
          itemType,
          isFirstPickup,
        };
        setPickupNotifications((prev) => [...prev, notification]);
      }
    });
    return unsub;
  }, []);

  // Listen for ACHIEVEMENT_UNLOCKED events and show achievement toast
  useEffect(() => {
    const unsub = EventBus.on((event) => {
      if (event.type === 'ACHIEVEMENT_UNLOCKED') {
        const { id } = event.payload;
        const achievement = ACHIEVEMENTS.find((a) => a.id === id);
        if (achievement === undefined) return;
        const notification: ToastNotification = {
          id: `achievement_${id}_${Date.now()}`,
          achievement,
        };
        setAchievementNotifications((prev) => [...prev, notification]);
      }
    });
    return unsub;
  }, []);

  const handleNewGame = useCallback(() => {
    setMenuView('newgame');
  }, []);

  // Continue: load the most recent auto-save (or just resume playing if none)
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

  // Load Game from main menu — opens the load slot picker
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
      // Clear any stale state from a previous session
      resetGameState();
      setSavedProgress(undefined);
      setSessionKey((k) => k + 1);
      // Recreate interpreter for fresh execution environment
      interpreterRef.current = new MockInterpreter();
      controllerRef.current = null;
      setPlayerName(name);
      setPlayerGender(gender);
      setGamePhase('playing');
      // Trigger intro cutscene + tutorial after state settles
      setTimeout(() => storyFlow.triggerNewGame(), 0);
    },
    [resetGameState, setPlayerName, setPlayerGender, setGamePhase, storyFlow],
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

  const handleDismissPickup = useCallback((id: string) => {
    setPickupNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handleDismissAchievement = useCallback((id: string) => {
    setAchievementNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handleFloorSelect = useCallback(
    (floorId: string) => {
      setCurrentFloor(floorId);
      setActivePanel('none');
    },
    [setCurrentFloor, setActivePanel],
  );

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
          interpreterRef.current = new MockInterpreter();
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
    // When closing the load modal from the main menu, stay on main menu
    if (gamePhase === 'menu') return;
    // When closing from pause, return to paused state
    setGamePhase('paused');
  }, [gamePhase, setGamePhase]);

  // Menu phase
  if (gamePhase === 'menu') {
    if (menuView === 'newgame') {
      return (
        <>
          <NewGameFlow onStart={handleStartGame} onBack={handleNewGameBack} />
          <PWAUpdateNotifier />
          <PWAInstallPrompt />
          <RotateDeviceOverlay />
        </>
      );
    }
    if (menuView === 'settings') {
      return (
        <>
          <SettingsPanel onBack={handleSettingsBack} audioSettings={audioSettings} />
          <PWAUpdateNotifier />
          <PWAInstallPrompt />
          <RotateDeviceOverlay />
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
        />
        {/* Load-game slot picker shown over the main menu */}
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
        <RotateDeviceOverlay />
      </>
    );
  }

  // Playing / Paused phase — GameControllerProvider only mounts during the game session
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
          {/* z-index: 0 — Phaser canvas */}
          <GameCanvas />
          <HUD />

          {/* z-index: 500 — Item pickup notifications */}
          {pickupNotifications.length > 0 && (
            <ItemPickupToast notifications={pickupNotifications} onDismiss={handleDismissPickup} />
          )}

          {/* z-index: 500 — Achievement notifications */}
          {achievementNotifications.length > 0 && (
            <AchievementToast
              notifications={achievementNotifications}
              onDismiss={handleDismissAchievement}
            />
          )}

          {/* z-index: 100/101 — Dialog overlay (below terminal) */}
          <DialogOverlay {...dialogState} />

          {/* z-index: 200 — Terminal overlay */}
          <TerminalOverlay />

          {/* z-index: 300 — Pause menu */}
          {gamePhase === 'paused' && (
            <PauseMenu
              onResume={handleResume}
              onSaveGame={handlePauseSave}
              onLoadGame={handlePauseLoad}
              onSettings={handlePauseSettings}
              onQuitToMenu={handleQuitToMenu}
            />
          )}

          {/* z-index: 400 — Save/Load slot modal (above pause menu) */}
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

          {/* Settings panel during gameplay */}
          {activePanel === 'settings' && gamePhase === 'playing' && (
            <SettingsPanel onBack={handleClosePanel} audioSettings={audioSettings} />
          )}

          {/* Side panels */}
          <QuestLog
            isOpen={activePanel === 'questlog'}
            onClose={handleClosePanel}
            curriculumProgress={curriculumProgress}
            chapters={chapters}
            currentFloor={currentFloor}
          />
          <InventoryPanel
            isOpen={activePanel === 'inventory'}
            onClose={handleClosePanel}
            items={[]}
          />
          <FloorMap
            isOpen={activePanel === 'map'}
            onClose={handleClosePanel}
            currentFloor={currentFloor}
            unlockedFloors={['lobby']}
            onFloorSelect={handleFloorSelect}
          />

          <PWAUpdateNotifier />
          <PWAInstallPrompt />

          {/* z-index: 9000 — Tutorial overlay (above all game UI) */}
          {storyFlow.activeTutorialStep !== null && (
            <TutorialOverlay
              step={storyFlow.activeTutorialStep}
              onComplete={storyFlow.onTutorialStepComplete}
              onSkip={storyFlow.onTutorialSkip}
            />
          )}

          {/* z-index: 9999 — Cutscene player (above everything) */}
          {storyFlow.activeCutscene !== null && (
            <CutscenePlayer
              cutscene={storyFlow.activeCutscene}
              onComplete={storyFlow.onCutsceneComplete}
            />
          )}

          {/* Credits screen — shown after the victory cutscene */}
          {storyFlow.showCredits && (
            <CreditsScreen
              stats={{
                challengesCompleted: completedChallenges.length,
                totalXp: xp,
                timePlayed: storyFlow.playTime,
                achievementsUnlocked: 0,
                floorsCleared: unlockedFloors.length,
              }}
              onNewGamePlus={() => {
                storyFlow.onNewGamePlus();
                handleQuitToMenu();
              }}
              onReturnToMenu={() => {
                storyFlow.onCreditsClose();
                handleQuitToMenu();
              }}
            />
          )}
        </div>
      </CRTEffect>
      <RotateDeviceOverlay />
    </GameControllerProvider>
  );
}
