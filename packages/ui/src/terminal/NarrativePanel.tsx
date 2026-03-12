import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { NarrativeEntry } from '@venomous-snake/shared-types';

export interface NarrativePanelProps {
  entries: NarrativeEntry[];
}

const TYPEWRITER_MS = 30;

function renderEntryContent(entry: NarrativeEntry): React.ReactNode {
  switch (entry.type) {
    case 'dialog':
    case 'cipher': {
      const speaker = entry.speaker ?? (entry.type === 'cipher' ? 'CIPHER' : '???');
      return (
        <>
          <span className="story-dialog-speaker">{speaker}:</span> &ldquo;{entry.text}&rdquo;
        </>
      );
    }
    case 'action':
      return <>&gt; {entry.text}</>;
    case 'system':
      return <>[SYSTEM] {entry.text}</>;
    case 'error':
      return <>[ERROR] {entry.text}</>;
    case 'description':
    default:
      return entry.text;
  }
}

/** Typewriter text reveal for the latest entry */
function TypewriterText({
  entry,
  onComplete,
}: {
  entry: NarrativeEntry;
  onComplete: () => void;
}): React.JSX.Element {
  const fullContent = entryToPlainText(entry);
  const [charIndex, setCharIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const done = charIndex >= fullContent.length;

  useEffect(() => {
    if (done) {
      onComplete();
      return;
    }
    timerRef.current = setTimeout(() => {
      setCharIndex((prev) => prev + 1);
    }, TYPEWRITER_MS);
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [charIndex, done, onComplete]);

  const handleClick = useCallback(() => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    setCharIndex(fullContent.length);
  }, [fullContent.length]);

  // Render the entry content up to charIndex
  const visibleText = fullContent.slice(0, charIndex);

  return (
    <span onClick={handleClick} style={{ cursor: done ? 'default' : 'pointer' }}>
      {renderPartialEntry(entry, visibleText)}
      {!done && <span className="story-typewriter-cursor" aria-hidden="true" />}
    </span>
  );
}

function entryToPlainText(entry: NarrativeEntry): string {
  const speaker = entry.speaker ?? (entry.type === 'cipher' ? 'CIPHER' : '???');
  switch (entry.type) {
    case 'dialog':
    case 'cipher':
      return `${speaker}: \u201C${entry.text}\u201D`;
    case 'action':
      return `> ${entry.text}`;
    case 'system':
      return `[SYSTEM] ${entry.text}`;
    case 'error':
      return `[ERROR] ${entry.text}`;
    case 'description':
    default:
      return entry.text;
  }
}

function renderPartialEntry(entry: NarrativeEntry, visibleText: string): React.ReactNode {
  const speaker = entry.speaker ?? (entry.type === 'cipher' ? 'CIPHER' : '???');
  const prefix = `${speaker}: `;
  switch (entry.type) {
    case 'dialog':
    case 'cipher': {
      if (visibleText.length <= prefix.length) {
        return <span className="story-dialog-speaker">{visibleText}</span>;
      }
      return (
        <>
          <span className="story-dialog-speaker">{prefix}</span>
          {visibleText.slice(prefix.length)}
        </>
      );
    }
    default:
      return visibleText;
  }
}

function NarrativePanelInner({ entries }: NarrativePanelProps): React.JSX.Element {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [typewriterDone, setTypewriterDone] = useState(true);
  const lastEntryId = useRef<string | undefined>(undefined);

  const latestEntry = entries.length > 0 ? entries[entries.length - 1] : undefined;

  // Detect new entry and start typewriter
  useEffect(() => {
    if (latestEntry !== undefined && latestEntry.id !== lastEntryId.current) {
      lastEntryId.current = latestEntry.id;
      setTypewriterDone(false);
    }
  }, [latestEntry]);

  // Auto-scroll to bottom
  useEffect(() => {
    const el = scrollRef.current;
    if (el !== null) {
      el.scrollTop = el.scrollHeight;
    }
  }, [entries.length, typewriterDone]);

  const handleTypewriterComplete = useCallback(() => {
    setTypewriterDone(true);
  }, []);

  const olderEntries = !typewriterDone && entries.length > 0 ? entries.slice(0, -1) : entries;

  return (
    <div className="story-narrative-panel" ref={scrollRef} role="log" aria-live="polite">
      {olderEntries.map((entry) => (
        <div
          key={entry.id}
          className={`story-narrative-entry story-narrative-entry--${entry.type}`}
        >
          {renderEntryContent(entry)}
        </div>
      ))}

      {!typewriterDone && latestEntry !== undefined && (
        <div
          key={latestEntry.id}
          className={`story-narrative-entry story-narrative-entry--${latestEntry.type}`}
        >
          <TypewriterText entry={latestEntry} onComplete={handleTypewriterComplete} />
        </div>
      )}
    </div>
  );
}

export const NarrativePanel = React.memo(NarrativePanelInner);
