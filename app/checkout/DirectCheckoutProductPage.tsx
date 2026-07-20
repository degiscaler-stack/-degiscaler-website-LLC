import { notFound } from 'next/navigation';
import DirectCheckoutClient from '@/app/checkout/DirectCheckoutClient';
import {
  getDirectCheckoutPriceId,
  type DirectCheckoutProduct,
  type DirectCheckoutTier,
} from '@/lib/checkout/products';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function DirectCheckoutProductPage({
  product,
  tier = 'personal',
}: {
  product: DirectCheckoutProduct | 'trial';
  tier?: DirectCheckoutTier;
}) {
  const priceId = getDirectCheckoutPriceId(product, tier);
  if (!priceId) {
    notFound();
  }

  return <DirectCheckoutClient priceId={priceId} />;
}
