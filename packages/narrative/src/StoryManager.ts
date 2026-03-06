import { DialogEngine } from './DialogEngine';
import type { NarrativeState } from './types';

interface Pronouns {
  subject: string;
  object: string;
  possessive: string;
  reflexive: string;
}

export class StoryManager {
  constructor(private dialogEngine: DialogEngine) {}

  setPlayerIdentity(name: string, gender: 'male' | 'female' | 'nonbinary'): void {
    this.dialogEngine.setPlayerIdentity(name, gender);
  }

  getPronouns(): Pronouns {
    const state = this.dialogEngine.getState();
    const gender = state.playerGender;
    if (gender === 'male') {
      return {
        subject: 'he',
        object: 'him',
        possessive: 'his',
        reflexive: 'himself',
      };
    }
    if (gender === 'female') {
      return {
        subject: 'she',
        object: 'her',
        possessive: 'her',
        reflexive: 'herself',
      };
    }
    return {
      subject: 'they',
      object: 'them',
      possessive: 'their',
      reflexive: 'themselves',
    };
  }

  getAISidekickMessage(category: 'encouragement' | 'idle' | 'greeting'): string {
    if (category === 'greeting') {
      return "Hey there, operative. I'm CIPHER — your AI assistant. I'll be your guide through this digital labyrinth. Ready to hack some Python?";
    }
    const messages =
      category === 'encouragement'
        ? [
            "Keep at it! Every master hacker started with 'Hello, World!'",
            "Bugs are just features you haven't understood yet.",
            "The terminal doesn't judge. Well, I do. But I'm nice about it.",
            "Remember: even the best coders Google things. You're doing great.",
            'Error messages are your friends. Cranky friends, but friends.',
          ]
        : [
            "Still thinking? Take your time. The firewall isn't going anywhere.",
            "Need a hint? Just ask. I promise I won't tell anyone.",
            'Fun fact: Python is named after Monty Python, not the snake. Mind. Blown.',
          ];
    const index = Math.floor(Math.random() * messages.length);
    return messages[index] ?? messages[0] ?? '';
  }

  isChapterAccessible(chapter: number): boolean {
    if (chapter <= 1) return true;
    const prevChapterId = `ch${String(chapter - 1).padStart(2, '0')}_complete`;
    return this.dialogEngine.checkCondition(prevChapterId);
  }

  getStoryState(): NarrativeState {
    return this.dialogEngine.getState();
  }

  toJSON(): NarrativeState {
    return this.dialogEngine.getState();
  }
}
