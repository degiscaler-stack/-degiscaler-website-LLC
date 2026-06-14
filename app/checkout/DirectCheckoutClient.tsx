'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type CheckoutStatus = 'opening' | 'open' | 'success' | 'error';

const PADDLE_READY_TIMEOUT_MS = 15_000;

function errorMessageFromDetail(detail: unknown): string {
  if (detail && typeof detail === 'object') {
    const maybe = detail as { message?: unknown; error?: unknown };
    if (typeof maybe.message === 'string') return maybe.message;
    if (typeof maybe.error === 'string') return maybe.error;
  }
  return 'Checkout could not be opened. Please try again.';
}

export default function DirectCheckoutClient({
  priceId,
  productName,
}: {
  priceId: string;
  productName: string;
}) {
  const [status, setStatus] = useState<CheckoutStatus>('opening');
  const [errorMessage, setErrorMessage] = useState('');
  const hasOpenedCheckout = useRef(false);

  const openCheckout = useCallback(() => {
    setStatus('opening');
    setErrorMessage('');

    if (!window.Paddle || !window._paddleInitialized) {
      return;
    }

    try {
      hasOpenedCheckout.current = true;
      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
      });
      setStatus('open');
    } catch (err) {
      hasOpenedCheckout.current = false;
      setStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Checkout could not be opened. Please try again.',
      );
    }
  }, [priceId]);

  const retryCheckout = useCallback(() => {
    hasOpenedCheckout.current = false;
    openCheckout();
  }, [openCheckout]);

  useEffect(() => {
    function handlePaddleReady() {
      if (!hasOpenedCheckout.current) {
        openCheckout();
      }
    }

    function handleCheckoutCompleted() {
      setStatus('success');
    }

    function handleCheckoutError(event: Event) {
      hasOpenedCheckout.current = false;
      setStatus('error');
      setErrorMessage(errorMessageFromDetail((event as CustomEvent).detail));
    }

    function handleCheckoutClosed() {
      hasOpenedCheckout.current = false;
      setStatus('error');
      setErrorMessage('Checkout was closed before payment was completed.');
    }

    window.addEventListener('paddle:ready', handlePaddleReady);
    window.addEventListener('paddle:checkout:completed', handleCheckoutCompleted);
    window.addEventListener('paddle:checkout:error', handleCheckoutError);
    window.addEventListener('paddle:checkout:closed', handleCheckoutClosed);

    openCheckout();

    const timeout = window.setTimeout(() => {
      if (!window._paddleInitialized && !hasOpenedCheckout.current) {
        setStatus('error');
        setErrorMessage('Secure checkout is still loading. Please try again.');
      }
    }, PADDLE_READY_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('paddle:ready', handlePaddleReady);
      window.removeEventListener('paddle:checkout:completed', handleCheckoutCompleted);
      window.removeEventListener('paddle:checkout:error', handleCheckoutError);
      window.removeEventListener('paddle:checkout:closed', handleCheckoutClosed);
    };
  }, [openCheckout]);

  return (
    <main className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-center shadow-2xl shadow-black/40">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#C3A15E]">
        DigiScaler checkout
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-white">{productName}</h1>

      <div className="mt-8" role="status" aria-live="polite">
        {status === 'success' ? (
          <p className="text-sm text-emerald-300">Payment completed successfully.</p>
        ) : (
          <p className="text-base font-medium text-[#F5F2E9]">Opening secure checkout...</p>
        )}
        {status === 'open' ? (
          <p className="mt-2 text-sm leading-6 text-white/65">
            Complete your payment in the secure Paddle checkout window.
          </p>
        ) : null}
      </div>

      {status === 'error' ? (
        <div className="mt-6 space-y-4" role="alert">
          <p className="text-sm leading-6 text-red-200">{errorMessage}</p>
          <button
            type="button"
            onClick={retryCheckout}
            className="w-full rounded-xl border border-[#C3A15E]/50 bg-[#C3A15E]/15 px-4 py-3 text-sm font-semibold text-[#F5DDA4] transition hover:bg-[#C3A15E]/25"
          >
            Retry secure checkout
          </button>
        </div>
      ) : null}
    </main>
  );
}
