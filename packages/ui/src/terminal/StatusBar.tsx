import type { ActivePanel } from '@venomous-snake/shared-types';
import React, { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export type ToolbarPanel = Exclude<ActivePanel, 'none'>;

export interface StatusBarProps {
  onOpenPanel: (panel: ToolbarPanel) => void;
  onSave: () => void;
  /** False while something else owns the keyboard, such as a panel or a cutscene. */
  enabled: boolean;
}

interface ToolbarButton {
  id: string;
  icon: string;
  labelKey: string;
  shortcut: string;
  action: () => void;
}

function StatusBarInner({ onOpenPanel, onSave, enabled }: StatusBarProps): React.JSX.Element {
  const { t } = useTranslation('ui');

  const handleQuests = useCallback(() => onOpenPanel('questlog'), [onOpenPanel]);
  const handleMap = useCallback(() => onOpenPanel('map'), [onOpenPanel]);
  const handleSettings = useCallback(() => onOpenPanel('settings'), [onOpenPanel]);
  const handleInventory = useCallback(() => onOpenPanel('inventory'), [onOpenPanel]);
  const handleSkills = useCallback(() => onOpenPanel('skills'), [onOpenPanel]);

  const buttons: ToolbarButton[] = [
    {
      id: 'quests',
      icon: '📋',
      labelKey: 'storyTerminal.quests',
      shortcut: 'Q',
      action: handleQuests,
    },
    {
      id: 'map',
      icon: '🗺',
      labelKey: 'storyTerminal.map',
      shortcut: 'M',
      action: handleMap,
    },
    {
      id: 'inventory',
      icon: '🎒',
      labelKey: 'storyTerminal.inventory',
      shortcut: 'I',
      action: handleInventory,
    },
    {
      id: 'skills',
      icon: '✦',
      labelKey: 'storyTerminal.skills',
      shortcut: 'K',
      action: handleSkills,
    },
    {
      id: 'settings',
      icon: '⚙',
      labelKey: 'storyTerminal.settings',
      shortcut: 'S',
      action: handleSettings,
    },
    {
      id: 'save',
      icon: '💾',
      labelKey: 'storyTerminal.save',
      shortcut: 'F5',
      action: onSave,
    },
  ];

  // Keyboard shortcuts
  // Panels, the map and pausing are owned by the app, which knows what else is open.
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'F5') {
        e.preventDefault();
        onSave();
      } else if (e.key.toLowerCase() === 's') {
        handleSettings();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled, handleSettings, onSave]);

  return (
    <div className="story-status-bar" role="toolbar" aria-label={t('storyTerminal.toolbar')}>
      {buttons.map((btn) => (
        <button
          key={btn.id}
          className="story-status-btn"
          onClick={btn.action}
          aria-label={t(btn.labelKey)}
        >
          <span aria-hidden="true">{btn.icon}</span>
          {t(btn.labelKey)}
          <span className="story-status-shortcut" aria-hidden="true">
            [{btn.shortcut}]
          </span>
        </button>
      ))}
    </div>
  );
}

export const StatusBar = React.memo(StatusBarInner);
