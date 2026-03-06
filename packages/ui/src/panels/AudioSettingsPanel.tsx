import React from 'react';
import { useTranslation } from 'react-i18next';

const FONT_FAMILY = "'JetBrains Mono', 'Fira Code', monospace";

export interface AudioSettingsPanelProps {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  isMuted: boolean;
  onMasterVolume: (v: number) => void;
  onMusicVolume: (v: number) => void;
  onSfxVolume: (v: number) => void;
  onToggleMute: () => void;
}

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
  fontFamily: FONT_FAMILY,
};

const sliderStyle: React.CSSProperties = {
  width: '140px',
  minHeight: '44px',
  accentColor: '#00ff9d',
  cursor: 'pointer',
};

const valueStyle: React.CSSProperties = {
  color: '#666',
  fontSize: '12px',
  width: '32px',
  textAlign: 'right',
  fontFamily: FONT_FAMILY,
};

const muteButtonBase: React.CSSProperties = {
  minHeight: '44px',
  padding: '8px 16px',
  border: '1px solid #333',
  fontFamily: FONT_FAMILY,
  fontSize: '12px',
  cursor: 'pointer',
  letterSpacing: '0.05em',
  transition: 'background 0.15s, color 0.15s, border-color 0.15s',
};

const sectionHeadingStyle: React.CSSProperties = {
  color: '#00ff9d',
  fontSize: '12px',
  fontFamily: FONT_FAMILY,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  marginBottom: '16px',
  marginTop: '4px',
  borderBottom: '1px solid #00ff9d22',
  paddingBottom: '8px',
};

function VolumeRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}): React.JSX.Element {
  return (
    <div style={rowStyle}>
      <span style={labelStyle}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(value * 100)}
          onChange={(e) => onChange(Number(e.target.value) / 100)}
          style={sliderStyle}
          aria-label={label}
        />
        <span style={valueStyle}>{Math.round(value * 100)}</span>
      </div>
    </div>
  );
}

export function AudioSettingsPanel({
  masterVolume,
  musicVolume,
  sfxVolume,
  isMuted,
  onMasterVolume,
  onMusicVolume,
  onSfxVolume,
  onToggleMute,
}: AudioSettingsPanelProps): React.JSX.Element {
  const { t } = useTranslation('ui');

  const muteButtonStyle: React.CSSProperties = {
    ...muteButtonBase,
    background: isMuted ? '#00ff9d22' : 'transparent',
    color: isMuted ? '#00ff9d' : '#888',
    borderColor: isMuted ? '#00ff9d66' : '#333',
  };

  return (
    <div>
      <p style={sectionHeadingStyle}>{t('settings.audio', 'Audio')}</p>

      <VolumeRow
        label={t('settings.volume_master', 'Master Volume')}
        value={masterVolume}
        onChange={onMasterVolume}
      />
      <VolumeRow
        label={t('settings.volume_music', 'Music')}
        value={musicVolume}
        onChange={onMusicVolume}
      />
      <VolumeRow label={t('settings.volume_sfx', 'SFX')} value={sfxVolume} onChange={onSfxVolume} />

      <div style={rowStyle}>
        <span style={labelStyle}>{t('settings.mute', 'Mute All')}</span>
        <button style={muteButtonStyle} onClick={onToggleMute} aria-pressed={isMuted}>
          {isMuted ? t('settings.unmute', 'UNMUTE') : t('settings.mute_btn', 'MUTE')}
        </button>
      </div>
    </div>
  );
}
