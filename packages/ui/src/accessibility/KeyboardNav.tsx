import { useEffect } from 'react';

export interface ArrowNavigationOptions {
  wrap?: boolean;
  orientation?: 'horizontal' | 'vertical' | 'both';
}

/**
 * Adds arrow-key navigation across a list of focusable elements.
 * Call this hook with a stable reference to the `items` array.
 */
export function useArrowNavigation(items: HTMLElement[], options?: ArrowNavigationOptions): void {
  const wrap = options?.wrap ?? true;
  const orientation = options?.orientation ?? 'vertical';

  useEffect(() => {
    if (items.length === 0) return undefined;

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = items.indexOf(document.activeElement as HTMLElement);
      if (currentIndex === -1) return;

      let delta = 0;

      if ((orientation === 'vertical' || orientation === 'both') && e.key === 'ArrowDown') {
        delta = 1;
      } else if ((orientation === 'vertical' || orientation === 'both') && e.key === 'ArrowUp') {
        delta = -1;
      } else if (
        (orientation === 'horizontal' || orientation === 'both') &&
        e.key === 'ArrowRight'
      ) {
        delta = 1;
      } else if (
        (orientation === 'horizontal' || orientation === 'both') &&
        e.key === 'ArrowLeft'
      ) {
        delta = -1;
      }

      if (delta === 0) return;
      e.preventDefault();

      let nextIndex = currentIndex + delta;
      if (nextIndex < 0) nextIndex = wrap ? items.length - 1 : 0;
      if (nextIndex >= items.length) nextIndex = wrap ? 0 : items.length - 1;

      items[nextIndex]?.focus();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, wrap, orientation]);
}
