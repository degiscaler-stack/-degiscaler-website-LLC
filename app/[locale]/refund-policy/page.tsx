import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import LegalPage from '@/components/LegalPage';

type Section = { title: string; content: string };

export default async function RefundPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RefundContent />;
}

function RefundContent() {
  const t = useTranslations('refundPage');
  const sections: Section[] = t.raw('sections') as Section[];

  return (
    <LegalPage
      headline={t('headline')}
      lastUpdated={t('lastUpdated')}
      intro={t('intro')}
      sections={sections}
    />
  );
}
