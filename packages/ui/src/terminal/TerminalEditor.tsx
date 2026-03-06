import React, { useEffect, useRef, useCallback } from 'react';
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

interface TerminalEditorProps {
  initialCode?: string;
  readOnlyRanges?: Array<{ from: number; to: number }>;
  onRun: (code: string) => void;
  onChange?: (code: string) => void;
  disabled?: boolean;
}

function TerminalEditorInner({
  initialCode = '',
  readOnlyRanges,
  onRun,
  onChange,
  disabled = false,
}: TerminalEditorProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onRunRef = useRef(onRun);
  const onChangeRef = useRef(onChange);

  onRunRef.current = onRun;
  onChangeRef.current = onChange;

  const handleRunClick = useCallback(() => {
    const view = viewRef.current;
    if (view) {
      onRunRef.current(view.state.doc.toString());
    }
  }, []);

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
        <span style={{ fontSize: '11px', color: '#3d4752' }}>Ctrl+Enter</span>
      </div>
    </div>
  );
}

export const TerminalEditor = React.memo(TerminalEditorInner);
