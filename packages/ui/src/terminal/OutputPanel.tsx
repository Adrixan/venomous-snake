import React, { useEffect, useId, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { PythonOutput } from '@venomous-snake/shared-types';
import './terminal.css';

interface OutputPanelProps {
  outputs: PythonOutput[];
  onClear: () => void;
  /** Prompt of a pending `input()` call; the stdin form shows while it is set. */
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
  const inputId = useId();
  const promptId = useId();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [outputs]);

  useEffect(() => {
    if (inputPrompt !== undefined) {
      inputRef.current?.focus();
    }
  }, [inputPrompt]);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onInputSubmit?.(inputValue);
      setInputValue('');
    },
    [inputValue, onInputSubmit],
  );

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    // Stop the browser's implicit submission; all submits go through requestSubmit.
    e.preventDefault();
    // Enter that confirms an IME composition (CJK input) must not submit.
    // keyCode 229 covers Safari, which clears isComposing before this keydown.
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    e.currentTarget.form?.requestSubmit();
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const promptText = inputPrompt?.trim() ?? '';

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
        <form className="terminal-input-area" onSubmit={handleFormSubmit}>
          <label htmlFor={inputId} className="terminal-input-label">
            {t('terminal.output.input_label')}
          </label>
          {promptText !== '' && (
            <span id={promptId} className="terminal-input-prompt">
              {promptText}
            </span>
          )}
          <input
            ref={inputRef}
            id={inputId}
            className="terminal-input-field"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
            {...(promptText !== '' ? { 'aria-describedby': promptId } : {})}
          />
          <button type="submit" className="terminal-btn terminal-input-submit">
            {t('terminal.output.input_submit')}
          </button>
        </form>
      )}
    </div>
  );
}

export const OutputPanel = React.memo(OutputPanelInner);
