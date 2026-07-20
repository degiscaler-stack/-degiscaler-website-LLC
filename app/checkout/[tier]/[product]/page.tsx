import { notFound, redirect } from 'next/navigation';
import DirectCheckoutProductPage from '@/app/checkout/DirectCheckoutProductPage';
import {
  isDirectCheckoutProduct,
  isDirectCheckoutTier,
} from '@/lib/checkout/products';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PageProps = {
  params: Promise<{ tier: string; product: string }>;
};

/**
 * Tiered direct checkout: /checkout/{freelancer|agency|enterprise}/{starter|growth|pro|scale}
 * Personal short links remain at /checkout/{product}.
 */
export default async function TieredCheckoutPage({ params }: PageProps) {
  const { tier: rawTier, product: rawProduct } = await params;
  const tier = rawTier.trim().toLowerCase();
  const product = rawProduct.trim().toLowerCase();

  if (!isDirectCheckoutProduct(product)) {
    notFound();
  }

  if (tier === 'personal') {
    redirect(`/checkout/${product}`);
  }

  if (!isDirectCheckoutTier(tier)) {
    notFound();
  }

  return <DirectCheckoutProductPage product={product} tier={tier} />;
}
