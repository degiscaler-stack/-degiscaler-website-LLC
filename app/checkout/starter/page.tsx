import DirectCheckoutProductPage from '@/app/checkout/DirectCheckoutProductPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function StarterCheckoutPage() {
  return <DirectCheckoutProductPage product="starter" />;
}
