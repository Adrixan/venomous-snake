import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import type { SaveSlot } from '@venomous-snake/save-system';
import { saveManager, SaveSystemError } from '@venomous-snake/save-system';
import { downloadTextFile } from '@venomous-snake/save-system';

export interface SaveSlotModalProps {
  mode: 'save' | 'load';
  onClose: () => void;
  onSave: (slotId: string | undefined) => Promise<void>;
  onLoad: (slotId: string) => void;
  onDelete: (slotId: string) => Promise<void>;
  listSaves: () => Promise<SaveSlot[]>;
}

const FONT = "'JetBrains Mono', 'Fira Code', monospace";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

/** Slot names are stored in English by `useSaveSystem`, so old saves follow the language too. */
function displayName(t: TFunction, storedName: string): string {
  const match = /^(Auto )?Save — (.+) · Floor (\d+)$/.exec(storedName);
  if (match === null) return storedName;
  const key = match[1] === undefined ? 'save_slots.slot_manual' : 'save_slots.slot_auto';
  return t(key, { name: match[2], floor: match[3] });
}

/** Coded failures name the problem; anything else is internal and only logged. */
function errorText(t: TFunction, error: unknown, fallbackKey: string): string {
  if (error instanceof SaveSystemError) return t(`save_slots.errors.${error.code}`, error.params);
  console.error('Save operation failed', error);
  return t(fallbackKey);
}

export function SaveSlotModal({
  mode,
  onClose,
  onSave,
  onLoad,
  onDelete,
  listSaves,
}: SaveSlotModalProps): React.JSX.Element {
  const { t } = useTranslation('ui');
  const [slots, setSlots] = useState<SaveSlot[]>([]);
  const [busy, setBusy] = useState(false);
  const [confirmOverwrite, setConfirmOverwrite] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback((): void => {
    void listSaves().then((s) => {
      const sorted = [...s].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      setSlots(sorted);
    });
  }, [listSaves]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Close on Escape
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (confirmOverwrite !== null) {
          setConfirmOverwrite(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [confirmOverwrite, onClose]);

  const handleSaveToSlot = useCallback(
    async (slotId: string) => {
      setBusy(true);
      setError(null);
      try {
        await onSave(slotId);
        refresh();
        setConfirmOverwrite(null);
      } catch (err) {
        setError(errorText(t, err, 'save_slots.failed.save'));
      } finally {
        setBusy(false);
      }
    },
    [onSave, refresh, t],
  );

  const handleNewSave = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      await onSave(undefined);
      refresh();
    } catch (err) {
      setError(errorText(t, err, 'save_slots.failed.save'));
    } finally {
      setBusy(false);
    }
  }, [onSave, refresh, t]);

  const handleLoad = useCallback(
    (slotId: string) => {
      onLoad(slotId);
    },
    [onLoad],
  );

  const handleDelete = useCallback(
    async (slotId: string) => {
      setBusy(true);
      setError(null);
      try {
        await onDelete(slotId);
        refresh();
      } catch (err) {
        setError(errorText(t, err, 'save_slots.failed.delete'));
      } finally {
        setBusy(false);
      }
    },
    [onDelete, refresh, t],
  );

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.82)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: FONT,
    zIndex: 400,
  };

  const panelStyle: React.CSSProperties = {
    background: '#0d1117',
    border: '1px solid #00ff9d',
    boxShadow: '0 0 40px #00ff9d18',
    borderRadius: '4px',
    padding: '28px',
    width: '520px',
    maxWidth: '92vw',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const titleStyle: React.CSSProperties = {
    color: '#00ff9d',
    fontSize: '16px',
    fontWeight: 700,
    letterSpacing: '3px',
    textTransform: 'uppercase' as const,
    margin: 0,
    textShadow: '0 0 10px #00ff9d44',
  };

  const slotListStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '360px',
  };

  const slotRowStyle = (isAuto: boolean): React.CSSProperties => ({
    background: isAuto ? '#0a1020' : '#0a0e18',
    border: '1px solid #1a2a3a',
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  });

  const btnStyle = (color = '#00ff9d'): React.CSSProperties => ({
    background: 'transparent',
    border: `1px solid ${color}44`,
    color,
    fontFamily: FONT,
    fontSize: '12px',
    padding: '5px 12px',
    cursor: busy ? 'not-allowed' : 'pointer',
    whiteSpace: 'nowrap' as const,
    minHeight: '30px',
    opacity: busy ? 0.5 : 1,
  });

  const title = t(mode === 'save' ? 'save_slots.title_save' : 'save_slots.title_load');

  return (
    <div style={backdropStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={panelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={titleStyle}>{title}</h2>
          <button style={btnStyle('#888')} onClick={onClose} aria-label={t('accessibility.close')}>
            ✕
          </button>
        </div>

        {error !== null && (
          <div
            style={{
              background: '#1a0808',
              border: '1px solid #ff3366',
              color: '#ff3366',
              padding: '8px 12px',
              fontSize: '12px',
            }}
          >
            {error}
          </div>
        )}

        {/* Overwrite confirmation */}
        {confirmOverwrite !== null && (
          <div
            style={{
              background: '#1a1008',
              border: '1px solid #ffb454',
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <p
              style={{
                color: '#ffb454',
                fontSize: '13px',
                margin: 0,
              }}
            >
              {t('save_slots.overwrite_confirm')}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={btnStyle('#ffb454')}
                onClick={() => void handleSaveToSlot(confirmOverwrite)}
                disabled={busy}
              >
                {t('save_slots.overwrite')}
              </button>
              <button
                style={btnStyle('#888')}
                onClick={() => setConfirmOverwrite(null)}
                disabled={busy}
              >
                {t('save_slots.cancel')}
              </button>
            </div>
          </div>
        )}

        {/* Save slot list */}
        <div style={slotListStyle}>
          {slots.length === 0 && (
            <p style={{ color: '#666', fontSize: '13px', margin: '16px 0', textAlign: 'center' }}>
              {t(mode === 'load' ? 'save_slots.empty_load' : 'save_slots.empty_save')}
            </p>
          )}
          {slots.map((slot) => (
            <div key={slot.id} style={slotRowStyle(slot.isAutoSave)}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    color: slot.isAutoSave ? '#00b4d8' : '#e0e0e0',
                    fontSize: '13px',
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {slot.isAutoSave ? '⟳ ' : ''}
                  {displayName(t, slot.name)}
                </div>
                <div style={{ color: '#555', fontSize: '11px', marginTop: '2px' }}>
                  {formatDate(slot.updatedAt)}
                  {' · '}
                  {t('save_slots.meta', {
                    level: Math.floor(slot.data.progress.totalXp / 100) + 1,
                    xp: slot.data.progress.totalXp,
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                {mode === 'load' ? (
                  <button
                    style={btnStyle('#00ff9d')}
                    onClick={() => handleLoad(slot.id)}
                    disabled={busy}
                  >
                    {t('save_slots.load')}
                  </button>
                ) : (
                  <button
                    style={btnStyle('#00ff9d')}
                    onClick={() => setConfirmOverwrite(slot.id)}
                    disabled={busy}
                  >
                    {t('save_slots.save')}
                  </button>
                )}
                <button
                  style={btnStyle('#ff3366')}
                  onClick={() => void handleDelete(slot.id)}
                  disabled={busy}
                  aria-label={t('save_slots.delete_aria', { name: displayName(t, slot.name) })}
                >
                  {t('save_slots.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          {mode === 'save' && (
            <button
              style={btnStyle('#00ff9d')}
              onClick={() => void handleNewSave()}
              disabled={busy}
            >
              {t('save_slots.new_slot')}
            </button>
          )}
          <button
            style={btnStyle('#00b4d8')}
            onClick={() => {
              setBusy(true);
              setError(null);
              void saveManager
                .exportSlots()
                .then((text) => downloadTextFile('venomous-snake-saves.json', text))
                .then(() => setBusy(false))
                .catch((err: unknown) => {
                  setError(errorText(t, err, 'save_slots.failed.export'));
                  setBusy(false);
                });
            }}
            disabled={busy || slots.length === 0}
          >
            {t('save_slots.export_all')}
          </button>
          <label
            style={{
              ...btnStyle('#00b4d8'),
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {t('save_slots.import')}
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setBusy(true);
                setError(null);
                void file
                  .text()
                  .then((text) => saveManager.importFile(text))
                  .then(() => {
                    refresh();
                    setBusy(false);
                  })
                  .catch((err: unknown) => {
                    setError(errorText(t, err, 'save_slots.failed.import'));
                    setBusy(false);
                  });
                e.target.value = '';
              }}
              disabled={busy}
            />
          </label>
          <button style={btnStyle('#888')} onClick={onClose} disabled={busy}>
            {t('save_slots.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
