import type { Cutscene } from '../CutsceneData';

export const bossEncounterCutscene: Cutscene = {
  id: 'boss-encounter',
  scenes: [
    {
      textKey: 'story:cutscene.boss.frame1',
      speakerNameKey: 'story:cutscene.speaker.snake',
      portraitId: 'snake',
      portraitSide: 'left',
    },
    {
      textKey: 'story:cutscene.boss.frame2',
      speakerNameKey: 'story:cutscene.speaker.snake',
      portraitId: 'snake',
      portraitSide: 'left',
    },
    {
      textKey: 'story:cutscene.boss.frame3',
      speakerNameKey: 'story:cutscene.speaker.cipher',
      portraitId: 'cipher',
      portraitSide: 'right',
    },
    {
      textKey: 'story:cutscene.boss.frame4',
      speakerNameKey: 'story:cutscene.speaker.snake',
      portraitId: 'snake',
      portraitSide: 'left',
    },
    {
      textKey: 'story:cutscene.boss.frame5',
      speakerNameKey: 'story:cutscene.speaker.cipher',
      portraitId: 'cipher',
      portraitSide: 'right',
    },
    {
      textKey: 'story:cutscene.boss.frame6',
      speakerNameKey: 'story:cutscene.speaker.cipher',
      portraitId: 'cipher',
      portraitSide: 'right',
    },
  ],
};
