import DirectCheckoutProductPage from '@/app/checkout/DirectCheckoutProductPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function MomentumSuiteCheckoutPage() {
  return <DirectCheckoutProductPage product="momentum-suite" />;
}
