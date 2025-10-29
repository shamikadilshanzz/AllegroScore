'use client';

import { useEffect } from 'react';

export default function HideDevOverlay() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const hideOverlays = () => {
      const selectors = [
        'nextjs-toast',
        '[data-nextjs-toast]',
        '[data-nextjs-error-overlay]',
        '[data-nextjs-dialog-overlay]',
        '[data-turbopack-error-overlay]',
        '[class*="nextjs"]',
        '[id*="nextjs"]',
        '[class*="Issue"]',
        '[class*="issue"]',
        'turbo-issue-indicator',
        '.__next-error-overlay',
        '#__next-build-watcher',
      ];
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
      });
    };

    hideOverlays();
    const interval = setInterval(hideOverlays, 500);
    const observer = new MutationObserver(hideOverlays);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return null;
}
