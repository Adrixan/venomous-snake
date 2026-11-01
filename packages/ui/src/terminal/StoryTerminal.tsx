import type { ToolbarPanel } from './StatusBar';
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
  onOpenPanel: (panel: ToolbarPanel) => void;
  /** Rendered between the location header and the narrative. */
  progressBar?: React.ReactNode;
  onSave: () => void;
  playerName: string;
  xp: number;
  level: number;
  completedChallenges: number;
  totalChallenges: number;
  inputEnabled?: boolean;
}

function StoryTerminalInner({
  currentRoom,
  narrativeLog,
  availableActions,
  onAction,
  onOpenPanel,
  progressBar,
  onSave,
  xp,
  level,
  completedChallenges,
  totalChallenges,
  inputEnabled = true,
}: StoryTerminalProps): React.JSX.Element {
  const { t } = useTranslation('story');
  const floorNumber = currentRoom?.floor ?? 0;
  const floorName = t(`floors.${String(floorNumber)}.name`, {
    defaultValue: String(floorNumber),
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

      {progressBar}

      <NarrativePanel entries={narrativeLog} />

      <ActionPanel actions={availableActions} onAction={onAction} enabled={inputEnabled} />

      <StatusBar onOpenPanel={onOpenPanel} onSave={onSave} enabled={inputEnabled} />
    </div>
  );
}

export const StoryTerminal = React.memo(StoryTerminalInner);
