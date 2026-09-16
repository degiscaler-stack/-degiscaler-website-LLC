import DirectCheckoutProductPage from '@/app/checkout/DirectCheckoutProductPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ApexCollectionCheckoutPage() {
  return <DirectCheckoutProductPage product="apex-collection" />;
}
