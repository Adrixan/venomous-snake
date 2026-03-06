import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { InventoryItem } from '@venomous-snake/save-system';

export interface InventoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  items: InventoryItem[];
}

const FONT_FAMILY = "'JetBrains Mono', 'Fira Code', monospace";

const typeIcons: Record<string, string> = {
  tool: '🔧',
  keycard: '🗝',
  datafile: '📄',
};

const typeCategoryKeys: Record<string, string> = {
  tool: 'inventory.category_tools',
  keycard: 'inventory.category_keycards',
  datafile: 'inventory.category_datafiles',
};

export function InventoryPanel({ isOpen, onClose, items }: InventoryPanelProps): React.JSX.Element {
  const { t } = useTranslation('ui');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    },
    [isOpen, onClose],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const groupedItems: Record<string, InventoryItem[]> = { tool: [], keycard: [], datafile: [] };
  for (const item of items) {
    const group = groupedItems[item.type];
    if (group !== undefined) {
      group.push(item);
    }
  }

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    right: 0,
    top: 0,
    bottom: 0,
    width: '380px',
    maxWidth: '100vw',
    background: '#0d1117',
    borderLeft: '1px solid #00ff9d',
    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s ease',
    zIndex: 300,
    fontFamily: FONT_FAMILY,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #333',
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: '#e0e0e0',
    fontSize: '20px',
    cursor: 'pointer',
    minWidth: '44px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const isEmpty = items.length === 0;

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <h2 style={{ color: '#00ff9d', fontSize: '16px', margin: 0 }}>{t('inventory.title')}</h2>
        <button style={closeButtonStyle} onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>

      <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
        {isEmpty ? (
          <p style={{ color: '#666', fontSize: '13px' }}>{t('inventory.empty')}</p>
        ) : (
          (['tool', 'keycard', 'datafile'] as const).map((type) => {
            const typeItems = groupedItems[type];
            if (typeItems === undefined || typeItems.length === 0) return null;
            const categoryKey = typeCategoryKeys[type];
            const icon = typeIcons[type];

            return (
              <div key={type} style={{ marginBottom: '20px' }}>
                <h3
                  style={{
                    color: '#00b4d8',
                    fontSize: '13px',
                    margin: '0 0 8px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  {categoryKey !== undefined ? t(categoryKey) : type}
                </h3>
                {typeItems.map((item) => {
                  const isHovered = hoveredItem === item.id;

                  const itemStyle: React.CSSProperties = {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    margin: '2px 0',
                    background: isHovered ? '#1a1a2e' : 'transparent',
                    borderRadius: '2px',
                    cursor: 'default',
                    position: 'relative',
                  };

                  return (
                    <div
                      key={item.id}
                      style={itemStyle}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <span style={{ fontSize: '18px' }}>{icon ?? '•'}</span>
                      <span style={{ color: '#e0e0e0', fontSize: '13px' }}>{item.nameKey}</span>
                      {isHovered && (
                        <div
                          style={{
                            position: 'absolute',
                            left: '100%',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: '#0a0a0f',
                            border: '1px solid #333',
                            padding: '6px 10px',
                            color: '#999',
                            fontSize: '11px',
                            whiteSpace: 'nowrap',
                            zIndex: 10,
                            marginLeft: '4px',
                          }}
                        >
                          {item.descriptionKey}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
