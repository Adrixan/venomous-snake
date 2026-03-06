import React, { useEffect, useState, useCallback } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { TerminalOverlay } from './components/TerminalOverlay';
import { useGameStore } from './store/gameStore';
import {
  MainMenu,
  NewGameFlow,
  SettingsPanel,
  PauseMenu,
  QuestLog,
  InventoryPanel,
  FloorMap,
} from '@venomous-snake/ui';
import { chapters } from '@venomous-snake/challenges';
import { saveManager } from '@venomous-snake/save-system';
import type { CurriculumProgress } from '@venomous-snake/shared-types';

type MenuView = 'main' | 'newgame' | 'settings' | 'load';

const defaultProgress: CurriculumProgress = {
  challenges: {},
  currentChapter: 1,
  totalXp: 0,
  completedChallenges: 0,
  unlockedFloors: ['lobby'],
};

export function App(): React.JSX.Element {
  const gamePhase = useGameStore((state) => state.gamePhase);
  const setGamePhase = useGameStore((state) => state.setGamePhase);
  const activePanel = useGameStore((state) => state.activePanel);
  const setActivePanel = useGameStore((state) => state.setActivePanel);
  const setPlayerName = useGameStore((state) => state.setPlayerName);
  const setPlayerGender = useGameStore((state) => state.setPlayerGender);
  const currentFloor = useGameStore((state) => state.currentFloor);
  const setCurrentFloor = useGameStore((state) => state.setCurrentFloor);
  const terminalOpen = useGameStore((state) => state.overlay.terminalOpen);
  const openTerminal = useGameStore((state) => state.openTerminal);

  const [menuView, setMenuView] = useState<MenuView>('main');
  const [hasSaveData, setHasSaveData] = useState(false);

  // Check for save data on mount
  useEffect(() => {
    void saveManager.getSaveSlots().then((slots) => {
      setHasSaveData(slots.length > 0);
    });
  }, []);

  // Escape key for pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'Escape' &&
        gamePhase === 'playing' &&
        activePanel === 'none' &&
        !terminalOpen
      ) {
        setGamePhase('paused');
      }
      // T key for dev terminal
      if (e.key === 't' && gamePhase === 'playing' && !terminalOpen && activePanel === 'none') {
        openTerminal('dev-terminal');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gamePhase, activePanel, terminalOpen, setGamePhase, openTerminal]);

  const handleNewGame = useCallback(() => {
    setMenuView('newgame');
  }, []);

  const handleContinue = useCallback(() => {
    setGamePhase('playing');
  }, [setGamePhase]);

  const handleLoadGame = useCallback(() => {
    // Load game placeholder — for now just start playing
    setGamePhase('playing');
  }, [setGamePhase]);

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
      setPlayerName(name);
      setPlayerGender(gender);
      setGamePhase('playing');
    },
    [setPlayerName, setPlayerGender, setGamePhase],
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
  }, [setGamePhase, setActivePanel]);

  const handlePauseSave = useCallback(() => {
    // Save game placeholder
  }, []);

  const handlePauseLoad = useCallback(() => {
    // Load from pause placeholder
  }, []);

  const handlePauseSettings = useCallback(() => {
    setActivePanel('settings');
    setGamePhase('playing');
  }, [setActivePanel, setGamePhase]);

  const handleClosePanel = useCallback(() => {
    setActivePanel('none');
  }, [setActivePanel]);

  const handleFloorSelect = useCallback(
    (floorId: string) => {
      setCurrentFloor(floorId);
      setActivePanel('none');
    },
    [setCurrentFloor, setActivePanel],
  );

  // Menu phase
  if (gamePhase === 'menu') {
    if (menuView === 'newgame') {
      return <NewGameFlow onStart={handleStartGame} onBack={handleNewGameBack} />;
    }
    if (menuView === 'settings') {
      return <SettingsPanel onBack={handleSettingsBack} />;
    }
    return (
      <MainMenu
        hasSaveData={hasSaveData}
        onNewGame={handleNewGame}
        onContinue={handleContinue}
        onLoadGame={handleLoadGame}
        onSettings={handleMenuSettings}
      />
    );
  }

  // Playing / Paused phase
  return (
    <div
      style={{
        background: '#0a0a0f',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <GameCanvas />
      <HUD />
      <TerminalOverlay />

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

      {/* Settings panel during gameplay */}
      {activePanel === 'settings' && gamePhase === 'playing' && (
        <SettingsPanel onBack={handleClosePanel} />
      )}

      {/* Side panels */}
      <QuestLog
        isOpen={activePanel === 'questlog'}
        onClose={handleClosePanel}
        curriculumProgress={defaultProgress}
        chapters={chapters}
        currentFloor={currentFloor}
      />
      <InventoryPanel isOpen={activePanel === 'inventory'} onClose={handleClosePanel} items={[]} />
      <FloorMap
        isOpen={activePanel === 'map'}
        onClose={handleClosePanel}
        currentFloor={currentFloor}
        unlockedFloors={['lobby']}
        onFloorSelect={handleFloorSelect}
      />
    </div>
  );
}
