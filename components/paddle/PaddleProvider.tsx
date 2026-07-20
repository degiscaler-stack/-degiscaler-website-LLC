'use client';

import { useEffect } from 'react';
import { PADDLE_CLIENT_TOKEN } from '@/lib/paddle/config';

/**
 * Initializes Paddle Billing (v2) — production/live mode only.
 * Explicitly sets Paddle.Environment to production before initialization.
 *
 * After Paddle.Initialize() succeeds this component:
 *  - Sets window._paddleInitialized = true
 *  - Dispatches a 'paddle:ready' custom event
 *  - Bridges checkout.completed / checkout.error / checkout.failed / checkout.closed to window custom events
 *
 * Renders nothing — mount once inside the locale layout.
 */
export default function PaddleProvider() {
  useEffect(() => {
    let initialized = false;

    function init() {
      if (initialized) return;
      if (typeof window === 'undefined' || !window.Paddle) return;

      // Prevent duplicate Initialize() when provider mounts more than once
      if (window._paddleInitialized) {
        initialized = true;
        window.dispatchEvent(new CustomEvent('paddle:ready'));
        return;
      }

      initialized = true;

      try {
        window.Paddle.Environment.set('production');
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
              // Full error body logged for debugging in browser DevTools
              console.error(
                '[Paddle] checkout error — full data:',
                JSON.stringify(event.data, null, 2),
              );
              window.dispatchEvent(
                new CustomEvent('paddle:checkout:error', { detail: event.data }),
              );
            }

            if (event.name === 'checkout.failed') {
              window.dispatchEvent(
                new CustomEvent('paddle:checkout:failed', { detail: event.data }),
              );
            }

            if (event.name === 'checkout.closed') {
              window.dispatchEvent(
                new CustomEvent('paddle:checkout:closed', { detail: event.data }),
              );
            }
          },
        });

        // Mark Paddle as ready so checkout buttons know they can proceed
        window._paddleInitialized = true;
        window.dispatchEvent(new CustomEvent('paddle:ready'));
        console.log('[Paddle] Initialized — production/live mode');
      } catch (err) {
        console.error('[Paddle] Initialization failed:', err);
        initialized = false;
      }
    }

    // Script may already be present (loaded before React hydration)
    if (window.Paddle) {
      init();
      return;
    }

    // Poll until paddle.js injects window.Paddle (max 15 s, 80 ms intervals)
    const MAX_WAIT = 15_000;
    const TICK = 80;
    let elapsed = 0;

    const poll = setInterval(() => {
      elapsed += TICK;
      if (window.Paddle) {
        clearInterval(poll);
        init();
      } else if (elapsed >= MAX_WAIT) {
        clearInterval(poll);
        console.warn('[Paddle] Script did not load within 15 s — checkout disabled.');
      }
    }, TICK);

    return () => clearInterval(poll);
  }, []);

  return null;
}
