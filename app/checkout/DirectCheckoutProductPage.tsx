import { notFound } from 'next/navigation';
import DirectCheckoutClient from '@/app/checkout/DirectCheckoutClient';
import {
  getDirectCheckoutPriceId,
  type DirectCheckoutSlug,
} from '@/lib/checkout/products';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function DirectCheckoutProductPage({
  product,
}: {
  product: DirectCheckoutSlug;
}) {
  const priceId = getDirectCheckoutPriceId(product);
  if (!priceId) {
    notFound();
  }

  return <DirectCheckoutClient priceId={priceId} />;
}
