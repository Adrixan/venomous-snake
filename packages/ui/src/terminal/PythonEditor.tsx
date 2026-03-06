import React, { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
} from '@codemirror/view';
import { python } from '@codemirror/lang-python';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete';
import { cyberpunkTheme, cyberpunkHighlight } from './cyberpunkTheme';

interface PythonEditorProps {
  initialCode?: string;
  onChange?: (code: string) => void;
  onRun?: (code: string) => void;
  readOnly?: boolean;
}

export function PythonEditor({
  initialCode = '',
  onChange,
  onRun,
  readOnly = false,
}: PythonEditorProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRun);

  // Keep refs up-to-date without re-creating the editor
  onChangeRef.current = onChange;
  onRunRef.current = onRun;

  useEffect(() => {
    if (!containerRef.current) return;

    const runKeymap = keymap.of([
      {
        key: 'Ctrl-Enter',
        mac: 'Cmd-Enter',
        run: (view) => {
          onRunRef.current?.(view.state.doc.toString());
          return true;
        },
      },
    ]);

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChangeRef.current?.(update.state.doc.toString());
      }
    });

    const state = EditorState.create({
      doc: initialCode,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        closeBrackets(),
        autocompletion(),
        python(),
        cyberpunkTheme,
        cyberpunkHighlight,
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...historyKeymap,
          ...completionKeymap,
        ]),
        runKeymap,
        updateListener,
        EditorState.readOnly.of(readOnly),
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — editor initialized once

  return (
    <div
      ref={containerRef}
      style={{ height: '100%', overflow: 'auto' }}
      aria-label="Python code editor"
    />
  );
}
