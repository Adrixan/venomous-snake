# Draft: upstream report to Pyodide (stale bzip2 1.0.6 and SQLite 3.39.0)

Status: draft for Peter to post; not posted. Prepared 2026-11-15 (D52).

## Where to post
- Pyodide's security policy (`pyodide/.github` `SECURITY.md`) asks for vulnerabilities to go through GitHub Security Advisories and says not to use public issues: https://github.com/pyodide/pyodide/security/advisories/new
- Both CVEs are public, so a public issue would leak nothing new; the policy still names the advisory form, so post there. If the maintainers then prefer a public dependency-bump issue, the text below works there unchanged.
- Checked 2026-11-15 before drafting: no existing Pyodide or Emscripten issue covers these versions or CVEs. Open PR pyodide/pyodide#6533 ("Enable sqlite3 extension", follow-up of #5173) links CPython against Pyodide's own SQLite build but keeps the 3.39.0 tarball.

## Form fields

Title: Bundled bzip2 1.0.6 (CVE-2019-12900) and SQLite 3.39.0 (CVE-2025-6965) in pyodide.asm.wasm

Type of issue: out-of-bounds write (bzip2) and memory corruption (SQLite) in C libraries statically linked into the CPython runtime.

Body:

```markdown
### Summary

`pyodide.asm.wasm` links two C libraries with known, fixed memory-safety bugs:

- **bzip2 1.0.6** (2010) through Emscripten's `-sUSE_BZIP2` port. CVE-2019-12900: `BZ2_decompress` writes out of bounds when a stream declares more selectors than `BZ_MAX_SELECTORS` (CVSS 3.1 9.8 per NVD). Fixed in bzip2 1.0.7 and 1.0.8 (2019).
- **SQLite 3.39.0** (2022-06-25) from `cpython/Makefile`. CVE-2025-6965: the number of aggregate terms can exceed the number of available columns, leading to memory corruption. Fixed in SQLite 3.50.2. Smaller items also fixed since 3.39.0, e.g. CVE-2022-35737 (fixed in 3.39.2; needs strings of billions of bytes, so hardly reachable in wasm32).

### Affected versions

- 314.0.7 (verified in the shipped binary, see below).
- 314.0.8 and `main` as of 2026-11-15: same sources in the build files.

### Location

- `cpython/Makefile` on `main`, line 30: `SQLITE3TARBALL=https://www.sqlite.org/2022/sqlite-autoconf-3390000.tar.gz` (the comment above it aims to match Emscripten's port, which is also 3.39.0).
- `cpython/Makefile` on `main`, line 289: `CPPFLAGS="-sUSE_BZIP2=1 -sUSE_ZLIB=1"`, which pulls Emscripten's bzip2 port.
- Emscripten `tools/ports/bzip2.py` (5.0.3 and `main`): `VERSION = '1.0.6'`, fetched from `emscripten-ports/bzip2`, whose only commit (2020-03-07) imports 1.0.6. Its `decompress.c` line 290 checks only `if (nSelectors < 1)`; the upper bound added in 1.0.7/1.0.8 is missing.
- Emscripten `tools/ports/sqlite3.py` (5.0.3 and `main`): `VERSION = (3, 39, 0)`.

### Reproduce

1. In any Pyodide 314.0.7 or 314.0.8 console: `import sqlite3; sqlite3.sqlite_version` returns `'3.39.0'`.
2. `strings -n 6 pyodide.asm.wasm | grep -E '^3\.39\.0$|1\.0\.6, 6-Sept-2010'` prints the SQLite version and bzip2's `BZ2_bzlibVersion` string.

No exploit attached; both CVEs are public with upstream fixes.

### Impact

Memory corruption stays inside the WebAssembly linear memory, so it does not escape the browser sandbox. Inside the instance it can corrupt interpreter state and data. It is reachable wherever a Pyodide application decompresses untrusted bzip2 data (`bz2`, `tarfile`, `zipfile`, `shutil.unpack_archive`) or runs untrusted SQL, which notebooks, teaching tools and file-processing apps built on Pyodide routinely do with user-supplied files. Downstream SBOM and CVE scanners flag both components.

### Suggested fix

- SQLite: bump `SQLITE3TARBALL` to a current release (3.50.2 or newer; 3.54.1 is the latest tag). With #6533 linking CPython against Pyodide's own SQLite build, matching Emscripten's port is no longer needed.
- bzip2: build bzip2 1.0.8 in `cpython/Makefile` like libffi, xz, zstd and SQLite instead of using `-sUSE_BZIP2`, or ask Emscripten to update its port to 1.0.8. CPython's Windows build moved to 1.0.8 for the same CVE (PSF-2019-4, bpo-44549).

Happy to test a build.
```

## Optional follow-up
- The bzip2 root cause sits in Emscripten's port (`emscripten-ports/bzip2`, `tools/ports/bzip2.py`) and its SQLite port is also 3.39.0. A separate report to Emscripten would fix it for all Emscripten users; not drafted, Peter's call.
