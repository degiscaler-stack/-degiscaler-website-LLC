import { setRequestLocale } from 'next-intl/server';
import FaqPageAccordion from '@/components/faq/FaqPageAccordion';

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <FaqPageAccordion />;
}
