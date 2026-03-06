import React from 'react';
import { useBreakpoint } from './useBreakpoint';

interface ResponsiveLayoutProps {
  /** Rendered on all breakpoints, styled per layout */
  children: React.ReactNode;
  /** Optional override class for the root wrapper */
  className?: string;
}

const mobileStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
};

const tabletStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
};

const desktopStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '240px 1fr 240px',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
};

/**
 * Wraps children with responsive container styles.
 * - mobile  (<640px)   : vertical stack
 * - tablet  (640-1024) : horizontal sidebar layout
 * - desktop (>1024px)  : full multi-panel grid
 */
export function ResponsiveLayout({
  children,
  className,
}: ResponsiveLayoutProps): React.JSX.Element {
  const bp = useBreakpoint();

  const layoutStyle = bp === 'mobile' ? mobileStyle : bp === 'tablet' ? tabletStyle : desktopStyle;

  return (
    <div style={layoutStyle} className={className} data-breakpoint={bp}>
      {children}
    </div>
  );
}
