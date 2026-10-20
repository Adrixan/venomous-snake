import { createContext } from 'react';
import type { ChallengeResult } from '@venomous-snake/challenge-engine';

/** Host-owned grading and hints keep the terminal independent of application state. */
export interface ChallengeSession {
  evaluate: (code: string) => Promise<ChallengeResult & { xpEarned: number }>;
  requestHint: () => string | null;
}

export const ChallengeSessionContext = createContext<ChallengeSession | null>(null);
