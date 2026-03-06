import type { Cutscene } from '../CutsceneData';

export const introCutscene: Cutscene = {
  id: 'intro',
  scenes: [
    {
      textKey: 'story:cutscene.intro.frame1',
    },
    {
      textKey: 'story:cutscene.intro.frame2',
      speakerNameKey: 'story:cutscene.speaker.handler',
      portraitId: 'handler',
      portraitSide: 'left',
    },
    {
      textKey: 'story:cutscene.intro.frame3',
      speakerNameKey: 'story:cutscene.speaker.handler',
      portraitId: 'handler',
      portraitSide: 'left',
    },
    {
      textKey: 'story:cutscene.intro.frame4',
      speakerNameKey: 'story:cutscene.speaker.handler',
      portraitId: 'handler',
      portraitSide: 'left',
    },
    {
      textKey: 'story:cutscene.intro.frame5',
      speakerNameKey: 'story:cutscene.speaker.cipher',
      portraitId: 'cipher',
      portraitSide: 'right',
    },
    {
      textKey: 'story:cutscene.intro.frame6',
      speakerNameKey: 'story:cutscene.speaker.cipher',
      portraitId: 'cipher',
      portraitSide: 'right',
    },
    {
      textKey: 'story:cutscene.intro.frame7',
      speakerNameKey: 'story:cutscene.speaker.cipher',
      portraitId: 'cipher',
      portraitSide: 'right',
    },
  ],
};
