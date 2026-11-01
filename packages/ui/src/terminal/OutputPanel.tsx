import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { PythonOutput } from '@venomous-snake/shared-types';
import './terminal.css';

interface OutputPanelProps {
  outputs: PythonOutput[];
  onClear: () => void;
  inputPrompt?: string;
  onInputSubmit?: (value: string) => void;
}

function OutputPanelInner({
  outputs,
  onClear,
  inputPrompt,
  onInputSubmit,
}: OutputPanelProps): React.JSX.Element {
  const { t } = useTranslation('ui');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [outputs]);

  useEffect(() => {
    if (inputPrompt !== undefined) {
      inputRef.current?.focus();
    }
  }, [inputPrompt]);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onInputSubmit?.(inputValue);
        setInputValue('');
      }
    },
    [inputValue, onInputSubmit],
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  return (
    <div className="terminal-output-area">
      <div className="terminal-output-header">
        <span className="terminal-output-label">{t('terminal.output.title')}</span>
        <button
          className="terminal-btn terminal-btn-clear"
          onClick={onClear}
          aria-label={t('terminal.output.clear_aria')}
        >
          {t('terminal.output.clear')}
        </button>
      </div>
      <div
        role="log"
        aria-live="polite"
        aria-label={t('terminal.output.log_aria')}
        className="terminal-output-log"
      >
        {outputs.length === 0 ? (
          <span className="terminal-output-empty">{t('terminal.output.empty')}</span>
        ) : (
          outputs.map((item, index) => (
            <pre
              key={index}
              className={
                item.type === 'stderr' ? 'terminal-output-stderr' : 'terminal-output-stdout'
              }
            >
              {item.text}
            </pre>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      {inputPrompt !== undefined && (
        <div className="terminal-input-area">
          <span className="terminal-input-prompt">{inputPrompt}</span>
          <input
            ref={inputRef}
            className="terminal-input-field"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            aria-label={t('terminal.output.input_aria')}
          />
        </div>
      )}
    </div>
  );
}

export const OutputPanel = React.memo(OutputPanelInner);
