/**
 * Lightweight performance monitoring utility.
 * Tracks named marks, measures between them, FPS, load times, and interpreter init time.
 */
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private marks: Map<string, number> = new Map();
  private currentFPS = 0;

  // ── Marks & Measures ────────────────────────────────────────────────────────

  mark(label: string): void {
    this.marks.set(label, performance.now());
  }

  /**
   * Measures the duration between two previously recorded marks, records it
   * under `label`, and returns the duration in milliseconds.
   */
  measure(label: string, startMark: string, endMark: string): number {
    const start = this.marks.get(startMark);
    const end = this.marks.get(endMark);
    if (start === undefined || end === undefined) return 0;

    const duration = end - start;
    this.record(label, duration);
    return duration;
  }

  // ── FPS tracking ─────────────────────────────────────────────────────────────

  startFPSTracking(): void {
    let frameCount = 0;
    let lastTime = performance.now();

    const tick = (): void => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        this.currentFPS = frameCount;
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  getFPS(): number {
    return this.currentFPS;
  }

  // ── Specialised trackers ──────────────────────────────────────────────────────

  trackLoadTime(resource: string, timeMs: number): void {
    this.record(`load:${resource}`, timeMs);
  }

  trackInterpreterInit(timeMs: number): void {
    this.record('interpreter_init', timeMs);
  }

  // ── Report ────────────────────────────────────────────────────────────────────

  getReport(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const report: Record<string, { avg: number; min: number; max: number; count: number }> = {};

    for (const [label, values] of this.metrics.entries()) {
      if (values.length === 0) continue;
      const sum = values.reduce((a, b) => a + b, 0);
      report[label] = {
        avg: sum / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length,
      };
    }

    return report;
  }

  /** Prints a formatted report to the console (dev builds only). */
  logReport(): void {
    if (!import.meta.env.DEV) return;

    const report = this.getReport();
    if (Object.keys(report).length === 0) return;

    console.group('[PerformanceMonitor]');
    for (const [label, data] of Object.entries(report)) {
      console.log(
        `${label}: avg=${data.avg.toFixed(2)}ms  min=${data.min.toFixed(2)}ms  max=${data.max.toFixed(2)}ms  count=${data.count}`,
      );
    }
    console.groupEnd();
  }

  // ── Internal helpers ──────────────────────────────────────────────────────────

  private record(label: string, value: number): void {
    const existing = this.metrics.get(label) ?? [];
    existing.push(value);
    this.metrics.set(label, existing);
  }
}

export const perfMonitor = new PerformanceMonitor();
