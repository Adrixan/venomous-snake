import { useState, useEffect, useCallback, useRef } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  prompt(): Promise<void>;
}

export interface UsePWAResult {
  isInstallable: boolean;
  isInstalled: boolean;
  isUpdateAvailable: boolean;
  install: () => Promise<void>;
  update: () => void;
}

export function usePWA(): UsePWAResult {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const waitingWorker = useRef<ServiceWorker | null>(null);

  useEffect(() => {
    // Detect standalone mode (already installed)
    const mq = window.matchMedia('(display-mode: standalone)');
    setIsInstalled(mq.matches);
    const handleDisplayChange = (e: MediaQueryListEvent) => setIsInstalled(e.matches);
    mq.addEventListener('change', handleDisplayChange);

    // Capture install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Detect when app is installed
    const handleAppInstalled = () => {
      deferredPrompt.current = null;
      setIsInstallable(false);
      setIsInstalled(true);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    // Detect SW updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                waitingWorker.current = newWorker;
                setIsUpdateAvailable(true);
              }
            });
          });
        })
        .catch(() => {
          // SW not available in this context
        });
    }

    return () => {
      mq.removeEventListener('change', handleDisplayChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt.current) return;
    await deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    if (outcome === 'accepted') {
      deferredPrompt.current = null;
      setIsInstallable(false);
    }
  }, []);

  const update = useCallback(() => {
    if (waitingWorker.current) {
      waitingWorker.current.postMessage('skipWaiting');
    }
    window.location.reload();
  }, []);

  return { isInstallable, isInstalled, isUpdateAvailable, install, update };
}
