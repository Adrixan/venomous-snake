import { useState, useCallback, useRef } from 'react';
import { CipherAI } from '@venomous-snake/narrative';
import type { CipherContext, CipherMood } from '@venomous-snake/narrative';

interface UseCipherReturn {
  cipher: CipherAI;
  showDialog: (context: CipherContext, data?: Record<string, string>) => void;
  showHint: (hint: string) => void;
  showErrorExplanation: (errorType: string, errorMessage: string) => void;
  dismissDialog: () => void;
  currentMessage: string | null;
  currentMood: CipherMood;
  isVisible: boolean;
}

/**
 * Queue entry for pending CIPHER messages.
 */
interface QueueEntry {
  message: string;
  mood: CipherMood;
}

export function useCipher(): UseCipherReturn {
  // Stable CipherAI instance — never recreated
  const cipherRef = useRef<CipherAI>(new CipherAI());
  const cipher = cipherRef.current;

  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [currentMood, setCurrentMood] = useState<CipherMood>('neutral');
  const [isVisible, setIsVisible] = useState(false);
  const queueRef = useRef<QueueEntry[]>([]);

  const displayEntry = useCallback((entry: QueueEntry) => {
    setCurrentMessage(entry.message);
    setCurrentMood(entry.mood);
    setIsVisible(true);
  }, []);

  const enqueue = useCallback(
    (message: string, mood: CipherMood) => {
      if (!isVisible) {
        displayEntry({ message, mood });
      } else {
        queueRef.current.push({ message, mood });
      }
    },
    [isVisible, displayEntry],
  );

  const dismissDialog = useCallback(() => {
    const next = queueRef.current.shift();
    if (next !== undefined) {
      displayEntry(next);
    } else {
      setIsVisible(false);
      setCurrentMessage(null);
    }
  }, [displayEntry]);

  const showDialog = useCallback(
    (context: CipherContext, data?: Record<string, string>) => {
      const message = cipher.getLine(context, data);
      const mood = cipher.getMood();
      enqueue(message, mood);
    },
    [cipher, enqueue],
  );

  const showHint = useCallback(
    (hint: string) => {
      const message = cipher.wrapHint(hint);
      const mood = cipher.getMood();
      enqueue(message, mood);
    },
    [cipher, enqueue],
  );

  const showErrorExplanation = useCallback(
    (errorType: string, errorMessage: string) => {
      const message = cipher.explainError(errorType, errorMessage);
      const mood = cipher.getMood();
      enqueue(message, mood);
    },
    [cipher, enqueue],
  );

  return {
    cipher,
    showDialog,
    showHint,
    showErrorExplanation,
    dismissDialog,
    currentMessage,
    currentMood,
    isVisible,
  };
}
