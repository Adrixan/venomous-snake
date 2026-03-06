import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { Achievement } from '@venomous-snake/challenge-engine';

export interface ToastNotification {
  id: string;
  achievement: Achievement;
}

export interface AchievementToastProps {
  notifications: ToastNotification[];
  onDismiss: (id: string) => void;
}

const FONT_FAMILY = "'JetBrains Mono', 'Fira Code', monospace";
const DISMISS_DELAY_MS = 5000;

interface SingleToastProps {
  notification: ToastNotification;
  onDismiss: (id: string) => void;
}

function SingleToast({ notification, onDismiss }: SingleToastProps): React.JSX.Element {
  const { t } = useTranslation('ui');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Mount → slide in
    const showTimer = setTimeout(() => setVisible(true), 50);
    // Auto-dismiss
    const dismissTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(notification.id), 350);
    }, DISMISS_DELAY_MS);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
  }, [notification.id, onDismiss]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => onDismiss(notification.id), 350);
  }, [notification.id, onDismiss]);

  const toastStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#1a1200',
    border: '1px solid #ffb454',
    borderLeft: '4px solid #ffb454',
    borderRadius: '2px',
    padding: '12px 14px',
    minWidth: '280px',
    maxWidth: '360px',
    transform: visible ? 'translateX(0)' : 'translateX(110%)',
    opacity: visible ? 1 : 0,
    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(255, 180, 84, 0.25)',
    fontFamily: FONT_FAMILY,
    userSelect: 'none',
    position: 'relative',
  };

  return (
    <div
      style={toastStyle}
      onClick={handleDismiss}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleDismiss();
        }
      }}
    >
      <span style={{ fontSize: '28px', flexShrink: 0, lineHeight: 1 }}>
        {notification.achievement.icon}
      </span>
      <div style={{ flex: 1 }}>
        <div
          style={{
            color: '#888',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '2px',
          }}
        >
          {t('achievements.unlocked_label')}
        </div>
        <div
          style={{ color: '#ffb454', fontSize: '13px', fontWeight: 'bold', marginBottom: '2px' }}
        >
          {t(notification.achievement.nameKey)}
        </div>
        <div style={{ color: '#aaa', fontSize: '11px' }}>
          {t(notification.achievement.descriptionKey)}
        </div>
        {notification.achievement.xpReward > 0 && (
          <div style={{ color: '#00ff9d', fontSize: '11px', marginTop: '4px' }}>
            +{notification.achievement.xpReward} XP
          </div>
        )}
      </div>
      <div style={{ color: '#555', fontSize: '18px', flexShrink: 0, alignSelf: 'flex-start' }}>
        ×
      </div>
    </div>
  );
}

export function AchievementToast({
  notifications,
  onDismiss,
}: AchievementToastProps): React.JSX.Element {
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    zIndex: 9999,
    pointerEvents: 'none',
  };

  return (
    <div style={containerStyle} aria-label="Achievement notifications">
      {notifications.map((notification) => (
        <div key={notification.id} style={{ pointerEvents: 'auto' }}>
          <SingleToast notification={notification} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}
