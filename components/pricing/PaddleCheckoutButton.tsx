'use client';

import { useState, useCallback, useEffect } from 'react';
import { ShoppingCart, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useLocale } from 'next-intl';
import {
  primaryBtnClass,
  pricingCardSecondaryBtnClass,
} from '@/components/home/homeTheme';
import { toPaddleLocale } from '@/lib/paddle/config';

type CheckoutState = 'idle' | 'loading' | 'success' | 'error';

interface Props {
  priceId: string;
  label: string;
  featuredVisual: boolean;
}

/**
 * Opens a Paddle Billing overlay checkout when clicked.
 *
 * States:
 *  idle    — normal buy button
 *  loading — spinner while Paddle overlay opens
 *  success — green tick after checkout.completed event (then redirect to /thank-you)
 *  error   — red message if Paddle is unavailable or throws
 */
export default function PaddleCheckoutButton({
  priceId,
  label,
  featuredVisual,
}: Props) {
  const [state, setState] = useState<CheckoutState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const locale = useLocale();

  // Listen for events dispatched by PaddleProvider
  useEffect(() => {
    function onSuccess() {
      setState('success');
      console.log('[PaddleCheckout] Payment completed — redirecting to thank-you');
      // Brief success flash before Paddle's successUrl redirect kicks in
      setTimeout(() => {
        window.location.href = `/${locale}/thank-you`;
      }, 1800);
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
      }, 6000);
    }

    window.addEventListener('paddle:checkout:completed', onSuccess);
    window.addEventListener('paddle:checkout:error', onError);
    return () => {
      window.removeEventListener('paddle:checkout:completed', onSuccess);
      window.removeEventListener('paddle:checkout:error', onError);
    };
  }, [locale]);

  const handleCheckout = useCallback(() => {
    if (state === 'loading' || state === 'success') return;

    setState('loading');
    setErrorMsg('');
    console.log('[PaddleCheckout] Opening overlay checkout', { priceId, locale });

    // Small timeout so the loading spinner renders before the overlay blocks
    setTimeout(() => {
      try {
        if (!window.Paddle) {
          throw new Error(
            'Paddle checkout is not ready yet. Please refresh the page and try again.',
          );
        }

        window.Paddle.Checkout.open({
          items: [{ priceId, quantity: 1 }],
          settings: {
            displayMode: 'overlay',
            theme: 'dark',
            locale: toPaddleLocale(locale),
            successUrl: `${window.location.origin}/${locale}/thank-you`,
          },
        });

        console.log('[PaddleCheckout] Overlay opened successfully');
        // Reset loading — success comes via the paddle:checkout:completed event
        setState('idle');
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Failed to open checkout. Please try again.';
        console.error('[PaddleCheckout] Error:', err);
        setState('error');
        setErrorMsg(message);
        setTimeout(() => {
          setState('idle');
          setErrorMsg('');
        }, 6000);
      }
    }, 60);
  }, [priceId, locale, state]);

  const baseBtnClass = featuredVisual ? primaryBtnClass : pricingCardSecondaryBtnClass;
  const commonLayout =
    'flex items-center justify-center gap-2.5 w-full py-4 rounded-xl text-[15px] font-semibold transition-all duration-200';

  if (state === 'success') {
    return (
      <div
        className={`${commonLayout} animate-in fade-in duration-300`}
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

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={state === 'loading'}
        className={`${baseBtnClass} ${commonLayout} ${
          state === 'loading' ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
        }`}
        aria-label={state === 'loading' ? 'Opening checkout…' : label}
        aria-busy={state === 'loading'}
      >
        {state === 'loading' ? (
          <>
            <Loader2 size={15} className="animate-spin" aria-hidden />
            <span>Opening checkout…</span>
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
          className="flex items-start gap-1.5 text-[12px] leading-snug animate-in fade-in duration-200"
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
