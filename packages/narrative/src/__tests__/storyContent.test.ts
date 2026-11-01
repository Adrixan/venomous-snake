import { describe, it, expect } from 'vitest';
import { i18n } from '@venomous-snake/i18n';
import { FLOORS } from '@venomous-snake/challenges';
import {
  bossEncounterCutscene,
  getFloorTransitionCutscene,
  introCutscene,
  victoryCutscene,
} from '../index';
import { TUTORIAL_STEPS } from '../tutorial/tutorial-steps';

const floorCutscenes = FLOORS.slice(1).map((floor) => getFloorTransitionCutscene(floor.number));

describe('story content', () => {
  it('has a transition for every floor above the lobby', () => {
    expect(floorCutscenes.every((cutscene) => cutscene !== undefined)).toBe(true);
  });

  it.each(['en', 'de'])('translates every cutscene and tutorial line in %s', (lng) => {
    const scenes = [
      introCutscene,
      bossEncounterCutscene,
      victoryCutscene,
      ...floorCutscenes.flatMap((cutscene) => (cutscene === undefined ? [] : [cutscene])),
    ].flatMap((cutscene) => cutscene.scenes);
    const keys = [
      ...scenes.flatMap((s) => [s.textKey, ...(s.speakerNameKey ? [s.speakerNameKey] : [])]),
      ...TUTORIAL_STEPS.map((step) => step.cipherDialog),
    ];
    for (const key of keys) expect(i18n.exists(key, { lng }), key).toBe(true);
  });
});
