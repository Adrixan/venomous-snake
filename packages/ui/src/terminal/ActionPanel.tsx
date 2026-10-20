import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { GameAction } from '@venomous-snake/shared-types';
import { translateText } from '../i18n/translateText';

export interface ActionPanelProps {
  actions: GameAction[];
  onAction: (action: GameAction) => void;
  enabled?: boolean;
}

const ACTION_ICONS: Record<GameAction['type'], string> = {
  move: '→',
  talk: '💬',
  hack: '💻',
  look: '👁',
  examine: '🔍',
  help: '❓',
};

function ActionPanelInner({
  actions,
  onAction,
  enabled = true,
}: ActionPanelProps): React.JSX.Element {
  const { t } = useTranslation(['ui', 'story', 'dialog', 'challenges']);
  const translate = (key: string, params?: Record<string, string | number>): string => {
    return translateText(t, key, params);
  };
  const displayLabel = (action: GameAction): string =>
    action.labelKey ? translate(action.labelKey, action.labelParams) : action.label;
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Clamp selected index when actions change
  useEffect(() => {
    setSelectedIndex((prev) => (prev >= actions.length ? 0 : prev));
  }, [actions.length]);

  const activateAction = useCallback(
    (action: GameAction) => {
      if (enabled && action.disabled !== true) {
        onAction(action);
      }
    },
    [enabled, onAction],
  );

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!enabled || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (
        e.target instanceof HTMLElement &&
        (e.target.isContentEditable ||
          e.target.closest('input, textarea, select, button, [role="dialog"]'))
      )
        return;
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
  }, [actions, selectedIndex, activateAction, enabled]);

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
            aria-label={displayLabel(action)}
          >
            <span className="story-action-icon" aria-hidden="true">
              {icon}
            </span>
            <span className="story-action-label">
              {displayLabel(action)}
              {isDisabled && (action.disabledReasonKey || action.disabledReason) && (
                <span className="story-action-reason">
                  {action.disabledReasonKey
                    ? translate(action.disabledReasonKey, action.disabledReasonParams)
                    : action.disabledReason}
                </span>
              )}
            </span>
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
