import type { DialogTree, DialogNode, DialogChoice, NarrativeState, NarrativeFlag } from './types';

export type DialogEventHandler = (event: DialogEvent) => void;

export type DialogEvent =
  | { type: 'node_display'; node: DialogNode }
  | { type: 'choices_available'; choices: DialogChoice[] }
  | { type: 'dialog_complete'; dialogId: string }
  | { type: 'flag_set'; flagId: string; value: NarrativeFlag };

export class DialogEngine {
  private state: NarrativeState;
  private dialogs: Map<string, DialogTree> = new Map();
  private handlers: Set<DialogEventHandler> = new Set();

  constructor(initialState?: NarrativeState) {
    this.state = initialState ?? {
      flags: {},
      completedDialogs: [],
      playerName: 'Agent',
      playerGender: 'nonbinary',
    };
  }

  registerDialog(dialog: DialogTree): void {
    this.dialogs.set(dialog.id, dialog);
  }

  startDialog(dialogId: string): void {
    const dialog = this.dialogs.get(dialogId);
    if (!dialog) throw new Error(`Dialog not found: ${dialogId}`);
    this.state.currentDialog = dialogId;
    this.state.currentNode = dialog.startNodeId;
    const node = this.getCurrentNode();
    if (!node) throw new Error(`Start node not found: ${dialog.startNodeId}`);
    if (node.setsFlag) {
      this.setFlag(node.setsFlag, true);
    }
    this.emitEvent({ type: 'node_display', node });
    if (node.choices) {
      const available = this.getAvailableChoices(node.choices);
      this.emitEvent({ type: 'choices_available', choices: available });
    }
  }

  selectChoice(choiceIndex: number): void {
    const node = this.getCurrentNode();
    if (!node?.choices) throw new Error('No choices available');
    const available = this.getAvailableChoices(node.choices);
    const choice = available[choiceIndex];
    if (!choice) throw new Error(`Invalid choice index: ${choiceIndex}`);
    if (choice.setsFlag) {
      this.setFlag(choice.setsFlag, true);
    }
    this.state.currentNode = choice.nextNodeId;
    this.advance();
  }

  advance(): void {
    const node = this.getCurrentNode();
    if (!node) {
      this.completeDialog();
      return;
    }
    if (node.setsFlag) {
      this.setFlag(node.setsFlag, true);
    }
    this.emitEvent({ type: 'node_display', node });
    if (node.choices) {
      const available = this.getAvailableChoices(node.choices);
      this.emitEvent({ type: 'choices_available', choices: available });
    }
    // Terminal nodes (no choices, no nextNodeId) are displayed and wait for
    // the player to explicitly advance via advanceToNext(), which handles completion.
  }

  /**
   * Advance from the current node to its `nextNodeId`.
   * If the current node has no `nextNodeId` (and no choices), the dialog completes.
   * Call this when the player clicks "continue" on a non-choice node.
   */
  advanceToNext(): void {
    const node = this.getCurrentNode();
    if (!node) {
      this.completeDialog();
      return;
    }
    if (node.nextNodeId) {
      this.state.currentNode = node.nextNodeId;
      this.advance();
    } else if (!node.choices || node.choices.length === 0) {
      this.completeDialog();
    }
    // If the node has choices, the caller must use selectChoice() instead.
  }

  setPlayerIdentity(name: string, gender: 'male' | 'female' | 'nonbinary'): void {
    this.state.playerName = name;
    this.state.playerGender = gender;
  }

  getState(): NarrativeState {
    return { ...this.state };
  }

  getFlag(flagId: string): NarrativeFlag | undefined {
    return this.state.flags[flagId];
  }

  setFlag(flagId: string, value: boolean | string | number): void {
    const flag: NarrativeFlag = {
      id: flagId,
      value,
      setAt: new Date().toISOString(),
    };
    this.state.flags[flagId] = flag;
    this.emitEvent({ type: 'flag_set', flagId, value: flag });
  }

  checkCondition(condition: string): boolean {
    const flag = this.state.flags[condition];
    if (!flag) return false;
    return Boolean(flag.value);
  }

  onEvent(handler: DialogEventHandler): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  private getCurrentNode(): DialogNode | null {
    if (!this.state.currentDialog || !this.state.currentNode) return null;
    const dialog = this.dialogs.get(this.state.currentDialog);
    if (!dialog) return null;
    return dialog.nodes[this.state.currentNode] ?? null;
  }

  private emitEvent(event: DialogEvent): void {
    for (const handler of this.handlers) {
      handler(event);
    }
  }

  private getAvailableChoices(choices: DialogChoice[]): DialogChoice[] {
    return choices.filter((c) => !c.condition || this.checkCondition(c.condition));
  }

  private completeDialog(): void {
    const dialogId = this.state.currentDialog;
    if (dialogId && !this.state.completedDialogs.includes(dialogId)) {
      this.state.completedDialogs.push(dialogId);
    }
    delete this.state.currentDialog;
    delete this.state.currentNode;
    if (dialogId) {
      this.emitEvent({ type: 'dialog_complete', dialogId });
    }
  }
}
