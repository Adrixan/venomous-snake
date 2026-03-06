import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export interface NewGameFlowProps {
  onStart: (name: string, gender: 'male' | 'female' | 'nonbinary') => void;
  onBack: () => void;
}

type Gender = 'male' | 'female' | 'nonbinary';

const FONT_FAMILY = "'JetBrains Mono', 'Fira Code', monospace";
const CODENAME_REGEX = /^[a-zA-Z0-9\s]{2,20}$/;

const genderKeys: { value: Gender; labelKey: string }[] = [
  { value: 'male', labelKey: 'new_game.gender_male' },
  { value: 'female', labelKey: 'new_game.gender_female' },
  { value: 'nonbinary', labelKey: 'new_game.gender_nonbinary' },
];

export function NewGameFlow({ onStart, onBack }: NewGameFlowProps): React.JSX.Element {
  const { t } = useTranslation('ui');
  const [step, setStep] = useState(1);
  const [selectedGender, setSelectedGender] = useState<Gender>('nonbinary');
  const [codename, setCodename] = useState('');
  const [codenameError, setCodenameError] = useState(false);

  const handleNext = useCallback(() => {
    if (step === 2) {
      if (!CODENAME_REGEX.test(codename.trim())) {
        setCodenameError(true);
        return;
      }
      setCodenameError(false);
    }
    if (step === 3) {
      onStart(codename.trim(), selectedGender);
      return;
    }
    setStep((s) => s + 1);
  }, [step, codename, selectedGender, onStart]);

  const handleBack = useCallback(() => {
    if (step === 1) {
      onBack();
    } else {
      setStep((s) => s - 1);
    }
  }, [step, onBack]);

  const handleCodenameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCodename(e.target.value);
    setCodenameError(false);
  }, []);

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

  const stepIndicatorStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '24px',
  };

  const stepLabels = [
    t('new_game.step_gender'),
    t('new_game.step_codename'),
    t('new_game.step_intro'),
  ];

  const buttonStyle = (active: boolean): React.CSSProperties => ({
    minHeight: '44px',
    minWidth: '44px',
    padding: '10px 20px',
    background: active ? '#00ff9d22' : 'transparent',
    border: active ? '1px solid #00ff9d' : '1px solid #333',
    color: active ? '#00ff9d' : '#e0e0e0',
    fontFamily: FONT_FAMILY,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  });

  const navStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '24px',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Step indicator */}
        <div style={stepIndicatorStyle}>
          {stepLabels.map((label, i) => {
            const dotStyle: React.CSSProperties = {
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: i + 1 <= step ? '#00ff9d' : '#333',
            };
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={dotStyle} />
                <span
                  style={{
                    fontSize: '11px',
                    color: i + 1 === step ? '#00ff9d' : '#666',
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step 1: Gender */}
        {step === 1 && (
          <div>
            <h2 style={{ color: '#00ff9d', fontSize: '18px', margin: '0 0 16px 0' }}>
              {t('new_game.step_gender')}
            </h2>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {genderKeys.map((g) => (
                <button
                  key={g.value}
                  style={buttonStyle(selectedGender === g.value)}
                  onClick={() => setSelectedGender(g.value)}
                >
                  {t(g.labelKey)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Codename */}
        {step === 2 && (
          <div>
            <h2 style={{ color: '#00ff9d', fontSize: '18px', margin: '0 0 16px 0' }}>
              {t('new_game.step_codename')}
            </h2>
            <label
              style={{ color: '#e0e0e0', fontSize: '13px', display: 'block', marginBottom: '8px' }}
            >
              {t('new_game.codename_label')}
            </label>
            <input
              type="text"
              value={codename}
              onChange={handleCodenameChange}
              placeholder={t('new_game.codename_placeholder')}
              maxLength={20}
              style={{
                width: '100%',
                minHeight: '44px',
                padding: '10px 12px',
                background: '#0a0a0f',
                border: codenameError ? '1px solid #ff3366' : '1px solid #333',
                color: '#e0e0e0',
                fontFamily: FONT_FAMILY,
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <p style={{ color: '#666', fontSize: '11px', margin: '6px 0 0 0' }}>
              {t('new_game.codename_hint')}
            </p>
            {codenameError && (
              <p style={{ color: '#ff3366', fontSize: '12px', margin: '6px 0 0 0' }}>
                {t('new_game.codename_error')}
              </p>
            )}
          </div>
        )}

        {/* Step 3: Intro */}
        {step === 3 && (
          <div>
            <h2 style={{ color: '#00ff9d', fontSize: '18px', margin: '0 0 16px 0' }}>
              {t('new_game.step_intro')}
            </h2>
            <div
              style={{
                background: '#0a0a0f',
                border: '1px solid #00b4d8',
                padding: '16px',
                color: '#00b4d8',
                fontSize: '14px',
                lineHeight: '1.6',
              }}
            >
              {t('new_game.cipher_intro', { name: codename.trim() })}
            </div>
          </div>
        )}

        {/* Nav buttons */}
        <div style={navStyle}>
          <button style={buttonStyle(false)} onClick={handleBack}>
            {t('new_game.back')}
          </button>
          <button style={buttonStyle(true)} onClick={handleNext}>
            {step === 3 ? t('new_game.start_game') : t('new_game.next')}
          </button>
        </div>
      </div>
    </div>
  );
}
