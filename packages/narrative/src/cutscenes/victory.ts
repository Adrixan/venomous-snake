import type { Cutscene } from '../CutsceneData';

export const victoryCutscene: Cutscene = {
  id: 'victory',
  scenes: [
    {
      textKey: 'story:cutscene.victory.frame1',
    },
    {
      textKey: 'story:cutscene.victory.frame2',
      speakerNameKey: 'story:cutscene.speaker.snake',
      portraitId: 'snake',
      portraitSide: 'left',
    },
    {
      textKey: 'story:cutscene.victory.frame3',
      speakerNameKey: 'story:cutscene.speaker.cipher',
      portraitId: 'cipher',
      portraitSide: 'right',
    },
    {
      textKey: 'story:cutscene.victory.frame4',
      speakerNameKey: 'story:cutscene.speaker.cipher',
      portraitId: 'cipher',
      portraitSide: 'right',
    },
    {
      textKey: 'story:cutscene.victory.frame5',
      speakerNameKey: 'story:cutscene.speaker.handler',
      portraitId: 'handler',
      portraitSide: 'left',
    },
  ],
};
