import { notFound } from 'next/navigation';
import DirectCheckoutClient from '@/app/checkout/DirectCheckoutClient';
import { getPaddlePriceId } from '@/lib/paddle/config';

const DIRECT_CHECKOUT_PRODUCTS = {
  starter: {
    packageSlug: 'starter-website-kit',
  },
  growth: {
    packageSlug: 'growth-optimization-kit',
  },
  pro: {
    packageSlug: 'pro-conversion-toolkit',
  },
  scale: {
    packageSlug: 'scale-business-bundle',
  },
} as const;

export function generateStaticParams() {
  return Object.keys(DIRECT_CHECKOUT_PRODUCTS).map((product) => ({ product }));
}

export default async function DirectCheckoutPage({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const { product } = await params;
  const checkoutProduct =
    DIRECT_CHECKOUT_PRODUCTS[product as keyof typeof DIRECT_CHECKOUT_PRODUCTS];

  if (!checkoutProduct) {
    notFound();
  }

  const priceId = getPaddlePriceId(checkoutProduct.packageSlug);
  if (!priceId) {
    notFound();
  }

  return <DirectCheckoutClient priceId={priceId} />;
}
