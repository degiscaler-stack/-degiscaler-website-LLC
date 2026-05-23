'use client';

import { useEffect } from 'react';
import { PADDLE_CLIENT_TOKEN } from '@/lib/paddle/config';

/**
 * Initializes Paddle Billing (v2) once the Paddle.js script has loaded.
 * Bridges internal Paddle events to window custom events so checkout buttons
 * can react without prop drilling.
 *
 * Renders nothing — mount once inside the locale layout.
 */
export default function PaddleProvider() {
  useEffect(() => {
    if (!PADDLE_CLIENT_TOKEN) {
      console.warn(
        '[Paddle] NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set. ' +
          'Add it to .env.local to enable checkout.',
      );
      return;
    }

    let initialized = false;

    function init() {
      if (initialized) return;
      if (typeof window === 'undefined' || !window.Paddle) return;
      initialized = true;

      try {
        window.Paddle.Initialize({
          token: PADDLE_CLIENT_TOKEN,
          eventCallback(event) {
            console.log('[Paddle] event:', event.name, event.data ?? '');

            if (event.name === 'checkout.completed') {
              console.log('[Paddle] Checkout completed — dispatching success event');
              window.dispatchEvent(
                new CustomEvent('paddle:checkout:completed', { detail: event.data }),
              );
            }

            if (event.name === 'checkout.error') {
              console.error('[Paddle] Checkout error:', event.data);
              window.dispatchEvent(
                new CustomEvent('paddle:checkout:error', { detail: event.data }),
              );
            }
          },
        });

        console.log('[Paddle] Initialized successfully (production)');
      } catch (err) {
        console.error('[Paddle] Initialization failed:', err);
      }
    }

    // Paddle might already be present (script loaded before React hydration)
    if (window.Paddle) {
      init();
      return;
    }

    // Poll until the script injects window.Paddle (max 12 s)
    const MAX_WAIT = 12_000;
    const INTERVAL = 120;
    let elapsed = 0;

    const poll = setInterval(() => {
      elapsed += INTERVAL;
      if (window.Paddle) {
        clearInterval(poll);
        init();
      } else if (elapsed >= MAX_WAIT) {
        clearInterval(poll);
        console.warn('[Paddle] Script did not load within 12 s.');
      }
    }, INTERVAL);

    return () => clearInterval(poll);
  }, []);

  return null;
}
