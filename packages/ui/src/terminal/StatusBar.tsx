import React, { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export interface StatusBarProps {
  onOpenPanel: (panel: 'inventory' | 'questlog' | 'map' | 'settings') => void;
  onSave: () => void;
  onPause: () => void;
}

interface ToolbarButton {
  id: string;
  icon: string;
  labelKey: string;
  fallback: string;
  shortcut: string;
  action: () => void;
}

function StatusBarInner({ onOpenPanel, onSave, onPause }: StatusBarProps): React.JSX.Element {
  const { t } = useTranslation('ui');

  const handleInventory = useCallback(() => onOpenPanel('inventory'), [onOpenPanel]);
  const handleQuests = useCallback(() => onOpenPanel('questlog'), [onOpenPanel]);
  const handleMap = useCallback(() => onOpenPanel('map'), [onOpenPanel]);
  const handleSettings = useCallback(() => onOpenPanel('settings'), [onOpenPanel]);

  const buttons: ToolbarButton[] = [
    {
      id: 'inventory',
      icon: '📦',
      labelKey: 'storyTerminal.inventory',
      fallback: 'Inventory',
      shortcut: 'I',
      action: handleInventory,
    },
    {
      id: 'quests',
      icon: '📋',
      labelKey: 'storyTerminal.quests',
      fallback: 'Quests',
      shortcut: 'Q',
      action: handleQuests,
    },
    {
      id: 'map',
      icon: '🗺',
      labelKey: 'storyTerminal.map',
      fallback: 'Map',
      shortcut: 'M',
      action: handleMap,
    },
    {
      id: 'settings',
      icon: '⚙',
      labelKey: 'storyTerminal.settings',
      fallback: 'Settings',
      shortcut: 'S',
      action: handleSettings,
    },
    {
      id: 'save',
      icon: '💾',
      labelKey: 'storyTerminal.save',
      fallback: 'Save',
      shortcut: 'F5',
      action: onSave,
    },
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in an input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      const key = e.key.toLowerCase();
      if (key === 'i' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleInventory();
      } else if (key === 'q' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleQuests();
      } else if (key === 'm' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleMap();
      } else if (key === 'escape') {
        e.preventDefault();
        onPause();
      } else if (e.key === 'F5') {
        e.preventDefault();
        onSave();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleInventory, handleQuests, handleMap, onPause, onSave]);

  return (
    <div
      className="story-status-bar"
      role="toolbar"
      aria-label={t('storyTerminal.toolbar', 'Toolbar')}
    >
      {buttons.map((btn) => (
        <button
          key={btn.id}
          className="story-status-btn"
          onClick={btn.action}
          aria-label={t(btn.labelKey, btn.fallback)}
        >
          <span aria-hidden="true">{btn.icon}</span>
          {t(btn.labelKey, btn.fallback)}
          <span className="story-status-shortcut" aria-hidden="true">
            [{btn.shortcut}]
          </span>
        </button>
      ))}
    </div>
  );
}

export const StatusBar = React.memo(StatusBarInner);
