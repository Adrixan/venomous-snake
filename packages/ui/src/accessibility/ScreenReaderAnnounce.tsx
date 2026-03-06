import { useEffect, useRef, useCallback } from 'react';

type AnnouncePriority = 'polite' | 'assertive';

/**
 * Returns an `announce` function that sends a message to screen readers via
 * an ARIA live region. The region is injected into `document.body` on mount
 * and removed on unmount.
 */
export function useAnnounce(): (message: string, priority?: AnnouncePriority) => void {
  const politeRef = useRef<HTMLDivElement | null>(null);
  const assertiveRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const makeRegion = (live: AnnouncePriority): HTMLDivElement => {
      const el = document.createElement('div');
      el.setAttribute('aria-live', live);
      el.setAttribute('aria-atomic', 'true');
      el.setAttribute('aria-relevant', 'additions text');
      el.style.cssText =
        'position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
      document.body.appendChild(el);
      return el;
    };

    const polite = makeRegion('polite');
    const assertive = makeRegion('assertive');
    politeRef.current = polite;
    assertiveRef.current = assertive;

    return () => {
      document.body.removeChild(polite);
      document.body.removeChild(assertive);
    };
  }, []);

  return useCallback((message: string, priority: AnnouncePriority = 'polite') => {
    const el = priority === 'assertive' ? assertiveRef.current : politeRef.current;
    if (el === null) return;

    // Clear then set — ensures screen readers re-announce identical messages
    el.textContent = '';
    setTimeout(() => {
      el.textContent = message;
    }, 50);
  }, []);
}
