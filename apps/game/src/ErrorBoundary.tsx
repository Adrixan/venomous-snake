import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { i18n } from '@venomous-snake/i18n';

interface Props {
  children: ReactNode;
}

interface State {
  failed: boolean;
}

/** Replaces a blank page after a render crash with a way back into the game. */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Unhandled render error', error, info.componentStack);
  }

  override render(): ReactNode {
    if (!this.state.failed) return this.props.children;
    const t = (key: string): string => i18n.t(`ui:error_boundary.${key}`);
    return (
      <div role="alert" style={{ padding: '2rem', color: '#e0e0e0', background: '#0a0a0f' }}>
        <h1>{t('title')}</h1>
        <p>{t('message')}</p>
        <button
          type="button"
          onClick={() => {
            window.location.reload();
          }}
        >
          {t('reload')}
        </button>
      </div>
    );
  }
}
