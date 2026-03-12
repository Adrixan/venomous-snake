import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { GameAction } from '@venomous-snake/shared-types';

export interface ActionPanelProps {
  actions: GameAction[];
  onAction: (action: GameAction) => void;
}

const ACTION_ICONS: Record<GameAction['type'], string> = {
  move: '→',
  talk: '💬',
  hack: '💻',
  pickup: '📦',
  look: '👁',
  examine: '🔍',
  inventory: '📦',
  help: '❓',
  use_item: '🔧',
};

function ActionPanelInner({ actions, onAction }: ActionPanelProps): React.JSX.Element {
  const { t } = useTranslation('ui');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Clamp selected index when actions change
  useEffect(() => {
    setSelectedIndex((prev) => (prev >= actions.length ? 0 : prev));
  }, [actions.length]);

  const activateAction = useCallback(
    (action: GameAction) => {
      if (action.disabled !== true) {
        onAction(action);
      }
    },
    [onAction],
  );

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (actions.length === 0) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % actions.length);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + actions.length) % actions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const action = actions[selectedIndex];
        if (action !== undefined) {
          activateAction(action);
        }
      } else {
        // Number keys 1-9
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 9 && num <= actions.length) {
          e.preventDefault();
          const action = actions[num - 1];
          if (action !== undefined) {
            activateAction(action);
          }
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [actions, selectedIndex, activateAction]);

  if (actions.length === 0) {
    return (
      <div
        className="story-action-panel"
        role="navigation"
        aria-label={t('storyTerminal.actions', 'Actions')}
      >
        <div
          style={{ padding: '8px 12px', color: '#3d4752', fontStyle: 'italic', fontSize: '13px' }}
        >
          {t('storyTerminal.noActions', 'No actions available...')}
        </div>
      </div>
    );
  }

  return (
    <div
      className="story-action-panel"
      role="navigation"
      aria-label={t('storyTerminal.actions', 'Actions')}
    >
      {actions.map((action, i) => {
        const isDisabled = action.disabled === true;
        const isSelected = i === selectedIndex;
        const icon = isDisabled ? '🔒' : (ACTION_ICONS[action.type] ?? '▸');

        let className = 'story-action-btn';
        if (isSelected) className += ' story-action-btn--selected';
        if (isDisabled) className += ' story-action-btn--disabled';

        return (
          <button
            key={action.id}
            className={className}
            onClick={() => activateAction(action)}
            disabled={isDisabled}
            title={isDisabled ? (action.disabledReason ?? '') : undefined}
            aria-label={action.label}
          >
            <span className="story-action-icon" aria-hidden="true">
              {icon}
            </span>
            <span className="story-action-label">{action.label}</span>
            {i < 9 && (
              <span className="story-action-key" aria-hidden="true">
                {i + 1}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export const ActionPanel = React.memo(ActionPanelInner);
