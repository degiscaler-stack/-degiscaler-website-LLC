import { Link } from '@/i18n/navigation';
import {
  ds,
  primaryBtnClass,
  pricingCardSecondaryBtnClass,
} from '@/components/home/homeTheme';
import PaddleCheckoutButton from '@/components/pricing/PaddleCheckoutButton';

type Props = {
  checkoutHref: string;
  checkoutLabel: string;
  complianceLines: string[];
  featuredVisual: boolean;
  /** Paddle Billing price ID. When provided, renders the Paddle overlay button. */
  priceId?: string;
};

export default function PackageCardFooter({
  checkoutHref,
  checkoutLabel,
  complianceLines,
  featuredVisual,
  priceId,
}: Props) {
  return (
    <div className="mt-auto space-y-4">
      <ul className="space-y-1.5">
        {complianceLines.map((line) => (
          <li
            key={line}
            className="text-[12px] md:text-[12.5px] leading-snug pl-3 border-s-2"
            style={{ borderColor: 'rgba(232,204,101,0.35)', color: ds.textMuted }}
          >
            {line}
          </li>
        ))}
      </ul>

      {priceId ? (
        <PaddleCheckoutButton
          priceId={priceId}
          label={checkoutLabel}
          featuredVisual={featuredVisual}
        />
      ) : (
        <Link
          href={checkoutHref}
          className={`${
            featuredVisual ? primaryBtnClass : pricingCardSecondaryBtnClass
          } block w-full text-center py-4 rounded-xl text-[15px] font-semibold`}
        >
          {checkoutLabel}
        </Link>
      )}
    </div>
  );
}
