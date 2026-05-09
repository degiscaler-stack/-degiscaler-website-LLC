import { setRequestLocale } from 'next-intl/server';
import AboutPageView from '@/components/about/AboutPageView';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutPageView />;
}
