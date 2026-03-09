import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export interface ItemPickupNotification {
  id: string;
  itemId: string;
  name: string;
  description: string;
  itemType: string;
  /** Whether this is the first time the player has picked up this item. */
  isFirstPickup: boolean;
}

export interface ItemPickupToastProps {
  notifications: ItemPickupNotification[];
  onDismiss: (id: string) => void;
}

const FONT_FAMILY = "'JetBrains Mono', 'Fira Code', monospace";
const DISMISS_DELAY_MS = 3000;
const FIRST_PICKUP_DISMISS_DELAY_MS = 5000;

const ITEM_TYPE_ICON: Record<string, string> = {
  datafile: '📄',
  tool: '🔧',
  keycard: '🗝️',
};

const ITEM_TYPE_COLOR: Record<string, string> = {
  datafile: '#00e5ff',
  tool: '#00ff9d',
  keycard: '#c792ea',
};

interface SinglePickupToastProps {
  notification: ItemPickupNotification;
  onDismiss: (id: string) => void;
}

function SinglePickupToast({ notification, onDismiss }: SinglePickupToastProps): React.JSX.Element {
  const { t } = useTranslation('ui');
  const [visible, setVisible] = useState(false);

  const delay = notification.isFirstPickup ? FIRST_PICKUP_DISMISS_DELAY_MS : DISMISS_DELAY_MS;
  const accentColor = ITEM_TYPE_COLOR[notification.itemType] ?? '#00ff9d';
  const icon = ITEM_TYPE_ICON[notification.itemType] ?? '📦';

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 50);
    const dismissTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(notification.id), 350);
    }, delay);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
  }, [notification.id, delay, onDismiss]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => onDismiss(notification.id), 350);
  }, [notification.id, onDismiss]);

  const typeLabel = t(`item_pickup.type_${notification.itemType}`, {
    defaultValue: notification.itemType,
  });

  const toastStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    background: '#0a0a1a',
    border: `1px solid ${accentColor}`,
    borderLeft: `4px solid ${accentColor}`,
    borderRadius: '2px',
    padding: '12px 14px',
    minWidth: '280px',
    maxWidth: '380px',
    transform: visible ? 'translateY(0)' : 'translateY(-110%)',
    opacity: visible ? 1 : 0,
    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease',
    cursor: 'pointer',
    boxShadow: `0 4px 20px ${accentColor}33`,
    fontFamily: FONT_FAMILY,
    userSelect: 'none',
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
      <span style={{ fontSize: '28px', flexShrink: 0, lineHeight: 1, marginTop: '2px' }}>
        {icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '2px',
          }}
        >
          <span
            style={{
              color: '#888',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {t('item_pickup.title')}
          </span>
          <span
            style={{
              color: accentColor,
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              opacity: 0.8,
            }}
          >
            [{typeLabel}]
          </span>
          {notification.isFirstPickup && (
            <span
              style={{
                color: '#ffb454',
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                border: '1px solid #ffb454',
                padding: '0 3px',
                borderRadius: '1px',
              }}
            >
              {t('item_pickup.first_time_label')}
            </span>
          )}
        </div>
        <div
          style={{
            color: accentColor,
            fontSize: '13px',
            fontWeight: 'bold',
            marginBottom: '4px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {notification.name}
        </div>
        {notification.isFirstPickup && (
          <div
            style={{
              color: '#aaa',
              fontSize: '11px',
              lineHeight: '1.4',
            }}
          >
            {notification.description}
          </div>
        )}
      </div>
      <div style={{ color: '#555', fontSize: '18px', flexShrink: 0, alignSelf: 'flex-start' }}>
        ×
      </div>
    </div>
  );
}

export function ItemPickupToast({
  notifications,
  onDismiss,
}: ItemPickupToastProps): React.JSX.Element {
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    zIndex: 500,
    pointerEvents: 'none',
    alignItems: 'center',
  };

  return (
    <div style={containerStyle} aria-label="Item pickup notifications">
      {notifications.map((notification) => (
        <div key={notification.id} style={{ pointerEvents: 'auto' }}>
          <SinglePickupToast notification={notification} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}
