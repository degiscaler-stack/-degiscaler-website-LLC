import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import PricingPageView from '@/components/pricing/PricingPageView';
import { loadDisplayPackages, applyTranslatedPackageCopy } from '@/lib/packages/public-packages';

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'pricingPage' });
  const fallbackPackages = t.raw('packages') as Array<{
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
  }>;
  const packages = applyTranslatedPackageCopy(await loadDisplayPackages(fallbackPackages), fallbackPackages);
  return <PricingPageView packages={packages} locale={locale} />;
}
