'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { ShoppingCart, Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useLocale } from 'next-intl';
import {
  primaryBtnClass,
  pricingCardSecondaryBtnClass,
} from '@/components/home/homeTheme';
import { toPaddleLocale } from '@/lib/paddle/config';

type CheckoutState = 'idle' | 'waiting' | 'loading' | 'success' | 'error';

interface Props {
  priceId: string;
  label: string;
  featuredVisual: boolean;
}

/**
 * Opens a Paddle Billing (v2) overlay checkout — production/live mode.
 *
 * States:
 *   idle    — normal buy button
 *   waiting — Paddle.js is still loading; retries automatically
 *   loading — spinner while overlay opens
 *   success — green tick after checkout.completed, then redirects to /thank-you
 *   error   — red inline message (auto-clears after 7 s)
 */
export default function PaddleCheckoutButton({ priceId, label, featuredVisual }: Props) {
  const [state, setState] = useState<CheckoutState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const locale = useLocale();
  const pendingCheckout = useRef(false); // track if user clicked while Paddle was loading

  // ── React to Paddle events ──────────────────────────────────────────────────
  useEffect(() => {
    function onSuccess() {
      setState('success');
      console.log('[PaddleCheckout] Payment completed — redirecting to /thank-you');
      setTimeout(() => {
        window.location.href = `/${locale}/thank-you`;
      }, 1600);
    }

    function onError(e: Event) {
      const detail = (e as CustomEvent<Record<string, unknown>>).detail;
      const msg =
        typeof detail?.message === 'string'
          ? detail.message
          : 'Payment failed. Please try again.';
      setState('error');
      setErrorMsg(msg);
      setTimeout(() => {
        setState('idle');
        setErrorMsg('');
      }, 7000);
    }

    // Once Paddle becomes ready, auto-open checkout if the user already clicked
    function onReady() {
      if (pendingCheckout.current) {
        pendingCheckout.current = false;
        openCheckout();
      }
    }

    window.addEventListener('paddle:checkout:completed', onSuccess);
    window.addEventListener('paddle:checkout:error', onError);
    window.addEventListener('paddle:ready', onReady);
    return () => {
      window.removeEventListener('paddle:checkout:completed', onSuccess);
      window.removeEventListener('paddle:checkout:error', onError);
      window.removeEventListener('paddle:ready', onReady);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  // ── Core checkout function ──────────────────────────────────────────────────
  function openCheckout() {
    if (!window.Paddle || !window._paddleInitialized) {
      // Paddle hasn't finished initializing — set waiting state and retry via paddle:ready
      setState('waiting');
      pendingCheckout.current = true;
      console.log('[PaddleCheckout] Paddle not ready yet — will open once initialized');
      return;
    }

    setState('loading');
    console.log('[PaddleCheckout] Opening overlay checkout', { priceId, locale });

    // Small frame delay so the loading spinner is visible before the overlay renders
    requestAnimationFrame(() => {
      try {
        window.Paddle!.Checkout.open({
          items: [{ priceId, quantity: 1 }],
          settings: {
            displayMode: 'overlay',
            theme: 'dark',
            locale: toPaddleLocale(locale),
            successUrl: `${window.location.origin}/${locale}/thank-you`,
          },
        });

        console.log('[PaddleCheckout] Overlay opened successfully');
        // Reset loading — the real success signal comes via paddle:checkout:completed
        setState('idle');
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to open checkout. Please try again.';
        console.error('[PaddleCheckout] Error:', err);
        setState('error');
        setErrorMsg(message);
        setTimeout(() => {
          setState('idle');
          setErrorMsg('');
        }, 7000);
      }
    });
  }

  // ── Click handler ───────────────────────────────────────────────────────────
  const handleClick = useCallback(() => {
    if (state === 'loading' || state === 'success' || state === 'waiting') return;
    openCheckout();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, priceId, locale]);

  // ── Render ──────────────────────────────────────────────────────────────────
  const baseBtnClass = featuredVisual ? primaryBtnClass : pricingCardSecondaryBtnClass;
  const layout =
    'flex items-center justify-center gap-2.5 w-full py-4 rounded-xl text-[15px] font-semibold transition-all duration-200';

  if (state === 'success') {
    return (
      <div
        className={layout}
        style={{
          color: '#4ade80',
          border: '1px solid rgba(74,222,128,0.28)',
          backgroundColor: 'rgba(74,222,128,0.06)',
        }}
        role="status"
        aria-live="polite"
      >
        <CheckCircle size={17} aria-hidden />
        <span>Payment successful!</span>
      </div>
    );
  }

  const isDisabled = state === 'loading' || state === 'waiting';

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        className={`${baseBtnClass} ${layout} ${isDisabled ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}
        aria-label={
          state === 'loading' ? 'Opening checkout…'
          : state === 'waiting' ? 'Checkout loading…'
          : label
        }
        aria-busy={isDisabled}
      >
        {state === 'loading' ? (
          <>
            <Loader2 size={15} className="animate-spin" aria-hidden />
            <span>Opening checkout…</span>
          </>
        ) : state === 'waiting' ? (
          <>
            <Clock size={15} className="animate-pulse" aria-hidden />
            <span>Checkout loading…</span>
          </>
        ) : (
          <>
            <ShoppingCart size={15} aria-hidden />
            <span>{label}</span>
          </>
        )}
      </button>

      {state === 'error' && (
        <div
          className="flex items-start gap-1.5 text-[12px] leading-snug"
          role="alert"
          aria-live="assertive"
          style={{ color: 'rgba(248,113,113,0.9)' }}
        >
          <AlertCircle size={13} className="mt-0.5 shrink-0" aria-hidden />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
