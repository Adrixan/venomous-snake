import React from 'react';
import type { NarrativeEntry, GameAction } from '@venomous-snake/shared-types';
import { LocationHeader } from './LocationHeader';
import { NarrativePanel } from './NarrativePanel';
import { ActionPanel } from './ActionPanel';
import { StatusBar } from './StatusBar';
import './story-terminal.css';
import { useTranslation } from 'react-i18next';
import { translateText } from '../i18n/translateText';

export interface StoryTerminalProps {
  currentRoom: { id: string; nameKey: string; floor: number } | null;
  narrativeLog: NarrativeEntry[];
  availableActions: GameAction[];
  onAction: (action: GameAction) => void;
  onOpenPanel: (panel: 'questlog' | 'map' | 'settings') => void;
  onSave: () => void;
  onPause: () => void;
  playerName: string;
  xp: number;
  level: number;
  completedChallenges: number;
  totalChallenges: number;
  inputEnabled?: boolean;
}

/** Floor name lookup — will be replaced with i18n/data lookup later */
const FLOOR_NAMES: Record<number, string> = {
  0: 'LOBBY',
  1: 'MAIL ROOM',
  2: 'IT DEPARTMENT',
  3: 'ANALYTICS',
  4: 'COMMUNICATIONS',
  5: 'R&D LABS',
  6: 'ARCHIVES',
  7: 'SECURITY',
  8: 'NETWORK OPS',
  9: 'SERVER FARM',
  10: 'EXECUTIVE SUITE',
  11: 'ROOFTOP',
};

function StoryTerminalInner({
  currentRoom,
  narrativeLog,
  availableActions,
  onAction,
  onOpenPanel,
  onSave,
  onPause,
  xp,
  level,
  completedChallenges,
  totalChallenges,
  inputEnabled = true,
}: StoryTerminalProps): React.JSX.Element {
  const { t } = useTranslation('story');
  const floorNumber = currentRoom?.floor ?? 0;
  const floorName = t(`floors.${String(floorNumber)}.name`, {
    defaultValue: FLOOR_NAMES[floorNumber] ?? String(floorNumber),
  });
  const roomName = currentRoom ? translateText(t, currentRoom.nameKey) : '...';

  return (
    <div className="story-terminal">
      <LocationHeader
        floorNumber={floorNumber}
        floorName={floorName}
        roomName={roomName}
        xp={xp}
        level={level}
        completedChallenges={completedChallenges}
        totalChallenges={totalChallenges}
      />

      <NarrativePanel entries={narrativeLog} />

      <ActionPanel actions={availableActions} onAction={onAction} enabled={inputEnabled} />

      <StatusBar onOpenPanel={onOpenPanel} onSave={onSave} onPause={onPause} />
    </div>
  );
}

export const StoryTerminal = React.memo(StoryTerminalInner);
