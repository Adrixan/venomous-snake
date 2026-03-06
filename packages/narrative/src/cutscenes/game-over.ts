import type { Cutscene } from '../CutsceneData';

export const gameOverCutscene: Cutscene = {
  id: 'game-over',
  scenes: [
    {
      textKey: 'story:cutscene.gameover.frame1',
    },
    {
      textKey: 'story:cutscene.gameover.frame2',
      speakerNameKey: 'story:cutscene.speaker.cipher',
      portraitId: 'cipher',
      portraitSide: 'right',
    },
    {
      textKey: 'story:cutscene.gameover.frame3',
      speakerNameKey: 'story:cutscene.speaker.cipher',
      portraitId: 'cipher',
      portraitSide: 'right',
    },
  ],
};
