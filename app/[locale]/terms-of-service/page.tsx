import { getTranslations, setRequestLocale } from 'next-intl/server';
import LegalPage from '@/components/LegalPage';

type Section = { title: string; content: string };

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('termsPage');
  const sections: Section[] = t.raw('sections') as Section[];

  return (
    <LegalPage
      eyebrow={t('eyebrow')}
      headline={t('headline')}
      lastUpdated={t('lastUpdated')}
      intro={t('intro')}
      sections={sections}
      disclaimer={t('legalDisclaimer')}
    />
  );
}
