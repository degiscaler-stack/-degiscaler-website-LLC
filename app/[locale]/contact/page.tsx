export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { setRequestLocale } from 'next-intl/server';
import ContactPageView from '@/components/contact/ContactPageView';

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  try {
    setRequestLocale(locale);
  } catch (err) {
    console.error('[ContactPage] setRequestLocale', err);
  }
  return <ContactPageView locale={locale} />;
}
