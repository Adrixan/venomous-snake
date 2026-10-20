/** Opening and closing narration; the texts live under `story.intro.*` and `story.victory.*`. */
export interface ScriptedLine {
  key: string;
  type: 'description' | 'cipher';
}

export const GAME_INTRO: ScriptedLine[] = [
  { key: 'story.intro.1', type: 'description' },
  { key: 'story.intro.2', type: 'description' },
  { key: 'story.intro.3', type: 'description' },
  { key: 'story.intro.4', type: 'cipher' },
  { key: 'story.intro.5', type: 'cipher' },
  { key: 'story.intro.6', type: 'cipher' },
  { key: 'story.intro.7', type: 'description' },
  { key: 'story.intro.8', type: 'description' },
];

export const GAME_VICTORY: ScriptedLine[] = [
  { key: 'story.victory.1', type: 'description' },
  { key: 'story.victory.2', type: 'description' },
  { key: 'story.victory.3', type: 'cipher' },
  { key: 'story.victory.4', type: 'cipher' },
  { key: 'story.victory.5', type: 'description' },
  { key: 'story.victory.6', type: 'cipher' },
  { key: 'story.victory.7', type: 'cipher' },
  { key: 'story.victory.8', type: 'description' },
];
