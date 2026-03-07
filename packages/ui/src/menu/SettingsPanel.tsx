import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { i18n } from '@venomous-snake/i18n';
import type { GameSettings } from '@venomous-snake/save-system';
import { AudioSettingsPanel } from '../panels/AudioSettingsPanel';
import type { AudioSettingsPanelProps } from '../panels/AudioSettingsPanel';

export interface SettingsPanelProps {
  onBack: () => void;
  /** When provided, the volume sliders are delegated to AudioSettingsPanel. */
  audioSettings?: AudioSettingsPanelProps;
}

const FONT_FAMILY = "'JetBrains Mono', 'Fira Code', monospace";
const STORAGE_KEY = 'vs-settings';

const DEFAULT_SETTINGS: GameSettings = {
  language: 'en',
  volumeMaster: 80,
  volumeMusic: 60,
  volumeSfx: 70,
  fullscreen: false,
  reducedMotion: false,
};

function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        return { ...DEFAULT_SETTINGS, ...(parsed as Partial<GameSettings>) };
      }
    }
  } catch {
    // ignore parse errors
  }
  return { ...DEFAULT_SETTINGS };
}

function saveSettings(settings: GameSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function SettingsPanel({ onBack, audioSettings }: SettingsPanelProps): React.JSX.Element {
  const { t } = useTranslation('ui');
  const [settings, setSettings] = useState<GameSettings>(loadSettings);

  const update = useCallback((partial: Partial<GameSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      saveSettings(next);
      return next;
    });
  }, []);

  const handleLanguageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const lang = e.target.value;
      update({ language: lang });
      void i18n.changeLanguage(lang);
    },
    [update],
  );

  const handleFullscreenToggle = useCallback(() => {
    const newVal = !settings.fullscreen;
    update({ fullscreen: newVal });
    if (newVal) {
      void document.documentElement.requestFullscreen().catch(() => {
        // fullscreen may not be available
      });
    } else if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {
        // may already be exited
      });
    }
  }, [settings.fullscreen, update]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && settings.fullscreen) {
        update({ fullscreen: false });
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [settings.fullscreen, update]);

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: '#0a0a0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: FONT_FAMILY,
    zIndex: 100,
  };

  const cardStyle: React.CSSProperties = {
    background: '#0d1117',
    border: '1px solid #00ff9d44',
    borderRadius: '4px',
    padding: '32px',
    width: '420px',
    maxWidth: '90vw',
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '44px',
    marginBottom: '16px',
  };

  const labelStyle: React.CSSProperties = {
    color: '#e0e0e0',
    fontSize: '14px',
  };

  const sliderStyle: React.CSSProperties = {
    width: '140px',
    minHeight: '44px',
    accentColor: '#00ff9d',
    cursor: 'pointer',
  };

  const selectStyle: React.CSSProperties = {
    minHeight: '44px',
    padding: '8px 12px',
    background: '#0a0a0f',
    border: '1px solid #333',
    color: '#e0e0e0',
    fontFamily: FONT_FAMILY,
    fontSize: '13px',
    cursor: 'pointer',
  };

  const checkboxContainerStyle: React.CSSProperties = {
    minWidth: '44px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const buttonStyle: React.CSSProperties = {
    minWidth: '48px',
    minHeight: '48px',
    padding: '12px 20px',
    background: 'rgba(10, 10, 15, 0.85)',
    border: '1px solid #00ff9d55',
    color: '#00ff9d',
    fontFamily: FONT_FAMILY,
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '8px',
    boxShadow: '0 0 6px rgba(0,255,157,0.15)',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: '#00ff9d', fontSize: '20px', margin: '0 0 24px 0' }}>
          {t('settings.title')}
        </h2>

        {/* Language */}
        <div style={rowStyle}>
          <span style={labelStyle}>{t('settings.language')}</span>
          <select style={selectStyle} value={settings.language} onChange={handleLanguageChange}>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        {/* Audio — delegate to AudioSettingsPanel when wired to the store */}
        {audioSettings !== undefined ? (
          <AudioSettingsPanel {...audioSettings} />
        ) : (
          <>
            {/* Master Volume */}
            <div style={rowStyle}>
              <span style={labelStyle}>{t('settings.volume_master')}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.volumeMaster}
                  onChange={(e) => update({ volumeMaster: Number(e.target.value) })}
                  style={sliderStyle}
                />
                <span
                  style={{ color: '#666', fontSize: '12px', width: '32px', textAlign: 'right' }}
                >
                  {settings.volumeMaster}
                </span>
              </div>
            </div>

            {/* Music Volume */}
            <div style={rowStyle}>
              <span style={labelStyle}>{t('settings.volume_music')}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.volumeMusic}
                  onChange={(e) => update({ volumeMusic: Number(e.target.value) })}
                  style={sliderStyle}
                />
                <span
                  style={{ color: '#666', fontSize: '12px', width: '32px', textAlign: 'right' }}
                >
                  {settings.volumeMusic}
                </span>
              </div>
            </div>

            {/* SFX Volume */}
            <div style={rowStyle}>
              <span style={labelStyle}>{t('settings.volume_sfx')}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.volumeSfx}
                  onChange={(e) => update({ volumeSfx: Number(e.target.value) })}
                  style={sliderStyle}
                />
                <span
                  style={{ color: '#666', fontSize: '12px', width: '32px', textAlign: 'right' }}
                >
                  {settings.volumeSfx}
                </span>
              </div>
            </div>
          </>
        )}

        {/* Fullscreen */}
        <div style={rowStyle}>
          <span style={labelStyle}>{t('settings.fullscreen')}</span>
          <div style={checkboxContainerStyle}>
            <input
              type="checkbox"
              checked={settings.fullscreen}
              onChange={handleFullscreenToggle}
              style={{ width: '20px', height: '20px', accentColor: '#00ff9d', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Reduced Motion */}
        <div style={rowStyle}>
          <span style={labelStyle}>{t('settings.reduced_motion')}</span>
          <div style={checkboxContainerStyle}>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={() => update({ reducedMotion: !settings.reducedMotion })}
              style={{ width: '20px', height: '20px', accentColor: '#00ff9d', cursor: 'pointer' }}
            />
          </div>
        </div>

        <button style={buttonStyle} onClick={onBack}>
          {t('new_game.back')}
        </button>
      </div>
    </div>
  );
}
