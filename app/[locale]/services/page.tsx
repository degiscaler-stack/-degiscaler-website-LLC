import { setRequestLocale } from 'next-intl/server';
import ServicesPageView from '@/components/services/ServicesPageView';

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicesPageView />;
}
