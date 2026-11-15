import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { i18nReady, warmInactiveLanguage } from '@venomous-snake/i18n';
import { App } from './App';
import { ErrorBoundary } from './ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

function render(root: HTMLElement): void {
  createRoot(root).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}

// A failed language load still renders: the game is playable, if with raw keys.
void i18nReady
  .catch(() => undefined)
  .finally(() => {
    render(rootElement);
    warmInactiveLanguage();
  });

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('./sw.js');
  });
}
