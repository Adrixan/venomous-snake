# To-do (proposals for Peter)

## 2026-11-15 web-modernize run (both proposals done 2026-11-15 on Peter's decision, branch `feat/interactive-input`)
- Proposal: the free-mode Python terminal (`FreeModeTerminal` in `packages/ui/src/terminal/HackingTerminal.tsx`) calls `interpreter.execute` without `interactive: true`, so `input()` there raises `EOFError` and the stdin field in `OutputPanel` never appears; challenge mode runs interactive but subscribes no `onInputRequest`, so it never shows the field either. Passing `interactive: true` (and `echoPrompts: true`, as challenge mode does) in free mode would enable interactive `input()`. Behaviour change, so not applied by the modernization run.
- Proposal (minor, from guide `ime-safe-enter-submit`): the stdin field submits only through Enter; the guide wants an explicit submit button as well, and the field has only an `aria-label`, no visible `<label>`.
