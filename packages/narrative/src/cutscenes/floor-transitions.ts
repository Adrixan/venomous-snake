import type { Cutscene } from '../CutsceneData';

const elevatorScenes = (floor: number): Cutscene['scenes'] => {
  const cipherKey = `story:cutscene.floor.f${floor}.cipher`;
  const noteKey = `story:cutscene.floor.f${floor}.note`;
  const hintKey = `story:cutscene.floor.f${floor}.hint`;
  return [
    {
      textKey: `story:cutscene.floor.f${floor}.arrive`,
    },
    {
      textKey: cipherKey,
      speakerNameKey: 'story:cutscene.speaker.cipher',
      portraitId: 'cipher',
      portraitSide: 'right',
    },
    {
      textKey: noteKey,
      speakerNameKey: 'story:cutscene.speaker.cipher',
      portraitId: 'cipher',
      portraitSide: 'right',
    },
    {
      textKey: hintKey,
      speakerNameKey: 'story:cutscene.speaker.cipher',
      portraitId: 'cipher',
      portraitSide: 'right',
    },
  ];
};

export const floorTransitionCutscenes: Record<number, Cutscene> = {};

for (let floor = 1; floor <= 12; floor++) {
  floorTransitionCutscenes[floor] = {
    id: `floor-transition-${floor}`,
    triggeredBy: `floor_${floor}_entered`,
    scenes: elevatorScenes(floor),
  };
}

export function getFloorTransitionCutscene(floor: number): Cutscene | undefined {
  return floorTransitionCutscenes[floor];
}
