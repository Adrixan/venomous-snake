import React, { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { EditorState } from '@codemirror/state';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
} from '@codemirror/view';
import { python } from '@codemirror/lang-python';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete';
import { terminalTheme, syntaxTheme } from './terminalTheme';
import './terminal.css';

export interface TerminalEditorHandle {
  insertAtCursor: (text: string) => void;
}

interface TerminalEditorProps {
  initialCode?: string;
  readOnlyRanges?: Array<{ from: number; to: number }>;
  onRun: (code: string) => void;
  onSubmit?: (code: string) => void;
  onChange?: (code: string) => void;
  disabled?: boolean;
}

function TerminalEditorInner(
  {
    initialCode = '',
    readOnlyRanges,
    onRun,
    onSubmit,
    onChange,
    disabled = false,
  }: TerminalEditorProps,
  ref: React.ForwardedRef<TerminalEditorHandle>,
): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onRunRef = useRef(onRun);
  const onSubmitRef = useRef(onSubmit);
  const onChangeRef = useRef(onChange);

  onRunRef.current = onRun;
  onSubmitRef.current = onSubmit;
  onChangeRef.current = onChange;

  const handleRunClick = useCallback(() => {
    const view = viewRef.current;
    if (view) {
      onRunRef.current(view.state.doc.toString());
    }
  }, []);

  const handleSubmitClick = useCallback(() => {
    const view = viewRef.current;
    if (view) {
      onSubmitRef.current?.(view.state.doc.toString());
    }
  }, []);

  useImperativeHandle(ref, () => ({
    insertAtCursor: (text: string) => {
      const view = viewRef.current;
      if (!view) return;
      const { from, to } = view.state.selection.main;
      view.dispatch({
        changes: { from, to, insert: text },
        selection: { anchor: from + text.length },
      });
      view.focus();
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const extensions = [
      lineNumbers(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      history(),
      closeBrackets(),
      autocompletion(),
      python(),
      terminalTheme,
      syntaxTheme,
      keymap.of([
        {
          key: 'Ctrl-Enter',
          mac: 'Cmd-Enter',
          run: (view) => {
            onRunRef.current(view.state.doc.toString());
            return true;
          },
        },
        indentWithTab,
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...historyKeymap,
        ...completionKeymap,
      ]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          onChangeRef.current?.(update.state.doc.toString());
        }
      }),
      EditorState.readOnly.of(disabled),
    ];

    if (readOnlyRanges && readOnlyRanges.length > 0) {
      const ranges = readOnlyRanges;
      extensions.push(
        EditorState.changeFilter.of((tr) => {
          let dominated = false;
          tr.changes.iterChanges((fromA, toA) => {
            for (const range of ranges) {
              if (fromA < range.to && toA > range.from) {
                dominated = true;
              }
            }
          });
          return !dominated;
        }),
      );
    }

    const state = EditorState.create({
      doc: initialCode,
      extensions,
    });

    const view = new EditorView({ state, parent: container });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="terminal-editor-wrapper">
      <div ref={containerRef} className="terminal-editor-cm" aria-label="Python code editor" />
      <div className="terminal-editor-toolbar">
        <button
          className="terminal-btn terminal-btn-run"
          onClick={handleRunClick}
          disabled={disabled}
          aria-label="Run code (Ctrl+Enter)"
        >
          Run ▶
        </button>
        {onSubmit !== undefined && (
          <button
            className="terminal-btn terminal-btn-submit"
            onClick={handleSubmitClick}
            disabled={disabled}
            aria-label="Submit solution"
          >
            Submit ✓
          </button>
        )}
        <span style={{ fontSize: '11px', color: '#3d4752' }}>Ctrl+Enter</span>
      </div>
    </div>
  );
}

export const TerminalEditor = React.memo(forwardRef(TerminalEditorInner));
