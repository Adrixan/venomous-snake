import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { NarrativeEntry } from '@venomous-snake/shared-types';
import { translateText } from '../i18n/translateText';
import { useReducedMotion } from '../accessibility/ReducedMotion';

export interface NarrativePanelProps {
  entries: NarrativeEntry[];
}

const TYPEWRITER_MS = 30;

function renderEntryContent(entry: NarrativeEntry, text: string): React.ReactNode {
  switch (entry.type) {
    case 'dialog':
    case 'cipher': {
      const speaker = entry.speaker ?? (entry.type === 'cipher' ? 'CIPHER' : '???');
      return (
        <>
          <span className="story-dialog-speaker">{speaker}:</span> &ldquo;{text}&rdquo;
        </>
      );
    }
    case 'action':
      return <>&gt; {text}</>;
    case 'system':
      return <>[SYSTEM] {text}</>;
    case 'error':
      return <>[ERROR] {text}</>;
    default:
      return text;
  }
}

function entryToPlainText(entry: NarrativeEntry, text: string): string {
  const speaker = entry.speaker ?? (entry.type === 'cipher' ? 'CIPHER' : '???');
  switch (entry.type) {
    case 'dialog':
    case 'cipher':
      return `${speaker}: \u201C${text}\u201D`;
    case 'action':
      return `> ${text}`;
    case 'system':
      return `[SYSTEM] ${text}`;
    case 'error':
      return `[ERROR] ${text}`;
    default:
      return text;
  }
}

function renderPartialEntry(entry: NarrativeEntry, visibleText: string): React.ReactNode {
  const speaker = entry.speaker ?? (entry.type === 'cipher' ? 'CIPHER' : '???');
  const prefix = `${speaker}: `;
  if (entry.type !== 'dialog' && entry.type !== 'cipher') return visibleText;
  if (visibleText.length <= prefix.length)
    return <span className="story-dialog-speaker">{visibleText}</span>;
  return (
    <>
      <span className="story-dialog-speaker">{prefix}</span>
      {visibleText.slice(prefix.length)}
    </>
  );
}

function TypewriterText({
  entry,
  text,
  onComplete,
}: {
  entry: NarrativeEntry;
  text: string;
  onComplete: () => void;
}): React.JSX.Element {
  const fullContent = entryToPlainText(entry, text);
  const [charIndex, setCharIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const done = charIndex >= fullContent.length;

  useEffect(() => {
    if (done) {
      onComplete();
      return;
    }
    timerRef.current = setTimeout(() => setCharIndex((index) => index + 1), TYPEWRITER_MS);
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [charIndex, done, fullContent.length, onComplete]);

  const handleClick = useCallback(() => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    setCharIndex(fullContent.length);
  }, [fullContent.length]);

  const visibleText = fullContent.slice(0, charIndex);
  return (
    <span onClick={handleClick} style={{ cursor: done ? 'default' : 'pointer' }}>
      {renderPartialEntry(entry, visibleText)}
      {!done && <span className="story-typewriter-cursor" aria-hidden="true" />}
    </span>
  );
}

function NarrativePanelInner({ entries }: NarrativePanelProps): React.JSX.Element {
  const { t } = useTranslation('story');
  const reducedMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [typewriterDone, setTypewriterDone] = useState(true);
  const lastEntryId = useRef<string | undefined>(undefined);
  const latestEntry = entries.length > 0 ? entries[entries.length - 1] : undefined;
  const resolveText = (entry: NarrativeEntry): string =>
    entry.textKey === undefined ? entry.text : translateText(t, entry.textKey, entry.textParams);

  useEffect(() => {
    if (latestEntry !== undefined && latestEntry.id !== lastEntryId.current) {
      lastEntryId.current = latestEntry.id;
      setTypewriterDone(reducedMotion);
    }
  }, [latestEntry, reducedMotion]);

  useEffect(() => {
    const element = scrollRef.current;
    if (element !== null) element.scrollTop = element.scrollHeight;
  }, [entries.length, typewriterDone]);

  const handleTypewriterComplete = useCallback(() => setTypewriterDone(true), []);
  const olderEntries = !typewriterDone && entries.length > 0 ? entries.slice(0, -1) : entries;

  return (
    <div className="story-narrative-panel" ref={scrollRef} role="log" aria-live="polite">
      {olderEntries.map((entry) => (
        <div
          key={entry.id}
          className={`story-narrative-entry story-narrative-entry--${entry.type}`}
        >
          {renderEntryContent(entry, resolveText(entry))}
        </div>
      ))}
      {!typewriterDone && latestEntry !== undefined && (
        <div
          key={latestEntry.id}
          className={`story-narrative-entry story-narrative-entry--${latestEntry.type}`}
        >
          <TypewriterText
            entry={latestEntry}
            text={resolveText(latestEntry)}
            onComplete={handleTypewriterComplete}
          />
        </div>
      )}
    </div>
  );
}

export const NarrativePanel = React.memo(NarrativePanelInner);
