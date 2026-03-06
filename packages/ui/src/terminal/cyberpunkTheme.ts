import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

export const cyberpunkTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: '#0a0a0f',
      color: '#c0c0c0',
      fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
      fontSize: '14px',
      height: '100%',
    },
    '.cm-content': {
      caretColor: '#00ff9d',
    },
    '.cm-cursor': {
      borderLeftColor: '#00ff9d',
      borderLeftWidth: '2px',
    },
    '.cm-gutters': {
      backgroundColor: '#0d0d14',
      color: '#4a4a6a',
      borderRight: '1px solid #1a1a2e',
    },
    '.cm-activeLineGutter': {
      backgroundColor: '#1a1a2e',
    },
    '.cm-activeLine': {
      backgroundColor: '#1a1a2e40',
    },
    '.cm-selectionBackground': {
      backgroundColor: '#00ff9d20',
    },
    '&.cm-focused .cm-selectionBackground': {
      backgroundColor: '#00ff9d30',
    },
    '.cm-searchMatch': {
      backgroundColor: '#ffd70040',
    },
  },
  { dark: true }
);

export const cyberpunkHighlight = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.keyword, color: '#ff79c6' },
    { tag: tags.string, color: '#ffd700' },
    { tag: tags.number, color: '#bd93f9' },
    { tag: tags.bool, color: '#bd93f9' },
    { tag: tags.null, color: '#bd93f9' },
    { tag: tags.comment, color: '#4a4a6a', fontStyle: 'italic' },
    { tag: tags.function(tags.variableName), color: '#00ff9d' },
    { tag: tags.className, color: '#00b4d8' },
    { tag: tags.definition(tags.variableName), color: '#c0c0c0' },
    { tag: tags.operator, color: '#ff79c6' },
    { tag: tags.punctuation, color: '#6272a4' },
    { tag: tags.propertyName, color: '#00b4d8' },
    { tag: tags.typeName, color: '#00b4d8' },
  ])
);
