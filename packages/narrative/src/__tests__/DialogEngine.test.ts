import { describe, it, expect, vi } from 'vitest';
import { DialogEngine } from '../DialogEngine';
import type { DialogEvent } from '../DialogEngine';
import type { DialogTree } from '../types';

// A two-node dialog where n1 has a single "continue" choice leading to n2,
// and n2 has no nextNodeId (terminal node → dialog completes).
const linearDialog: DialogTree = {
  id: 'linear',
  startNodeId: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      speaker: 'npc',
      textKey: 'node1',
      choices: [{ textKey: 'next', nextNodeId: 'n2' }],
    },
    n2: { id: 'n2', speaker: 'npc', textKey: 'node2' },
  },
};

// A branching dialog with two choices at the start.
const choiceDialog: DialogTree = {
  id: 'choices',
  startNodeId: 'c1',
  nodes: {
    c1: {
      id: 'c1',
      speaker: 'npc',
      textKey: 'choose',
      choices: [
        { textKey: 'opt1', nextNodeId: 'r1' },
        { textKey: 'opt2', nextNodeId: 'r2' },
      ],
    },
    r1: { id: 'r1', speaker: 'npc', textKey: 'result1' },
    r2: { id: 'r2', speaker: 'npc', textKey: 'result2' },
  },
};

// A dialog where the first choice requires a flag to be set.
const conditionalDialog: DialogTree = {
  id: 'conditional',
  startNodeId: 'co1',
  nodes: {
    co1: {
      id: 'co1',
      speaker: 'npc',
      textKey: 'choose',
      choices: [
        { textKey: 'opt1', nextNodeId: 'r1', condition: 'has_flag' },
        { textKey: 'opt2', nextNodeId: 'r2' },
      ],
    },
    r1: { id: 'r1', speaker: 'npc', textKey: 'result1' },
    r2: { id: 'r2', speaker: 'npc', textKey: 'result2' },
  },
};

describe('DialogEngine', () => {
  it('emits node_display for the start node when a dialog is started', () => {
    const engine = new DialogEngine();
    engine.registerDialog(linearDialog);

    const handler = vi.fn();
    engine.onEvent(handler);
    engine.startDialog('linear');

    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'node_display',
        node: expect.objectContaining({ id: 'n1' }),
      }),
    );
  });

  it('advances through linear nodes via selectChoice', () => {
    const engine = new DialogEngine();
    engine.registerDialog(linearDialog);

    const events: DialogEvent[] = [];
    engine.onEvent((e) => events.push(e));

    engine.startDialog('linear');
    engine.selectChoice(0); // n1's only choice → advances to n2

    const displayedIds = events
      .filter((e): e is Extract<DialogEvent, { type: 'node_display' }> => e.type === 'node_display')
      .map((e) => e.node.id);

    expect(displayedIds).toContain('n1');
    expect(displayedIds).toContain('n2');
  });

  it('navigates to the correct branch when a choice is selected', () => {
    const engine = new DialogEngine();
    engine.registerDialog(choiceDialog);

    const events: DialogEvent[] = [];
    engine.onEvent((e) => events.push(e));

    engine.startDialog('choices');
    engine.selectChoice(1); // opt2 → r2

    const nodeDisplayEvents = events.filter(
      (e): e is Extract<DialogEvent, { type: 'node_display' }> => e.type === 'node_display',
    );
    const lastNode = nodeDisplayEvents[nodeDisplayEvents.length - 1];
    expect(lastNode?.node.id).toBe('r2');
  });

  it('hides conditional choices when the required flag is not set', () => {
    const engine = new DialogEngine();
    engine.registerDialog(conditionalDialog);

    const events: DialogEvent[] = [];
    engine.onEvent((e) => events.push(e));

    engine.startDialog('conditional');

    const choicesEvent = events.find(
      (e): e is Extract<DialogEvent, { type: 'choices_available' }> =>
        e.type === 'choices_available',
    );
    // 'has_flag' is not set → opt1 is hidden; only opt2 visible
    expect(choicesEvent?.choices).toHaveLength(1);
    expect(choicesEvent?.choices[0]?.textKey).toBe('opt2');
  });

  it('shows conditional choices when the required flag is set', () => {
    const engine = new DialogEngine();
    engine.registerDialog(conditionalDialog);
    engine.setFlag('has_flag', true);

    const events: DialogEvent[] = [];
    engine.onEvent((e) => events.push(e));

    engine.startDialog('conditional');

    const choicesEvent = events.find(
      (e): e is Extract<DialogEvent, { type: 'choices_available' }> =>
        e.type === 'choices_available',
    );
    expect(choicesEvent?.choices).toHaveLength(2);
  });

  it('setFlag and checkCondition work together', () => {
    const engine = new DialogEngine();

    engine.setFlag('my_flag', true);
    expect(engine.checkCondition('my_flag')).toBe(true);

    engine.setFlag('falsy_flag', false);
    expect(engine.checkCondition('falsy_flag')).toBe(false);

    expect(engine.checkCondition('nonexistent_flag')).toBe(false);
  });

  it('emits dialog_complete when the dialog reaches a terminal node', () => {
    const engine = new DialogEngine();
    engine.registerDialog(linearDialog);

    const completions: Extract<DialogEvent, { type: 'dialog_complete' }>[] = [];
    engine.onEvent((e) => {
      if (e.type === 'dialog_complete') completions.push(e);
    });

    engine.startDialog('linear');
    engine.selectChoice(0); // n2 has no nextNodeId → dialog completes

    expect(completions).toHaveLength(1);
    expect(completions[0]?.dialogId).toBe('linear');
  });

  it('records completed dialogs in state', () => {
    const engine = new DialogEngine();
    engine.registerDialog(linearDialog);

    engine.startDialog('linear');
    engine.selectChoice(0);

    expect(engine.getState().completedDialogs).toContain('linear');
  });

  it('throws when starting an unregistered dialog', () => {
    const engine = new DialogEngine();
    expect(() => engine.startDialog('nonexistent')).toThrow();
  });
});
