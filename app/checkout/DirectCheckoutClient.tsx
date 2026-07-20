'use client';

import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

const PADDLE_READY_TIMEOUT_MS = 15_000;

type CheckoutUiState = 'opening' | 'open' | 'retry';

export default function DirectCheckoutClient({
  children,
  priceId,
}: {
  children?: ReactNode;
  priceId: string;
}) {
  const hasOpenedCheckout = useRef(false);
  const [uiState, setUiState] = useState<CheckoutUiState>('opening');
  const [errorMessage, setErrorMessage] = useState('');

  const openCheckout = useCallback(() => {
    if (!window.Paddle || !window._paddleInitialized) {
      return false;
    }

    try {
      hasOpenedCheckout.current = true;
      setUiState('open');
      setErrorMessage('');
      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
      });
      return true;
    } catch (err) {
      console.error('[DirectCheckout] Checkout.open failed:', err);
      hasOpenedCheckout.current = false;
      setUiState('retry');
      setErrorMessage(
        err instanceof Error ? err.message : 'Checkout failed to open. Please try again.',
      );
      return false;
    }
  }, [priceId]);

  useEffect(() => {
    hasOpenedCheckout.current = false;
    setUiState('opening');
    setErrorMessage('');

    function handlePaddleReady() {
      if (!hasOpenedCheckout.current) {
        openCheckout();
      }
    }

    function handleCheckoutError(e: Event) {
      hasOpenedCheckout.current = false;
      const detail = (e as CustomEvent<Record<string, unknown>>).detail;
      const msg =
        typeof detail?.message === 'string'
          ? detail.message
          : 'Payment failed. Please try again.';
      setErrorMessage(msg);
      setUiState('retry');
    }

    function handleCheckoutClosed() {
      hasOpenedCheckout.current = false;
      setUiState('retry');
      setErrorMessage('Checkout was closed. Click below to try again.');
    }

    function handleCheckoutCompleted() {
      setUiState('open');
      setErrorMessage('');
      window.setTimeout(() => {
        window.location.href = '/thank-you';
      }, 1200);
    }

    window.addEventListener('paddle:ready', handlePaddleReady);
    window.addEventListener('paddle:checkout:error', handleCheckoutError);
    window.addEventListener('paddle:checkout:failed', handleCheckoutError);
    window.addEventListener('paddle:checkout:closed', handleCheckoutClosed);
    window.addEventListener('paddle:checkout:completed', handleCheckoutCompleted);

    openCheckout();

    const timeout = window.setTimeout(() => {
      if (!window._paddleInitialized && !hasOpenedCheckout.current) {
        setUiState('retry');
        setErrorMessage('Checkout is taking longer than expected. Please try again.');
      }
    }, PADDLE_READY_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('paddle:ready', handlePaddleReady);
      window.removeEventListener('paddle:checkout:error', handleCheckoutError);
      window.removeEventListener('paddle:checkout:failed', handleCheckoutError);
      window.removeEventListener('paddle:checkout:closed', handleCheckoutClosed);
      window.removeEventListener('paddle:checkout:completed', handleCheckoutCompleted);
    };
  }, [openCheckout]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {children}
      {uiState === 'opening' ? (
        <p className="text-[15px] text-[#B8B3A7]">Opening secure checkout…</p>
      ) : null}
      {uiState === 'retry' ? (
        <div className="mx-auto max-w-md space-y-4">
          <p className="text-[15px] leading-relaxed text-[#B8B3A7]">
            {errorMessage || 'Checkout did not complete. Please try again.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setUiState('opening');
              openCheckout();
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#ff8411_0%,#d6a700_48%,#e8cc65_100%)] px-8 py-3 text-[15px] font-semibold text-[#0a0a0a] transition hover:opacity-90"
          >
            Retry checkout
          </button>
        </div>
      ) : null}
    </div>
  );
}
