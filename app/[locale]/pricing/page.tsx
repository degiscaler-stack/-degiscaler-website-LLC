import { setRequestLocale } from 'next-intl/server';
import PricingPageView from '@/components/pricing/PricingPageView';

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PricingPageView />;
}
