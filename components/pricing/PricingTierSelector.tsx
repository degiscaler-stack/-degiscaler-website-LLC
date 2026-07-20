'use client';

import {
  CUSTOMER_TIERS,
  CUSTOMER_TIER_LABELS,
  type CustomerTier,
} from '@/lib/pricing/customer-tiers';
import { accentEyebrowClass, ds } from '@/components/home/homeTheme';

type Props = {
  value: CustomerTier;
  onChange: (tier: CustomerTier) => void;
  label?: string;
};

/**
 * IPTV-style single-select tabs for customer tiers.
 * DigiScaler accent colors; one active tab at a time.
 */
export default function PricingTierSelector({
  value,
  onChange,
  label = 'Choose your plan type',
}: Props) {
  return (
    <div className="mx-auto mb-8 max-w-[720px] sm:mb-10">
      <p
        className={`mb-3 text-center text-[12px] font-bold uppercase tracking-[0.18em] sm:text-[13px] ${accentEyebrowClass}`}
      >
        {label}
      </p>
      <div
        role="tablist"
        aria-label={label}
        className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3"
      >
        {CUSTOMER_TIERS.map((tier) => {
          const selected = value === tier;
          return (
            <button
              key={tier}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="pricing-cards-panel"
              id={`pricing-tier-${tier}`}
              onClick={() => onChange(tier)}
              className={
                selected
                  ? 'pricing-tier-tab pricing-tier-tab--active flex min-h-[56px] items-center justify-center rounded-[14px] px-2 py-2.5 text-center transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(232,204,101,0.65)] sm:min-h-[64px]'
                  : 'pricing-tier-tab flex min-h-[56px] items-center justify-center rounded-[14px] px-2 py-2.5 text-center transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(232,204,101,0.65)] sm:min-h-[64px]'
              }
              style={
                selected
                  ? undefined
                  : {
                      border: '1px solid rgba(232,204,101,0.28)',
                      backgroundColor: 'rgba(10,11,14,0.92)',
                      color: ds.text,
                    }
              }
            >
              <span
                className={
                  selected
                    ? 'text-[13px] font-bold leading-tight tracking-tight text-[#0a0a0a] sm:text-[14px]'
                    : 'text-[13px] font-bold leading-tight tracking-tight sm:text-[14px]'
                }
                style={selected ? undefined : { color: ds.text }}
              >
                {CUSTOMER_TIER_LABELS[tier]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
