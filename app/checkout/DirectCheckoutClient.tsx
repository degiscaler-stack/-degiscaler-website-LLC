'use client';

import { useCallback, useEffect, useRef } from 'react';

const PADDLE_READY_TIMEOUT_MS = 15_000;
const PRICING_URL = '/en/pricing';
const CHECKOUT_ERROR_URL = `${PRICING_URL}?checkout=error`;

function redirectToPricing(path: string) {
  window.location.assign(path);
}

export default function DirectCheckoutClient({
  priceId,
}: {
  priceId: string;
}) {
  const hasOpenedCheckout = useRef(false);

  const openCheckout = useCallback(() => {
    if (!window.Paddle || !window._paddleInitialized) {
      return;
    }

    try {
      hasOpenedCheckout.current = true;
      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
      });
    } catch (err) {
      console.error('[DirectCheckout] Checkout.open failed:', err);
      hasOpenedCheckout.current = false;
      redirectToPricing(CHECKOUT_ERROR_URL);
    }
  }, [priceId]);

  useEffect(() => {
    function handlePaddleReady() {
      if (!hasOpenedCheckout.current) {
        openCheckout();
      }
    }

    function handleCheckoutError() {
      hasOpenedCheckout.current = false;
      redirectToPricing(CHECKOUT_ERROR_URL);
    }

    function handleCheckoutClosed() {
      hasOpenedCheckout.current = false;
      redirectToPricing(PRICING_URL);
    }

    window.addEventListener('paddle:ready', handlePaddleReady);
    window.addEventListener('paddle:checkout:error', handleCheckoutError);
    window.addEventListener('paddle:checkout:failed', handleCheckoutError);
    window.addEventListener('paddle:checkout:closed', handleCheckoutClosed);

    openCheckout();

    const timeout = window.setTimeout(() => {
      if (!window._paddleInitialized && !hasOpenedCheckout.current) {
        redirectToPricing(CHECKOUT_ERROR_URL);
      }
    }, PADDLE_READY_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('paddle:ready', handlePaddleReady);
      window.removeEventListener('paddle:checkout:error', handleCheckoutError);
      window.removeEventListener('paddle:checkout:failed', handleCheckoutError);
      window.removeEventListener('paddle:checkout:closed', handleCheckoutClosed);
    };
  }, [openCheckout]);

  return null;
}
