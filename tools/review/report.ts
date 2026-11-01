import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPORT_DIR = fileURLToPath(new URL('../../.scratch/review/', import.meta.url));

/** Writes a report into the ignored `.scratch/review/` folder and returns its path. */
export function writeReport(name: string, content: string): string {
  const target = join(REPORT_DIR, name);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
  return target;
}
