import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

export const terminalColors = {
  background: '#0a0e14',
  foreground: '#b3b1ad',
  green: '#00ff9d',
  cyan: '#00b4d8',
  amber: '#ffb454',
  red: '#ff3333',
  purple: '#c792ea',
  comment: '#5c6773',
  selection: '#1a3a5c',
  cursor: '#00ff9d',
  lineHighlight: '#0d1117',
  gutterBackground: '#080b10',
  gutterForeground: '#3d4752',
  border: '#1a2a3a',
} as const;

export const terminalTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: terminalColors.background,
      color: terminalColors.foreground,
      fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
      fontSize: '14px',
      height: '100%',
    },
    '.cm-content': {
      caretColor: terminalColors.cursor,
      padding: '4px 0',
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: terminalColors.cursor,
      borderLeftWidth: '2px',
    },
    '.cm-gutters': {
      backgroundColor: terminalColors.gutterBackground,
      color: terminalColors.gutterForeground,
      borderRight: `1px solid ${terminalColors.border}`,
    },
    '.cm-activeLineGutter': {
      backgroundColor: terminalColors.lineHighlight,
    },
    '.cm-activeLine': {
      backgroundColor: `${terminalColors.lineHighlight}80`,
    },
    '.cm-selectionBackground': {
      backgroundColor: terminalColors.selection,
    },
    '&.cm-focused .cm-selectionBackground': {
      backgroundColor: terminalColors.selection,
    },
    '.cm-searchMatch': {
      backgroundColor: `${terminalColors.amber}40`,
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: `${terminalColors.amber}60`,
    },
    '.cm-tooltip': {
      backgroundColor: terminalColors.gutterBackground,
      border: `1px solid ${terminalColors.border}`,
      color: terminalColors.foreground,
    },
    '.cm-tooltip-autocomplete': {
      '& > ul > li[aria-selected]': {
        backgroundColor: terminalColors.selection,
      },
    },
  },
  { dark: true },
);

export const terminalHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: terminalColors.cyan },
  { tag: tags.string, color: terminalColors.green },
  { tag: tags.number, color: terminalColors.amber },
  { tag: tags.bool, color: terminalColors.amber },
  { tag: tags.null, color: terminalColors.amber },
  { tag: tags.comment, color: terminalColors.comment, fontStyle: 'italic' },
  { tag: tags.function(tags.variableName), color: terminalColors.purple },
  { tag: tags.className, color: terminalColors.cyan },
  { tag: tags.definition(tags.variableName), color: terminalColors.foreground },
  { tag: tags.operator, color: terminalColors.cyan },
  { tag: tags.punctuation, color: terminalColors.comment },
  { tag: tags.propertyName, color: terminalColors.cyan },
  { tag: tags.typeName, color: terminalColors.cyan },
  { tag: tags.self, color: terminalColors.red },
  { tag: tags.special(tags.variableName), color: terminalColors.amber },
]);

export const syntaxTheme = syntaxHighlighting(terminalHighlightStyle);
