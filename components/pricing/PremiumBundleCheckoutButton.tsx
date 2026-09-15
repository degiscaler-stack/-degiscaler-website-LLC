'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import PaddleCheckoutButton from '@/components/pricing/PaddleCheckoutButton';
import {
  primaryBtnClass,
  pricingCardSecondaryBtnClass,
} from '@/components/home/homeTheme';
import { isConfiguredPaddlePriceId } from '@/lib/paddle/config';

type Props = {
  priceId: string;
  label: string;
  featuredVisual: boolean;
};

/**
 * Bundle CTAs: live `pri_…` IDs open the existing Paddle overlay.
 * Placeholders never call Paddle (avoids charging an existing kit price).
 */
export default function PremiumBundleCheckoutButton({
  priceId,
  label,
  featuredVisual,
}: Props) {
  const [notice, setNotice] = useState(false);

  if (isConfiguredPaddlePriceId(priceId)) {
    return (
      <PaddleCheckoutButton
        priceId={priceId.trim()}
        label={label}
        featuredVisual={featuredVisual}
      />
    );
  }

  const baseBtnClass = featuredVisual ? primaryBtnClass : pricingCardSecondaryBtnClass;
  const layout =
    'flex items-center justify-center gap-2.5 w-full py-4 rounded-xl text-[15px] font-semibold transition-all duration-200';

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setNotice(true)}
        className={`${baseBtnClass} ${layout} cursor-pointer`}
        aria-label={label}
      >
        <ShoppingCart size={15} aria-hidden />
        <span>{label}</span>
      </button>
      {notice ? (
        <p className="text-[12px] leading-snug" style={{ color: 'rgba(248,113,113,0.9)' }} role="status">
          Secure checkout for this bundle will open once its Paddle Price ID is connected.
        </p>
      ) : null}
    </div>
  );
}
