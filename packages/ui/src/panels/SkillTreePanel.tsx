import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { SkillNode, SkillCategory } from '@venomous-snake/challenge-engine';
import { SKILL_TREE } from '@venomous-snake/challenge-engine';

export interface SkillTreePanelProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedSkills: string[];
  availableSkills: string[];
  xp: number;
  onUnlock: (skillId: string) => void;
}

const FONT_FAMILY = "'JetBrains Mono', 'Fira Code', monospace";

const CATEGORY_COLORS: Record<SkillCategory, string> = {
  fundamentals: '#00ff9d',
  control_flow: '#00b4d8',
  functions: '#ffb454',
  data_structures: '#a855f7',
  oop: '#f43f5e',
  advanced: '#f97316',
};

const CATEGORY_LABEL_KEYS: Record<SkillCategory, string> = {
  fundamentals: 'skill_tree.cat_fundamentals',
  control_flow: 'skill_tree.cat_control_flow',
  functions: 'skill_tree.cat_functions',
  data_structures: 'skill_tree.cat_data_structures',
  oop: 'skill_tree.cat_oop',
  advanced: 'skill_tree.cat_advanced',
};

const CATEGORY_ORDER: SkillCategory[] = [
  'fundamentals',
  'control_flow',
  'functions',
  'data_structures',
  'oop',
  'advanced',
];

const COL_WIDTH = 170;
const ROW_HEIGHT = 110;
const NODE_RADIUS = 30;
const PADDING_X = 55;
const PADDING_Y = 70;

interface NodeLayout {
  node: SkillNode;
  x: number;
  y: number;
}

function buildLayout(): NodeLayout[] {
  const layout: NodeLayout[] = [];

  for (const category of CATEGORY_ORDER) {
    const col = CATEGORY_ORDER.indexOf(category);
    const nodesInCat = SKILL_TREE.filter((n) => n.category === category);
    nodesInCat.forEach((node, row) => {
      layout.push({
        node,
        x: PADDING_X + col * COL_WIDTH,
        y: PADDING_Y + row * ROW_HEIGHT,
      });
    });
  }

  return layout;
}

const NODE_LAYOUT = buildLayout();

const CANVAS_WIDTH = PADDING_X * 2 + (CATEGORY_ORDER.length - 1) * COL_WIDTH + NODE_RADIUS * 2;
const MAX_ROWS = Math.max(
  ...CATEGORY_ORDER.map((cat) => SKILL_TREE.filter((n) => n.category === cat).length),
);
const CANVAS_HEIGHT = PADDING_Y + MAX_ROWS * ROW_HEIGHT + NODE_RADIUS;

function getNodeLayout(nodeId: string): NodeLayout | undefined {
  return NODE_LAYOUT.find((nl) => nl.node.id === nodeId);
}

export function SkillTreePanel({
  isOpen,
  onClose,
  unlockedSkills,
  availableSkills,
  xp,
  onUnlock,
}: SkillTreePanelProps): React.JSX.Element {
  const { t } = useTranslation('ui');
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        if (selectedNode !== null) {
          setSelectedNode(null);
        } else {
          onClose();
        }
      }
    },
    [isOpen, onClose, selectedNode],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getNodeState = (nodeId: string): 'unlocked' | 'available' | 'locked' => {
    if (unlockedSkills.includes(nodeId)) return 'unlocked';
    if (availableSkills.includes(nodeId)) return 'available';
    return 'locked';
  };

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    zIndex: 400,
    display: isOpen ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: FONT_FAMILY,
  };

  const dialogStyle: React.CSSProperties = {
    background: '#0d1117',
    border: '1px solid #00ff9d',
    borderRadius: '4px',
    width: 'min(95vw, 1100px)',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #222',
  };

  const svgConnections = NODE_LAYOUT.flatMap(({ node, x: tx, y: ty }) =>
    node.prerequisites.map((prereqId) => {
      const prereqLayout = getNodeLayout(prereqId);
      if (prereqLayout === undefined) return null;
      const { x: fx, y: fy } = prereqLayout;
      const prereqState = getNodeState(prereqId);
      const nodeState = getNodeState(node.id);
      const color =
        prereqState === 'unlocked' && nodeState !== 'locked' ? '#00ff9d33' : '#ffffff11';
      return (
        <line
          key={`${prereqId}->${node.id}`}
          x1={fx}
          y1={fy}
          x2={tx}
          y2={ty}
          stroke={color}
          strokeWidth={2}
          strokeDasharray={nodeState === 'locked' ? '4 4' : undefined}
        />
      );
    }),
  );

  return (
    <div style={panelStyle} role="dialog" aria-modal="true" aria-label={t('skill_tree.title')}>
      <div style={dialogStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={{ color: '#00ff9d', fontSize: '16px', margin: 0 }}>{t('skill_tree.title')}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#ffb454', fontSize: '13px' }}>
              {t('skill_tree.xp_available', { xp })}
            </span>
            <button
              style={{
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
              }}
              onClick={onClose}
              aria-label={t('skill_tree.close')}
            >
              ×
            </button>
          </div>
        </div>

        {/* Category legend */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            padding: '8px 16px',
            borderBottom: '1px solid #1a1a2e',
            flexWrap: 'wrap',
          }}
        >
          {CATEGORY_ORDER.map((cat) => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: CATEGORY_COLORS[cat],
                }}
              />
              <span style={{ color: '#aaa', fontSize: '11px' }}>{t(CATEGORY_LABEL_KEYS[cat])}</span>
            </div>
          ))}
        </div>

        {/* Tree canvas */}
        <div style={{ flex: 1, overflowAuto: 'both', position: 'relative' } as React.CSSProperties}>
          <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '55vh' }}>
            <div style={{ position: 'relative', width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
              {/* SVG connection lines */}
              <svg
                style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
              >
                {svgConnections}
              </svg>

              {/* Category labels */}
              {CATEGORY_ORDER.map((cat, col) => (
                <div
                  key={cat}
                  style={{
                    position: 'absolute',
                    left: PADDING_X + col * COL_WIDTH - NODE_RADIUS,
                    top: 8,
                    width: NODE_RADIUS * 2,
                    textAlign: 'center',
                    color: CATEGORY_COLORS[cat],
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap',
                    transform: 'translateX(-50%) translateX(' + NODE_RADIUS + 'px)',
                  }}
                >
                  {t(CATEGORY_LABEL_KEYS[cat])}
                </div>
              ))}

              {/* Skill nodes */}
              {NODE_LAYOUT.map(({ node, x, y }) => {
                const state = getNodeState(node.id);
                const color = CATEGORY_COLORS[node.category];
                const isSelected = selectedNode?.id === node.id;

                const nodeStyle: React.CSSProperties = {
                  position: 'absolute',
                  left: x - NODE_RADIUS,
                  top: y - NODE_RADIUS,
                  width: NODE_RADIUS * 2,
                  height: NODE_RADIUS * 2,
                  borderRadius: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: state === 'locked' ? 'not-allowed' : 'pointer',
                  background:
                    state === 'unlocked'
                      ? `${color}22`
                      : state === 'available'
                        ? '#1a1a2e'
                        : '#111',
                  border: `2px solid ${state === 'locked' ? '#333' : isSelected ? '#fff' : color}`,
                  boxShadow:
                    state === 'available'
                      ? `0 0 10px ${color}55`
                      : state === 'unlocked'
                        ? `0 0 6px ${color}44`
                        : 'none',
                  opacity: state === 'locked' ? 0.4 : 1,
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                  userSelect: 'none',
                };

                return (
                  <button
                    key={node.id}
                    style={nodeStyle}
                    onClick={() => setSelectedNode(isSelected ? null : node)}
                    title={t(node.nameKey)}
                    aria-label={`${t(node.nameKey)} — ${state}`}
                    aria-pressed={isSelected}
                  >
                    <span style={{ fontSize: '16px', lineHeight: 1 }}>{node.icon}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detail panel */}
        {selectedNode !== null && (
          <SkillDetailPanel
            node={selectedNode}
            state={getNodeState(selectedNode.id)}
            xp={xp}
            onUnlock={() => {
              onUnlock(selectedNode.id);
              setSelectedNode(null);
            }}
            onClose={() => setSelectedNode(null)}
            t={t as (key: string, opts?: Record<string, unknown>) => string}
            categoryColor={CATEGORY_COLORS[selectedNode.category]}
          />
        )}
      </div>
    </div>
  );
}

interface SkillDetailPanelProps {
  node: SkillNode;
  state: 'unlocked' | 'available' | 'locked';
  xp: number;
  onUnlock: () => void;
  onClose: () => void;
  t: (key: string, opts?: Record<string, unknown>) => string;
  categoryColor: string;
}

function SkillDetailPanel({
  node,
  state,
  xp,
  onUnlock,
  onClose,
  t,
  categoryColor,
}: SkillDetailPanelProps): React.JSX.Element {
  return (
    <div
      style={{
        borderTop: '1px solid #222',
        padding: '16px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        background: '#0a0a0f',
      }}
    >
      <span style={{ fontSize: '32px', flexShrink: 0 }}>{node.icon}</span>
      <div style={{ flex: 1 }}>
        <div
          style={{
            color: categoryColor,
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '4px',
          }}
        >
          {t(node.nameKey)}
        </div>
        <div style={{ color: '#aaa', fontSize: '12px', marginBottom: '8px' }}>
          {t(node.descriptionKey)}
        </div>
        {node.xpCost > 0 && (
          <div style={{ color: '#ffb454', fontSize: '11px' }}>
            {t('skill_tree.xp_cost', { cost: node.xpCost })}
          </div>
        )}
        {node.unlockEffect !== undefined && (
          <div style={{ color: '#00ff9d', fontSize: '11px', marginTop: '4px' }}>
            ✦ {t(`skill_tree.effect_${node.unlockEffect}`)}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        {state === 'available' && xp >= node.xpCost && (
          <button
            style={{
              background: categoryColor,
              border: 'none',
              color: '#000',
              padding: '8px 14px',
              fontSize: '12px',
              fontFamily: "'JetBrains Mono', monospace",
              cursor: 'pointer',
              borderRadius: '2px',
            }}
            onClick={onUnlock}
          >
            {t('skill_tree.unlock')}
          </button>
        )}
        {state === 'unlocked' && (
          <span style={{ color: '#00ff9d', fontSize: '12px', padding: '8px 0' }}>
            ✓ {t('skill_tree.unlocked')}
          </span>
        )}
        <button
          style={{
            background: 'transparent',
            border: '1px solid #333',
            color: '#999',
            padding: '8px 12px',
            fontSize: '12px',
            fontFamily: "'JetBrains Mono', monospace",
            cursor: 'pointer',
            borderRadius: '2px',
          }}
          onClick={onClose}
        >
          {t('skill_tree.close')}
        </button>
      </div>
    </div>
  );
}
