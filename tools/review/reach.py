"""Lists source files missing from the production bundle. See README.md for meta.json."""
import collections
import json
import os
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
META = REPO / '.scratch' / 'review' / 'meta.json'
ROOTS = ['packages/ui/src', 'packages/narrative/src', 'packages/engine/src', 'packages/audio/src',
         'packages/challenge-engine/src', 'packages/python-runtime/src', 'packages/save-system/src',
         'apps/game/src']


def line_count(file):
    with open(REPO / file, encoding='utf-8') as handle:
        return sum(1 for _ in handle)


if not META.exists():
    sys.exit(f'{META} is missing: run the metafile build from tools/review/README.md first')
with open(META, encoding='utf-8') as handle:
    outs = list(json.load(handle)['outputs'].values())[0]['inputs']

tot = collections.Counter()
for f, v in outs.items():
    key = 'node_modules' if 'node_modules' in f else '/'.join(f.split('/')[:2])
    tot[key] += v['bytesInOutput']
print(tot.most_common())

allsrc = []
for root in ROOTS:
    for d, _, fs in os.walk(REPO / root):
        if '__tests__' in d:
            continue
        for f in fs:
            if f.endswith(('.ts', '.tsx')):
                allsrc.append(os.path.relpath(os.path.join(d, f), REPO))

missing = sorted(f for f in allsrc if f not in outs)
zero = sorted(f for f in allsrc if f in outs and outs[f]['bytesInOutput'] == 0)
print('source files not in the bundle graph:', len(missing))
for f in missing:
    print('  ', f, line_count(f))
print('in graph but fully tree-shaken (0 bytes):', len(zero))
for f in zero:
    print('  ', f, line_count(f))
print('lines unreachable/dead:', sum(line_count(f) for f in missing + zero))
print('total ts/tsx lines in these packages:', sum(line_count(f) for f in allsrc))
