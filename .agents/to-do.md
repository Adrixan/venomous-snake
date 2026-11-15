# To-do (proposals for Peter)

## 2026-11-15 web-modernize run (both proposals done 2026-11-15 on Peter's decision, branch `feat/interactive-input`)
- Proposal: the free-mode Python terminal (`FreeModeTerminal` in `packages/ui/src/terminal/HackingTerminal.tsx`) calls `interpreter.execute` without `interactive: true`, so `input()` there raises `EOFError` and the stdin field in `OutputPanel` never appears; challenge mode runs interactive but subscribes no `onInputRequest`, so it never shows the field either. Passing `interactive: true` (and `echoPrompts: true`, as challenge mode does) in free mode would enable interactive `input()`. Behaviour change, so not applied by the modernization run.
- Proposal (minor, from guide `ime-safe-enter-submit`): the stdin field submits only through Enter; the guide wants an explicit submit button as well, and the field has only an `aria-label`, no visible `<label>`.

## 2026-11-15 D52: Pyodide upstream report (decided by Peter: agent drafts, Peter posts)
- Done: draft in `docs/upstream-pyodide-issue.md`. Needs Peter: post it via https://github.com/pyodide/pyodide/security/advisories/new (Pyodide's policy rules out public issues for vulnerabilities). Do not redraft; the item is closed for agents.
- After a Pyodide release with SQLite >= 3.50.2 and bzip2 1.0.8: bump `pyodide` in `packages/python-runtime`, bump the service worker `CACHE_VERSION`, then move the Android `web/` pin.
